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
  const belowMainArticles = articles.slice(5, 7);
  const politicsArticles = articles.filter(a => a.category === 'রাজনীতি').slice(0, 4);
  const sportsArticles = articles.filter(a => a.category === 'খেলা').slice(0, 4);
  const entertainmentArticles = articles.filter(a => a.category === 'বিনোদন').slice(0, 4);


  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Left Column */}
        <div className="md:col-span-1 space-y-4">
          {sideArticles.slice(0, 2).map((article) => (
            <div key={article.id} className="border-b pb-4">
               <Link href={`/articles/${article.id}`} className="block group">
                  <h3 className="font-bold text-lg mb-1 group-hover:text-primary">{article.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{article.aiSummary}</p>
                </Link>
            </div>
          ))}
        </div>

        {/* Center Column */}
        <div className="md:col-span-2 space-y-6">
            {/* Main Featured Article */}
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
                </CardContent>
                </Card>
            </Link>

             {/* Below Main Articles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t">
                {belowMainArticles.map((article) => (
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
        </div>
        
        {/* Right Column */}
        <div className="md:col-span-1 space-y-4">
           {/* Ad Placeholder */}
           <div className="bg-gray-100 dark:bg-gray-800 h-60 w-full flex items-center justify-center rounded-md">
             <span className="text-muted-foreground">Ad</span>
           </div>

           {sideArticles.slice(2, 4).map((article) => (
            <div key={article.id} className="border-b pb-4">
               <Link href={`/articles/${article.id}`} className="block group">
                  <h3 className="font-bold text-lg mb-1 group-hover:text-primary">{article.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{article.aiSummary}</p>
                </Link>
            </div>
          ))}

        </div>
      </section>

      {/* Category Sections */}
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