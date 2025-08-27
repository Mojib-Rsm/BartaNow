
import { Button } from '@/components/ui/button';
import { Home, Frown } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-20rem)] text-center px-4">
      <Frown className="h-24 w-24 text-primary/50 mb-6" />
      <h1 className="text-6xl font-bold font-headline text-primary mb-2">404</h1>
      <h2 className="text-2xl md:text-3xl font-semibold mb-4">
        দুঃখিত, পেজটি খুঁজে পাওয়া যায়নি।
      </h2>
      <p className="text-muted-foreground max-w-md mb-8">
        আপনি যে পেজটি খুঁজছেন সেটি হয়তো সরিয়ে ফেলা হয়েছে, অথবা এর নাম পরিবর্তন করা হয়েছে, অথবা এটি কখনোই ছিল না।
      </p>
      <Button asChild>
        <Link href="/">
          <Home className="mr-2 h-4 w-4" />
          হোমে ফিরে যান
        </Link>
      </Button>
    </div>
  );
}
