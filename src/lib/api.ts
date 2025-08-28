
'use server';

import type { Article, Author, Poll, MemeNews, User } from './types';
import admin from 'firebase-admin';
import { mockDb } from './data';
import { summarizeArticle } from '@/ai/flows/summarize-article';
import { sendMail } from './mailer';

const useMockData = !process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;

let db: admin.firestore.Firestore;

if (!useMockData) {
    try {
        const serviceAccountJson = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON!;
        const serviceAccount = JSON.parse(serviceAccountJson);

        if (admin.apps.length === 0) {
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
            });
        }
        db = admin.firestore();
    } catch (error) {
        console.error("Firebase Admin SDK initialization error:", error);
        // Fallback to using mock data if initialization fails
        // useMockData = true; 
    }
}

// Helper to generate a slug from a title
const generateSlug = (title: string) => {
    return title
        .toLowerCase()
        .replace(/\s+/g, '-') // Replace spaces with -
        .replace(/[^\p{L}\p{N}-]/gu, '') // Remove all non-alphanumeric characters except dashes
        .replace(/--+/g, '-') // Replace multiple - with single -
        .replace(/^-+/, '') // Trim - from start of text
        .replace(/-+$/, ''); // Trim - from end of text
};

async function generateSummariesForMockData() {
    if (mockDb.articles.every(a => a.aiSummary)) {
        return;
    }
    const summaryPromises = mockDb.articles.map(async (article) => {
        if (!article.aiSummary) {
            try {
                const { summary } = await summarizeArticle({ articleContent: article.content.join('\n\n') });
                article.aiSummary = summary;
            } catch (e) {
                console.error(`Could not generate summary for article ${article.id}`, e);
                article.aiSummary = article.content[0].substring(0, 150) + '...'; // Fallback
            }
        }
    });
    await Promise.all(summaryPromises);
}

type GetArticlesOptions = {
    page?: number;
    limit?: number;
    category?: Article['category'];
    authorId?: string;
    excludeId?: string;
    query?: string;
    hasVideo?: boolean;
    editorsPick?: boolean;
    date?: string;
    location?: string;
};

async function getMockArticles({ page = 1, limit = 6, category, authorId, excludeId, query, hasVideo, editorsPick, date, location }: GetArticlesOptions) {
    await generateSummariesForMockData();
    
    let filteredArticles = [...mockDb.articles];

    if (category) filteredArticles = filteredArticles.filter(a => a.category === category);
    if (authorId) filteredArticles = filteredArticles.filter(a => a.authorId === authorId);
    if (excludeId) filteredArticles = filteredArticles.filter(a => a.id !== excludeId);
    if (query) {
        const q = query.toLowerCase();
        filteredArticles = filteredArticles.filter(a => a.title.toLowerCase().includes(q) || a.content.join(' ').toLowerCase().includes(q));
    }
    if (hasVideo) filteredArticles = filteredArticles.filter(a => !!a.videoUrl);
    if (editorsPick) filteredArticles = filteredArticles.filter(a => a.editorsPick);
    if (date) filteredArticles = filteredArticles.filter(a => a.publishedAt.startsWith(date));
    if (location) filteredArticles = filteredArticles.filter(a => a.location === location);

    const sortedArticles = filteredArticles.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    
    const totalPages = Math.ceil(sortedArticles.length / limit);
    const offset = (page - 1) * limit;
    const paginatedArticles = sortedArticles.slice(offset, offset + limit);

    return { articles: paginatedArticles, totalPages };
}

