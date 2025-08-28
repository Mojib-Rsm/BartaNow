
import type { Article, Author, Poll, MemeNews, User, Comment, Media, Notification, Page, MenuItem, Subscriber } from './types';

// Helper to generate a non-AI slug from a title for mock data
const generateNonAiSlug = (title: string) => {
    return title
        .toLowerCase()
        .replace(/\s+/g, '-') // Replace spaces with -
        .replace(/[^\p{L}\p{N}-]/gu, '') // Remove all non-alphanumeric characters except dashes
        .replace(/--+/g, '-') // Replace multiple - with single -
        .replace(/^-+/, '') // Trim - from start of text
        .replace(/-+$/, ''); // Trim - from end of text
};


const users: User[] = [
    { 
        id: 'user-1', 
        name: 'Admin User', 
        email: 'admin@bartanow.com', 
        password: 'password123', 
        role: 'admin',
        avatarUrl: 'https://i.pravatar.cc/150?u=admin-user',
        bio: 'বার্তা নাও ওয়েবসাইটের অ্যাডমিন। আমি প্রযুক্তি, সংবাদ এবং লেখালেখি ভালোবাসি।',
        bloodGroup: 'A+',
        preferredTopics: ['প্রযুক্তি', 'রাজনীতি'],
        savedArticles: ['2', '10', '18'],
        readingHistory: ['1', '2', '3', '4', '5', '10', '18'],
    },
    { 
        id: 'user-2', 
        name: 'Regular User', 
        email: 'user@bartanow.com', 
        password: 'password123',         
        role: 'user',
        avatarUrl: 'https://i.pravatar.cc/150?u=regular-user',
        bio: 'আমি একজন সাধারণ পাঠক। খেলা এবং বিনোদনের খবর পড়তে ভালোবাসি।',
        bloodGroup: 'O+',
        preferredTopics: ['খেলা', 'বিনোদন'],
        savedArticles: ['1', '5', '15'],
        readingHistory: ['1', '5', '8', '13', '15', '16'],
    },
    { 
        id: 'user-3', 
        name: 'Editor User', 
        email: 'editor@bartanow.com', 
        password: 'password123', 
        role: 'editor',
        avatarUrl: 'https://i.pravatar.cc/150?u=editor-user',
        bio: 'বার্তা নাও এর একজন সম্পাদক। আমি সংবাদ সম্পাদনা এবং গুণমান নিশ্চিত করতে কাজ করি।',
        bloodGroup: 'B+',
        preferredTopics: ['জাতীয়', 'আন্তর্জাতিক'],
        savedArticles: [],
        readingHistory: [],
    },
    { 
        id: 'user-4', 
        name: 'Reporter User', 
        email: 'reporter@bartanow.com', 
        password: 'password123', 
        role: 'reporter',
        avatarUrl: 'https://i.pravatar.cc/150?u=reporter-user',
        bio: 'আমি একজন প্রতিবেদক। মাঠ থেকে সরাসরি খবর সংগ্রহ এবং রিপোর্ট করাই আমার কাজ।',
        bloodGroup: 'AB+',
        preferredTopics: ['বিশেষ-কভারেজ', 'স্বাস্থ্য'],
        savedArticles: [],
        readingHistory: [],
    },
];

const authors: Author[] = [
  { id: 'author-1', name: 'জান্নাতুল ফেরদৌস', slug: 'jannatul-ferdous', avatarUrl: 'https://i.pravatar.cc/150?u=author-1', bio: 'জান্নাতুল ফেরদৌস একজন অভিজ্ঞ সাংবাদিক যিনি প্রযুক্তি এবং রাজনীতি বিষয়ে লেখেন। তিনি জটিল বিষয় সহজভাবে উপস্থাপন করতে পারদর্শী।' },
  { id: 'author-2', name: 'রহিম শেখ', slug: 'rahim-sheikh', avatarUrl: 'https://i.pravatar.cc/150?u=author-2', bio: 'রহিম শেখ খেলা এবং বিনোদন জগতের খবর কভার করেন। তার লেখাগুলো পাঠকদের মধ্যে বেশ জনপ্রিয়।' },
  { id: 'author-3', name: 'আলিয়া চৌধুরী', slug: 'alia-chowdhury', avatarUrl: 'https://i.pravatar.cc/150?u=author-3', bio: 'আলিয়া চৌধুরী পরিবেশ এবং স্বাস্থ্য নিয়ে কাজ করেন। তার গবেষণাধর্মী লেখাগুলো সচেতনতা তৈরিতে সাহায্য করে।' },
];

