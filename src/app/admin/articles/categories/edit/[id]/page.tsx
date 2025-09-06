
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
import { updateCategoryAction } from '@/app/actions';
import Link from 'next/link';
import { Textarea } from '@/components/ui/textarea';
import type { Category } from '@/lib/types';
import { getCategoryById, getAllCategories } from '@/lib/api';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const formSchema = z.object({
  id: z.string(),
  name: z.string().min(2, "ক্যাটাগরির নাম কমপক্ষে ২ অক্ষরের হতে হবে।"),
  slug: z.string().min(2, "Slug কমপক্ষে ২ অক্ষরের হতে হবে।"),
  description: z.string().optional(),
  parentId: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

type PageProps = {
    params: { id: string }
}

export default function CategoryEditForm({ params }: PageProps) {
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState<Category | null>(null);
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: '',
      name: '',
      slug: '',
      description: '',
      parentId: '__none__',
    },
  });

  useEffect(() => {
    async function fetchData(id: string) {
        const [data, allCats] = await Promise.all([
            getCategoryById(id),
            getAllCategories()
        ]);
        
        if (data) {
            setCategory(data);
            setAllCategories(allCats.filter(c => c.id !== data.id)); // Prevent self-parenting
            form.reset({
                ...data,
                parentId: data.parentId || '__none__',
            });
        } else {
            toast({ variant: 'destructive', title: 'ত্রুটি', description: 'ক্যাটাগরিটি খুঁজে পাওয়া যায়নি।' });
            router.push('/admin/articles/categories');
        }
    }
    fetchData(params.id);
  }, [params.id, form, router, toast]);


  const onSubmit = async (data: FormValues) => {
    setLoading(true);
     const finalData = {
        ...data,
        parentId: data.parentId === '__none__' ? undefined : data.parentId,
    };
    const result = await updateCategoryAction(finalData);
    setLoading(false);

    if (result.success) {
      toast({
        title: 'সফল',
        description: 'ক্যাটাগরি সফলভাবে আপডেট হয়েছে।',
      });
      router.push('/admin/articles/categories');
      router.refresh();
    } else {
      toast({
        variant: 'destructive',
        title: 'আপডেট ব্যর্থ',
        description: result.message,
      });
    }
  };
  
  if (!category) {
      return <div className="flex justify-center items-center h-full"><Loader2 className="h-8 w-8 animate-spin"/></div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-headline">ক্যাটাগরি এডিট করুন</CardTitle>
        <CardDescription>
          ক্যাটাগরির তথ্য পরিবর্তন করুন।
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-2">
            <Label htmlFor="name">নাম</Label>
            <Input id="name" {...form.register('name')} />
            {form.formState.errors.name && (
              <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>
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
            <Label htmlFor="parentId">মূল ক্যাটাগরি (Parent)</Label>
             <Select onValueChange={(value) => form.setValue('parentId', value)} defaultValue={form.getValues('parentId')}>
                <SelectTrigger id="parentId">
                    <SelectValue placeholder="মূল ক্যাটাগরি নির্বাচন করুন" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="__none__">কোনোটিই নয় (এটি মূল ক্যাটাগরি)</SelectItem>
                    {allCategories.map(cat => (
                        <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
          </div>
          
           <div className="grid gap-2">
            <Label htmlFor="description">বিবরণ</Label>
            <Textarea id="description" {...form.register('description')} />
          </div>


          <CardFooter className="flex justify-end gap-2 p-0 pt-6">
              <Button type="button" variant="ghost" asChild>
                  <Link href="/admin/articles/categories">বাতিল করুন</Link>
              </Button>
              <Button type="submit" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  আপডেট করুন
              </Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
}
