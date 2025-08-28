
import type { RssFeed } from './types';

export const rssFeeds: RssFeed[] = [
  {
    id: 'prothom-alo',
    name: 'প্রথম আলো',
    url: 'https://www.prothomalo.com/feed/',
    defaultCategory: 'আন্তর্জাতিক',
    categoryMap: {
      'খেলাধুলা': 'খেলা',
      'বিনোদন': 'বিনোদন',
      'প্রযুক্তি': 'প্রযুক্তি',
      'দেশ': 'জাতীয়',
      'আন্তর্জাতিক': 'আন্তর্জাতিক',
      'অর্থনীতি': 'অর্থনীতি',
      'রাজনীতি': 'রাজনীতি',
    },
  },
  // Add other RSS feeds here
];
