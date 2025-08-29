
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
import { createContactMessageAction } from '@/app/actions';

const formSchema = z.object({
  name: z.string().min(3, "নাম কমপক্ষে ৩ অক্ষরের হতে হবে।"),
  email: z.string().email("সঠিক ইমেইল দিন।"),
  subject: z.string().optional(),
  message: z.string().min(10, "বার্তা কমপক্ষে ১০ অক্ষরের হতে হবে।"),
});

type FormValues = z.infer<typeof formSchema>;

export default function ContactForm() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
    },
  });

  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    const result = await createContactMessageAction(data);
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
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="grid gap-2">
            <Label htmlFor="name">আপনার নাম</Label>
            <Input id="name" {...form.register('name')} placeholder="আপনার পুরো নাম" />
            {form.formState.errors.name && (
            <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>
            )}
        </div>
        <div className="grid gap-2">
            <Label htmlFor="email">আপনার ইমেইল</Label>
            <Input id="email" type="email" {...form.register('email')} placeholder="your.email@example.com" />
            {form.formState.errors.email && (
            <p className="text-xs text-destructive">{form.formState.errors.email.message}</p>
            )}
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="subject">বিষয়</Label>
        <Input id="subject" {...form.register('subject')} placeholder="আপনার বার্তার বিষয়" />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="message">আপনার বার্তা</Label>
        <Textarea id="message" {...form.register('message')} placeholder="আপনার বার্তা এখানে লিখুন..." rows={6} />
        {form.formState.errors.message && (
          <p className="text-xs text-destructive">{form.formState.errors.message.message}</p>
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
                 বার্তা পাঠান
             </>
          )}
        </Button>
      </div>
    </form>
  );
}
