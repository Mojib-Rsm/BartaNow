
'use client';

import Link from 'next/link';
import { PanelLeft } from 'lucide-react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';
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
  const logoUrl = "https://raw.githubusercontent.com/Mojib-Rsm/BartaNow/refs/heads/main/public/log-heado.png";
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('bartaNowUser');
    if (storedUser) {
        setUser(JSON.parse(storedUser));
    }

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
  }, []);

  const isActive = (path: string) => {
    if (path === '/admin' && pathname === '/admin') return true;
    return path !== '/admin' && pathname.startsWith(path);
  };
  
  const userInitials = user?.name.split(' ').map((n) => n[0]).join('');

  return (
    <div lang="en" dir="ltr">
        <SidebarProvider>
        <div className="flex min-h-screen bg-muted/40">
            <Sidebar>
            <SidebarHeader>
                <div className="flex items-center justify-center p-2">
                    <Image src={logoUrl} alt="BartaNow Logo" width={160} height={40} />
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarMenu>
                    {adminMenuConfig.map((item) => {
                        const hasAccess = !item.roles || (user?.role && item.roles.includes(user.role));
                        if (!hasAccess) return null;

                        return (
                            <SidebarMenuItem key={item.path}>
                                <SidebarMenuButton asChild isActive={isActive(item.path)}>
                                <Link href={item.path}>
                                    <item.icon />
                                    {item.label}
                                </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        );
                    })}
                </SidebarMenu>
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                            <Link href="/">
                                <adminMenuConfig.find(item => item.path === '/')?.icon />
                                 ওয়েবসাইটে ফিরে যান
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
            </Sidebar>
            <div className="flex flex-col flex-1">
            <header className="flex h-14 items-center gap-4 border-b bg-background px-4 lg:h-[60px] lg:px-6">
                <SidebarTrigger className="md:hidden" />
                <div className="w-full flex-1">
                </div>
                {user && (
                    <Button variant="ghost" size="icon" className="rounded-full">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatarUrl || `/user.png`} alt={user.name} />
                        <AvatarFallback>{userInitials}</AvatarFallback>
                    </Avatar>
                    <span className="sr-only">Toggle user menu</span>
                    </Button>
                )}
            </header>
            <main className="flex-1 p-4 sm:px-6 sm:py-6">
                {children}
            </main>
            </div>
        </div>
        </SidebarProvider>
    </div>
  );
}
