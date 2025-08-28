
'use server';

import type { Article, Author, Poll, MemeNews, User } from './types';
import { DynamoDBClient, DeleteItemCommand } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand, GetCommand, PutCommand, ScanCommand, UpdateCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";
import { mockDb } from './data';
import { summarizeArticle } from '@/ai/flows/summarize-article';
import { sendMail } from './mailer';

const useMockData = !process.env.AWS_REGION || 
                    process.env.AWS_REGION === 'your_aws_region' ||
                    !process.env.AWS_ACCESS_KEY_ID ||
                    process.env.AWS_ACCESS_KEY_ID === 'your_access_key' ||
                    !process.env.AWS_SECRET_ACCESS_KEY ||
                    process.env.AWS_SECRET_ACCESS_KEY === 'your_secret_key';

let docClient: DynamoDBDocumentClient;
const newsTableName = process.env.DYNAMODB_TABLE_NAME || 'BartaNow_News';
const usersTableName = 'BartaNow_Users';

if (!useMockData) {
    const client = new DynamoDBClient({ 
        region: process.env.AWS_REGION,
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
        }
    });
    docClient = DynamoDBDocumentClient.from(client);
}

// Helper to generate a slug from a title
const generateSlug = (title: string) => {
    return title
        .toLowerCase()
        .replace(/\s+/g, '-') // Replace spaces with -
        .replace(/[^\p{L}\p{N}-]/gu, '') // Remove all non-alphanumeric characters except dashes
        .replace(/--+/g, '-') // Replace multiple - with single -
        .replace(/^-+/, '') // Trim - from start of text
        .replace(/-+$/, ''); // Trim - from end of text
};

async function generateSummariesForMockData() {
    if (mockDb.articles.every(a => a.aiSummary)) {
        return;
    }
    // This is a slow operation, so let's not wait for it in a real scenario
    // It should be a background job. For the demo, we do it on first load.
    const summaryPromises = mockDb.articles.map(async (article) => {
        if (!article.aiSummary) {
            try {
                const { summary } = await summarizeArticle({ articleContent: article.content.join('\n\n') });
                article.aiSummary = summary;
            } catch (e) {
                console.error(`Could not generate summary for article ${article.id}`, e);
                article.aiSummary = article.content[0].substring(0, 150) + '...'; // Fallback
            }
        }
    });
    await Promise.all(summaryPromises);
}

type GetArticlesOptions = {
    page?: number;
    limit?: number;
    category?: Article['category'];
    authorId?: string;
    excludeId?: string;
    query?: string;
    hasVideo?: boolean;
    editorsPick?: boolean;
    date?: string;
    location?: string;
};

async function getMockArticles({ page = 1, limit = 6, category, authorId, excludeId, query, hasVideo, editorsPick, date, location }: GetArticlesOptions) {
    await generateSummariesForMockData();
    
    let filteredArticles = [...mockDb.articles];

    if (category) {
        filteredArticles = filteredArticles.filter(article => article.category === category);
    }
    
    if (authorId) {
        filteredArticles = filteredArticles.filter(article => article.authorId === authorId);
    }

    if (excludeId) {
        filteredArticles = filteredArticles.filter(article => article.id !== excludeId);
    }

    if (query) {
        const lowercasedQuery = query.toLowerCase();
        filteredArticles = filteredArticles.filter(article => 
            article.title.toLowerCase().includes(lowercasedQuery) ||
            article.content.join(' ').toLowerCase().includes(lowercasedQuery) ||
            article.category.toLowerCase().includes(lowercasedQuery)
        );
    }

    if (hasVideo) {
        filteredArticles = filteredArticles.filter(article => !!article.videoUrl);
    }

    if (editorsPick) {
        filteredArticles = filteredArticles.filter(article => article.editorsPick);
    }

    if (date) {
        filteredArticles = filteredArticles.filter(article => article.publishedAt.startsWith(date));
    }
    
    if (location) {
        filteredArticles = filteredArticles.filter(article => article.location === location);
    }


    const sortedArticles = filteredArticles.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    
    const totalPages = Math.ceil(sortedArticles.length / limit);
    const offset = (page - 1) * limit;
    const paginatedArticles = sortedArticles.slice(offset, offset + limit);

    return { articles: paginatedArticles, totalPages };
}

