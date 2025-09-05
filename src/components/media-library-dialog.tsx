
'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { getAllMedia } from '@/lib/api';
import type { Media } from '@/lib/types';
import { Loader2, Search } from 'lucide-react';
import Image from 'next/image';
import { ScrollArea } from './ui/scroll-area';
import { cn } from '@/lib/utils';
import { useDebouncedCallback } from 'use-debounce';

type MediaLibraryDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onSelectImage: (url: string) => void;
};

export function MediaLibraryDialog({ isOpen, onClose, onSelectImage }: MediaLibraryDialogProps) {
  const [allMedia, setAllMedia] = useState<Media[]>([]);
  const [filteredMedia, setFilteredMedia] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      async function fetchData() {
        setLoading(true);
        const mediaItems = await getAllMedia();
        const imageItems = mediaItems.filter(item => item.mimeType.startsWith('image/'));
        setAllMedia(imageItems);
        setFilteredMedia(imageItems);
        setLoading(false);
      }
      fetchData();
    }
  }, [isOpen]);
  
  const debouncedFilter = useDebouncedCallback((query: string) => {
    if (!query) {
      setFilteredMedia(allMedia);
    } else {
      setFilteredMedia(
        allMedia.filter(item => item.fileName.toLowerCase().includes(query.toLowerCase()))
      );
    }
  }, 300);
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    debouncedFilter(e.target.value);
  }

  const handleSelect = () => {
    if (selectedImage) {
      onSelectImage(selectedImage);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>মিডিয়া লাইব্রেরি</DialogTitle>
          <DialogDescription>
            আপনার আপলোড করা ছবি থেকে একটি বেছে নিন।
          </DialogDescription>
        </DialogHeader>
        <div className="relative">
             <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
             <Input 
                placeholder="ফাইলের নাম দিয়ে সার্চ করুন..." 
                className="pl-8" 
                value={searchTerm}
                onChange={handleSearchChange}
            />
        </div>
        <ScrollArea className="flex-grow border rounded-md">
            {loading ? (
                <div className="flex justify-center items-center h-full">
                    <Loader2 className="h-8 w-8 animate-spin" />
                </div>
            ) : filteredMedia.length > 0 ? (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 p-2">
                    {filteredMedia.map(item => (
                       <div 
                        key={item.id} 
                        className={cn(
                            "group relative aspect-square w-full rounded-md overflow-hidden cursor-pointer border-2 border-transparent",
                            selectedImage === item.url && "ring-2 ring-offset-2 ring-primary border-primary"
                        )}
                        onClick={() => setSelectedImage(item.url)}
                       >
                            <Image src={item.url} alt={item.fileName} fill className="object-cover" />
                            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity" />
                       </div>
                    ))}
                </div>
            ) : (
                 <div className="text-center py-16">
                    <p className="text-muted-foreground">কোনো ছবি পাওয়া যায়নি।</p>
                </div>
            )}
        </ScrollArea>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>বাতিল করুন</Button>
          <Button onClick={handleSelect} disabled={!selectedImage}>
            ছবি নির্বাচন করুন
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
