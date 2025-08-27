
'use client';

import ArticleCard from '@/components/article-card';
import Image from 'next/image';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, PlayCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import PollSection from '@/components/poll-section';
import LoadMore from '@/components/load-more';
import AdSpot from '@/components/ad-spot';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import TrendingSidebar from '@/components/trending-sidebar';
import FactCheckSidebar from '@/components/fact-check-sidebar';
import MemeCard from '@/components/meme-card';
import type { Article, MemeNews } from '@/lib/types';
import { useEffect, useState } from 'react';
import Autoplay from "embla-carousel-autoplay";


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

// A simple skeleton loader for the home page
const HomePageSkeleton = () => (
  <div className="space-y-12">
    {/* Ticker Skeleton */}
    <div className="flex items-center gap-4">
      <div className="h-7 w-24 bg-muted animate-pulse rounded-md" />
      <div className="h-6 w-full bg-muted animate-pulse rounded-md" />
    </div>

    {/* Hero Skeleton */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2 space-y-4">
        <div className="h-[40vh] w-full bg-muted animate-pulse rounded-lg" />
        <div className="h-10 w-3/4 bg-muted animate-pulse rounded-md" />
        <div className="h-6 w-full bg-muted animate-pulse rounded-md" />
      </div>
      <div className="md:col-span-1 space-y-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="space-y-2 pb-4 border-b last:border-b-0">
             <div className="h-6 w-full bg-muted animate-pulse rounded-md" />
             <div className="h-4 w-5/6 bg-muted animate-pulse rounded-md" />
          </div>
        ))}
      </div>
    </div>
     <div className="h-24 w-full bg-muted/50 animate-pulse rounded-lg" />
     {/* Grid Skeleton */}
     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-3">
                <div className="h-40 w-full bg-muted animate-pulse rounded-lg" />
                <div className="h-5 w-full bg-muted animate-pulse rounded-md" />
                <div className="h-10 w-5/6 bg-muted animate-pulse rounded-md" />
            </div>
        ))}
     </div>
  </div>
);

type HomePageClientProps = {
    initialArticles: { articles: Article[], totalPages: number };
    latestArticlesResult: { articles: Article[], totalPages: number };
    politicsResult: { articles: Article[] };
    nationalResult: { articles: Article[] };
    sportsResult: { articles: Article[] };
    entertainmentResult: { articles: Article[] };
    techResult: { articles: Article[] };
    editorsPicksResult: { articles: Article[] };
    videoArticlesResult: { articles: Article[] };
    islamicLifeResult: { articles: Article[] };
    factCheckResult: { articles: Article[] };
    memeNewsResult: MemeNews[];
}

