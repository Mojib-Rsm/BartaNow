export interface Author {
  id: string;
  name: string;
  avatarUrl: string;
}

export interface Article {
  id: string;
  title: string;
  category: 'রাজনীতি' | 'খেলা' | 'প্রযুক্তি' | 'বিনোদন' | 'অর্থনীতি' | 'আন্তর্জাতিক' | 'মতামত' | 'স্বাস্থ্য' | 'শিক্ষা' | 'পরিবেশ';
  content: string[]; // Array of paragraphs
  imageUrl: string;
  imageHint?: string;
  authorId: string;
  authorName: string;
  authorAvatarUrl: string;
  publishedAt: string; // ISO date string
  aiSummary: string;
  entityType?: 'ARTICLE'; // Used for GSI partition key
  badge?: 'নতুন' | 'জনপ্রিয়';
  videoUrl?: string;
}
