import { getArticles } from '@/lib/api';
import ArticleCard from '@/components/article-card';
import Pagination from '@/components/pagination';
import SeedButton from '@/components/seed-button';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

type HomePageProps = {
  searchParams?: {
    page?: string;
  };
};

export default async function Home({ searchParams }: HomePageProps) {
  const page = searchParams?.page ? parseInt(searchParams.page, 10) : 1;
  const { articles, totalPages } = await getArticles({ page, limit: 12 });

  if (articles.length === 0) {
    return (
      <div className="text-center py-16 col-span-full">
        <p className="text-muted-foreground mb-4">কোনো আর্টিকেল খুঁজে পাওয়া যায়নি।</p>
        <div className="absolute top-4 right-4 z-50">
          <SeedButton />
        </div>
      </div>
    );
  }

  const mainArticle = articles[0];
  const sideArticles = articles.slice(1, 5);
  const latestArticles = articles.slice(5, 11);

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Main Featured Article */}
        <div className="lg:col-span-2">
          <Link href={`/articles/${mainArticle.id}`} className="block group">
            <Card className="border-0 shadow-none rounded-md overflow-hidden">
              <div className="relative w-full aspect-video">
                <Image
                  src={mainArticle.imageUrl}
                  alt={mainArticle.title}
                  fill
                  className="object-cover"
                  data-ai-hint={mainArticle.imageHint}
                  priority
                />
              </div>
              <CardContent className="p-0 pt-4">
                <h1 className="text-3xl md:text-4xl font-bold font-headline text-foreground group-hover:text-primary transition-colors duration-200">
                  {mainArticle.title}
                </h1>
                <p className="text-muted-foreground mt-2 line-clamp-2">
                  {mainArticle.aiSummary}
                </p>
                <Button variant="link" className="px-0 pt-2 text-primary">
                    আরও পড়ুন
                </Button>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Side Articles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
          {sideArticles.map((article) => (
            <Link key={article.id} href={`/articles/${article.id}`} className="block group">
              <Card className="border-0 shadow-none rounded-md flex gap-4">
                <div className="relative w-24 h-24 shrink-0">
                  <Image
                    src={article.imageUrl}
                    alt={article.title}
                    fill
                    className="object-cover rounded-md"
                    data-ai-hint={article.imageHint}
                  />
                </div>
                <CardContent className="p-0 flex-grow">
                  <h3 className="text-lg font-bold font-headline line-clamp-3 group-hover:text-primary transition-colors duration-200">
                    {article.title}
                  </h3>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Latest News Section */}
      {latestArticles.length > 0 && (
        <section>
          <div className="border-t my-6"></div>
           <h2 className="text-2xl font-bold font-headline text-primary mb-4">সর্বশেষ খবর</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {latestArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </section>
      )}

      {totalPages > 1 && (
        <Pagination currentPage={page} totalPages={totalPages} />
      )}
    </div>
  );
}
