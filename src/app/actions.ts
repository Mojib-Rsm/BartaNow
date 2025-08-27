
'use server';

import { revalidatePath } from 'next/cache';
import { seedDatabase } from '../../scripts/seed.ts';
import { getArticleById, getArticles, getUserByEmail, createUser, updateUser, getAuthorById, updateArticle, createArticle, deleteArticle, deleteUser, getUserById } from '@/lib/api';
import type { Article, User } from '@/lib/types';
import { textToSpeech } from '@/ai/flows/text-to-speech.ts';
import { z } from 'zod';
import { redirect } from 'next/navigation';
import { uploadImage } from '@/lib/imagekit';

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
    role: z.enum(['admin', 'editor', 'reporter', 'user']).optional(),
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
            bio: data.bio,
            bloodGroup: data.bloodGroup,
            role: data.role,
        };

        if (data.avatarUrl && data.avatarUrl.startsWith('data:image')) {
            updateData.avatarUrl = await uploadImage(data.avatarUrl, `${data.id}-avatar.png`);
        } else {
            updateData.avatarUrl = data.avatarUrl;
        }

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
        revalidatePath('/admin/users');
        revalidatePath(`/admin/users/edit/${data.id}`);
        
        return { success: true, message: 'প্রোফাইল সফলভাবে আপডেট হয়েছে।', user: updatedUser };

    } catch (error) {
        console.error("Update User Error:", error);
        const errorMessage = error instanceof Error ? error.message : 'প্রোফাইল আপডেট করতে একটি সমস্যা হয়েছে।';
        return { success: false, message: errorMessage };
    }
}


const articleSchema = z.object({
  id: z.string(),
  title: z.string().min(10, "শিরোনাম কমপক্ষে ১০ অক্ষরের হতে হবে।"),
  content: z.string().min(50, "কনটেন্ট কমপক্ষে ৫০ অক্ষরের হতে হবে।"),
  category: z.enum(['রাজনীতি' , 'খেলা' , 'প্রযুক্তি' , 'বিনোদন' , 'অর্থনীতি' , 'আন্তর্জাতিক' , 'মতামত' , 'স্বাস্থ্য' , 'শিক্ষা' , 'পরিবেশ' , 'বিশেষ-কভারেজ' , 'জাতীয়' , 'ইসলামী-জীবন' , 'তথ্য-যাচাই' , 'মিম-নিউজ', 'ভিডিও' , 'সর্বশেষ' , 'সম্পাদকের-পছন্দ']),
  imageUrl: z.string().optional().or(z.literal('')),
  authorId: z.string().min(1, "লেখক আইডি প্রয়োজন।"),
});

type ArticleFormValues = z.infer<typeof articleSchema>;

export async function updateArticleAction(data: Omit<ArticleFormValues, 'authorId'> & { id: string }) {
    const validation = articleSchema.omit({ authorId: true }).safeParse(data);

    if (!validation.success) {
        return { success: false, message: 'প্রদত্ত তথ্য সঠিক নয়।', errors: validation.error.flatten().fieldErrors };
    }

    try {
        const articleToUpdate: Partial<Article> = {
            title: data.title,
            content: data.content.split('\n').filter(p => p.trim() !== ''),
            category: data.category,
        };

        if (data.imageUrl && data.imageUrl.startsWith('data:image')) {
            articleToUpdate.imageUrl = await uploadImage(data.imageUrl, `article-${data.id}.png`);
        } else {
            articleToUpdate.imageUrl = data.imageUrl;
        }

        const updatedArticle = await updateArticle(data.id, articleToUpdate);

        if (!updatedArticle) {
             return { success: false, message: 'আর্টিকেলটি আপডেট করা যায়নি।' };
        }

        revalidatePath('/admin/articles');
        revalidatePath(`/admin/articles/edit/${data.id}`);
        revalidatePath(`/articles/${updatedArticle.slug}`);
        revalidatePath('/');


        return { success: true, message: 'আর্টিকেল সফলভাবে আপডেট হয়েছে।', article: updatedArticle };

    } catch (error) {
        console.error("Update Article Error:", error);
        const errorMessage = error instanceof Error ? error.message : 'আর্টিকেল আপডেট করতে একটি সমস্যা হয়েছে।';
        return { success: false, message: errorMessage };
    }
}

