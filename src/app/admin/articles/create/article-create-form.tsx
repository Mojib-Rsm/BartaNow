
'use client';

import React, { useState, ChangeEvent, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Upload, BrainCircuit, Lightbulb, Sparkles } from 'lucide-react';
import { createArticleAction, rankHeadlineAction, suggestTagsAction } from '@/app/actions';
import Link from 'next/link';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Image from 'next/image';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format, isFuture } from 'date-fns';
import { bn } from 'date-fns/locale';
import { Textarea } from '@/components/ui/textarea';
import { translateForSlug } from '@/ai/flows/translate-for-slug';
import { useDebouncedCallback } from 'use-debounce';
import type { Article } from '@/lib/types';
import { Progress } from '@/components/ui/progress';


const formSchema = z.object({
  title: z.string().min(10, "শিরোনাম কমপক্ষে ১০ অক্ষরের হতে হবে।"),
  englishTitle: z.string().optional(),
  content: z.string().min(50, "কনটেন্ট কমপক্ষে ৫০ অক্ষরের হতে হবে।"),
  category: z.enum(['রাজনীতি' , 'খেলা' , 'প্রযুক্তি' , 'বিনোদন' , 'অর্থনীতি' , 'আন্তর্জাতিক' , 'মতামত' , 'স্বাস্থ্য' , 'শিক্ষা' , 'পরিবেশ' , 'বিশেষ-কভারেজ' , 'জাতীয়' , 'ইসলামী-জীবন' , 'তথ্য-যাচাই' , 'মিম-নিউজ', 'ভিডিও' , 'সর্বশেষ' , 'সম্পাদকের-পছন্দ']),
  imageUrl: z.string().optional().or(z.literal('')),
  publishedAt: z.date().optional(),
  publishTime: z.string().optional(),
  slug: z.string().min(3, "Slug কমপক্ষে ৩ অক্ষরের হতে হবে।"),
  tags: z.string().optional(),
  focusKeywords: z.string().optional(),
  status: z.enum(['Draft', 'Pending Review', 'Published']),
  isAiGenerated: z.boolean().optional(),
});

type FormValues = z.infer<typeof formSchema>;

type ArticleCreateFormProps = {
    userId: string;
}

