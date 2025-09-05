
"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal, Trash2 } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import type { Location } from "@/lib/types"
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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { deleteLocationAction } from "@/app/actions"
import { Badge } from "@/components/ui/badge"

const DeleteConfirmationDialog = ({ item, onDeleted }: { item: Location, onDeleted: () => void }) => {
    const [isOpen, setIsOpen] = useState(false)
    const { toast } = useToast()
    const { hasPermission } = useAuthorization();

    const handleDelete = async () => {
        // Assuming 'manage_settings' permission for location management for now
        if (!hasPermission('manage_settings')) {
            toast({
                variant: "destructive",
                title: "অনুমতি নেই",
                description: "আপনার এই লোকেশনটি ডিলিট করার অনুমতি নেই।",
            });
            return;
        }

        const result = await deleteLocationAction(item.id)
        if (result.success) {
            toast({ title: "সফল", description: result.message })
            onDeleted()
        } else {
            toast({ variant: "destructive", title: "ব্যর্থ", description: result.message })
        }
        setIsOpen(false)
    }

    if (!hasPermission('manage_settings')) return null;

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
                        এই কাজটি আনডু করা যাবে না। এটি স্থায়ীভাবে লোকেশনটি ডিলিট করে দেবে।
                        <br />
                        <strong className="mt-2 block">"{item.name}"</strong>
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

export const columns: ColumnDef<Location>[] = [
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
    accessorKey: "type",
    header: "ধরন",
    cell: ({ row }) => <Badge variant="outline">{row.getValue("type")}</Badge>,
  },
  {
    accessorKey: "slug",
    header: "স্লাগ",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const location = row.original
      const router = useRouter()
      const { hasPermission } = useAuthorization();

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
            {hasPermission('manage_settings') && (
                <DropdownMenuItem asChild>
                    <Link href={`/admin/location/edit/${location.id}`}>এডিট করুন</Link>
                </DropdownMenuItem>
            )}
            <DeleteConfirmationDialog item={location} onDeleted={() => router.refresh()} />
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
