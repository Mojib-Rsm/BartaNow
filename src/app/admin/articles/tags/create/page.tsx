
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
import Link from 'next/link';
import { useDebouncedCallback } from 'use-debounce';
import { translateForSlug } from '@/ai/flows/translate-for-slug';

// Placeholder for the server action
const createTagAction = async (data: any) => {
    console.log("Creating tag with:", data);
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { success: true, message: 'ট্যাগ সফলভাবে তৈরি হয়েছে।' };
};


const formSchema = z.object({
  name: z.string().min(2, "ট্যাগের নাম কমপক্ষে ২ অক্ষরের হতে হবে।"),
  slug: z.string().min(2, "Slug কমপক্ষে ২ অক্ষরের হতে হবে।").optional().or(z.literal('')),
});

type FormValues = z.infer<typeof formSchema>;

export default function TagCreateForm() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      slug: '',
    },
  });

  const debouncedSlugGeneration = useDebouncedCallback(async (name: string) => {
    if (name && !form.formState.dirtyFields.slug) {
        try {
            const { slug } = await translateForSlug(name);
            form.setValue('slug', slug, { shouldValidate: true });
        } catch (e) {
            console.error("Slug generation failed", e);
             form.setValue('slug', name.toLowerCase().replace(/\s+/g, '-'));
        }
    }
  }, 500);

  React.useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'name') {
        debouncedSlugGeneration(value.name || '');
      }
    });
    return () => subscription.unsubscribe();
  }, [form, debouncedSlugGeneration]);


  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    const result = await createTagAction(data);
    setLoading(false);

    if (result.success) {
      toast({
        title: 'সফল',
        description: 'ট্যাগ সফলভাবে তৈরি হয়েছে।',
      });
      router.push('/admin/articles/tags');
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
        <CardTitle className="text-2xl font-headline">নতুন ট্যাগ তৈরি করুন</CardTitle>
        <CardDescription>
          নতুন ট্যাগের জন্য তথ্য পূরণ করুন।
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-2">
            <Label htmlFor="name">নাম</Label>
            <Input id="name" {...form.register('name')} placeholder="যেমন: বিশ্বকাপ" />
            {form.formState.errors.name && (
              <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="slug">লিংক (URL Slug)</Label>
            <Input id="slug" {...form.register('slug')} placeholder="নাম থেকে স্বয়ংক্রিয়ভাবে তৈরি হবে"/>
            {form.formState.errors.slug && (
              <p className="text-xs text-destructive">{form.formState.errors.slug.message}</p>
            )}
          </div>
          

          <CardFooter className="flex justify-end gap-2 p-0 pt-6">
              <Button type="button" variant="ghost" asChild>
                  <Link href="/admin/articles/tags">বাতিল করুন</Link>
              </Button>
              <Button type="submit" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  ট্যাগ তৈরি করুন
              </Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
}
