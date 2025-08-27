
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
import { updateUserAction } from '@/app/actions';
import Link from 'next/link';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const formSchema = z.object({
  id: z.string(),
  name: z.string().min(3, { message: "নাম কমপক্ষে ৩ অক্ষরের হতে হবে।" }),
  email: z.string().email(),
  password: z.string().min(6, { message: "নতুন পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।" }).optional().or(z.literal('')),
  avatarUrl: z.string().optional().or(z.literal('')),
  bio: z.string().max(300, { message: "বায়ো ৩০০ অক্ষরের মধ্যে হতে হবে।" }).optional(),
  bloodGroup: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function ProfileEditPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      avatarUrl: '',
      bio: '',
      bloodGroup: '',
    },
  });

  useEffect(() => {
    const storedUser = localStorage.getItem('bartaNowUser');
    if (storedUser) {
      const parsedUser: User = JSON.parse(storedUser);
      setUser(parsedUser);
      setPreviewImage(parsedUser.avatarUrl || null);
      form.reset({
        id: parsedUser.id,
        name: parsedUser.name,
        email: parsedUser.email,
        password: '',
        avatarUrl: parsedUser.avatarUrl || '',
        bio: parsedUser.bio || '',
        bloodGroup: parsedUser.bloodGroup || '',
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

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setPreviewImage(base64String);
        form.setValue('avatarUrl', base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    const result = await updateUserAction(data);
    setLoading(false);

    if (result.success && result.user) {
      localStorage.setItem('bartaNowUser', JSON.stringify(result.user));
      // Manually dispatch a storage event to notify other components (like the header)
      window.dispatchEvent(new Event('storage'));

      toast({
        title: 'সফল',
        description: 'আপনার প্রোফাইল সফলভাবে আপডেট হয়েছে।',
      });
      router.push('/dashboard/profile');
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

  const userInitials = user.name.split(' ').map((n) => n[0]).join('');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-headline">প্রোফাইল এডিট করুন</CardTitle>
        <CardDescription>
          আপনার ব্যক্তিগত তথ্য পরিবর্তন করুন।
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex flex-col items-center gap-4">
                <Avatar className="h-24 w-24 text-3xl">
                    <AvatarImage src={previewImage || `https://i.pravatar.cc/150?u=${user.id}`} alt={user.name} />
                    <AvatarFallback>{userInitials}</AvatarFallback>
                </Avatar>
                 <Input id="picture" type="file" className="hidden" onChange={handleFileChange} accept="image/*"/>
                 <Button type="button" variant="outline" asChild>
                    <Label htmlFor="picture" className="cursor-pointer">
                        <Upload className="mr-2 h-4 w-4"/>
                        ছবি পরিবর্তন করুন
                    </Label>
                 </Button>
                 {form.formState.errors.avatarUrl && (
                    <p className="text-xs text-destructive">{form.formState.errors.avatarUrl.message}</p>
                )}
            </div>

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
            <Label htmlFor="bio">বায়ো</Label>
            <Textarea
              id="bio"
              placeholder="আপনার সম্পর্কে কিছু লিখুন..."
              {...form.register('bio')}
            />
            {form.formState.errors.bio && (
              <p className="text-xs text-destructive">{form.formState.errors.bio.message}</p>
            )}
          </div>
           <div className="grid gap-2">
            <Label htmlFor="bloodGroup">রক্তের গ্রুপ</Label>
            <Select onValueChange={(value) => form.setValue('bloodGroup', value)} defaultValue={form.getValues('bloodGroup')}>
                <SelectTrigger id="bloodGroup">
                  <SelectValue placeholder="রক্তের গ্রুপ নির্বাচন করুন" />
                </SelectTrigger>
                <SelectContent>
                  {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(group => (
                      <SelectItem key={group} value={group}>{group}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
                  <Link href="/dashboard/profile">বাতিল করুন</Link>
              </Button>
              <Button type="submit" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  আপডেট করুন
              </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
