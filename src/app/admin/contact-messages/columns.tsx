
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, Trash2, Check, Circle, Trash } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { ContactMessage } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { deleteContactMessageAction, updateContactMessageAction } from "@/app/actions";
import { useRouter } from "next/navigation";
import { useAuthorization } from "@/hooks/use-authorization";
import { format } from "date-fns";
import { bn } from "date-fns/locale";
import { cn } from "@/lib/utils";

const DeleteConfirmationDialog = ({ message, onDeleted }: { message: ContactMessage, onDeleted: () => void }) => {
    const [isOpen, setIsOpen] = useState(false);
    const { toast } = useToast();
    const { hasPermission } = useAuthorization();

    const handleDelete = async () => {
        if (!hasPermission('delete_contact_message')) {
            toast({ variant: "destructive", title: "অনুমতি নেই" });
            return;
        }

        const result = await deleteContactMessageAction(message.id);
        if (result.success) {
            toast({ title: "সফল", description: result.message });
            onDeleted();
        } else {
            toast({ variant: "destructive", title: "ব্যর্থ", description: result.message });
        }
        setIsOpen(false);
    };

    if (!hasPermission('delete_contact_message')) return null;

    return (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuItem
                className="text-destructive"
                onSelect={(e) => { e.preventDefault(); setIsOpen(true); }}
            >
                <Trash className="mr-2 h-4 w-4" />
                ডিলিট করুন
            </DropdownMenuItem>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>আপনি কি নিশ্চিত?</AlertDialogTitle>
                    <AlertDialogDescription>
                        এই কাজটি আনডু করা যাবে না। এটি স্থায়ীভাবে বার্তাটি ডিলিট করে দেবে।
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
    );
};

export const columns: ColumnDef<ContactMessage>[] = [
    {
        accessorKey: "name",
        header: "প্রেরক",
        cell: ({ row }) => {
            const message = row.original;
            return (
                <div className="flex items-center gap-2">
                    {!message.isRead && (
                        <span className="h-2 w-2 rounded-full bg-primary" title="Unread"></span>
                    )}
                    <div className="font-medium">{message.name}</div>
                </div>
            )
        }
    },
    {
        accessorKey: "email",
        header: "ইমেইল",
    },
    {
        accessorKey: "subject",
        header: "বিষয়",
    },
    {
        accessorKey: "message",
        header: "বার্তা",
        cell: ({ row }) => <div className="line-clamp-1 max-w-xs">{row.getValue("message")}</div>,
    },
    {
        accessorKey: "receivedAt",
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    সময়
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const date = new Date(row.getValue("receivedAt"));
            const formatted = format(date, "d MMM, h:mm a", { locale: bn });
            return <div className="text-right font-medium">{formatted}</div>;
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const message = row.original;
            const router = useRouter();
            const { toast } = useToast();

            const handleMarkAsRead = async () => {
                const result = await updateContactMessageAction(message.id, { isRead: true });
                 if (result.success) {
                    toast({ description: 'বার্তাটি পঠিত হিসেবে চিহ্নিত করা হয়েছে।' });
                    router.refresh();
                } else {
                    toast({ variant: "destructive", title: "ব্যর্থ", description: result.message });
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
                        {!message.isRead && (
                            <DropdownMenuItem onClick={handleMarkAsRead}>
                                <Check className="mr-2 h-4 w-4" />
                                পঠিত হিসেবে চিহ্নিত করুন
                            </DropdownMenuItem>
                        )}
                        <DeleteConfirmationDialog message={message} onDeleted={() => router.refresh()} />
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
