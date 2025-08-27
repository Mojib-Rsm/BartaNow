import 'server-only';
import type { Article } from './types';
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand, GetCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { mockDb } from './data';
import { summarizeArticle } from '@/ai/flows/summarize-article';

const useMockData = !process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY || !process.env.AWS_REGION;

let client: DynamoDBClient;
let docClient: DynamoDBDocumentClient;
const tableName = process.env.DYNAMODB_TABLE_NAME || 'Oftern_News';

if (!useMockData) {
    client = new DynamoDBClient({ region: process.env.AWS_REGION });
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

    const scanCommand = new ScanCommand({
        TableName: tableName,
    });
    
    const { Items: allItems, Count: totalCount } = await docClient.send(scanCommand);
    
    if (!allItems) {
        return { articles: [], totalPages: 0 };
    }
    
    const sortedArticles = [...allItems].sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()) as Article[];

    const totalArticles = totalCount || 0;
    const totalPages = Math.ceil(totalArticles / limit);
    const offset = (page - 1) * limit;
  
    const paginatedArticles = sortedArticles.slice(offset, offset + limit);
  
    return { articles: paginatedArticles, totalPages };
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
