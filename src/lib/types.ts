export interface Author {
  id: string;
  name: string;
  avatarUrl: string;
  bio?: string;
}

export interface PollOption {
  id: string;
  label: string;
  votes: number;
}

export interface Poll {
  id: string;
  question: string;
  options: PollOption[];
}

export interface FactCheck {
  statement: string;
  verdict: 'সত্য' | 'ভুয়া' | 'আংশিক সত্য';
  source: {
    name: string;
    url: string;
  };
}

export interface Article {
  id: string;
  title: string;
  category: 'রাজনীতি' | 'খেলা' | 'প্রযুক্তি' | 'বিনোদন' | 'অর্থনীতি' | 'আন্তর্জাতিক' | 'মতামত' | 'স্বাস্থ্য' | 'শিক্ষা' | 'পরিবেশ' | 'বিশেষ কভারেজ' | 'জাতীয়' | 'ইসলামী জীবন' | 'তথ্য যাচাই' | 'মিম নিউজ';
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
  editorsPick?: boolean;
  sponsored?: boolean;
  factCheck?: FactCheck;
}

export interface MemeNews {
  id: string;
  title: string;
  articleId: string;
  imageUrl: string;
  imageHint?: string;
  topText: string;
  bottomText: string;
}
