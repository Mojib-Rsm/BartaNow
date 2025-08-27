import Link from 'next/link';
import Image from 'next/image';
import type { Article } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type ArticleCardProps = {
  article: Article;
};

export default function ArticleCard({ article }: ArticleCardProps) {
  return (
    <Card className="flex flex-col overflow-hidden bg-card rounded-md shadow-sm hover:shadow-lg transition-shadow duration-300 group border">
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
      <CardHeader className='p-4 pb-2'>
        <CardTitle className="font-headline text-lg h-14">
            <Link href={`/articles/${article.id}`} className="line-clamp-2 hover:text-primary transition-colors">
                {article.title}
            </Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow p-4 pt-0">
        <p className="text-muted-foreground line-clamp-3 text-sm">{article.aiSummary}</p>
      </CardContent>
    </Card>
  );
}
