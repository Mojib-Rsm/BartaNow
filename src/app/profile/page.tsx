
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { User } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, User as UserIcon, Edit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const storedUser = localStorage.getItem('bartaNowUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      // Redirect to login if no user is found
      toast({
        variant: 'destructive',
        title: 'প্রবেশাধিকার নেই',
        description: 'প্রোফাইল দেখতে অনুগ্রহ করে লগইন করুন।',
      });
      router.push('/login');
    }
  }, [router, toast]);

  if (!user) {
    // This will be handled by the loading component
    return null;
  }

  const userInitials = user.name.split(' ').map((n) => n[0]).join('');

  return (
    <div className="container mx-auto max-w-2xl py-12">
      <Card>
        <CardHeader className="items-center text-center">
          <Avatar className="h-24 w-24 mb-4 text-3xl">
            <AvatarImage src={`https://i.pravatar.cc/150?u=${user.id}`} alt={user.name} />
            <AvatarFallback>{userInitials}</AvatarFallback>
          </Avatar>
          <CardTitle className="text-3xl font-headline">{user.name}</CardTitle>
          <CardDescription>
            @{user.email.split('@')[0]}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="flex items-center gap-4 text-muted-foreground">
                <UserIcon className="h-5 w-5" />
                <span>{user.role === 'admin' ? 'অ্যাডমিন' : 'ব্যবহারকারী'}</span>
            </div>
            <div className="flex items-center gap-4 text-muted-foreground">
                <Mail className="h-5 w-5" />
                <span>{user.email}</span>
            </div>
            <div className="pt-4 flex justify-end">
                <Button variant="outline">
                    <Edit className="mr-2 h-4 w-4" />
                    প্রোফাইল এডিট করুন
                </Button>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
