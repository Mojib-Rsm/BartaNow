
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

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isActive = (path: string) => pathname.startsWith(path);

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-muted/40">
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center gap-2 p-2">
                 <svg viewBox="0 0 286 52" fill="none" xmlns="http://www.w3.org/2000/svg" className='w-32 h-auto'>
                    <path d="M10.7391 51.5C14.7391 51.5 17.5391 49.3 17.5391 44.9V36.9H3.93908V44.9C3.93908 49.3 6.73908 51.5 10.7391 51.5Z" fill="var(--primary-dark-1, #333333)"/>
                    <path d="M10.7391 0.5C6.73908 0.5 3.93908 2.7 3.93908 7.1V34.1H17.5391V7.1C17.5391 2.7 14.7391 0.5 10.7391 0.5Z" fill="var(--primary-dark-1, #333333)"/>
                    <path d="M24.3 36.9V44.9C24.3 49.3 21.5 51.5 17.5 51.5C13.5 51.5 10.7 49.3 10.7 44.9V36.9H24.3Z" fill="hsl(var(--primary))"/>
                    <path d="M10.7391 0.5C6.73908 0.5 3.93908 2.7 3.93908 7.1V34.1H17.5391V7.1C17.5391 2.7 14.7391 0.5 10.7391 0.5Z" fill="var(--primary-dark-1, #333333)"/>
                    <path d="M40.2609 51.5C44.2609 51.5 47.0609 49.3 47.0609 44.9V36.9H33.4609V44.9C33.4609 49.3 36.2609 51.5 40.2609 51.5Z" fill="var(--primary-dark-1, #333333)"/>
                    <path d="M40.2609 0.5C36.2609 0.5 33.4609 2.7 33.4609 7.1V34.1H47.0609V7.1C47.0609 2.7 44.2609 0.5 40.2609 0.5Z" fill="var(--primary-dark-1, #333333)"/>
                    <path d="M56.2 34.1H50V51H56.2C64.6 51 68.6 46.2 68.6 39.8C68.6 33.8 64.6 29.4 59.2 28.6L68 15.6H60.6L53.4 27.6H50V2.2H56.2C64.6 2.2 68.6 6.8 68.6 13.4C68.6 18.2 66.2 22 62.4 24L56.2 34.1ZM56.2 24.8H50V15.4H56.2C59.6 15.4 61.8 17.2 61.8 20.2C61.8 23 59.6 24.8 56.2 24.8Z" fill="var(--primary-dark-1, #333333)"/>
                    <path d="M85.909 28.1C85.909 21.1 82.509 15.3 76.509 15.3C70.509 15.3 67.109 21.1 67.109 28.1C67.109 35.1 70.509 40.9 76.509 40.9C82.509 40.9 85.909 35.1 85.909 28.1ZM71.309 28.1C71.309 23.1 73.109 18.1 76.509 18.1C79.909 18.1 81.709 23.1 81.709 28.1C81.709 33.1 79.909 38.1 76.509 38.1C73.109 38.1 71.309 33.1 71.309 28.1Z" fill="var(--primary-dark-1, #333333)"/>
                    <path d="M88.4 38.7V2.5H92.6V38.7H88.4Z" fill="var(--primary-dark-1, #333333)"/>
                    <path d="M109.139 51.5C113.139 51.5 115.939 49.3 115.939 44.9V36.9H102.339V44.9C102.339 49.3 105.139 51.5 109.139 51.5Z" fill="var(--primary-dark-1, #333333)"/>
                    <path d="M109.139 0.5C105.139 0.5 102.339 2.7 102.339 7.1V34.1H115.939V7.1C115.939 2.7 113.139 0.5 109.139 0.5Z" fill="var(--primary-dark-1, #333333)"/>
                    <path d="M129.5 28.1V2.5H133.7V40.5H129.5L118.1 16.9V40.5H113.9V2.5H118.1L129.5 28.1Z" fill="var(--primary-dark-1, #333333)"/>
                    <path d="M149.861 28.1C149.861 21.1 146.461 15.3 140.461 15.3C134.461 15.3 131.061 21.1 131.061 28.1C131.061 35.1 134.461 40.9 140.461 40.9C146.461 40.9 149.861 35.1 149.861 28.1ZM135.261 28.1C135.261 23.1 137.061 18.1 140.461 18.1C143.861 18.1 145.661 23.1 145.661 28.1C145.661 33.1 143.861 38.1 140.461 38.1C137.061 38.1 135.261 33.1 135.261 28.1Z" fill="var(--primary-dark-1, #333333)"/>
                    <path d="M166.4 34.1H160.2V51H166.4C174.8 51 178.8 46.2 178.8 39.8C178.8 33.8 174.8 29.4 169.4 28.6L178.2 15.6H170.8L163.6 27.6H160.2V2.2H166.4C174.8 2.2 178.8 6.8 178.8 13.4C178.8 18.2 176.4 22 162.6 24L166.4 34.1ZM166.4 24.8H160.2V15.4H166.4C169.8 15.4 172 17.2 172 20.2C172 23 169.8 24.8 166.4 24.8Z" fill="var(--primary-dark-1, #333333)"/>
                    <path d="M196.439 51.5C200.439 51.5 203.239 49.3 203.239 44.9V36.9H189.639V44.9C189.639 49.3 192.439 51.5 196.439 51.5Z" fill="var(--primary-dark-1, #333333)"/>
                    <path d="M196.439 0.5C192.439 0.5 189.639 2.7 189.639 7.1V34.1H203.239V7.1C203.239 2.7 200.439 0.5 196.439 0.5Z" fill="var(--primary-dark-1, #333333)"/>
                    <path d="M221.7 28.1C221.7 21.1 218.3 15.3 212.3 15.3C206.3 15.3 202.9 21.1 202.9 28.1C202.9 35.1 206.3 40.9 212.3 40.9C218.3 40.9 221.7 35.1 221.7 28.1ZM207.1 28.1C207.1 23.1 208.9 18.1 212.3 18.1C215.7 18.1 217.5 23.1 217.5 28.1C217.5 33.1 215.7 38.1 212.3 38.1C208.9 38.1 207.1 33.1 207.1 28.1Z" fill="var(--primary-dark-1, #333333)"/>
                    <path d="M224.2 38.7V2.5H228.4V38.7H224.2Z" fill="var(--primary-dark-1, #333333)"/>
                    <path d="M245.939 51.5C249.939 51.5 252.739 49.3 252.739 44.9V36.9H239.139V44.9C239.139 49.3 241.939 51.5 245.939 51.5Z" fill="var(--primary-dark-1, #333333)"/>
                    <path d="M245.939 0.5C241.939 0.5 239.139 2.7 239.139 7.1V34.1H252.739V7.1C252.739 2.7 249.939 0.5 245.939 0.5Z" fill="var(--primary-dark-1, #333333)"/>
                    <path d="M262.2 38.7V2.5H258V38.7H262.2Z" fill="var(--primary-dark-1, #333333)"/>
                    <text x="268" y="34" fontFamily="PT Sans, sans-serif" fontSize="28" fontWeight="bold" fill="#333333">নাও</text>
                 </svg>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive('/admin') && pathname === '/admin'}>
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
                  <Link href="#">
                    <Users />
                    ব্যবহারকারী
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
                 <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={isActive('/admin/settings')}>
                    <Link href="#">
                        <Settings />
                        সেটিংস
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
          <main className="flex-1 p-4 sm:px-6 sm:py-0">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
