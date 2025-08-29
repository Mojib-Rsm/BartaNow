
'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { PlusCircle, Image as ImageIcon, Video, FileText, Search, Loader2 } from "lucide-react";
import Link from "next/link";
import { getAllMedia, getAllUsers } from "@/lib/api";
import type { Media, User } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { format } from 'date-fns';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDebouncedCallback } from 'use-debounce';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';

export default function MediaManagementPage() {
    const [allMedia, setAllMedia] = useState<Media[]>([]);
    const [filteredMedia, setFilteredMedia] = useState<Media[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    
    const [filters, setFilters] = useState({
        type: 'all',
        date: undefined as Date | undefined,
        query: '',
        author: 'all',
    });

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            const [mediaItems, userItems] = await Promise.all([getAllMedia(), getAllUsers()]);
            setAllMedia(mediaItems);
            setFilteredMedia(mediaItems);
            setUsers(userItems);
            setLoading(false);
        }
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

        if (filters.query) {
            media = media.filter(item => item.fileName.toLowerCase().includes(filters.query.toLowerCase()));
        }

        setFilteredMedia(media);
    }, 300);
    
    useEffect(() => {
        applyFilters();
    }, [filters, allMedia, applyFilters]);

    const getFileIcon = (mimeType: string) => {
        if (mimeType.startsWith('image/')) return <ImageIcon className="h-8 w-8 text-muted-foreground" />;
        if (mimeType.startsWith('video/')) return <Video className="h-8 w-8 text-muted-foreground" />;
        return <FileText className="h-8 w-8 text-muted-foreground" />;
    };

    return (
        <div className="w-full">
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
                        <SelectTrigger className="w-full sm:w-[180px]">
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
                            <Button variant="outline" className="w-full sm:w-[240px] justify-start text-left font-normal">
                                {filters.date ? format(filters.date, 'PPP') : <span>যেকোনো তারিখ</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={filters.date}
                                onSelect={(date) => setFilters(prev => ({...prev, date: date}))}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                    <Select value={filters.author} onValueChange={(value) => setFilters(prev => ({...prev, author: value}))}>
                        <SelectTrigger className="w-full sm:w-[180px]">
                            <SelectValue placeholder="লেখক" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">সব লেখক</SelectItem>
                            {users.map(user => (
                                <SelectItem key={user.id} value={user.id}>{user.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </CardContent>
            </Card>

            {loading ? (
                <div className="flex justify-center items-center py-16">
                    <Loader2 className="h-8 w-8 animate-spin" />
                </div>
            ) : filteredMedia.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {filteredMedia.map(item => (
                       <Link href={`/admin/media/${item.id}`} key={item.id}>
                            <Card className="group overflow-hidden h-full">
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
                            </Card>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 border-2 border-dashed rounded-lg">
                    <p className="text-muted-foreground">কোনো মিডিয়া খুঁজে পাওয়া যায়নি।</p>
                    <p className="text-muted-foreground text-sm">আপনার ফিল্টার পরিবর্তন করে আবার চেষ্টা করুন।</p>
                </div>
            )}
        </div>
    );
}
