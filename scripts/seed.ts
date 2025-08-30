
import admin from 'firebase-admin';
import { mockDb } from '../src/lib/data';
import { config } from 'dotenv';
import { translateForSlug } from '@/ai/flows/translate-for-slug';

// Load environment variables from .env file at the root of the project
config({ path: '.env' });

// Initialize Firebase Admin SDK
try {
  const serviceAccountJson = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;
  if (!serviceAccountJson) {
    throw new Error("GOOGLE_APPLICATION_CREDENTIALS_JSON environment variable not set. Please provide your Firebase service account key.");
  }
  const serviceAccount = JSON.parse(serviceAccountJson);
  
  if (admin.apps.length === 0) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
  }
} catch (error) {
    console.error("Error initializing Firebase Admin SDK:", error);
    process.exit(1);
}

const db = admin.firestore();

const articlesCollection = db.collection('articles');
const usersCollection = db.collection('users');
const authorsCollection = db.collection('authors');
const commentsCollection = db.collection('comments');
const mediaCollection = db.collection('media');

async function seedCollection(name: string, collection: admin.firestore.CollectionReference, data: any[]) {
    console.log(`Seeding ${data.length} ${name}...`);
    const batch = db.batch();
    data.forEach(item => {
        const docRef = collection.doc(item.id);
        batch.set(docRef, item);
    });
    await batch.commit();
    console.log(`${name} seeded successfully.`);
}

export async function seedDatabase() {
  console.log('Starting to seed Firestore database...');

  // Seed Authors, Users, Comments, Media first
  await seedCollection('authors', authorsCollection, mockDb.authors);
  await seedCollection('users', usersCollection, mockDb.users);
  await seedCollection('comments', commentsCollection, mockDb.comments);
  await seedCollection('media', mediaCollection, mockDb.media);
  
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
  
  const successMessage = `Successfully seeded ${mockDb.articles.length} articles, ${mockDb.authors.length} authors, ${mockDb.users.length} users, ${mockDb.comments.length} comments, and ${mockDb.media.length} media items into Firestore.`;
  console.log(successMessage);
  return { success: true, message: successMessage };
}

// This allows the script to be run directly from the command line
if (require.main === module) {
    seedDatabase().catch(err => {
        console.error("Error during database seeding:", err);
        process.exit(1);
    });
}
