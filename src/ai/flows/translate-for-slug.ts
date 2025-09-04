
'use server';

/**
 * @fileOverview A flow for translating Bengali text to an English URL slug and generating focus keywords.
 *
 * - translateForSlug - A function that generates a URL-friendly slug and keywords from a Bengali title.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { generateNonAiSlug } from '@/lib/utils';

const TranslateInputSchema = z.object({
  text: z.string().describe('The Bengali text to be translated and slugified.'),
});

const TranslateOutputSchema = z.object({
  englishTitle: z.string().describe('A proper English translation of the Bengali text.'),
  slug: z.string().describe('The generated English slug, in lowercase and separated by hyphens.'),
  focusKeywords: z.array(z.string()).min(1).max(2).describe('An array of 1-2 main focus keywords for SEO, in English or Bengali.'),
});

type TranslateOutput = z.infer<typeof TranslateOutputSchema>;

export async function translateForSlug(text: string): Promise<TranslateOutput> {
    try {
        const { output } = await translateFlow({ text });
        if (!output) {
            throw new Error('AI generation failed to produce output.');
        }
        // Further clean the AI-generated slug to ensure it's URL-safe
        const cleanedSlug = output.slug.toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^\w-]+/g, '')
            .replace(/--+/g, '-')
            .replace(/^-+/, '')
            .replace(/-+$/, '');

        return { 
            englishTitle: output.englishTitle, 
            slug: cleanedSlug || generateNonAiSlug(text),
            focusKeywords: output.focusKeywords || []
        };
    } catch (error) {
        console.error("AI slug generation failed, falling back to basic slug.", error);
        // Fallback to a simple non-AI slug generator if the flow fails
        const fallbackSlug = generateNonAiSlug(text);
        return { englishTitle: '', slug: fallbackSlug, focusKeywords: [] };
    }
}

const prompt = ai.definePrompt({
  name: 'translateToSlugPrompt',
  input: { schema: TranslateInputSchema },
  output: { schema: TranslateOutputSchema },
  prompt: `Translate the following Bengali text to English. Then, convert the English translation into a URL-friendly slug.
Also, provide 1-2 SEO-friendly focus keywords based on the title.
The slug must be in lowercase, with words separated by hyphens. Remove any special characters from the slug.
Provide the English title, the slug, and the focus keywords.

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
