import Link from "next/link";
import { Facebook, Twitter, Youtube, Instagram } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const yearInBangla = new Intl.NumberFormat('bn-BD').format(currentYear);

  return (
    <footer className="bg-card mt-auto border-t">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center md:text-left">
          <div className="md:col-span-1">
            <h3 className="font-bold text-lg text-primary font-headline mb-2">বার্তা নাও</h3>
            <p className="text-muted-foreground text-sm">
              সর্বশেষ এবং নির্ভরযোগ্য সংবাদের জন্য আপনার বিশ্বস্ত উৎস।
            </p>
          </div>
          <div>
            <h3 className="font-bold text-lg text-primary font-headline mb-2">গুরুত্বপূর্ণ লিংক</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/archive" className="text-muted-foreground hover:text-primary">আর্কাইভ</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-primary">আমাদের সম্পর্কে</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-primary">যোগাযোগ করুন</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-primary">গোপনীয়তা নীতি</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-primary">ব্যবহারের শর্তাবলী</Link></li>
            </ul>
          </div>
          <div>
              <h3 className="font-bold text-lg text-primary font-headline mb-2">যোগাযোগ</h3>
               <address className="not-italic text-sm text-muted-foreground space-y-1">
                <p>ইমেইল: contact@bartanow.com</p>
                <p>ফোন: +৮৮০ ১২৩৪ ৫৬৭৮৯০</p>
                <p>ঠিকানা: ১২৩ নিউজ স্ট্রিট, ঢাকা, বাংলাদেশ</p>
              </address>
          </div>
          <div>
            <h3 className="font-bold text-lg text-primary font-headline mb-2">সামাজিক যোগাযোগ</h3>
            <div className="flex justify-center md:justify-start gap-4 mb-4">
              <Link href="#" className="text-muted-foreground hover:text-primary"><Facebook size={20} /></Link>
              <Link href="#" className="text-muted-foreground hover:text-primary"><Twitter size={20} /></Link>
              <Link href="#" className="text-muted-foreground hover:text-primary"><Youtube size={20} /></Link>
              <Link href="#" className="text-muted-foreground hover:text-primary"><Instagram size={20} /></Link>
            </div>
            <h3 className="font-bold text-lg text-primary font-headline mb-2 mt-4">নিউজলেটার</h3>
            <p className="text-muted-foreground text-sm mb-2">সর্বশেষ খবর সরাসরি আপনার ইনবক্সে পেতে সাবস্ক্রাইব করুন।</p>
            <form className="flex gap-2">
                <Input type="email" placeholder="আপনার ইমেইল" className="flex-grow" aria-label="Email for newsletter"/>
                <Button asChild>
                  <Link href="/subscribe">সাবস্ক্রাইব</Link>
                </Button>
            </form>
          </div>
        </div>
        <div className="border-t mt-8 pt-4 text-center text-muted-foreground text-sm">
          <p>&copy; {yearInBangla} বার্তা নাও। সর্বসত্ত্ব সংরক্ষিত।</p>
        </div>
      </div>
    </footer>
  );
}
