'use client';

import { useState, useEffect } from 'react';

// Helper function to convert base64 string to Uint8Array
const urlBase64ToUint8Array = (base64String: string) => {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

export const usePushNotifications = () => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission>('default');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator && 'PushManager' in window) {
      setPermissionStatus(Notification.permission);
      navigator.serviceWorker.ready.then(registration => {
        registration.pushManager.getSubscription().then(sub => {
          if (sub) {
            setIsSubscribed(true);
            setSubscription(sub);
          }
          setLoading(false);
        });
      });
    } else {
        setLoading(false);
    }
  }, []);

  const subscribe = async (): Promise<boolean> => {
    if (!process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY) {
      console.error('VAPID public key is not set.');
      return false;
    }
    
    setLoading(true);
    const consent = await Notification.requestPermission();
    setPermissionStatus(consent);

    if (consent !== 'granted') {
      setLoading(false);
      return false;
    }

    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY),
      });

      await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sub),
      });

      setSubscription(sub);
      setIsSubscribed(true);
      setLoading(false);
      return true;
    } catch (error) {
      console.error('Failed to subscribe the user: ', error);
      setLoading(false);
      return false;
    }
  };

  const unsubscribe = async () => {
    if (!subscription) return;
    setLoading(true);
    try {
      await subscription.unsubscribe();
      // You might also want to notify your server to remove the subscription
      // await fetch('/api/push/unsubscribe', { ... });
      setSubscription(null);
      setIsSubscribed(false);
    } catch (error) {
        console.error('Failed to unsubscribe:', error);
    } finally {
        setLoading(false);
    }
  };

  return {
    isSubscribed,
    subscribe,
    unsubscribe,
    userConsent: permissionStatus,
    permissionStatus,
    loading,
  };
};
