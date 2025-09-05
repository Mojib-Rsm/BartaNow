
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
import { Textarea } from "@/components/ui/textarea"

const adSchema = z.object({
  name: z.string().min(3, "বিজ্ঞাপনের নাম কমপক্ষে ৩ অক্ষরের হতে হবে।"),
  type: z.enum(['image', 'script']),
  placement: z.string().min(1, "একটি স্থান নির্বাচন করুন।"),
  content: z.string().min(10, "কনটেন্ট কমপক্ষে ১০ অক্ষরের হতে হবে।"),
  targetUrl: z.string().url({ message: "অনুগ্রহ করে একটি সঠিক URL দিন।"}).optional().or(z.literal('')),
  isActive: z.boolean().default(true),
});

type FormValues = z.infer<typeof adSchema>;

const placementSizes: Record<string, string> = {
  header: "প্রস্তাবিত সাইজ: 728x90px",
  sidebar_top: "প্রস্তাবিত সাইজ: 300x250px",
  sidebar_bottom: "প্রস্তাবিত সাইজ: 300x600px",
  before_post: "প্রস্তাবিত সাইজ: 728x90px",
  after_post: "প্রস্তাবিত সাইজ: 728x90px অথবা 300x250px",
  in_article_1: "প্রস্তাবিত সাইজ: 300x250px",
};

export default function CreateAdPage() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(adSchema),
    defaultValues: {
      name: '',
      type: 'image',
      placement: '',
      content: '',
      targetUrl: '',
      isActive: true,
    }
  });

  const watchAdType = form.watch('type');
  const watchPlacement = form.watch('placement');

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

           <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="ad-type">বিজ্ঞাপনের ধরন</Label>
                 <Controller
                    name="type"
                    control={form.control}
                    render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger id="ad-type">
                        <SelectValue placeholder="ধরন নির্বাচন করুন" />
                        </SelectTrigger>
                        <SelectContent>
                        <SelectItem value="image">ছবি</SelectItem>
                        <SelectItem value="script">কোড/স্ক্রিপ্ট</SelectItem>
                        </SelectContent>
                    </Select>
                    )}
                />
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
                        <SelectItem value="before_post">পোস্টের শুরুতে</SelectItem>
                        <SelectItem value="after_post">পোস্টের শেষে</SelectItem>
                        <SelectItem value="in_article_1">আর্টিকেলের মধ্যে (১)</SelectItem>
                        </SelectContent>
                    </Select>
                    )}
                />
                 {placementSizes[watchPlacement] && (
                  <p className="text-xs text-muted-foreground">{placementSizes[watchPlacement]}</p>
                )}
                {form.formState.errors.placement && <p className="text-sm text-destructive">{form.formState.errors.placement.message}</p>}
            </div>
           </div>
          
          <div className="space-y-2">
            <Label htmlFor="ad-content">
                {watchAdType === 'image' ? 'ছবির URL' : 'বিজ্ঞাপনের কোড'}
            </Label>
            {watchAdType === 'image' ? (
                <Input id="ad-content" placeholder="https://example.com/ad-image.png" {...form.register('content')} />
            ) : (
                <Textarea id="ad-content" placeholder="<script>...</script> or <iframe>...</iframe>" {...form.register('content')} rows={6} />
            )}
             {form.formState.errors.content && <p className="text-sm text-destructive">{form.formState.errors.content.message}</p>}
          </div>

          {watchAdType === 'image' && (
            <div className="space-y-2">
                <Label htmlFor="ad-target">টার্গেট URL (ঐচ্ছিক)</Label>
                <Input id="ad-target" placeholder="https://example.com" {...form.register('targetUrl')} />
                {form.formState.errors.targetUrl && <p className="text-sm text-destructive">{form.formState.errors.targetUrl.message}</p>}
            </div>
          )}

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
