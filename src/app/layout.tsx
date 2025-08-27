
import type { Metadata } from 'next';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/header';
import Footer from '@/components/footer';
import './globals.css';
import PushNotificationManager from '@/components/push-notification-manager';
import { ThemeProvider } from '@/components/theme-provider';
import AdminLayout from '@/app/admin/layout';

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
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { slug: string[] };
}>) {
  // A simple way to check if we are in the admin route based on the URL segment.
  // In a real app, you might have a more robust way to handle layouts.
  // This logic now correctly checks the route from the childProp passed by Next.js
  const isAdminRoute =
    typeof children === 'object' &&
    children &&
    'props' in children &&
    (children.props as any).childProp?.segment === 'admin';

  return (
    <html lang={isAdminRoute ? 'en' : 'bn'} dir={isAdminRoute ? 'ltr' : 'rtl'} className="h-full" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Bengali:wght@400;700&family=Playfair+Display:wght@700&family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased flex flex-col min-h-screen bg-background">
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
          {isAdminRoute ? (
             <AdminLayout>
                {children}
            </AdminLayout>
          ) : (
            <>
              <PushNotificationManager />
              <Header />
              <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
              </main>
              <Footer />
            </>
          )}
            <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
