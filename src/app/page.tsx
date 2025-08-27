import { getArticles } from '@/lib/api';
import ArticleCard from '@/components/article-card';
import Pagination from '@/components/pagination';
import SeedButton from '@/components/seed-button';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { Article } from '@/lib/types';
import { ArrowRight, PlayCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import PollSection from '@/components/poll-section';


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
  const trendingArticles = articles.filter(a => a.badge === 'জনপ্রিয়').slice(0, 5);
  const videoArticles = articles.filter(a => a.videoUrl).slice(0, 5);
  const editorsPicks = articles.filter(a => a.editorsPick).slice(0, 4);

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
           {/* Poll Section */}
           <PollSection />

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

      {/* Trending Section */}
      {trendingArticles.length > 0 && (
        <section>
          <div className="flex items-center gap-4 overflow-x-auto pb-4">
            <h3 className="text-xl font-headline font-bold text-primary whitespace-nowrap">ট্রেন্ডিং</h3>
            <div className="flex items-center gap-4">
              {trendingArticles.map(article => (
                <Link key={article.id} href={`/articles/${article.id}`} className="group">
                  <div className="flex items-center gap-2">
                    {article.badge && <Badge variant="default">{article.badge}</Badge>}
                    <p className="font-semibold group-hover:text-primary whitespace-nowrap">{article.title}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Video Gallery Section */}
      {videoArticles.length > 0 && (
        <section>
          <SectionHeader title="ভিডিও গ্যালারি" href="/category/videos" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
                <div className="relative aspect-video w-full rounded-lg overflow-hidden group">
                    <iframe
                        src={videoArticles[0].videoUrl}
                        title={videoArticles[0].title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full"
                    ></iframe>
                </div>
                <h2 className="text-2xl font-bold font-headline mt-2">{videoArticles[0].title}</h2>
            </div>
            <div className="md:col-span-1 space-y-4">
                {videoArticles.slice(1).map(video => (
                    <Link key={video.id} href={`/articles/${video.id}`} className="flex items-center gap-4 group">
                        <div className="relative w-24 h-16 shrink-0 rounded-md overflow-hidden">
                            <Image 
                                src={video.imageUrl}
                                alt={video.title}
                                fill
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                                <PlayCircle className="h-8 w-8 text-white/80" />
                            </div>
                        </div>
                        <h3 className="font-semibold text-sm group-hover:text-primary">{video.title}</h3>
                    </Link>
                ))}
            </div>
          </div>
        </section>
      )}


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
      
      {/* Editor's Pick Section */}
      {editorsPicks.length > 0 && (
        <section>
          <SectionHeader title="সম্পাদকের পছন্দ" href="/editors-pick" />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {editorsPicks.map((article) => (
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
