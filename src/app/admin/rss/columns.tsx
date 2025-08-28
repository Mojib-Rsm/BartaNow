
"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal, Trash2 } from "lucide-react"
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
import type { RssFeed } from "@/lib/types"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { deleteRssFeedAction, triggerRssImportAction } from "@/app/actions"
import { useRouter } from "next/navigation"
import { useAuthorization } from "@/hooks/use-authorization"

const DeleteConfirmationDialog = ({ feed, onDeleted }: { feed: RssFeed, onDeleted: () => void }) => {
    const [isOpen, setIsOpen] = useState(false)
    const { toast } = useToast()
    const { hasPermission } = useAuthorization()

    const handleDelete = async () => {
        if (!hasPermission('delete_rss')) {
            toast({ variant: "destructive", title: "অনুমতি নেই", description: "আপনার এই ফিডটি ডিলিট করার অনুমতি নেই।" });
            return;
        }

        const result = await deleteRssFeedAction(feed.id)
        if (result.success) {
            toast({ title: "সফল", description: result.message })
            onDeleted()
        } else {
            toast({ variant: "destructive", title: "ব্যর্থ", description: result.message })
        }
        setIsOpen(false)
    }

    if (!hasPermission('delete_rss')) return null;

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
                        এই কাজটি আনডু করা যাবে না। এটি স্থায়ীভাবে RSS ফিডটি ডিলিট করে দেবে।
                        <br />
                        <strong className="mt-2 block">"{feed.name}"</strong>
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

export const columns: ColumnDef<RssFeed>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        ফিডের নাম
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "url",
    header: "URL",
    cell: ({ row }) => (
        <Link href={row.getValue("url")} target="_blank" className="hover:underline text-primary text-xs">
            {row.getValue("url")}
        </Link>
    ),
  },
  {
    accessorKey: "defaultCategory",
    header: "ডিফল্ট ক্যাটাগরি",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const feed = row.original
      const router = useRouter()
      const { hasPermission } = useAuthorization();
      const { toast } = useToast();
      const [isImporting, setIsImporting] = useState(false);

      const handleManualImport = async () => {
        setIsImporting(true);
        toast({ title: 'ইম্পোর্ট শুরু হয়েছে', description: `"${feed.name}" থেকে আর্টিকেল ইম্পোর্ট করা হচ্ছে...` });
        const result = await triggerRssImportAction();
        if (result.success) {
          toast({ title: 'ইম্পোর্ট সম্পন্ন', description: result.message });
        } else {
          toast({ variant: 'destructive', title: 'ইম্পোর্ট ব্যর্থ', description: result.message });
        }
        setIsImporting(false);
      };

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
            <DropdownMenuItem onSelect={handleManualImport} disabled={isImporting}>
                {isImporting ? 'ইম্পোর্ট চলছে...' : 'এখন ইম্পোর্ট করুন'}
            </DropdownMenuItem>
            {hasPermission('edit_rss') && (
                <DropdownMenuItem asChild>
                    <Link href={`/admin/rss/edit/${feed.id}`}>এডিট করুন</Link>
                </DropdownMenuItem>
            )}
            <DeleteConfirmationDialog feed={feed} onDeleted={() => router.refresh()} />
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
