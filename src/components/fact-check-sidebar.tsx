
'use client';

import type { Article } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { CheckCircle2, XCircle, AlertTriangle, ShieldQuestion } from 'lucide-react';
import { cn } from '@/lib/utils';

type FactCheckSidebarProps = {
    articles: Article[];
};

const verdictMap = {
    'সত্য': { icon: CheckCircle2, color: 'text-green-500' },
    'মিথ্যা': { icon: XCircle, color: 'text-red-500' },
    'বিভ্রান্তিকর': { icon: AlertTriangle, color: 'text-yellow-500' },
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
            const verdictInfo = article.factCheck?.verdict ? verdictMap[article.factCheck.verdict] : null;
            const Icon = verdictInfo?.icon || ShieldQuestion;

            return (
                 <li key={article.id} className="flex items-start gap-3">
                    {verdictInfo && <Icon className={cn("h-5 w-5 mt-1 shrink-0", verdictInfo.color)} />}
                    <Link href={`/articles/${article.id}`} className="group">
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
