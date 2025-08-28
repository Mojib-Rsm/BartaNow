

'use server';

import { revalidatePath } from 'next/cache';
import { seedDatabase } from '../../scripts/seed.ts';
import { getArticleById, getArticles, getUserByEmail, createUser, updateUser, getAuthorById, updateArticle, createArticle, deleteArticle, deleteUser, getUserById, createMedia, updateComment, deleteComment, createPage, updatePage, deletePage, createPoll, updatePoll, deletePoll, createSubscriber, getAllSubscribers, deleteSubscriber, getArticleBySlug, getAllRssFeeds, createRssFeed, updateRssFeed, deleteRssFeed } from '@/lib/api';
import type { Article, User, Page, Poll, PollOption, RssFeed } from '@/lib/types';
import { textToSpeech } from '@/ai/flows/text-to-speech.ts';
import { z } from 'zod';
import { redirect } from 'next/navigation';
import { uploadImage } from '@/lib/imagekit';
import { sendMail } from '@/lib/mailer';
import { getWelcomeEmailHtml } from '@/lib/email-templates/welcome-email.js';
import { getNewsletterHtml } from '@/lib/email-templates/newsletter-email.js';
import { parseStringPromise } from 'xml2js';


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
        };

        if (data.role) {
            updateData.role = data.role;
        }

        if (data.avatarUrl && data.avatarUrl.startsWith('data:image')) {
            updateData.avatarUrl = await uploadImage(data.avatarUrl, `${data.id}-avatar.png`);
        } else if (data.avatarUrl !== undefined) {
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
        revalidatePath(`/${updatedArticle.slug}`);
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
        
        const newArticleData: Omit<Article, 'id' | 'slug' | 'aiSummary'> = {
            title: data.title,
            content: data.content.split('\n').filter(p => p.trim() !== ''),
            category: data.category,
            imageUrl: finalImageUrl,
            authorId: author.id,
            authorName: author.name,
            authorAvatarUrl: author.avatarUrl || '',
            publishedAt: new Date().toISOString(),
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

export async function toggleBookmarkAction(userId: string, articleId: string) {
    try {
        const user = await getUserById(userId);
        if (!user) {
            return { success: false, message: 'ব্যবহারকারী খুঁজে পাওয়া যায়নি।' };
        }

        const savedArticles = user.savedArticles || [];
        const isBookmarked = savedArticles.includes(articleId);

        let updatedSavedArticles;
        if (isBookmarked) {
            updatedSavedArticles = savedArticles.filter(id => id !== articleId);
        } else {
            updatedSavedArticles = [...savedArticles, articleId];
        }

        const updatedUser = await updateUser(userId, { savedArticles: updatedSavedArticles });

        if (!updatedUser) {
            return { success: false, message: 'বুকমার্ক আপডেট করা যায়নি।' };
        }
        
        return { success: true, user: updatedUser, isBookmarked: !isBookmarked };

    } catch (error) {
        console.error("Toggle Bookmark Error:", error);
        return { success: false, message: 'একটি সমস্যা হয়েছে।' };
    }
}


export async function getSavedArticlesAction(userId: string): Promise<Article[]> {
    const user = await getUserById(userId);
    if (!user || !user.savedArticles || user.savedArticles.length === 0) {
        return [];
    }
    const articlePromises = user.savedArticles.map(id => getArticleById(id));
    const articles = await Promise.all(articlePromises);
    return articles.filter((article): article is Article => article !== undefined);
}

export async function getReadingHistoryAction(userId: string): Promise<Article[]> {
    const user = await getUserById(userId);
    if (!user || !user.readingHistory || user.readingHistory.length === 0) {
        return [];
    }
    const articlePromises = user.readingHistory.map(id => getArticleById(id));
    const articles = await Promise.all(articlePromises);
    return articles.filter((article): article is Article => article !== undefined);
}

export async function uploadMediaAction(formData: FormData) {
    const file = formData.get('file') as File;
    const userId = formData.get('userId') as string;

    if (!file || !userId) {
        return { success: false, message: 'ফাইল এবং ব্যবহারকারী আইডি প্রয়োজন।' };
    }

    try {
        // Convert file to base64
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const base64String = `data:${file.type};base64,${buffer.toString('base64')}`;

        // Upload to ImageKit
        const imageUrl = await uploadImage(base64String, file.name);

        // Save metadata to database
        const newMedia = await createMedia({
            fileName: file.name,
            url: imageUrl,
            mimeType: file.type,
            size: file.size,
            uploadedBy: userId,
        });

        if (!newMedia) {
            return { success: false, message: 'মিডিয়া আপলোড করা যায়নি।' };
        }

        revalidatePath('/admin/media');
        
        return { success: true, message: 'মিডিয়া সফলভাবে আপলোড হয়েছে।', media: newMedia };

    } catch (error) {
        console.error("Upload Media Error:", error);
        const errorMessage = error instanceof Error ? error.message : 'মিডিয়া আপলোড করতে একটি সমস্যা হয়েছে।';
        return { success: false, message: errorMessage };
    }
}

export async function approveCommentAction(commentId: string) {
    try {
        await updateComment(commentId, { isApproved: true });
        revalidatePath('/admin/comments');
        return { success: true, message: 'মন্তব্য সফলভাবে অনুমোদন করা হয়েছে।' };
    } catch (error) {
        console.error("Approve Comment Error:", error);
        const errorMessage = error instanceof Error ? error.message : 'মন্তব্য অনুমোদন করতে একটি সমস্যা হয়েছে।';
        return { success: false, message: errorMessage };
    }
}

export async function deleteCommentAction(commentId: string) {
    try {
        await deleteComment(commentId);
        revalidatePath('/admin/comments');
        return { success: true, message: 'মন্তব্য সফলভাবে ডিলিট করা হয়েছে।' };
    } catch (error) {
        console.error("Delete Comment Error:", error);
        const errorMessage = error instanceof Error ? error.message : 'মন্তব্য ডিলিট করতে একটি সমস্যা হয়েছে।';
        return { success: false, message: errorMessage };
    }
}


const pageSchema = z.object({
  title: z.string().min(3, "শিরোনাম কমপক্ষে ৩ অক্ষরের হতে হবে।"),
  content: z.string().min(10, "কনটেন্ট কমপক্ষে ১০ অক্ষরের হতে হবে।"),
});

export async function createPageAction(data: z.infer<typeof pageSchema>) {
    const validation = pageSchema.safeParse(data);
    if (!validation.success) {
        return { success: false, message: 'প্রদত্ত তথ্য সঠিক নয়।', errors: validation.error.flatten().fieldErrors };
    }
    
    try {
        const newPage = await createPage({
            title: data.title,
            content: data.content.split('\n').filter(p => p.trim() !== ''),
        });
        if (!newPage) {
            return { success: false, message: 'পেজ তৈরি করা যায়নি।' };
        }
        revalidatePath('/admin/pages');
        revalidatePath(`/p/${newPage.slug}`);
        return { success: true, message: 'পেজ সফলভাবে তৈরি হয়েছে।', page: newPage };
    } catch (error) {
        console.error("Create Page Error:", error);
        return { success: false, message: 'পেজ তৈরি করতে একটি সমস্যা হয়েছে।' };
    }
}

const updatePageSchema = pageSchema.extend({
  id: z.string(),
});

export async function updatePageAction(data: z.infer<typeof updatePageSchema>) {
    const validation = updatePageSchema.safeParse(data);
    if (!validation.success) {
        return { success: false, message: 'প্রদত্ত তথ্য সঠিক নয়।', errors: validation.error.flatten().fieldErrors };
    }

    try {
        const updatedPage = await updatePage(data.id, {
            title: data.title,
            content: data.content.split('\n').filter(p => p.trim() !== ''),
            lastUpdatedAt: new Date().toISOString(),
        });
        if (!updatedPage) {
            return { success: false, message: 'পেজ আপডেট করা যায়নি।' };
        }
        revalidatePath('/admin/pages');
        revalidatePath(`/p/${updatedPage.slug}`);
        return { success: true, message: 'পেজ সফলভাবে আপডেট হয়েছে।', page: updatedPage };
    } catch (error) {
        console.error("Update Page Error:", error);
        return { success: false, message: 'পেজ আপডেট করতে একটি সমস্যা হয়েছে।' };
    }
}

export async function deletePageAction(pageId: string) {
    try {
        await deletePage(pageId);
        revalidatePath('/admin/pages');
        return { success: true, message: 'পেজ সফলভাবে ডিলিট হয়েছে।' };
    } catch (error) {
        console.error("Delete Page Error:", error);
        return { success: false, message: 'পেজ ডিলিট করতে একটি সমস্যা হয়েছে।' };
    }
}


const pollOptionSchema = z.object({
    id: z.string().optional(),
    label: z.string().min(1, "অপশন লেবেল খালি রাখা যাবে না।"),
});

const pollSchema = z.object({
  id: z.string().optional(),
  question: z.string().min(10, "প্রশ্ন কমপক্ষে ১০ অক্ষরের হতে হবে।"),
  options: z.array(pollOptionSchema).min(2, "কমপক্ষে দুটি অপশন যোগ করুন।"),
  isActive: z.boolean().default(true),
});

type PollFormValues = z.infer<typeof pollSchema>;

export async function createPollAction(data: PollFormValues) {
    const validation = pollSchema.safeParse(data);
    if (!validation.success) {
        return { success: false, message: 'প্রদত্ত তথ্য সঠিক নয়।', errors: validation.error.flatten().fieldErrors };
    }
    
    try {
        const newPoll = await createPoll(data);
        if (!newPoll) {
            return { success: false, message: 'জরিপ তৈরি করা যায়নি।' };
        }
        revalidatePath('/admin/polls');
        revalidatePath('/poll-section'); // Assuming this component needs revalidation
        return { success: true, message: 'জরিপ সফলভাবে তৈরি হয়েছে।', poll: newPoll };
    } catch (error) {
        console.error("Create Poll Error:", error);
        return { success: false, message: 'জরিপ তৈরি করতে একটি সমস্যা হয়েছে।' };
    }
}

export async function updatePollAction(data: PollFormValues) {
    if (!data.id) return { success: false, message: 'জরিপ আইডি পাওয়া যায়নি।' };

    const validation = pollSchema.safeParse(data);
    if (!validation.success) {
        return { success: false, message: 'প্রদত্ত তথ্য সঠিক নয়।', errors: validation.error.flatten().fieldErrors };
    }
    
    try {
        const updatedPoll = await updatePoll(data.id, data);
        if (!updatedPoll) {
            return { success: false, message: 'জরিপ আপডেট করা যায়নি।' };
        }
        revalidatePath('/admin/polls');
        revalidatePath(`/admin/polls/edit/${data.id}`);
        return { success: true, message: 'জরিপ সফলভাবে আপডেট হয়েছে।', poll: updatedPoll };
    } catch (error) {
        console.error("Update Poll Error:", error);
        return { success: false, message: 'জরিপ আপডেট করতে একটি সমস্যা হয়েছে।' };
    }
}

export async function deletePollAction(pollId: string) {
    try {
        await deletePoll(pollId);
        revalidatePath('/admin/polls');
        return { success: true, message: 'জরিপ সফলভাবে ডিলিট হয়েছে।' };
    } catch (error) {
        console.error("Delete Poll Error:", error);
        const errorMessage = error instanceof Error ? error.message : 'জরিপ ডিলিট করতে একটি সমস্যা হয়েছে।';
        return { success: false, message: errorMessage };
    }
}

// --- SUBSCRIBER ACTIONS ---

const subscribeSchema = z.object({
  email: z.string().email({ message: "সঠিক ইমেইল ঠিকানা দিন।" }),
});

export async function subscribeAction(data: { email: string }) {
    const validation = subscribeSchema.safeParse(data);
    if (!validation.success) {
        return { success: false, message: 'একটি সঠিক ইমেইল ঠিকানা প্রয়োজন।' };
    }
    try {
        const newSubscriber = await createSubscriber(data.email);
        if (!newSubscriber) {
            return { success: false, message: 'এই ইমেইল দিয়ে ইতোমধ্যে সাবস্ক্রাইব করা আছে।' };
        }

        // Send welcome email
        await sendMail({
            to: newSubscriber.email,
            subject: 'বার্তা নাও-তে স্বাগতম!',
            html: getWelcomeEmailHtml(newSubscriber.email),
        });

        return { success: true, message: 'সাবস্ক্রিপশনের জন্য ধন্যবাদ! আপনার ইনবক্স চেক করুন।' };
    } catch (error) {
        return { success: false, message: 'সাবস্ক্রিপশন করতে একটি সমস্যা হয়েছে।' };
    }
}

export async function deleteSubscriberAction(subscriberId: string) {
    try {
        await deleteSubscriber(subscriberId);
        revalidatePath('/admin/subscribers');
        return { success: true, message: 'সাবস্ক্রাইবার সফলভাবে ডিলিট হয়েছে।' };
    } catch (error) {
        return { success: false, message: 'সাবস্ক্রাইবার ডিলিট করতে সমস্যা হয়েছে।' };
    }
}

export async function sendWelcomeEmailAction(email: string) {
    try {
        await sendMail({
            to: email,
            subject: 'বার্তা নাও-তে স্বাগতম!',
            html: getWelcomeEmailHtml(email),
        });
        return { success: true, message: `স্বাগত ইমেইল ${email}-এ পাঠানো হয়েছে।` };
    } catch (error) {
        return { success: false, message: 'ইমেইল পাঠাতে সমস্যা হয়েছে।' };
    }
}

export async function sendNewsletterAction(data: { articleIds: string[], customMessage: string }) {
    if (data.articleIds.length === 0) {
        return { success: false, message: 'অনুগ্রহ করে কমপক্ষে একটি আর্টিকেল নির্বাচন করুন।' };
    }
    
    try {
        const subscribers = await getAllSubscribers();
        const activeSubscribers = subscribers.filter(s => s.isSubscribed);
        
        if (activeSubscribers.length === 0) {
            return { success: false, message: 'পাঠানোর জন্য কোনো সক্রিয় সাবস্ক্রাইবার নেই।' };
        }

        const articlePromises = data.articleIds.map(id => getArticleById(id));
        const articles = (await Promise.all(articlePromises)).filter((a): a is Article => a !== undefined);

        const newsletterHtml = getNewsletterHtml({ articles, customMessage: data.customMessage });

        const emailPromises = activeSubscribers.map(subscriber => 
            sendMail({
                to: subscriber.email,
                subject: `আপনার সাপ্তাহিক বার্তা নাও নিউজলেটার`,
                html: newsletterHtml,
            })
        );
        
        await Promise.all(emailPromises);

        return { success: true, message: `${activeSubscribers.length} জন সাবস্ক্রাইবারের কাছে নিউজলেটার সফলভাবে পাঠানো হয়েছে।` };
    } catch (error) {
        console.error("Newsletter send error:", error);
        return { success: false, message: 'নিউজলেটার পাঠাতে একটি সমস্যা হয়েছে।' };
    }
}

export async function triggerRssImportAction() {
    try {
        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:9002';
        const response = await fetch(`${baseUrl}/api/cron/import-rss`, {
            method: 'GET',
            headers: {
                // Add any necessary headers, e.g., an auth token for cron jobs
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to trigger RSS import.');
        }

        const result = await response.json();
        revalidatePath('/admin/articles');
        revalidatePath('/');
        return { success: true, message: 'RSS ইম্পোর্ট সফলভাবে সম্পন্ন হয়েছে।', data: result };

    } catch (error) {
        console.error("RSS Import Trigger Error:", error);
        const errorMessage = error instanceof Error ? error.message : 'RSS ইম্পোর্ট শুরু করতে একটি সমস্যা হয়েছে।';
        return { success: false, message: errorMessage };
    }
}

export async function importWordPressAction(xmlContent: string) {
    try {
        const data = await parseStringPromise(xmlContent, {
            explicitArray: false,
            trim: true,
        });

        const items = data.rss.channel.item;
        if (!items) {
            return { success: false, message: 'XML ফাইলে কোনো পোস্ট খুঁজে পাওয়া যায়নি।' };
        }

        const allCategories = ['রাজনীতি', 'খেলা', 'প্রযুক্তি', 'বিনোদন', 'অর্থনীতি', 'আন্তর্জাতিক', 'মতামত', 'স্বাস্থ্য', 'শিক্ষা', 'পরিবেশ', 'বিশেষ-কভারেজ', 'জাতীয়', 'ইসলামী-জীবন', 'তথ্য-যাচাই', 'মিম-নিউজ', 'ভিডিও', 'সর্বশেষ', 'সম্পাদকের-পছন্দ'];

        const posts = Array.isArray(items) ? items : [items];
        let importedCount = 0;
        let skippedCount = 0;

        for (const post of posts) {
            // We only care about published posts
            if (post['wp:status'] !== 'publish' || post['wp:post_type'] !== 'post') {
                continue;
            }

            const slug = post['wp:post_name'];
            if(!slug) continue;

            const existingArticle = await getArticleBySlug(slug);

            if (existingArticle) {
                skippedCount++;
                continue;
            }

            const authorLogin = post['dc:creator'];
            let author = await getUserByEmail(`${authorLogin}@example.com`); // Assume an email pattern
            if (!author) {
                // Create a new user if the author doesn't exist
                 author = await createUser({
                    name: authorLogin,
                    email: `${authorLogin}@example.com`,
                    password: 'password123', // Assign a default password
                });
            }

            // Extract content and clean it up
            const contentHtml = post['content:encoded'] || '';
            
            // Extract the first image URL from the content
            const imgMatch = contentHtml.match(/<img.*?src=["'](.*?)["']/);
            let imageUrl = 'https://picsum.photos/seed/wp-import/800/600'; // Default placeholder

            if (imgMatch && imgMatch[1]) {
                try {
                    const response = await fetch(imgMatch[1]);
                    if (response.ok) {
                        const blob = await response.blob();
                        const buffer = Buffer.from(await blob.arrayBuffer());
                        const base64String = `data:${blob.type};base64,${buffer.toString('base64')}`;
                        
                        const uploadedUrl = await uploadImage(base64String, `${slug}-featured-image.png`);
                        imageUrl = uploadedUrl;
                        
                        // Also save to media library
                        await createMedia({
                            fileName: `${slug}-featured-image.png`,
                            url: uploadedUrl,
                            mimeType: blob.type,
                            size: blob.size,
                            uploadedBy: author.id,
                        });
                    }
                } catch (e) {
                    console.error(`Could not download or upload image for post "${post.title}":`, e);
                }
            }
            
            // Basic HTML strip to get text content
            const contentText = contentHtml.replace(/<[^>]*>?/gm, ''); 
            const paragraphs = contentText.split('\n').filter(p => p.trim() !== '');
            
            // Extract and map category
            let postCategory: Article['category'] = 'সর্বশেষ'; // Default category
            if (post.category && Array.isArray(post.category)) {
                const wpCategory = post.category.find((c: any) => c.$.domain === 'category');
                if (wpCategory) {
                    const categoryName = wpCategory._;
                    // Simple mapping logic (can be improved)
                    const foundCategory = allCategories.find(c => c.toLowerCase() === categoryName.toLowerCase());
                    if (foundCategory) {
                        postCategory = foundCategory as Article['category'];
                    }
                }
            }


            const newArticleData: Omit<Article, 'id' | 'slug' | 'aiSummary'> = {
                title: post.title,
                content: paragraphs,
                category: postCategory,
                imageUrl: imageUrl,
                authorId: author.id,
                authorName: author.name,
                authorAvatarUrl: author.avatarUrl || '',
                publishedAt: new Date(post.pubDate).toISOString(), // Use original date
            };

            await createArticle(newArticleData);
            importedCount++;
        }

        revalidatePath('/');
        return {
            success: true,
            message: `${importedCount} টি পোস্ট সফলভাবে ইম্পোর্ট করা হয়েছে। ${skippedCount} টি পোস্ট ডুপ্লিকেট হওয়ার কারণে স্কিপ করা হয়েছে।`,
        };
    } catch (error) {
        console.error('WordPress Import Error:', error);
        return {
            success: false,
            message: 'XML ফাইল পার্স করতে বা পোস্ট ইম্পোর্ট করতে সমস্যা হয়েছে। ফাইলটি সঠিক ফরম্যাটে আছে কি না তা পরীক্ষা করুন।',
        };
    }
}

// --- RSS FEED ACTIONS ---
const rssFeedSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(3, "ফিডের নাম কমপক্ষে ৩ অক্ষরের হতে হবে।"),
    url: z.string().url("অনুগ্রহ করে একটি সঠিক URL দিন।"),
    defaultCategory: z.enum(['রাজনীতি' , 'খেলা' , 'প্রযুক্তি' , 'বিনোদন' , 'অর্থনীতি' , 'আন্তর্জাতিক' , 'মতামত' , 'স্বাস্থ্য' , 'শিক্ষা' , 'পরিবেশ' , 'বিশেষ-কভারেজ' , 'জাতীয়' , 'ইসলামী-জীবন' , 'তথ্য-যাচাই' , 'মিম-নিউজ', 'ভিডিও' , 'সর্বশেষ' , 'সম্পাদকের-পছন্দ']),
    categoryMap: z.record(z.string()).default({}),
});

type RssFeedFormValues = z.infer<typeof rssFeedSchema>;

export async function createRssFeedAction(data: RssFeedFormValues) {
    const validation = rssFeedSchema.safeParse(data);
    if (!validation.success) {
        return { success: false, message: 'প্রদত্ত তথ্য সঠিক নয়।', errors: validation.error.flatten().fieldErrors };
    }

    try {
        const newFeed = await createRssFeed(data);
        if (!newFeed) {
            return { success: false, message: 'RSS ফিড তৈরি করা যায়নি।' };
        }
        revalidatePath('/admin/rss');
        return { success: true, message: 'RSS ফিড সফলভাবে তৈরি হয়েছে।', feed: newFeed };
    } catch (error) {
        console.error("Create RSS Feed Error:", error);
        return { success: false, message: 'RSS ফিড তৈরি করতে একটি সমস্যা হয়েছে।' };
    }
}

export async function updateRssFeedAction(data: RssFeedFormValues) {
    if (!data.id) return { success: false, message: 'ফিড আইডি পাওয়া যায়নি।' };
    
    const validation = rssFeedSchema.safeParse(data);
    if (!validation.success) {
        return { success: false, message: 'প্রদত্ত তথ্য সঠিক নয়।', errors: validation.error.flatten().fieldErrors };
    }

    try {
        const updatedFeed = await updateRssFeed(data.id, data);
        if (!updatedFeed) {
            return { success: false, message: 'RSS ফিড আপডেট করা যায়নি।' };
        }
        revalidatePath('/admin/rss');
        revalidatePath(`/admin/rss/edit/${data.id}`);
        return { success: true, message: 'RSS ফিড সফলভাবে আপডেট হয়েছে।', feed: updatedFeed };
    } catch (error) {
        console.error("Update RSS Feed Error:", error);
        return { success: false, message: 'RSS ফিড আপডেট করতে একটি সমস্যা হয়েছে।' };
    }
}

export async function deleteRssFeedAction(feedId: string) {
    try {
        await deleteRssFeed(feedId);
        revalidatePath('/admin/rss');
        return { success: true, message: 'RSS ফিড সফলভাবে ডিলিট হয়েছে।' };
    } catch (error) {
        console.error("Delete RSS Feed Error:", error);
        const errorMessage = error instanceof Error ? error.message : 'RSS ফিড ডিলিট করতে একটি সমস্যা হয়েছে।';
        return { success: false, message: errorMessage };
    }
}
