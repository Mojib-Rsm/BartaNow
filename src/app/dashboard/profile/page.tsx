
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { User } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, User as UserIcon, Edit, Droplets, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

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

     // Listen for storage changes to sync across tabs/components
    const handleStorageChange = (event: StorageEvent) => {
        if (event.key === 'bartaNowUser') {
            const newUser = event.newValue ? JSON.parse(event.newValue) : null;
            setUser(newUser);
        }
    };
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };

  }, [router, toast]);

  if (!user) {
    // This will be handled by the layout's loader
    return null;
  }

  const userInitials = user.name.split(' ').map((n) => n[0]).join('');
  const avatarSrc = user.avatarUrl || `/user.png`;

  return (
    <Card>
        <CardHeader className="items-center text-center space-y-2">
        <Avatar className="h-24 w-24 mb-4 text-3xl">
            <AvatarImage src={avatarSrc} alt={user.name} />
            <AvatarFallback>{userInitials}</AvatarFallback>
        </Avatar>
        <CardTitle className="text-3xl font-headline">{user.name}</CardTitle>
        <CardDescription>
            <Badge variant={user.role === 'admin' ? 'destructive' : 'secondary'}>
                {user.role === 'admin' ? 'অ্যাডমিন' : 'ব্যবহারকারী'}
            </Badge>
        </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 max-w-lg mx-auto">
            {user.bio && (
                <div className="text-center text-muted-foreground p-4 bg-muted/50 rounded-md">
                    <Info className="inline-block h-4 w-4 mr-2" />
                    <p className="inline italic">{user.bio}</p>
                </div>
            )}
            <div className="flex items-center gap-4 text-muted-foreground">
                <Mail className="h-5 w-5 shrink-0" />
                <span>{user.email}</span>
            </div>
            {user.bloodGroup && (
                <div className="flex items-center gap-4 text-muted-foreground">
                    <Droplets className="h-5 w-5 shrink-0 text-red-500" />
                    <span>রক্তের গ্রুপ: {user.bloodGroup}</span>
                </div>
            )}
        </CardContent>
        <CardFooter className="pt-4 flex justify-end max-w-lg mx-auto">
            <Button variant="outline" asChild>
                <Link href="/dashboard/profile/edit">
                    <Edit className="mr-2 h-4 w-4" />
                    প্রোফাইল এডিট করুন
                </Link>
            </Button>
        </CardFooter>
    </Card>
  );
}
