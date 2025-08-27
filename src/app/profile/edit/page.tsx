
'use client';

import { useEffect, useState } from 'react';
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
import { Loader2 } from 'lucide-react';
import { updateUserAction } from '@/app/actions';
import Link from 'next/link';

const formSchema = z.object({
  id: z.string(),
  name: z.string().min(3, { message: "নাম কমপক্ষে ৩ অক্ষরের হতে হবে।" }),
  email: z.string().email(),
  password: z.string().min(6, { message: "নতুন পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।" }).optional().or(z.literal('')),
});

type FormValues = z.infer<typeof formSchema>;

export default function ProfileEditPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  useEffect(() => {
    const storedUser = localStorage.getItem('bartaNowUser');
    if (storedUser) {
      const parsedUser: User = JSON.parse(storedUser);
      setUser(parsedUser);
      form.reset({
        id: parsedUser.id,
        name: parsedUser.name,
        email: parsedUser.email,
        password: '',
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'প্রবেশাধিকার নেই',
        description: 'প্রোফাইল এডিট করতে অনুগ্রহ করে লগইন করুন।',
      });
      router.push('/login');
    }
  }, [router, toast, form]);

  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    const result = await updateUserAction(data);
    setLoading(false);

    if (result.success && result.user) {
      // Update localStorage with new user data
      localStorage.setItem('bartaNowUser', JSON.stringify(result.user));
      window.dispatchEvent(new Event('storage')); // Notify other tabs/components

      toast({
        title: 'সফল',
        description: 'আপনার প্রোফাইল সফলভাবে আপডেট হয়েছে।',
      });
      router.push('/profile');
    } else {
      toast({
        variant: 'destructive',
        title: 'আপডেট ব্যর্থ',
        description: result.message,
      });
    }
  };

  if (!user) {
    return null; // Or a loading spinner
  }

  return (
    <div className="container mx-auto max-w-2xl py-12">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-headline">প্রোফাইল এডিট করুন</CardTitle>
          <CardDescription>
            আপনার ব্যক্তিগত তথ্য পরিবর্তন করুন।
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="name">নাম</Label>
              <Input
                id="name"
                {...form.register('name')}
              />
              {form.formState.errors.name && (
                <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">ইমেইল (পরিবর্তনযোগ্য নয়)</Label>
              <Input
                id="email"
                type="email"
                {...form.register('email')}
                disabled
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">নতুন পাসওয়ার্ড</Label>
              <Input
                id="password"
                type="password"
                placeholder="পরিবর্তন করতে চাইলে নতুন পাসওয়ার্ড দিন"
                {...form.register('password')}
              />
              {form.formState.errors.password && (
                <p className="text-xs text-destructive">{form.formState.errors.password.message}</p>
              )}
            </div>
            <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="ghost" asChild>
                    <Link href="/profile">বাতিল করুন</Link>
                </Button>
                <Button type="submit" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    আপডেট করুন
                </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
