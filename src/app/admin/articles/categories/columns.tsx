
"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal, Trash2 } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import type { Category } from "@/lib/types"
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
import { deleteCategoryAction } from "@/app/actions"

const DeleteConfirmationDialog = ({ category, onDeleted }: { category: Category, onDeleted: () => void }) => {
    const [isOpen, setIsOpen] = useState(false)
    const { toast } = useToast()
    const { hasPermission } = useAuthorization();

    const handleDelete = async () => {
        if (!hasPermission('delete_article')) { // Assuming same permission for categories for now
            toast({
                variant: "destructive",
                title: "অনুমতি নেই",
                description: "আপনার এই ক্যাটাগরিটি ডিলিট করার অনুমতি নেই।",
            });
            return;
        }

        const result = await deleteCategoryAction(category.id)
        if (result.success) {
            toast({ title: "সফল", description: result.message })
            onDeleted()
        } else {
            toast({ variant: "destructive", title: "ব্যর্থ", description: result.message })
        }
        setIsOpen(false)
    }

    if (!hasPermission('delete_article')) return null;

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
                        এই কাজটি আনডু করা যাবে না। এটি স্থায়ীভাবে ক্যাটাগরিটি ডিলিট করে দেবে।
                        <br />
                        <strong className="mt-2 block">"{category.name}"</strong>
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

export const columns: ColumnDef<Category>[] = [
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
    accessorKey: "description",
    header: "বিবরণ",
  },
   {
    accessorKey: "count",
    header: "পোস্ট সংখ্যা",
     cell: ({ row }) => {
      // This is a placeholder. Real count would come from a db query.
      return <div className="text-center">{Math.floor(Math.random() * 50)}</div>
    }
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const category = row.original
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
            {hasPermission('edit_article') && (
                <DropdownMenuItem asChild>
                <Link href={`/admin/articles/categories/edit/${category.id}`}>এডিট করুন</Link>
                </DropdownMenuItem>
            )}
            <DeleteConfirmationDialog category={category} onDeleted={handleDeleted} />
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
