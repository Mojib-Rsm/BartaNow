

'use client';

import Link from 'next/link';
import {
  Home,
  Newspaper,
  Users,
  Settings,
  BarChart2,
  PanelLeft
} from 'lucide-react';
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

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const logoUrl = "https://bartanow.com/wp-content/uploads/2025/04/BartaNow.png";

  const isActive = (path: string) => pathname === path || (path !== '/admin' && pathname.startsWith(path));

  return (
    <div lang="en" dir="ltr">
        <SidebarProvider>
        <div className="flex min-h-screen bg-muted/40">
            <Sidebar>
            <SidebarHeader>
                <div className="flex items-center justify-center p-2">
                    <Image src={logoUrl} alt="BartaNow Logo" width={150} height={40} />
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={isActive('/admin')}>
                    <Link href="/admin">
                        <BarChart2 />
                        ড্যাশবোর্ড
                    </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={isActive('/admin/articles')}>
                    <Link href="/admin/articles">
                        <Newspaper />
                        আর্টিকেলসমূহ
                    </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                 <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={isActive('/admin/users')}>
                    <Link href="/admin/users">
                        <Users />
                        ব্যবহারকারীগণ
                    </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                </SidebarMenu>
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                            <Link href="/">
                                <Home />
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
                <h1 className="text-lg font-semibold">অ্যাডমিন ড্যাশবোর্ড</h1>
                </div>
                <Button variant="ghost" size="icon" className="rounded-full">
                <img
                    src="https://i.pravatar.cc/150?u=admin"
                    alt="Admin"
                    className="h-8 w-8 rounded-full"
                />
                <span className="sr-only">Toggle user menu</span>
                </Button>
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