const articlesData: Omit<Article, 'slug'>[] = [
  {
    id: '1',
    title: 'খেলা: বাংলাদেশের দুর্দান্ত জয়ে এশিয়া কাপ শুরু',
    category: 'খেলা',
    content: [
      "এশিয়া কাপের উদ্বোধনী ম্যাচে বাংলাদেশ ক্রিকেট দল এক অসাধারণ পারফরম্যান্স দেখিয়ে প্রতিপক্ষকে হারিয়েছে। অধিনায়কের শতক এবং বোলারদের নিয়ন্ত্রিত বোলিং দলের জয় নিশ্চিত করে।",
      "এই জয়ের ফলে দলের মনোবল অনেকটাই বেড়ে গেছে এবং সমর্থকরা আশাবাদী যে টুর্নামেন্টে বাংলাদেশ ভালো কিছু করবে। আগামী ম্যাচেও এই জয়ের ধারা অব্যাহত রাখার লক্ষ্য নিয়ে মাঠে নামবে টাইগাররা।"
    ],
    imageUrl: 'https://picsum.photos/seed/cricket/800/600',
    imageHint: 'cricket match',
    authorId: 'author-2',
    authorName: 'রহিম শেখ',
    authorAvatarUrl: 'https://i.pravatar.cc/150?u=author-2',
    publishedAt: '2024-07-22T10:00:00Z',
    aiSummary: 'এশিয়া কাপের প্রথম ম্যাচে অধিনায়কের অনবদ্য শতকে বাংলাদেশ একটি शानदार জয় পেয়েছে, যা দলের আত্মবিশ্বাস বাড়িয়ে দিয়েছে।',
    badge: 'জনপ্রিয়',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    location: 'চট্টগ্রাম',
  },
  {
    id: '2',
    title: 'প্রযুক্তি: দেশজুড়ে 5G সেবা চালু হতে যাচ্ছে',
    category: 'প্রযুক্তি',
    content: [
        "বহুল প্রতীক্ষিত 5G প্রযুক্তি অবশেষে বাংলাদেশে চালু হতে যাচ্ছে। প্রাথমিকভাবে প্রধান শহরগুলোতে এই সেবা পাওয়া যাবে এবং পর্যায়ক্রমে সারা দেশে বিস্তার লাভ করবে।",
        "এই প্রযুক্তির মাধ্যমে ইন্টারনেট গতি বহুগুণ বাড়বে, যা ডিজিটাল সেবা, শিক্ষা, এবং স্বাস্থ্যখাতে বৈপ্লবিক পরিবর্তন আনবে বলে আশা করা হচ্ছে। বিশেষজ্ঞরা বলছেন, এটি দেশের অর্থনৈতিক উন্নয়নেও বড় ভূমিকা রাখবে।"
    ],
    imageUrl: 'https://picsum.photos/seed/5g-tower/600/400',
    imageHint: '5g network',
    authorId: 'author-1',
    authorName: 'জান্নাতুল ফেরদৌস',
    authorAvatarUrl: 'https://i.pravatar.cc/150?u=author-1',
    publishedAt: '2024-07-21T14:30:00Z',
    aiSummary: 'বাংলাদেশে শীঘ্রই 5G সেবা চালু হতে যাচ্ছে, যা ইন্টারনেট গতি বাড়ানোর পাশাপাশি দেশের প্রযুক্তি এবং অর্থনীতিতে বড় পরিবর্তন আনবে।',
    badge: 'নতুন',
    editorsPick: true,
    sponsored: true,
    location: 'ঢাকা',
  },
  {
    id: '3',
    title: 'অর্থনীতি: ডলারের বাজারে অস্থিরতা, অর্থনীতিতে প্রভাব',
    category: 'অর্থনীতি',
    content: [
        "গত কয়েক সপ্তাহ ধরে ডলারের বাজারে持续 অস্থিরতা লক্ষ্য করা যাচ্ছে। টাকার বিপরীতে ডলারের দাম বেড়ে যাওয়ায় আমদানি খরচ বাড়ছে, যার প্রভাব পড়ছে সাধারণ মানুষের জীবনযাত্রার উপর।",
        "অর্থনীতিবিদরা বলছেন, এই পরিস্থিতি নিয়ন্ত্রণে দ্রুত পদক্ষেপ নেওয়া প্রয়োজন। সরকার এবং কেন্দ্রীয় ব্যাংক পরিস্থিতি স্থিতিশীল করতে কাজ করে যাচ্ছে বলে জানিয়েছে।"
    ],
    imageUrl: 'https://picsum.photos/seed/stock-market/600/400',
    imageHint: 'dollar money',
    authorId: 'author-2',
    authorName: 'রহিম শেখ',
    authorAvatarUrl: 'https://i.pravatar.cc/150?u=author-2',
    publishedAt: '2024-07-20T09:00:00Z',
    aiSummary: 'ডলারের দাম বৃদ্ধিতে আমদানি খরচ বেড়েছে, যা সাধারণ মানুষের জীবনযাত্রায় প্রভাব ফেলছে। পরিস্থিতি নিয়ন্ত্রণে পদক্ষেপ নেওয়া হচ্ছে।',
    badge: 'জনপ্রিয়',
  },
  {
    id: '4',
    title: 'রাজনীতি: বিএনপি’র নতুন কর্মসূচি ঘোষণা',
    category: 'রাজনীতি',
    content: [
      "বাংলাদেশ জাতীয়তাবাদী দল (বিএনপি) সরকারের উপর চাপ সৃষ্টি করতে নতুন দেশব্যাপী কর্মসূচি ঘোষণা করেছে। দলের মহাসচিব এক সংবাদ সম্মেলনে এই কর্মসূচির বিস্তারিত তুলে ধরেন।",
      "কর্মসূচির মধ্যে রয়েছে সমাবেশ, বিক্ষোভ মিছিল এবং অন্যান্য গণতান্ত্রিক কার্যক্রম। দলটি বলছে, তাদের দাবি আদায় না হওয়া পর্যন্ত এই আন্দোলন চলবে।"
    ],
    imageUrl: 'https://picsum.photos/seed/protest/600/400',
    imageHint: 'political rally',
    authorId: 'author-1',
    authorName: 'জান্নাতুল ফেরদৌস',
    authorAvatarUrl: 'https://i.pravatar.cc/150?u=author-1',
    publishedAt: '2024-07-19T11:45:00Z',
    aiSummary: 'বিএনপি দেশব্যাপী নতুন কর্মসূচি ঘোষণা করেছে, যার মধ্যে রয়েছে সমাবেশ এবং বিক্ষোভ মিছিল, যা দাবি আদায় না হওয়া পর্যন্ত চলবে।',
    badge: 'জনপ্রিয়',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    location: 'ঢাকা',
  },
  {
    id: '5',
    title: 'বিনোদন: ঈদে মুক্তি পাচ্ছে পাঁচটি নতুন চলচ্চিত্র',
    category: 'বিনোদন',
    content: [
      "আসন্ন ঈদুল আজহা উপলক্ষে পাঁচটি নতুন বাংলা চলচ্চিত্র মুক্তি পেতে যাচ্ছে। জনপ্রিয় তারকাদের অভিনয়ে নির্মিত এই সিনেমাগুলো নিয়ে দর্শকদের মধ্যে ব্যাপক আগ্রহ তৈরি হয়েছে।",
      "চলচ্চিত্রগুলোর মধ্যে রয়েছে অ্যাকশন, রোমান্টিক-كوميدي, এবং সামাজিক ঘরানার গল্প। নির্মাতারা আশা করছেন, এই সিনেমাগুলো ঈদের ছুটিতে দর্শকদের বিনোদনের খোরাক জোগাবে।"
    ],
    imageUrl: 'https://picsum.photos/seed/movie-poster/600/400',
    imageHint: 'movie theater',
    authorId: 'author-2',
    authorName: 'রহিম শেখ',
    authorAvatarUrl: 'https://i.pravatar.cc/150?u=author-2',
    publishedAt: '2024-07-18T22:00:00Z',
    aiSummary: 'ঈদে দর্শকদের জন্য পাঁচটি নতুন বাংলা চলচ্চিত্র মুক্তি পাচ্ছে, যেগুলোতে বিভিন্ন ঘরানার গল্প ও জনপ্রিয় তারকারা রয়েছেন।',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
  },
  {
    id: '6',
    title: 'আন্তর্জাতিক: মহাকাশে নতুন টেলিস্কোপ পাঠাল নাসা',
    category: 'আন্তর্জাতিক',
    content: [
      "মার্কিন মহাকাশ গবেষণা সংস্থা নাসা একটি নতুন, আরও শক্তিশালী স্পেস টেলিস্কোপ উৎক্ষেপণ করেছে। এই টেলিস্কোপটি মহাবিশ্বের অজানা রহস্য উন্মোচনে সাহায্য করবে বলে আশা করা হচ্ছে।",
      "এটি দূরবর্তী গ্যালাক্সি এবং এক্সোপ্ল্যানেটের ছবি তুলবে, যা বিজ্ঞানীদের মহাবিশ্বের উৎপত্তি ও গঠন সম্পর্কে নতুন তথ্য দেবে। বিশ্বজুড়ে জ্যোতির্বিজ্ঞানীরা এই মিশনের ফলাফলের জন্য অধীর আগ্রহে অপেক্ষা করছেন।"
    ],
    imageUrl: 'https://picsum.photos/seed/telescope/600/400',
    imageHint: 'galaxy nebula',
    authorId: 'author-1',
    authorName: 'জান্নাতুল ফেরদৌস',
    authorAvatarUrl: 'https://i.pravatar.cc/150?u=author-1',
    publishedAt: '2024-07-17T18:00:00Z',
    aiSummary: 'নাসা একটি উন্নত স্পেস টেলিস্কোপ উৎক্ষেপণ করেছে যা মহাবিশ্বের রহস্য উন্মোচন করতে এবং দূরবর্তী গ্যালাক্সির ছবি তুলতে সাহায্য করবে।',
    badge: 'জনপ্রিয়',
  },
  {
    id: '7',
    title: 'মতামত: যানজট নিরসনে আমাদের করণীয়',
    category: 'মতামত',
    content: [
      "ঢাকা শহরের যানজট একটি নিত্যদিনের সমস্যা। এই সমস্যা সমাধানে শুধু সরকারের উপর নির্ভর না করে নাগরিকদেরও দায়িত্ব রয়েছে। ব্যক্তিগত গাড়ির ব্যবহার কমানো, পাবলিক ট্রান্সপোর্ট ব্যবহারে উৎসাহিত হওয়া এবং ট্রাফিক আইন মেনে চলা অত্যন্ত জরুরি।",
      "সমন্বিত পরিকল্পনা এবং জনসচেতনতা ছাড়া এই ভয়াবহ সমস্যা থেকে মুক্তি পাওয়া কঠিন। আমাদের সবাইকে একসঙ্গে কাজ করতে হবে একটি যানজটমুক্ত শহর গড়ার জন্য।"
    ],
    imageUrl: 'https://picsum.photos/seed/dhaka-traffic/600/400',
    imageHint: 'city traffic',
    authorId: 'author-2',
    authorName: 'রহিম শেখ',
    authorAvatarUrl: 'https://i.pravatar.cc/150?u=author-2',
    publishedAt: '2024-07-16T11:00:00Z',
    aiSummary: 'ঢাকার যানজট নিরসনে সরকারি উদ্যোগের পাশাপাশি নাগরিকদের সচেতনতা, যেমন ব্যক্তিগত গাড়ির ব্যবহার কমানো এবং ট্রাফিক আইন মেনে চলা জরুরি।',
    editorsPick: true,
    location: 'ঢাকা',
  },
  {
    id: '8',
    title: 'স্বাস্থ্য: ডেঙ্গু প্রতিরোধে সামাজিক সচেতনতা জরুরি',
    category: 'স্বাস্থ্য',
    content: [
      "বর্ষা মৌসুম শুরু হওয়ার সাথে সাথে ডেঙ্গুর প্রকোপ বাড়তে শুরু করেছে। এডিস মশার বংশবিস্তার রোধ করতে வீടിന്റെ চারপাশ পরিষ্কার রাখা এবং জমে থাকা পানি নিষ্কাশন করা অত্যন্ত গুরুত্বপূর্ণ।",
      "স্বাস্থ্য বিশেষজ্ঞরা বলছেন, জ্বর হলেই চিকিৎসকের পরামর্শ নেওয়া উচিত। ডেঙ্গু প্রতিরোধে ব্যক্তিগত সতর্কতার পাশাপাশি সামাজিক সচেতনতা গড়ে তোলা অপরিহার্য।"
    ],
    imageUrl: 'https://picsum.photos/seed/mosquito/600/400',
    imageHint: 'health awareness',
    authorId: 'author-3',
    authorName: 'আলিয়া চৌধুরী',
    authorAvatarUrl: 'https://i.pravatar.cc/150?u=author-3',
    publishedAt: '2024-07-22T12:00:00Z',
    aiSummary: 'ডেঙ্গু প্রতিরোধে এডিস মশার বংশবিস্তার রোধ করতে চারপাশ পরিষ্কার রাখা এবং জ্বর হলে দ্রুত চিকিৎসকের পরামর্শ নেওয়া প্রয়োজন।',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    location: 'ঢাকা',
  },
   {
    id: '9',
    title: 'শিক্ষা: নতুন শিক্ষানীতিতে আসছে বড় পরিবর্তন',
    category: 'শিক্ষা',
    content: [
      "সরকার নতুন জাতীয় শিক্ষানীতি প্রণয়ন করতে যাচ্ছে, যেখানে মুখস্থবিদ্যার পরিবর্তে সমস্যা সমাধান এবং বিশ্লেষণধর্মী শিক্ষার উপর গুরুত্বারোপ করা হবে।",
      "শিক্ষাবিদরা এই উদ্যোগকে স্বাগত জানিয়েছেন এবং বলছেন যে এটি শিক্ষার্থীদের ভবিষ্যতের জন্য আরও ভালোভাবে প্রস্তুত করবে।"
    ],
    imageUrl: 'https://picsum.photos/seed/classroom/600/400',
    imageHint: 'education classroom',
    authorId: 'author-1',
    authorName: 'জান্নাতুল ফেরদৌস',
    authorAvatarUrl: 'https://i.pravatar.cc/150?u=author-1',
    publishedAt: '2024-07-21T09:15:00Z',
    aiSummary: 'নতুন শিক্ষানীতিতে মুখস্থবিদ্যার পরিবর্তে বিশ্লেষণধর্মী শিক্ষার উপর জোর দেওয়া হচ্ছে, যা শিক্ষার্থীদের ভবিষ্যতের জন্য প্রস্তুত করবে।',
  },
  {
    id: '10',
    title: 'পরিবেশ: সুন্দরবনে বাড়ছে বাঘের সংখ্যা',
    category: 'পরিবেশ',
    content: [
      "সর্বশেষ জরিপে সুন্দরবনে বাঘের সংখ্যা বৃদ্ধি পেয়েছে বলে জানিয়েছে বন বিভাগ। এটি পরিবেশবিদ এবং বন্যপ্রাণী প্রেমীদের জন্য একটি আনন্দের খবর।",
      "বাঘের সংখ্যা বৃদ্ধিতে সরকারের বিভিন্ন পদক্ষেপ, যেমন চোরাচালান দমন এবং সচেতনতা বৃদ্ধি, গুরুত্বপূর্ণ ভূমিকা রেখেছে বলে মনে করা হচ্ছে।"
    ],
    imageUrl: 'https://picsum.photos/seed/tiger/600/400',
    imageHint: 'royal bengal',
    authorId: 'author-3',
    authorName: 'আলিয়া চৌধুরী',
    authorAvatarUrl: 'https://i.pravatar.cc/150?u=author-3',
    publishedAt: '2024-07-20T17:00:00Z',
    aiSummary: 'সুন্দরবনে বাঘের সংখ্যা বৃদ্ধি পেয়েছে, যা সরকারের চোরাচালান দমন এবং সচেতনতামূলক কার্যক্রমের ফল বলে মনে করছেন বিশেষজ্ঞরা।',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    editorsPick: true,
    location: 'খুলনা',
  },
  {
    id: '11',
    title: 'বিশেষ কভারেজ: জাতীয় নির্বাচন ২০২৪',
    category: 'বিশেষ-কভারেজ',
    content: [
      "আসন্ন ২০২৪ সালের জাতীয় নির্বাচনকে সামনে রেখে সারাদেশে রাজনৈতিক উত্তেজনা বাড়ছে। প্রধান দলগুলো তাদের প্রার্থী তালিকা চূড়ান্ত করতে ব্যস্ত এবং নির্বাচনী ইশতেহার তৈরির কাজ চলছে।",
      "নির্বাচন কমিশন একটি অবাধ, সুষ্ঠু ও নিরপেক্ষ নির্বাচন অনুষ্ঠানের জন্য সব ধরনের প্রস্তুতি গ্রহণ করছে বলে জানিয়েছে। আন্তর্জাতিক পর্যবেক্ষকরাও এই নির্বাচনের দিকে নজর রাখছেন।"
    ],
    imageUrl: 'https://picsum.photos/seed/election/800/600',
    imageHint: 'election campaign',
    authorId: 'author-1',
    authorName: 'জান্নাতুল ফেরদৌস',
    authorAvatarUrl: 'https://i.pravatar.cc/150?u=author-1',
    publishedAt: '2024-07-23T08:00:00Z',
    aiSummary: 'জাতীয় নির্বাচন ২০২৪ ঘিরে রাজনৈতিক দলগুলো প্রস্তুতি নিচ্ছে এবং নির্বাচন কমিশন একটি সুষ্ঠু নির্বাচনের আশ্বাস দিচ্ছে।',
    badge: 'জনপ্রিয়',
    editorsPick: true,
  },
  {
    id: '12',
    title: 'বিনোদন: নতুন ওয়েব সিরিজে চমক দেখালেন জনপ্রিয় অভিনেত্রী',
    category: 'বিনোদন',
    content: [
        "OTT প্ল্যাটফর্মে মুক্তি পেয়েছে নতুন ওয়েব সিরিজ 'রহস্যের জাল'। এতে প্রধান চরিত্রে অভিনয় করে দর্শকদের মন জয় করেছেন জনপ্রিয় অভিনেত্রী সাবিলা নূর।",
        "থ্রিলারধর্মী এই সিরিজটি মুক্তির প্রথম দিন থেকেই আলোচনার শীর্ষে রয়েছে। সমালোচকরাও তার অভিনয়ের প্রশংসা করেছেন।"
    ],
    imageUrl: 'https://picsum.photos/seed/web-series/600/400',
    imageHint: 'actress portrait',
    authorId: 'author-2',
    authorName: 'রহিম শেখ',
    authorAvatarUrl: 'https://i.pravatar.cc/150?u=author-2',
    publishedAt: '2024-07-24T10:00:00Z',
    aiSummary: 'নতুন ওয়েব সিরিজ \'রহস্যের জাল\'-এ অনবদ্য অভিনয় করে প্রশংসা কুড়াচ্ছেন সাবিলা নূর, সিরিজটি মুক্তির পরই ব্যাপক জনপ্রিয়তা পেয়েছে।'
  },
  {
    id: '13',
    title: 'খেলা: শ্বাসরুদ্ধকর ম্যাচে জয় পেল আবাহনী',
    category: 'খেলা',
    content: [
        "বাংলাদেশ প্রিমিয়ার লিগের এক গুরুত্বপূর্ণ ম্যাচে মোহামেডানকে ২-১ গোলে হারিয়েছে আবাহনী লিমিটেড। ম্যাচের শেষ মুহূর্তে আবাহনীর ফরোয়ার্ডের করা গোলে জয় নিশ্চিত হয়।",
        "এই জয়ে পয়েন্ট টেবিলের শীর্ষে উঠে এসেছে আবাহনী। সমর্থকরা ক্লাবের এই পারফরম্যান্সে উচ্ছ্বসিত।"
    ],
    imageUrl: 'https://picsum.photos/seed/football-match/600/400',
    imageHint: 'football players',
    authorId: 'author-2',
    authorName: 'রহিম শেখ',
    authorAvatarUrl: 'https://i.pravatar.cc/150?u=author-2',
    publishedAt: '2024-07-24T18:00:00Z',
    aiSummary: 'বাংলাদেশ প্রিমিয়ার লিগের উত্তেজনাপূর্ণ ম্যাচে আবাহনী ২-১ গোলে মোহামেডানকে হারিয়ে পয়েন্ট টেবিলের শীর্ষে উঠে এসেছে।',
    location: 'ঢাকা',
  },
  {
    id: '14',
    title: 'রাজনীতি: সিটি কর্পোরেশন নির্বাচনের তফসিল ঘোষণা',
    category: 'রাজনীতি',
    content: [
        "নির্বাচন কমিশন ঢাকা উত্তর সিটি কর্পোরেশনের মেয়র পদে উপ-নির্বাচনের তফসিল ঘোষণা করেছে। আগামী মাসে ভোটগ্রহণ অনুষ্ঠিত হবে।",
        "প্রধান রাজনৈতিক দলগুলো ইতিমধ্যে তাদের সম্ভাব্য প্রার্থীদের নিয়ে আলোচনা শুরু করেছে। নগরবাসী একজন যোগ্য প্রতিনিধি নির্বাচনের অপেক্ষায় রয়েছে।"
    ],
    imageUrl: 'https://picsum.photos/seed/city-election/600/400',
    imageHint: 'city hall',
    authorId: 'author-1',
    authorName: 'জান্নাতুল ফেরদৌস',
    authorAvatarUrl: 'https://i.pravatar.cc/150?u=author-1',
    publishedAt: '2024-07-25T11:00:00Z',
    aiSummary: 'ঢাকা উত্তর সিটি কর্পোরেশনের উপ-নির্বাচনের তফসিল ঘোষণা করা হয়েছে, যা আগামী মাসে অনুষ্ঠিত হবে। দলগুলো প্রার্থী চূড়ান্ত করতে ব্যস্ত।',
    location: 'ঢাকা',
  },
  {
    id: '15',
    title: 'খেলা: সাকিব আল হাসান নতুন মাইলফলকের সামনে',
    category: 'খেলা',
    content: [
      "বিশ্বসেরা অলরাউন্ডার সাকিব আল হাসান আন্তর্জাতিক ক্রিকেটে আরও একটি মাইলফলক স্পর্শ করার দ্বারপ্রান্তে। আর মাত্র ৫০ রান করলেই তিনি ১০,০০০ রান এবং ৫০০ উইকেটের ডাবল অর্জনকারী তৃতীয় ক্রিকেটার হবেন।",
      "ভক্তরা তার এই অর্জনের জন্য অধীর আগ্রহে অপেক্ষা করছে। আগামী সিরিজেই তিনি এই রেকর্ড গড়তে পারবেন বলে আশা করা হচ্ছে।"
    ],
    imageUrl: 'https://picsum.photos/seed/shakib-al-hasan/600/400',
    imageHint: 'cricket player',
    authorId: 'author-2',
    authorName: 'রহিম শেখ',
    authorAvatarUrl: 'https://i.pravatar.cc/150?u=author-2',
    publishedAt: '2024-07-25T15:00:00Z',
    aiSummary: 'সাকিব আল হাসান ১০,০০০ রান ও ৫০০ উইকেটের ডাবল অর্জনের দ্বারপ্রান্তে, যা তাকে আন্তর্জাতিক ক্রিকেটে এক বিরল সম্মান এনে দেবে।'
  },
  {
    id: '16',
    title: 'বিনোদন: শাকিব খানের নতুন সিনেমার শুটিং শুরু',
    category: 'বিনোদন',
    content: [
      "ঢালিউড সুপারস্টার শাকিব খানের নতুন ছবি 'অগ্নিপথ'-এর শুটিং শুরু হয়েছে। ছবিটি পরিচালনা করছেন জনপ্রিয় পরিচালক রায়হান রাফি।",
      "ছবিটিতে শাকিবের বিপরীতে দেখা যাবে নবাগতা এক নায়িকাকে। অ্যাকশন-থ্রিলার ঘরানার এই সিনেমাটি আগামী বছর মুক্তি পাওয়ার কথা রয়েছে।"
    ],
    imageUrl: 'https://picsum.photos/seed/shakib-khan/600/400',
    imageHint: 'film shooting',
    authorId: 'author-2',
    authorName: 'রহিম শেখ',
    authorAvatarUrl: 'https://i.pravatar.cc/150?u=author-2',
    publishedAt: '2024-07-26T12:00:00Z',
    aiSummary: 'শাকিব খানের নতুন অ্যাকশন-থ্রিলার সিনেমা \'অগ্নিপথ\'-এর শুটিং শুরু হয়েছে, যা পরিচালনা করছেন রায়হান রাফি এবং আগামী বছর মুক্তি পাবে।'
  },
  {
    id: '17',
    title: 'রাজনীতি: সংসদ অধিবেশন শুরু, গুরুত্বপূর্ণ বিল উত্থাপন',
    category: 'রাজনীতি',
    content: [
      "জাতীয় সংসদের বাজেট অধিবেশন শুরু হয়েছে। অধিবেশনের প্রথম দিনে বেশ কয়েকটি গুরুত্বপূর্ণ বিল উত্থাপন করা হয়েছে।",
      "বিরোধী দল বিভিন্ন ইস্যুতে সরকারের সমালোচনা করেছে এবং জনগণের স্বার্থে কাজ করার আহ্বান জানিয়েছে। অধিবেশন চলবে আগামী মাস পর্যন্ত।"
    ],
    imageUrl: 'https://picsum.photos/seed/parliament/600/400',
    imageHint: 'government building',
    authorId: 'author-1',
    authorName: 'জান্নাতুল ফেরদৌস',
    authorAvatarUrl: 'https://i.pravatar.cc/150?u=author-1',
    publishedAt: '2024-07-26T17:30:00Z',
    aiSummary: 'জাতীয় সংসদের বাজেট অধিবেশন শুরু হয়েছে, যেখানে গুরুত্বপূর্ণ বিল উত্থাপন এবং বিরোধী দলের সমালোচনার মধ্য দিয়ে কার্যক্রম চলছে।'
  },
  {
    id: '18',
    title: 'প্রযুক্তি: শিক্ষার্থীদের জন্য নতুন ল্যাপটপ প্রোগ্রাম চালু',
    category: 'প্রযুক্তি',
    content: [
      "সরকারের আইসিটি বিভাগ মেধাবী শিক্ষার্থীদের জন্য 'এক শিক্ষার্থী, এক ল্যাপটপ' প্রকল্পের দ্বিতীয় পর্যায় শুরু করেছে। এর আওতায় দেশের বিভিন্ন বিশ্ববিদ্যালয়ের শিক্ষার্থীদের মাঝে বিনামূল্যে ল্যাপটপ বিতরণ করা হবে।",
      "ডিজিটাল বাংলাদেশ গড়ার লক্ষ্যে এই উদ্যোগ নেওয়া হয়েছে বলে জানিয়েছে কর্তৃপক্ষ। এটি শিক্ষার্থীদের গবেষণা এবং অনলাইন শিক্ষায় সহায়তা করবে।"
    ],
    imageUrl: 'https://picsum.photos/seed/laptop-student/600/400',
    imageHint: 'student laptop',
    authorId: 'author-1',
    authorName: 'জান্নাতুল ফেরদৌস',
    authorAvatarUrl: 'https://i.pravatar.cc/150?u=author-1',
    publishedAt: '2024-07-27T09:00:00Z',
    aiSummary: 'সরকার \'এক শিক্ষার্থী, এক ল্যাপটপ\' প্রকল্পের দ্বিতীয় পর্যায় শুরু করেছে, যার মাধ্যমে মেধাবী বিশ্ববিদ্যালয় শিক্ষার্থীদের বিনামূল্যে ল্যাপটপ দেওয়া হবে।',
    sponsored: true,
  },
  {
    id: '19',
    title: 'জাতীয়: পদ্মা সেতুর এক বছর পূর্তি উদযাপন',
    category: 'জাতীয়',
    content: [
      "বাংলাদেশের স্বপ্নের পদ্মা সেতুর উদ্বোধনের এক বছর পূর্তি উপলক্ষে দেশব্যাপী আনন্দ ও উৎসবের আমেজ। সেতুটি দেশের দক্ষিণাঞ্চলের অর্থনীতিতে বৈপ্লবিক পরিবর্তন এনেছে।",
      "বিশেষজ্ঞরা বলছেন, এই সেতুর ফলে জিডিপি প্রবৃদ্ধিতে ইতিবাচক প্রভাব পড়েছে এবং নতুন নতুন শিল্প-কারখানা গড়ে উঠছে।"
    ],
    imageUrl: 'https://picsum.photos/seed/padma-bridge/600/400',
    imageHint: 'long bridge',
    authorId: 'author-1',
    authorName: 'জান্নাতুল ফেরদৌস',
    authorAvatarUrl: 'https://i.pravatar.cc/150?u=author-1',
    publishedAt: '2024-06-25T10:00:00Z',
    aiSummary: 'স্বপ্নের পদ্মা সেতুর এক বছর পূর্তি উদযাপিত হচ্ছে। সেতুটি দক্ষিণাঞ্চলের অর্থনীতিতে বিপ্লব এনেছে এবং জিডিপি প্রবৃদ্ধিতে ভূমিকা রাখছে।',
    editorsPick: true,
    factCheck: {
      statement: "পদ্মা সেতুর ফলে জিডিপি প্রবৃদ্ধি ১.২৩% বৃদ্ধি পেয়েছে।",
      verdict: 'সত্য',
      source: { name: "অর্থনীতি গবেষণা কেন্দ্র", url: "#" }
    }
  },
  {
    id: '20',
    title: 'জাতীয়: মেট্রোরেল ব্যবহারে বাড়ছে জনসচেতনতা',
    category: 'জাতীয়',
    content: [
      "ঢাকার যানজট নিরসনে মেট্রোরেল এক যুগান্তকারী পদক্ষেপ। চালু হওয়ার পর থেকে মেট্রোরেল ব্যবহারে জনগণের আগ্রহ ক্রমাগত বাড়ছে। এটি সময় এবং অর্থ উভয়ই সাশ্রয় করছে।",
      "কর্তৃপক্ষ বলছে, সম্পূর্ণ রুট চালু হলে এটি ঢাকার গণপরিবহন ব্যবস্থায় আরও বড় ইতিবাচক পরিবর্তন আনবে।"
    ],
    imageUrl: 'https://picsum.photos/seed/metro-rail/600/400',
    imageHint: 'metro train',
    authorId: 'author-3',
    authorName: 'আলিয়া চৌধুরী',
    authorAvatarUrl: 'https://i.pravatar.cc/150?u=author-3',
    publishedAt: '2024-07-28T11:00:00Z',
    aiSummary: 'ঢাকার যানজট কমাতে মেট্রোরেলের জনপ্রিয়তা বাড়ছে। এটি সময় ও অর্থ সাশ্রয়ী হওয়ায় জনগণ এর ব্যবহারে cada vez más আগ্রহী হচ্ছে।',
    badge: 'জনপ্রিয়',
    location: 'ঢাকা',
  },
  {
    id: '21',
    title: 'ইসলামী জীবন: রমজানের পবিত্রতা ও তাৎপর্য',
    category: 'ইসলামী-জীবন',
    content: [
      "রমজান মাস মুসলিমদের জন্য অত্যন্ত পবিত্র একটি মাস। এই মাসে সিয়াম সাধনার মাধ্যমে আত্মশুদ্ধি ও আল্লাহর নৈকট্য লাভের চেষ্টা করা হয়।",
      "রমজানের মূল উদ্দেশ্য হলো ধৈর্য, সংযম এবং সহানুভূতির শিক্ষা লাভ করা। এই মাসে ইবাদতের মাধ্যমে মুসলিমরা তাদের আধ্যাত্মিক উন্নতি সাধন করেন।"
    ],
    imageUrl: 'https://picsum.photos/seed/ramadan/600/400',
    imageHint: 'mosque interior',
    authorId: 'author-3',
    authorName: 'আলিয়া চৌধুরী',
    authorAvatarUrl: 'https://i.pravatar.cc/150?u=author-3',
    publishedAt: '2025-03-01T10:00:00Z',
    aiSummary: 'রমজান মাস মুসলিমদের জন্য আত্মশুদ্ধি, ধৈর্য ও সংযমের মাস। এই মাসে ইবাদতের মাধ্যমে আধ্যাত্মিক উন্নতি লাভ করা হয়।'
  },
  {
    id: '22',
    title: 'ইসলামী জীবন: যাকাতের গুরুত্ব ও বিধান',
    category: 'ইসলামী-জীবন',
    content: [
      "ইসলামের পাঁচটি স্তম্ভের মধ্যে যাকাত অন্যতম। এটি ধনীদের সম্পদে গরীবের অধিকার নিশ্চিত করে এবং সমাজে অর্থনৈতিক ভারসাম্য রক্ষা করে।",
      "সঠিকভাবে যাকাত আদায় করলে দারিদ্র্য বিমোচন এবং সামাজিক সম্প্রীতি বৃদ্ধি পায়। তাই каждому সামর্থ্যবান মুসলিমের উচিত সঠিকভাবে যাকাত প্রদান করা।"
    ],
    imageUrl: 'https://picsum.photos/seed/zakat/600/400',
    imageHint: 'charity giving',
    authorId: 'author-3',
    authorName: 'আলিয়া চৌধুরী',
    authorAvatarUrl: 'https://i.pravatar.cc/150?u=author-3',
    publishedAt: '2025-03-10T12:00:00Z',
    aiSummary: 'যাকাত ইসলামের একটি গুরুত্বপূর্ণ স্তম্ভ যা সমাজে অর্থনৈতিক ভারসাম্য রক্ষা করে এবং দারিদ্র্য বিমোচনে সহায়তা করে।'
  },
  {
    id: '23',
    title: "তথ্য যাচাই: সামাজিক মাধ্যমে চাঁদে জমি কেনার খবরটি কি সত্যি?",
    category: 'তথ্য-যাচাই',
    content: [
      "সম্প্রতি সামাজিক যোগাযোগ মাধ্যমে একটি খবর ভাইরাল হয়েছে যেখানে দাবি করা হচ্ছে একজন বাংলাদেশী নাগরিক চাঁদে এক একর জমি কিনেছেন। আমাদের অনুসন্ধানে দেখা গেছে এই দাবিটি সম্পূর্ণ ভুয়া।",
      "চাঁদে জমি কেনা-বেচার কোনো আন্তর্জাতিক আইন বা স্বীকৃতি নেই। 'লুনার রেজিস্ট্রি' নামক কিছু ওয়েবসাইট থাকলেও সেগুলো কোনো দেশের সরকার বা আন্তর্জাতিক সংস্থা দ্বারা স্বীকৃত নয়। এগুলো মূলত প্রতীকী এবং বিনোদনমূলক। তাই, চাঁদে জমি কেনার খবরটি সত্য নয়।"
    ],
    imageUrl: 'https://picsum.photos/seed/moon-land/600/400',
    imageHint: 'moon surface',
    authorId: 'author-1',
    authorName: 'জান্নাতুল ফেরদৌস',
    authorAvatarUrl: 'https://i.pravatar.cc/150?u=author-1',
    publishedAt: '2024-07-28T14:00:00Z',
    aiSummary: 'সামাজিক মাধ্যমে চাঁদে জমি কেনার যে খবর প্রচারিত হচ্ছে, তা সম্পূর্ণ ভুয়া। চাঁদে জমি কেনা-বেচার কোনো আইনি ভিত্তি নেই।',
    factCheck: {
      statement: "একজন বাংলাদেশী নাগরিক চাঁদে এক একর জমি কিনেছেন।",
      verdict: 'ভুয়া',
      source: { name: "আন্তর্জাতিক মহাকাশ আইন", url: "#" }
    }
  },
  {
    id: '24',
    title: "তথ্য যাচাই: আনারসের সাথে দুধ খেলে কি সত্যি মানুষের মৃত্যু হয়?",
    category: 'তথ্য-যাচাই',
    content: [
      "একটি প্রচলিত ধারণা হলো আনারসের সাথে দুধ খেলে বিষক্রিয়া হয়ে মানুষের মৃত্যু হতে পারে। আমাদের অনুসন্ধানে এবং চিকিৎসা বিজ্ঞানীদের মতে, এই ধারণাটি একটি সম্পূর্ণ গুজব।",
      "আনারস এবং দুধ একসাথে খেলে হজমে সমস্যা হতে পারে, কারণ আনারসে থাকা ব্রোমেলিন নামক এনজাইম দুধের প্রোটিন ভেঙে দেয়। তবে এটি কোনোভাবেই বিষাক্ত বা প্রাণঘাতী নয়। অতিরিক্ত খেলে পেট ব্যথা বা ডায়রিয়া হতে পারে, কিন্তু মৃত্যুঝুঁকি নেই।"
    ],
    imageUrl: 'https://picsum.photos/seed/pineapple-milk/600/400',
    imageHint: 'pineapple milk',
    authorId: 'author-3',
    authorName: 'আলিয়া চৌধুরী',
    authorAvatarUrl: 'https://i.pravatar.cc/150?u=author-3',
    publishedAt: '2024-07-27T16:00:00Z',
    aiSummary: 'আনারস এবং দুধ একসাথে খেলে মানুষের মৃত্যু হয় - এই ধারণাটি একটি সম্পূর্ণ গুজব। হজমে সমস্যা হতে পারে, কিন্তু এটি প্রাণঘাতী নয়।',
    factCheck: {
      statement: "আনারসের সাথে দুধ খেলে বিষক্রিয়া হয়ে মানুষের মৃত্যু হয়।",
      verdict: 'ভুয়া',
      source: { name: "পুষ্টি ও খাদ্যবিজ্ঞান ইনস্টিটিউট", url: "#" }
    }
  }
];

