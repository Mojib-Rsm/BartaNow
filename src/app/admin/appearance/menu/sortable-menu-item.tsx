
'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent } from '@/components/ui/card';
import { GripVertical, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { MenuItem } from '@/lib/types';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useToast } from '@/hooks/use-toast';
import { deleteMenuItemAction } from '@/app/actions';
import { useState } from 'react';

type SortableMenuItemProps = {
    item: MenuItem;
    onEdit: (item: MenuItem) => void;
    onDelete: (id: string) => void;
};

export function SortableMenuItem({ item, onEdit, onDelete }: SortableMenuItemProps) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: item.id });
    const { toast } = useToast();
    const [isDeleting, setIsDeleting] = useState(false);

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };
    
    const handleDelete = async () => {
        setIsDeleting(true);
        const result = await deleteMenuItemAction(item.id);
        if (result.success) {
            toast({ title: "সফল", description: result.message });
            onDelete(item.id);
        } else {
             toast({ variant: "destructive", title: "ব্যর্থ", description: result.message });
        }
        setIsDeleting(false);
    }

    return (
        <Card ref={setNodeRef} style={style} className="bg-background">
            <CardContent className="p-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="cursor-grab" {...attributes} {...listeners}>
                        <GripVertical className="h-5 w-5 text-muted-foreground" />
                    </Button>
                    <div>
                        <p className="font-semibold">{item.name}</p>
                        <p className="text-xs text-muted-foreground">{item.href}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => onEdit(item)}>
                        <Pencil className="h-4 w-4" />
                    </Button>
                     <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>আপনি কি নিশ্চিত?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    এই কাজটি আনডু করা যাবে না। এটি স্থায়ীভাবে মেন্যু আইটেমটি ডিলিট করে দেবে।
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>বাতিল</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDelete} disabled={isDeleting} className="bg-destructive hover:bg-destructive/90">
                                    {isDeleting ? 'ডিলিট হচ্ছে...' : 'ডিলিট করুন'}
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </CardContent>
        </Card>
    );
}
