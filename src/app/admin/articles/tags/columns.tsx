
"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal, Trash2 } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import type { Tag } from "@/lib/types"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { useAuthorization } from "@/hooks/use-authorization"
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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { deleteTagAction } from "@/app/actions"

const DeleteConfirmationDialog = ({ tag, onDeleted }: { tag: Tag, onDeleted: () => void }) => {
    const [isOpen, setIsOpen] = useState(false)
    const { toast } = useToast()
    const { hasPermission } = useAuthorization();

    const handleDelete = async () => {
        if (!hasPermission('delete_tag')) {
            toast({
                variant: "destructive",
                title: "অনুমতি নেই",
                description: "আপনার এই ট্যাগটি ডিলিট করার অনুমতি নেই।",
            });
            return;
        }

        const result = await deleteTagAction(tag.name)
        if (result.success) {
            toast({ title: "সফল", description: result.message })
            onDeleted()
        } else {
            toast({ variant: "destructive", title: "ব্যর্থ", description: result.message })
        }
        setIsOpen(false)
    }

    if (!hasPermission('delete_tag')) return null;

    return (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuItem
                className="text-destructive"
                onSelect={(e) => { e.preventDefault(); setIsOpen(true); }}
            >
                <Trash2 className="mr-2 h-4 w-4" />
                ডিলিট করুন
            </DropdownMenuItem>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>আপনি কি নিশ্চিত?</AlertDialogTitle>
                    <AlertDialogDescription>
                        এই কাজটি আনডু করা যাবে না। এটি স্থায়ীভাবে ট্যাগটি ডিলিট করে দেবে এবং সকল আর্টিকেল থেকে সরিয়ে ফেলবে।
                        <br />
                        <strong className="mt-2 block">"{tag.name}"</strong>
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

export const columns: ColumnDef<Tag>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          নাম
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
        return <div className="font-medium">{row.getValue("name")}</div>
    },
  },
  {
    accessorKey: "slug",
    header: "স্লাগ",
  },
   {
    accessorKey: "count",
    header: "পোস্ট সংখ্যা",
     cell: ({ row }) => {
      return <div className="text-center">{new Intl.NumberFormat('bn-BD').format(row.original.count)}</div>
    }
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const tag = row.original
      const router = useRouter()
      const { hasPermission } = useAuthorization();

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
            {/* Editing tag name is complex as it requires updating all articles. This is a future feature. */}
            {/* {hasPermission('edit_tag') && (
                <DropdownMenuItem asChild>
                <Link href={`/admin/articles/tags/edit/${tag.id}`}>Edit</Link>
                </DropdownMenuItem>
            )} */}
            <DeleteConfirmationDialog tag={tag} onDeleted={handleDeleted} />
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