const articles: Article[] = articlesData.map(article => ({
    ...article,
    slug: generateNonAiSlug(article.title),
}));

const pages: Page[] = [
    {
        id: 'page-1',
        title: 'আমাদের সম্পর্কে',
        slug: 'about-us',
        content: [
            "বার্তা নাও একটি স্বাধীন অনলাইন নিউজ পোর্টাল। আমরা পাঠকের কাছে বস্তুনিষ্ঠ, নির্ভুল এবং সর্বশেষ সংবাদ পৌঁছে দিতে প্রতিশ্রুতিবদ্ধ। আমাদের লক্ষ্য হলো তথ্যের অবাধ প্রবাহ নিশ্চিত করা এবং গণতন্ত্রকে শক্তিশালী করা।",
            "আমাদের একদল অভিজ্ঞ এবং নিবেদিতপ্রাণ সাংবাদিক রয়েছেন যারা মাঠ থেকে খবর সংগ্রহ করে এবং সেগুলোকে আপনাদের সামনে তুলে ধরে। আমরা রাজনীতি, অর্থনীতি, খেলা, বিনোদন, প্রযুক্তি এবং আরও অনেক বিষয়ে খবর পরিবেশন করি।"
        ],
        publishedAt: '2024-01-01T10:00:00Z',
        lastUpdatedAt: '2024-07-20T12:00:00Z',
    },
    {
        id: 'page-2',
        title: 'যোগাযোগ করুন',
        slug: 'contact-us',
        content: [
            "আমাদের সাথে যোগাযোগ করার জন্য ধন্যবাদ। আপনার যেকোনো প্রশ্ন, মতামত বা অভিযোগের জন্য আমরা সর্বদা প্রস্তুত।",
            "ইমেইল: contact@bartanow.com",
            "ফোন: +৮৮০ ১২৩৪ ৫৬৭৮৯০",
            "ঠিকানা: ১২৩ নিউজ স্ট্রিট, ঢাকা, বাংলাদেশ",
        ],
        publishedAt: '2024-01-01T10:00:00Z',
        lastUpdatedAt: '2024-01-01T10:00:00Z',
    }
];

