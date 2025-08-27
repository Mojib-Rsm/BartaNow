
import { getArticles } from '@/lib/api';
import ArticleCard from '@/components/article-card';
import SeedButton from '@/components/seed-button';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, PlayCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import PollSection from '@/components/poll-section';
import LoadMore from '@/components/load-more';
import AdSpot from '@/components/ad-spot';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import TrendingSidebar from '@/components/trending-sidebar';


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
  
  const [
    initialArticles,
    latestArticlesResult,
    politicsResult,
    nationalResult,
    sportsResult,
    entertainmentResult,
    techResult,
    editorsPicksResult,
    videoArticlesResult
  ] = await Promise.all([
    getArticles({ page: 1, limit: 13 }),
    getArticles({ page: 1, limit: 6 }),
    getArticles({ category: 'রাজনীতি', limit: 4 }),
    getArticles({ category: 'জাতীয়', limit: 4 }),
    getArticles({ category: 'খেলা', limit: 4 }),
    getArticles({ category: 'বিনোদন', limit: 4 }),
    getArticles({ category: 'প্রযুক্তি', limit: 4 }),
    getArticles({ editorsPick: true, limit: 4 }),
    getArticles({ hasVideo: true, limit: 5 })
  ]);
  
  const { articles, totalPages } = initialArticles;

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

  const heroArticles = articles.slice(0, 5);
  const sideArticles = articles.slice(5, 9);
  const trendingArticles = articles.filter(a => a.badge === 'জনপ্রিয়').slice(0, 5);
  const { articles: videoArticles } = videoArticlesResult;
  const { articles: editorsPicks } = editorsPicksResult;
  const { articles: politicsArticles } = politicsResult;
  const { articles: nationalArticles } = nationalResult;
  const { articles: sportsArticles } = sportsResult;
  const { articles: entertainmentArticles } = entertainmentResult;
  const { articles: techArticles } = techResult;
  
  return (
    <div className="space-y-12">
      {/* Trending Section / Ticker */}
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

      {/* Hero Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
           <Carousel
            opts={{
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {heroArticles.map((article) => (
                <CarouselItem key={article.id}>
                    <Link href={`/articles/${article.id}`} className="block group">
                        <Card className="border-0 shadow-none rounded-md overflow-hidden">
                        <div className="relative w-full aspect-video">
                            <Image
                            src={article.imageUrl}
                            alt={article.title}
                            fill
                            className="object-cover rounded-lg"
                            data-ai-hint={article.imageHint}
                            priority={heroArticles.indexOf(article) === 0}
                            />
                        </div>
                        <CardContent className="p-0 pt-4">
                            <h1 className="text-3xl md:text-4xl font-bold font-headline text-foreground group-hover:text-primary transition-colors duration-200">
                            {article.title}
                            </h1>
                            <p className="text-muted-foreground mt-2 line-clamp-2">
                            {article.aiSummary}
                            </p>
                        </CardContent>
                        </Card>
                    </Link>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>

        <div className="md:col-span-1 space-y-4">
           {sideArticles.map((article) => (
            <div key={article.id} className="border-b pb-4 last:border-b-0">
               <Link href={`/articles/${article.id}`} className="block group">
                  <h3 className="font-bold text-lg mb-1 group-hover:text-primary">{article.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{article.aiSummary}</p>
                </Link>
            </div>
          ))}
        </div>
      </section>

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
                                data-ai-hint={video.imageHint}
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

      {/* Horizontal Ad Spot */}
      <AdSpot className="h-24" />

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

      {nationalArticles.length > 0 && (
        <section>
          <SectionHeader title="জাতীয়" href="/category/national" />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {nationalArticles.map((article) => (
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

      {techArticles.length > 0 && (
        <section>
          <SectionHeader title="প্রযুক্তি" href="/category/tech" />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {techArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </section>
      )}
      
      {/* Editor's Pick Section */}
      {editorsPicks.length > 0 && (
        <section>
          <SectionHeader title="সম্পাদকের পছন্দ" href="/category/editors-pick" />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {editorsPicks.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </section>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
            {/* Latest News with Load More */}
            <section>
              <SectionHeader title="সর্বশেষ" href="/category/latest" />
              <LoadMore 
                initialArticles={latestArticlesResult.articles} 
                totalPages={latestArticlesResult.totalPages}
              />
            </section>
        </div>
        <aside className="md:col-span-1 space-y-8">
            <PollSection />
            <TrendingSidebar articles={trendingArticles} />
            <AdSpot className="h-96" />
        </aside>
      </div>

    </div>
  );
}
