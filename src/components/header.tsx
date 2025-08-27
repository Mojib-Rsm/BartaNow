'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import SearchInput from './search-input';
import { ThemeToggle } from './theme-toggle';

const topNavLinks = [
    { title: 'যেভাবে তৈরি হয় রংবেরঙের চুড়ি', image: 'https://picsum.photos/seed/bangles/50/50' },
    { title: 'মিথিলার গর্ব: পেলেন \'ডক্টর\' উপাধি', image: 'https://picsum.photos/seed/mithila/50/50' },
    { title: 'আগুন নেভানোর জন্য পানি আনতে গিয়ে পুকুরেই ডুবল...', image: 'https://picsum.photos/seed/firefighter/50/50' },
];

const mainNavLinks = [
    { name: 'সর্বশেষ', href: '/latest' },
    { name: 'রাজনীতি', href: '/category/politics' },
    { name: 'খেলা', href: '/category/sports' },
    { name: 'প্রযুক্তি', href: '/category/tech' },
    { name: 'বিনোদন', href: '/category/entertainment' },
    { name: 'আন্তর্জাতিক', href: '/category/international' },
    { name: 'ভিডিও', href: '/category/videos' },
    { name: 'মতামত জরিপ', href: '/polls' },
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
                 <svg viewBox="0 0 286 52" fill="none" xmlns="http://www.w3.org/2000/svg" className='w-48 h-auto'>
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
            </Link>
            <div className="hidden md:flex items-center gap-4 text-sm">
                {topNavLinks.map((link, index) => (
                    <Link key={index} href="#" className="flex items-center gap-2 group">
                        <div className="relative w-12 h-12">
                           <Image src={link.image} alt={link.title} fill className="object-cover rounded"/>
                        </div>
                        <span className="w-40 group-hover:text-primary transition-colors">{link.title}</span>
                    </Link>
                ))}
            </div>
        </div>

        {/* Main navigation */}
        <div className="flex items-center justify-between h-12 border-t">
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
                              <Button className="w-full">Login</Button>
                          </div>
                      </div>
                  </SheetContent>
              </Sheet>

              <Link href="/" className={cn(
                "flex items-center gap-2 text-xl font-bold font-headline text-primary transition-opacity",
                isScrolled ? 'opacity-100' : 'md:opacity-0'
                )}>
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
                 <Button variant="ghost" size="sm" className="hidden md:inline-flex items-center gap-1.5">
                    লগইন
                </Button>
            </div>
        </div>
      </div>
    </header>
  );
}