const memeNews: MemeNews[] = [
    {
      id: 'meme-1',
      title: "খেলা: বাংলাদেশের দুর্দান্ত জয়ে এশিয়া কাপ শুরু",
      articleId: '1',
      imageUrl: 'https://picsum.photos/seed/cricket-win-meme/500/500',
      imageHint: 'happy fan',
      topText: 'যখন বাংলাদেশ জিতে',
      bottomText: 'আমার রিঅ্যাকশন',
    },
    {
      id: 'meme-2',
      title: "প্রযুক্তি: দেশজুড়ে 5G সেবা চালু হতে যাচ্ছে",
      articleId: '2',
      imageUrl: 'https://picsum.photos/seed/5g-speed-meme/500/500',
      imageHint: 'fast running',
      topText: 'আমি যখন 4G ব্যবহার করি',
      bottomText: 'আমার বন্ধু যখন 5G ব্যবহার করে',
    },
     {
      id: 'meme-3',
      title: "রাজনীতি: বিএনপি’র নতুন কর্মসূচি ঘোষণা",
      articleId: '4',
      imageUrl: 'https://picsum.photos/seed/politics-meme/500/500',
      imageHint: 'man thinking',
      topText: 'যখন শুনি নতুন রাজনৈতিক কর্মসূচি',
      bottomText: 'আমি ভাবছি: এবার কী হবে?',
    },
];

