

'use client';

import { useState, useEffect } from 'react';
import type { MenuItem, Category } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { PlusCircle, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { updateMenuOrderAction } from '@/app/actions';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import MenuForm from './menu-form';
import { SortableMenuItem } from './sortable-menu-item';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function MenuManager({ initialMenuItems, initialCategories }: { initialMenuItems: MenuItem[], initialCategories: Category[] }) {
    const [menuItems, setMenuItems] = useState<MenuItem[]>(initialMenuItems);
    const [categories, setCategories] = useState<Category[]>(initialCategories);
    
    const [activeItem, setActiveItem] = useState<MenuItem | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
    const { toast } = useToast();

    useEffect(() => {
        setMenuItems(initialMenuItems);
    }, [initialMenuItems]);

     useEffect(() => {
        setCategories(initialCategories);
    }, [initialCategories]);

    const handleSaveChanges = async () => {
        setIsSaving(true);
        // Here you would also save the order of categories if needed
        // For now, we only save menu items order
        const result = await updateMenuOrderAction(menuItems);
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
        const exists = menuItems.some(item => item.id === updatedItem.id);
        if (exists) {
            setMenuItems(menuItems.map(item => item.id === updatedItem.id ? updatedItem : item));
        } else {
            setMenuItems([...menuItems, updatedItem]);
        }
        setIsFormOpen(false);
        setEditingItem(null);
    };

    const handleDelete = (id: string) => {
        setMenuItems(menuItems.filter(item => item.id !== id));
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
        <Tabs defaultValue="menu-items" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="menu-items">মেন্যু আইটেম</TabsTrigger>
                <TabsTrigger value="category-order">ক্যাটাগরি ক্রম</TabsTrigger>
            </TabsList>
            <TabsContent value="menu-items">
                <div className="flex justify-between items-center my-4">
                    <h3 className="text-lg font-semibold">কাস্টম মেন্যু আইটেমসমূহ</h3>
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
                        {menuItems.map(item => (
                            <SortableMenuItem 
                                key={item.id} 
                                item={item} 
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>
                </div>
            </TabsContent>
            <TabsContent value="category-order">
                 <div className="flex justify-between items-center my-4">
                    <h3 className="text-lg font-semibold">ক্যাটাগরি ক্রম পরিবর্তন</h3>
                    <Button onClick={() => alert("ক্যাটাগরি ক্রম সংরক্ষণ ফিচার শীঘ্রই আসছে।")}>
                        <Save className="mr-2 h-4 w-4" />
                        ক্রম সংরক্ষণ করুন
                    </Button>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-4">এই ক্যাটাগরিগুলো আপনার হোমপেজ এবং অন্যান্য জায়গায় প্রদর্শিত হবে। ড্র্যাগ করে ক্রম পরিবর্তন করুন।</p>
                    <div className="space-y-2">
                        {categories.map(cat => (
                            <div key={cat.id} className="p-3 bg-background rounded-md shadow-sm flex items-center gap-3 cursor-grab">
                                <PlusCircle className="h-4 w-4 text-muted-foreground" />
                                <span>{cat.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </TabsContent>
            
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

        </Tabs>
    );
}
