import Link from "next/link";
import { Facebook, Twitter, Youtube } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const yearInBangla = new Intl.NumberFormat('bn-BD').format(currentYear);

  return (
    <footer className="bg-card mt-auto border-t">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div>
            <h3 className="font-bold text-lg text-primary font-headline mb-2">বার্তা নাও</h3>
            <p className="text-muted-foreground text-sm">
              সর্বশেষ এবং নির্ভরযোগ্য সংবাদের জন্য আপনার বিশ্বস্ত উৎস।
            </p>
          </div>
          <div>
            <h3 className="font-bold text-lg text-primary font-headline mb-2">গুরুত্বপূর্ণ লিংক</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="text-muted-foreground hover:text-primary">আমাদের সম্পর্কে</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-primary">যোগাযোগ</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-primary">গোপনীয়তা নীতি</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg text-primary font-headline mb-2">সামাজিক যোগাযোগ</h3>
            <div className="flex justify-center md:justify-start gap-4">
              <Link href="#" className="text-muted-foreground hover:text-primary"><Facebook size={20} /></Link>
              <Link href="#" className="text-muted-foreground hover:text-primary"><Twitter size={20} /></Link>
              <Link href="#" className="text-muted-foreground hover:text-primary"><Youtube size={20} /></Link>
            </div>
          </div>
        </div>
        <div className="border-t mt-8 pt-4 text-center text-muted-foreground text-sm">
          <p>&copy; {yearInBangla} বার্তা নাও। সর্বসত্ত্ব সংরক্ষিত।</p>
        </div>
      </div>
    </footer>
  );
}
