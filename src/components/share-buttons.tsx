'use client';

import { Facebook, Twitter, Link as LinkIcon, MessageCircle } from 'lucide-react';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';

type ShareButtonsProps = {
  articleTitle: string;
};

export default function ShareButtons({ articleTitle }: ShareButtonsProps) {
  const { toast } = useToast();

  const handleShare = (platform: 'facebook' | 'twitter' | 'whatsapp' | 'copy') => {
    // In a real app, you'd get the current URL. For this demo, we'll use a placeholder.
    const url = typeof window !== 'undefined' ? window.location.href : '';
    const text = encodeURIComponent(`" ${articleTitle}"`);
    let shareUrl = '';

    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${text}`;
        break;
      case 'whatsapp':
        shareUrl = `https://api.whatsapp.com/send?text=${text}%20${encodeURIComponent(url)}`;
        break;
      case 'copy':
        navigator.clipboard.writeText(url).then(() => {
          toast({ title: 'লিঙ্ক কপি করা হয়েছে!' });
        });
        return;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-semibold text-muted-foreground mr-2">শেয়ার করুন:</span>
      <Button variant="outline" size="icon" onClick={() => handleShare('facebook')} aria-label="Share on Facebook">
        <Facebook className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="icon" onClick={() => handleShare('twitter')} aria-label="Share on Twitter">
        <Twitter className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="icon" onClick={() => handleShare('whatsapp')} aria-label="Share on WhatsApp">
        <MessageCircle className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="icon" onClick={() => handleShare('copy')} aria-label="Copy link">
        <LinkIcon className="h-4 w-4" />
      </Button>
    </div>
  );
}
