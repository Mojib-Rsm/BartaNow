'use server';

import { config } from 'dotenv';
config();

import '@/ai/flows/summarize-article.ts';
import '@/ai/flows/text-to-speech.ts';
import '@/ai/flows/translate-for-slug.ts';
import '@/ai/flows/generate-article.ts';
import '@/ai/flows/suggest-trending-topics.ts';
import '@/ai/flows/rank-headline.ts';
import '@/ai/flows/suggest-tags.ts';
import '@/ai/flows/analyze-image.ts';
import '@/ai/flows/auto-generate-article.ts';
import '@/ai/flows/suggest-related-articles.ts';
