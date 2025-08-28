
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, PlusCircle, Trash2 } from 'lucide-react';
import { createPollAction, updatePollAction } from '@/app/actions';
import Link from 'next/link';
import { Textarea } from '@/components/ui/textarea';
import type { Poll } from '@/lib/types';
import { Switch } from '@/components/ui/switch';

const pollOptionSchema = z.object({
    id: z.string().optional(),
    label: z.string().min(1, "অপশন লেবেল খালি রাখা যাবে না।"),
});

const pollSchema = z.object({
  id: z.string().optional(),
  question: z.string().min(10, "প্রশ্ন কমপক্ষে ১০ অক্ষরের হতে হবে।"),
  options: z.array(pollOptionSchema).min(2, "কমপক্ষে দুটি অপশন যোগ করুন।"),
  isActive: z.boolean().default(true),
});

type FormValues = z.infer<typeof pollSchema>;

type PollFormProps = {
    poll?: Poll;
};

export default function PollForm({ poll }: PollFormProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const isEditing = !!poll;

  const form = useForm<FormValues>({
    resolver: zodResolver(pollSchema),
    defaultValues: {
      id: poll?.id || undefined,
      question: poll?.question || '',
      options: poll?.options || [{ label: '' }, { label: '' }],
      isActive: poll?.isActive ?? true,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "options"
  });

  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    const action = isEditing ? updatePollAction : createPollAction;
    const result = await action(data);
    setLoading(false);

    if (result.success) {
      toast({
        title: 'সফল',
        description: result.message,
      });
      router.push('/admin/polls');
      router.refresh();
    } else {
      toast({
        variant: 'destructive',
        title: 'ব্যর্থ',
        description: result.message,
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-headline">{isEditing ? 'জরিপ এডিট করুন' : 'নতুন জরিপ তৈরি করুন'}</CardTitle>
        <CardDescription>
          {isEditing ? 'জরিপের তথ্য পরিবর্তন করুন।' : 'একটি নতুন জনমত জরিপ তৈরি করুন।'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-2">
            <Label htmlFor="question">প্রশ্ন</Label>
            <Textarea id="question" {...form.register('question')} placeholder="আপনার জরিপের প্রশ্ন এখানে লিখুন..." />
            {form.formState.errors.question && (
              <p className="text-xs text-destructive">{form.formState.errors.question.message}</p>
            )}
          </div>

          <div>
            <Label className="mb-2 block">অপশনসমূহ</Label>
            <div className="space-y-3">
              {fields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-2">
                  <Input
                    {...form.register(`options.${index}.label`)}
                    placeholder={`অপশন ${index + 1}`}
                  />
                  {fields.length > 2 && (
                    <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
               {form.formState.errors.options && (
                <p className="text-xs text-destructive">{form.formState.errors.options.message}</p>
            )}
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => append({ label: '' })}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              অপশন যোগ করুন
            </Button>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch 
                id="isActive" 
                checked={form.watch('isActive')}
                onCheckedChange={(checked) => form.setValue('isActive', checked)}
            />
            <Label htmlFor="isActive">জরিপটি সক্রিয় থাকবে</Label>
          </div>

          <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="ghost" asChild>
                  <Link href="/admin/polls">বাতিল করুন</Link>
              </Button>
              <Button type="submit" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isEditing ? 'আপডেট করুন' : 'তৈরি করুন'}
              </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
