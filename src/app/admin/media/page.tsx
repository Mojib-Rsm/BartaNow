
'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { PlusCircle, Image as ImageIcon, Video, FileText, Search, Loader2, Trash2, FolderMove } from "lucide-react";
import Link from "next/link";
import { getAllMedia, getAllUsers, getAllCategories } from "@/lib/api";
import type { Media, User, Category } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { format } from 'date-fns';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDebouncedCallback } from 'use-debounce';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
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
} from "@/components/ui/alert-dialog";
import { useToast } from '@/hooks/use-toast';
import { deleteMultipleMediaAction, assignCategoryToMediaAction } from '@/app/actions';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';

const DeleteConfirmationDialog = ({ selectedIds, onDeleted, onCancel }: { selectedIds: string[], onDeleted: () => void, onCancel: () => void }) => {
    const { toast } = useToast();
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        setIsDeleting(true);
        const result = await deleteMultipleMediaAction(selectedIds);
        if (result.success) {
            toast({ title: "সফল", description: result.message });
            onDeleted();
        } else {
            toast({ variant: "destructive", title: "ব্যর্থ", description: result.message });
        }
        setIsDeleting(false);
    };

    return (
        <AlertDialog open={true} onOpenChange={(isOpen) => !isOpen && onCancel()}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>আপনি কি নিশ্চিত?</AlertDialogTitle>
                    <AlertDialogDescription>
                        এই কাজটি আনডু করা যাবে না। এটি স্থায়ীভাবে {selectedIds.length} টি মিডিয়া ফাইল ডিলিট করে দেবে।
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={onCancel}>বাতিল করুন</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} disabled={isDeleting} className="bg-destructive hover:bg-destructive/90">
                        {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        ডিলিট করুন
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

const AssignCategoryDialog = ({
  selectedIds,
  categories,
  onAssigned,
  onCancel
}: {
  selectedIds: string[],
  categories: Category[],
  onAssigned: () => void,
  onCancel: () => void
}) => {
  const { toast } = useToast();
  const [isAssigning, setIsAssigning] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const handleAssignCategory = async () => {
    if (!selectedCategory) {
        toast({ variant: "destructive", title: "ত্রুটি", description: "অনুগ্রহ করে একটি ক্যাটাগরি নির্বাচন করুন।" });
        return;
    }
    setIsAssigning(true);
    const result = await assignCategoryToMediaAction(selectedIds, selectedCategory);
     if (result.success) {
        toast({ title: "সফল", description: result.message });
        onAssigned();
    } else {
        toast({ variant: "destructive", title: "ব্যর্থ", description: result.message });
    }
    setIsAssigning(false);
  }

  return (
    <Dialog open={true} onOpenChange={(isOpen) => !isOpen && onCancel()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>ক্যাটাগরি পরিবর্তন করুন</DialogTitle>
          <DialogDescription>
            নির্বাচিত {selectedIds.length} টি মিডিয়া ফাইলের জন্য একটি নতুন ক্যাটাগরি নির্বাচন করুন।
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                  <SelectValue placeholder="একটি ক্যাটাগরি নির্বাচন করুন..." />
              </SelectTrigger>
              <SelectContent>
                  {categories.map(cat => (
                      <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
                  ))}
              </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={onCancel}>বাতিল করুন</Button>
          <Button onClick={handleAssignCategory} disabled={isAssigning}>
            {isAssigning && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            ক্যাটাগরি নির্ধারণ করুন
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};


export default function MediaManagementPage() {
    const [allMedia, setAllMedia] = useState<Media[]>([]);
    const [filteredMedia, setFilteredMedia] = useState<Media[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedMedia, setSelectedMedia] = useState<Set<string>>(new Set());
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [isAssignCategoryOpen, setIsAssignCategoryOpen] = useState(false);
    
    const [filters, setFilters] = useState({
        type: 'all',
        date: undefined as Date | undefined,
        query: '',
        author: 'all',
        category: 'all',
    });

    const fetchData = async () => {
        setLoading(true);
        const [mediaItems, userItems, categoryItems] = await Promise.all([
            getAllMedia(), 
            getAllUsers(),
            getAllCategories()
        ]);
        setAllMedia(mediaItems);
        setFilteredMedia(mediaItems);
        setUsers(userItems);
        setCategories(categoryItems);
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const applyFilters = useDebouncedCallback(() => {
        let media = allMedia;

        if (filters.type !== 'all') {
            media = media.filter(item => item.mimeType.startsWith(filters.type));
        }

        if (filters.date) {
            const selectedDate = format(filters.date, 'yyyy-MM-dd');
            media = media.filter(item => format(new Date(item.uploadedAt), 'yyyy-MM-dd') === selectedDate);
        }
        
        if (filters.author !== 'all') {
            media = media.filter(item => item.uploadedBy === filters.author);
        }
        
        if (filters.category !== 'all') {
            media = media.filter(item => item.category === filters.category);
        }

        if (filters.query) {
            media = media.filter(item => item.fileName.toLowerCase().includes(filters.query.toLowerCase()));
        }

        setFilteredMedia(media);
    }, 300);
    
    useEffect(() => {
        applyFilters();
    }, [filters, allMedia, applyFilters]);

    const handleSelectMedia = (id: string, isSelected: boolean) => {
        setSelectedMedia(prev => {
            const newSet = new Set(prev);
            if (isSelected) {
                newSet.add(id);
            } else {
                newSet.delete(id);
            }
            return newSet;
        });
    };
    
    const handleSelectAll = (isChecked: boolean) => {
        if(isChecked) {
            setSelectedMedia(new Set(filteredMedia.map(m => m.id)));
        } else {
            setSelectedMedia(new Set());
        }
    }
    
    const numSelected = selectedMedia.size;
    const allVisibleSelected = numSelected > 0 && filteredMedia.every(m => selectedMedia.has(m.id));
    const someVisibleSelected = numSelected > 0 && !allVisibleSelected;


    const getFileIcon = (mimeType: string) => {
        if (mimeType.startsWith('image/')) return <ImageIcon className="h-8 w-8 text-muted-foreground" />;
        if (mimeType.startsWith('video/')) return <Video className="h-8 w-8 text-muted-foreground" />;
        return <FileText className="h-8 w-8 text-muted-foreground" />;
    };

    return (
        <div className="w-full">
            {isDeleteConfirmOpen && (
                <DeleteConfirmationDialog 
                    selectedIds={Array.from(selectedMedia)}
                    onDeleted={() => {
                        setIsDeleteConfirmOpen(false);
                        setSelectedMedia(new Set());
                        fetchData(); // Refetch data
                    }}
                    onCancel={() => setIsDeleteConfirmOpen(false)}
                />
            )}
             {isAssignCategoryOpen && (
                <AssignCategoryDialog
                    selectedIds={Array.from(selectedMedia)}
                    categories={categories}
                    onAssigned={() => {
                        setIsAssignCategoryOpen(false);
                        setSelectedMedia(new Set());
                        fetchData();
                    }}
                    onCancel={() => setIsAssignCategoryOpen(false)}
                />
            )}
            <div className="flex flex-wrap gap-4 justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold">মিডিয়া লাইব্রেরি</h1>
                    <p className="text-muted-foreground">এখান থেকে ওয়েবসাইটের সব মিডিয়া পরিচালনা করুন।</p>
                </div>
                <Button asChild>
                    <Link href="/admin/media/upload">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        নতুন মিডিয়া যোগ করুন
                    </Link>
                </Button>
            </div>
            
            <Card className="mb-6">
                <CardContent className="p-4 flex flex-wrap items-center gap-4">
                     {numSelected > 0 ? (
                        <div className="flex items-center gap-4 w-full">
                            <p className="text-sm font-medium">{numSelected} টি আইটেম নির্বাচিত</p>
                            <Button variant="outline" size="sm" onClick={() => setIsAssignCategoryOpen(true)}>
                                <FolderMove className="mr-2 h-4 w-4" />
                                ক্যাটাগরি পরিবর্তন
                            </Button>
                             <Button variant="destructive" size="sm" onClick={() => setIsDeleteConfirmOpen(true)}>
                                <Trash2 className="mr-2 h-4 w-4" />
                                ডিলিট করুন
                            </Button>
                        </div>
                    ) : (
                    <>
                        <div className="relative flex-grow min-w-[200px]">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input 
                                placeholder="ফাইলের নাম দিয়ে সার্চ করুন..." 
                                className="pl-8" 
                                value={filters.query}
                                onChange={(e) => setFilters(prev => ({ ...prev, query: e.target.value }))}
                            />
                        </div>
                        <Select value={filters.type} onValueChange={(value) => setFilters(prev => ({...prev, type: value}))}>
                            <SelectTrigger className="w-full sm:w-auto flex-grow sm:flex-grow-0 sm:w-[150px]">
                                <SelectValue placeholder="ফাইলের ধরন" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">সব ধরন</SelectItem>
                                <SelectItem value="image">ছবি</SelectItem>
                                <SelectItem value="video">ভিডিও</SelectItem>
                                <SelectItem value="application">ডকুমেন্ট</SelectItem>
                            </SelectContent>
                        </Select>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" className="w-full sm:w-auto flex-grow sm:flex-grow-0 sm:w-[200px] justify-start text-left font-normal">
                                    {filters.date ? format(filters.date, 'PPP') : <span>যেকোনো তারিখ</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={filters.date}
                                    onSelect={(date) => setFilters(prev => ({...prev, date: date as Date}))}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                        <Select value={filters.author} onValueChange={(value) => setFilters(prev => ({...prev, author: value}))}>
                            <SelectTrigger className="w-full sm:w-auto flex-grow sm:flex-grow-0 sm:w-[150px]">
                                <SelectValue placeholder="লেখক" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">সব লেখক</SelectItem>
                                {users.map(user => (
                                    <SelectItem key={user.id} value={user.id}>{user.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Select value={filters.category} onValueChange={(value) => setFilters(prev => ({...prev, category: value}))}>
                            <SelectTrigger className="w-full sm:w-auto flex-grow sm:flex-grow-0 sm:w-[150px]">
                                <SelectValue placeholder="ক্যাটাগরি" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">সব ক্যাটাগরি</SelectItem>
                                {categories.map(cat => (
                                    <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </>
                    )}
                </CardContent>
            </Card>

            {loading ? (
                <div className="flex justify-center items-center py-16">
                    <Loader2 className="h-8 w-8 animate-spin" />
                </div>
            ) : filteredMedia.length > 0 ? (
                <>
                <div className="flex items-center gap-2 mb-4">
                     <Checkbox
                        id="select-all"
                        checked={allVisibleSelected}
                        onCheckedChange={(checked) => handleSelectAll(Boolean(checked))}
                     />
                    <label htmlFor="select-all" className="text-sm font-medium">সবগুলো নির্বাচন করুন</label>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {filteredMedia.map(item => (
                       <Card key={item.id} className={cn("group overflow-hidden h-full relative", selectedMedia.has(item.id) && "ring-2 ring-primary border-primary")}>
                            <div className="absolute top-2 left-2 z-10">
                                <Checkbox 
                                    className="bg-white"
                                    checked={selectedMedia.has(item.id)} 
                                    onCheckedChange={(checked) => handleSelectMedia(item.id, Boolean(checked))}
                                />
                            </div>
                           <Link href={`/admin/media/${item.id}`} className="block h-full">
                                <CardContent className="p-0 flex flex-col h-full">
                                    <div className="relative aspect-square w-full bg-muted flex items-center justify-center">
                                        {item.mimeType.startsWith('image/') ? (
                                            <Image src={item.url} alt={item.fileName} fill className="object-cover" />
                                        ) : (
                                            getFileIcon(item.mimeType)
                                        )}
                                    </div>
                                    <div className="p-2 text-xs flex-grow flex flex-col justify-end">
                                        <p className="font-semibold truncate group-hover:text-primary">{item.fileName}</p>
                                        <p className="text-muted-foreground">{format(new Date(item.uploadedAt), 'PP')}</p>
                                    </div>
                                </CardContent>
                            </Link>
                        </Card>
                    ))}
                </div>
                </>
            ) : (
                <div className="text-center py-16 border-2 border-dashed rounded-lg">
                    <p className="text-muted-foreground">কোনো মিডিয়া খুঁজে পাওয়া যায়নি।</p>
                    <p className="text-muted-foreground text-sm">আপনার ফিল্টার পরিবর্তন করে আবার চেষ্টা করুন।</p>
                </div>
            )}
        </div>
    );
}
