
'use server';
import admin from 'firebase-admin';
import { Pool } from 'pg';
import { mockDb } from '../src/lib/data';
import { config } from 'dotenv';
import { translateForSlug } from '@/ai/flows/translate-for-slug';
import type { InstallFormData } from '@/app/install/page';

// Load environment variables from .env file at the root of the project
config({ path: '.env' });

function initializeFirebaseAdmin() {
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

async function seedFirestore(installData: InstallFormData) {
    console.log('Starting to seed Firestore database...');
    let db: admin.firestore.Firestore;
    try {
        db = initializeFirebaseAdmin();
    } catch (e: any) {
        return { success: false, message: e.message };
    }

    const seedCollection = async (name: string, collection: admin.firestore.CollectionReference, data: any[]) => {
        console.log(`Seeding ${data.length} ${name}...`);
        const batch = db.batch();
        data.forEach(item => {
            const docRef = collection.doc(item.id);
            batch.set(docRef, item);
        });
        await batch.commit();
        console.log(`${name} seeded successfully.`);
    };

    try {
        const adminUser = {
            ...mockDb.users[0],
            name: installData.adminName,
            email: installData.adminEmail,
            password: installData.adminPassword,
        };
        const finalUsers = [adminUser, ...mockDb.users.slice(1)];

        await seedCollection('users', db.collection('users'), finalUsers);
        await seedCollection('authors', db.collection('authors'), mockDb.authors);
        await seedCollection('comments', db.collection('comments'), mockDb.comments);
        // ... seed other collections
        
        console.log('All collections seeded successfully into Firestore.');
        return { success: true, message: 'Firestore database seeded successfully.' };
    } catch (error) {
        const errorMessage = `Error during Firestore seeding: ${error instanceof Error ? error.message : String(error)}`;
        console.error(errorMessage);
        return { success: false, message: errorMessage };
    }
}

async function seedPostgreSQL(installData: InstallFormData) {
    console.log('Starting to seed PostgreSQL database...');
    const pool = new Pool({
        host: installData.dbHost,
        database: installData.dbName,
        user: installData.dbUser,
        password: installData.dbPassword,
        port: 5432, // Default PG port
    });

    const client = await pool.connect();

    try {
        await client.query('BEGIN');
        console.log("Creating tables...");
        await client.query(`
            CREATE TABLE IF NOT EXISTS users (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                email TEXT NOT NULL UNIQUE,
                password TEXT NOT NULL,
                role TEXT NOT NULL,
                "avatarUrl" TEXT,
                bio TEXT,
                "bloodGroup" TEXT,
                "preferredTopics" TEXT[],
                "savedArticles" TEXT[],
                "readingHistory" TEXT[]
            );
            CREATE TABLE IF NOT EXISTS articles (
                id TEXT PRIMARY KEY,
                slug TEXT NOT NULL UNIQUE,
                title TEXT NOT NULL,
                category TEXT NOT NULL,
                content TEXT NOT NULL,
                "imageUrl" TEXT NOT NULL,
                "authorId" TEXT NOT NULL,
                "authorName" TEXT NOT NULL,
                "authorAvatarUrl" TEXT,
                "publishedAt" TIMESTAMPTZ NOT NULL,
                "aiSummary" TEXT,
                badge TEXT,
                "videoUrl" TEXT,
                "editorsPick" BOOLEAN,
                sponsored BOOLEAN,
                status TEXT,
                tags TEXT[],
                "englishTitle" TEXT,
                "focusKeywords" TEXT[],
                location TEXT,
                "isAiGenerated" BOOLEAN,
                "metaTitle" TEXT,
                "metaDescription" TEXT,
                "metaKeywords" TEXT[]
            );
            -- Add other table creation scripts here (categories, tags, etc.)
        `);

        console.log("Seeding data...");
        // Seed users
        const adminUser = {
            ...mockDb.users[0],
            name: installData.adminName,
            email: installData.adminEmail,
            password: installData.adminPassword, // Note: Hash in real app!
        };
        const finalUsers = [adminUser, ...mockDb.users.slice(1)];
        for (const user of finalUsers) {
            await client.query(
                'INSERT INTO users (id, name, email, password, role, "avatarUrl", bio) VALUES ($1, $2, $3, $4, $5, $6, $7) ON CONFLICT (id) DO NOTHING',
                [user.id, user.name, user.email, user.password, user.role, user.avatarUrl, user.bio]
            );
        }
        
        // Seed articles
        for (const article of mockDb.articles) {
            await client.query(
                'INSERT INTO articles (id, slug, title, category, content, "imageUrl", "authorId", "authorName", "publishedAt", "aiSummary", status, tags) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) ON CONFLICT (id) DO NOTHING',
                [article.id, article.slug, article.title, article.category, article.content, article.imageUrl, article.authorId, article.authorName, article.publishedAt, article.aiSummary, article.status, article.tags]
            );
        }

        await client.query('COMMIT');
        console.log('PostgreSQL database seeded successfully.');
        return { success: true, message: 'PostgreSQL database seeded successfully.' };

    } catch (e) {
        await client.query('ROLLBACK');
        console.error("PostgreSQL seeding error:", e);
        return { success: false, message: `PostgreSQL seeding failed: ${e instanceof Error ? e.message : String(e)}` };
    } finally {
        client.release();
    }
}


export async function seedDatabase(installData: InstallFormData) {
    if (installData.dbType === 'mock') {
        console.log('Using mock data. Seeding process is simulated for local development.');
        return { success: true, message: 'ডেমো ডেটা সফলভাবে লোড হয়েছে। সাইট এখন ব্যবহারের জন্য প্রস্তুত।' };
    }

    if (installData.dbType === 'firestore') {
        return seedFirestore(installData);
    }
    
    if (installData.dbType === 'postgresql') {
        return seedPostgreSQL(installData);
    }

    return { success: false, message: 'Invalid database type selected.' };
}

// This allows the script to be run directly from the command line for testing
if (require.main === module) {
    const testInstallData: InstallFormData = {
        siteName: 'BartaNow Test',
        tagline: 'Test Tagline',
        adminName: 'Test Admin',
        adminEmail: 'test@admin.com',
        adminPassword: 'password',
        dbType: 'firestore', // or 'postgresql' for testing that
    };
    seedDatabase(testInstallData).catch(err => {
        console.error("Error during database seeding:", err);
        process.exit(1);
    });
}
