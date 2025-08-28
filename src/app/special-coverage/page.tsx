import { getArticles } from '@/lib/api';
import ArticleCard from '@/components/article-card';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'বিশেষ কভারেজ',
  description: 'বার্তা নাও-এর বিশেষ ইভেন্ট এবং ঘটনাগুলোর বিস্তারিত কভারেজ।',
};

export default async function SpecialCoveragePage() {
  const { articles } = await getArticles({ category: 'বিশেষ কভারেজ', limit: 100 });

  if (!articles || articles.length === 0) {
    return (
      <div className="text-center py-16">
        <h1 className="text-3xl font-bold font-headline mb-4">বিশেষ কভারেজ</h1>
        <p className="text-muted-foreground">দুঃখিত, এই মুহূর্তে কোনো বিশেষ কভারেজ নেই।</p>
      </div>
    );
  }

  const featuredArticle = articles[0];
  const otherArticles = articles.slice(1);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold font-headline text-primary border-b-2 border-primary pb-2">
          বিশেষ কভারেজ
        </h1>
      </header>
      
      {/* Featured Article Section */}
      <section>
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="relative aspect-video">
                 <Image
                    src={featuredArticle.imageUrl}
                    alt={featuredArticle.title}
                    fill
                    className="object-cover"
                    data-ai-hint={featuredArticle.imageHint}
                    priority
                />
              </div>
              <div className="p-6 flex flex-col justify-center">
                <h2 className="text-2xl md:text-3xl font-bold font-headline mb-2">
                  <Link href={`/${featuredArticle.slug}`} className="hover:text-primary">
                    {featuredArticle.title}
                  </Link>
                </h2>
                <p className="text-muted-foreground line-clamp-3">
                  {featuredArticle.aiSummary}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Other Articles Grid */}
      {otherArticles.length > 0 && (
        <section>
            <h2 className="text-2xl font-bold font-headline text-primary mb-4 pb-2 border-b-2 border-primary">
                সম্পর্কিত সকল খবর
            </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
