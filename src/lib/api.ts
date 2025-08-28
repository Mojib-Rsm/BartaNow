

'use server';

import type { Article, Author, Poll, MemeNews, User, Notification, Media, Comment, Page, MenuItem, Subscriber } from './types';
import admin from 'firebase-admin';
import { mockDb } from './data';
import { summarizeArticle } from '@/ai/flows/summarize-article';
import { sendMail } from './mailer';
import { translateForSlug } from '@/ai/flows/translate-for-slug';

const useFirestore = process.env.DATABASE_TYPE === 'firestore';

let db: admin.firestore.Firestore;
if (useFirestore) {
    try {
        const serviceAccountJson = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;
        if (!serviceAccountJson) {
             throw new Error("GOOGLE_APPLICATION_CREDENTIALS_JSON is not set for Firestore");
        }
        const serviceAccount = JSON.parse(serviceAccountJson);
        
        if (admin.apps.length === 0) {
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
            });
        }
        db = admin.firestore();
        console.log("Successfully connected to Firestore.");
    } catch (error) {
        console.error("Firebase Admin SDK initialization error. Firestore will be disabled.", error);
    }
} else {
    console.log("Using mock data (simulating local database).");
}


// Helper to generate a slug from a title
const generateNonAiSlug = (title: string) => {
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

// --- MOCK/LOCAL DB IMPLEMENTATIONS ---

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

async function getMockArticleById(id: string) {
    await generateSummariesForMockData();
    return mockDb.articles.find((article) => article.id === id);
}

async function getMockArticleBySlug(slug: string): Promise<Article | undefined> {
    const article = mockDb.articles.find((article) => article.slug === slug);
    if(article) return article;
    return undefined;
}


async function getMockUserById(id: string): Promise<User | undefined> {
    return mockDb.users.find((user) => user.id === id);
}

async function getMockUserByEmail(email: string): Promise<User | undefined> {
    return mockDb.users.find((user) => user.email === email);
}

async function getMockAllUsers(): Promise<User[]> {
    return [...mockDb.users];
}

async function getMockAuthorById(id: string): Promise<Author | undefined> {
    return mockDb.authors.find((author) => author.id === id);
}

async function getMockAllAuthors(): Promise<Author[]> {
    return [...mockDb.authors];
}

async function createMockUser(user: Omit<User, 'id' | 'role'>): Promise<User> {
    const newUser: User = {
        id: `user-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        role: 'user',
        savedArticles: [],
        readingHistory: [],
        ...user
    };
    mockDb.users.push(newUser);
    return newUser;
}

async function updateMockUser(userId: string, data: Partial<User>): Promise<User | undefined> {
    const userIndex = mockDb.users.findIndex(u => u.id === userId);
    if (userIndex === -1) return undefined;
    const updatedUser = { ...mockDb.users[userIndex], ...data };
    mockDb.users[userIndex] = updatedUser;
    
    // Update localStorage simulation for client-side components
    if (typeof window !== 'undefined' && window.localStorage) {
        const storedUser = JSON.parse(window.localStorage.getItem('bartaNowUser') || '{}');
        if (storedUser.id === userId) {
            window.localStorage.setItem('bartaNowUser', JSON.stringify(updatedUser));
            window.dispatchEvent(new Event('storage'));
        }
    }
    
    return updatedUser;
}

async function createMockArticle(data: Omit<Article, 'id' | 'publishedAt' | 'aiSummary' | 'slug'>): Promise<Article> {
     const newArticle: Article = {
        id: `article-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        publishedAt: new Date().toISOString(),
        slug: await translateForSlug(data.title),
        aiSummary: data.content.join('\n\n').substring(0, 150) + '...', // Basic summary
        ...data,
    };
    mockDb.articles.unshift(newArticle);
    return newArticle;
}

async function updateMockArticle(articleId: string, data: Partial<Article>): Promise<Article | undefined> {
     if (data.title && !data.slug) {
        data.slug = await translateForSlug(data.title);
    }
    const articleIndex = mockDb.articles.findIndex(a => a.id === articleId);
    if (articleIndex === -1) return undefined;
    const updatedArticle = { ...mockDb.articles[articleIndex], ...data };
    mockDb.articles[articleIndex] = updatedArticle;
    return updatedArticle;
}

async function deleteMockArticle(articleId: string): Promise<void> {
    const index = mockDb.articles.findIndex(a => a.id === articleId);
    if (index > -1) mockDb.articles.splice(index, 1);
}

async function deleteMockUser(userId: string): Promise<void> {
    const index = mockDb.users.findIndex(u => u.id === userId);
    if (index > -1) mockDb.users.splice(index, 1);
}

async function getMockNotificationsForUser(userId: string): Promise<Notification[]> {
    const notifications = mockDb.notifications.filter(n => n.userId === userId);
    return notifications.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

async function getMockAllMedia(): Promise<Media[]> {
    return [...mockDb.media].sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
}

async function createMockMedia(data: Omit<Media, 'id' | 'uploadedAt'>): Promise<Media> {
    const newMedia: Media = {
        id: `media-${Date.now()}`,
        uploadedAt: new Date().toISOString(),
        ...data,
    };
    mockDb.media.unshift(newMedia);
    return newMedia;
}

async function getMockAllComments(): Promise<Comment[]> {
    return [...mockDb.comments].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

async function updateMockComment(commentId: string, data: Partial<Comment>): Promise<Comment | undefined> {
    const commentIndex = mockDb.comments.findIndex(c => c.id === commentId);
    if (commentIndex === -1) return undefined;
    const updatedComment = { ...mockDb.comments[commentIndex], ...data };
    mockDb.comments[commentIndex] = updatedComment;
    return updatedComment;
}

async function deleteMockComment(commentId: string): Promise<void> {
    const index = mockDb.comments.findIndex(c => c.id === commentId);
    if (index > -1) mockDb.comments.splice(index, 1);
}


async function getMockAllPages(): Promise<Page[]> {
    return [...mockDb.pages];
}

async function getMockPageById(id: string): Promise<Page | undefined> {
    return mockDb.pages.find((p) => p.id === id);
}

async function getMockPageBySlug(slug: string): Promise<Page | undefined> {
    return mockDb.pages.find((p) => p.slug === slug);
}

async function createMockPage(data: Omit<Page, 'id' | 'slug' | 'publishedAt' | 'lastUpdatedAt'>): Promise<Page> {
    const now = new Date().toISOString();
    const newPage: Page = {
        id: `page-${Date.now()}`,
        slug: generateNonAiSlug(data.title),
        publishedAt: now,
        lastUpdatedAt: now,
        ...data,
    };
    mockDb.pages.push(newPage);
    return newPage;
}

async function updateMockPage(pageId: string, data: Partial<Page>): Promise<Page | undefined> {
    const pageIndex = mockDb.pages.findIndex(p => p.id === pageId);
    if (pageIndex === -1) return undefined;
    const updatedPage = { ...mockDb.pages[pageIndex], ...data, lastUpdatedAt: new Date().toISOString() };
    mockDb.pages[pageIndex] = updatedPage;
    return updatedPage;
}

async function deleteMockPage(pageId: string): Promise<void> {
    const index = mockDb.pages.findIndex(p => p.id === pageId);
    if (index > -1) mockDb.pages.splice(index, 1);
}

async function getMockAllPolls(): Promise<Poll[]> {
    return [...mockDb.polls];
}

async function getMockPollById(id: string): Promise<Poll | undefined> {
    return mockDb.polls.find(poll => poll.id === id);
}

async function createMockPoll(data: Omit<Poll, 'id' | 'createdAt'>): Promise<Poll> {
    const newPoll: Poll = {
        id: `poll-${Date.now()}`,
        createdAt: new Date().toISOString(),
        ...data,
    };
    mockDb.polls.unshift(newPoll);
    return newPoll;
}

async function updateMockPoll(pollId: string, data: Partial<Poll>): Promise<Poll | undefined> {
    const pollIndex = mockDb.polls.findIndex(p => p.id === pollId);
    if (pollIndex === -1) return undefined;
    const updatedPoll = { ...mockDb.polls[pollIndex], ...data };
    mockDb.polls[pollIndex] = updatedPoll;
    return updatedPoll;
}

async function deleteMockPoll(pollId: string): Promise<void> {
    const index = mockDb.polls.findIndex(p => p.id === pollId);
    if (index > -1) mockDb.polls.splice(index, 1);
}

async function getMockMenuItems(): Promise<MenuItem[]> {
    return [...mockDb.menuItems];
}

async function getMockAllSubscribers(): Promise<Subscriber[]> {
    return [...mockDb.subscribers];
}

async function createMockSubscriber(email: string): Promise<Subscriber | null> {
    if (mockDb.subscribers.some(s => s.email === email)) {
        return null; // Already subscribed
    }
    const newSubscriber: Subscriber = {
        id: `sub-${Date.now()}`,
        email,
        isSubscribed: true,
        subscribedAt: new Date().toISOString(),
    };
    mockDb.subscribers.push(newSubscriber);
    return newSubscriber;
}

async function deleteMockSubscriber(subscriberId: string): Promise<void> {
    const index = mockDb.subscribers.findIndex(s => s.id === subscriberId);
    if (index > -1) {
        mockDb.subscribers.splice(index, 1);
    }
}


// --- FIRESTORE IMPLEMENTATIONS ---

async function getFirestoreArticles({ page = 1, limit = 6, category, authorId, excludeId, query, hasVideo, editorsPick, date, location }: GetArticlesOptions): Promise<{ articles: Article[], totalPages: number }> {
     try {
        let queryRef: admin.firestore.Query = db.collection('articles');
        let countQueryRef: admin.firestore.Query = db.collection('articles');

        if (category) {
            queryRef = queryRef.where('category', '==', category);
            countQueryRef = countQueryRef.where('category', '==', category);
        }
        if (authorId) {
            queryRef = queryRef.where('authorId', '==', authorId);
            countQueryRef = countQueryRef.where('authorId', '==', authorId);
        }
        if (hasVideo) {
            queryRef = queryRef.where('videoUrl', '>', '').orderBy('videoUrl').orderBy('publishedAt', 'desc');
            countQueryRef = countQueryRef.where('videoUrl', '>', '');
        }
        if (editorsPick) {
            queryRef = queryRef.where('editorsPick', '==', true).orderBy('publishedAt', 'desc');
            countQueryRef = countQueryRef.where('editorsPick', '==', true);
        }
       
        if (date) {
            queryRef = queryRef.where('publishedAt', '>=', date).where('publishedAt', '<', date + '\uf8ff');
            countQueryRef = countQueryRef.where('publishedAt', '>=', date).where('publishedAt', '<', date + '\uf8ff');
        }
        if (location) {
            queryRef = queryRef.where('location', '==', location);
            countQueryRef = countQueryRef.where('location', '==', location);
        }
        
        if (query) {
             console.warn("Firestore does not support native text search. Falling back to mock data for this query.");
             return getMockArticles({ query, page, limit });
        }
        
        if (!hasVideo && !editorsPick) {
            queryRef = queryRef.orderBy('publishedAt', 'desc');
        }
        
        const countSnapshot = await countQueryRef.count().get();
        const totalArticles = countSnapshot.data().count;
        const totalPages = Math.ceil(totalArticles / limit);
        
        const articlesSnapshot = await queryRef
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


async function getFirestoreArticleById(id: string): Promise<Article | undefined> {
    const doc = await db.collection('articles').doc(id).get();
    return doc.exists ? doc.data() as Article : undefined;
}

async function getFirestoreArticleBySlug(slug: string): Promise<Article | undefined> {
    const snapshot = await db.collection('articles').where('slug', '==', slug).limit(1).get();
    if (snapshot.empty) return undefined;
    return snapshot.docs[0].data() as Article;
}

async function getFirestoreUserById(id: string): Promise<User | undefined> {
    const doc = await db.collection('users').doc(id).get();
    return doc.exists ? doc.data() as User : undefined;
}

async function getFirestoreUserByEmail(email: string): Promise<User | undefined> {
    const snapshot = await db.collection('users').where('email', '==', email).limit(1).get();
    if (snapshot.empty) return undefined;
    return snapshot.docs[0].data() as User;
}

async function getFirestoreAllUsers(): Promise<User[]> {
    const snapshot = await db.collection('users').get();
    return snapshot.docs.map(doc => doc.data() as User);
}

async function getFirestoreAuthorById(id: string): Promise<Author | undefined> {
    const doc = await db.collection('authors').doc(id).get();
    return doc.exists ? doc.data() as Author : undefined;
}

async function getFirestoreAllAuthors(): Promise<Author[]> {
    const snapshot = await db.collection('authors').get();
    return snapshot.docs.map(doc => doc.data() as Author);
}

async function createFirestoreUser(user: Omit<User, 'id' | 'role'>): Promise<User> {
    const newUser: User = {
        id: `user-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        role: 'user',
        savedArticles: [],
        readingHistory: [],
        ...user
    };

    const existingUser = await getFirestoreUserByEmail(newUser.email);
    if (existingUser) {
        throw new Error('A user with this email already exists.');
    }
    await db.collection('users').doc(newUser.id).set(newUser);
    return newUser;
}

async function updateFirestoreUser(userId: string, data: Partial<User>): Promise<User | undefined> {
    const userRef = db.collection('users').doc(userId);
    
    // Firestore cannot accept undefined values. We need to clean the data object.
    const cleanedData = Object.entries(data).reduce((acc, [key, value]) => {
        if (value !== undefined) {
            acc[key as keyof Partial<User>] = value;
        }
        return acc;
    }, {} as Partial<User>);

    if(Object.keys(cleanedData).length > 0) {
        await userRef.update(cleanedData);
    }
    
    const updatedDoc = await userRef.get();
    return updatedDoc.data() as User | undefined;
}

async function createFirestoreArticle(data: Omit<Article, 'id' | 'publishedAt' | 'aiSummary' | 'slug'>): Promise<Article> {
    const slug = await translateForSlug(data.title);
    const newArticle: Article = {
        id: `article-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        publishedAt: new Date().toISOString(),
        slug: slug,
        aiSummary: data.content.join('\n\n').substring(0, 150) + '...', // Basic summary
        ...data,
    };
    await db.collection('articles').doc(newArticle.id).set(newArticle);
    return newArticle;
}

async function updateFirestoreArticle(articleId: string, data: Partial<Article>): Promise<Article | undefined> {
    if (data.title && !data.slug) {
        data.slug = await translateForSlug(data.title);
    }
    const articleRef = db.collection('articles').doc(articleId);
    await articleRef.update(data);
    const updatedDoc = await articleRef.get();
    return updatedDoc.data() as Article | undefined;
}

async function deleteFirestoreArticle(articleId: string): Promise<void> {
    await db.collection('articles').doc(articleId).delete();
}

async function deleteFirestoreUser(userId: string): Promise<void> {
    await db.collection('users').doc(userId).delete();
}

async function getFirestoreNotificationsForUser(userId: string): Promise<Notification[]> {
    const snapshot = await db.collection('notifications')
        .where('userId', '==', userId)
        .get();
    const notifications = snapshot.docs.map(doc => doc.data() as Notification);
    // Sort in-memory to avoid needing a composite index
    return notifications.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

async function getFirestoreAllMedia(): Promise<Media[]> {
    const snapshot = await db.collection('media').orderBy('uploadedAt', 'desc').get();
    return snapshot.docs.map(doc => doc.data() as Media);
}

async function createFirestoreMedia(data: Omit<Media, 'id' | 'uploadedAt'>): Promise<Media> {
    const newMedia: Media = {
        id: `media-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        uploadedAt: new Date().toISOString(),
        entityType: 'MEDIA',
        ...data,
    };
    await db.collection('media').doc(newMedia.id).set(newMedia);
    return newMedia;
}

async function getFirestoreAllComments(): Promise<Comment[]> {
    const snapshot = await db.collection('comments').orderBy('timestamp', 'desc').get();
    return snapshot.docs.map(doc => doc.data() as Comment);
}

async function updateFirestoreComment(commentId: string, data: Partial<Comment>): Promise<Comment | undefined> {
    const commentRef = db.collection('comments').doc(commentId);
    await commentRef.update(data);
    const updatedDoc = await commentRef.get();
    return updatedDoc.data() as Comment | undefined;
}

async function deleteFirestoreComment(commentId: string): Promise<void> {
    await db.collection('comments').doc(commentId).delete();
}

async function getFirestoreAllPages(): Promise<Page[]> {
    const snapshot = await db.collection('pages').orderBy('lastUpdatedAt', 'desc').get();
    return snapshot.docs.map(doc => doc.data() as Page);
}

async function getFirestorePageById(id: string): Promise<Page | undefined> {
    const doc = await db.collection('pages').doc(id).get();
    return doc.exists ? doc.data() as Page : undefined;
}

async function getFirestorePageBySlug(slug: string): Promise<Page | undefined> {
    const snapshot = await db.collection('pages').where('slug', '==', slug).limit(1).get();
    if (snapshot.empty) return undefined;
    return snapshot.docs[0].data() as Page;
}

async function createFirestorePage(data: Omit<Page, 'id' | 'slug' | 'publishedAt' | 'lastUpdatedAt'>): Promise<Page> {
    const now = new Date().toISOString();
    const slug = generateNonAiSlug(data.title);
    const newPage: Page = {
        id: `page-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        slug,
        publishedAt: now,
        lastUpdatedAt: now,
        entityType: 'PAGE',
        ...data,
    };
    await db.collection('pages').doc(newPage.id).set(newPage);
    return newPage;
}

async function updateFirestorePage(pageId: string, data: Partial<Page>): Promise<Page | undefined> {
    const pageRef = db.collection('pages').doc(pageId);
    await pageRef.update(data);
    const updatedDoc = await pageRef.get();
    return updatedDoc.data() as Page | undefined;
}

async function deleteFirestorePage(pageId: string): Promise<void> {
    await db.collection('pages').doc(pageId).delete();
}

async function getFirestoreAllPolls(): Promise<Poll[]> {
    const snapshot = await db.collection('polls').orderBy('createdAt', 'desc').get();
    return snapshot.docs.map(doc => doc.data() as Poll);
}

async function getFirestorePollById(id: string): Promise<Poll | undefined> {
    const doc = await db.collection('polls').doc(id).get();
    return doc.exists ? doc.data() as Poll : undefined;
}

async function createFirestorePoll(data: Omit<Poll, 'id' | 'createdAt'>): Promise<Poll> {
    const newPoll: Poll = {
        id: `poll-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        createdAt: new Date().toISOString(),
        entityType: 'POLL',
        ...data,
    };
    await db.collection('polls').doc(newPoll.id).set(newPoll);
    return newPoll;
}

async function updateFirestorePoll(pollId: string, data: Partial<Poll>): Promise<Poll | undefined> {
    const pollRef = db.collection('polls').doc(pollId);
    await pollRef.update(data);
    const updatedDoc = await pollRef.get();
    return updatedDoc.data() as Poll | undefined;
}

async function deleteFirestorePoll(pollId: string): Promise<void> {
    await db.collection('polls').doc(pollId).delete();
}

async function getFirestoreMenuItems(): Promise<MenuItem[]> {
    const doc = await db.collection('settings').doc('mainMenu').get();
    if (doc.exists) {
        return (doc.data()?.items as MenuItem[]) || [];
    }
    // Fallback to mock data if not found in Firestore
    return getMockMenuItems();
}

async function getFirestoreAllSubscribers(): Promise<Subscriber[]> {
    const snapshot = await db.collection('subscribers').where('isSubscribed', '==', true).get();
    return snapshot.docs.map(doc => doc.data() as Subscriber);
}

async function createFirestoreSubscriber(email: string): Promise<Subscriber | null> {
    const snapshot = await db.collection('subscribers').where('email', '==', email).limit(1).get();
    if (!snapshot.empty) {
        // User exists, just update their subscription status
        const doc = snapshot.docs[0];
        await doc.ref.update({ isSubscribed: true });
        return doc.data() as Subscriber;
    }

    const newSubscriber: Subscriber = {
        id: `sub-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        email,
        isSubscribed: true,
        subscribedAt: new Date().toISOString(),
        entityType: 'SUBSCRIBER',
    };
    await db.collection('subscribers').doc(newSubscriber.id).set(newSubscriber);
    return newSubscriber;
}

async function deleteFirestoreSubscriber(subscriberId: string): Promise<void> {
    await db.collection('subscribers').doc(subscriberId).delete();
}



// --- PUBLIC API ---

export async function getArticles(options: GetArticlesOptions): Promise<{ articles: Article[], totalPages: number }> {
    if (!useFirestore || !db) {
        return getMockArticles(options);
    }
    return getFirestoreArticles(options);
}

export async function getArticleById(id: string): Promise<Article | undefined> {
    if (!useFirestore || !db) return getMockArticleById(id);
    return getFirestoreArticleById(id);
}

export async function getArticleBySlug(slug: string): Promise<Article | undefined> {
    if (!useFirestore || !db) return getMockArticleBySlug(slug);
    return getFirestoreArticleBySlug(slug);
}

export async function getUserById(id: string): Promise<User | undefined> {
    if (!useFirestore || !db) return getMockUserById(id);
    return getFirestoreUserById(id);
}

export async function getUserByEmail(email: string): Promise<User | undefined> {
    if (!useFirestore || !db) return getMockUserByEmail(email);
    return getFirestoreUserByEmail(email);
}

export async function getAllUsers(): Promise<User[]> {
    if (!useFirestore || !db) return getMockAllUsers();
    return getFirestoreAllUsers();
}

export async function getAuthorById(id: string): Promise<Author | undefined> {
    if (!useFirestore || !db) return getMockAuthorById(id);
    return getFirestoreAuthorById(id);
}

export async function getAllAuthors(): Promise<Author[]> {
    if (!useFirestore || !db) return getMockAllAuthors();
    return getFirestoreAllAuthors();
}

export async function createUser(user: Omit<User, 'id' | 'role'>): Promise<User> {
    const newUser = (!useFirestore || !db) ? await createMockUser(user) : await createFirestoreUser(user);
    
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
    if (!useFirestore || !db) return updateMockUser(userId, data);
    return updateFirestoreUser(userId, data);
}

export async function createArticle(data: Omit<Article, 'id' | 'publishedAt' | 'aiSummary' | 'slug'>): Promise<Article> {
    const newArticle = (!useFirestore || !db) ? await createMockArticle(data) : await createFirestoreArticle(data);

    // AI Summary generation can be slow, so we do it after creating the article
    summarizeArticle({ articleContent: data.content.join('\n\n') })
        .then(({ summary }) => {
            updateArticle(newArticle.id, { aiSummary: summary });
        })
        .catch(e => console.error(`Could not generate summary for new article ${newArticle.id}`, e));

    return newArticle;
}

export async function updateArticle(articleId: string, data: Partial<Article>): Promise<Article | undefined> {
    if (!useFirestore || !db) return updateMockArticle(articleId, data);
    return updateFirestoreArticle(articleId, data);
}

export async function deleteArticle(articleId: string): Promise<void> {
    if (!useFirestore || !db) return deleteMockArticle(articleId);
    return deleteFirestoreArticle(articleId);
}

export async function deleteUser(userId: string): Promise<void> {
    if (!useFirestore || !db) return deleteMockUser(userId);
    return deleteFirestoreUser(userId);
}

export async function getAllPages(): Promise<Page[]> {
    if (!useFirestore || !db) return getMockAllPages();
    return getFirestoreAllPages();
}

export async function getPageById(id: string): Promise<Page | undefined> {
    if (!useFirestore || !db) return getMockPageById(id);
    return getFirestorePageById(id);
}

export async function getPageBySlug(slug: string): Promise<Page | undefined> {
    if (!useFirestore || !db) return getMockPageBySlug(slug);
    return getFirestorePageBySlug(slug);
}

export async function createPage(data: Omit<Page, 'id' | 'slug' | 'publishedAt' | 'lastUpdatedAt'>): Promise<Page> {
    if (!useFirestore || !db) return createMockPage(data);
    return createFirestorePage(data);
}

export async function updatePage(pageId: string, data: Partial<Page>): Promise<Page | undefined> {
    if (!useFirestore || !db) return updateMockPage(pageId, data);
    return updateFirestorePage(pageId, data);
}

export async function deletePage(pageId: string): Promise<void> {
    if (!useFirestore || !db) return deleteMockPage(pageId);
    return deleteFirestorePage(pageId);
}

export async function getAllPolls(): Promise<Poll[]> {
    if (!useFirestore || !db) return getMockAllPolls();
    return getFirestoreAllPolls();
}

export async function getPollById(id: string): Promise<Poll | undefined> {
    if (!useFirestore || !db) return getMockPollById(id);
    return getFirestorePollById(id);
}

export async function createPoll(data: Omit<Poll, 'id' | 'createdAt'>): Promise<Poll> {
    if (!useFirestore || !db) return createMockPoll(data);
    return createFirestorePoll(data);
}

export async function updatePoll(pollId: string, data: Partial<Poll>): Promise<Poll | undefined> {
    if (!useFirestore || !db) return updateMockPoll(pollId, data);
    return updateFirestorePoll(pollId, data);
}

export async function deletePoll(pollId: string): Promise<void> {
    if (!useFirestore || !db) return deleteMockPoll(pollId);
    return deleteFirestorePoll(pollId);
}

export async function getMenuItems(): Promise<MenuItem[]> {
    if (!useFirestore || !db) return getMockMenuItems();
    return getFirestoreMenuItems();
}

export async function getAllSubscribers(): Promise<Subscriber[]> {
    if (!useFirestore || !db) return getMockAllSubscribers();
    return getFirestoreAllSubscribers();
}

export async function createSubscriber(email: string): Promise<Subscriber | null> {
    if (!useFirestore || !db) return createMockSubscriber(email);
    return createFirestoreSubscriber(email);
}

export async function deleteSubscriber(subscriberId: string): Promise<void> {
    if (!useFirestore || !db) return deleteMockSubscriber(subscriberId);
    return deleteFirestoreSubscriber(subscriberId);
}


// --- NON-CRUD APIs ---

export async function getMemeNews(): Promise<MemeNews[]> {
  return mockDb.memeNews;
}

export async function getNotificationsForUser(userId: string): Promise<Notification[]> {
    if (!useFirestore || !db) return getMockNotificationsForUser(userId);
    return getFirestoreNotificationsForUser(userId);
}

export async function getAllMedia(): Promise<Media[]> {
    if (!useFirestore || !db) return getMockAllMedia();
    return getFirestoreAllMedia();
}

export async function createMedia(data: Omit<Media, 'id' | 'uploadedAt'>): Promise<Media> {
    if (!useFirestore || !db) return createMockMedia(data);
    return createFirestoreMedia(data);
}

export async function getAllComments(): Promise<Comment[]> {
    if (!useFirestore || !db) return getMockAllComments();
    return getFirestoreAllComments();
}

export async function updateComment(commentId: string, data: Partial<Comment>): Promise<Comment | undefined> {
    if (!useFirestore || !db) return updateMockComment(commentId, data);
    return updateFirestoreComment(commentId, data);
}

export async function deleteComment(commentId: string): Promise<void> {
    if (!useFirestore || !db) return deleteMockComment(commentId);
    return deleteFirestoreComment(commentId);
}
