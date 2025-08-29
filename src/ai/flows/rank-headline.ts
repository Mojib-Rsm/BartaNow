
'use server';

/**
 * @fileOverview A flow for ranking a news headline for SEO and engagement.
 *
 * - rankHeadline - Ranks a given headline.
 * - RankHeadlineInput - Input type for rankHeadline.
 * - RankHeadlineOutput - Return type for rankHeadline.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const RankHeadlineInputSchema = z.object({
  headline: z.string().describe('The Bengali news headline to be ranked.'),
});
export type RankHeadlineInput = z.infer<typeof RankHeadlineInputSchema>;

const RankHeadlineOutputSchema = z.object({
  score: z
    .number()
    .min(0)
    .max(100)
    .describe('A score from 0 to 100 on how engaging and SEO-friendly the headline is. Higher is better.'),
  feedback: z
    .string()
    .describe('A short, actionable feedback (in Bengali) on how to improve the headline. Provide specific reasons for the score.'),
});
export type RankHeadlineOutput = z.infer<typeof RankHeadlineOutputSchema>;

export async function rankHeadline(input: RankHeadlineInput): Promise<RankHeadlineOutput> {
  return rankHeadlineFlow(input);
}

const prompt = ai.definePrompt({
  name: 'rankHeadlinePrompt',
  input: { schema: RankHeadlineInputSchema },
  output: { schema: RankHeadlineOutputSchema },
  prompt: `You are an expert SEO and digital marketing analyst for a professional Bengali news website. Your task is to rank the given news headline based on its potential for high click-through rates (CTR) and search engine optimization (SEO).

Factors to consider for scoring:
1.  **Clarity and Conciseness:** Is the headline easy to understand?
2.  **Emotional Hook:** Does it evoke curiosity, urgency, or another emotion?
3.  **Keyword Usage:** Does it contain relevant keywords people might search for?
4.  **Uniqueness:** Is the headline interesting and not generic?

Provide a score from 0 to 100.
Provide brief, constructive feedback in Bengali explaining the score and suggesting potential improvements.

Headline to rank: {{{headline}}}
`,
});

const rankHeadlineFlow = ai.defineFlow(
  {
    name: 'rankHeadlineFlow',
    inputSchema: RankHeadlineInputSchema,
    outputSchema: RankHeadlineOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
