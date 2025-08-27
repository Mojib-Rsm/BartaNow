
'use client';

import React, { useState, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { Author } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Upload } from 'lucide-react';
import { createArticleAction } from '@/app/actions';
import Link from 'next/link';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Image from 'next/image';

const formSchema = z.object({
  title: z.string().min(10, "শিরোনাম কমপক্ষে ১০ অক্ষরের হতে হবে।"),
  content: z.string().min(50, "কনটেন্ট কমপক্ষে ৫০ অক্ষরের হতে হবে।"),
  category: z.enum(['রাজনীতি' , 'খেলা' , 'প্রযুক্তি' , 'বিনোদন' , 'অর্থনীতি' , 'আন্তর্জাতিক' , 'মতামত' , 'স্বাস্থ্য' , 'শিক্ষা' , 'পরিবেশ' , 'বিশেষ-কভারেজ' , 'জাতীয়' , 'ইসলামী-জীবন' , 'তথ্য-যাচাই' , 'মিম-নিউজ', 'ভিডিও' , 'সর্বশেষ' , 'সম্পাদকের-পছন্দ']),
  imageUrl: z.string().optional().or(z.literal('')),
  authorId: z.string().min(1, "লেখক নির্বাচন করুন।"),
});


type FormValues = z.infer<typeof formSchema>;

type ArticleCreateFormProps = {
    authors: Author[];
}

export default function ArticleCreateForm({ authors }: ArticleCreateFormProps) {
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      content: '',
      category: 'সর্বশেষ',
      imageUrl: '',
      authorId: '',
    },
  });

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

  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    const result = await createArticleAction(data);
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
          নতুন আর্টিকেলের জন্য সব তথ্য পূরণ করুন।
        </CardDescription>
      </CardHeader>
      <CardContent>
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
            <Label htmlFor="content">কনটেন্ট (অনুচ্ছেদ আলাদা করতে নতুন লাইন ব্যবহার করুন)</Label>
            <Textarea id="content" {...form.register('content')} className="min-h-[200px]" />
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
                <Label htmlFor="authorId">লেখক</Label>
                <Select onValueChange={(value) => form.setValue('authorId', value)} defaultValue={form.getValues('authorId')}>
                    <SelectTrigger id="authorId">
                        <SelectValue placeholder="লেখক নির্বাচন করুন" />
                    </SelectTrigger>
                    <SelectContent>
                        {authors.map(author => (
                            <SelectItem key={author.id} value={author.id}>{author.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                 {form.formState.errors.authorId && (
                    <p className="text-xs text-destructive">{form.formState.errors.authorId.message}</p>
                )}
            </div>
          </div>
          
           <div className="grid gap-2">
            <Label htmlFor="imageUrl">অথবা ইমেজ URL দিন</Label>
            <Input id="imageUrl" {...form.register('imageUrl')} placeholder="একটি ছবি আপলোড করলে এই ফিল্ডটি উপেক্ষা করা হবে" />
            {form.formState.errors.imageUrl && (
              <p className="text-xs text-destructive">{form.formState.errors.imageUrl.message}</p>
            )}
          </div>


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
