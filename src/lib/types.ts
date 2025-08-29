

export type Permission =
  | 'create_article' | 'edit_article' | 'delete_article' | 'publish_article'
  | 'create_page' | 'edit_page' | 'delete_page'
  | 'create_poll' | 'edit_poll' | 'delete_poll'
  | 'manage_comments' | 'approve_comment' | 'delete_comment'
  | 'view_users' | 'create_user' | 'edit_user_profile' | 'delete_user' | 'change_user_role' | 'block_user'
  | 'manage_media' | 'upload_media' | 'delete_media'
  | 'manage_settings' | 'manage_ads' | 'send_notification' | 'manage_newsletter' | 'manage_rss' | 'create_rss' | 'edit_rss' | 'delete_rss'
  | 'login_as_user'
  | 'manage_tags' | 'create_tag' | 'edit_tag' | 'delete_tag'
  | 'view_reports' | 'view_contact_messages' | 'delete_contact_message';


export interface Role {
  name: string;
  permissions: Permission[];
}

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
  id: string;
  question: string;
  options: PollOption[];
  isActive: boolean;
  createdAt: string; // ISO date string
  entityType?: 'POLL';
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
    savedArticles?: string[]; // Array of article IDs
    readingHistory?: string[]; // Array of article IDs
    entityType?: 'USER';
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  entityType?: 'CATEGORY';
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  entityType?: 'TAG';
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  category: string;
  content: string; // HTML content from the rich text editor
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
  tags?: string[]; // Array of tag names or tag IDs
  englishTitle?: string;
  focusKeywords?: string[];
  status: 'Published' | 'Draft' | 'Pending Review' | 'Scheduled';
}

export interface Page {
  id: string;
  slug: string;
  title: string;
  content: string; // HTML content
  publishedAt: string;
  lastUpdatedAt: string;
  entityType?: 'PAGE';
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

export interface Comment {
    id: string;
    articleId: string;
    userId: string;
    userName: string;
    userAvatar: string;
    text: string;
    timestamp: string; // ISO date string
    isApproved: boolean;
    entityType?: 'COMMENT';
}

export interface Media {
    id: string;
    fileName: string;
    url: string;
    mimeType: string;
    size: number; // in bytes
    altText?: string;
    caption?: string;
    description?: string;
    category?: string;
    width?: number;
    height?: number;
    cropStrategy?: 'maintain_ratio' | 'force';
    hasWatermark?: boolean;
    duration?: number; // for audio/video
    uploadedAt: string; // ISO date string
    uploadedBy: string; // userId
    entityType?: 'MEDIA';
}

export interface Notification {
    id: string;
    userId: string;
    type: 'breaking' | 'topic' | 'system';
    title: string;
    message: string;
    articleId?: string;
    articleSlug?: string;
    isRead: boolean;
    timestamp: string; // ISO date string
    entityType?: 'NOTIFICATION';
}

export interface Subscriber {
  id: string;
  email: string;
  isSubscribed: boolean;
  subscribedAt: string; // ISO date string
  entityType?: 'SUBSCRIBER';
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  isRead: boolean;
  receivedAt: string; // ISO date string
  entityType?: 'CONTACT_MESSAGE';
}


export interface MenuItem {
  id: string;
  name: string;
  href: string;
  order: number;
  parentId?: string | null;
  children: MenuItem[];
  entityType?: 'MENU_ITEM';
}

export interface Ad {
  id: string;
  name: string;
  type: 'banner' | 'sidebar' | 'in-article';
  imageUrl: string;
  targetUrl: string;
  placement: string;
  isActive: boolean;
  startDate?: string;
  endDate?: string;
  entityType?: 'AD';
}

export interface RssFeed {
  id: string;
  name: string;
  url: string;
  categoryMap: Record<string, Article['category']>;
  defaultCategory: Article['category'];
  entityType?: 'RSS_FEED';
}
