
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Rss, DownloadCloud } from 'lucide-react';
import { rssFeeds } from '@/lib/rss-feeds';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Link from 'next/link';
import { triggerRssImportAction } from '@/app/actions';

export default function RssManagementPage() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleManualImport = async () => {
    setLoading(true);
    toast({
      title: 'ইম্পোর্ট শুরু হয়েছে',
      description: 'RSS ফিড থেকে আর্টিকেল ইম্পোর্ট করা হচ্ছে। এটি সম্পূর্ণ হতে কিছু সময় লাগতে পারে।',
    });
    
    const result = await triggerRssImportAction();

    if (result.success) {
      toast({
        title: 'ইম্পোর্ট সম্পন্ন',
        description: result.message,
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'ইম্পোর্ট ব্যর্থ',
        description: result.message,
      });
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">RSS ফিড ম্যানেজমেন্ট</h1>
          <p className="text-muted-foreground">এখান থেকে RSS ফিড ইম্পোর্ট করুন এবং আপনার সাইটের ফিড পরিচালনা করুন।</p>
        </div>
        <Button onClick={handleManualImport} disabled={loading}>
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <DownloadCloud className="mr-2 h-4 w-4" />
          )}
          ম্যানুয়াল ইম্পোর্ট
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>আপনার সাইটের RSS ফিড</CardTitle>
          <CardDescription>
            এই লিংকটি ব্যবহার করে অন্যেরা আপনার সাইটের কন্টেন্ট সাবস্ক্রাইব করতে পারবে।
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <Rss className="h-4 w-4" />
            <AlertTitle>আপনার RSS ফিড লিংক</AlertTitle>
            <AlertDescription>
              <Link href="/api/rss" target="_blank" className="text-primary hover:underline break-all">
                {typeof window !== 'undefined' && `${window.location.origin}/api/rss`}
              </Link>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>কনফিগার করা RSS ফিডসমূহ</CardTitle>
          <CardDescription>
            এই ফিডগুলো থেকে আর্টিকেল স্বয়ংক্রিয়ভাবে ইম্পোর্ট করা হবে।
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="divide-y">
            {rssFeeds.map(feed => (
              <li key={feed.id} className="py-3 flex justify-between items-center">
                <div>
                  <p className="font-semibold">{feed.name}</p>
                  <p className="text-sm text-muted-foreground">{feed.url}</p>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href={feed.url} target="_blank">ফিড দেখুন</Link>
                </Button>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
