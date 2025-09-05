
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
import { createLocationAction } from '@/app/actions';
import Link from 'next/link';
import { useDebouncedCallback } from 'use-debounce';
import { translateForSlug } from '@/ai/flows/translate-for-slug';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

const locationSchema = z.object({
  name: z.string().min(2, "লোকেশন নাম কমপক্ষে ২ অক্ষরের হতে হবে।"),
  type: z.enum(['বিভাগ', 'জেলা', 'শহর']),
  slug: z.string().min(2, "Slug কমপক্ষে ২ অক্ষরের হতে হবে।").optional().or(z.literal('')),
});

type FormValues = z.infer<typeof locationSchema>;

export default function LocationCreateForm() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(locationSchema),
    defaultValues: {
      name: '',
      slug: '',
      type: 'জেলা',
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
    const result = await createLocationAction(data);
    setLoading(false);

    if (result.success) {
      toast({
        title: 'সফল',
        description: 'লোকেশন সফলভাবে তৈরি হয়েছে।',
      });
      router.push('/admin/location');
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
        <CardTitle className="text-2xl font-headline">নতুন লোকেশন যোগ করুন</CardTitle>
        <CardDescription>
          নতুন লোকেশন (বিভাগ, জেলা, বা শহর) যোগ করুন।
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-2">
            <Label htmlFor="name">নাম</Label>
            <Input id="name" {...form.register('name')} placeholder="যেমন: ঢাকা" />
            {form.formState.errors.name && (
              <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>
            )}
          </div>
          
           <div className="grid gap-2">
            <Label htmlFor="type">ধরন</Label>
            <Select onValueChange={(value) => form.setValue('type', value as any)} defaultValue={form.getValues('type')}>
                <SelectTrigger id="type">
                    <SelectValue placeholder="ধরন নির্বাচন করুন" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="বিভাগ">বিভাগ</SelectItem>
                    <SelectItem value="জেলা">জেলা</SelectItem>
                    <SelectItem value="শহর">শহর</SelectItem>
                </SelectContent>
            </Select>
            {form.formState.errors.type && (
              <p className="text-xs text-destructive">{form.formState.errors.type.message}</p>
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
                  <Link href="/admin/location">বাতিল করুন</Link>
              </Button>
              <Button type="submit" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  তৈরি করুন
              </Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
}
