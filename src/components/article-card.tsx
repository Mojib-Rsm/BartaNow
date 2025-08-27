import Link from 'next/link';
import Image from 'next/image';
import type { Article } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from './ui/button';

type ArticleCardProps = {
  article: Article;
  variant?: 'default' | 'compact';
};

export default function ArticleCard({ article, variant = 'default' }: ArticleCardProps) {
  const authorInitials = article.authorName
    .split(' ')
    .map((n) => n[0])
    .join('');
  const publishedDate = new Date(article.publishedAt).toLocaleDateString('bn-BD', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  if (variant === 'compact') {
    return (
       <Card className="flex flex-col overflow-hidden bg-card rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300 group border">
          <Link href={`/articles/${article.id}`} className="block overflow-hidden">
            <div className="relative h-40 w-full">
                <Image
                src={article.imageUrl}
                alt={article.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                data-ai-hint={article.imageHint}
                />
            </div>
          </Link>
          <CardHeader className='p-4'>
            <CardTitle className="font-headline text-lg h-12">
                <Link href={`/articles/${article.id}`} className="line-clamp-2 hover:text-primary transition-colors">
                    {article.title}
                </Link>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-grow p-4 pt-0">
            <p className="text-muted-foreground line-clamp-3 text-sm">{article.aiSummary}</p>
          </CardContent>
          <CardFooter className="p-4 pt-0">
             <p className="text-xs text-muted-foreground">{publishedDate}</p>
          </CardFooter>
        </Card>
    )
  }

  return (
    <Card className="flex flex-col overflow-hidden bg-card rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 group border">
      <Link href={`/articles/${article.id}`} className="block overflow-hidden">
        <div className="relative h-48 w-full">
            <Image
            src={article.imageUrl}
            alt={article.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            data-ai-hint={article.imageHint}
            />
        </div>
      </Link>
      <CardHeader>
        <CardTitle className="font-headline text-xl h-14">
            <Link href={`/articles/${article.id}`} className="line-clamp-2 hover:text-primary transition-colors">
                {article.title}
            </Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-muted-foreground line-clamp-3">{article.aiSummary}</p>
      </CardContent>
      <CardFooter className="flex items-center justify-between mt-auto bg-muted/30 py-3 px-6">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 border">
            <AvatarImage src={article.authorAvatarUrl} alt={article.authorName} />
            <AvatarFallback>{authorInitials}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-semibold">{article.authorName}</p>
            <p className="text-xs text-muted-foreground">{publishedDate}</p>
          </div>
        </div>
        <Button asChild variant="link" className="text-primary">
            <Link href={`/articles/${article.id}`}>পুরো খবর</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
