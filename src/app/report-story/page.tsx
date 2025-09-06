
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Send } from 'lucide-react';
import { createArticleAction } from '@/app/actions';
import { Textarea } from '@/components/ui/textarea';
import { translateForSlug } from '@/ai/flows/translate-for-slug';
import ImageSelector from '@/components/image-selector';

const reportSchema = z.object({
  reporterName: z.string().min(3, "অনুগ্রহ করে আপনার নাম লিখুন।"),
  reporterEmail: z.string().email("অনুগ্রহ করে একটি সঠিক ইমেইল দিন।"),
  title: z.string().min(10, "শিরোনাম কমপক্ষে ১০ অক্ষরের হতে হবে।"),
  content: z.string().min(50, "ঘটনার বিবরণ কমপক্ষে ৫০ অক্ষরের হতে হবে।"),
  imageUrl: z.string().optional().or(z.literal('')),
});

type FormValues = z.infer<typeof reportSchema>;

export default function ReportStoryPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      reporterName: '',
      reporterEmail: '',
      title: '',
      content: '',
      imageUrl: '',
    },
  });

  const onSubmit = async (data: FormValues) => {
    setLoading(true);

    const { slug, englishTitle, focusKeywords } = await translateForSlug(data.title);

    const articleData = {
        title: data.title,
        content: `<p>${data.content.replace(/\n/g, '</p><p>')}</p>`, // Convert newlines to paragraphs
        category: 'বিশেষ-কভারেজ',
        slug: slug,
        englishTitle: englishTitle,
        focusKeywords: focusKeywords,
        tags: ['user-report', 'পাঠকের-খবর'],
        imageUrl: data.imageUrl,
        isReaderContribution: true,
        reporterName: data.reporterName,
        status: 'Pending Review' as const,
        userId: 'user-guest', // Assign to a generic guest user or a specific admin for review
    }
    
    const result = await createArticleAction(articleData);
    setLoading(false);

    if (result.success) {
      toast({
        title: 'আপনার খবরটি সফলভাবে জমা দেওয়া হয়েছে!',
        description: 'আমাদের সম্পাদকীয় দল আপনার খবরটি পর্যালোচনা করে দেখবে। ধন্যবাদ।',
      });
      form.reset();
      router.push('/');
    } else {
      toast({
        variant: 'destructive',
        title: 'জমা দিতে সমস্যা হয়েছে',
        description: result.message,
      });
    }
  };

  return (
    <div className="container mx-auto max-w-3xl py-12">
        <Card>
            <CardHeader className="text-center">
            <CardTitle className="text-3xl font-headline">আপনার খবর পাঠান</CardTitle>
            <CardDescription>
                আপনার এলাকার বা আপনার জানা কোনো গুরুত্বপূর্ণ ঘটনা আমাদের জানান। আপনার পাঠানো খবর আমাদের সম্পাদকীয় দল পর্যালোচনা করে প্রকাশ করবে।
            </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="reporterName">আপনার নাম</Label>
                            <Input id="reporterName" {...form.register('reporterName')} placeholder="আপনার পুরো নাম" />
                            {form.formState.errors.reporterName && <p className="text-xs text-destructive">{form.formState.errors.reporterName.message}</p>}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="reporterEmail">আপনার ইমেইল</Label>
                            <Input id="reporterEmail" type="email" {...form.register('reporterEmail')} placeholder="your.email@example.com" />
                            {form.formState.errors.reporterEmail && <p className="text-xs text-destructive">{form.formState.errors.reporterEmail.message}</p>}
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="title">খবরের শিরোনাম</Label>
                        <Input id="title" {...form.register('title')} placeholder="একটি আকর্ষণীয় শিরোনাম দিন" />
                        {form.formState.errors.title && <p className="text-xs text-destructive">{form.formState.errors.title.message}</p>}
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="content">ঘটনার বিবরণ</Label>
                        <Textarea id="content" {...form.register('content')} placeholder="ঘটনাটি বিস্তারিতভাবে বর্ণনা করুন..." rows={8} />
                        {form.formState.errors.content && <p className="text-xs text-destructive">{form.formState.errors.content.message}</p>}
                    </div>
                    <div className="grid gap-2">
                        <Label>ছবি বা ভিডিও (ঐচ্ছিক)</Label>
                        <ImageSelector onImageSelect={(url) => form.setValue('imageUrl', url)} />
                    </div>
                     <CardFooter className="p-0 pt-4">
                        <Button type="submit" disabled={loading} className="w-full">
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                জমা হচ্ছে...
                            </>
                        ) : (
                            <>
                                <Send className="mr-2 h-4 w-4" />
                                খবর জমা দিন
                            </>
                        )}
                        </Button>
                    </CardFooter>
                </form>
            </CardContent>
        </Card>
    </div>
  );
}
