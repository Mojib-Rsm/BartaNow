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
  slug: z.string().describe('The generated English slug, in lowercase and separated by hyphens.'),
});

export async function translateForSlug(text: string): Promise<string> {
    try {
        const { slug } = await translateFlow({ text });
        return slug;
    } catch (error) {
        console.error("AI slug generation failed, falling back to basic slug.", error);
        // Fallback to a simple non-AI slug generator if the flow fails
        return text
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^\p{L}\p{N}-]/gu, '')
            .replace(/--+/g, '-')
            .replace(/^-+/, '')
            .replace(/-+$/, '');
    }
}

const prompt = ai.definePrompt({
  name: 'translateToSlugPrompt',
  input: { schema: TranslateInputSchema },
  output: { schema: TranslateOutputSchema },
  prompt: `Translate the following Bengali text to English and convert it into a URL-friendly slug. The slug must be in lowercase, with words separated by hyphens. Remove any special characters.

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
