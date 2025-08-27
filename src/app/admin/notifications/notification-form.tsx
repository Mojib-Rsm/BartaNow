
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Send } from 'lucide-react';
import { sendNotificationAction } from '@/app/actions';

const formSchema = z.object({
  title: z.string().min(5, { message: 'শিরোনাম কমপক্ষে ৫ অক্ষরের হতে হবে।' }),
  body: z.string().min(10, { message: 'বার্তা কমপক্ষে ১০ অক্ষরের হতে হবে।' }),
  url: z.string().url({ message: 'অনুগ্রহ করে একটি সঠিক URL দিন।' }).optional().or(z.literal('')),
});

type FormValues = z.infer<typeof formSchema>;

export default function NotificationForm() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      body: '',
      url: '',
    },
  });

  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    const result = await sendNotificationAction(data);
    setLoading(false);

    if (result.success) {
      toast({
        title: 'সফল',
        description: result.message,
      });
      form.reset();
    } else {
      toast({
        variant: 'destructive',
        title: 'ব্যর্থ',
        description: result.message,
      });
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-lg">
      <div className="grid gap-2">
        <Label htmlFor="title">শিরোনাম</Label>
        <Input id="title" {...form.register('title')} placeholder="ব্রেকিং নিউজ: ..." />
        {form.formState.errors.title && (
          <p className="text-xs text-destructive">{form.formState.errors.title.message}</p>
        )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="body">বার্তা</Label>
        <Textarea id="body" {...form.register('body')} placeholder="বিস্তারিত এখানে লিখুন..." />
        {form.formState.errors.body && (
          <p className="text-xs text-destructive">{form.formState.errors.body.message}</p>
        )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="url">URL (ঐচ্ছিক)</Label>
        <Input id="url" {...form.register('url')} placeholder="https://bartanow.com/articles/..." />
        {form.formState.errors.url && (
          <p className="text-xs text-destructive">{form.formState.errors.url.message}</p>
        )}
      </div>

      <div className="flex justify-end pt-2">
        <Button type="submit" disabled={loading}>
          {loading ? (
            <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                পাঠানো হচ্ছে...
            </>
          ) : (
             <>
                <Send className="mr-2 h-4 w-4" />
                 পাঠান
             </>
          )}
        </Button>
      </div>
    </form>
  );
}