export async function getArticles({ page = 1, limit = 6, category, authorId, excludeId, query, hasVideo, editorsPick, date, location }: GetArticlesOptions): Promise<{ articles: Article[], totalPages: number }> {
    if (useMockData) {
        return getMockArticles({ page, limit, category, authorId, excludeId, query, hasVideo, editorsPick, date, location });
    }
    
    // DynamoDB implementation for production
    try {
        if (query || location) {
            // Full-text search and location filtering with DynamoDB is complex and usually requires integration
            // with services like OpenSearch (fka Elasticsearch).
            // For this starter, we will fall back to mock data for these queries.
            console.warn("DynamoDB search or location query detected. Falling back to mock data for this query.");
            return getMockArticles({ page, limit, category, excludeId, query, hasVideo, editorsPick, date, location });
        }

        // A full implementation would require another query to get the total count
        // for simplicity, we'll estimate total pages, but this is not robust for production.
        // A better approach is to store the total count separately or accept an approximation.
        const DUMMY_TOTAL_ARTICLES = 100; // Placeholder
        const totalPages = Math.ceil(DUMMY_TOTAL_ARTICLES / limit);

        // DynamoDB pagination is complex. A real implementation would store and pass
        // the `LastEvaluatedKey` between page loads. For this starter, we'll
        // simulate basic pagination by repeating the query and relying on client-side page numbers,
        // which is not efficient for deep pagination.
        
        // This implementation does not support category or author filtering for DynamoDB yet.
        // That would require a GSI on the `category` or `authorId` attribute.
        
        let allItems: Article[] = [];
        let lastEvaluatedKey: Record<string, any> | undefined = undefined;

        // This loop is for demonstration. For a real app, you would fetch only up to the requested page.
        for (let i = 0; i < page; i++) {
            const command = new QueryCommand({
                TableName: newsTableName,
                IndexName: 'PublishedAtIndex',
                KeyConditionExpression: 'entityType = :entityType',
                ExpressionAttributeValues: {
                    ':entityType': 'ARTICLE',
                },
                ScanIndexForward: false, // Sort descending by publishedAt
                Limit: limit,
                ExclusiveStartKey: lastEvaluatedKey,
            });

            const { Items, LastEvaluatedKey } = await docClient.send(command);
            if (Items) {
                allItems = Items as Article[]; // For the current page
            }
            lastEvaluatedKey = LastEvaluatedKey;
            if (!LastEvaluatedKey) {
                break; 
            }
        }
        
        if (excludeId) {
             allItems = allItems.filter(item => item.id !== excludeId);
        }

        return { articles: allItems, totalPages };
    } catch (error) {
        console.error("Error fetching articles from DynamoDB:", error);
        // Fallback to mock data in case of any runtime error with DynamoDB
        console.log("Falling back to mock data.");
        return getMockArticles({ page, limit, category, excludeId, hasVideo, editorsPick, date, location });
    }
}

async function getMockArticleById(id: string) {
    await generateSummariesForMockData();
    return mockDb.articles.find((article) => article.id === id);
}

export async function getArticleById(id: string): Promise<Article | undefined> {
    if (useMockData) {
        return getMockArticleById(id);
    }

    const command = new GetCommand({
        TableName: newsTableName,
        Key: {
          id: id,
        },
    });

    try {
        const { Item } = await docClient.send(command);
        return Item as Article | undefined;
    } catch(error) {
        console.error(`Error fetching article ${id} from DynamoDB:`, error);
        // Fallback to mock data in case of a runtime error with DynamoDB
        console.log(`Falling back to mock data for article ${id}.`);
        return getMockArticleById(id);
    }
}

