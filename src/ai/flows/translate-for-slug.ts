'use server';

/**
 * @fileOverview A flow for translating Bengali text to an English URL slug.
 *
 * - translateForSlug - A function that generates a URL-friendly slug from a Bengali title.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const TranslateInputSchema = z.object({
  text: z.string().describe('The Bengali text to be translated and slugified.'),
});

const TranslateOutputSchema = z.object({
  englishTitle: z.string().describe('A proper English translation of the Bengali text.'),
  slug: z.string().describe('The generated English slug, in lowercase and separated by hyphens.'),
});

type TranslateOutput = z.infer<typeof TranslateOutputSchema>;

export async function translateForSlug(text: string): Promise<TranslateOutput> {
    try {
        const { englishTitle, slug } = await translateFlow({ text });
        return { englishTitle, slug };
    } catch (error) {
        console.error("AI slug generation failed, falling back to basic slug.", error);
        // Fallback to a simple non-AI slug generator if the flow fails
        const fallbackSlug = text
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^\p{L}\p{N}-]/gu, '')
            .replace(/--+/g, '-')
            .replace(/^-+/, '')
            .replace(/-+$/, '');
        return { englishTitle: '', slug: fallbackSlug };
    }
}

const prompt = ai.definePrompt({
  name: 'translateToSlugPrompt',
  input: { schema: TranslateInputSchema },
  output: { schema: TranslateOutputSchema },
  prompt: `Translate the following Bengali text to English. Then, convert the English translation into a URL-friendly slug.
The slug must be in lowercase, with words separated by hyphens. Remove any special characters from the slug.
Provide both the English title and the slug.

Bengali Text: {{{text}}}
`,
});

const translateFlow = ai.defineFlow(
  {
    name: 'translateFlow',
    inputSchema: TranslateInputSchema,
    outputSchema: TranslateOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
