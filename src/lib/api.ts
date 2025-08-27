import 'server-only';
import type { Article } from './types';
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand, GetCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({ region: process.env.AWS_REGION });
const docClient = DynamoDBDocumentClient.from(client);
const tableName = process.env.DYNAMODB_TABLE_NAME || 'Oftern_News';

export async function getArticles({ page = 1, limit = 6 }: { page?: number; limit?: number }): Promise<{ articles: Article[], totalPages: number }> {
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
  const command = new GetCommand({
    TableName: tableName,
    Key: {
      id: id,
    },
  });
  const { Item } = await docClient.send(command);
  return Item as Article | undefined;
}
