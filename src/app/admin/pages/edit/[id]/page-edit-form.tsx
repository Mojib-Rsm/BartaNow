
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { Page } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { updatePageAction } from '@/app/actions';
import Link from 'next/link';
import { Textarea } from '@/components/ui/textarea';

const formSchema = z.object({
  id: z.string(),
  title: z.string().min(3, "শিরোনাম কমপক্ষে ৩ অক্ষরের হতে হবে।"),
  content: z.string().min(10, "কনটেন্ট কমপক্ষে ১০ অক্ষরের হতে হবে।"),
});

type FormValues = z.infer<typeof formSchema>;

type PageEditFormProps = {
    page: Page;
}

export default function PageEditForm({ page }: PageEditFormProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: page.id,
      title: page.title || '',
      content: page.content.join('\n\n') || '',
    },
  });

  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    const result = await updatePageAction(data);
    setLoading(false);

    if (result.success) {
      toast({
        title: 'সফল',
        description: 'পেজ সফলভাবে আপডেট হয়েছে।',
      });
      router.push('/admin/pages');
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
        <CardTitle className="text-2xl font-headline">পেজ এডিট করুন</CardTitle>
        <CardDescription>
          পেজের তথ্য পরিবর্তন করুন। লিংক (slug) পরিবর্তন করা যাবে না।
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            
          <div className="grid gap-2">
            <Label htmlFor="title">শিরোনাম</Label>
            <Input id="title" {...form.register('title')} />
            {form.formState.errors.title && (
              <p className="text-xs text-destructive">{form.formState.errors.title.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="content">কনটেন্ট (অনুচ্ছেদ আলাদা করতে নতুন লাইন ব্যবহার করুন)</Label>
            <Textarea id="content" {...form.register('content')} className="min-h-[300px]" />
             {form.formState.errors.content && (
              <p className="text-xs text-destructive">{form.formState.errors.content.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="slug">লিংক (পরিবর্তনযোগ্য নয়)</Label>
            <Input id="slug" value={`/p/${page.slug}`} readOnly disabled />
          </div>

          <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="ghost" asChild>
                  <Link href="/admin/pages">বাতিল করুন</Link>
              </Button>
              <Button type="submit" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  আপডেট করুন
              </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
