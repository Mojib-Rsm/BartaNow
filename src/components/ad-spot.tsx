
'use client';

import { getAllAds } from '@/lib/api';
import type { Ad } from '@/lib/types';
import { Megaphone } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

type AdSpotProps = {
  className?: string;
  label?: string;
  placement: string;
};

export default function AdSpot({ className, label = 'বিজ্ঞাপন', placement }: AdSpotProps) {
  const [ad, setAd] = useState<Ad | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAd() {
      try {
        const allAds = await getAllAds();
        const activeAdsForPlacement = allAds.filter(a => a.isActive && a.placement === placement);
        if (activeAdsForPlacement.length > 0) {
          // Select a random ad if multiple are available for the placement
          const randomAd = activeAdsForPlacement[Math.floor(Math.random() * activeAdsForPlacement.length)];
          setAd(randomAd);
        }
      } catch (error) {
        console.error(`Failed to fetch ad for placement: ${placement}`, error);
      } finally {
        setLoading(false);
      }
    }
    fetchAd();
  }, [placement]);

  if (loading) {
    return (
      <div
        className={`flex items-center justify-center w-full bg-muted/50 border border-dashed rounded-md text-muted-foreground animate-pulse ${className}`}
      >
      </div>
    );
  }

  if (ad) {
    if (ad.type === 'image') {
      return (
        <Link href={ad.targetUrl || '#'} target="_blank" rel="noopener noreferrer sponsored">
          <div className={`relative w-full overflow-hidden rounded-md ${className}`}>
             <Image src={ad.content} alt={ad.name} fill className="object-cover" />
          </div>
        </Link>
      );
    }
    if (ad.type === 'script') {
       return (
        <div 
            className={className}
            dangerouslySetInnerHTML={{ __html: ad.content }}
        />
       );
    }
  }

  // Fallback placeholder if no ad is found
  return (
    <div
      className={`flex items-center justify-center w-full bg-muted/50 border border-dashed rounded-md text-muted-foreground ${className}`}
    >
      <div className="flex flex-col items-center gap-2 py-8">
        <Megaphone className="h-8 w-8" />
        <span className="text-sm font-medium">{label}</span>
      </div>
    </div>
  );
}
