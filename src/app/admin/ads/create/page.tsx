

'use client';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import Link from "next/link"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useToast } from "@/hooks/use-toast"
import { createAdAction } from "@/app/actions"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Loader2 } from "lucide-react"

const adSchema = z.object({
  name: z.string().min(3, "বিজ্ঞাপনের নাম কমপক্ষে ৩ অক্ষরের হতে হবে।"),
  placement: z.string().min(1, "একটি স্থান নির্বাচন করুন।"),
  imageUrl: z.string().url("অনুগ্রহ করে একটি সঠিক URL দিন।"),
  targetUrl: z.string().url({ message: "অনুগ্রহ করে একটি সঠিক URL দিন।"}).optional().or(z.literal('')),
  isActive: z.boolean().default(true),
});

type FormValues = z.infer<typeof adSchema>;

export default function CreateAdPage() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(adSchema),
    defaultValues: {
      name: '',
      placement: '',
      imageUrl: '',
      targetUrl: '',
      isActive: true,
    }
  });

  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    const result = await createAdAction(data);
    setLoading(false);
    if (result.success) {
      toast({ title: "সফল", description: result.message });
      router.push('/admin/ads');
    } else {
      toast({ variant: 'destructive', title: "ব্যর্থ", description: result.message });
    }
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>নতুন বিজ্ঞাপন যোগ করুন</CardTitle>
        <CardDescription>
          একটি নতুন বিজ্ঞাপন স্লট তৈরি করতে নিচের তথ্যগুলো পূরণ করুন।
        </CardDescription>
      </CardHeader>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="ad-name">বিজ্ঞাপনের নাম</Label>
            <Input id="ad-name" placeholder="যেমন: হেডার ব্যানার" {...form.register('name')} />
             {form.formState.errors.name && <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="ad-placement">বিজ্ঞাপনের স্থান</Label>
             <Controller
                name="placement"
                control={form.control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger id="ad-placement">
                      <SelectValue placeholder="স্থান নির্বাচন করুন" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="header">হেডার</SelectItem>
                      <SelectItem value="sidebar_top">সাইডবার (উপরে)</SelectItem>
                      <SelectItem value="sidebar_bottom">সাইডবার (নিচে)</SelectItem>
                      <SelectItem value="in_article">আর্টিকেলের মধ্যে</SelectItem>
                    </SelectContent>
                  </Select>
                )}
             />
              {form.formState.errors.placement && <p className="text-sm text-destructive">{form.formState.errors.placement.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="ad-image">বিজ্ঞাপনের ছবি/স্ক্রিপ্ট URL</Label>
            <Input id="ad-image" placeholder="https://example.com/ad-image.png" {...form.register('imageUrl')} />
             {form.formState.errors.imageUrl && <p className="text-sm text-destructive">{form.formState.errors.imageUrl.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="ad-target">টার্গেট URL</Label>
            <Input id="ad-target" placeholder="https://example.com" {...form.register('targetUrl')} />
             {form.formState.errors.targetUrl && <p className="text-sm text-destructive">{form.formState.errors.targetUrl.message}</p>}
          </div>
          <div className="flex items-center space-x-2">
            <Controller
              name="isActive"
              control={form.control}
              render={({ field }) => (
                <Switch id="ad-active" checked={field.value} onCheckedChange={field.onChange} />
              )}
            />
            <Label htmlFor="ad-active">বিজ্ঞাপনটি সক্রিয় থাকবে</Label>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
           <Button variant="ghost" asChild type="button">
            <Link href="/admin/ads">বাতিল করুন</Link>
          </Button>
          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            সংরক্ষণ করুন
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
