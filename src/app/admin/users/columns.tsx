
"use client"

import { useState } from "react"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal, Trash2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

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
import type { User } from "@/lib/types"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { deleteUserAction } from "@/app/actions"
import { useAuthorization } from "@/hooks/use-authorization"

const DeleteConfirmationDialog = ({ user, onDeleted }: { user: User, onDeleted: () => void }) => {
    const [isOpen, setIsOpen] = useState(false)
    const { toast } = useToast()
    const { hasPermission } = useAuthorization();

    const handleDelete = async () => {
        if (!hasPermission('delete_user')) {
            toast({
                variant: "destructive",
                title: "অনুমতি নেই",
                description: "আপনার এই ব্যবহারকারীকে ডিলিট করার অনুমতি নেই।",
            });
            return;
        }

        const result = await deleteUserAction(user.id)
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

    if (!hasPermission('delete_user')) return null;

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
                        এই কাজটি আনডু করা যাবে না। এটি স্থায়ীভাবে ব্যবহারকারী এবং তার সম্পর্কিত ডেটা ডিলিট করে দেবে।
                        <br />
                        <strong className="mt-2 block">{user.name} ({user.email})</strong>
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

export const columns: ColumnDef<User>[] = [
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
    cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "email",
    header: "ইমেইল",
  },
  {
    accessorKey: "role",
    header: "রোল",
    cell: ({ row }) => {
        const role = row.getValue("role") as string;
        
        const roleVariantMap: { [key: string]: 'default' | 'secondary' | 'destructive' | 'outline' } = {
            admin: 'destructive',
            editor: 'default',
            reporter: 'secondary',
            user: 'outline',
        };

        return (
            <Badge 
                variant={roleVariantMap[role] || 'outline'}
                className={cn(role === 'editor' && 'bg-blue-600 hover:bg-blue-700 text-white')}
            >
                {role.charAt(0).toUpperCase() + role.slice(1)}
            </Badge>
        )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original
      const router = useRouter()
      const { hasPermission } = useAuthorization();

      const handleLoginAsUser = () => {
        // This is a simplified way to "login as user". 
        // In a real, secure application, you'd generate a temporary, secure token.
        // For this demo, we'll just use localStorage to switch the user context.
        localStorage.setItem('bartaNowUser', JSON.stringify(user));
        window.location.href = '/dashboard';
      }

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
            {hasPermission('edit_user_profile') && (
                <DropdownMenuItem asChild>
                    <Link href={`/admin/users/edit/${user.id}`}>প্রোফাইল এডিট করুন</Link>
                </DropdownMenuItem>
            )}
            {hasPermission('login_as_user') && (
                <DropdownMenuItem onClick={handleLoginAsUser}>
                অ্যাকাউন্টে লগইন করুন
                </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            {hasPermission('block_user') && <DropdownMenuItem>ব্লক করুন</DropdownMenuItem>}
            <DeleteConfirmationDialog user={user} onDeleted={handleDeleted} />
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
