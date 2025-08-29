'use server';

/**
 * @fileOverview A flow for suggesting relevant tags for a news article.
 *
 * - suggestTagsForArticle - Suggests a list of tags.
 * - SuggestTagsInput - The input type for the flow.
 * - SuggestTagsOutput - The return type for the flow.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const SuggestTagsInputSchema = z.object({
  content: z.string().describe('The full content of the news article.'),
});
export type SuggestTagsInput = z.infer<typeof SuggestTagsInputSchema>;

const SuggestTagsOutputSchema = z.object({
  tags: z
    .array(z.string())
    .min(3)
    .max(7)
    .describe('A list of 3-7 relevant, concise, and SEO-friendly tags for the article, in Bengali.'),
});
export type SuggestTagsOutput = z.infer<typeof SuggestTagsOutputSchema>;

export async function suggestTagsForArticle(input: SuggestTagsInput): Promise<SuggestTagsOutput> {
  return suggestTagsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestTagsPrompt',
  input: { schema: SuggestTagsInputSchema },
  output: { schema: SuggestTagsOutputSchema },
  prompt: `You are an expert content strategist and SEO specialist for a Bengali news website. Your task is to analyze the following article content and generate a list of relevant tags.

Guidelines for generating tags:
1.  The tags must be in Bengali.
2.  Generate between 3 and 7 tags.
3.  Tags should be concise and relevant to the main topics of the article.
4.  Think about what keywords users might search for to find this article.
5.  Avoid overly broad or overly specific tags.

Article Content:
{{{content}}}
`,
});

const suggestTagsFlow = ai.defineFlow(
  {
    name: 'suggestTagsFlow',
    inputSchema: SuggestTagsInputSchema,
    outputSchema: SuggestTagsOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
