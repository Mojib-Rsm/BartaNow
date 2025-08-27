
import { getArticles } from '@/lib/api';
import ArticleCard from '@/components/article-card';
import Pagination from '@/components/pagination';
import SeedButton from '@/components/seed-button';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

type HomePageProps = {
  searchParams?: {
    page?: string;
  };
};

export default async function Home({ searchParams }: HomePageProps) {
  const page = searchParams?.page ? parseInt(searchParams.page, 10) : 1;
  const { articles, totalPages } = await getArticles({ page, limit: 10 });

  const featuredArticle = articles.length > 0 ? articles[0] : null;
  const latestArticles = articles.length > 1 ? articles.slice(1, 7) : [];
  const popularArticles = articles.length > 3 ? articles.slice(3, 8) : [];


  return (
    <div className="space-y-8">
       <header className="text-center relative border-b pb-4">
        <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary">সর্বশেষ সংবাদ</h1>
        <p className="mt-2 text-lg text-muted-foreground">আমাদের সর্বশেষ আর্টিকেল ও আপডেটের সাথে অবগত থাকুন।</p>
        <div className="absolute top-0 right-0">
          <SeedButton />
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <main className="lg:col-span-2 space-y-8">
          {/* Hero Section */}
          {featuredArticle && page === 1 && (
            <section>
              <Link href={`/articles/${featuredArticle.id}`} className="block group">
                <Card className="overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300">
                    <div className="relative w-full h-64 md:h-96">
                        <Image
                        src={featuredArticle.imageUrl}
                        alt={featuredArticle.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        data-ai-hint={featuredArticle.imageHint}
                        priority
                        />
                    </div>
                    <CardContent className="p-6 space-y-4">
                        <h2 className="text-3xl md:text-4xl font-bold font-headline text-primary group-hover:underline">
                        {featuredArticle.title}
                        </h2>
                        <p className="text-muted-foreground line-clamp-3">
                        {featuredArticle.aiSummary}
                        </p>
                        <div className="text-sm text-muted-foreground flex items-center gap-4">
                           <div className="flex items-center gap-2">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={featuredArticle.authorAvatarUrl} alt={featuredArticle.authorName} />
                                    <AvatarFallback>{featuredArticle.authorName.split(' ').map((n) => n[0]).join('')}</AvatarFallback>
                                </Avatar>
                                <span>{featuredArticle.authorName}</span> 
                           </div>
                           <span>&middot;</span>
                           <span>{new Date(featuredArticle.publishedAt).toLocaleDateString('bn-BD', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                        </div>
                    </CardContent>
                </Card>
              </Link>
            </section>
          )}

          {/* Latest News Grid */}
          {latestArticles.length > 0 && (
            <section>
                <h2 className="text-2xl font-bold font-headline text-primary mb-4 border-b pb-2">সর্বশেষ খবর</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {latestArticles.map((article) => (
                        <ArticleCard key={article.id} article={article} />
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
                    <CardTitle className="font-headline text-xl text-primary border-b pb-2">জনপ্রিয় খবর</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                   {popularArticles.map((article) => (
                       <Link key={article.id} href={`/articles/${article.id}`} className="flex items-start gap-4 group">
                           <div className="relative w-24 h-16 rounded-md overflow-hidden shrink-0">
                                <Image 
                                    src={article.imageUrl} 
                                    alt={article.title}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                                    data-ai-hint={article.imageHint}
                                />
                           </div>
                           <div className="flex-grow">
                                <h3 className="text-md font-semibold line-clamp-2 group-hover:text-primary transition-colors">{article.title}</h3>
                                <p className="text-xs text-muted-foreground mt-1">{new Date(article.publishedAt).toLocaleDateString('bn-BD', { month: 'long', day: 'numeric' })}</p>
                           </div>
                       </Link>
                   ))}
                </CardContent>
            </Card>

            <Card className="bg-card p-4 rounded-lg shadow-sm text-center">
                 <h3 className="font-headline text-lg text-primary mb-2">সদস্য হোন</h3>
                 <p className="text-muted-foreground text-sm mb-4">সদস্য হোন এবং প্রতিদিন সংবাদ পান</p>
                 <div className="bg-muted h-40 mt-2 flex items-center justify-center rounded-md">
                     <p className="text-muted-foreground text-xs">Ad Banner</p>
                </div>
            </Card>
        </aside>
      </div>
    </div>
  );
}
