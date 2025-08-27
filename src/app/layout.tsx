
import type { Metadata } from 'next';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/header';
import Footer from '@/components/footer';
import './globals.css';
import PushNotificationManager from '@/components/push-notification-manager';
import { ThemeProvider } from '@/components/theme-provider';
import AdminLayout from '@/app/admin/layout';
import { headers } from 'next/headers';

export const metadata: Metadata = {
  title: {
    default: 'বার্তা নাও - আপনার প্রতিদিনের খবরের উৎস',
    template: '%s | বার্তা নাও',
  },
  description: 'ফায়ারবেস স্টুডিও দ্বারা তৈরি একটি আধুনিক নিউজ ওয়েবসাইটের জন্য একটি পেশাদার স্টার্টার প্রকল্প।',
  openGraph: {
    title: 'বার্তা নাও - সর্বশেষ সংবাদ ও বিশ্লেষণ',
    description: 'রাজনীতি, প্রযুক্তি, খেলা, বিনোদন, এবং আরও অনেক কিছুর উপর সর্বশেষ খবর ও আপডেট পান।',
    siteName: 'বার্তা নাও',
    locale: 'bn_BD',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'বার্তা নাও - সর্বশেষ সংবাদ ও বিশ্লেষণ',
    description: 'রাজনীতি, প্রযুক্তি, খেলা, বিনোদন, এবং আরও অনেক কিছুর উপর সর্বশেষ খবর ও আপডেট পান।',
  },
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = headers();
  const pathname = headersList.get('x-pathname') || '';
  const isAdminRoute = pathname.startsWith('/admin');

  return (
    <html lang="bn" dir="ltr" className="h-full" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Bengali:wght@400;700&family=Playfair+Display:wght@700&family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-background">
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
          {isAdminRoute ? (
             <AdminLayout>{children}</AdminLayout>
          ) : (
            <div className="flex flex-col min-h-screen">
              <PushNotificationManager />
              <Header />
              <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
              </main>
              <Footer />
            </div>
          )}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
