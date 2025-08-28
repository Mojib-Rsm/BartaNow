
'use client';

import Link from 'next/link';
import {
  LayoutDashboard,
  User,
  Settings,
  LogOut,
  Home,
  Bookmark,
  History,
  Bell,
} from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useEffect, useState } from 'react';
import type { User as UserType } from '@/lib/types';
import { Button } from '@/components/ui/button';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<UserType | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('bartaNowUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      router.push('/login');
    }

    const handleStorageChange = (event: StorageEvent) => {
        if (event.key === 'bartaNowUser') {
            const newUser = event.newValue ? JSON.parse(event.newValue) : null;
            if (newUser) {
                setUser(newUser);
            } else {
                router.push('/login');
            }
        }
    };
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };

  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('bartaNowUser');
    setUser(null);
    window.dispatchEvent(new Event('storage'));
    router.push('/');
  };

  const isActive = (path: string) => {
    return pathname === path;
  };
  
  if (!user) {
    // You can return a loader here
    return (
        <div className="flex justify-center items-center min-h-screen">
            Loading...
        </div>
    );
  }

  const userInitials = user.name.split(' ').map((n) => n[0]).join('');
  const avatarSrc = user.avatarUrl || `/user.png`;

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <span className="">BartaNow Dashboard</span>
            </Link>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              <Link
                href="/dashboard"
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary ${isActive('/dashboard') ? 'bg-muted text-primary' : ''}`}
              >
                <LayoutDashboard className="h-4 w-4" />
                ড্যাশবোর্ড
              </Link>
              <Link
                href="/dashboard/profile"
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary ${isActive('/dashboard/profile') ? 'bg-muted text-primary' : ''}`}
              >
                <User className="h-4 w-4" />
                আমার প্রোফাইল
              </Link>
              <Link
                href="/dashboard/saved-articles"
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary ${isActive('/dashboard/saved-articles') ? 'bg-muted text-primary' : ''}`}
              >
                <Bookmark className="h-4 w-4" />
                সংরক্ষিত আর্টিকেল
              </Link>
              <Link
                href="/dashboard/reading-history"
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary ${isActive('/dashboard/reading-history') ? 'bg-muted text-primary' : ''}`}
              >
                <History className="h-4 w-4" />
                পঠিত ইতিহাস
              </Link>
               <Link
                href="/dashboard/notifications"
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary ${isActive('/dashboard/notifications') ? 'bg-muted text-primary' : ''}`}
              >
                <Bell className="h-4 w-4" />
                নোটিফিকেশন সেন্টার
              </Link>
               <Link
                href="/dashboard/profile/edit"
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary ${isActive('/dashboard/profile/edit') ? 'bg-muted text-primary' : ''}`}
              >
                <Settings className="h-4 w-4" />
                প্রোফাইল এডিট
              </Link>
            </nav>
          </div>
          <div className="mt-auto p-4">
            <Button size="sm" className="w-full" asChild>
                <Link href="/">
                    <Home className="mr-2 h-4 w-4" />
                    ওয়েবসাইটে ফিরে যান
                </Link>
            </Button>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          {/* Mobile Navigation can be added here */}
          <div className="w-full flex-1">
            <h1 className="text-lg font-semibold">
                {pathname === '/dashboard' && 'ড্যাশবোর্ড'}
                {pathname === '/dashboard/profile' && 'আমার প্রোফাইল'}
                {pathname === '/dashboard/profile/edit' && 'প্রোফাইল এডিট করুন'}
                 {pathname === '/dashboard/saved-articles' && 'সংরক্ষিত আর্টিকেল'}
                {pathname === '/dashboard/reading-history' && 'পঠিত ইতিহাস'}
                 {pathname === '/dashboard/notifications' && 'নোটিফিকেশন সেন্টার'}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-medium text-sm">{user.name}</span>
            <Avatar className="h-8 w-8">
              <AvatarImage src={avatarSrc} alt={user.name} />
              <AvatarFallback>{userInitials}</AvatarFallback>
            </Avatar>
             <Button variant="ghost" size="icon" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
             </Button>
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-background">
          {children}
        </main>
      </div>
    </div>
  );
}
