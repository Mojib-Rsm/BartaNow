
"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal, Trash2, CheckCircle, XCircle } from "lucide-react"
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
import type { Poll } from "@/lib/types"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { deletePollAction } from "@/app/actions"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

const DeleteConfirmationDialog = ({ poll, onDeleted }: { poll: Poll, onDeleted: () => void }) => {
    const [isOpen, setIsOpen] = useState(false)
    const { toast } = useToast()

    const handleDelete = async () => {
        const result = await deletePollAction(poll.id)
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
                ডিলিট করুন
            </DropdownMenuItem>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>আপনি কি নিশ্চিত?</AlertDialogTitle>
                    <AlertDialogDescription>
                        এই কাজটি আনডু করা যাবে না। এটি স্থায়ীভাবে জরিপটি ডিলিট করে দেবে।
                        <br />
                        <strong className="mt-2 block">"{poll.question}"</strong>
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

export const columns: ColumnDef<Poll>[] = [
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
    accessorKey: "question",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          প্রশ্ন
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="font-medium line-clamp-2">{row.getValue("question")}</div>,
  },
  {
    accessorKey: "options",
    header: "অপশন",
    cell: ({ row }) => {
      const options = row.getValue("options") as { label: string }[];
      return <span>{options.length} টি</span>;
    },
  },
   {
    accessorKey: "totalVotes",
    header: "মোট ভোট",
    cell: ({ row }) => {
        const votes = row.original.options.reduce((acc, opt) => acc + (opt.votes || 0), 0);
        return <div className="text-center">{votes}</div>
    }
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
      const poll = row.original
      const router = useRouter()

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
            <DropdownMenuItem asChild>
              <Link href={`/admin/polls/edit/${poll.id}`}>এডিট করুন</Link>
            </DropdownMenuItem>
             <DropdownMenuItem>ফলাফল দেখুন</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DeleteConfirmationDialog poll={poll} onDeleted={() => router.refresh()} />
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
