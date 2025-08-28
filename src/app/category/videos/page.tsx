import { getArticles } from '@/lib/api';
import ArticleCard from '@/components/article-card';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import { PlayCircle } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ভিডিও গ্যালারি',
  description: 'বার্তা নাও-এর সর্বশেষ ভিডিও খবর এবং প্রতিবেদন দেখুন।',
};

export default async function VideoGalleryPage() {
  const { articles: videoArticles } = await getArticles({ hasVideo: true, limit: 100 });

  if (!videoArticles || videoArticles.length === 0) {
    return (
      <div className="text-center py-16">
        <h1 className="text-3xl font-bold font-headline mb-4">ভিডিও গ্যালারি</h1>
        <p className="text-muted-foreground">দুঃখিত, কোনো ভিডিও খুঁজে পাওয়া যায়নি।</p>
      </div>
    );
  }

  const featuredVideo = videoArticles[0];
  const otherVideos = videoArticles.slice(1);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold font-headline text-primary border-b-2 border-primary pb-2">
          ভিডিও গ্যালারি
        </h1>
      </header>
      
      {/* Featured Video Section */}
      <section>
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="relative aspect-video">
                <iframe
                  src={featuredVideo.videoUrl}
                  title={featuredVideo.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                ></iframe>
              </div>
              <div className="p-6 flex flex-col justify-center">
                <h2 className="text-2xl md:text-3xl font-bold font-headline mb-2">
                  <Link href={`/${featuredVideo.slug}`} className="hover:text-primary">
                    {featuredVideo.title}
                  </Link>
                </h2>
                <p className="text-muted-foreground line-clamp-3">
                  {featuredVideo.aiSummary}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Other Videos Grid */}
      {otherVideos.length > 0 && (
        <section>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {otherVideos.map((article) => (
              <Card key={article.id} className="group overflow-hidden">
                <Link href={`/${article.slug}`}>
                  <div className="relative aspect-video">
                    <Image
                      src={article.imageUrl}
                      alt={article.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                      data-ai-hint={article.imageHint}
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <PlayCircle className="h-12 w-12 text-white/80 transition-transform group-hover:scale-110" />
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-sm leading-snug line-clamp-2 group-hover:text-primary">
                      {article.title}
                    </h3>
                  </div>
                </Link>
              </Card>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
