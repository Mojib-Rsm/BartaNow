import Link from 'next/link';
import Image from 'next/image';
import type { Article } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { bn } from 'date-fns/locale';
import { Badge } from './ui/badge';

type ArticleCardProps = {
  article: Article;
};

export default function ArticleCard({ article }: ArticleCardProps) {
  const formattedDate = format(new Date(article.publishedAt), "d MMMM, yyyy", { locale: bn });
  const articleUrl = `/${encodeURIComponent(article.category)}/${article.slug}`;

  return (
    <Card className="flex flex-col overflow-hidden bg-card rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300 group border">
      <Link href={articleUrl} className="block overflow-hidden">
        <div className="relative aspect-video w-full">
            <Image
            src={article.imageUrl}
            alt={article.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            data-ai-hint={article.imageHint}
            />
            {article.sponsored && (
                 <Badge 
                    variant="destructive" 
                    className="absolute top-2 right-2 bg-yellow-500 text-black hover:bg-yellow-600"
                >
                    স্পনসরড
                </Badge>
            )}
        </div>
      </Link>
      <div className="p-4 flex flex-col flex-grow">
        <CardHeader className='p-0 pb-2'>
          <CardTitle className="font-headline text-lg leading-snug">
              <Link href={articleUrl} className="line-clamp-2 hover:text-primary transition-colors">
                  {article.title}
              </Link>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-grow p-0 mt-2">
          <p className="text-muted-foreground line-clamp-3 text-sm">{article.aiSummary}</p>
        </CardContent>
        <div className="p-0 pt-4 mt-auto">
            <p className="text-xs text-muted-foreground">{formattedDate}</p>
        </div>
      </div>
    </Card>
  );
}

    