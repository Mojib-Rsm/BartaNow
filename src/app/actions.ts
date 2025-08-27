'use server';

import { revalidatePath } from 'next/cache';
import { seedDatabase } from '../../scripts/seed.ts';

export async function seedAction() {
  try {
    const result = await seedDatabase();
    if (result.success) {
      revalidatePath('/'); // Revalidate the homepage to show new data
      return { success: true, message: result.message };
    } else {
      return { success: false, message: result.message };
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unknown error occurred during seeding.';
    return { success: false, message };
  }
}