export async function getArticles({ page = 1, limit = 6, category, authorId, excludeId, query, hasVideo, editorsPick, date, location }: GetArticlesOptions): Promise<{ articles: Article[], totalPages: number }> {
    if (useMockData) {
        return getMockArticles({ page, limit, category, authorId, excludeId, query, hasVideo, editorsPick, date, location });
    }

    try {
        let queryRef: admin.firestore.Query = db.collection('articles');

        if (category) queryRef = queryRef.where('category', '==', category);
        if (authorId) queryRef = queryRef.where('authorId', '==', authorId);
        if (hasVideo) queryRef = queryRef.where('videoUrl', '!=', null);
        if (editorsPick) queryRef = queryRef.where('editorsPick', '==', true);
        if (date) queryRef = queryRef.where('publishedAt', '>=', date).where('publishedAt', '<', date + '\uf8ff');
        if (location) queryRef = queryRef.where('location', '==', location);
        
        // Note: Firestore does not support text search natively. For production, use a dedicated search service like Algolia or OpenSearch.
        // For this starter, text search will fall back to mock data.
        if (query) {
             console.warn("Firestore does not support native text search. Falling back to mock data for this query.");
             return getMockArticles({ query });
        }
        
        const countSnapshot = await queryRef.count().get();
        const totalArticles = countSnapshot.data().count;
        const totalPages = Math.ceil(totalArticles / limit);
        
        const articlesSnapshot = await queryRef
            .orderBy('publishedAt', 'desc')
            .limit(limit)
            .offset((page - 1) * limit)
            .get();

        let articles = articlesSnapshot.docs.map(doc => doc.data() as Article);
        
        if (excludeId) articles = articles.filter(a => a.id !== excludeId);

        return { articles, totalPages };
    } catch (error) {
        console.error("Error fetching articles from Firestore:", error);
        return { articles: [], totalPages: 0 };
    }
}

async function getMockArticleById(id: string) {
    await generateSummariesForMockData();
    return mockDb.articles.find((article) => article.id === id);
}

export async function getArticleById(id: string): Promise<Article | undefined> {
    if (useMockData) return getMockArticleById(id);
    
    const doc = await db.collection('articles').doc(id).get();
    return doc.exists ? doc.data() as Article : undefined;
}

export async function getArticleBySlug(slug: string): Promise<Article | undefined> {
    if (useMockData) {
        const article = mockDb.articles.find((article) => article.slug === slug);
        // Fallback for newly created articles not in the initial mock import
        if(article) return article;
    }
    const snapshot = await db.collection('articles').where('slug', '==', slug).limit(1).get();
    if (snapshot.empty) return undefined;
    return snapshot.docs[0].data() as Article;
}

async function getMockUserById(id: string): Promise<User | undefined> {
    return mockDb.users.find((user) => user.id === id);
}

export async function getUserById(id: string): Promise<User | undefined> {
    if (useMockData) return getMockUserById(id);
    const doc = await db.collection('users').doc(id).get();
    return doc.exists ? doc.data() as User : undefined;
}

async function getMockUserByEmail(email: string): Promise<User | undefined> {
    return mockDb.users.find((user) => user.email === email);
}

export async function getUserByEmail(email: string): Promise<User | undefined> {
    if (useMockData) return getMockUserByEmail(email);
    const snapshot = await db.collection('users').where('email', '==', email).limit(1).get();
    if (snapshot.empty) return undefined;
    return snapshot.docs[0].data() as User;
}

async function getMockAllUsers(): Promise<User[]> {
    return [...mockDb.users];
}

export async function getAllUsers(): Promise<User[]> {
    if (useMockData) return getMockAllUsers();
    const snapshot = await db.collection('users').get();
    return snapshot.docs.map(doc => doc.data() as User);
}


export async function getAuthorById(id: string): Promise<Author | undefined> {
    if (useMockData) return mockDb.authors.find((author) => author.id === id);
    const doc = await db.collection('authors').doc(id).get();
    return doc.exists ? doc.data() as Author : undefined;
}


export async function getAllAuthors(): Promise<Author[]> {
    if (useMockData) return [...mockDb.authors];
    const snapshot = await db.collection('authors').get();
    return snapshot.docs.map(doc => doc.data() as Author);
}

