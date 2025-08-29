
'use server';

/**
 * @fileOverview A flow for generating a full news article from a prompt.
 *
 * - generateArticle - A function that generates article variants.
 * - GenerateArticleInput - The input type for the generateArticle function.
 * - GenerateArticleOutput - The return type for the generateArticle function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateArticleInputSchema = z.object({
  prompt: z.string().describe('The topic or headline for the news article to be generated.'),
});

export type GenerateArticleInput = z.infer<typeof GenerateArticleInputSchema>;

const ArticleVariantSchema = z.object({
  title: z.string().describe('A suitable, engaging headline for the news article, written in Bengali.'),
  content: z.string().describe('The full content of the news article, formatted with HTML paragraphs (`<p>...</p>`). The article should be well-structured, informative, and written in professional Bengali journalistic style. It should contain at least 2-3 paragraphs.'),
  category: z.enum(['রাজনীতি' , 'খেলা' , 'প্রযুক্তি' , 'বিনোদন' , 'অর্থনীতি' , 'আন্তর্জাতিক' , 'মতামত' , 'স্বাস্থ্য' , 'শিক্ষা' , 'পরিবেশ' , 'বিশেষ-কভারেজ' , 'জাতীয়' , 'ইসলামী-জীবন' , 'তথ্য-যাচাই' , 'মিম-নিউজ', 'ভিডিও' , 'সর্বশেষ' , 'সম্পাদকের-পছন্দ']).describe('The most appropriate category for the generated article.'),
});

const GenerateArticleOutputSchema = z.object({
  variants: z.array(ArticleVariantSchema).describe('An array of 2 to 3 different versions of the generated news article. Each version should have a slightly different tone, angle, or headline to provide variety.'),
});

export type GenerateArticleOutput = z.infer<typeof GenerateArticleOutputSchema>;

export async function generateArticle(input: GenerateArticleInput): Promise<GenerateArticleOutput> {
  return generateArticleFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateArticlePrompt',
  input: {schema: GenerateArticleInputSchema},
  output: {schema: GenerateArticleOutputSchema},
  prompt: `You are an expert journalist for a professional Bengali news website called 'BartaNow'. Your task is to generate a complete news article based on the provided prompt.

Generate 2-3 different versions (variants) of the article. Each variant should be distinct, perhaps with a different headline, a slightly different angle, or a varying tone (e.g., one more formal, one more engaging).

For each variant:
- The article must be written in fluent, formal, and journalistic Bengali.
- The content should be well-structured with a clear introduction, body, and conclusion.
- Format the content using HTML paragraphs, for example: <p>প্রথম অনুচ্ছেদ এখানে।</p><p>দ্বিতীয় অনুচ্ছেদ এখানে।</p>
- Based on the content, determine the most suitable category from the provided list.
- Do not invent facts. Use general knowledge to create a plausible news story.

Prompt: {{{prompt}}}
`, 
});

const generateArticleFlow = ai.defineFlow(
  {
    name: 'generateArticleFlow',
    inputSchema: GenerateArticleInputSchema,
    outputSchema: GenerateArticleOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

