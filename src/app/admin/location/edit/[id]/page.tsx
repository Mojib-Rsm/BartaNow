
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
import { updateLocationAction } from '@/app/actions';
import Link from 'next/link';
import type { Location } from '@/lib/types';
import { getLocationById } from '@/lib/api';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

const locationSchema = z.object({
  id: z.string(),
  name: z.string().min(2, "লোকেশন নাম কমপক্ষে ২ অক্ষরের হতে হবে।"),
  type: z.enum(['বিভাগ', 'জেলা', 'শহর']),
  slug: z.string().min(2, "Slug কমপক্ষে ২ অক্ষরের হতে হবে।"),
});

type FormValues = z.infer<typeof locationSchema>;

type PageProps = {
    params: { id: string }
}

export default function LocationEditForm({ params }: PageProps) {
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState<Location | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(locationSchema),
    defaultValues: {
      id: '',
      name: '',
      slug: '',
      type: 'জেলা',
    },
  });

  useEffect(() => {
    async function fetchLocation(id: string) {
        const data = await getLocationById(id);
        if (data) {
            setLocation(data);
            form.reset(data);
        } else {
            toast({ variant: 'destructive', title: 'ত্রুটি', description: 'লোকেশনটি খুঁজে পাওয়া যায়নি।' });
            router.push('/admin/location');
        }
    }
    fetchLocation(params.id);
  }, [params.id, form, router, toast]);


  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    const result = await updateLocationAction(data);
    setLoading(false);

    if (result.success) {
      toast({
        title: 'সফল',
        description: 'লোকেশন সফলভাবে আপডেট হয়েছে।',
      });
      router.push('/admin/location');
      router.refresh();
    } else {
      toast({
        variant: 'destructive',
        title: 'আপডেট ব্যর্থ',
        description: result.message,
      });
    }
  };
  
  if (!location) {
      return <div className="flex justify-center items-center h-full"><Loader2 className="h-8 w-8 animate-spin"/></div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-headline">লোকেশন এডিট করুন</CardTitle>
        <CardDescription>
          লোকেশনটির তথ্য পরিবর্তন করুন।
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
            <Input id="slug" {...form.register('slug')} />
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
                  আপডেট করুন
              </Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
}
