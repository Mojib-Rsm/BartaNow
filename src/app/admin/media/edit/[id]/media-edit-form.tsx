'use client';

import React, { useState, useEffect } from 'react';
import type { Media, User } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { updateMediaAction } from '@/app/actions';
import Link from 'next/link';
import Image from 'next/image';

const formSchema = z.object({
  id: z.string(),
  altText: z.string().optional(),
  caption: z.string().optional(),
  description: z.string().optional(),
  width: z.coerce.number().optional(),
  height: z.coerce.number().optional(),
});

type FormValues = z.infer<typeof formSchema>;

type MediaEditFormProps = {
    media: Media;
};

function getTransformedUrl(originalUrl: string, width?: number, height?: number): string {
    if (!width && !height) return originalUrl;
    
    // This is a basic transformation for ImageKit. 
    // It can be expanded with more options like crop, quality etc.
    const transformParts = [];
    if (width) transformParts.push(`w-${width}`);
    if (height) transformParts.push(`h-${height}`);
    
    const transformString = transformParts.join(',');

    // Check if URL already has transformations
    if (originalUrl.includes('?tr=')) {
        return `${originalUrl},${transformString}`;
    }
    return `${originalUrl}?tr=${transformString}`;
}

export default function MediaEditForm({ media }: MediaEditFormProps) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { toast } = useToast();

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            id: media.id,
            altText: media.altText || '',
            caption: media.caption || '',
            description: media.description || '',
            width: media.width || undefined,
            height: media.height || undefined,
        },
    });

    const watchedWidth = form.watch('width');
    const watchedHeight = form.watch('height');
    const previewUrl = getTransformedUrl(media.url, watchedWidth, watchedHeight);

    const onSubmit = async (data: FormValues) => {
        setLoading(true);
        const result = await updateMediaAction({ ...data, url: previewUrl });
        setLoading(false);

        if (result.success) {
            toast({
                title: 'সফল',
                description: 'মিডিয়া সফলভাবে আপডেট হয়েছে।',
            });
            router.push(`/admin/media/${media.id}`);
            router.refresh();
        } else {
            toast({
                variant: 'destructive',
                title: 'আপডেট ব্যর্থ',
                description: result.message,
            });
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-2xl font-headline">মিডিয়া এডিট করুন</CardTitle>
                <CardDescription>
                    ছবির আকার, ক্যাপশন এবং অন্যান্য বিবরণ পরিবর্তন করুন।
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1 space-y-6">
                        <div className="grid gap-2">
                            <Label htmlFor="altText">বিকল্প টেক্সট (Alt Text)</Label>
                            <Input id="altText" {...form.register('altText')} placeholder="SEO-এর জন্য ছবির বিবরণ" />
                        </div>
                         <div className="grid gap-2">
                            <Label htmlFor="caption">ক্যাপশন</Label>
                            <Input id="caption" {...form.register('caption')} placeholder="ছবির নিচে প্রদর্শিত ক্যাপশন" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="description">বিবরণ</Label>
                            <Textarea id="description" {...form.register('description')} placeholder="মিডিয়া সম্পর্কে বিস্তারিত" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="width">প্রস্থ (Width)</Label>
                                <Input id="width" type="number" {...form.register('width')} placeholder="e.g., 800" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="height">উচ্চতা (Height)</Label>
                                <Input id="height" type="number" {...form.register('height')} placeholder="e.g., 600" />
                            </div>
                        </div>
                         <div className="flex justify-start gap-2 pt-4">
                              <Button type="button" variant="ghost" asChild>
                                  <Link href={`/admin/media/${media.id}`}>বাতিল করুন</Link>
                              </Button>
                              <Button type="submit" disabled={loading}>
                                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                  আপডেট করুন
                              </Button>
                          </div>
                    </div>
                     <div className="lg:col-span-2">
                        <p className="text-sm text-center mb-2 text-muted-foreground">Image Preview</p>
                        <div className="relative w-full aspect-video bg-muted flex items-center justify-center rounded-lg overflow-hidden border">
                            <Image src={previewUrl} alt={form.getValues('altText') || media.fileName} fill className="object-contain" />
                        </div>
                     </div>
                </form>
            </CardContent>
        </Card>
    );
}