const comments: Comment[] = [
    { 
        id: 'comment-1', 
        articleId: '1', 
        userId: 'user-2', 
        userName: 'Regular User', 
        userAvatar: 'https://i.pravatar.cc/150?u=regular-user', 
        text: 'দারুণ খেলেছে বাংলাদেশ! এই জয়টা খুব দরকার ছিল।', 
        timestamp: '2024-07-22T11:00:00Z',
        isApproved: true,
    },
    {
        id: 'comment-2', 
        articleId: '2', 
        userId: 'user-1', 
        userName: 'Admin User', 
        userAvatar: 'https://i.pravatar.cc/150?u=admin-user', 
        text: '5G প্রযুক্তি আমাদের দেশের জন্য একটি নতুন দিগন্ত উন্মোচন করবে। অসাধারণ উদ্যোগ!', 
        timestamp: '2024-07-21T15:00:00Z',
        isApproved: true,
    },
    { 
        id: 'comment-3', 
        articleId: '1', 
        userId: 'user-3', 
        userName: 'Editor User', 
        userAvatar: 'https://i.pravatar.cc/150?u=editor-user', 
        text: 'এই ম্যাচের বিশ্লেষণধর্মী একটি ফলো-আপ আর্টিকেল করা যেতে পারে।', 
        timestamp: '2024-07-22T12:30:00Z',
        isApproved: false, // Example of an unapproved comment
    },
];

