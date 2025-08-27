import { getArticleById, getArticles } from '@/lib/api';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar } from 'lucide-react';
import type { Metadata, ResolvingMetadata } from 'next'
import ShareButtons from '@/components/share-buttons';
import RelatedArticles from '@/components/related-articles';
import CommentsSection from '@/components/comments-section';
import { Badge } from '@/components/ui/badge';
 
type Props = {
  params: { id: string }
}
 
export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const article = await getArticleById(params.id)
 
  if (!article) {
    return {
        title: 'Article not found'
    }
  }
 
  return {
    title: article.title,
    description: article.aiSummary,
  }
}

export default async function ArticlePage({ params }: { params: { id: string } }) {
  const article = await getArticleById(params.id);

  if (!article) {
    notFound();
  }

  // Fetch related articles from the same category
  const related = await getArticles({ 
    category: article.category, 
    limit: 4, 
    excludeId: article.id 
  });

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
        <article className="lg:col-span-2 bg-card p-6 sm:p-8 rounded-lg shadow-lg">
            <header className="mb-8">
                <Badge variant="default" className="mb-4">{article.category}</Badge>
                <h1 className="text-3xl md:text-5xl font-bold font-headline text-primary mb-4">
                {article.title}
                </h1>
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-muted-foreground text-sm">
                    <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={article.authorAvatarUrl} alt={article.authorName} />
                            <AvatarFallback>{authorInitials}</AvatarFallback>
                        </Avatar>
                        <span>{article.authorName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <time dateTime={article.publishedAt}>{publishedDate}</time>
                    </div>
                </div>
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

            <div className="prose prose-lg dark:prose-invert max-w-none space-y-6 text-foreground/90">
                {article.content.map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                ))}
            </div>
            
            <div className="mt-8 pt-6 border-t">
                <ShareButtons articleTitle={article.title} />
            </div>
        </article>

        <aside className="lg:col-span-1 space-y-8 mt-8 lg:mt-0">
             <RelatedArticles articles={related.articles} />
             <CommentsSection articleId={article.id} />
        </aside>
    </div>
  );
}
