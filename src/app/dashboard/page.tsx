
'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { Newspaper, User, Heart, MessageSquare } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { User as UserType } from '@/lib/types';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
    const [user, setUser] = useState<UserType | null>(null);
    const router = useRouter();

    useEffect(() => {
        const storedUser = localStorage.getItem('bartaNowUser');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        } else {
            router.push('/login');
        }
    }, [router]);
    
    if (!user) {
        return <div>Loading...</div>
    }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">স্বাগতম, {user.name}!</h1>
        <p className="text-muted-foreground">এখান থেকে আপনি আপনার প্রোফাইল এবং কার্যক্রম পরিচালনা করতে পারবেন।</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">পঠিত আর্টিকেল</CardTitle>
            <Newspaper className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">১২৫</div>
            <p className="text-xs text-muted-foreground">গত মাসের চেয়ে +২০.১%</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">সংরক্ষিত আর্টিকেল</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">২৩</div>
            <Link href="#" className="text-xs text-muted-foreground hover:underline">
              সব দেখুন
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">আপনার মন্তব্য</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">৫টি</div>
            <p className="text-xs text-muted-foreground">সর্বশেষ মন্তব্য ২ দিন আগে</p>
          </CardContent>
        </Card>
        <Card className="bg-primary/10 border-primary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">প্রোফাইল দেখুন</CardTitle>
            <User className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
                <Link href="/dashboard/profile" className="hover:underline">
                    আমার প্রোফাইল
                </Link>
            </div>
            <p className="text-xs text-muted-foreground">
                আপনার তথ্য আপডেট করুন
            </p>
          </CardContent>
        </Card>
      </div>
      <div>
        <h2 className="text-2xl font-bold mb-4">আপনার জন্য প্রস্তাবিত</h2>
        <p className="text-muted-foreground">
            এই ফিচারটি শীঘ্রই আসছে...
        </p>
      </div>
    </div>
  );
}