export async function getArticleBySlug(slug: string): Promise<Article | undefined> {
    // In a real app, you would have a GSI on the slug for efficient lookups.
    // Since this starter doesn't have one, we'll use the mock data approach for all environments
    // to avoid a costly and slow Scan operation on the live DynamoDB table.
    await generateSummariesForMockData();
    const article = mockDb.articles.find((article) => article.slug === slug);
    if (article) {
        return article;
    }
    // If not found, it might be a newly created article that is not in the initial mockDb import.
    // This is a workaround for the mock data setup.
    const { articles: allArticles } = await getArticles({ limit: 1000 }); // fetch all
    return allArticles.find((a) => a.slug === slug);
}

async function getMockUserById(id: string): Promise<User | undefined> {
    return mockDb.users.find((user) => user.id === id);
}

export async function getUserById(id: string): Promise<User | undefined> {
    if (useMockData) {
        return getMockUserById(id);
    }

    const command = new GetCommand({
        TableName: usersTableName,
        Key: { id: id },
    });

    try {
        const { Item } = await docClient.send(command);
        return Item as User | undefined;
    } catch (error) {
        console.error(`Error fetching user by id ${id} from DynamoDB:`, error);
        console.log(`Falling back to mock data for user with id ${id}.`);
        return getMockUserById(id);
    }
}

async function getMockUserByEmail(email: string): Promise<User | undefined> {
    return mockDb.users.find((user) => user.email === email);
}

export async function getUserByEmail(email: string): Promise<User | undefined> {
    if (useMockData) {
        return getMockUserByEmail(email);
    }

    const command = new QueryCommand({
        TableName: usersTableName,
        IndexName: 'EmailIndex',
        KeyConditionExpression: 'email = :email',
        ExpressionAttributeValues: {
            ':email': email,
        },
    });

    try {
        const { Items } = await docClient.send(command);
        if (Items && Items.length > 0) {
            return Items[0] as User;
        }
        return undefined;
    } catch (error) {
        console.error(`Error fetching user by email ${email} from DynamoDB:`, error);
        console.log(`Falling back to mock data for user with email ${email}.`);
        return getMockUserByEmail(email);
    }
}

async function getMockAllUsers(): Promise<User[]> {
    return [...mockDb.users];
}

export async function getAllUsers(): Promise<User[]> {
    if (useMockData) {
        return getMockAllUsers();
    }

    try {
        const command = new ScanCommand({
            TableName: usersTableName,
        });
        const { Items } = await docClient.send(command);
        return (Items || []) as User[];
    } catch (error) {
        console.error("Error fetching all users from DynamoDB:", error);
        console.log("Falling back to mock data for getAllUsers.");
        return getMockAllUsers();
    }
}


export async function getAuthorById(id: string): Promise<Author | undefined> {
    if (useMockData) {
        return mockDb.authors.find((author) => author.id === id);
    }
    // In a real DynamoDB setup, you'd likely have a separate 'AUTHOR' entityType
    // and query it. This is a simplified example.
    const command = new GetCommand({
        TableName: newsTableName,
        Key: { id: id },
    });
     try {
        const { Item } = await docClient.send(command);
        // This assumes author data is stored with a different structure.
        // For this starter, we fall back to mock data for authors.
        return mockDb.authors.find((author) => author.id === id);
    } catch(error) {
        console.error(`Error fetching author ${id} from DynamoDB:`, error);
        return mockDb.authors.find((author) => author.id === id);
    }
}


export async function getAllAuthors(): Promise<Author[]> {
    if (useMockData) {
        return [...mockDb.authors];
    }

    // This is a placeholder. In a real app, you would query DynamoDB
    // for all items with entityType = 'AUTHOR'.
    try {
        const command = new QueryCommand({
            TableName: newsTableName,
            IndexName: 'PublishedAtIndex', // This index might not be ideal for authors, but we reuse it for simplicity
            KeyConditionExpression: 'entityType = :entityType',
            ExpressionAttributeValues: { ':entityType': 'AUTHOR' },
        });
        const { Items } = await docClient.send(command);
        return (Items || []) as Author[];
    } catch (error) {
        console.error("Error fetching all authors from DynamoDB:", error);
        console.log("Falling back to mock data for getAllAuthors.");
        return [...mockDb.authors];
    }
}

