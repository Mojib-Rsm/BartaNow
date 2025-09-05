

'use client';

import type { Article } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { CheckCircle2, XCircle, AlertTriangle, ShieldQuestion } from 'lucide-react';
import { cn, generateNonAiSlug } from '@/lib/utils';

type FactCheckSidebarProps = {
    articles: Article[];
};

const verdictMap = {
    'সত্য': { icon: CheckCircle2, color: 'text-green-500' },
    'ভুয়া': { icon: XCircle, color: 'text-red-500' },
    'আংশিক সত্য': { icon: AlertTriangle, color: 'text-yellow-500' },
};

export default function FactCheckSidebar({ articles }: FactCheckSidebarProps) {
  if (articles.length === 0) {
    return null;
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline text-lg">
          <ShieldQuestion className="h-5 w-5 text-primary" />
          তথ্য যাচাই
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {articles.map((article) => {
            const verdict = article.factCheck?.verdict;
            const verdictInfo = verdict ? verdictMap[verdict] : null;
            const Icon = verdictInfo?.icon || ShieldQuestion;
            const categorySlug = generateNonAiSlug(article.category || "BartaNow-Unnamed");
            const articleUrl = `/${categorySlug}/${article.slug}`;

            return (
                 <li key={article.id} className="flex items-start gap-3">
                    <Icon className={cn("h-5 w-5 mt-1 shrink-0", verdictInfo?.color || 'text-muted-foreground')} />
                    <Link href={articleUrl} className="group">
                        <h3 className="font-semibold text-sm leading-snug group-hover:text-primary transition-colors">
                            {article.title}
                        </h3>
                    </Link>
                </li>
            )
          })}
        </ul>
         <Link href="/fact-check" className="text-primary text-sm font-semibold mt-4 block text-center hover:underline">
            আরও দেখুন
        </Link>
      </CardContent>
    </Card>
  );
}