const media: Media[] = articles.map((article, index) => ({
    id: `media-${index + 1}`,
    fileName: `${article.slug}.jpg`,
    url: article.imageUrl,
    mimeType: 'image/jpeg',
    size: Math.floor(Math.random() * (500 * 1024 - 100 * 1024 + 1)) + (100 * 1024), // Random size between 100KB and 500KB
    uploadedAt: article.publishedAt,
    uploadedBy: article.authorId,
}));

const notifications: Notification[] = [
    {
        id: 'notif-1',
        userId: 'user-2',
        type: 'breaking',
        title: 'ব্রেকিং নিউজ: জাতীয় নির্বাচন অনুষ্ঠিত হবে আগামী মাসে',
        message: 'নির্বাচন কমিশন এইমাত্র আগামী মাসের ১০ তারিখে জাতীয় নির্বাচনের তারিখ ঘোষণা করেছে।',
        articleId: '11',
        articleSlug: articles.find(a => a.id === '11')?.slug,
        isRead: false,
        timestamp: '2024-07-29T10:00:00Z',
    },
    {
        id: 'notif-2',
        userId: 'user-2',
        type: 'topic',
        title: 'আপনার পছন্দের বিষয়ে নতুন খবর: খেলা',
        message: 'বাংলাদেশ প্রিমিয়ার লিগের উত্তেজনাপূর্ণ ম্যাচে মোহামেডানকে হারিয়েছে আবাহনী।',
        articleId: '13',
        articleSlug: articles.find(a => a.id === '13')?.slug,
        isRead: false,
        timestamp: '2024-07-29T09:00:00Z',
    },
    {
        id: 'notif-3',
        userId: 'user-2',
        type: 'system',
        title: 'সিস্টেম আপডেট: নতুন ড্যাশবোর্ড ফিচার',
        message: 'আপনার ড্যাশবোর্ডে এখন থেকে সংরক্ষিত আর্টিকেল এবং পঠিত ইতিহাস দেখতে পাবেন।',
        isRead: true,
        timestamp: '2024-07-28T18:00:00Z',
    },
     {
        id: 'notif-4',
        userId: 'user-1', // For admin
        type: 'system',
        title: 'নতুন ব্যবহারকারী রেজিস্ট্রেশন করেছেন',
        message: 'Regular User (user@bartanow.com) আপনার সাইটে রেজিস্ট্রেশন করেছেন।',
        isRead: true,
        timestamp: '2024-07-28T17:00:00Z',
    }
];