export async function getPolls(): Promise<Poll[]> {
  return mockDb.polls;
}

export async function getPollById(id: string): Promise<Poll | undefined> {
  return mockDb.polls.find(poll => poll.id === id);
}

export async function getMemeNews(): Promise<MemeNews[]> {
  return mockDb.memeNews;
}

export async function createUser(user: Omit<User, 'id' | 'role'>): Promise<User> {
    const newUser: User = {
        id: `user-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        role: 'user',
        ...user
    };

    if (useMockData) {
        mockDb.users.push(newUser);
    } else {
        // Check for uniqueness before creating
        const existingUser = await getUserByEmail(newUser.email);
        if (existingUser) {
            throw new Error('A user with this email already exists.');
        }
        await db.collection('users').doc(newUser.id).set(newUser);
    }
    
    if (process.env.ADMIN_EMAIL) {
        try {
            await sendMail({
                to: process.env.ADMIN_EMAIL,
                subject: 'New User Registration on BartaNow',
                html: `<h1>New User</h1><p>Name: ${newUser.name}</p><p>Email: ${newUser.email}</p>`
            });
        } catch (mailError) {
            console.error('Failed to send admin notification email:', mailError);
        }
    }

    return newUser;
}

export async function updateUser(userId: string, data: Partial<User>): Promise<User | undefined> {
    if (useMockData) {
        const userIndex = mockDb.users.findIndex(u => u.id === userId);
        if (userIndex === -1) return undefined;
        const updatedUser = { ...mockDb.users[userIndex], ...data };
        mockDb.users[userIndex] = updatedUser;
        return updatedUser;
    }

    const userRef = db.collection('users').doc(userId);
    await userRef.update(data);
    const updatedDoc = await userRef.get();
    return updatedDoc.data() as User | undefined;
}

export async function updateArticle(articleId: string, data: Partial<Article>): Promise<Article | undefined> {
    if (data.title && !data.slug) {
        data.slug = generateSlug(data.title);
    }
    
    if (useMockData) {
        const articleIndex = mockDb.articles.findIndex(a => a.id === articleId);
        if (articleIndex === -1) return undefined;
        const updatedArticle = { ...mockDb.articles[articleIndex], ...data };
        mockDb.articles[articleIndex] = updatedArticle;
        return updatedArticle;
    }
    
    const articleRef = db.collection('articles').doc(articleId);
    await articleRef.update(data);
    const updatedDoc = await articleRef.get();
    return updatedDoc.data() as Article | undefined;
}

export async function createArticle(data: Omit<Article, 'id' | 'publishedAt' | 'aiSummary'>): Promise<Article> {
    const newArticle: Article = {
        id: `article-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        publishedAt: new Date().toISOString(),
        slug: generateSlug(data.title),
        aiSummary: data.content.join('\n\n').substring(0, 150) + '...', // Basic summary
        ...data,
    };

    summarizeArticle({ articleContent: data.content.join('\n\n') })
        .then(({ summary }) => {
            newArticle.aiSummary = summary;
            updateArticle(newArticle.id, { aiSummary: summary });
        })
        .catch(e => console.error(`Could not generate summary for new article ${newArticle.id}`, e));

    if (useMockData) {
        mockDb.articles.unshift(newArticle);
    } else {
        await db.collection('articles').doc(newArticle.id).set(newArticle);
    }

    return newArticle;
}

export async function deleteArticle(articleId: string): Promise<void> {
    if (useMockData) {
        const index = mockDb.articles.findIndex(a => a.id === articleId);
        if (index > -1) mockDb.articles.splice(index, 1);
        return;
    }
    await db.collection('articles').doc(articleId).delete();
}

export async function deleteUser(userId: string): Promise<void> {
    if (useMockData) {
        const index = mockDb.users.findIndex(u => u.id === userId);
        if (index > -1) mockDb.users.splice(index, 1);
        return;
    }
    await db.collection('users').doc(userId).delete();
}
