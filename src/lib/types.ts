

export interface Author {
  id: string;
  name: string;
  slug: string;
  avatarUrl: string;
  bio?: string;
  entityType?: 'AUTHOR';
}

export interface PollOption {
  id: string;
  label: string;
  votes: number;
}

export interface Poll {
  id:string;
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

export interface User {
    id: string;
    email: string;
    name: string;
    password?: string; // Should be hashed in a real app
    role: 'admin' | 'editor' | 'reporter' | 'user';
    avatarUrl?: string; // Can be a URL or a Base64 data URI
    bio?: string;
    bloodGroup?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
    preferredTopics?: string[];
    entityType?: 'USER';
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  category: 'রাজনীতি' | 'খেলা' | 'প্রযুক্তি' | 'বিনোদন' | 'অর্থনীতি' | 'আন্তর্জাতিক' | 'মতামত' | 'স্বাস্থ্য' | 'শিক্ষা' | 'পরিবেশ' | 'বিশেষ-কভারেজ' | 'জাতীয়' | 'ইসলামী-জীবন' | 'তথ্য-যাচাই' | 'মিম-নিউজ' | 'ভিডিও' | 'সর্বশেষ' | 'সম্পাদকের-পছন্দ';
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
  location?: string; // e.g., 'ঢাকা', 'চট্টগ্রাম'
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
