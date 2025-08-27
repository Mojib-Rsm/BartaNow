import { getArticleById } from '@/lib/api';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, User } from 'lucide-react';
import type { Metadata, ResolvingMetadata } from 'next'
 
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
    <article className="max-w-4xl mx-auto bg-card p-6 sm:p-8 rounded-lg shadow-lg">
      <header className="mb-8">
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
    </article>
  );
}
