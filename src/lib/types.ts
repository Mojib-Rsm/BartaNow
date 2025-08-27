export interface Author {
  id: string;
  name: string;
  avatarUrl: string;
}

export interface Article {
  id: string;
  title: string;
  content: string[]; // Array of paragraphs
  imageUrl: string;
  imageHint?: string;
  authorId: string;
  authorName: string;
  authorAvatarUrl: string;
  publishedAt: string; // ISO date string
  aiSummary: string;
  entityType?: 'ARTICLE'; // Used for GSI partition key
}
