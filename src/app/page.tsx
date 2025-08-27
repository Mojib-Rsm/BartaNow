import { getArticles } from '@/lib/api';
import ArticleCard from '@/components/article-card';
import Pagination from '@/components/pagination';
import SeedButton from '@/components/seed-button';

type HomePageProps = {
  searchParams?: {
    page?: string;
  };
};

export default async function Home({ searchParams }: HomePageProps) {
  const page = searchParams?.page ? parseInt(searchParams.page, 10) : 1;
  const { articles, totalPages } = await getArticles({ page, limit: 6 });

  return (
    <div className="space-y-8">
      <header className="text-center relative">
        <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary">The Latest News</h1>
        <p className="mt-2 text-lg text-muted-foreground">Stay informed with our latest articles and updates.</p>
        <div className="absolute top-0 right-0">
          <SeedButton />
        </div>
      </header>

      {articles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
            <p className="text-muted-foreground mb-4">No articles found in the database.</p>
            <p className="text-muted-foreground">Click the "Seed Database" button to add demo articles.</p>
        </div>
      )}

      {totalPages > 1 && (
        <Pagination currentPage={page} totalPages={totalPages} />
      )}
    </div>
  );
}
