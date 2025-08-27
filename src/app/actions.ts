
'use server';

import { revalidatePath } from 'next/cache';
import { seedDatabase } from '../../scripts/seed.ts';
import { getArticleById, getArticles, getUserByEmail, createUser, updateUser } from '@/lib/api';
import type { Article, User } from '@/lib/types';
import { textToSpeech } from '@/ai/flows/text-to-speech.ts';
import { z } from 'zod';
import { redirect } from 'next/navigation';

export async function seedAction() {
  const result = await seedDatabase();
  
  if (result.success) {
    revalidatePath('/'); // Revalidate the homepage to show new data
  }
  
  return result;
}

export async function loginAction(credentials: { email?: string, password?: string }) {
    if (!credentials.email || !credentials.password) {
        return { success: false, message: 'ইমেইল এবং পাসওয়ার্ড দিন।' };
    }

    const user = await getUserByEmail(credentials.email);

    if (!user) {
        return { success: false, message: 'ব্যবহারকারী খুঁজে পাওয়া যায়নি।' };
    }

    // In a real app, you would use a secure password hashing library like bcrypt to compare passwords.
    // For this demo, we are comparing plain text passwords.
    if (user.password !== credentials.password) {
        return { success: false, message: 'ভুল পাসওয়ার্ড।' };
    }

    // Don't send the password back to the client
    const { password, ...userWithoutPassword } = user;

    return { success: true, message: 'লগইন সফল!', user: userWithoutPassword };
}

const signupSchema = z.object({
    name: z.string().min(3, { message: "নাম কমপক্ষে ৩ অক্ষরের হতে হবে।" }),
    email: z.string().email({ message: "সঠিক ইমেইল দিন।" }),
    password: z.string().min(6, { message: "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।" }),
});

type SignupFormValues = z.infer<typeof signupSchema>;


export async function signupAction(data: SignupFormValues) {
    const validation = signupSchema.safeParse(data);
    if (!validation.success) {
        return { success: false, message: 'প্রদত্ত তথ্য সঠিক নয়।', errors: validation.error.flatten().fieldErrors };
    }

    // Check if user already exists
    const existingUser = await getUserByEmail(data.email);
    if (existingUser) {
        return { success: false, message: 'এই ইমেইল দিয়ে ইতোমধ্যে একটি একাউন্ট রয়েছে।' };
    }

    try {
        const newUser = await createUser({
            name: data.name,
            email: data.email,
            password: data.password, // In a real app, hash this password before saving
        });

        if (newUser) {
          return { success: true, message: 'আপনার একাউন্ট সফলভাবে তৈরি হয়েছে। অনুগ্রহ করে লগইন করুন।' };
        }
        
        // This case should ideally not be reached if createUser throws an error on failure.
        return { success: false, message: 'একাউন্ট তৈরিতে একটি অজানা সমস্যা হয়েছে।' };

    } catch (error) {
        console.error("Signup Error:", error);
        const errorMessage = error instanceof Error ? error.message : 'একাউন্ট তৈরিতে একটি সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।';
        return { success: false, message: errorMessage };
    }
}


export async function getMoreArticlesAction({ page = 1, limit = 6, category, date }: { page?: number; limit?: number; category?: Article['category'], date?: string }) {
    const { articles } = await getArticles({ page, limit, category, date });
    return articles;
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

const updateUserSchema = z.object({
    id: z.string(),
    name: z.string().min(3, { message: "নাম কমপক্ষে ৩ অক্ষরের হতে হবে।" }),
    password: z.string().min(6, { message: "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।" }).optional().or(z.literal('')),
    avatarUrl: z.string().optional().or(z.literal('')),
    bio: z.string().optional(),
    bloodGroup: z.string().optional(),
});

type UpdateUserFormValues = z.infer<typeof updateUserSchema>;

export async function updateUserAction(data: UpdateUserFormValues) {
    const validation = updateUserSchema.safeParse(data);
    if (!validation.success) {
        return { success: false, message: 'প্রদত্ত তথ্য সঠিক নয়।', errors: validation.error.flatten().fieldErrors };
    }

    try {
        const updateData: Partial<User> = {
            name: data.name,
            avatarUrl: data.avatarUrl,
            bio: data.bio,
            bloodGroup: data.bloodGroup
        };

        if (data.password) {
            updateData.password = data.password;
        }

        const updatedUser = await updateUser(data.id, updateData);
        
        if (!updatedUser) {
            return { success: false, message: 'ব্যবহারকারী খুঁজে পাওয়া যায়নি।' };
        }

        // Revalidate the path to show updated info and redirect
        revalidatePath('/dashboard/profile');
        revalidatePath('/dashboard/profile/edit');
        
        return { success: true, message: 'প্রোফাইল সফলভাবে আপডেট হয়েছে।', user: updatedUser };

    } catch (error) {
        console.error("Update User Error:", error);
        const errorMessage = error instanceof Error ? error.message : 'প্রোফাইল আপডেট করতে একটি সমস্যা হয়েছে।';
        return { success: false, message: errorMessage };
    }
}
