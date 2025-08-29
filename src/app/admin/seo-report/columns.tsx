
"use client"

import { ColumnDef } from "@tanstack/react-table"
import Link from "next/link"
import type { Article } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Check, X, ArrowUpDown } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

type AnalyzedArticle = Article & {
    seo: {
        score: number;
        issues: string[];
        wordCount: number;
        hasMetaTitle: boolean;
        hasGoodMetaDescription: boolean;
    }
}

const getScoreColor = (score: number) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 50) return "bg-yellow-500";
    return "bg-red-500";
};

export const columns: ColumnDef<AnalyzedArticle>[] = [
  {
    accessorKey: "title",
    header: "শিরোনাম",
    cell: ({ row }) => (
      <Link href={`/admin/articles/edit/${row.original.id}`} className="font-medium hover:text-primary">
        {row.original.title}
      </Link>
    ),
  },
  {
    accessorKey: "seo.score",
    header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            SEO স্কোর
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
    },
    cell: ({ row }) => {
        const score = row.original.seo.score;
        return (
            <div className="flex items-center gap-2">
                <Progress value={score} className="h-2 w-24" indicatorClassName={getScoreColor(score)} />
                <span className={cn("font-semibold", getScoreColor(score).replace('bg-','text-'))}>{score}</span>
            </div>
        )
    }
  },
  {
    accessorKey: "focusKeywords",
    header: "ফোকাস কীওয়ার্ড",
    cell: ({ row }) => row.original.focusKeywords?.join(', ') || <span className="text-muted-foreground">-</span>
  },
  {
    accessorKey: "seo.hasMetaTitle",
    header: "মেটা শিরোনাম",
    cell: ({ row }) => row.original.englishTitle ? <Check className="h-5 w-5 text-green-500" /> : <X className="h-5 w-5 text-destructive" />
  },
  {
    accessorKey: "seo.hasGoodMetaDescription",
    header: "মেটা ডেসক্রিপশন",
    cell: ({ row }) => row.original.seo.hasGoodMetaDescription ? <Check className="h-5 w-5 text-green-500" /> : <X className="h-5 w-5 text-destructive" />
  },
  {
    accessorKey: "seo.wordCount",
    header: "শব্দ সংখ্যা",
    cell: ({ row }) => new Intl.NumberFormat('bn-BD').format(row.original.seo.wordCount)
  },
   {
    id: "status",
    header: "স্ট্যাটাস",
    cell: ({ row }) => {
        const score = row.original.seo.score;
        let status: 'Good' | 'Needs Fix' | 'Poor' = 'Poor';
        let variant: 'default' | 'destructive' | 'secondary' = 'destructive';

        if (score >= 80) {
            status = 'Good';
            variant = 'default';
        } else if (score >= 50) {
            status = 'Needs Fix';
            variant = 'secondary';
        }
        
        return <Badge variant={variant} className={cn(variant === 'default' && "bg-green-600")}>{status}</Badge>
    }
  },
]
