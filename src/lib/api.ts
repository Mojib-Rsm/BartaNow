import 'server-only';
import { mockDb } from './data';
import type { Article } from './types';

// Simulate a network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function getArticles({ page = 1, limit = 6 }: { page?: number; limit?: number }): Promise<{ articles: Article[], totalPages: number }> {
  await delay(500); // Simulate network latency

  const sortedArticles = [...mockDb.articles].sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  
  const totalArticles = sortedArticles.length;
  const totalPages = Math.ceil(totalArticles / limit);
  const offset = (page - 1) * limit;

  const paginatedArticles = sortedArticles.slice(offset, offset + limit);

  return { articles: paginatedArticles, totalPages };
}

export async function getArticleById(id: string): Promise<Article | undefined> {
  await delay(300); // Simulate network latency
  
  const article = mockDb.articles.find(article => article.id === id);
  return article;
}
