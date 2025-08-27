import { getArticles } from '@/lib/api';
import ArticleCard from '@/components/article-card';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import LoadMoreCategory from '@/components/load-more-category';

type CategoryPageProps = {
  params: {
    categoryName: string;
  };
};

const CATEGORY_MAP: { [key: string]: string } = {
    politics: 'রাজনীতি',
    sports: 'খেলা',
    tech: 'প্রযুক্তি',
    entertainment: 'বিনোদন',
    international: 'আন্তর্জাতিক',
    latest: 'সর্বশেষ',
    'editors-pick': 'সম্পাদকের পছন্দ',
    videos: 'ভিডিও',
    polls: 'মতামত জরিপ'
};

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const categoryName = decodeURI(params.categoryName);
  const displayName = CATEGORY_MAP[categoryName.toLowerCase()] || categoryName;

  return {
    title: `${displayName} বিষয়ক সকল খবর`,
    description: `বার্তা নাও থেকে ${displayName} ক্যাটাগরির সর্বশেষ সংবাদ এবং আপডেট।`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const categoryName = decodeURI(params.categoryName);
  const displayName = CATEGORY_MAP[categoryName.toLowerCase()] || categoryName;
  
  const { articles, totalPages } = await getArticles({ 
      category: displayName as any, 
      page: 1, 
      limit: 12 
    });

  if (articles.length === 0) {
    return (
        <div className="text-center py-16">
            <h1 className="text-3xl font-bold font-headline mb-4">{displayName}</h1>
            <p className="text-muted-foreground">দুঃখিত, এই ক্যাটাগরিতে কোনো আর্টিকেল খুঁজে পাওয়া যায়নি।</p>
        </div>
    );
  }

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold font-headline text-primary border-b-2 border-primary pb-2">
          {displayName}
        </h1>
      </header>
      
      <LoadMoreCategory 
        initialArticles={articles} 
        totalPages={totalPages} 
        category={displayName} 
      />
    </div>
  );
}
