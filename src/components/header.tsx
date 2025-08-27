import Link from 'next/link';
import { Menu, Newspaper, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const navLinks = [
    { name: 'রাজনীতি', href: '#' },
    { name: 'প্রযুক্তি', href: '#' },
    { name: 'খেলা', href: '#' },
    { name: 'বিনোদন', href: '#' },
    { name: 'অর্থনীতি', href: '#' },
    { name: 'আন্তর্জাতিক', href: '#' },
    { name: 'মতামত', href: '#' },
];

export default function Header() {
  return (
    <header className="bg-card shadow-sm sticky top-0 z-40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 text-2xl font-bold font-headline text-primary hover:opacity-80 transition-opacity">
            <Newspaper className="h-7 w-7" />
            <span>বার্তা নাও</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
                <Link key={link.name} href={link.href} className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                    {link.name}
                </Link>
            ))}
          </nav>
          <div className="md:hidden">
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <Menu className="h-6 w-6" />
                        <span className="sr-only">Open menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left">
                    <div className="flex flex-col h-full">
                        <div className="flex items-center justify-between p-4 border-b">
                             <Link href="/" className="flex items-center gap-2 text-xl font-bold font-headline text-primary">
                                <Newspaper className="h-6 w-6" />
                                <span>বার্তা নাও</span>
                            </Link>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <X className="h-6 w-6" />
                                     <span className="sr-only">Close menu</span>
                                </Button>
                            </SheetTrigger>
                        </div>
                        <nav className="flex-grow p-4">
                            <ul className="space-y-4">
                                {navLinks.map((link) => (
                                    <li key={link.name}>
                                        <Link href={link.href} className="block text-lg font-medium text-foreground hover:text-primary transition-colors">
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </div>
                </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
