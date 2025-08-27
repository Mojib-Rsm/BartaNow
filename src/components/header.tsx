import Link from 'next/link';
import { Newspaper } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-card shadow-sm sticky top-0 z-40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 text-2xl font-bold font-headline text-primary hover:opacity-80 transition-opacity">
            <Newspaper className="h-7 w-7" />
            <span>বার্তা নাও</span>
          </Link>
          <nav>
            {/* Future navigation links can go here */}
          </nav>
        </div>
      </div>
    </header>
  );
}
