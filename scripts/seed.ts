
'use server';
import admin from 'firebase-admin';
import { mockDb } from '../src/lib/data';
import { config } from 'dotenv';
import { translateForSlug } from '@/ai/flows/translate-for-slug';
import type { InstallFormData } from '@/app/install/page';

// Load environment variables from .env file at the root of the project
config({ path: '.env' });

function initializeFirebaseAdmin(dbType: 'firestore' | 'mock') {
    if (dbType !== 'firestore') {
        return null; // Don't initialize for mock DB
    }
    // Initialize Firebase Admin SDK only if not already initialized
    if (admin.apps.length === 0) {
        try {
            const serviceAccountJson = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;
            if (!serviceAccountJson) {
                throw new Error("GOOGLE_APPLICATION_CREDENTIALS_JSON environment variable not set. Please provide your Firebase service account key.");
            }
            const serviceAccount = JSON.parse(serviceAccountJson);
        
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
            });
            console.log("Firebase Admin SDK initialized successfully for seeding.");
        } catch (error) {
            console.error("Fatal Error: Could not initialize Firebase Admin SDK for seeding.", error);
            throw new Error(`Fatal Error: Could not initialize Firebase Admin SDK for seeding. ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    return admin.firestore();
}

async function seedCollection(db: admin.firestore.Firestore, name: string, collection: admin.firestore.CollectionReference, data: any[]) {
    console.log(`Seeding ${data.length} ${name}...`);
    const batch = db.batch();
    data.forEach(item => {
        const docRef = collection.doc(item.id);
        batch.set(docRef, item);
    });
    await batch.commit();
    console.log(`${name} seeded successfully.`);
}

export async function seedDatabase(installData: InstallFormData) {
  if (installData.dbType === 'mock') {
      console.log('Using mock data. Seeding process is simulated for local development.');
      // In local dev, the data is already in memory from `data.ts`.
      // We return a success message to confirm to the user that the action was acknowledged.
      return { success: true, message: 'ডেমো ডেটা সফলভাবে লোড হয়েছে। সাইট এখন ব্যবহারের জন্য প্রস্তুত।' };
  }
    
  console.log('Starting to seed Firestore database...');
  
  let db: admin.firestore.Firestore | null;
  try {
    db = initializeFirebaseAdmin(installData.dbType);
    if (!db) {
        throw new Error("Database could not be initialized.");
    }
  } catch (e: any) {
    return { success: false, message: e.message };
  }
  
  const articlesCollection = db.collection('articles');
  const usersCollection = db.collection('users');
  const authorsCollection = db.collection('authors');
  const commentsCollection = db.collection('comments');
  const mediaCollection = db.collection('media');
  const pagesCollection = db.collection('pages');
  const pollsCollection = db.collection('polls');
  const categoriesCollection = db.collection('categories');
  const tagsCollection = db.collection('tags');
  const rssFeedsCollection = db.collection('rssFeeds');
  const menuItemsCollection = db.collection('menuItems');
  const locationsCollection = db.collection('locations');


  try {
    // Modify users based on installData before seeding
    const adminUser = {
        ...mockDb.users[0], // Take the base admin user from mock
        name: installData.adminName,
        email: installData.adminEmail,
        password: installData.adminPassword, // Note: In a real app, hash this!
    };
    const otherUsers = mockDb.users.slice(1);
    const finalUsers = [adminUser, ...otherUsers];

    await seedCollection(db, 'users', usersCollection, finalUsers);
    await seedCollection(db, 'authors', authorsCollection, mockDb.authors);
    await seedCollection(db, 'comments', commentsCollection, mockDb.comments);
    await seedCollection(db, 'media', mediaCollection, mockDb.media);
    await seedCollection(db, 'pages', pagesCollection, mockDb.pages);
    await seedCollection(db, 'polls', pollsCollection, mockDb.polls);
    await seedCollection(db, 'categories', categoriesCollection, mockDb.categories);
    await seedCollection(db, 'tags', tagsCollection, mockDb.tags);
    await seedCollection(db, 'rssFeeds', rssFeedsCollection, mockDb.rssFeeds);
    await seedCollection(db, 'menuItems', menuItemsCollection, mockDb.menuItems);
    await seedCollection(db, 'locations', locationsCollection, mockDb.locations);
    
    // Seed Articles with AI-generated slugs
    console.log(`Generating slugs and seeding ${mockDb.articles.length} articles...`);
    console.log("This may take a few moments as it requires AI calls for each title.");

    const articlePromises = mockDb.articles.map(async (article, index) => {
      try {
        const { slug, englishTitle } = await translateForSlug(article.title);
        const articleWithSlug = { ...article, slug, englishTitle };
        console.log(`[${index + 1}/${mockDb.articles.length}] Generated slug: "${slug}" for title: "${article.title}"`);
        return articlesCollection.doc(article.id).set(articleWithSlug);
      } catch (e) {
        console.error(`Failed to generate slug for article: "${article.title}". Error:`, e);
        // Fallback to a non-AI slug if the AI call fails
        const fallbackSlug = article.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\p{L}\p{N}-]/gu, '');
        const articleWithFallbackSlug = { ...article, slug: fallbackSlug };
        return articlesCollection.doc(article.id).set(articleWithFallbackSlug);
      }
    });

    await Promise.all(articlePromises);
    console.log('Articles seeded successfully with generated slugs.');
    
    const successMessage = `Successfully seeded all collections into Firestore.`;
    console.log(successMessage);
    return { success: true, message: successMessage };

  } catch (error) {
      const errorMessage = `Error during database seeding: ${error instanceof Error ? error.message : String(error)}`;
      console.error(errorMessage);
      return { success: false, message: errorMessage };
  }
}

// This allows the script to be run directly from the command line for testing
if (require.main === module) {
    const testInstallData: InstallFormData = {
        siteName: 'BartaNow Test',
        tagline: 'Test Tagline',
        adminName: 'Test Admin',
        adminEmail: 'test@admin.com',
        adminPassword: 'password',
        dbType: 'firestore',
    };
    seedDatabase(testInstallData).catch(err => {
        console.error("Error during database seeding:", err);
        process.exit(1);
    });
}
