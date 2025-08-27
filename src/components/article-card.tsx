import Link from 'next/link';
import Image from 'next/image';
import type { Article } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

type ArticleCardProps = {
  article: Article;
};

export default function ArticleCard({ article }: ArticleCardProps) {
  const authorInitials = article.authorName
    .split(' ')
    .map((n) => n[0])
    .join('');
  const publishedDate = new Date(article.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Card className="flex flex-col overflow-hidden bg-white dark:bg-card-dark rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
      <Link href={`/articles/${article.id}`} className="block">
        <div className="relative h-48 w-full">
            <Image
            src={article.imageUrl}
            alt={article.title}
            fill
            className="object-cover"
            data-ai-hint={article.imageHint}
            />
        </div>
      </Link>
      <CardHeader>
        <CardTitle className="font-headline text-xl h-14 line-clamp-2">
            <Link href={`/articles/${article.id}`} className="hover:text-primary transition-colors">
                {article.title}
            </Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-muted-foreground line-clamp-3">{article.aiSummary}</p>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={article.authorAvatarUrl} alt={article.authorName} />
            <AvatarFallback>{authorInitials}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-semibold">{article.authorName}</p>
            <p className="text-xs text-muted-foreground">{publishedDate}</p>
          </div>
        </div>
        <Button asChild variant="ghost" size="icon" className="text-accent hover:bg-accent/10">
          <Link href={`/articles/${article.id}`}>
            <ArrowRight className="h-5 w-5" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