const createArticleSchema = articleSchema.omit({ id: true });
type CreateArticleFormValues = z.infer<typeof createArticleSchema>;

export async function createArticleAction(data: Omit<CreateArticleFormValues, 'authorId'> & { userId: string }) {
    const validation = createArticleSchema.omit({ authorId: true }).safeParse(data);

    if (!validation.success) {
        return { success: false, message: 'প্রদত্ত তথ্য সঠিক নয়।', errors: validation.error.flatten().fieldErrors };
    }

    try {
        const author = await getUserById(data.userId);
        if (!author) {
            return { success: false, message: 'লেখক খুঁজে পাওয়া যায়নি।' };
        }

        let finalImageUrl = data.imageUrl || 'https://picsum.photos/seed/placeholder/800/600';
        if (data.imageUrl && data.imageUrl.startsWith('data:image')) {
            finalImageUrl = await uploadImage(data.imageUrl, `article-${Date.now()}.png`);
        }
        
        const newArticleData: Omit<Article, 'id' | 'publishedAt' | 'aiSummary'> = {
            title: data.title,
            slug: '', // Will be generated in createArticle
            content: data.content.split('\n').filter(p => p.trim() !== ''),
            category: data.category,
            imageUrl: finalImageUrl,
            authorId: author.id,
            authorName: author.name,
            authorAvatarUrl: author.avatarUrl || '',
        };

        const newArticle = await createArticle(newArticleData);

        if (!newArticle) {
             return { success: false, message: 'আর্টিকেলটি তৈরি করা যায়নি।' };
        }

        revalidatePath('/admin/articles');
        revalidatePath('/');

        return { success: true, message: 'আর্টিকেল সফলভাবে তৈরি হয়েছে।', article: newArticle };

    } catch (error) {
        console.error("Create Article Error:", error);
        const errorMessage = error instanceof Error ? error.message : 'আর্টিকেল তৈরি করতে একটি সমস্যা হয়েছে।';
        return { success: false, message: errorMessage };
    }
}


export async function deleteArticleAction(articleId: string) {
    try {
        await deleteArticle(articleId);
        revalidatePath('/admin/articles');
        revalidatePath('/');
        return { success: true, message: 'আর্টিকেল সফলভাবে ডিলিট হয়েছে।' };
    } catch (error) {
        console.error("Delete Article Error:", error);
        const errorMessage = error instanceof Error ? error.message : 'আর্টিকেল ডিলিট করতে একটি সমস্যা হয়েছে।';
        return { success: false, message: errorMessage };
    }
}

export async function deleteUserAction(userId: string) {
    try {
        await deleteUser(userId);
        revalidatePath('/admin/users');
        return { success: true, message: 'ব্যবহারকারী সফলভাবে ডিলিট হয়েছে।' };
    } catch (error) {
        console.error("Delete User Error:", error);
        const errorMessage = error instanceof Error ? error.message : 'ব্যবহারকারী ডিলিট করতে একটি সমস্যা হয়েছে।';
        return { success: false, message: errorMessage };
    }
}

export async function sendNotificationAction(payload: { title: string; body: string; url?: string }) {
  // This is a server action. It's safe to use fetch here.
  // It calls our own API route to trigger the web push.
  try {
    // Construct the absolute URL for the API endpoint
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:9002';
    const response = await fetch(`${baseUrl}/api/push/notify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to send notification');
    }

    const data = await response.json();
    return { success: true, message: data.message };
  } catch (error) {
    console.error('Send Notification Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'বিজ্ঞপ্তি পাঠাতে একটি সমস্যা হয়েছে।';
    return { success: false, message: errorMessage };
  }
}
