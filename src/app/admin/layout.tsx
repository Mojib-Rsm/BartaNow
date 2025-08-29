

'use client';

import Link from 'next/link';
import {
  Menu,
  ChevronDown,
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
import type { AdminMenuItem } from '@/lib/admin-menu-config';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';


const NavLink = ({ item, isActive, isChild = false }: { item: Omit<AdminMenuItem, 'children'>, isActive: boolean, isChild?: boolean }) => {
    const linkClasses = cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-primary-foreground transition-all hover:text-white hover:bg-sidebar-accent",
        isActive ? 'bg-sidebar-accent text-white font-bold' : 'text-primary-foreground/80',
        isChild && "pl-10 pr-3"
    );
    return (
        <Link href={item.path!} className={linkClasses}>
            {!isChild && <item.icon className="h-4 w-4" />}
            {item.label}
        </Link>
    );
};

const NavCollapsible = ({ item, currentPath }: { item: AdminMenuItem, currentPath: string }) => {
    const isParentActive = item.children?.some(child => currentPath.startsWith(child.path!));
    const [isOpen, setIsOpen] = useState(isParentActive);
    
    return (
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <CollapsibleTrigger asChild>
                 <button className={cn(
                    "w-full flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-primary-foreground transition-all hover:text-white hover:bg-sidebar-accent",
                    isParentActive ? 'bg-sidebar-accent text-white font-bold' : 'text-primary-foreground/80'
                )}>
                    <div className="flex items-center gap-3">
                        <item.icon className="h-4 w-4" />
                        {item.label}
                    </div>
                    <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
                </button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-1 py-1">
                {item.children?.map(child => {
                    const isChildActive = currentPath.startsWith(child.path!);
                    return (
                        <NavLink key={child.path} item={child} isActive={isChildActive} isChild={true} />
                    )
                })}
            </CollapsibleContent>
        </Collapsible>
    )
}

const renderNavLinks = (currentPath: string) => {
    return adminMenuConfig.map((item) => {
      const hasAccess = true; // Simplified for now
      if (!hasAccess) return null;
      
      if(item.children && item.children.length > 0) {
        return <NavCollapsible key={item.label} item={item} currentPath={currentPath} />
      }

      const isActive = item.exactMatch ? currentPath === item.path : currentPath.startsWith(item.path!);
      return <NavLink key={item.path} item={item} isActive={isActive} />;
    });
};

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
  
  if (!user) {
    return (
        <div className="flex justify-center items-center min-h-screen">
            Loading...
        </div>
    );
  }

  const userInitials = user.name ? user.name.split(' ').map((n) => n[0]).join('') : '';

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-sidebar md:block">
        <div className="flex h-full max-h-screen flex-col gap-2 text-white">
          <div className="flex h-14 items-center border-b border-sidebar-border px-4 lg:h-[60px] lg:px-6">
            <Link href="/admin" className="flex items-center gap-2 font-semibold">
               <Image src={logoUrl} alt="BartaNow Logo" width={140} height={35} />
            </Link>
          </div>
          <div className="flex-1 overflow-y-auto">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              {renderNavLinks(pathname)}
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
                <div className="flex h-14 shrink-0 items-center border-b border-sidebar-border px-4">
                     <Link href="/admin">
                       <Image src={logoUrl} alt="BartaNow Logo" width={140} height={35} />
                    </Link>
                </div>
                <nav className="flex-1 overflow-auto p-4">
                    <div className="grid gap-2 text-lg font-medium">
                        {renderNavLinks(pathname)}
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
