
'use client';

import React, { useState, ChangeEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Upload, Sparkles } from 'lucide-react';
import { createArticleAction } from '@/app/actions';
import Link from 'next/link';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Image from 'next/image';
import RichTextEditor from '@/components/rich-text-editor';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { Textarea } from '@/components/ui/textarea';
import { generateArticleAction } from '@/app/actions';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { translateForSlug } from '@/ai/flows/translate-for-slug';
import { useDebouncedCallback } from 'use-debounce';

const formSchema = z.object({
  title: z.string().min(10, "শিরোনাম কমপক্ষে ১০ অক্ষরের হতে হবে।"),
  content: z.string().min(50, "কনটেন্ট কমপক্ষে ৫০ অক্ষরের হতে হবে।"),
  category: z.enum(['রাজনীতি' , 'খেলা' , 'প্রযুক্তি' , 'বিনোদন' , 'অর্থনীতি' , 'আন্তর্জাতিক' , 'মতামত' , 'স্বাস্থ্য' , 'শিক্ষা' , 'পরিবেশ' , 'বিশেষ-কভারেজ' , 'জাতীয়' , 'ইসলামী-জীবন' , 'তথ্য-যাচাই' , 'মিম-নিউজ', 'ভিডিও' , 'সর্বশেষ' , 'সম্পাদকের-পছন্দ']),
  imageUrl: z.string().optional().or(z.literal('')),
  publishedAt: z.date().optional(),
  publishTime: z.string().optional(),
  slug: z.string().min(3, "Slug কমপক্ষে ৩ অক্ষরের হতে হবে।"),
  tags: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

type ArticleCreateFormProps = {
    userId: string;
}

export default function ArticleCreateForm({ userId }: ArticleCreateFormProps) {
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [aiPrompt, setAiPrompt] = useState("");
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      content: '',
      category: 'সর্বশেষ',
      imageUrl: '',
      publishedAt: new Date(),
      publishTime: format(new Date(), 'HH:mm'),
      slug: '',
      tags: '',
    },
  });

  const debouncedSlugGeneration = useDebouncedCallback(async (title: string) => {
    if (title && !form.formState.dirtyFields.slug) {
        try {
            const generatedSlug = await translateForSlug(title);
            form.setValue('slug', generatedSlug);
        } catch (e) {
            console.error("Slug generation failed", e);
        }
    }
  }, 500);

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'title') {
        debouncedSlugGeneration(value.title || '');
      }
    });
    return () => subscription.unsubscribe();
  }, [form.watch, debouncedSlugGeneration, form]);


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

  const handleGenerateArticle = async () => {
    if (!aiPrompt.trim()) {
        toast({
            variant: "destructive",
            title: "প্রম্পট প্রয়োজন",
            description: "আর্টিকেল তৈরি করতে অনুগ্রহ করে একটি বিষয় বা শিরোনাম লিখুন।",
        });
        return;
    }
    setAiLoading(true);
    try {
        const result = await generateArticleAction(aiPrompt);
        if (result.success && result.article) {
            form.setValue('title', result.article.title);
            form.setValue('content', result.article.content);
            form.setValue('category', result.article.category as FormValues['category']);
            toast({
                title: "সফল",
                description: "AI আপনার জন্য একটি আর্টিকেল তৈরি করেছে।",
            });
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
            description: "AI আর্টিকেল তৈরি করতে একটি সমস্যা হয়েছে।",
        });
    }
    setAiLoading(false);
  };

  const onSubmit = async (data: FormValues) => {
    setLoading(true);

    const publishedDate = data.publishedAt || new Date();
    const [hours, minutes] = data.publishTime?.split(':').map(Number) || [0, 0];
    publishedDate.setHours(hours, minutes);

    const tagArray = data.tags?.split(',').map(tag => tag.trim()).filter(Boolean) || [];

    const finalData = { ...data, tags: tagArray, publishedAt: publishedDate.toISOString() };

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
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Card className="bg-muted/50">
            <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                    <Sparkles className="text-primary" />
                    এআই আর্টিকেল রাইটার
                </CardTitle>
                <CardDescription>
                    এখানে একটি বিষয় বা শিরোনাম লিখে দিন, এআই আপনার জন্য একটি খসড়া আর্টিকেল তৈরি করে দেবে।
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Textarea
                    placeholder="যেমন: বাংলাদেশের রাজনীতিতে নতুন মেরুকরণ"
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    disabled={aiLoading}
                />
            </CardContent>
            <CardFooter>
                 <Button type="button" onClick={handleGenerateArticle} disabled={aiLoading}>
                    {aiLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            তৈরি হচ্ছে...
                        </>
                    ) : "AI দিয়ে তৈরি করুন"}
                 </Button>
            </CardFooter>
        </Card>

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
            <RichTextEditor
                value={form.watch('content')}
                onChange={(content) => form.setValue('content', content, { shouldValidate: true, shouldDirty: true })}
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

            <div className="grid gap-2">
              <Label htmlFor="tags">ট্যাগ (কমা দিয়ে আলাদা করুন)</Label>
              <Input id="tags" {...form.register('tags')} placeholder="যেমন: নির্বাচন, বাংলাদেশ, ক্রিকেট" />
            </div>
            
            <Card className="bg-muted/30">
                <CardHeader>
                    <CardTitle className="text-base">পোস্ট শিডিউল</CardTitle>
                    <CardDescription>পোস্টটি কখন প্রকাশিত হবে তা নির্ধারণ করুন।</CardDescription>
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
                                            {field.value ? format(field.value, 'PPP', { locale: require('date-fns/locale/bn') }) : <span>একটি তারিখ নির্বাচন করুন</span>}
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
