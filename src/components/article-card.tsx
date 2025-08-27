import Link from 'next/link';
import Image from 'next/image';
import type { Article } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

type ArticleCardProps = {
  article: Article;
  variant?: 'default' | 'compact';
};

export default function ArticleCard({ article, variant = 'default' }: ArticleCardProps) {
  const publishedDate = new Date(article.publishedAt).toLocaleDateString('bn-BD', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  if (variant === 'compact') {
    return (
       <Card className="flex flex-col overflow-hidden bg-card rounded-none shadow-none group border-0 border-r last:border-r-0 pr-4">
          <Link href={`/articles/${article.id}`} className="block overflow-hidden">
            <div className="relative h-40 w-full">
                <Image
                src={article.imageUrl}
                alt={article.title}
                fill
                className="object-cover"
                data-ai-hint={article.imageHint}
                />
            </div>
          </Link>
          <CardHeader className='p-0 pt-3'>
            <CardTitle className="font-headline text-lg h-12">
                <Link href={`/articles/${article.id}`} className="line-clamp-2 group-hover:text-primary transition-colors">
                    {article.title}
                </Link>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-grow p-0 pt-2">
            <p className="text-muted-foreground line-clamp-3 text-sm">{article.aiSummary}</p>
          </CardContent>
        </Card>
    )
  }

  return (
    <Card className="flex flex-col overflow-hidden bg-card rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300 group border">
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
      <CardFooter className="p-4 pt-0">
         <p className="text-xs text-muted-foreground">{publishedDate}</p>
      </CardFooter>
    </Card>
  );
}