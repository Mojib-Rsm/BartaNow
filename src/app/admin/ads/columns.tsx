
"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal, Trash2, CheckCircle, XCircle } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
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
import type { Ad } from "@/lib/types"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { deleteAdAction } from "@/app/actions"
import { useRouter } from "next/navigation"
import { useAuthorization } from "@/hooks/use-authorization"
import { cn } from "@/lib/utils"

const DeleteConfirmationDialog = ({ ad, onDeleted }: { ad: Ad, onDeleted: () => void }) => {
    const [isOpen, setIsOpen] = useState(false)
    const { toast } = useToast()
    const { hasPermission } = useAuthorization()

    const handleDelete = async () => {
        if (!hasPermission('manage_ads')) {
            toast({ variant: "destructive", title: "অনুমতি নেই", description: "আপনার এই বিজ্ঞাপনটি ডিলিট করার অনুমতি নেই।" });
            return;
        }

        const result = await deleteAdAction(ad.id)
        if (result.success) {
            toast({ title: "সফল", description: result.message })
            onDeleted()
        } else {
            toast({ variant: "destructive", title: "ব্যর্থ", description: result.message })
        }
        setIsOpen(false)
    }

    if (!hasPermission('manage_ads')) return null;

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
                        এই কাজটি আনডু করা যাবে না। এটি স্থায়ীভাবে বিজ্ঞাপনটি ডিলিট করে দেবে।
                        <br />
                        <strong className="mt-2 block">"{ad.name}"</strong>
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

export const columns: ColumnDef<Ad>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        বিজ্ঞাপনের নাম
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "type",
    header: "ধরন",
    cell: ({ row }) => <Badge variant="outline" className="capitalize">{row.getValue("type")}</Badge>
  },
  {
    accessorKey: "placement",
    header: "স্থান",
  },
  {
    accessorKey: "isActive",
    header: "স্ট্যাটাস",
    cell: ({ row }) => {
      const isActive = row.getValue("isActive");
      return (
        <Badge variant={isActive ? "default" : "secondary"} className={cn(isActive ? "bg-green-600 hover:bg-green-700" : "bg-muted-foreground", "text-white")}>
            {isActive ? (
                <CheckCircle className="mr-1 h-3 w-3" />
            ) : (
                <XCircle className="mr-1 h-3 w-3" />
            )}
            {isActive ? 'সক্রিয়' : 'নিষ্ক্রিয়'}
        </Badge>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const ad = row.original
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
            <DropdownMenuSeparator />
            {hasPermission('manage_ads') && (
                <DropdownMenuItem asChild>
                    <Link href={`/admin/ads/edit/${ad.id}`}>এডিট করুন</Link>
                </DropdownMenuItem>
            )}
            <DeleteConfirmationDialog ad={ad} onDeleted={() => router.refresh()} />
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
