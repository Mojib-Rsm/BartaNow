

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import SearchInput from './search-input';
import { ThemeToggle } from './theme-toggle';

const topNavLinks = [
    { title: 'যেভাবে তৈরি হয় রংবেরঙের চুড়ি', image: 'https://picsum.photos/seed/bangles/50/50', href: '/story/bangles' },
    { title: 'মিথিলার গর্ব: পেলেন \'ডক্টর\' উপাধি', image: 'https://picsum.photos/seed/mithila/50/50', href: '/story/mithila' },
    { title: 'আগুন নেভানোর জন্য পানি আনতে গিয়ে পুকুরেই ডুবল...', image: 'https://picsum.photos/seed/firefighter/50/50', href: '/story/firefighter' },
];

const mainNavLinks = [
    { name: 'সর্বশেষ', href: '/latest' },
    { name: 'জাতীয়', href: '/national' },
    { name: 'রাজনীতি', href: '/politics' },
    { name: 'খেলা', href: '/sports' },
    { name: 'বিনোদন', href: '/entertainment' },
    { name: 'প্রযুক্তি', href: '/tech' },
    { name: 'আন্তর্জাতিক', href: '/international' },
    { name: 'ইসলামী জীবন', href: '/islamic-life' },
    { name: 'বিশেষ কভারেজ', href: '/special-coverage' },
    { name: 'ভিডিও', href: '/videos' },
    { name: 'মিম নিউজ', href: '/memes' },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const logoUrl = "https://bartanow.com/wp-content/uploads/2025/04/BartaNow.png";

  return (
    <header className={cn(
      "bg-card sticky top-0 z-40 transition-all duration-300",
      isScrolled ? 'shadow-md' : 'shadow-sm'
    )}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top bar with logo and ticker */}
        <div className={cn(
            "flex items-center justify-between h-20 border-b transition-all duration-300 overflow-hidden",
            isScrolled ? 'h-0 border-none opacity-0' : 'opacity-100'
          )}>
            <Link href="/" className="flex items-center gap-2 text-3xl font-bold font-headline text-primary hover:opacity-80 transition-opacity">
                 <Image src={logoUrl} alt="BartaNow Logo" width={200} height={50} />
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

        {/* Main navigation */}
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
                                  <span>বার্তা নাও</span>
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
                                      <li key={link.name}>
                                          <Link href={link.href} className="block text-lg font-medium text-foreground hover:text-primary transition-colors py-2 px-2 rounded-md hover:bg-accent">
                                              {link.name}
                                          </Link>
                                      </li>
                                  ))}
                              </ul>
                          </nav>
                          <div className="p-4 border-t">
                              <Button variant="outline" className="w-full mb-2">ই-পেপার</Button>
                               <Button asChild className="w-full">
                                <Link href="/login">লগইন করুন</Link>
                              </Button>
                          </div>
                      </div>
                  </SheetContent>
              </Sheet>

              <Link href="/" className={cn(
                "flex items-center gap-2 text-xl font-bold font-headline text-primary transition-opacity",
                isScrolled ? 'opacity-100' : 'md:opacity-0'
                )}>
                  <Image src={logoUrl} alt="BartaNow Logo" width={150} height={40} />
              </Link>
            </div>
            <nav className="hidden md:flex items-center gap-6 flex-grow">
                {mainNavLinks.map((link) => (
                    <Link key={link.name} href={link.href} className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                        {link.name}
                    </Link>
                ))}
            </nav>
            <div className="flex items-center gap-2">
                <SearchInput />
                <ThemeToggle />
                <Button variant="outline" size="sm" className="hidden md:inline-flex">ই-পেপার</Button>
                 <Button asChild variant="ghost" size="sm" className="hidden md:inline-flex items-center gap-1.5">
                    <Link href="/login">লগইন</Link>
                </Button>
            </div>
        </div>
      </div>
    </header>
  );
}
