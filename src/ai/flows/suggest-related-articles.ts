'use server';

/**
 * @fileOverview An AI flow for suggesting related articles.
 *
 * - suggestRelatedArticles - Suggests a list of related article IDs.
 * - SuggestRelatedArticlesInput - The input type for the flow.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { getArticles } from '@/lib/api';

const SuggestRelatedArticlesInputSchema = z.object({
  articleId: z.string().describe('The ID of the current article.'),
  articleTitle: z.string().describe('The title of the current article.'),
  articleContent: z.string().describe('The content of the current article.'),
});
export type SuggestRelatedArticlesInput = z.infer<typeof SuggestRelatedArticlesInputSchema>;

// Fetches a simplified list of all articles for the prompt context.
// In a production app with many articles, this should be optimized
// (e.g., using a vector database for similarity search).
async function getAllArticleTitles(excludeId: string): Promise<{ id: string; title: string }[]> {
  const { articles } = await getArticles({ limit: 100 }); // Fetch a reasonable number of recent articles
  return articles
    .filter(a => a.id !== excludeId)
    .map(a => ({ id: a.id, title: a.title }));
}

const RelatedArticlesOutputSchema = z.array(z.string()).max(4).describe('An array of up to 4 related article IDs.');

export async function suggestRelatedArticles(input: SuggestRelatedArticlesInput): Promise<string[]> {
  const allOtherArticles = await getAllArticleTitles(input.articleId);

  const prompt = ai.definePrompt({
    name: 'suggestRelatedArticlesPrompt',
    output: { schema: RelatedArticlesOutputSchema },
    prompt: `Based on the following article, which of the candidate articles are most relevant? 
Select up to 4 of the most closely related articles from the list provided.
Your response must only contain an array of the selected article IDs.

Current Article Title: {{{articleTitle}}}
Current Article Content:
---
{{{articleContent}}}
---

Candidate Articles (ID and Title):
---
{{#each articles}}
- ID: {{{this.id}}}, Title: {{{this.title}}}
{{/each}}
---
`,
  });

  const { output } = await prompt({
    articleTitle: input.articleTitle,
    articleContent: input.articleContent,
    articles: allOtherArticles,
  });

  return output || [];
}
