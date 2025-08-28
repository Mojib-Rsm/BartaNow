
'use client';

import { useEffect, useState } from 'react';
import type { User, Article } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { getReadingHistoryAction } from '@/app/actions';
import { Loader2, BookX } from 'lucide-react';
import ArticleCard from '@/components/article-card';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function ReadingHistoryPage() {
  const [user, setUser] = useState<User | null>(null);
  const [readingHistory, setReadingHistory] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const storedUser = localStorage.getItem('bartaNowUser');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);

      const fetchReadingHistory = async (userId: string) => {
        try {
          const articles = await getReadingHistoryAction(userId);
          setReadingHistory(articles);
        } catch (error) {
          toast({
            variant: 'destructive',
            title: 'ত্রুটি',
            description: 'পঠিত আর্টিকেল আনতে সমস্যা হয়েছে।',
          });
        } finally {
          setLoading(false);
        }
      };

      fetchReadingHistory(parsedUser.id);
    } else {
      router.push('/login');
    }
  }, [router, toast]);

  if (loading) {
    return <div className="flex justify-center items-center h-full"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>আমার পঠিত আর্টিকেলসমূহ</CardTitle>
      </CardHeader>
      <CardContent>
        {readingHistory.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {readingHistory.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 border-2 border-dashed rounded-lg">
            <BookX className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">কোনো পঠিত আর্টিকেল নেই</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              আপনি এখনো কোনো আর্টিকেল পড়েননি।
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
