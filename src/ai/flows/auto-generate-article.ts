
'use server';

/**
 * @fileOverview A flow for automatically generating a full news article from a single keyword.
 * This flow is designed for unattended execution (e.g., via a cron job).
 *
 * - autoGenerateArticle - A function that generates a full article.
 * - AutoGenerateArticleInput - The input type for the function.
 * - AutoGenerateArticleOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { uploadImage } from '@/lib/imagekit';
import { generateNonAiSlug } from '@/lib/utils';
import { translateForSlug } from './translate-for-slug';

const AutoGenerateArticleInputSchema = z.object({
  keyword: z.string().describe('The keyword or topic for the news article.'),
  language: z.enum(['Bengali', 'English']).default('Bengali'),
  wordCount: z.enum(['700', '1000', '1500', '2000']).default('700'),
  category: z.string().default('সর্বশেষ'),
});
export type AutoGenerateArticleInput = z.infer<typeof AutoGenerateArticleInputSchema>;

const AutoGenerateArticleOutputSchema = z.object({
  title: z.string().describe('A suitable, engaging headline for the news article, written in the specified language.'),
  content: z.string().describe('The full content of the news article, formatted with HTML paragraphs (`<p>...</p>`). It should be well-structured, informative, and written in a professional journalistic style.'),
  category: z.string().describe('The most appropriate category for the generated article.'),
  slug: z.string().describe('A URL-friendly slug for the article title.'),
  imageUrl: z.string().url().describe('The URL of a generated featured image for the article.'),
  aiSummary: z.string().describe('A concise summary of the article, suitable for meta descriptions.'),
  tags: z.array(z.string()).describe('An array of 3-5 relevant keywords or tags for the article.'),
  focusKeywords: z.array(z.string()).describe('An array of 1-2 main focus keywords for SEO.'),
});
export type AutoGenerateArticleOutput = z.infer<typeof AutoGenerateArticleOutputSchema>;

export async function autoGenerateArticle(input: AutoGenerateArticleInput): Promise<AutoGenerateArticleOutput> {
  // 1. Generate the article content and metadata
  const articleGenResponse = await articleGenerationPrompt(input);
  const articleData = articleGenResponse.output;

  if (!articleData) {
    throw new Error('Failed to generate article content.');
  }
  
  // 2. Generate a URL-friendly slug from the title
  const { slug } = await translateForSlug(articleData.title);

  // 3. Generate an image based on the article title
  const imageGenResponse = await ai.generate({
    model: 'googleai/imagen-4.0-fast-generate-001',
    prompt: `A photorealistic, high-quality image for a news article titled: "${articleData.title}". The image should be suitable for a professional news website.`,
  });

  const imageDataUri = imageGenResponse.media[0]?.url;
  if (!imageDataUri) {
    throw new Error('Failed to generate an image for the article.');
  }
  
  // 4. Upload the generated image to ImageKit
  const uploadedImageUrl = await uploadImage(imageDataUri, `${slug}-featured-image.png`);

  // 5. Return the complete article object
  return {
    ...articleData,
    slug,
    imageUrl: uploadedImageUrl,
  };
}

// Define the structured prompt for article generation
const articleGenerationPrompt = ai.definePrompt({
  name: 'autoArticleGenerationPrompt',
  input: { schema: AutoGenerateArticleInputSchema },
  output: { schema: AutoGenerateArticleOutputSchema.omit({ imageUrl: true, slug: true }) }, // We generate image URL and slug separately
  prompt: `You are an expert journalist for a professional news website called 'BartaNow'. Your task is to generate a complete, ready-to-publish news article based on the provided keyword and instructions.

**Instructions:**
- **Topic Keyword:** {{{keyword}}}
- **Language:** Generate the article in {{{language}}}. All text output MUST be in this language.
- **Word Count:** The article should be approximately {{{wordCount}}} words long.
- **Category:** The designated category is "{{{category}}}". Ensure the content is relevant to this category.

**Your Task:**
1.  **Generate a Title:** Create a compelling, SEO-friendly headline based on the keyword.
2.  **Generate Content:** Write a well-structured news article with an introduction, body (multiple paragraphs), and conclusion. Format the content using HTML paragraphs (e.g., <p>paragraph one.</p><p>paragraph two.</p>). Do not use any other HTML tags like <h2> or <ul>. Do not invent facts or figures; write based on general knowledge.
3.  **Generate Summary:** Write a concise, engaging summary of the article (under 160 characters) suitable for a meta description.
4.  **Generate Tags & Keywords:**
    -   Suggest 3-5 relevant, general tags.
    -   Suggest 1-2 specific focus keywords for SEO.

Ensure all generated text fields respect the specified language.
`,
});
