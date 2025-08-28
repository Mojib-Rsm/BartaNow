
'use client';

import Link from 'next/link';
import {
  Home,
  PanelLeft,
  Menu,
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from '@/components/ui/button';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import type { User } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { adminMenuConfig } from '@/lib/admin-menu-config';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const logoUrl = "https://raw.githubusercontent.com/Mojib-Rsm/BartaNow/refs/heads/main/public/log-heado.png";
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const handleStorageChange = () => {
        const storedUser = localStorage.getItem('bartaNowUser');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        } else {
            router.push('/login');
        }
    };
    
    handleStorageChange(); // Initial load
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
    if (path === '/admin' && pathname === '/admin') return true;
    return path !== '/admin' && pathname.startsWith(path);
  };
  
  if (!user) {
    return (
        <div className="flex justify-center items-center min-h-screen">
            Loading...
        </div>
    );
  }

  const userInitials = user.name ? user.name.split(' ').map((n) => n[0]).join('') : '';

  const sidebarLinks = adminMenuConfig.map((item) => {
      const hasAccess = !item.roles || (user?.role && item.roles.includes(user.role));
      if (!hasAccess) return null;
      
      const linkClasses = `flex items-center gap-3 rounded-lg px-3 py-2 text-primary-foreground transition-all hover:text-white hover:bg-sidebar-accent ${isActive(item.path) ? 'bg-sidebar-accent text-white font-bold' : 'text-primary-foreground/80'}`;

      return (
        <Link
          key={item.path}
          href={item.path}
          className={linkClasses}
        >
          <item.icon className="h-4 w-4" />
          {item.label}
        </Link>
      );
  });

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-sidebar md:block">
        <div className="flex h-full max-h-screen flex-col gap-2 text-white">
          <div className="flex h-14 items-center border-b border-sidebar-border px-4 lg:h-[60px] lg:px-6">
            <Link href="/admin" className="flex items-center gap-2 font-semibold">
               <Image src={logoUrl} alt="BartaNow Logo" width={140} height={35} />
            </Link>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              {sidebarLinks}
            </nav>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col bg-sidebar text-white p-0">
              <nav className="grid gap-2 text-lg font-medium">
                <div className="flex h-14 items-center border-b border-sidebar-border px-4 lg:h-[60px] lg:px-6">
                     <Link href="/admin" className="flex items-center gap-2 font-semibold">
                       <Image src={logoUrl} alt="BartaNow Logo" width={140} height={35} />
                    </Link>
                </div>
                <div className="p-4 space-y-2">
                    {sidebarLinks}
                </div>
              </nav>
            </SheetContent>
          </Sheet>
          
          <div className="w-full flex-1" />
          
           <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatarUrl || `/user.png`} alt={user.name} />
                    <AvatarFallback>{userInitials}</AvatarFallback>
                </Avatar>
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{user.name}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild><Link href="/dashboard">ড্যাশবোর্ড</Link></DropdownMenuItem>
              <DropdownMenuItem asChild><Link href="/">ওয়েবসাইট দেখুন</Link></DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>লগ আউট</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

        </header>
        <main className="flex-1 p-4 sm:px-6 sm:py-6 bg-muted/40 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
