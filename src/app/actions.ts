'use server';

import { revalidatePath } from 'next/cache';
import { seedDatabase } from '../../scripts/seed.ts';

export async function seedAction() {
  const result = await seedDatabase();
  
  if (result.success) {
    revalidatePath('/'); // Revalidate the homepage to show new data
  }
  
  return result;
}
