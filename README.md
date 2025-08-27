# Oftern News - Next.js Starter Project

Welcome to Oftern News, a professional starter project for a modern news website. This project is built with Next.js and Tailwind CSS, demonstrating best practices for server-side rendering (SSR), API design, and component architecture.

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Local Development](#local-development)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the App](#running-the-app)
- [Environment Variables](#environment-variables)
- [Connecting to a Real Database (DynamoDB)](#connecting-to-a-real-database-dynamodb)
- [Deployment Hints](#deployment-hints)
  - [Vercel/Netlify/Firebase App Hosting](#vercelnetlifyfirebase-app-hosting)
  - [AWS ECS/Fargate (as requested)](#aws-ecsfargate-as-requested)

## Project Overview

This starter provides the foundation for a high-performance, SEO-friendly news portal. Instead of a separate Node.js/Express backend, it leverages the full-stack capabilities of Next.js, using Server Components and API Route Handlers for data fetching. This simplifies the architecture, improves performance, and reduces maintenance overhead.

The data layer is currently mocked to simulate a DynamoDB single-table design, making it easy to swap in a real database connection.

## Features

- **Server-Side Rendering (SSR):** Homepage and article pages are rendered on the server for fast initial loads and excellent SEO.
- **Responsive Design:** A clean, professional UI built with Tailwind CSS that works on all devices.
- **Article Display:** Fetches and displays a list of articles on the homepage and individual articles on dedicated pages.
- **Pagination:** Simple "Next" and "Previous" navigation for browsing articles.
- **AI-Powered Summaries:** Uses a GenAI flow to generate concise article summaries, perfect for previews and SEO meta descriptions.
- **SEO Optimized:** Dynamic metadata generation for article pages.

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (with App Router)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [Shadcn/ui](https://ui.shadcn.com/)
- **Language:** TypeScript
- **Icons:** [Lucide React](https://lucide.dev/)
- **AI Integration:** [Genkit](https://firebase.google.com/docs/genkit)

## Project Structure

Here's a high-level overview of the key files and directories:

```
/
├── src/
│   ├── app/
│   │   ├── articles/[id]/page.tsx  # Dynamic page for a single article
│   │   ├── layout.tsx              # Root layout
│   │   ├── globals.css             # Global styles and theme variables
│   │   └── page.tsx                # Homepage
│   ├── components/
│   │   ├── article-card.tsx        # Card for article previews
│   │   ├── header.tsx              # Site header
│   │   ├── footer.tsx              # Site footer
│   │   └── ui/                     # Shadcn UI components
│   ├── lib/
│   │   ├── api.ts                  # Data fetching functions (simulates DB access)
│   │   ├── data.ts                 # Mock seed data
│   │   └── types.ts                # TypeScript type definitions
│   └── ai/
│       └── flows/summarize-article.ts # GenAI flow for article summarization
├── public/                       # Static assets
└── tailwind.config.ts            # Tailwind CSS configuration
```

## Local Development

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v18 or later)
- npm, yarn, or pnpm

### Installation

1.  Clone the repository:
    ```bash
    git clone <repository-url>
    cd oftern-news
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```

### Running the App

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:9002`.

## Environment Variables

While the current setup uses mock data and doesn't require environment variables, a production application connecting to AWS would need them. Create a `.env.local` file in the root of your project:

```
# AWS Credentials for DynamoDB
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=your_aws_region

# DynamoDB Table Name
DYNAMODB_TABLE_NAME=Oftern_News
```

## Connecting to a Real Database (DynamoDB)

To switch from mock data to a real DynamoDB instance, you'll primarily modify `src/lib/api.ts`.

1.  **Install AWS SDK:**
    ```bash
    npm install @aws-sdk/client-dynamodb @aws-sdk/lib-dynamodb
    ```

2.  **Set up DynamoDB Local (Optional):**
    For local testing, you can use [DynamoDB Local](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DynamoDBLocal.html). Follow the official guide to download and run it. You would then configure the DynamoDB client to point to your local endpoint.

3.  **Update `src/lib/api.ts`:**
    Replace the mock data imports with the DynamoDB Document Client and implement the query logic.

    *Example `src/lib/api.ts` with DynamoDB:*
    ```typescript
    import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
    import { DynamoDBDocumentClient, QueryCommand, GetCommand } from "@aws-sdk/lib-dynamodb";
    import { Article } from "./types";

    const client = new DynamoDBClient({ region: process.env.AWS_REGION });
    const docClient = DynamoDBDocumentClient.from(client);
    const tableName = process.env.DYNAMODB_TABLE_NAME;

    export async function getArticles({ page = 1, limit = 6 }) {
      // DynamoDB pagination is more complex, often using LastEvaluatedKey
      const command = new QueryCommand({
        TableName: tableName,
        IndexName: 'PublishedAtIndex', // Assuming a GSI on publishedAt
        KeyConditionExpression: 'EntityType = :type',
        ExpressionAttributeValues: {
          ':type': 'ARTICLE',
        },
        ScanIndexForward: false, // Sort descending
        Limit: limit,
        // Add ExclusiveStartKey for pagination
      });
      const { Items, Count } = await docClient.send(command);
      return { articles: Items as Article[], totalPages: Math.ceil(Count / limit) };
    }

    export async function getArticleById(id: string) {
      const command = new GetCommand({
        TableName: tableName,
        Key: {
          PK: `ARTICLE#${id}`,
          SK: `ARTICLE#${id}`,
        },
      });
      const { Item } = await docClient.send(command);
      return Item as Article | undefined;
    }
    ```

## Deployment Hints

### Vercel/Netlify/Firebase App Hosting

The easiest way to deploy a Next.js application is with a platform that has first-class support for it. Connect your Git repository to a provider like Vercel, and it will handle the build and deployment process automatically.

### AWS ECS/Fargate (as requested)

Deploying a Next.js app on ECS/Fargate is more complex and suitable for environments with specific containerization requirements.

1.  **Containerize the App:** Create a `Dockerfile` in your project root.
    ```dockerfile
    # Install dependencies only when needed
    FROM node:18-alpine AS deps
    WORKDIR /app
    COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
    RUN \
      if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
      elif [ -f package-lock.json ]; then npm ci; \
      elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i --frozen-lockfile; \
      else echo "Lockfile not found." && exit 1; \
      fi

    # Rebuild the source code only when needed
    FROM node:18-alpine AS builder
    WORKDIR /app
    COPY --from=deps /app/node_modules ./node_modules
    COPY . .
    # This will do the trick, use the corresponding env file for each environment.
    ENV NEXT_TELEMETRY_DISABLED 1
    RUN npm run build

    # Production image, copy all the files and run next
    FROM node:18-alpine AS runner
    WORKDIR /app
    ENV NODE_ENV production
    ENV NEXT_TELEMETRY_DISABLED 1
    # You may want to use a non-root user for security
    # RUN addgroup --system --gid 1001 nodejs
    # RUN adduser --system --uid 1001 nextjs
    # USER nextjs
    COPY --from=builder /app/public ./public
    COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
    COPY --from=builder /app/node_modules ./node_modules
    COPY --from=builder /app/package.json ./package.json

    CMD ["npm", "start", "-p", "80"]
    ```

2.  **Push to ECR:** Build the Docker image and push it to Amazon Elastic Container Registry (ECR).

3.  **Set up ECS/Fargate:**
    -   Create an ECS Cluster.
    -   Create a Task Definition pointing to your ECR image, defining CPU/memory, and passing environment variables for your database credentials.
    -   Create an ECS Service that runs your Task Definition.
    -   Set up an Application Load Balancer (ALB) to route traffic to your service's tasks.

4.  **Static Assets:** For better performance, you would typically serve static assets (`/_next/static`) from an S3 bucket via a CloudFront distribution, rather than from the Next.js server itself. This requires custom configuration in your `next.config.ts` (`assetPrefix`) and routing rules in your ALB.
