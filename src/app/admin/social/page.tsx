'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from '@/hooks/use-toast';
import { getSocialLinksAction, updateSocialLinksAction } from '@/app/actions';
import type { SocialLinks } from '@/lib/types';
import { Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';


const socialLinksSchema = z.object({
    facebook: z.string().url("অনুগ্রহ করে একটি সঠিক URL দিন।").optional().or(z.literal('')),
    twitter: z.string().url("অনুগ্রহ করে একটি সঠিক URL দিন।").optional().or(z.literal('')),
    youtube: z.string().url("অনুগ্রহ করে একটি সঠিক URL দিন।").optional().or(z.literal('')),
    instagram: z.string().url("অনুগ্রহ করে একটি সঠিক URL দিন।").optional().or(z.literal('')),
});

type FormValues = z.infer<typeof socialLinksSchema>;


const SocialFormSkeleton = () => (
    <Card>
        <CardHeader>
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-4 w-3/4 mt-2" />
        </CardHeader>
        <CardContent className="space-y-4">
            {[...Array(4)].map((_, i) => (
                <div className="space-y-2" key={i}>
                    <Skeleton className="h-4 w-1/5" />
                    <Skeleton className="h-10 w-full" />
                </div>
            ))}
        </CardContent>
        <CardContent>
            <Skeleton className="h-10 w-24" />
        </CardContent>
    </Card>
);

export default function SocialManagementPage() {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(socialLinksSchema),
    defaultValues: {
        facebook: '',
        twitter: '',
        youtube: '',
        instagram: '',
    },
  });

  useEffect(() => {
    async function fetchLinks() {
        setFetching(true);
        const links = await getSocialLinksAction();
        if (links) {
            form.reset(links);
        }
        setFetching(false);
    }
    fetchLinks();
  }, [form]);


  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    const result = await updateSocialLinksAction(data);
    setLoading(false);

    if (result.success) {
      toast({
        title: 'সফল',
        description: 'সোশ্যাল মিডিয়া লিংক সফলভাবে আপডেট হয়েছে।',
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'ব্যর্থ',
        description: result.message,
      });
    }
  };

  if (fetching) {
    return (
         <div className="w-full space-y-6">
            <div>
                <h1 className="text-3xl font-bold">সোশ্যাল মিডিয়া ম্যানেজমেন্ট</h1>
                <p className="text-muted-foreground">এখান থেকে আপনার সোশ্যাল মিডিয়া প্রোফাইল এবং শেয়ারিং অপশন পরিচালনা করুন।</p>
            </div>
            <SocialFormSkeleton />
         </div>
    )
  }

  return (
    <div className="w-full space-y-6">
      <div>
        <h1 className="text-3xl font-bold">সোশ্যাল মিডিয়া ম্যানেজমেন্ট</h1>
        <p className="text-muted-foreground">এখান থেকে আপনার সোশ্যাল মিডিয়া প্রোফাইল এবং শেয়ারিং অপশন পরিচালনা করুন।</p>
      </div>

       <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
            <CardHeader>
            <CardTitle>সোশ্যাল মিডিয়া লিংক</CardTitle>
            <CardDescription>
                আপনার সোশ্যাল মিডিয়া পেজের লিংকগুলো যোগ করুন। এগুলো সাইটের ফুটার এবং অন্যান্য জায়গায় ব্যবহৃত হবে।
            </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="facebookUrl">ফেসবুক URL</Label>
                <Input id="facebookUrl" {...form.register('facebook')} placeholder="https://facebook.com/yourpage" />
                {form.formState.errors.facebook && <p className="text-sm text-destructive">{form.formState.errors.facebook.message}</p>}
            </div>
            <div className="space-y-2">
                <Label htmlFor="twitterUrl">টুইটার (X) URL</Label>
                <Input id="twitterUrl" {...form.register('twitter')} placeholder="https://twitter.com/yourhandle" />
                 {form.formState.errors.twitter && <p className="text-sm text-destructive">{form.formState.errors.twitter.message}</p>}
            </div>
            <div className="space-y-2">
                <Label htmlFor="youtubeUrl">ইউটিউব URL</Label>
                <Input id="youtubeUrl" {...form.register('youtube')} placeholder="https://youtube.com/yourchannel" />
                 {form.formState.errors.youtube && <p className="text-sm text-destructive">{form.formState.errors.youtube.message}</p>}
            </div>
            <div className="space-y-2">
                <Label htmlFor="instagramUrl">ইনস্টাগ্রাম URL</Label>
                <Input id="instagramUrl" {...form.register('instagram')} placeholder="https://instagram.com/yourprofile" />
                 {form.formState.errors.instagram && <p className="text-sm text-destructive">{form.formState.errors.instagram.message}</p>}
            </div>
            </CardContent>
            <CardContent>
                <Button type="submit" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    সংরক্ষণ করুন
                </Button>
            </CardContent>
        </Card>
       </form>

      <div className="text-center py-16 border-2 border-dashed rounded-lg mt-8">
        <p className="text-muted-foreground">ভবিষ্যতে এখানে আরও সোশ্যাল মিডিয়া ইন্টিগ্রেশন ফিচার যোগ করা হবে।</p>
        <p className="text-muted-foreground text-sm">যেমন: অটো-পোস্টিং, সোশ্যাল ফিড ইত্যাদি।</p>
      </div>
    </div>
  )
}
