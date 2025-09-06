
import { getArticles } from '@/lib/api';
import type { Metadata } from 'next';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import { Clock, Sun, Moon, Sunset } from 'lucide-react';
import { format } from 'date-fns';
import { bn } from 'date-fns/locale';
import { generateNonAiSlug } from '@/lib/utils';
import type { Article } from '@/lib/types';
import { cn, getCategoryColor } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';


export const metadata: Metadata = {
  title: 'আজকের টাইমলাইন',
  description: 'সারাদিনের গুরুত্বপূর্ণ খবরগুলো এক নজরে দেখুন।',
};

const groupArticlesByTime = (articles: Article[]) => {
    const morning: Article[] = [];
    const afternoon: Article[] = [];
    const evening: Article[] = [];
    const night: Article[] = [];

    articles.forEach(article => {
        const hour = new Date(article.publishedAt).getHours();
        if (hour >= 5 && hour < 12) {
            morning.push(article);
        } else if (hour >= 12 && hour < 17) {
            afternoon.push(article);
        } else if (hour >= 17 && hour < 21) {
            evening.push(article);
        } else {
            night.push(article);
        }
    });

    return { morning, afternoon, evening, night };
}

const TimelineSection = ({ title, articles, icon: Icon }: { title: string, articles: Article[], icon: React.ElementType }) => {
    if (articles.length === 0) return null;

    return (
        <div>
            <h2 className="text-2xl font-bold font-headline text-primary flex items-center gap-2 mb-4">
                <Icon className="h-6 w-6" />
                {title}
            </h2>
            <div className="relative border-l-2 border-primary/20 pl-6 space-y-8">
                 {articles.map((article, index) => {
                    const categorySlug = generateNonAiSlug(article.category || 'uncategorized');
                    const articleUrl = `/${categorySlug}/${article.slug}`;
                    const categoryColor = getCategoryColor(article.category);
                    return (
                        <div key={article.id} className="relative">
                             <div className="absolute -left-[33px] top-1 h-4 w-4 rounded-full" style={{ backgroundColor: categoryColor }} />
                            <p className="text-sm text-muted-foreground mb-1">
                                {format(new Date(article.publishedAt), 'hh:mm a', { locale: bn })}
                            </p>
                            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                                <Link href={articleUrl}>
                                    <div className="grid grid-cols-1 sm:grid-cols-4">
                                        <div className="sm:col-span-1 relative aspect-video sm:aspect-square">
                                            <Image 
                                                src={article.imageUrl}
                                                alt={article.title}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="sm:col-span-3 p-4">
                                            <Badge variant="outline" className="mb-2 border" style={{ borderColor: categoryColor, color: categoryColor }}>
                                                {article.category}
                                            </Badge>
                                            <h3 className="font-bold text-lg hover:text-primary transition-colors">
                                                {article.title}
                                            </h3>
                                            <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                                                {article.aiSummary}
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            </Card>
                        </div>
                    )
                 })}
            </div>
        </div>
    )
}


export default async function TimelinePage() {
    const today = new Date().toISOString().split('T')[0];
    const { articles } = await getArticles({ date: today, limit: 100 });

    const { morning, afternoon, evening, night } = groupArticlesByTime(articles);
    
  return (
    <div className="container mx-auto py-8">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold font-headline text-primary">আজকের টাইমলাইন</h1>
        <p className="text-muted-foreground mt-2">
         {format(new Date(), 'd MMMM, yyyy', { locale: bn })} তারিখের সকল গুরুত্বপূর্ণ খবর
        </p>
      </header>

      {articles.length === 0 ? (
        <div className="text-center py-16">
            <p className="text-muted-foreground">আজকের জন্য কোনো খবর পাওয়া যায়নি।</p>
        </div>
      ) : (
        <div className="space-y-12">
            <TimelineSection title="সকালের খবর" articles={morning} icon={Sun} />
            <TimelineSection title="দুপুরের খবর" articles={afternoon} icon={Sun} />
            <TimelineSection title="সন্ধ্যার খবর" articles={evening} icon={Sunset} />
            <TimelineSection title="রাতের খবর" articles={night} icon={Moon} />
        </div>
      )}
    </div>
  );
}

