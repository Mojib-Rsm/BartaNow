
'use server';

import type { Article, Author, Poll, MemeNews } from './types';
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand, GetCommand } from "@aws-sdk/lib-dynamodb";
import { mockDb } from './data';
import { summarizeArticle } from '@/ai/flows/summarize-article';

const useMockData = !process.env.AWS_REGION || 
                    process.env.AWS_REGION === 'your_aws_region' ||
                    !process.env.AWS_ACCESS_KEY_ID ||
                    process.env.AWS_ACCESS_KEY_ID === 'your_access_key' ||
                    !process.env.AWS_SECRET_ACCESS_KEY ||
                    process.env.AWS_SECRET_ACCESS_KEY === 'your_secret_key';

let docClient: DynamoDBDocumentClient;
const tableName = process.env.DYNAMODB_TABLE_NAME || 'BartaNow_News';

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
};

async function getMockArticles({ page = 1, limit = 6, category, authorId, excludeId, query, hasVideo, editorsPick, date }: GetArticlesOptions) {
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


    const sortedArticles = filteredArticles.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    
    const totalPages = Math.ceil(sortedArticles.length / limit);
    const offset = (page - 1) * limit;
    const paginatedArticles = sortedArticles.slice(offset, offset + limit);

    return { articles: paginatedArticles, totalPages };
}

export async function getArticles({ page = 1, limit = 6, category, authorId, excludeId, query, hasVideo, editorsPick, date }: GetArticlesOptions): Promise<{ articles: Article[], totalPages: number }> {
    if (useMockData) {
        return getMockArticles({ page, limit, category, authorId, excludeId, query, hasVideo, editorsPick, date });
    }
    
    // DynamoDB implementation for production
    try {
        if (query) {
            // Full-text search with DynamoDB is complex and usually requires integration
            // with services like OpenSearch (fka Elasticsearch).
            // For this starter, we will fall back to mock data for search queries.
            console.warn("DynamoDB search query detected. Falling back to mock data for this query.");
            return getMockArticles({ page, limit, category, excludeId, query, hasVideo, editorsPick, date });
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
                TableName: tableName,
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
        return getMockArticles({ page, limit, category, excludeId, hasVideo, editorsPick, date });
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
        TableName: tableName,
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

export async function getAuthorById(id: string): Promise<Author | undefined> {
    if (useMockData) {
        return mockDb.authors.find((author) => author.id === id);
    }
    // In a real DynamoDB setup, you'd likely have a separate 'AUTHOR' entityType
    // and query it. This is a simplified example.
    const command = new GetCommand({
        TableName: tableName,
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
