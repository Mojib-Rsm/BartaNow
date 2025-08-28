'use server';

import { config } from 'dotenv';
config();

import '@/ai/flows/summarize-article.ts';
import '@/ai/flows/text-to-speech.ts';
import '@/ai/flows/translate-for-slug.ts';
