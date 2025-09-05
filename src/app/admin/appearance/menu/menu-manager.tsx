
'use client';

import { useState, useEffect } from 'react';
import type { MenuItem } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { PlusCircle, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { updateMenuOrderAction } from '@/app/actions';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import MenuForm from './menu-form';
import { SortableMenuItem } from './sortable-menu-item';

export default function MenuManager({ initialItems }: { initialItems: MenuItem[] }) {
    const [items, setItems] = useState<MenuItem[]>(initialItems);
    const [activeItem, setActiveItem] = useState<MenuItem | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
    const { toast } = useToast();

    useEffect(() => {
        setItems(initialItems);
    }, [initialItems]);

    const handleSaveChanges = async () => {
        setIsSaving(true);
        const result = await updateMenuOrderAction(items);
        setIsSaving(false);

        if (result.success) {
            toast({
                title: 'সফল',
                description: 'মেন্যুর ক্রম সফলভাবে সংরক্ষণ করা হয়েছে।',
            });
        } else {
            toast({
                variant: 'destructive',
                title: 'ব্যর্থ',
                description: result.message,
            });
        }
    };

    const handleFormSuccess = (updatedItem: MenuItem) => {
        const exists = items.some(item => item.id === updatedItem.id);
        if (exists) {
            setItems(items.map(item => item.id === updatedItem.id ? updatedItem : item));
        } else {
            setItems([...items, updatedItem]);
        }
        setIsFormOpen(false);
        setEditingItem(null);
    };

    const handleDelete = (id: string) => {
        setItems(items.filter(item => item.id !== id));
    };

    const handleEdit = (item: MenuItem) => {
        setEditingItem(item);
        setIsFormOpen(true);
    };

    const handleAddNew = () => {
        setEditingItem(null);
        setIsFormOpen(true);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">মেন্যু আইটেমসমূহ</h3>
                <div className="flex gap-2">
                    <Button onClick={handleSaveChanges} disabled={isSaving}>
                        <Save className="mr-2 h-4 w-4" />
                        {isSaving ? 'সংরক্ষণ হচ্ছে...' : 'ক্রম সংরক্ষণ করুন'}
                    </Button>
                    <Button onClick={handleAddNew}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        নতুন আইটেম যোগ করুন
                    </Button>
                </div>
            </div>

            <div className="p-4 bg-muted/50 rounded-lg">
                <div className="space-y-2">
                    {items.map(item => (
                        <SortableMenuItem 
                            key={item.id} 
                            item={item} 
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            </div>
            
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingItem ? 'মেন্যু আইটেম এডিট করুন' : 'নতুন মেন্যু আইটেম'}</DialogTitle>
                        <DialogDescription>
                            মেন্যু আইটেমের জন্য প্রয়োজনীয় তথ্য দিন।
                        </DialogDescription>
                    </DialogHeader>
                    <MenuForm 
                        item={editingItem} 
                        onSuccess={handleFormSuccess} 
                        onCancel={() => setIsFormOpen(false)} 
                    />
                </DialogContent>
            </Dialog>

        </div>
    );
}