export async function getPolls(): Promise<Poll[]> {
  // In a real app, this would fetch from a database.
  return mockDb.polls;
}

export async function getPollById(id: string): Promise<Poll | undefined> {
  // In a real app, this would fetch from a database.
  return mockDb.polls.find(poll => poll.id === id);
}

export async function getMemeNews(): Promise<MemeNews[]> {
  return mockDb.memeNews;
}

export async function createUser(user: Omit<User, 'id' | 'role'>): Promise<User> {
    const newUser: User = {
        id: `user-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        role: 'user',
        ...user
    };

    if (useMockData) {
        mockDb.users.push(newUser);
    } else {
        const command = new PutCommand({
            TableName: usersTableName,
            Item: newUser,
            ConditionExpression: 'attribute_not_exists(email)', // Ensure email is unique
        });

        try {
            await docClient.send(command);
        } catch (error) {
            console.error(`Error creating user in DynamoDB:`, error);
            // The ConditionExpression will throw an error if the email exists.
            // We could handle that specific error code for a better message.
            throw new Error('Failed to create user in the database.');
        }
    }
    
    if (process.env.ADMIN_EMAIL) {
        try {
            await sendMail({
                to: process.env.ADMIN_EMAIL,
                subject: 'New User Registration on BartaNow',
                html: `
                    <h1>A new user has registered on BartaNow!</h1>
                    <p><strong>Name:</strong> ${newUser.name}</p>
                    <p><strong>Email:</strong> ${newUser.email}</p>
                `
            });
            console.log('Admin notification email sent successfully.');
        } catch (mailError) {
            console.error('Failed to send admin notification email:', mailError);
            // We don't throw an error here because the user creation was successful.
            // This is a non-critical failure.
        }
    }

    return newUser;
}

export async function updateUser(userId: string, data: Partial<User>): Promise<User | undefined> {
    if (useMockData) {
        const userIndex = mockDb.users.findIndex(u => u.id === userId);
        if (userIndex === -1) return undefined;
        
        const updatedUser = { ...mockDb.users[userIndex], ...data };
        mockDb.users[userIndex] = updatedUser;
        return updatedUser;
    }

    // DynamoDB Implementation
    const updateExpressionParts: string[] = [];
    const expressionAttributeValues: { [key: string]: any } = {};
    const expressionAttributeNames: { [key: string]: string } = {};

    // Dynamically build the update expression
    for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key) && key !== 'id' && key !== 'email') {
            const attrKey = `#${key}`;
            const valueKey = `:${key}`;
            updateExpressionParts.push(`${attrKey} = ${valueKey}`);
            expressionAttributeNames[attrKey] = key;
            expressionAttributeValues[valueKey] = (data as any)[key];
        }
    }
    
    if (updateExpressionParts.length === 0) {
        // Nothing to update, just return the current user data
        const command = new GetCommand({ TableName: usersTableName, Key: { id: userId } });
        const { Item } = await docClient.send(command);
        return Item as User | undefined;
    }

    const command = new UpdateCommand({
        TableName: usersTableName,
        Key: { id: userId },
        UpdateExpression: `SET ${updateExpressionParts.join(', ')}`,
        ExpressionAttributeValues: expressionAttributeValues,
        ExpressionAttributeNames: expressionAttributeNames,
        ReturnValues: 'ALL_NEW',
    });

    try {
        const { Attributes } = await docClient.send(command);
        return Attributes as User | undefined;
    } catch (error) {
        console.error(`Error updating user ${userId} in DynamoDB:`, error);
        throw new Error('Failed to update user in the database.');
    }
}

