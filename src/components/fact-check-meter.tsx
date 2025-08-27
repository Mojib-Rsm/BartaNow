import type { FactCheck } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, XCircle, AlertTriangle, LinkIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

type FactCheckMeterProps = {
  factCheck: FactCheck;
};

const verdictMap = {
  'সত্য': { icon: CheckCircle2, text: 'ফলাফল: সত্য', color: 'text-green-500', border: 'border-green-500', bg: 'bg-green-500/10' },
  'ভুয়া': { icon: XCircle, text: 'ফলাফল: ভুয়া', color: 'text-red-500', border: 'border-red-500', bg: 'bg-red-500/10' },
  'আংশিক সত্য': { icon: AlertTriangle, text: 'ফলাফল: আংশিক সত্য', color: 'text-yellow-500', border: 'border-yellow-500', bg: 'bg-yellow-500/10' },
};

export default function FactCheckMeter({ factCheck }: FactCheckMeterProps) {
  const verdictInfo = verdictMap[factCheck.verdict];
  const Icon = verdictInfo.icon;

  return (
    <Card className={cn("w-full border-2 shadow-none", verdictInfo.border, verdictInfo.bg)}>
      <CardHeader>
        <CardTitle className={cn("flex items-center gap-2 text-lg font-headline", verdictInfo.color)}>
          <Icon className="h-6 w-6" />
          {verdictInfo.text}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div>
          <p className="text-sm font-semibold text-foreground">দাবি:</p>
          <blockquote className="border-l-2 pl-4 italic text-muted-foreground">
            {factCheck.statement}
          </blockquote>
        </div>
        <div>
           <p className="text-sm font-semibold text-foreground">সূত্র:</p>
            <Link href={factCheck.source.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sm text-primary hover:underline">
                <LinkIcon className="h-3 w-3" />
                {factCheck.source.name}
            </Link>
        </div>
      </CardContent>
    </Card>
  );
}
