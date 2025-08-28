
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import NotificationForm from './notification-form';

export default function NotificationsPage() {
  return (
    <div className="w-full">
        <div className="flex justify-between items-center mb-6">
            <div>
                <h1 className="text-3xl font-bold">নোটিফিকেশন ও সতর্কতা</h1>
                <p className="text-muted-foreground">এখান থেকে ব্যবহারকারীদের কাছে ব্রেকিং নিউজ বা অন্য কোনো বার্তা পাঠান।</p>
            </div>
        </div>
        <Card>
            <CardHeader>
                <CardTitle>নতুন নোটিফিকেশন পাঠান</CardTitle>
                <CardDescription>
                    নিচের ফর্মটি পূরণ করে সকল সাবস্ক্রাইব করা ব্যবহারকারীকে পুশ নোটিফিকেশন পাঠান।
                </CardDescription>
            </CardHeader>
            <CardContent>
                <NotificationForm />
            </CardContent>
        </Card>
    </div>
  );
}
