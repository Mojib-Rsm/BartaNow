'use server';

import { revalidatePath } from 'next/cache';
import { seedDatabase } from '../../scripts/seed.ts';
import { getArticles } from '@/lib/api';
import type { Article } from './lib/types.ts';

export async function seedAction() {
  const result = await seedDatabase();
  
  if (result.success) {
    revalidatePath('/'); // Revalidate the homepage to show new data
  }
  
  return result;
}

export async function getMoreArticlesAction({ page = 1, limit = 6, category }: { page?: number; limit?: number; category?: Article['category'] }) {
    const result = await getArticles({ page, limit, category });
    return result.articles;
}
