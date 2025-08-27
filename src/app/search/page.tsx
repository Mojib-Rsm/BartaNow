import { getArticles } from '@/lib/api';
import ArticleCard from '@/components/article-card';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

type SearchPageProps = {
  searchParams?: {
    q?: string;
  };
};

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const query = searchParams?.q || '';
  if (query) {
    return {
      title: `"${query}" এর জন্য অনুসন্ধান ফলাফল`,
      description: `"${query}" সম্পর্কিত খবর এবং আর্টিকেল খুঁজুন।`,
    };
  }
  return {
    title: 'অনুসন্ধান',
    description: 'আপনার পছন্দের খবর খুঁজুন।',
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams?.q;

  if (!query) {
    return (
      <div className="text-center py-16">
        <h1 className="text-3xl font-bold font-headline mb-4">অনুসন্ধান করুন</h1>
        <p className="text-muted-foreground">অনুগ্রহ করে কিছু লিখে অনুসন্ধান করুন।</p>
      </div>
    );
  }

  const { articles } = await getArticles({ query });

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold font-headline">
          অনুসন্ধানের ফলাফল: <span className="text-primary">&quot;{query}&quot;</span>
        </h1>
        <p className="text-muted-foreground mt-2">
          {new Intl.NumberFormat('bn-BD').format(articles.length)} টি ফলাফল পাওয়া গেছে
        </p>
      </header>

      {articles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-muted-foreground">দুঃখিত, আপনার অনুসন্ধানের জন্য কোনো ফলাফল পাওয়া যায়নি।</p>
        </div>
      )}
    </div>
  );
}
