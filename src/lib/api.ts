import 'server-only';
import type { Article } from './types';
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand, GetCommand } from "@aws-sdk/lib-dynamodb";
import { mockDb } from './data';
import { summarizeArticle } from '@/ai/flows/summarize-article';

const useMockData = !process.env.AWS_REGION;

let docClient: DynamoDBDocumentClient;
const tableName = process.env.DYNAMODB_TABLE_NAME || 'Oftern_News';

if (!useMockData) {
    const client = new DynamoDBClient({ region: process.env.AWS_REGION });
    docClient = DynamoDBDocumentClient.from(client);
}

async function generateSummariesForMockData() {
    if (mockDb.articles.every(a => a.aiSummary)) {
        return;
    }
    for (const article of mockDb.articles) {
        if (!article.aiSummary) {
            // In a real app, you might want to handle potential errors here
            const { summary } = await summarizeArticle({ articleContent: article.content.join('\n\n') });
            article.aiSummary = summary;
        }
    }
}

export async function getArticles({ page = 1, limit = 6 }: { page?: number; limit?: number }): Promise<{ articles: Article[], totalPages: number }> {
    if (useMockData) {
        await generateSummariesForMockData();
        const sortedArticles = [...mockDb.articles].sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
        const totalPages = Math.ceil(sortedArticles.length / limit);
        const offset = (page - 1) * limit;
        const paginatedArticles = sortedArticles.slice(offset, offset + limit);
        return { articles: paginatedArticles, totalPages };
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

    return { articles: allItems, totalPages };
}

export async function getArticleById(id: string): Promise<Article | undefined> {
    if (useMockData) {
        await generateSummariesForMockData();
        return mockDb.articles.find((article) => article.id === id);
    }
    const command = new GetCommand({
        TableName: tableName,
        Key: {
          id: id,
        },
    });
    const { Item } = await docClient.send(command);
    return Item as Article | undefined;
}
