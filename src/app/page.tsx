import { getArticles } from '@/lib/api';
import ArticleCard from '@/components/article-card';
import Pagination from '@/components/pagination';
import SeedButton from '@/components/seed-button';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { Article } from '@/lib/types';
import { ArrowRight } from 'lucide-react';


type HomePageProps = {
  searchParams?: {
    page?: string;
  };
};

const SectionHeader = ({ title, href }: { title: string, href: string }) => (
  <div className="flex items-center justify-between border-b-2 border-primary mb-4 pb-2">
    <h2 className="text-2xl font-bold font-headline text-primary">{title}</h2>
    <Button asChild variant="link" className="text-primary pr-0">
      <Link href={href}>
        সব দেখুন <ArrowRight className="ml-1 h-4 w-4" />
      </Link>
    </Button>
  </div>
);

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
  
  const getCategoryArticles = (category: Article['category'], count: number) => {
    return articles.filter(a => a.category === category).slice(0, count);
  }

  const politicsArticles = getCategoryArticles('রাজনীতি', 4);
  const sportsArticles = getCategoryArticles('খেলা', 4);
  const entertainmentArticles = getCategoryArticles('বিনোদন', 4);


  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Featured Article */}
        <div className="lg:col-span-2">
          <Link href={`/articles/${mainArticle.id}`} className="block group">
            <Card className="border-0 shadow-none rounded-md overflow-hidden">
              <div className="relative w-full aspect-video">
                <Image
                  src={mainArticle.imageUrl}
                  alt={mainArticle.title}
                  fill
                  className="object-cover rounded-lg"
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
          {sideArticles.map((article) => (
            <Link key={article.id} href={`/articles/${article.id}`} className="block group">
              <Card className="border-0 shadow-none rounded-md flex gap-4">
                <div className="relative w-28 h-20 shrink-0">
                  <Image
                    src={article.imageUrl}
                    alt={article.title}
                    fill
                    className="object-cover rounded-md"
                    data-ai-hint={article.imageHint}
                  />
                </div>
                <CardContent className="p-0 flex-grow">
                  <h3 className="text-lg font-bold font-headline leading-tight group-hover:text-primary transition-colors duration-200">
                    {article.title}
                  </h3>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Politics Section */}
      {politicsArticles.length > 0 && (
        <section>
          <SectionHeader title="রাজনীতি" href="/category/politics" />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {politicsArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </section>
      )}

      {/* Sports Section */}
      {sportsArticles.length > 0 && (
        <section>
          <SectionHeader title="খেলা" href="/category/sports" />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {sportsArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </section>
      )}

      {/* Entertainment Section */}
      {entertainmentArticles.length > 0 && (
        <section>
          <SectionHeader title="বিনোদন" href="/category/entertainment" />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {entertainmentArticles.map((article) => (
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
