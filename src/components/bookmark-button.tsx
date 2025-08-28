
'use client';

import { useState, useEffect } from 'react';
import { Bookmark, BookmarkCheck, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import type { User } from '@/lib/types';
import { toggleBookmarkAction } from '@/app/actions';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

type BookmarkButtonProps = {
  articleId: string;
};

export default function BookmarkButton({ articleId }: BookmarkButtonProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const handleStorageChange = () => {
        const storedUser = localStorage.getItem('bartaNowUser');
        if (storedUser) {
            const parsedUser: User = JSON.parse(storedUser);
            setUser(parsedUser);
            setIsBookmarked(parsedUser.savedArticles?.includes(articleId) ?? false);
        } else {
            setUser(null);
            setIsBookmarked(false);
        }
    };
    
    // Initial load
    handleStorageChange();

    // Listen for changes
    window.addEventListener('storage', handleStorageChange);
    return () => {
        window.removeEventListener('storage', handleStorageChange);
    };
  }, [articleId]);

  const handleToggleBookmark = async () => {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'প্রবেশাধিকার নেই',
        description: 'আর্টিকেল সংরক্ষণ করতে অনুগ্রহ করে লগইন করুন।',
      });
      return;
    }

    setLoading(true);
    const result = await toggleBookmarkAction(user.id, articleId);
    setLoading(false);

    if (result.success && result.user) {
      setIsBookmarked(result.isBookmarked ?? false);
      localStorage.setItem('bartaNowUser', JSON.stringify(result.user));
      window.dispatchEvent(new Event('storage'));
      toast({
        title: result.isBookmarked ? 'সংরক্ষিত' : 'সংরক্ষণ সরানো হয়েছে',
        description: result.isBookmarked
          ? 'আর্টিকেলটি আপনার তালিকায় যোগ করা হয়েছে।'
          : 'আর্টিকেলটি আপনার তালিকা থেকে সরানো হয়েছে।',
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'ত্রুটি',
        description: result.message,
      });
    }
  };

  return (
    <TooltipProvider>
        <Tooltip>
            <TooltipTrigger asChild>
                <Button onClick={handleToggleBookmark} disabled={loading} variant="ghost" size="icon">
                {loading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                ) : isBookmarked ? (
                    <BookmarkCheck className="h-5 w-5 text-primary" />
                ) : (
                    <Bookmark className="h-5 w-5" />
                )}
                </Button>
            </TooltipTrigger>
            <TooltipContent>
                <p>{isBookmarked ? 'সংরক্ষণ সরান' : 'সংরক্ষণ করুন'}</p>
            </TooltipContent>
        </Tooltip>
    </TooltipProvider>
  );
}
