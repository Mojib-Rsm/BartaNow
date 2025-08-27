import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { mockDb } from '../src/lib/data';
import { config } from 'dotenv';

// Load environment variables from .env file at the root of the project
config({ path: '.env' });

export async function seedDatabase() {
    const useMockData = !process.env.AWS_REGION || 
                        process.env.AWS_REGION === 'your_aws_region' ||
                        !process.env.AWS_ACCESS_KEY_ID ||
                        process.env.AWS_ACCESS_KEY_ID === 'your_access_key' ||
                        !process.env.AWS_SECRET_ACCESS_KEY ||
                        process.env.AWS_SECRET_ACCESS_KEY === 'your_secret_key';

    if (useMockData) {
        throw new Error("AWS credentials are not configured in your .env file.");
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
        const successMessage = `Successfully seeded ${mockDb.articles.length} articles.`;
        console.log(successMessage);
        return { success: true, message: successMessage };
    } catch (error) {
        console.error("Error seeding database:", error);
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
        return { success: false, message: `Error seeding database: ${errorMessage}` };
    }
}

// This allows the script to be run directly from the command line
if (require.main === module) {
    seedDatabase().catch(err => {
        console.error(err);
        process.exit(1);
    });
}
