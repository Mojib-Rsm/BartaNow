
'use client';

import React, { useState, useEffect } from 'react';
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
import { createCategoryAction } from '@/app/actions';
import Link from 'next/link';
import { Textarea } from '@/components/ui/textarea';
import type { Category } from '@/lib/types';
import { translateForSlug } from '@/ai/flows/translate-for-slug';
import { useDebouncedCallback } from 'use-debounce';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getAllCategories } from '@/lib/api';

const formSchema = z.object({
  name: z.string().min(2, "ক্যাটাগরির নাম কমপক্ষে ২ অক্ষরের হতে হবে।"),
  slug: z.string().min(2, "Slug কমপক্ষে ২ অক্ষরের হতে হবে।").optional().or(z.literal('')),
  description: z.string().optional(),
  parentId: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function CategoryCreateForm() {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    async function fetchCategories() {
        const allCategories = await getAllCategories();
        setCategories(allCategories);
    }
    fetchCategories();
  }, []);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      parentId: '__none__',
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
    const finalData = {
        ...data,
        parentId: data.parentId === '__none__' ? undefined : data.parentId,
    };
    const result = await createCategoryAction(finalData);
    setLoading(false);

    if (result.success) {
      toast({
        title: 'সফল',
        description: 'ক্যাটাগরি সফলভাবে তৈরি হয়েছে।',
      });
      router.push('/admin/articles/categories');
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
        <CardTitle className="text-2xl font-headline">নতুন ক্যাটাগরি তৈরি করুন</CardTitle>
        <CardDescription>
          নতুন ক্যাটাগরির জন্য তথ্য পূরণ করুন।
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-2">
            <Label htmlFor="name">নাম</Label>
            <Input id="name" {...form.register('name')} placeholder="যেমন: খেলা" />
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

          <div className="grid gap-2">
            <Label htmlFor="parentId">মূল ক্যাটাগরি (Parent)</Label>
             <Select onValueChange={(value) => form.setValue('parentId', value)} defaultValue={form.getValues('parentId')}>
                <SelectTrigger id="parentId">
                    <SelectValue placeholder="মূল ক্যাটাগরি নির্বাচন করুন" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="__none__">কোনোটিই নয় (এটি মূল ক্যাটাগরি)</SelectItem>
                    {categories.map(cat => (
                        <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
          </div>
          
           <div className="grid gap-2">
            <Label htmlFor="description">বিবরণ</Label>
            <Textarea id="description" {...form.register('description')} placeholder="ক্যাটাগরি সম্পর্কে সংক্ষিপ্ত বিবরণ (ঐচ্ছিক)" />
          </div>


          <CardFooter className="flex justify-end gap-2 p-0 pt-6">
              <Button type="button" variant="ghost" asChild>
                  <Link href="/admin/articles/categories">বাতিল করুন</Link>
              </Button>
              <Button type="submit" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  ক্যাটাগরি তৈরি করুন
              </Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
}
