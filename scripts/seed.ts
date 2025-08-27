
import { DynamoDBClient, CreateTableCommand, DescribeTableCommand, ResourceNotFoundException } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { mockDb } from '../src/lib/data';
import { config } from 'dotenv';

// Load environment variables from .env file at the root of the project
config({ path: '.env' });

const newsTableName = process.env.DYNAMODB_TABLE_NAME || 'BartaNow_News';
const usersTableName = 'BartaNow_Users';
const newsIndexName = 'PublishedAtIndex';

async function waitForTable(client: DynamoDBClient, tableName: string) {
    let tableStatus = '';
    do {
        try {
            console.log(`Checking status of table: ${tableName}...`);
            const command = new DescribeTableCommand({ TableName: tableName });
            const { Table } = await client.send(command);
            tableStatus = Table?.TableStatus || '';
            if (tableStatus !== 'ACTIVE') {
                await new Promise(resolve => setTimeout(resolve, 5000)); // wait 5 seconds
            }
        } catch (error) {
            console.error(`Error describing table: ${tableName}:`, error);
            throw error;
        }
    } while (tableStatus !== 'ACTIVE');
    console.log(`Table ${tableName} is ACTIVE.`);
}


async function createBartaNowNewsTable(client: DynamoDBClient) {
    console.log(`Creating table '${newsTableName}' with index '${newsIndexName}'...`);
    const command = new CreateTableCommand({
        TableName: newsTableName,
        AttributeDefinitions: [
            { AttributeName: 'id', AttributeType: 'S' },
            { AttributeName: 'entityType', AttributeType: 'S' },
            { AttributeName: 'publishedAt', AttributeType: 'S' },
        ],
        KeySchema: [
            { AttributeName: 'id', KeyType: 'HASH' }
        ],
        GlobalSecondaryIndexes: [
            {
                IndexName: newsIndexName,
                KeySchema: [
                    { AttributeName: 'entityType', KeyType: 'HASH' },
                    { AttributeName: 'publishedAt', KeyType: 'RANGE' }
                ],
                Projection: {
                    ProjectionType: 'ALL'
                },
                ProvisionedThroughput: {
                    ReadCapacityUnits: 1,
                    WriteCapacityUnits: 1
                }
            }
        ],
        ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1
        }
    });

    try {
        await client.send(command);
        console.log(`Table '${newsTableName}' creation request sent. Waiting for it to become active...`);
        await waitForTable(client, newsTableName);
        console.log(`Table '${newsTableName}' created successfully.`);
        return true;
    } catch (error) {
        console.error(`Error creating table '${newsTableName}':`, error);
        throw error;
    }
}

async function createBartaNowUsersTable(client: DynamoDBClient) {
    console.log(`Creating table '${usersTableName}'...`);
    const command = new CreateTableCommand({
        TableName: usersTableName,
        AttributeDefinitions: [
            { AttributeName: 'id', AttributeType: 'S' },
            { AttributeName: 'email', AttributeType: 'S' },
        ],
        KeySchema: [
            { AttributeName: 'id', KeyType: 'HASH' }
        ],
        GlobalSecondaryIndexes: [
            {
                IndexName: 'EmailIndex',
                KeySchema: [
                    { AttributeName: 'email', KeyType: 'HASH' }
                ],
                 Projection: {
                    ProjectionType: 'ALL'
                },
                ProvisionedThroughput: {
                    ReadCapacityUnits: 1,
                    WriteCapacityUnits: 1
                }
            }
        ],
        ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1
        }
    });

    try {
        await client.send(command);
        console.log(`Table '${usersTableName}' creation request sent. Waiting for it to become active...`);
        await waitForTable(client, usersTableName);
        console.log(`Table '${usersTableName}' created successfully.`);
        return true;
    } catch (error) {
        console.error(`Error creating table '${usersTableName}':`, error);
        throw error;
    }
}

async function checkAndCreateTable(client: DynamoDBClient, tableName: string, createTableFn: (client: DynamoDBClient) => Promise<boolean>) {
     try {
        const describeCommand = new DescribeTableCommand({ TableName: tableName });
        await client.send(describeCommand);
        console.log(`Table '${tableName}' already exists.`);
    } catch (error) {
        if (error instanceof ResourceNotFoundException) {
            console.log(`Table '${tableName}' not found. Attempting to create it...`);
            try {
                await createTableFn(client);
            } catch (creationError) {
                const errorMessage = `Failed to create DynamoDB table ${tableName}. Please check your IAM permissions and AWS console. Error: ${creationError instanceof Error ? creationError.message : String(creationError)}`;
                throw new Error(errorMessage);
            }
        } else {
            console.error(`Error checking for table ${tableName}:`, error);
            const errorMessage = `An error occurred while checking for the DynamoDB table ${tableName}: ${error instanceof Error ? error.message : String(error)}`;
            throw new Error(errorMessage);
        }
    }
}


export async function seedDatabase() {
    const isAwsConfigured = process.env.AWS_REGION &&
                            process.env.AWS_REGION !== 'your_aws_region' &&
                            process.env.AWS_ACCESS_KEY_ID &&
                            process.env.AWS_ACCESS_KEY_ID !== 'your_access_key' &&
                            process.env.AWS_SECRET_ACCESS_KEY &&
                            process.env.AWS_SECRET_ACCESS_KEY !== 'your_secret_key';

    if (!isAwsConfigured) {
        const message = "AWS credentials are not configured in your .env file. Please add valid credentials to seed the database.";
        console.error(message);
        return { success: false, message: message };
    }

    const client = new DynamoDBClient({
        region: process.env.AWS_REGION,
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
        }
    });

    try {
        await checkAndCreateTable(client, newsTableName, createBartaNowNewsTable);
        await checkAndCreateTable(client, usersTableName, createBartaNowUsersTable);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return { success: false, message: errorMessage };
    }


    const docClient = DynamoDBDocumentClient.from(client);
    
    // Seed News Table
    console.log(`Starting to seed database: ${newsTableName}`);
    const newsItems = [
        ...mockDb.articles.map(item => ({ ...item, entityType: 'ARTICLE' })),
        ...mockDb.authors.map(item => ({ ...item, entityType: 'AUTHOR' })),
    ];
    const newsPutRequests = newsItems.map(item => {
        const command = new PutCommand({
            TableName: newsTableName,
            Item: item
        });
        return docClient.send(command);
    });

     // Seed Users Table
    console.log(`Starting to seed database: ${usersTableName}`);
    const usersPutRequests = mockDb.users.map(user => {
        const command = new PutCommand({
            TableName: usersTableName,
            Item: user,
        });
        return docClient.send(command);
    });


    try {
        await Promise.all([...newsPutRequests, ...usersPutRequests]);
        const successMessage = `Successfully seeded ${mockDb.articles.length} articles and ${mockDb.authors.length} authors into ${newsTableName}. Successfully seeded ${mockDb.users.length} users into ${usersTableName}.`;
        console.log(successMessage);
        return { success: true, message: successMessage };
    } catch (error) {
        console.error("Error seeding database:", error);
        let errorMessage = "An unknown error occurred during seeding.";
        if (error instanceof Error) {
            if (error.name === 'UnrecognizedClientException' || error.message.includes('Invalid security token')) {
                errorMessage = "Error seeding database: The security token included in the request is invalid. Please check your AWS credentials in the .env file.";
            } else {
                errorMessage = `Error seeding database: ${error.message}`;
            }
        }
        return { success: false, message: errorMessage };
    }
}

// This allows the script to be run directly from the command line
if (require.main === module) {
    seedDatabase().catch(err => {
        console.error(err);
        process.exit(1);
    });
}

    