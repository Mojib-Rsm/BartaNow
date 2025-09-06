

'use client';

import { useEffect, useState } from 'react';
import type { Article } from '@/lib/types';
import { getRecommendedArticlesAction } from '@/app/actions';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import ArticleCard from './article-card';
import { UserRound } from 'lucide-react';
import { Skeleton } from './ui/skeleton';

const SectionHeader = ({ title }: { title: string }) => (
  <div className="flex items-center justify-between border-b-2 border-primary mb-4 pb-2">
    <h2 className="text-2xl font-bold font-headline text-primary flex items-center gap-2">
        <UserRound className="h-6 w-6" />
        {title}
    </h2>
  </div>
);

const RecommendationSkeleton = () => (
    <div className="space-y-4">
        <Skeleton className="h-8 w-1/4" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-3">
                    <Skeleton className="h-40 w-full rounded-lg" />
                    <Skeleton className="h-5 w-full rounded-md" />
                    <Skeleton className="h-10 w-5/6 rounded-md" />
                </div>
            ))}
        </div>
    </div>
);


export default function RecommendedForYou({ userId }: { userId: string }) {
  const [recommendedArticles, setRecommendedArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRecommendations() {
      try {
        const articles = await getRecommendedArticlesAction(userId);
        setRecommendedArticles(articles);
      } catch (error) {
        console.error("Failed to fetch recommended articles", error);
      } finally {
        setLoading(false);
      }
    }
    fetchRecommendations();
  }, [userId]);

  if (loading) {
    return <RecommendationSkeleton />;
  }

  if (recommendedArticles.length === 0) {
    return null; // Don't show the section if there are no recommendations
  }

  return (
    <section>
        <SectionHeader title="আপনার জন্য" />
        <Carousel
            opts={{
            align: 'start',
            }}
            className="w-full"
        >
            <CarouselContent>
            {recommendedArticles.map((article) => (
                <CarouselItem key={article.id} className="md:basis-1/2 lg:basis-1/4">
                    <div className="p-1">
                        <ArticleCard article={article} />
                    </div>
                </CarouselItem>
            ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
        </Carousel>
    </section>
  );
}
