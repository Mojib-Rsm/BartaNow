'use client';

import { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import ArticleCard from '@/components/article-card';
import { getArticles } from '@/lib/api';
import type { Article } from '@/lib/types';
import { format } from 'date-fns';
import { Loader2 } from 'lucide-react';
import type { Metadata } from 'next';

// This is a client component, so we can't export metadata directly.
// We can set the title dynamically on the client side if needed.

export default function ArchivePage() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    document.title = 'আর্কাইভ | বার্তা নাও';
  }, []);

  useEffect(() => {
    async function fetchArticlesForDate(selectedDate: Date) {
      setIsLoading(true);
      const formattedDate = format(selectedDate, 'yyyy-MM-dd');
      const { articles: fetchedArticles } = await getArticles({ date: formattedDate });
      setArticles(fetchedArticles);
      setIsLoading(false);
    }

    if (date) {
      fetchArticlesForDate(date);
    }
  }, [date]);

  const formattedSelectedDate = date ? new Intl.DateTimeFormat('bn-BD', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date) : '';

  return (
    <div className="container mx-auto py-8">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold font-headline text-primary">আর্কাইভ</h1>
        <p className="text-muted-foreground mt-2">
          তারিখ অনুযায়ী পুরনো খবর খুঁজে বের করুন
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 flex justify-center">
            <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border"
            />
        </div>
        <div className="md:col-span-2">
           <h2 className="text-2xl font-bold font-headline mb-4 pb-2 border-b-2 border-primary">
              {date ? `${formattedSelectedDate} তারিখের খবর` : 'একটি তারিখ নির্বাচন করুন'}
            </h2>
            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : articles.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {articles.map((article) => (
                    <ArticleCard key={article.id} article={article} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-16">
                    <p className="text-muted-foreground">এই তারিখে কোনো আর্টিকেল খুঁজে পাওয়া যায়নি।</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