const polls: Poll[] = [
    {
      id: 'poll-1',
      question: 'আগামী নির্বাচনে কোন দল জিতবে বলে আপনার মনে হয়?',
      options: [
        { id: 'option1', label: 'দল ক', votes: 42 },
        { id: 'option2', label: 'দল খ', votes: 35 },
        { id: 'option3', label: 'অন্যান্য', votes: 23 },
      ],
      createdAt: '2024-07-28T10:00:00Z',
      isActive: true,
    },
    {
        id: 'poll-2',
        question: 'আপনি কি শহরের যানজট কমাতে পাবলিক ট্রান্সপোর্ট ব্যবহারে আগ্রহী?',
        options: [
            { id: 'option4', label: 'হ্যাঁ, আগ্রহী', votes: 88 },
            { id: 'option5', label: 'না, আগ্রহী নই', votes: 12 },
            { id: 'option6', label: 'মন্তব্য নেই', votes: 5 },
        ],
        createdAt: '2024-07-25T11:00:00Z',
        isActive: true,
    },
     {
      id: 'poll-3',
      question: 'অনলাইন শিক্ষার কার্যকারিতা নিয়ে আপনার মতামত কী?',
      options: [
        { id: 'option7', label: 'খুবই কার্যকর', votes: 55 },
        { id: 'option8', label: 'মোটামুটি কার্যকর', votes: 30 },
        { id: 'option9', label: 'কার্যকর নয়', votes: 15 },
      ],
      createdAt: '2024-07-20T12:00:00Z',
      isActive: false,
    },
];

