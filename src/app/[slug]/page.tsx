
import { getArticleBySlug, getArticles } from '@/lib/api';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, Info } from 'lucide-react';
import type { Metadata, ResolvingMetadata } from 'next'
import ShareButtons from '@/components/share-buttons';
import RelatedArticles from '@/components/related-articles';
import CommentsSection from '@/components/comments-section';
import { Badge } from '@/components/ui/badge';
import AdSpot from '@/components/ad-spot';
import TrendingSidebar from '@/components/trending-sidebar';
import AudioPlayer from '@/components/audio-player';
import FactCheckMeter from '@/components/fact-check-meter';
import BookmarkButton from '@/components/bookmark-button';
 
type Props = {
  params: { slug: string }
}
 
export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const article = await getArticleBySlug(decodeURIComponent(params.slug))
 
  if (!article) {
    return {
        title: 'Article not found'
    }
  }
 
  return {
    title: article.title,
    description: article.aiSummary,
    openGraph: {
        title: article.title,
        description: article.aiSummary,
        type: 'article',
        publishedTime: article.publishedAt,
        authors: [article.authorName],
        images: [
            {
                url: article.imageUrl,
                width: 800,
                height: 600,
                alt: article.title,
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: article.title,
        description: article.aiSummary,
        images: [article.imageUrl],
    },
  }
}

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const article = await getArticleBySlug(decodeURIComponent(params.slug));

  if (!article) {
    notFound();
  }

  // Fetch related and trending articles
  const [related, trending] = await Promise.all([
    getArticles({ 
      category: article.category, 
      limit: 4, 
      excludeId: article.id 
    }),
    getArticles({ limit: 5 }) // Assuming most recent are "trending" for the sidebar
  ]);

  const authorInitials = article.authorName
    .split(' ')
    .map((n) => n[0])
    .join('');
    
  const publishedDate = new Date(article.publishedAt).toLocaleDateString('bn-BD', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-12">
        <div className="lg:col-span-2 space-y-8">
            <article className="bg-card p-6 sm:p-8 rounded-lg shadow-lg">
                <header className="mb-8">
                    <Badge variant="default" className="mb-4">{article.category}</Badge>
                    <h1 className="text-3xl md:text-5xl font-bold font-headline text-primary mb-4">
                    {article.title}
                    </h1>
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-muted-foreground text-sm">
                            <Link href={`/authors/${article.authorId}`} className="flex items-center gap-2 hover:text-primary">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={article.authorAvatarUrl} alt={article.authorName} />
                                    <AvatarFallback>{authorInitials}</AvatarFallback>
                                </Avatar>
                                <span>{article.authorName}</span>
                            </Link>
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                <time dateTime={article.publishedAt}>{publishedDate}</time>
                            </div>
                        </div>
                        <BookmarkButton articleId={article.id} />
                    </div>
                    <AudioPlayer articleId={article.id} />
                </header>

                <div className="relative w-full h-64 md:h-96 mb-8 rounded-lg overflow-hidden">
                    <Image
                    src={article.imageUrl}
                    alt={article.title}
                    fill
                    className="object-cover"
                    data-ai-hint={article.imageHint}
                    priority
                    />
                </div>
                
                {article.aiSummary && (
                  <div className="mb-8 p-4 bg-muted/50 border-l-4 border-primary rounded-r-lg">
                      <h3 className="font-semibold flex items-center gap-2 mb-2">
                        <Info className="h-5 w-5 text-primary" />
                        একনজরে
                      </h3>
                      <p className="text-muted-foreground italic">{article.aiSummary}</p>
                  </div>
                )}

                <div className="prose prose-lg dark:prose-invert max-w-none space-y-6 text-foreground/90">
                    {article.content.map((paragraph, index) => (
                        <p key={index}>{paragraph}</p>
                    ))}
                </div>

                {article.factCheck && (
                    <div className="mt-8 pt-6 border-t">
                        <FactCheckMeter factCheck={article.factCheck} />
                    </div>
                )}
                
                <div className="mt-8 pt-6 border-t">
                    <ShareButtons articleTitle={article.title} />
                </div>
            </article>
            
            <RelatedArticles articles={related.articles} />
            
            <CommentsSection articleId={article.id} />
        </div>

        <aside className="lg:col-span-1 space-y-8 mt-8 lg:mt-0">
             <AdSpot className="h-64" />
             <TrendingSidebar articles={trending.articles} />
             <div className="sticky top-24">
                <AdSpot className="h-96" />
             </div>
        </aside>
    </div>
  );
}

    