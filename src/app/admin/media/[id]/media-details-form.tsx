

'use client';

import { useState, useEffect } from 'react';
import type { Media, User, Article, Category } from '@/lib/types';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Link as LinkIcon, Copy, FileText, Image as ImageIcon, Video, Music, Pencil, Sparkles } from 'lucide-react';
import { updateMediaAction, getArticlesByMediaUrlAction, analyzeImageAction } from '@/app/actions';
import { getAllCategories } from '@/lib/api';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { bn } from 'date-fns/locale';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useRouter } from 'next/navigation';

const formSchema = z.object({
  id: z.string(),
  altText: z.string().optional(),
  caption: z.string().optional(),
  description: z.string().optional(),
  category: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

type MediaDetailsFormProps = {
    media: Media;
    uploadedBy: User | null;
};

const FileIcon = ({ mimeType, className }: { mimeType: string; className?: string }) => {
    if (mimeType.startsWith('image/')) return <ImageIcon className={className} />;
    if (mimeType.startsWith('video/')) return <Video className={className} />;
    if (mimeType.startsWith('audio/')) return <Music className={className} />;
    return <FileText className={className} />;
};

export default function MediaDetailsForm({ media, uploadedBy }: MediaDetailsFormProps) {
    const [loading, setLoading] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [usedInArticles, setUsedInArticles] = useState<Article[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const router = useRouter();
    const { toast } = useToast();

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            id: media.id,
            altText: media.altText || '',
            caption: media.caption || '',
            description: media.description || '',
            category: media.category || '__none__',
        },
    });

    useEffect(() => {
        async function fetchUsage() {
            const articles = await getArticlesByMediaUrlAction(media.url);
            setUsedInArticles(articles);
        }
        async function fetchCategories() {
            const cats = await getAllCategories();
            setCategories(cats);
        }
        fetchUsage();
        fetchCategories();
    }, [media.url]);

    const handleAnalyzeImage = async () => {
        setIsAnalyzing(true);
        const result = await analyzeImageAction(media.id, media.url);
        setIsAnalyzing(false);

        if (result.success && result.updatedMedia) {
            form.reset({
                id: result.updatedMedia.id,
                altText: result.updatedMedia.altText || '',
                caption: result.updatedMedia.caption || '',
                description: result.updatedMedia.description || '',
                category: result.updatedMedia.category || '__none__',
            });
            toast({
                title: 'AI বিশ্লেষণ সফল',
                description: 'খালি ফিল্ডগুলো AI দ্বারা পূরণ করা হয়েছে।',
            });
             router.refresh();
        } else {
            toast({
                variant: 'destructive',
                title: 'AI বিশ্লেষণ ব্যর্থ',
                description: result.message,
            });
        }
    };


    const onSubmit = async (data: FormValues) => {
        setLoading(true);
        const finalData = {
            ...data,
            category: data.category === '__none__' ? '' : data.category,
        }
        const result = await updateMediaAction(finalData);
        setLoading(false);

        if (result.success) {
            toast({
                title: 'সফল',
                description: 'মিডিয়া সফলভাবে আপডেট হয়েছে।',
            });
        } else {
            toast({
                variant: 'destructive',
                title: 'আপডেট ব্যর্থ',
                description: result.message,
            });
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(media.url);
        toast({ title: 'কপি সফল', description: 'URL ক্লিপবোর্ডে কপি করা হয়েছে।' });
    };

    const formattedDate = format(new Date(media.uploadedAt), 'd MMMM, yyyy, h:mm a', { locale: bn });
    const fileSize = (media.size / 1024).toFixed(2); // in KB

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
                 <Card>
                    <CardHeader>
                        <div className="flex justify-between items-start">
                            <div>
                                <CardTitle className="text-2xl font-headline">মিডিয়া বিবরণ</CardTitle>
                                <CardDescription>ফাইলের বিস্তারিত তথ্য এবং সম্পাদনার অপশন।</CardDescription>
                            </div>
                            {media.mimeType.startsWith('image/') && (
                                <Button onClick={handleAnalyzeImage} disabled={isAnalyzing} variant="outline" size="sm">
                                    {isAnalyzing ? (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    ) : (
                                        <Sparkles className="mr-2 h-4 w-4" />
                                    )}
                                    AI দিয়ে তথ্য পূরণ করুন
                                </Button>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                             <div className="grid gap-2">
                                <Label htmlFor="fileName">ফাইলের নাম</Label>
                                <Input id="fileName" value={media.fileName} readOnly disabled />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="altText">বিকল্প টেক্সট (Alt Text)</Label>
                                    <Input id="altText" {...form.register('altText')} placeholder="SEO-এর জন্য ছবির বিবরণ" />
                                </div>
                                 <div className="grid gap-2">
                                    <Label htmlFor="category">ক্যাটাগরি</Label>
                                    <Controller
                                        name="category"
                                        control={form.control}
                                        render={({ field }) => (
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="ক্যাটাগরি নির্বাচন করুন" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="__none__">ক্যাটাগরি নেই</SelectItem>
                                                    {categories.map(cat => (
                                                        <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                </div>
                            </div>
                             <div className="grid gap-2">
                                <Label htmlFor="caption">ক্যাপশন</Label>
                                <Input id="caption" {...form.register('caption')} placeholder="ছবির নিচে প্রদর্শিত ক্যাপশন" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="description">বিবরণ</Label>
                                <Textarea id="description" {...form.register('description')} placeholder="মিডিয়া সম্পর্কে বিস্তারিত" />
                            </div>
                            <div className="flex justify-end gap-2 pt-4">
                                <Button type="submit" disabled={loading}>
                                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    আপডেট করুন
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                 {usedInArticles.length > 0 && (
                    <Card className="mt-6">
                        <CardHeader>
                            <CardTitle>যেখানে ব্যবহৃত হয়েছে</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="list-disc list-inside space-y-2">
                                {usedInArticles.map(article => (
                                    <li key={article.id}>
                                        <Link href={`/admin/articles/edit/${article.id}`} className="text-primary hover:underline">
                                            {article.title}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                 )}

            </div>
            <div className="lg:col-span-1 space-y-6">
                <Card>
                    <CardHeader className="p-0 relative">
                        <div className="relative aspect-video w-full bg-muted flex items-center justify-center rounded-t-lg overflow-hidden">
                            {media.mimeType.startsWith('image/') ? (
                                <Image src={media.url} alt={media.fileName} fill className="object-contain" />
                            ) : media.mimeType.startsWith('video/') ? (
                                <video src={media.url} controls className="w-full h-full" />
                            ) : media.mimeType.startsWith('audio/') ? (
                                <div className="p-4 w-full">
                                    <Music className="h-16 w-16 mx-auto text-muted-foreground" />
                                    <audio src={media.url} controls className="w-full mt-4" />
                                </div>
                            ) : (
                                <FileIcon mimeType={media.mimeType} className="h-16 w-16 text-muted-foreground" />
                            )}
                        </div>
                        {media.mimeType.startsWith('image/') && (
                             <Button asChild size="sm" className="absolute top-2 right-2">
                                <Link href={`/admin/media/edit/${media.id}`}>
                                    <Pencil className="mr-2 h-4 w-4" />
                                    Edit Image
                                </Link>
                            </Button>
                        )}
                    </CardHeader>
                    <CardContent className="p-4 space-y-3 text-sm">
                        <div className="flex items-center gap-2">
                           <Label className="w-24">ফাইল URL:</Label>
                           <div className="flex items-center gap-1 w-full">
                                <Input readOnly value={media.url} className="h-8 text-xs flex-grow" />
                                <Button size="icon" variant="ghost" className="h-8 w-8" onClick={copyToClipboard}><Copy className="h-4 w-4"/></Button>
                           </div>
                        </div>
                        <p><strong className="w-24 inline-block">MIME Type:</strong> {media.mimeType}</p>
                        <p><strong className="w-24 inline-block">সাইজ:</strong> {fileSize} KB</p>
                        {(media.width && media.height) && <p><strong className="w-24 inline-block">রেজোলিউশন:</strong> {media.width} x {media.height}</p>}
                        <p><strong className="w-24 inline-block">আপলোড করেছেন:</strong> {uploadedBy?.name || 'Unknown'}</p>
                        <p><strong className="w-24 inline-block">আপলোডের তারিখ:</strong> {formattedDate}</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
