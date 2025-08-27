import AuthForm from '@/components/auth-form';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'লগইন বা একাউন্ট তৈরি করুন',
  description: 'বার্তা নাও-তে লগইন করুন বা নতুন একাউন্ট তৈরি করে আমাদের সাথে যোগ দিন।',
};

export default function LoginPage() {
  return (
    <div className="flex justify-center items-center py-12">
      <div className="mx-auto grid w-[400px] gap-6">
        <div className="grid gap-2 text-center">
          <h1 className="text-3xl font-bold font-headline">বার্তা নাও-তে স্বাগতম</h1>
          <p className="text-balance text-muted-foreground">
            শুরু করতে আপনার তথ্য দিন
          </p>
        </div>
        <AuthForm />
      </div>
    </div>
  );
}
