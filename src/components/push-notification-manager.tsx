
'use client';

import { useEffect, useState } from 'react';
import { usePushNotifications } from '@/hooks/use-push-notifications';
import { useToast } from '@/hooks/use-toast';
import { Button } from './ui/button';
import { BellRing, BellOff } from 'lucide-react';
import dynamic from 'next/dynamic';

const PushNotificationManagerComponent = () => {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  const {
    userConsent,
    permissionStatus,
    isSubscribed,
    subscribe,
    unsubscribe,
    loading,
  } = usePushNotifications();
  const { toast } = useToast();

  useEffect(() => {
    if (isClient) {
        console.log('Push Notification Permission Status:', permissionStatus);
    }
  }, [permissionStatus, isClient]);

  const handleSubscription = async () => {
    if (isSubscribed) {
      await unsubscribe();
      toast({
        title: 'আনসাবস্ক্রাইবড',
        description: 'আপনি আর পুশ নোটিফিকেশন পাবেন না।',
      });
    } else {
      const success = await subscribe();
      if (success) {
        toast({
          title: 'সাবস্ক্রাইবড!',
          description: 'আপনি এখন থেকে সর্বশেষ খবরের জন্য পুশ নোটিফিকেশন পাবেন।',
        });
      } else if (userConsent === 'denied') {
        toast({
            variant: 'destructive',
            title: 'অনুমতি প্রয়োজন',
            description: 'পুশ নোটিফিকেশন পেতে অনুগ্রহ করে আপনার ব্রাউজার সেটিংসে অনুমতি দিন।',
        });
      }
    }
  };

  if (!isClient) {
    return null;
  }
  
  // We don't render the button if permission is not determined yet or not supported
  if (permissionStatus === 'prompt' || (typeof window !== 'undefined' && !('PushManager' in window))) {
    return null;
  }
  
  // Example of how to add a subscription button to the UI
  // In a real app, this would be placed in a more appropriate location (e.g., header, settings page)
  return (
    <div className="fixed bottom-20 right-4 md:bottom-8 md:right-8 z-50">
       <Button
        onClick={handleSubscription}
        disabled={loading}
        size="icon"
        variant="outline"
        className="rounded-full h-12 w-12 bg-card hover:bg-accent"
        aria-label={isSubscribed ? "নোটিফিকেশন বন্ধ করুন" : "নোটিফিকেশন চালু করুন"}
      >
        {isSubscribed ? (
            <BellOff className="h-6 w-6 text-destructive" />
        ) : (
            <BellRing className="h-6 w-6 text-primary" />
        )}
      </Button>
    </div>
  );
}


// Dynamically import the component that uses client-side features
const PushNotificationManager = dynamic(() => Promise.resolve(PushNotificationManagerComponent), {
  ssr: false,
});

export default PushNotificationManager;

