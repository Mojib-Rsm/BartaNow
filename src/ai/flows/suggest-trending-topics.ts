
'use server';

/**
 * @fileOverview A flow for suggesting trending news topics.
 *
 * - suggestTrendingTopics - Suggests a list of topics.
 * - TrendingTopicsOutput - The return type for the flow.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const TrendingTopicsOutputSchema = z.object({
  suggestions: z.array(z.string()).describe('A list of 3-5 trending, viral, or interesting news topic suggestions for a Bengali audience.'),
});
export type TrendingTopicsOutput = z.infer<typeof TrendingTopicsOutputSchema>;

export async function suggestTrendingTopics(): Promise<TrendingTopicsOutput> {
  return suggestTrendingTopicsFlow();
}

const prompt = ai.definePrompt({
  name: 'suggestTopicsPrompt',
  output: { schema: TrendingTopicsOutputSchema },
  prompt: `You are a digital marketing expert and content strategist for 'BartaNow', a leading Bengali news website.

Based on current events, general knowledge, and what is likely to go viral in Bangladesh, suggest 3 to 5 engaging and specific news article topics. The topics should be interesting, relevant, and likely to get high engagement.

Provide the suggestions in a list format.
`,
});

const suggestTrendingTopicsFlow = ai.defineFlow(
  {
    name: 'suggestTrendingTopicsFlow',
    outputSchema: TrendingTopicsOutputSchema,
  },
  async () => {
    const { output } = await prompt();
    return output!;
  }
);