const menuItems: MenuItem[] = [
    { id: '1', name: 'সর্বশেষ', href: '/category/সর্বশেষ', order: 1, children: [] },
    { id: '2', name: 'জাতীয়', href: '/category/জাতীয়', order: 2, children: [] },
    { id: '3', name: 'রাজনীতি', href: '/category/রাজনীতি', order: 3, children: [] },
    { id: '4', name: 'খেলা', href: '/category/খেলা', order: 4, children: [] },
    { id: '5', name: 'বিনোদন', href: '/category/বিনোদন', order: 5, children: [] },
    { id: '6', name: 'প্রযুক্তি', href: '/category/প্রযুক্তি', order: 6, children: [] },
    { id: '7', name: 'আন্তর্জাতিক', href: '/category/আন্তর্জাতিক', order: 7, children: [] },
    { id: '8', name: 'ইসলামী জীবন', href: '/category/ইসলামী-জীবন', order: 8, children: [] },
    { id: '9', name: 'বিশেষ কভারেজ', href: '/special-coverage', order: 9, children: [] },
    { id: '10', name: 'ভিডিও', href: '/category/videos', order: 10, children: [] },
    { id: '11', name: 'মিম নিউজ', href: '/category/মিম-নিউজ', order: 11, children: [] },
];

const subscribers: Subscriber[] = [];

export const mockDb = {
  users,
  authors,
  articles,
  pages,
  polls,
  memeNews,
  comments,
  media,
  notifications,
  menuItems,
  subscribers,
};
