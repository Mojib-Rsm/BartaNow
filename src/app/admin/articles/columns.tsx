
"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal, Trash2, Clock } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import type { Article } from "@/lib/types"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { deleteArticleAction } from "@/app/actions"
import { useRouter } from "next/navigation"
import { useAuthorization } from "@/hooks/use-authorization"
import { format, isFuture } from "date-fns"
import { bn } from "date-fns/locale"
import { cn, generateNonAiSlug } from "@/lib/utils"

const DeleteConfirmationDialog = ({ article, onDeleted }: { article: Article, onDeleted: () => void }) => {
    const [isOpen, setIsOpen] = useState(false)
    const { toast } = useToast()
    const { hasPermission } = useAuthorization();

    const handleDelete = async () => {
        if (!hasPermission('delete_article')) {
            toast({
                variant: "destructive",
                title: "অনুমতি নেই",
                description: "আপনার এই আর্টিকেলটি ডিলিট করার অনুমতি নেই।",
            });
            return;
        }

        const result = await deleteArticleAction(article.id)
        if (result.success) {
            toast({
                title: "সফল",
                description: result.message,
            })
            onDeleted()
        } else {
            toast({
                variant: "destructive",
                title: "ব্যর্থ",
                description: result.message,
            })
        }
        setIsOpen(false)
    }

    if (!hasPermission('delete_article')) return null;

    return (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuItem
                className="text-destructive"
                onSelect={(e) => {
                    e.preventDefault()
                    setIsOpen(true)
                }}
            >
                <Trash2 className="mr-2 h-4 w-4" />
                ডিলিট করুন
            </DropdownMenuItem>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>আপনি কি নিশ্চিত?</AlertDialogTitle>
                    <AlertDialogDescription>
                        এই কাজটি আনডু করা যাবে না। এটি স্থায়ীভাবে আর্টিকেলটি ডিলিট করে দেবে।
                        <br />
                        <strong className="mt-2 block">"{article.title}"</strong>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>বাতিল করুন</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
                        ডিলিট করুন
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

const statusVariantMap: { [key: string]: 'default' | 'secondary' | 'destructive' | 'outline' } = {
  Published: 'default',
  Draft: 'secondary',
  'Pending Review': 'outline',
  Scheduled: 'outline',
};

const statusColorMap: { [key: string]: string } = {
    Published: 'bg-green-600 hover:bg-green-700',
    Draft: 'bg-gray-500 hover:bg-gray-600',
    'Pending Review': 'bg-yellow-500 hover:bg-yellow-600 border-yellow-500 text-black',
    Scheduled: 'bg-amber-500 hover:bg-amber-600 border-amber-500',
};


export const columns: ColumnDef<Article>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          শিরোনাম
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
        const isScheduled = row.original.status === 'Scheduled' && isFuture(new Date(row.original.publishedAt));
        return (
            <div className="font-medium line-clamp-2">
                {row.getValue("title")}
                {isScheduled && (
                    <Badge variant="secondary" className="ml-2 bg-amber-500 text-white">
                        <Clock className="mr-1 h-3 w-3" />
                        শিডিউলড
                    </Badge>
                )}
            </div>
        )
    },
  },
  {
    accessorKey: "status",
    header: "স্ট্যাটাস",
    cell: ({ row }) => {
        const status = row.getValue("status") as string;
        const isScheduled = status === 'Scheduled' && isFuture(new Date(row.original.publishedAt));
        const displayStatus = isScheduled ? 'Scheduled' : status;

        return (
            <Badge 
                variant={statusVariantMap[displayStatus] || 'outline'}
                className={cn(statusColorMap[displayStatus], 'text-white')}
            >
                {displayStatus}
            </Badge>
        )
    },
  },
  {
    accessorKey: "category",
    header: "ক্যাটাগরি",
    cell: ({ row }) => <Badge variant="outline">{row.getValue("category")}</Badge>,
  },
  {
    accessorKey: "authorName",
    header: "লেখক",
  },
   {
    accessorKey: "tags",
    header: "ট্যাগ",
    cell: ({ row }) => {
        const tags = row.original.tags;
        if (!tags || tags.length === 0) return null;
        return (
            <div className="flex flex-wrap gap-1">
                {tags.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
            </div>
        )
    },
  },
  {
    accessorKey: "publishedAt",
    header: ({ column }) => {
       return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          প্রকাশের তারিখ
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue("publishedAt"))
      const formatted = format(date, "d MMMM, yyyy, h:mm a", { locale: bn });
      return <div className="text-right font-medium">{formatted}</div>
    },
  },
  {
    id: "actions",
    cell: ({ row, table }) => {
      const article = row.original
      const router = useRouter()
      const { hasPermission } = useAuthorization();
      const categorySlug = generateNonAiSlug(article.category || 'uncategorized');
      const articleUrl = `/${categorySlug}/${article.slug}`;


      const handleDeleted = () => {
        router.refresh()
      }

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>অ্যাকশন</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(article.id)}
            >
              আর্টিকেল আইডি কপি করুন
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={articleUrl} target="_blank">আর্টিকেল দেখুন</Link>
            </DropdownMenuItem>
            {hasPermission('edit_article') && (
                <DropdownMenuItem asChild>
                <Link href={`/admin/articles/edit/${article.id}`}>এডিট করুন</Link>
                </DropdownMenuItem>
            )}
            <DeleteConfirmationDialog article={article} onDeleted={handleDeleted} />
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
