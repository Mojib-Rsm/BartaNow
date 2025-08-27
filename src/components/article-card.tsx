import Link from 'next/link';
import Image from 'next/image';
import type { Article } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { bn } from 'date-fns/locale';

type ArticleCardProps = {
  article: Article;
};

export default function ArticleCard({ article }: ArticleCardProps) {
  const authorInitials = article.authorName
    .split(' ')
    .map((n) => n[0])
    .join('');
  
  const formattedDate = format(new Date(article.publishedAt), "d MMMM, yyyy", { locale: bn });

  return (
    <Card className="flex flex-col overflow-hidden bg-card rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300 group border">
      <Link href={`/articles/${article.id}`} className="block overflow-hidden">
        <div className="relative aspect-video w-full">
            <Image
            src={article.imageUrl}
            alt={article.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            data-ai-hint={article.imageHint}
            />
        </div>
      </Link>
      <div className="p-4 flex flex-col flex-grow">
        <CardHeader className='p-0 pb-2'>
          <CardTitle className="font-headline text-lg leading-snug">
              <Link href={`/articles/${article.id}`} className="line-clamp-2 hover:text-primary transition-colors">
                  {article.title}
              </Link>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-grow p-0">
          <p className="text-muted-foreground line-clamp-3 text-sm">{article.aiSummary}</p>
        </CardContent>
        <CardFooter className="p-0 pt-4 mt-auto">
           <div className="flex items-center gap-3 w-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={article.authorAvatarUrl} alt={article.authorName} />
                <AvatarFallback>{authorInitials}</AvatarFallback>
              </Avatar>
              <div className='text-xs'>
                <p className="font-semibold text-foreground">{article.authorName}</p>
                <p className="text-muted-foreground">{formattedDate}</p>
              </div>
            </div>
        </CardFooter>
      </div>
    </Card>
  );
}
