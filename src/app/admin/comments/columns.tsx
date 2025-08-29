"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal, Trash2, CheckCircle, XCircle, BadgeCheck, ShieldAlert, BadgeInfo } from "lucide-react"
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
import type { Comment } from "@/lib/types"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { updateCommentStatusAction, deleteCommentAction } from "@/app/actions"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

const DeleteConfirmationDialog = ({ commentId, onDeleted }: { commentId: string, onDeleted: () => void }) => {
    const [isOpen, setIsOpen] = useState(false)
    const { toast } = useToast()

    const handleDelete = async () => {
        const result = await deleteCommentAction(commentId)
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
                স্থায়ীভাবে ডিলিট করুন
            </DropdownMenuItem>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>আপনি কি নিশ্চিত?</AlertDialogTitle>
                    <AlertDialogDescription>
                        এই কাজটি আনডু করা যাবে না। এটি স্থায়ীভাবে মন্তব্যটি ডিলিট করে দেবে।
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

const statusMap: Record<Comment['status'], { text: string; icon: React.ElementType; className: string; }> = {
    pending: { text: 'বিচারাধীন', icon: BadgeInfo, className: 'bg-yellow-500 hover:bg-yellow-600' },
    approved: { text: 'অনুমোদিত', icon: CheckCircle, className: 'bg-green-600 hover:bg-green-700' },
    spam: { text: 'স্প্যাম', icon: ShieldAlert, className: 'bg-orange-500 hover:bg-orange-600' },
    trashed: { text: 'ট্র্যাশড', icon: Trash2, className: 'bg-gray-500 hover:bg-gray-600' },
};


export const columns: ColumnDef<Comment>[] = [
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
    accessorKey: "userName",
    header: "ব্যবহারকারী",
  },
  {
    accessorKey: "text",
    header: "মন্তব্য",
    cell: ({ row }) => <div className="line-clamp-2 max-w-sm">{row.getValue("text")}</div>,
  },
  {
    accessorKey: "articleId",
    header: "আর্টিকেল",
    cell: ({ row }) => {
        const articleId = row.getValue("articleId") as string;
        // In a real app you'd fetch the article title, for now we just link
        // Note: this part is not implemented as we don't have getArticleById readily available on client
        return (
            <Button variant="link" asChild className="p-0 h-auto">
                <Link href={`/admin/articles/edit/${articleId}`} target="_blank">আর্টিকেল দেখুন</Link>
            </Button>
        )
    }
  },
  {
    accessorKey: "status",
    header: "স্ট্যাটাস",
    cell: ({ row }) => {
        const status = row.getValue("status") as Comment['status'];
        const { text, icon: Icon, className } = statusMap[status] || { text: 'Unknown', icon: BadgeInfo, className: 'bg-gray-400' };

        return (
            <Badge className={cn(className, "text-white")}>
                <Icon className="mr-1 h-3 w-3" />
                {text}
            </Badge>
        )
    },
  },
  {
    accessorKey: "timestamp",
    header: ({ column }) => {
       return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          তারিখ
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue("timestamp"))
      const formatted = new Intl.DateTimeFormat('bn-BD', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
      }).format(date);
      return <div className="font-medium">{formatted}</div>
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const comment = row.original
      const router = useRouter()
      const { toast } = useToast()

      const handleStatusChange = async (newStatus: Comment['status']) => {
          const result = await updateCommentStatusAction([comment.id], newStatus);
          if (result.success) {
            toast({ title: "সফল", description: result.message })
            router.refresh();
          } else {
            toast({ variant: "destructive", title: "ব্যর্থ", description: result.message })
          }
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
            <DropdownMenuSeparator />
            {comment.status !== 'approved' && (
                <DropdownMenuItem onClick={() => handleStatusChange('approved')}>
                    <BadgeCheck className="mr-2 h-4 w-4" />
                    অনুমোদন করুন
                </DropdownMenuItem>
            )}
            {comment.status !== 'spam' && (
                <DropdownMenuItem onClick={() => handleStatusChange('spam')}>
                     <ShieldAlert className="mr-2 h-4 w-4" />
                    স্প্যাম হিসেবে চিহ্নিত করুন
                </DropdownMenuItem>
            )}
             {comment.status !== 'trashed' && (
                <DropdownMenuItem onClick={() => handleStatusChange('trashed')}>
                    <Trash2 className="mr-2 h-4 w-4 text-destructive" />
                    ট্র্যাশ করুন
                </DropdownMenuItem>
            )}
            {comment.status === 'trashed' && (
                 <DropdownMenuItem onClick={() => handleStatusChange('pending')}>
                    <BadgeCheck className="mr-2 h-4 w-4" />
                    পুনরুদ্ধার করুন
                </DropdownMenuItem>
            )}
            <DeleteConfirmationDialog commentId={comment.id} onDeleted={() => router.refresh()} />
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
