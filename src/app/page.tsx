import { getArticles } from '@/lib/api';
import ArticleCard from '@/components/article-card';
import Pagination from '@/components/pagination';
import SeedButton from '@/components/seed-button';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

type HomePageProps = {
  searchParams?: {
    page?: string;
  };
};

export default async function Home({ searchParams }: HomePageProps) {
  const page = searchParams?.page ? parseInt(searchParams.page, 10) : 1;
  const { articles, totalPages } = await getArticles({ page, limit: 12 });

  const mainArticle = articles.length > 0 ? articles[0] : null;
  const sideArticles = articles.length > 1 ? articles.slice(1, 4) : [];
  const latestArticles = articles.length > 4 ? articles.slice(4, 10) : [];
  const popularArticles = articles.length > 3 ? articles.slice(3, 8) : [];


  return (
    <div className="space-y-8">
      <div className="absolute top-4 right-4 z-50">
        <SeedButton />
      </div>

      {/* Main News Section */}
      {mainArticle && (
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Large Featured Article */}
          <div className="lg:col-span-2">
            <Link href={`/articles/${mainArticle.id}`} className="block group">
              <Card className="overflow-hidden h-full flex flex-col">
                <div className="relative w-full h-64 md:h-96">
                  <Image
                    src={mainArticle.imageUrl}
                    alt={mainArticle.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    data-ai-hint={mainArticle.imageHint}
                    priority
                  />
                </div>
                <CardContent className="p-6 space-y-2 flex-grow">
                  <h2 className="text-3xl md:text-4xl font-bold font-headline text-primary group-hover:underline">
                    {mainArticle.title}
                  </h2>
                  <p className="text-muted-foreground line-clamp-3 text-lg">
                    {mainArticle.aiSummary}
                  </p>
                </CardContent>
                <CardFooter>
                    <p className="text-sm text-muted-foreground">
                        {new Date(mainArticle.publishedAt).toLocaleDateString('bn-BD', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                </CardFooter>
              </Card>
            </Link>
          </div>
          
          {/* Side Articles */}
          <div className="space-y-4">
            {sideArticles.map((article) => (
               <Link key={article.id} href={`/articles/${article.id}`} className="block group">
                <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
                    <CardContent className="p-4">
                        <h3 className="text-xl font-headline font-bold line-clamp-3 group-hover:text-primary group-hover:underline">
                            {article.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{article.aiSummary}</p>
                    </CardContent>
                </Card>
               </Link>
            ))}
          </div>
        </section>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Latest News Grid */}
        <main className="lg:col-span-2 space-y-8">
          {latestArticles.length > 0 && (
            <section>
                <h2 className="text-2xl font-bold font-headline text-primary mb-4 border-b-2 border-primary pb-2">সর্বশেষ খবর</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {latestArticles.map((article) => (
                        <ArticleCard key={article.id} article={article} variant="compact" />
                    ))}
                </div>
            </section>
          )}
          
          {articles.length === 0 && (
             <div className="text-center py-16 col-span-full">
                <p className="text-muted-foreground mb-4">কোনো আর্টিকেল খুঁজে পাওয়া যায়নি।</p>
                <p className="text-muted-foreground">ডেমো আর্টিকেল যোগ করতে "Seed Database" বোতামে ক্লিক করুন।</p>
            </div>
          )}

          {totalPages > 1 && (
            <Pagination currentPage={page} totalPages={totalPages} />
          )}
        </main>
        
        {/* Sidebar */}
        <aside className="lg:col-span-1 space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-xl text-primary border-b-2 border-primary pb-2">জনপ্রিয় খবর</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                   {popularArticles.map((article) => (
                       <Link key={article.id} href={`/articles/${article.id}`} className="flex items-start gap-4 group border-b pb-3 last:border-b-0">
                           <div className="flex-grow">
                                <h3 className="text-md font-semibold line-clamp-3 group-hover:text-primary transition-colors">{article.title}</h3>
                                <p className="text-xs text-muted-foreground mt-1">{new Date(article.publishedAt).toLocaleDateString('bn-BD', { month: 'long', day: 'numeric' })}</p>
                           </div>
                       </Link>
                   ))}
                </CardContent>
            </Card>

            <Card className="bg-card p-4 rounded-lg shadow-sm text-center border">
                 <h3 className="font-headline text-lg text-primary mb-2">বিজ্ঞাপন স্পট</h3>
                 <div className="bg-muted h-60 mt-2 flex items-center justify-center rounded-md">
                     <p className="text-muted-foreground text-xs">Ad Banner</p>
                </div>
            </Card>
        </aside>
      </div>
    </div>
  );
}
