
'use client';

import { useEffect, useState } from 'react';
import type { User, Notification } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { getNotificationsForUser } from '@/lib/api';
import { Loader2, Bell, AlertTriangle, Newspaper } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const iconMap = {
  breaking: <AlertTriangle className="h-5 w-5 text-destructive" />,
  topic: <Newspaper className="h-5 w-5 text-primary" />,
  system: <Bell className="h-5 w-5 text-muted-foreground" />,
};

export default function NotificationsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const storedUser = localStorage.getItem('bartaNowUser');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);

      const fetchNotifications = async (userId: string) => {
        try {
          const data = await getNotificationsForUser(userId);
          setNotifications(data);
        } catch (error) {
          toast({
            variant: 'destructive',
            title: 'ত্রুটি',
            description: 'নোটিফিকেশন আনতে সমস্যা হয়েছে।',
          });
        } finally {
          setLoading(false);
        }
      };

      fetchNotifications(parsedUser.id);
    } else {
      router.push('/login');
    }
  }, [router, toast]);

  const handleMarkAsRead = (notificationId: string) => {
    // In a real app, you would call a server action here to update the notification's `isRead` status.
    setNotifications(
      notifications.map(n => (n.id === notificationId ? { ...n, isRead: true } : n))
    );
  };
  
  if (loading) {
    return <div className="flex justify-center items-center h-full"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>নোটিফিকেশন সেন্টার</CardTitle>
        <CardDescription>আপনার জন্য সর্বশেষ সব আপডেট এখানে দেখুন।</CardDescription>
      </CardHeader>
      <CardContent>
        {notifications.length > 0 ? (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={cn(
                  "flex items-start gap-4 p-4 rounded-lg border transition-colors",
                  notification.isRead ? 'bg-transparent text-muted-foreground' : 'bg-muted/50'
                )}
              >
                <div className="mt-1">{iconMap[notification.type]}</div>
                <div className="flex-1">
                  <p className={cn("font-semibold", !notification.isRead && "text-foreground")}>
                    {notification.title}
                  </p>
                  <p className="text-sm">{notification.message}</p>
                   <div className="text-xs mt-1">
                    {new Date(notification.timestamp).toLocaleString('bn-BD', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                    {notification.articleSlug && (
                        <Link href={`/${notification.articleSlug}`} className="text-primary text-sm hover:underline">
                            দেখুন
                        </Link>
                    )}
                    {!notification.isRead && (
                        <button onClick={() => handleMarkAsRead(notification.id)} title="Mark as read">
                            <span className="block h-2.5 w-2.5 rounded-full bg-primary" />
                        </button>
                    )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 border-2 border-dashed rounded-lg">
            <Bell className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">কোনো নোটিফিকেশন নেই</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              আপনার জন্য কোনো নতুন আপডেট নেই।
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
