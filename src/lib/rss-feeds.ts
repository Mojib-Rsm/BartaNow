
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
  {
    id: 'the-daily-star',
    name: 'The Daily Star (English)',
    url: 'https://www.thedailystar.net/supplements/rss.xml',
    defaultCategory: 'আন্তর্জাতিক',
    categoryMap: {
        'Sports': 'খেলা',
        'Entertainment': 'বিনোদন',
        'Sci-Tech': 'প্রযুক্তি',
        'Business': 'অর্থনীতি',
        'Politics': 'রাজনীতি',
        'Bangladesh': 'জাতীয়',
        'World': 'আন্তর্জাতিক',
        'Environment': 'পরিবেশ',
        'Health': 'স্বাস্থ্য',
    }
  }
];