export default function ArticleCreateForm({ userId }: ArticleCreateFormProps) {
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isSuggestingTags, setIsSuggestingTags] = useState(false);
  const [headlineRanking, setHeadlineRanking] = useState<{ score: number; feedback: string } | null>(null);
  const [isRanking, setIsRanking] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const searchParams = useSearchParams();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: searchParams.get('title') || '',
      englishTitle: '',
      content: searchParams.get('content') || '',
      category: (searchParams.get('category') as FormValues['category']) || 'সর্বশেষ',
      imageUrl: '',
      publishedAt: searchParams.get('publishedAt') ? new Date(searchParams.get('publishedAt')!) : new Date(),
      publishTime: searchParams.get('publishedAt') ? format(new Date(searchParams.get('publishedAt')!), 'HH:mm') : format(new Date(), 'HH:mm'),
      slug: searchParams.get('slug') || '',
      tags: '',
      focusKeywords: '',
      status: (searchParams.get('status') as FormValues['status']) || 'Draft',
      isAiGenerated: searchParams.get('isAiGenerated') === 'true',
    },
  });

  const debouncedSlugGeneration = useDebouncedCallback(async (title: string) => {
    if (title && !form.formState.dirtyFields.slug && !form.formState.dirtyFields.englishTitle) {
        try {
            const { slug, englishTitle } = await translateForSlug(title);
            if (slug) form.setValue('slug', slug, { shouldValidate: true });
            if (englishTitle) form.setValue('englishTitle', englishTitle);
        } catch (e) {
            console.error("Slug generation failed", e);
        }
    }
  }, 1000);

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'title' && !searchParams.get('title')) { // Only auto-generate if not pre-filled
        debouncedSlugGeneration(value.title || '');
      }
    });
    return () => subscription.unsubscribe();
  }, [form, debouncedSlugGeneration, searchParams]);


  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setPreviewImage(base64String);
        form.setValue('imageUrl', base64String);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleGenerateTags = async () => {
    const content = form.getValues('content');
    if (!content || content.length < 50) {
        toast({ variant: "destructive", title: "কনটেন্ট প্রয়োজন", description: "AI ট্যাগ তৈরি করার জন্য কমপক্ষে ৫০ অক্ষরের কনটেন্ট প্রয়োজন।" });
        return;
    }
    setIsSuggestingTags(true);
    try {
      const result = await suggestTagsAction(content);
      if (result.success && result.tags) {
        form.setValue('tags', result.tags.join(', '));
        form.setValue('focusKeywords', result.tags.slice(0, 2).join(', '));
        toast({ title: "সফল", description: "AI আপনার জন্য ট্যাগ ও ফোকাস কিওয়ার্ড তৈরি করেছে।" });
      } else {
        toast({ variant: "destructive", title: "ব্যর্থ", description: result.message });
      }
    } catch (error) {
        toast({ variant: "destructive", title: "ত্রুটি", description: "AI ট্যাগ তৈরি করতে একটি সমস্যা হয়েছে।" });
    }
    setIsSuggestingTags(false);
  };
  
  const handleRankHeadline = async () => {
    const title = form.getValues('title');
    if (!title.trim() || title.length < 10) {
      toast({
        variant: "destructive",
        title: "শিরোনাম প্রয়োজন",
        description: "রেটিং করার জন্য অনুগ্রহ করে কমপক্ষে ১০ অক্ষরের একটি শিরোনাম লিখুন।",
      });
      return;
    }
    setIsRanking(true);
    setHeadlineRanking(null);
    try {
      const result = await rankHeadlineAction(title);
      if (result.success && result.ranking) {
        setHeadlineRanking(result.ranking);
      } else {
        toast({
          variant: "destructive",
          title: "ব্যর্থ",
          description: result.message,
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "ত্রুটি",
        description: "AI রেটিং আনতে একটি সমস্যা হয়েছে।",
      });
    }
    setIsRanking(false);
  };

  const onSubmit = async (data: FormValues) => {
    setLoading(true);

    const publishedDate = data.publishedAt || new Date();
    const [hours, minutes] = data.publishTime?.split(':').map(Number) || [0, 0];
    publishedDate.setHours(hours, minutes);

    const tagArray = data.tags?.split(',').map(tag => tag.trim()).filter(Boolean) || [];
    const keywordsArray = data.focusKeywords?.split(',').map(kw => kw.trim()).filter(Boolean) || [];
    
    const status = isFuture(publishedDate) && data.status === 'Published' ? 'Scheduled' : data.status;

    const finalData = { ...data, tags: tagArray, focusKeywords: keywordsArray, publishedAt: publishedDate.toISOString(), status };

    const result = await createArticleAction({ ...finalData, userId });
    setLoading(false);

    if (result.success) {
      toast({
        title: 'সফল',
        description: 'আর্টিকেল সফলভাবে তৈরি হয়েছে।',
      });
      router.push('/admin/articles');
      router.refresh();
    } else {
      toast({
        variant: 'destructive',
        title: 'তৈরি ব্যর্থ',
        description: result.message,
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-headline">নতুন আর্টিকেল তৈরি করুন</CardTitle>
        <CardDescription>
          নতুন আর্টিকেলের জন্য সব তথ্য পূরণ করুন। লেখক হিসেবে আপনাকে স্বয়ংক্রিয়ভাবে নির্বাচন করা হবে।
          <br/>
          আপনি চাইলে <Link href="/admin/ai-writer" className="text-primary hover:underline">AI কনটেন্ট রাইটার</Link> ব্যবহার করে একটি খসড়া তৈরি করতে পারেন।
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

          <div className="flex flex-col items-center gap-4">
              {previewImage && (
                <div className="relative w-full max-w-sm aspect-video rounded-md overflow-hidden border">
                    <Image src={previewImage} alt="Article preview" fill className="object-cover" />
                </div>
              )}
                 <Input id="picture" type="file" className="hidden" onChange={handleFileChange} accept="image/*"/>
                 <Button type="button" variant="outline" asChild>
                    <Label htmlFor="picture" className="cursor-pointer">
                        <Upload className="mr-2 h-4 w-4"/>
                        ছবি আপলোড করুন
                    </Label>
                 </Button>
            </div>

            <div className="grid gap-2">
                <Label htmlFor="title">শিরোনাম</Label>
                <Input id="title" {...form.register('title')} />
                {form.formState.errors.title && (
                <p className="text-xs text-destructive">{form.formState.errors.title.message}</p>
                )}
                <div className="flex items-start gap-4 mt-2">
                    <Button type="button" size="sm" variant="outline" onClick={handleRankHeadline} disabled={isRanking}>
                      <BrainCircuit className="mr-2 h-4 w-4" />
                      {isRanking ? "রেটিং হচ্ছে..." : "AI দিয়ে রেটিং করুন"}
                    </Button>
                    {headlineRanking && (
                      <div className="w-full">
                          <div className="flex justify-between items-center mb-1">
                              <Label className="text-sm font-bold">হেডলাইন স্কোর: {headlineRanking.score}/১০০</Label>
                          </div>
                           <Progress value={headlineRanking.score} className="h-2" />
                          <p className="text-xs text-muted-foreground mt-1">{headlineRanking.feedback}</p>
                      </div>
                    )}
                </div>
            </div>

             <div className="grid gap-2">
                <Label htmlFor="englishTitle">ইংরেজি শিরোনাম (ঐচ্ছিক)</Label>
                <Input id="englishTitle" {...form.register('englishTitle')} placeholder="English Title for SEO" />
            </div>

          <div className="grid gap-2">
            <Label htmlFor="slug">লিংক (URL Slug)</Label>
            <Input id="slug" {...form.register('slug')} />
            {form.formState.errors.slug && (
              <p className="text-xs text-destructive">{form.formState.errors.slug.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="content">কনটেন্ট</Label>
            <Textarea
                id="content"
                rows={15}
                {...form.register('content')}
            />
             {form.formState.errors.content && (
              <p className="text-xs text-destructive">{form.formState.errors.content.message}</p>
            )}
          </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="grid gap-2">
                    <Label htmlFor="category">ক্যাটাগরি</Label>
                    <Select onValueChange={(value) => form.setValue('category', value as FormValues['category'])} defaultValue={form.getValues('category')}>
                        <SelectTrigger id="category">
                        <SelectValue placeholder="ক্যাটাগরি নির্বাচন করুন" />
                        </SelectTrigger>
                        <SelectContent>
                            {['রাজনীতি' , 'খেলা' , 'প্রযুক্তি' , 'বিনোদন' , 'অর্থনীতি' , 'আন্তর্জাতিক' , 'মতামত' , 'স্বাস্থ্য' , 'শিক্ষা' , 'পরিবেশ' , 'বিশেষ-কভারেজ' , 'জাতীয়' , 'ইসলামী-জীবন' , 'তথ্য-যাচাই' , 'মিম-নিউজ', 'ভিডিও' , 'সর্বশেষ' , 'সম্পাদকের-পছন্দ'].map(cat => (
                                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                        {form.formState.errors.category && (
                        <p className="text-xs text-destructive">{form.formState.errors.category.message}</p>
                    )}
                </div>
                 <div className="grid gap-2">
                    <Label htmlFor="imageUrl">অথবা ইমেজ URL দিন</Label>
                    <Input id="imageUrl" {...form.register('imageUrl')} placeholder="একটি ছবি আপলোড করলে এই ফিল্ডটি উপেক্ষা করা হবে" />
                    {form.formState.errors.imageUrl && (
                    <p className="text-xs text-destructive">{form.formState.errors.imageUrl.message}</p>
                    )}
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="grid gap-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="tags">ট্যাগ (কমা দিয়ে আলাদা করুন)</Label>
                       <Button type="button" size="sm" variant="ghost" className="text-xs" onClick={handleGenerateTags} disabled={isSuggestingTags}>
                          <Sparkles className="mr-2 h-3 w-3" />
                          {isSuggestingTags ? 'জেনারেট হচ্ছে...' : 'AI দিয়ে ট্যাগ ও কিওয়ার্ড তৈরি'}
                       </Button>
                    </div>
                  <Input id="tags" {...form.register('tags')} placeholder="যেমন: নির্বাচন, বাংলাদেশ, ক্রিকেট" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="focusKeywords">ফোকাস কীওয়ার্ড (কমা দিয়ে আলাদা করুন)</Label>
                  <Input id="focusKeywords" {...form.register('focusKeywords')} placeholder="যেমন: নির্বাচন ২০২৪, নতুন সরকার" />
                </div>
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="grid gap-2">
                    <Label htmlFor="status">স্ট্যাটাস</Label>
                    <Controller
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <SelectTrigger id="status">
                                    <SelectValue placeholder="স্ট্যাটাস নির্বাচন করুন" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Draft">Draft</SelectItem>
                                    <SelectItem value="Pending Review">Pending Review</SelectItem>
                                    <SelectItem value="Published">Published</SelectItem>
                                </SelectContent>
                            </Select>
                        )}
                    />
                </div>
            </div>
            
            <Card className="bg-muted/30">
                <CardHeader>
                    <CardTitle className="text-base">পোস্ট শিডিউল</CardTitle>
                    <CardDescription>পোস্টটি কখন প্রকাশিত হবে তা নির্ধারণ করুন। Published স্ট্যাটাস সিলেক্ট করলে এই সময়ে পোস্টটি লাইভ হবে।</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                        <Label>প্রকাশের তারিখ</Label>
                        <Controller
                            control={form.control}
                            name="publishedAt"
                            render={({ field }) => (
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                                            {field.value ? format(field.value, 'PPP', { locale: bn }) : <span>একটি তারিখ নির্বাচন করুন</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <Calendar
                                            mode="single"
                                            selected={field.value}
                                            onSelect={field.onChange}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            )}
                        />
                    </div>
                     <div className="grid gap-2">
                        <Label htmlFor="publishTime">প্রকাশের সময়</Label>
                        <Input
                            id="publishTime"
                            type="time"
                            {...form.register('publishTime')}
                        />
                    </div>
                </CardContent>
            </Card>


          <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="ghost" asChild>
                  <Link href="/admin/articles">বাতিল করুন</Link>
              </Button>
              <Button type="submit" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  তৈরি করুন
              </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
