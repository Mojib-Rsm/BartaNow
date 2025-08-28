
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { createPageAction } from '@/app/actions';
import Link from 'next/link';
import { Textarea } from '@/components/ui/textarea';

const formSchema = z.object({
  title: z.string().min(3, "শিরোনাম কমপক্ষে ৩ অক্ষরের হতে হবে।"),
  content: z.string().min(10, "কনটেন্ট কমপক্ষে ১০ অক্ষরের হতে হবে।"),
});


type FormValues = z.infer<typeof formSchema>;

export default function PageCreateForm() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      content: '',
    },
  });


  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    const result = await createPageAction(data);
    setLoading(false);

    if (result.success) {
      toast({
        title: 'সফল',
        description: 'পেজ সফলভাবে তৈরি হয়েছে।',
      });
      router.push('/admin/pages');
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
        <CardTitle className="text-2xl font-headline">নতুন পেজ তৈরি করুন</CardTitle>
        <CardDescription>
          পেজের শিরোনাম এবং কনটেন্ট পূরণ করুন। একটি ইউনিক লিংক (slug) স্বয়ংক্রিয়ভাবে তৈরি হবে।
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

          <div className="grid gap-2">
            <Label htmlFor="title">শিরোনাম</Label>
            <Input id="title" {...form.register('title')} placeholder="আমাদের সম্পর্কে" />
            {form.formState.errors.title && (
              <p className="text-xs text-destructive">{form.formState.errors.title.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="content">কনটেন্ট (অনুচ্ছেদ আলাদা করতে নতুন লাইন ব্যবহার করুন)</Label>
            <Textarea id="content" {...form.register('content')} className="min-h-[300px]" placeholder="আপনার পেজের কনটেন্ট এখানে লিখুন..." />
             {form.formState.errors.content && (
              <p className="text-xs text-destructive">{form.formState.errors.content.message}</p>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="ghost" asChild>
                  <Link href="/admin/pages">বাতিল করুন</Link>
              </Button>
              <Button type="submit" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  পেজ তৈরি করুন
              </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