export async function updateArticle(articleId: string, data: Partial<Article>): Promise<Article | undefined> {
    
    if (data.title && !data.slug) {
        data.slug = generateSlug(data.title);
    }
    
    if (useMockData) {
        const articleIndex = mockDb.articles.findIndex(a => a.id === articleId);
        if (articleIndex === -1) return undefined;
        
        const updatedArticle = { ...mockDb.articles[articleIndex], ...data };
        mockDb.articles[articleIndex] = updatedArticle;
        return updatedArticle;
    }
    
    // DynamoDB Implementation
    const updateExpressionParts: string[] = [];
    const expressionAttributeValues: { [key: string]: any } = {};
    const expressionAttributeNames: { [key: string]: string } = {};

    for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key) && key !== 'id') {
            const attrKey = `#${key}`;
            const valueKey = `:${key}`;
            updateExpressionParts.push(`${attrKey} = ${valueKey}`);
            expressionAttributeNames[attrKey] = key;
            expressionAttributeValues[valueKey] = (data as any)[key];
        }
    }
    
    if (updateExpressionParts.length === 0) {
        const command = new GetCommand({ TableName: newsTableName, Key: { id: articleId } });
        const { Item } = await docClient.send(command);
        return Item as Article | undefined;
    }

    const command = new UpdateCommand({
        TableName: newsTableName,
        Key: { id: articleId },
        UpdateExpression: `SET ${updateExpressionParts.join(', ')}`,
        ExpressionAttributeValues: expressionAttributeValues,
        ExpressionAttributeNames: expressionAttributeNames,
        ReturnValues: 'ALL_NEW',
    });

    try {
        const { Attributes } = await docClient.send(command);
        return Attributes as Article | undefined;
    } catch (error) {
        console.error(`Error updating article ${articleId} in DynamoDB:`, error);
        throw new Error('Failed to update article in the database.');
    }
}

export async function createArticle(data: Omit<Article, 'id' | 'publishedAt' | 'aiSummary'>): Promise<Article> {
    const newArticle: Article = {
        id: `article-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        publishedAt: new Date().toISOString(),
        slug: generateSlug(data.title),
        aiSummary: data.content.join('\n\n').substring(0, 150) + '...', // Basic summary
        ...data,
        entityType: 'ARTICLE',
    };

    // Generate a better summary in the background
    summarizeArticle({ articleContent: data.content.join('\n\n') })
        .then(({ summary }) => {
            newArticle.aiSummary = summary;
            // Update the article in the DB with the new summary
            if (useMockData) {
                const articleIndex = mockDb.articles.findIndex(a => a.id === newArticle.id);
                if (articleIndex !== -1) {
                    mockDb.articles[articleIndex].aiSummary = summary;
                }
            } else {
                updateArticle(newArticle.id, { aiSummary: summary });
            }
        })
        .catch(e => console.error(`Could not generate summary for new article ${newArticle.id}`, e));

    if (useMockData) {
        mockDb.articles.unshift(newArticle); // Add to the beginning of the array
    } else {
        const command = new PutCommand({
            TableName: newsTableName,
            Item: newArticle,
        });

        try {
            await docClient.send(command);
        } catch (error) {
            console.error(`Error creating article in DynamoDB:`, error);
            throw new Error('Failed to create article in the database.');
        }
    }

    return newArticle;
}

export async function deleteArticle(articleId: string): Promise<void> {
    if (useMockData) {
        const index = mockDb.articles.findIndex(a => a.id === articleId);
        if (index > -1) {
            mockDb.articles.splice(index, 1);
        }
        return;
    }

    const command = new DeleteCommand({
        TableName: newsTableName,
        Key: { id: articleId },
    });

    try {
        await docClient.send(command);
    } catch (error) {
        console.error(`Error deleting article ${articleId} from DynamoDB:`, error);
        throw new Error('Failed to delete article from the database.');
    }
}

export async function deleteUser(userId: string): Promise<void> {
    if (useMockData) {
        const index = mockDb.users.findIndex(u => u.id === userId);
        if (index > -1) {
            mockDb.users.splice(index, 1);
        }
        return;
    }

    const command = new DeleteCommand({
        TableName: usersTableName,
        Key: { id: userId },
    });

    try {
        await docClient.send(command);
    } catch (error) {
        console.error(`Error deleting user ${userId} from DynamoDB:`, error);
        throw new Error('Failed to delete user from the database.');
    }
}
