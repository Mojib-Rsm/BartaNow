import Link from 'next/link';
import type { Article } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';

type RelatedArticlesProps = {
  articles: Article[];
};

export default function RelatedArticles({ articles }: RelatedArticlesProps) {
  if (articles.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-xl">সম্পর্কিত খবর</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {articles.map((article) => (
          <Link key={article.id} href={`/${article.category}/${article.slug}`} className="flex items-center gap-4 group">
            <div className="relative w-20 h-16 shrink-0">
              <Image
                src={article.imageUrl}
                alt={article.title}
                fill
                className="object-cover rounded-md"
                data-ai-hint={article.imageHint}
              />
            </div>
            <h3 className="font-semibold text-sm leading-snug group-hover:text-primary transition-colors">
              {article.title}
            </h3>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}