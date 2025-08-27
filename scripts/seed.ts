import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { mockDb } from '../src/lib/data';
import { config } from 'dotenv';

// Load environment variables from .env file at the root of the project
config({ path: '.env' });

const useMockData = !process.env.AWS_REGION || 
                    process.env.AWS_REGION === 'your_aws_region' ||
                    !process.env.AWS_ACCESS_KEY_ID ||
                    process.env.AWS_ACCESS_KEY_ID === 'your_access_key' ||
                    !process.env.AWS_SECRET_ACCESS_KEY ||
                    process.env.AWS_SECRET_ACCESS_KEY === 'your_secret_key';

if (useMockData) {
    console.log("AWS credentials are not configured in your .env file.");
    console.log("Please configure your AWS credentials to seed the database.");
    process.exit(0);
}

const client = new DynamoDBClient({ 
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    }
});

const docClient = DynamoDBDocumentClient.from(client);
const tableName = process.env.DYNAMODB_TABLE_NAME || 'BartaNow_News';

async function seedDatabase() {
    console.log(`Starting to seed database: ${tableName}`);

    const putRequests = mockDb.articles.map(article => {
        const item = {
            ...article,
            entityType: 'ARTICLE' // Adding the GSI partition key
        };

        const command = new PutCommand({
            TableName: tableName,
            Item: item
        });
        return docClient.send(command);
    });

    try {
        await Promise.all(putRequests);
        console.log(`Successfully seeded ${mockDb.articles.length} articles.`);
    } catch (error) {
        console.error("Error seeding database:", error);
    }
}

seedDatabase();
