
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
import { getUserById } from '@/lib/api';

const formSchema = z.object({
  id: z.string(),
  name: z.string().min(3, { message: "নাম কমপক্ষে ৩ অক্ষরের হতে হবে।" }),
  email: z.string().email(),
  role: z.enum(['admin', 'editor', 'reporter', 'user']),
  avatarUrl: z.string().optional().or(z.literal('')),
  bio: z.string().max(300, { message: "বায়ো ৩০০ অক্ষরের মধ্যে হতে হবে।" }).optional(),
  bloodGroup: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

type PageProps = {
    params: {
        id: string
    }
}

export default function UserEditPage({ params }: PageProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);


  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      role: 'user',
      avatarUrl: '',
      bio: '',
      bloodGroup: '',
    },
  });

  useEffect(() => {
    const storedUser = localStorage.getItem('bartaNowUser');
    if (storedUser) {
        setLoggedInUser(JSON.parse(storedUser));
    }

    const fetchUser = async () => {
        const userId = params.id;
        if (!userId) return;

        const fetchedUser = await getUserById(userId);
        if (fetchedUser) {
            setUser(fetchedUser);
            setPreviewImage(fetchedUser.avatarUrl || null);
            form.reset({
                id: fetchedUser.id,
                name: fetchedUser.name,
                email: fetchedUser.email,
                role: fetchedUser.role,
                avatarUrl: fetchedUser.avatarUrl || '',
                bio: fetchedUser.bio || '',
                bloodGroup: fetchedUser.bloodGroup || '',
            });
        } else {
            toast({
                variant: 'destructive',
                title: 'ব্যবহারকারী পাওয়া যায়নি',
                description: 'এই ব্যবহারকারীকে খুঁজে পাওয়া যায়নি।',
            });
            router.push('/admin/users');
        }
    };
    fetchUser();
  }, [params, router, toast, form]);

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
    const result = await updateUserAction({
        id: data.id,
        name: data.name,
        avatarUrl: data.avatarUrl,
        bio: data.bio,
        bloodGroup: data.bloodGroup,
        role: data.role,
    });
    setLoading(false);

    if (result.success && result.user) {
        // If the edited user is the currently logged-in user, update localStorage
        if (loggedInUser && loggedInUser.id === result.user.id) {
            localStorage.setItem('bartaNowUser', JSON.stringify(result.user));
            window.dispatchEvent(new Event('storage')); // Notify other components
        }

      toast({
        title: 'সফল',
        description: 'ব্যবহারকারীর প্রোফাইল সফলভাবে আপডেট হয়েছে।',
      });
      router.push('/admin/users');
    } else {
      toast({
        variant: 'destructive',
        title: 'আপডেট ব্যর্থ',
        description: result.message,
      });
    }
  };

  if (!user) {
    return <div className="flex justify-center items-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  const userInitials = user.name.split(' ').map((n) => n[0]).join('');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-headline">ব্যবহারকারী এডিট করুন</CardTitle>
        <CardDescription>
          ব্যবহারকারীর তথ্য পরিবর্তন করুন।
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
            </div>

          <div className="grid gap-2">
            <Label htmlFor="name">নাম</Label>
            <Input id="name" {...form.register('name')} />
            {form.formState.errors.name && (
              <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>
            )}
          </div>
           <div className="grid gap-2">
            <Label htmlFor="bio">বায়ো</Label>
            <Textarea
              id="bio"
              placeholder="ব্যবহারকারী সম্পর্কে কিছু লিখুন..."
              {...form.register('bio')}
            />
            {form.formState.errors.bio && (
              <p className="text-xs text-destructive">{form.formState.errors.bio.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                <Label htmlFor="role">রোল</Label>
                <Select onValueChange={(value) => form.setValue('role', value as 'admin' | 'editor' | 'reporter' | 'user')} defaultValue={form.getValues('role')}>
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
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="email">ইমেইল (পরিবর্তনযোগ্য নয়)</Label>
            <Input id="email" type="email" {...form.register('email')} disabled />
          </div>
         
          <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="ghost" asChild>
                  <Link href="/admin/users">বাতিল করুন</Link>
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
