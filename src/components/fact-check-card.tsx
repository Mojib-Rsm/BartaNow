import Link from 'next/link';
import Image from 'next/image';
import type { Article } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { bn } from 'date-fns/locale';

type FactCheckCardProps = {
  article: Article;
};

const verdictMap = {
  'সত্য': { icon: CheckCircle2, text: 'সত্য', color: 'text-green-500', border: 'border-green-500', bg: 'bg-green-500/10' },
  'ভুয়া': { icon: XCircle, text: 'ভুয়া', color: 'text-red-500', border: 'border-red-500', bg: 'bg-red-500/10' },
  'আংশিক সত্য': { icon: AlertTriangle, text: 'আংশিক সত্য', color: 'text-yellow-500', border: 'border-yellow-500', bg: 'bg-yellow-500/10' },
};

export default function FactCheckCard({ article }: FactCheckCardProps) {
  if (!article.factCheck) return null;

  const verdictInfo = verdictMap[article.factCheck.verdict];
  const Icon = verdictInfo.icon;
  const formattedDate = format(new Date(article.publishedAt), "d MMMM, yyyy", { locale: bn });

  return (
    <Card className={cn(
      "flex flex-col overflow-hidden bg-card rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300 group border-2",
      verdictInfo.border
    )}>
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
          <CardTitle className="font-headline text-base leading-snug">
              <Link href={`/articles/${article.id}`} className="line-clamp-2 hover:text-primary transition-colors">
                  {article.title}
              </Link>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-grow p-0 mt-2">
          <p className="text-muted-foreground line-clamp-3 text-sm">{article.aiSummary}</p>
        </CardContent>
        <CardFooter className="p-0 pt-4 mt-auto flex-col items-start gap-2">
            <div className={cn(
                "inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold",
                verdictInfo.bg,
                verdictInfo.color
            )}>
                <Icon className="h-4 w-4" />
                <span>{verdictInfo.text}</span>
            </div>
            <p className="text-xs text-muted-foreground">{formattedDate}</p>
        </CardFooter>
      </div>
    </Card>
  );
}
