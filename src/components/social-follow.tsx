
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from './ui/button';
import { Facebook, Twitter, Instagram, Youtube, Rss, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

export default function SocialFollow() {
  const facebookPageUrl = "https://www.facebook.com/NowBarta"; // Replace with your Facebook page URL
  const [loadFacebook, setLoadFacebook] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
        (entries) => {
            if (entries[0].isIntersecting) {
                setLoadFacebook(true);
                observer.disconnect();
            }
        },
        { rootMargin: '200px' }
    );

    if(containerRef.current) {
        observer.observe(containerRef.current);
    }
    
    return () => {
        if(containerRef.current) {
            observer.unobserve(containerRef.current);
        }
    };
  }, []);


  return (
    <Card ref={containerRef}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline text-lg">
          <Rss className="h-5 w-5 text-primary" />
          আমাদের ফলো করুন
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" asChild>
            <Link href="#" className="flex items-center justify-center gap-2">
                <Facebook className="h-4 w-4 text-[#1877F2]" />
                Facebook
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="#" className="flex items-center justify-center gap-2">
                <Youtube className="h-4 w-4 text-[#FF0000]" />
                YouTube
            </Link>
          </Button>
          <Button variant="outline" asChild>
             <Link href="#" className="flex items-center justify-center gap-2">
                <Twitter className="h-4 w-4 text-[#1DA1F2]" />
                Twitter
            </Link>
          </Button>
          <Button variant="outline" asChild>
             <Link href="#" className="flex items-center justify-center gap-2">
                <Instagram className="h-4 w-4 text-[#E4405F]" />
                Instagram
            </Link>
          </Button>
        </div>
        <div className="min-h-[250px] flex items-center justify-center">
            {loadFacebook ? (
                 <iframe
                    src={`https://www.facebook.com/plugins/page.php?href=${encodeURIComponent(facebookPageUrl)}&tabs=timeline&width=340&height=500&small_header=true&adapt_container_width=true&hide_cover=false&show_facepile=true&appId`}
                    width="100%"
                    height="450"
                    style={{ border: 'none', overflow: 'hidden' }}
                    scrolling="no"
                    frameBorder="0"
                    allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                    title="Facebook Page Feed"
                ></iframe>
            ) : (
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <Loader2 className="h-6 w-6 animate-spin" />
                    <p className="text-sm">ফেসবুক ফিড লোড হচ্ছে...</p>
                </div>
            )}
        </div>
      </CardContent>
    </Card>
  );
}
