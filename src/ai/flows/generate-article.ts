
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
  language: z.enum(['Bengali', 'English']).default('Bengali').describe('The language for the generated article.'),
  wordCount: z.enum(['Short', 'Medium', 'Long']).default('Medium').describe('The desired word count for the article.'),
  tone: z.enum(['Formal', 'News', 'Casual', 'Creative']).default('News').describe('The desired tone for the article.'),
});

export type GenerateArticleInput = z.infer<typeof GenerateArticleInputSchema>;

const ArticleVariantSchema = z.object({
  title: z.string().describe('A suitable, engaging headline for the news article, written in the specified language.'),
  content: z.string().describe('The full content of the news article, formatted with HTML paragraphs (`<p>...</p>`). The article should be well-structured, informative, and written in a professional journalistic style. It should contain multiple paragraphs.'),
  category: z.enum(['রাজনীতি' , 'খেলা' , 'প্রযুক্তি' , 'বিনোদন' , 'অর্থনীতি' , 'আন্তর্জাতিক' , 'মতামত' , 'স্বাস্থ্য' , 'শিক্ষা' , 'পরিবেশ' , 'বিশেষ-কভারেজ' , 'জাতীয়' , 'ইসলামী-জীবন' , 'তথ্য-যাচাই' , 'মিম-নিউজ', 'ভিডিও' , 'সর্বশেষ' , 'সম্পাদকের-পছন্দ']).describe('The most appropriate category for the generated article. This should always be in Bengali.'),
});

const GenerateArticleOutputSchema = z.object({
  variants: z.array(ArticleVariantSchema).min(2).max(3).describe('An array of 2 to 3 different versions of the generated news article. Each version should have a slightly different tone, angle, or headline to provide variety.'),
});

export type GenerateArticleOutput = z.infer<typeof GenerateArticleOutputSchema>;

export async function generateArticle(input: GenerateArticleInput): Promise<GenerateArticleOutput> {
  return generateArticleFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateArticlePrompt',
  input: {schema: GenerateArticleInputSchema},
  output: {schema: GenerateArticleOutputSchema},
  prompt: `You are an expert journalist for a professional news website called 'BartaNow'. Your task is to generate a complete news article based on the provided prompt and instructions.

Instructions:
- Language: Generate the article in {{{language}}}. The final output for title and content MUST be in this language.
- Word Count: The article should be of {{{wordCount}}} length. (Short: ~150 words, Medium: ~300 words, Long: ~500 words).
- Tone: The tone of the article should be {{{tone}}}.

Generate 2-3 different versions (variants) of the article. Each variant should be distinct, perhaps with a different headline, a slightly different angle, or a varying tone.

For each variant:
- The article must be well-structured with a clear introduction, body, and conclusion.
- Format the content using HTML paragraphs, for example: <p>first paragraph here.</p><p>second paragraph here.</p>
- Based on the content, determine the most suitable category from the provided list. IMPORTANT: The category field in the output must always be in Bengali, regardless of the article's language.
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

    
