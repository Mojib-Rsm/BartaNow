
'use server';

import { revalidatePath } from 'next/cache';
import { seedDatabase } from '../../scripts/seed.ts';
import { getArticleById, getArticles } from '@/lib/api';
import type { Article } from '@/lib/types';
import { textToSpeech } from '@/ai/flows/text-to-speech.ts';

export async function seedAction() {
  const result = await seedDatabase();
  
  if (result.success) {
    revalidatePath('/'); // Revalidate the homepage to show new data
  }
  
  return result;
}

export async function getMoreArticlesAction({ page = 1, limit = 6, category, date }: { page?: number; limit?: number; category?: Article['category'], date?: string }) {
    const result = await getArticles({ page, limit, category, date });
    return result.articles;
}

export async function getArticleAudioAction(articleId: string) {
    const article = await getArticleById(articleId);
    if (!article) {
        throw new Error('Article not found');
    }
    const fullText = [article.title, ...article.content].join('\n\n');
    const { media } = await textToSpeech(fullText);
    return media;
}
