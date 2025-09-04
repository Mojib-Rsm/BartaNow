
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, User, LogOut, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import SearchInput from './search-input';
import { ThemeToggle } from './theme-toggle';
import type { User as UserType, MenuItem } from '@/lib/types';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useRouter } from 'next/navigation';
import { getMenuItems } from '@/lib/api';
import { Skeleton } from './ui/skeleton';

const topNavLinks = [
    { title: 'খেলা: বাংলাদেশের দুর্দান্ত জয়ে এশিয়া কাপ শুরু', image: 'https://picsum.photos/seed/bangles/50/50', href: '/খেলা-বাংলাদেশের-দুর্দান্ত-জয়ে-এশিয়া-কাপ-শুরু' },
    { title: 'মিথিলার গর্ব: পেলেন \'ডক্টর\' উপাধি', image: 'https://picsum.photos/seed/mithila/50/50', href: '/প্রযুক্তি-দেশজুড়ে-5g-সেবা-চালু-হতে-যাচ্ছে' },
    { title: 'আগুন নেভানোর জন্য পানি আনতে গিয়ে পুকুরেই ডুবল...', image: 'https://picsum.photos/seed/firefighter/50/50', href: '/অর্থনীতি-ডলারের-বাজারে-অস্থিরতা-অর্থনীতিতে-প্রভাব' },
];

const NavMenuSkeleton = () => (
    <div className="hidden md:flex items-center gap-6 flex-grow">
        {[...Array(8)].map((_, i) => (
            <Skeleton key={i} className="h-4 w-16" />
        ))}
    </div>
);


export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState<UserType | null>(null);
  const [mainNavLinks, setMainNavLinks] = useState<MenuItem[]>([]);
  const [loadingMenu, setLoadingMenu] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    
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
    
    async function fetchMenu() {
        try {
            const menuItems = await getMenuItems();
            setMainNavLinks(menuItems);
        } catch (error) {
            console.error("Failed to fetch menu items", error);
            // Fallback to mock data or show error
        } finally {
            setLoadingMenu(false);
        }
    }
    fetchMenu();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('bartaNowUser');
    setUser(null);
    window.dispatchEvent(new Event('storage')); // Notify other tabs
    router.push('/');
  };

  const userInitials = user?.name.split(' ').map(n => n[0]).join('') || 'U';

  return (
    <header className={cn(
      "bg-card sticky top-0 z-40 transition-all duration-300",
      isScrolled ? 'shadow-md' : 'shadow-sm'
    )}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className={cn(
            "flex items-center justify-between h-20 border-b transition-all duration-300 overflow-hidden",
            isScrolled ? 'h-0 border-none opacity-0' : 'opacity-100'
          )}>
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                 <Image src="https://raw.githubusercontent.com/Mojib-Rsm/BartaNow/refs/heads/main/public/log-heado.png" alt="BartaNow Logo" width={180} height={40} className="h-10 w-auto" />
            </Link>
            <div className="hidden md:flex items-center gap-4 text-sm">
                {topNavLinks.map((link, index) => (
                    <Link key={index} href={link.href} className="flex items-center gap-2 group">
                        <div className="relative w-12 h-12">
                           <Image src={link.image} alt={link.title} fill className="object-cover rounded"/>
                        </div>
                        <span className="w-40 group-hover:text-primary transition-colors">{link.title}</span>
                    </Link>
                ))}
            </div>
        </div>

        <div className="flex items-center justify-between h-12">
          <div className='flex items-center gap-2'>
              <Sheet>
                  <SheetTrigger asChild>
                      <Button variant="ghost" size="icon" className="md:hidden">
                          <Menu className="h-6 w-6" />
                          <span className="sr-only">Open menu</span>
                      </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="p-0 w-80">
                      <div className="flex flex-col h-full">
                         <div className="p-4 border-b flex items-center justify-between">
                              <Link href="/" className="flex items-center gap-2 text-xl font-bold font-headline text-primary">
                                  <Image src="https://raw.githubusercontent.com/Mojib-Rsm/BartaNow/refs/heads/main/public/log-heado.png" alt="BartaNow Logo" width={150} height={35} className="h-auto w-auto" />
                              </Link>
                              <SheetTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                      <X className="h-6 w-6" />
                                  </Button>
                              </SheetTrigger>
                         </div>
                          <nav className="flex-grow p-4">
                              <ul className="space-y-2">
                                  {mainNavLinks.map((link) => (
                                      <li key={link.id}>
                                          <Link href={link.href} className="block text-lg font-medium text-foreground hover:text-primary transition-colors py-2 px-2 rounded-md hover:bg-accent">
                                              {link.name}
                                          </Link>
                                      </li>
                                  ))}
                              </ul>
                          </nav>
                          <div className="p-4 border-t">
                               <Button asChild className="w-full">
                                <Link href="/login">লগইন করুন</Link>
                              </Button>
                          </div>
                      </div>
                  </SheetContent>
              </Sheet>

              <Link href="/" className={cn(
                "flex items-center gap-2 transition-opacity",
                isScrolled ? 'opacity-100' : 'md:opacity-0'
                )}>
                   <Image src="https://raw.githubusercontent.com/Mojib-Rsm/BartaNow/refs/heads/main/public/log-heado.png" alt="BartaNow Logo" width={150} height={35} className="h-8 w-auto" />
              </Link>
            </div>
            {loadingMenu ? (
                <NavMenuSkeleton />
            ) : (
                <nav className="hidden md:flex items-center gap-6 flex-grow">
                    {mainNavLinks.map((link) => (
                        <Link key={link.id} href={link.href} className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                            {link.name}
                        </Link>
                    ))}
                </nav>
            )}
            <div className="flex items-center gap-2">
                <SearchInput />
                <ThemeToggle />
                 {user ? (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={user.avatarUrl || `/user.png`} alt={user.name} />
                                    <AvatarFallback>{userInitials}</AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56" align="end" forceMount>
                            <DropdownMenuLabel className="font-normal">
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-medium leading-none">{user.name}</p>
                                    <p className="text-xs leading-none text-muted-foreground">
                                        {user.email}
                                    </p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                             <DropdownMenuItem asChild>
                                <Link href="/dashboard">
                                    <LayoutDashboard className="mr-2 h-4 w-4" />
                                    <span>ড্যাশবোর্ড</span>
                                </Link>
                            </DropdownMenuItem>
                            {(user.role === 'admin' || user.role === 'editor' || user.role === 'reporter') && (
                                <DropdownMenuItem asChild>
                                    <Link href="/admin">
                                        <LayoutDashboard className="mr-2 h-4 w-4" />
                                        <span>অ্যাডমিন প্যানেল</span>
                                    </Link>
                                </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={handleLogout}>
                                <LogOut className="mr-2 h-4 w-4" />
                                <span>লগ আউট</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                 ) : (
                    <Button asChild variant="ghost" size="sm" className="hidden md:inline-flex items-center gap-1.5">
                        <Link href="/login">লগইন</Link>
                    </Button>
                 )}
            </div>
        </div>
      </div>
    </header>
  );
}
