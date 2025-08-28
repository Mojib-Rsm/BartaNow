
import admin from 'firebase-admin';
import { mockDb } from '../src/lib/data';
import { config } from 'dotenv';

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

export async function seedDatabase() {
  console.log('Starting to seed Firestore database...');

  // Seed Authors
  console.log(`Seeding ${mockDb.authors.length} authors...`);
  const authorPromises = mockDb.authors.map(author => 
    authorsCollection.doc(author.id).set(author)
  );
  await Promise.all(authorPromises);
  console.log('Authors seeded successfully.');
  
  // Seed Articles
  console.log(`Seeding ${mockDb.articles.length} articles...`);
  const articlePromises = mockDb.articles.map(article =>
    articlesCollection.doc(article.id).set(article)
  );
  await Promise.all(articlePromises);
  console.log('Articles seeded successfully.');

  // Seed Users
  console.log(`Seeding ${mockDb.users.length} users...`);
  const userPromises = mockDb.users.map(user =>
    usersCollection.doc(user.id).set(user)
  );
  await Promise.all(userPromises);
  console.log('Users seeded successfully.');
  
  const successMessage = `Successfully seeded ${mockDb.articles.length} articles, ${mockDb.authors.length} authors, and ${mockDb.users.length} users into Firestore.`;
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
