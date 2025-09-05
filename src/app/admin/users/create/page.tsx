
'use client';

import { useEffect, useState, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { User } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Upload } from 'lucide-react';
import { createUserAction } from '@/app/actions';
import Link from 'next/link';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuthorization } from '@/hooks/use-authorization';

const formSchema = z.object({
  name: z.string().min(3, { message: "নাম কমপক্ষে ৩ অক্ষরের হতে হবে।" }),
  email: z.string().email("সঠিক ইমেইল দিন।"),
  password: z.string().min(6, { message: "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।" }),
  role: z.enum(['admin', 'editor', 'reporter', 'user']),
});

type FormValues = z.infer<typeof formSchema>;


export default function UserCreatePage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { hasPermission } = useAuthorization();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: 'user',
    },
  });

  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    // In a real app, this would be a separate action. Reusing signup for simplicity.
    const result = await signupAction(data); 
    setLoading(false);

    if (result.success) {
      toast({
        title: 'সফল',
        description: 'ব্যবহারকারী সফলভাবে তৈরি হয়েছে।',
      });
      router.push('/admin/users');
    } else {
      toast({
        variant: 'destructive',
        title: 'তৈরি ব্যর্থ',
        description: result.message,
      });
    }
  };
  
  if (!hasPermission('create_user')) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>অনুমতি নেই</CardTitle>
                <CardDescription>এই পৃষ্ঠাটি দেখার জন্য আপনার অনুমতি নেই।</CardDescription>
            </CardHeader>
        </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-headline">নতুন ব্যবহারকারী যোগ করুন</CardTitle>
        <CardDescription>
          একজন নতুন ব্যবহারকারীর জন্য তথ্য পূরণ করুন এবং একটি রোল নির্ধারণ করুন।
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-2">
            <Label htmlFor="name">নাম</Label>
            <Input id="name" {...form.register('name')} placeholder="ব্যবহারকারীর পুরো নাম" />
            {form.formState.errors.name && (
              <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>
            )}
          </div>
         
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">ইমেইল</Label>
              <Input id="email" {...form.register('email')} placeholder="user@example.com" />
              {form.formState.errors.email && (
                <p className="text-xs text-destructive">{form.formState.errors.email.message}</p>
              )}
            </div>
             <div className="grid gap-2">
                <Label htmlFor="password">পাসওয়ার্ড</Label>
                <Input id="password" type="password" {...form.register('password')} placeholder="••••••••" />
                {form.formState.errors.password && (
                    <p className="text-xs text-destructive">{form.formState.errors.password.message}</p>
                )}
            </div>
          </div>

           <div className="grid gap-2">
              <Label htmlFor="role">রোল</Label>
              <Select onValueChange={(value) => form.setValue('role', value as FormValues['role'])} defaultValue={form.getValues('role')}>
                  <SelectTrigger id="role">
                      <SelectValue placeholder="রোল নির্বাচন করুন" />
                  </SelectTrigger>
                  <SelectContent>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="reporter">Reporter</SelectItem>
                      <SelectItem value="editor">Editor</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
              </Select>
          </div>
         
          <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="ghost" asChild>
                  <Link href="/admin/users">বাতিল করুন</Link>
              </Button>
              <Button type="submit" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  ব্যবহারকারী তৈরি করুন
              </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
