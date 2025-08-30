
'use server';

/**
 * @fileOverview An AI flow for analyzing an image and generating metadata.
 *
 * - analyzeImage - A function that analyzes an image and returns metadata.
 * - AnalyzeImageInput - The input type for the analyzeImage function.
 * - AnalyzeImageOutput - The return type for the analyzeImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeImageInputSchema = z.object({
  imageUrl: z.string().url().describe('The public URL of the image to analyze.'),
});
export type AnalyzeImageInput = z.infer<typeof AnalyzeImageInputSchema>;

const AnalyzeImageOutputSchema = z.object({
  altText: z.string().describe('A concise, descriptive alt text for the image, suitable for SEO and accessibility. Should be in Bengali.'),
  caption: z.string().describe('A short, engaging caption for the image. Should be in Bengali.'),
  description: z.string().describe('A longer, more detailed description of the image content and context. Should be in Bengali.'),
  tags: z.array(z.string()).min(3).max(5).describe('An array of 3 to 5 relevant keywords or tags for the image, in Bengali.'),
});
export type AnalyzeImageOutput = z.infer<typeof AnalyzeImageOutputSchema>;

export async function analyzeImage(input: AnalyzeImageInput): Promise<AnalyzeImageOutput> {
  return analyzeImageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeImagePrompt',
  input: {schema: AnalyzeImageInputSchema},
  output: {schema: AnalyzeImageOutputSchema},
  prompt: `Analyze the following image and generate descriptive metadata in Bengali.

Image to analyze: {{media url=imageUrl}}

Based on the content, context, and potential use of this image on a news website, provide the following:
1.  **altText**: A clear and descriptive alternative text for accessibility and SEO.
2.  **caption**: A brief, interesting caption to display under the image.
3.  **description**: A more detailed paragraph describing what is happening in the image.
4.  **tags**: A list of 3-5 relevant keywords.
`,
});

const analyzeImageFlow = ai.defineFlow(
  {
    name: 'analyzeImageFlow',
    inputSchema: AnalyzeImageInputSchema,
    outputSchema: AnalyzeImageOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
