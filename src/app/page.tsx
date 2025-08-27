import { getArticles } from '@/lib/api';
import ArticleCard from '@/components/article-card';
import Pagination from '@/components/pagination';
import SeedButton from '@/components/seed-button';
import Image from 'next/image';
import Link from 'next/link';

type HomePageProps = {
  searchParams?: {
    page?: string;
  };
};

export default async function Home({ searchParams }: HomePageProps) {
  const page = searchParams?.page ? parseInt(searchParams.page, 10) : 1;
  const { articles, totalPages } = await getArticles({ page, limit: 7 }); // Fetch 7 to use one as featured

  const featuredArticle = articles.length > 0 ? articles[0] : null;
  const otherArticles = articles.length > 1 ? articles.slice(1) : [];

  return (
    <div className="space-y-12">
      <header className="text-center relative">
        <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary">সর্বশেষ সংবাদ</h1>
        <p className="mt-2 text-lg text-muted-foreground">আমাদের সর্বশেষ আর্টিকেল ও আপডেটের সাথে অবগত থাকুন।</p>
        <div className="absolute top-0 right-0">
          <SeedButton />
        </div>
      </header>

      {featuredArticle && page === 1 && (
        <section>
          <Link href={`/articles/${featuredArticle.id}`} className="block group">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-card p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300">
              <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden">
                <Image
                  src={featuredArticle.imageUrl}
                  alt={featuredArticle.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  data-ai-hint={featuredArticle.imageHint}
                  priority
                />
              </div>
              <div className="space-y-4">
                <p className="text-sm text-accent font-semibold">ফিচারড আর্টিকেল</p>
                <h2 className="text-3xl md:text-4xl font-bold font-headline text-primary group-hover:underline">
                  {featuredArticle.title}
                </h2>
                <p className="text-muted-foreground line-clamp-4">
                  {featuredArticle.aiSummary}
                </p>
                <div className="text-sm text-muted-foreground">
                  <span>{featuredArticle.authorName}</span> &middot; <span>{new Date(featuredArticle.publishedAt).toLocaleDateString('bn-BD', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
              </div>
            </div>
          </Link>
        </section>
      )}

      {otherArticles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {otherArticles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      ) : page > 1 && articles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
                <ArticleCard key={article.id} article={article} />
            ))}
        </div>
       ) : (
        <div className="text-center py-16">
            <p className="text-muted-foreground mb-4">কোনো আর্টিকেল খুঁজে পাওয়া যায়নি।</p>
            <p className="text-muted-foreground">ডেমো আর্টিকেল যোগ করতে "Seed Database" বোতামে ক্লিক করুন।</p>
        </div>
      )}

      {totalPages > 1 && (
        <Pagination currentPage={page} totalPages={totalPages} />
      )}
    </div>
  );
}
