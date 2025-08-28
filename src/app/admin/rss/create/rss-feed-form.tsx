
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { createRssFeedAction, updateRssFeedAction } from '@/app/actions';
import Link from 'next/link';
import type { RssFeed } from '@/lib/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const allCategories = ['রাজনীতি' , 'খেলা' , 'প্রযুক্তি' , 'বিনোদন' , 'অর্থনীতি' , 'আন্তর্জাতিক' , 'মতামত' , 'স্বাস্থ্য' , 'শিক্ষা' , 'পরিবেশ' , 'বিশেষ-কভারেজ' , 'জাতীয়' , 'ইসলামী-জীবন' , 'তথ্য-যাচাই' , 'মিম-নিউজ', 'ভিডিও' , 'সর্বশেষ' , 'সম্পাদকের-পছন্দ'];

const rssFeedSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(3, "ফিডের নাম কমপক্ষে ৩ অক্ষরের হতে হবে।"),
    url: z.string().url("অনুগ্রহ করে একটি সঠিক URL দিন।"),
    defaultCategory: z.enum(allCategories as [string, ...string[]]),
    // For simplicity, we are not building a dynamic key-value UI for categoryMap in this form
    // It can be added as a future enhancement.
});

type FormValues = z.infer<typeof rssFeedSchema>;

type RssFeedFormProps = {
    feed?: RssFeed;
};

export default function RssFeedForm({ feed }: RssFeedFormProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const isEditing = !!feed;

  const form = useForm<FormValues>({
    resolver: zodResolver(rssFeedSchema),
    defaultValues: {
      id: feed?.id || undefined,
      name: feed?.name || '',
      url: feed?.url || '',
      defaultCategory: feed?.defaultCategory || 'সর্বশেষ',
    },
  });


  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    // Add an empty categoryMap for now, as the UI doesn't support it yet
    const actionData = { ...data, categoryMap: {} };

    const action = isEditing ? updateRssFeedAction : createRssFeedAction;
    const result = await action(actionData);
    setLoading(false);

    if (result.success) {
      toast({
        title: 'সফল',
        description: result.message,
      });
      router.push('/admin/rss');
      router.refresh();
    } else {
      toast({
        variant: 'destructive',
        title: 'ব্যর্থ',
        description: result.message,
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-headline">{isEditing ? 'RSS ফিড এডিট করুন' : 'নতুন RSS ফিড যোগ করুন'}</CardTitle>
        <CardDescription>
            {isEditing ? 'ফিডের তথ্য পরিবর্তন করুন।' : 'একটি নতুন RSS ফিড যোগ করুন যেখান থেকে আর্টিকেল ইম্পোর্ট করা হবে।'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-2">
                <Label htmlFor="name">ফিডের নাম</Label>
                <Input id="name" {...form.register('name')} placeholder="যেমন: প্রথম আলো" />
                {form.formState.errors.name && (
                <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>
                )}
            </div>

            <div className="grid gap-2">
                <Label htmlFor="url">ফিডের URL</Label>
                <Input id="url" {...form.register('url')} placeholder="https://www.example.com/feed/" />
                {form.formState.errors.url && (
                <p className="text-xs text-destructive">{form.formState.errors.url.message}</p>
                )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="defaultCategory">ডিফল্ট ক্যাটাগরি</Label>
              <Select onValueChange={(value) => form.setValue('defaultCategory', value as FormValues['defaultCategory'])} defaultValue={form.getValues('defaultCategory')}>
                  <SelectTrigger id="defaultCategory">
                  <SelectValue placeholder="ক্যাটাগরি নির্বাচন করুন" />
                  </SelectTrigger>
                  <SelectContent>
                      {allCategories.map(cat => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                  </SelectContent>
              </Select>
               <p className="text-xs text-muted-foreground">
                    ফিড থেকে কোনো ক্যাটাগরি না পাওয়া গেলে আর্টিকেল এই ক্যাটাগরিতে যোগ হবে।
                </p>
                {form.formState.errors.defaultCategory && (
                  <p className="text-xs text-destructive">{form.formState.errors.defaultCategory.message}</p>
              )}
          </div>
         
          <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="ghost" asChild>
                  <Link href="/admin/rss">বাতিল করুন</Link>
              </Button>
              <Button type="submit" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isEditing ? 'আপডেট করুন' : 'তৈরি করুন'}
              </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

