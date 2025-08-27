import Link from 'next/link';
import { Menu, Newspaper, Search, X } from 'lucide-react';
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
    <header className="bg-card shadow-sm sticky top-0 z-40 border-b">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top bar */}
        <div className="flex items-center justify-between h-12 border-b">
            <div className="flex items-center gap-4">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <Menu className="h-6 w-6" />
                            <span className="sr-only">Open menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="p-0">
                        <div className="flex flex-col h-full">
                           <div className="p-4 border-b">
                                <Link href="/" className="flex items-center gap-2 text-xl font-bold font-headline text-primary">
                                    <Newspaper className="h-6 w-6" />
                                    <span>বার্তা নাও</span>
                                </Link>
                           </div>
                            <nav className="flex-grow p-4">
                                <ul className="space-y-2">
                                    {navLinks.map((link) => (
                                        <li key={link.name}>
                                            <Link href={link.href} className="block text-lg font-medium text-foreground hover:text-primary transition-colors py-2 px-2 rounded-md hover:bg-accent">
                                                {link.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </nav>
                        </div>
                    </SheetContent>
                </Sheet>
                 <Button variant="ghost" size="icon">
                    <Search className="h-5 w-5" />
                    <span className="sr-only">Search</span>
                </Button>
            </div>
            <Link href="/" className="text-3xl font-bold font-headline text-primary hover:opacity-80 transition-opacity">
                বার্তা নাও
            </Link>
            <div className="flex items-center">
                <Button variant="outline" size="sm" className='bg-primary text-primary-foreground hover:bg-primary/90'>বাংলা</Button>
            </div>
        </div>

        {/* Main navigation */}
        <div className="flex items-center justify-center h-12">
            <nav className="hidden md:flex items-center gap-6">
                {navLinks.map((link) => (
                    <Link key={link.name} href={link.href} className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                        {link.name}
                    </Link>
                ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