export default function HomePageClient({
    initialArticles,
    latestArticlesResult,
    politicsResult,
    nationalResult,
    sportsResult,
    entertainmentResult,
    techResult,
    editorsPicksResult,
    videoArticlesResult,
    islamicLifeResult,
    factCheckResult,
    memeNewsResult,
}: HomePageClientProps) {

  const [pageData, setPageData] = useState<{
    articles: Article[];
    trendingArticles: Article[];
    heroFeaturedArticle?: Article;
    heroSideArticles: Article[];
  } | null>(null);

  useEffect(() => {
      const { articles } = initialArticles;
      const heroFeaturedArticle = articles[0];
      const heroSideArticles = articles.slice(1, 5);
      const trendingArticles = articles.filter(a => a.badge === 'জনপ্রিয়').slice(0, 5);

      setPageData({
        articles,
        trendingArticles,
        heroFeaturedArticle,
        heroSideArticles
      });
  }, [initialArticles]);

  if (!pageData) {
    return <HomePageSkeleton />;
  }

  const {
    trendingArticles,
    heroFeaturedArticle,
    heroSideArticles,
  } = pageData;

  const { articles: videoArticles } = videoArticlesResult;
  const { articles: editorsPicks } = editorsPicksResult;
  const { articles: politicsArticles } = politicsResult;
  const { articles: nationalArticles } = nationalResult;
  const { articles: sportsArticles } = sportsResult;
  const { articles: entertainmentArticles } = entertainmentResult;
  const { articles: techArticles } = techResult;
  const { articles: islamicLifeArticles } = islamicLifeResult;
  const { articles: factCheckArticles } = factCheckResult;
  
  return (
    <div className="space-y-12">
       {/* Trending Section / Ticker */}
      {trendingArticles.length > 0 && (
        <section>
          <div className="flex items-center gap-4">
             <h3 className="text-xl font-headline font-bold text-primary whitespace-nowrap">ট্রেন্ডিং</h3>
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              plugins={[
                Autoplay({
                  delay: 3000,
                  stopOnInteraction: true,
                  stopOnMouseEnter: true,
                }),
              ]}
              className="w-full overflow-hidden"
            >
              <CarouselContent>
                {trendingArticles.map((article) => (
                  <CarouselItem key={article.id} className="basis-auto">
                     <Link href={`/articles/${article.id}`} className="group">
                        <div className="flex items-center gap-2">
                            {article.badge && <Badge variant="default">{article.badge}</Badge>}
                            <p className="font-semibold group-hover:text-primary whitespace-nowrap text-sm">
                            {article.title}
                            </p>
                        </div>
                    </Link>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>
        </section>
      )}

      {/* Hero Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {heroFeaturedArticle && (
            <div className="md:col-span-2">
                <Card className="flex flex-col h-full overflow-hidden bg-card rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300 group border">
                    <Link href={`/articles/${heroFeaturedArticle.id}`} className="block overflow-hidden">
                        <div className="relative aspect-video w-full">
                            <Image
                            src={heroFeaturedArticle.imageUrl}
                            alt={heroFeaturedArticle.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            data-ai-hint={heroFeaturedArticle.imageHint}
                            priority
                            />
                        </div>
                    </Link>
                    <div className="p-4 flex flex-col flex-grow">
                        <h2 className="font-headline text-2xl md:text-3xl font-bold leading-tight">
                            <Link href={`/articles/${heroFeaturedArticle.id}`} className="hover:text-primary transition-colors">
                                {heroFeaturedArticle.title}
                            </Link>
                        </h2>
                        <p className="text-muted-foreground text-base mt-2 flex-grow">{heroFeaturedArticle.aiSummary}</p>
                        <div className="p-0 pt-4 mt-auto">
                            <p className="text-sm text-muted-foreground">{new Date(heroFeaturedArticle.publishedAt).toLocaleDateString('bn-BD', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        </div>
                    </div>
                </Card>
            </div>
        )}
        <div className="md:col-span-1 space-y-4">
          {heroSideArticles.map(article => (
            <Link key={article.id} href={`/articles/${article.id}`} className="block group border-b pb-4 last:border-b-0">
                <h3 className="font-headline text-lg font-bold leading-snug group-hover:text-primary transition-colors">
                  {article.title}
                </h3>
                <p className="text-muted-foreground text-sm line-clamp-2 mt-1">{article.aiSummary}</p>
            </Link>
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

      {/* Politics Section - Style 1 (Standard Grid) */}
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

      {/* National Section - Style 2 (1 Large, 2 Small) */}
      {nationalArticles.length > 0 && (
        <section>
            <SectionHeader title="জাতীয়" href="/category/national" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-1">
                    <ArticleCard article={nationalArticles[0]} />
                </div>
                <div className="md:col-span-1 space-y-4">
                    {nationalArticles.slice(1).map((article) => (
                         <Card key={article.id} className="flex items-center group overflow-hidden">
                            <Link href={`/articles/${article.id}`} className='flex w-full'>
                                <div className="relative w-1/3 aspect-square">
                                    <Image
                                        src={article.imageUrl}
                                        alt={article.title}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform"
                                        data-ai-hint={article.imageHint}
                                    />
                                </div>
                                <div className="p-4 w-2/3">
                                    <h3 className="font-semibold text-base line-clamp-2 group-hover:text-primary">
                                        {article.title}
                                    </h3>
                                     <p className="text-muted-foreground line-clamp-2 text-sm mt-1">{article.aiSummary}</p>
                                </div>
                            </Link>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
      )}
      
      {/* Sports Section - Style 3 (List View) */}
      {sportsArticles.length > 0 && (
        <section>
          <SectionHeader title="খেলা" href="/category/sports" />
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
            {sportsArticles.map((article) => (
              <Link key={article.id} href={`/articles/${article.id}`} className="flex items-center gap-4 group">
                  <div className="relative w-20 h-20 shrink-0 rounded-md overflow-hidden">
                      <Image 
                          src={article.imageUrl}
                          alt={article.title}
                          fill
                          className="object-cover"
                          data-ai-hint={article.imageHint}
                      />
                  </div>
                  <h3 className="font-semibold text-base group-hover:text-primary">{article.title}</h3>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Entertainment Section - Style 4 (Image-centric) */}
      {entertainmentArticles.length > 0 && (
        <section>
          <SectionHeader title="বিনোদন" href="/category/entertainment" />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {entertainmentArticles.map((article) => (
              <Link key={article.id} href={`/articles/${article.id}`} className="block group">
                  <Card className="overflow-hidden">
                      <div className="relative aspect-square w-full">
                          <Image
                              src={article.imageUrl}
                              alt={article.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform"
                              data-ai-hint={article.imageHint}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                          <h3 className="font-headline text-lg text-white absolute bottom-4 left-4 right-4 group-hover:text-primary/90">
                              {article.title}
                          </h3>
                      </div>
                  </Card>
              </Link>
            ))}
          </div>
        </section>
      )}
      
      {/* Islamic Life Section - Standard Grid */}
      {islamicLifeArticles.length > 0 && (
        <section>
          <SectionHeader title="ইসলামী জীবন" href="/category/islamic-life" />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {islamicLifeArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </section>
      )}

      {/* Tech Section - Standard Grid */}
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
            {factCheckArticles.length > 0 && <FactCheckSidebar articles={factCheckArticles} />}
            <TrendingSidebar articles={trendingArticles} />
            <AdSpot className="h-96" />
        </aside>
      </div>

       {/* Meme News Section */}
      {memeNewsResult.length > 0 && (
        <section>
          <SectionHeader title="মিম নিউজ" href="/memes" />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {memeNewsResult.slice(0,3).map((meme) => (
              <MemeCard key={meme.id} meme={meme} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

    