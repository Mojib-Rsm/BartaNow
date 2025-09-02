
'use client';

import type { Article } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Flame } from 'lucide-react';
import { generateNonAiSlug } from '@/lib/utils';

type TrendingSidebarProps = {
    articles: Article[];
};

export default function TrendingSidebar({ articles }: TrendingSidebarProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline text-lg">
          <Flame className="h-5 w-5 text-primary" />
          জনপ্রিয় খবর
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {articles.map((article, index) => {
            const categorySlug = generateNonAiSlug(article.category || "BartaNow-Unnamed");
            const articleUrl = `/${categorySlug}/${article.slug}`;
            return (
                <li key={article.id} className="flex items-start gap-4">
                <span className="text-2xl font-bold text-primary/50 w-6 text-center">{new Intl.NumberFormat('bn-BD').format(index + 1)}.</span>
                <Link href={articleUrl} className="group">
                    <h3 className="font-semibold text-sm leading-snug group-hover:text-primary transition-colors">
                    {article.title}
                    </h3>
                </Link>
                </li>
            )
          })}
        </ul>
      </CardContent>
    </Card>
  );
}
