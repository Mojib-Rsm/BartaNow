
import type { Metadata } from 'next';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/header';
import Footer from '@/components/footer';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import GoogleAnalytics from '@/components/google-analytics';
import { headers } from 'next/headers';

export const metadata: Metadata = {
  title: {
    default: 'BartaNow | বার্তা নাও - আপনার প্রতিদিনের খবরের উৎস',
    template: '%s | BartaNow - বার্তা নাও',
  },
  description: 'ফায়ারবেস স্টুডিও দ্বারা তৈরি একটি আধুনিক নিউজ ওয়েবসাইটের জন্য একটি পেশাদার স্টার্টার প্রকল্প।',
  openGraph: {
    title: 'BartaNow | বার্তা নাও - সর্বশেষ সংবাদ ও বিশ্লেষণ',
    description: 'রাজনীতি, প্রযুক্তি, খেলা, বিনোদন, এবং আরও অনেক কিছুর উপর সর্বশেষ খবর ও আপডেট পান।',
    siteName: 'BartaNow | বার্তা নাও',
    locale: 'bn_BD',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BartaNow | বার্তা নাও - সর্বশেষ সংবাদ ও বিশ্লেষণ',
    description: 'রাজনীতি, প্রযুক্তি, খেলা, বিনোদন, এবং আরও অনেক কিছুর উপর সর্বশেষ খবর ও আপডেট পান।',
  },
  manifest: '/manifest.json',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://www.bartanow.com'),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    const headersList = headers();
    const pathname = headersList.get('x-pathname') || '';
    const isAdminRoute = pathname.startsWith('/admin');

    if (isAdminRoute) {
        return (
             <html lang="bn" dir="ltr" className="h-full" suppressHydrationWarning>
                <body className="h-full">
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="system"
                        enableSystem
                        disableTransitionOnChange
                    >
                         {children}
                         <Toaster />
                    </ThemeProvider>
                </body>
             </html>
        )
    }

    return (
        <html lang="bn" dir="ltr" className="h-full" suppressHydrationWarning>
        <head>
            {/* The default title is set in metadata, but this is a fallback. */}
            <title>BartaNow | বার্তা নাও - আপনার প্রতিদিনের খবরের উৎস</title>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Bengali:wght@400;700&family=Playfair+Display:wght@700&family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
            <link rel="manifest" href="/manifest.json" />
        </head>
        <body className="h-full">
            <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
            >
            {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
                <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
            )}
            
            <div className="font-body antialiased bg-background flex flex-col min-h-screen">
                <Header />
                <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
                    {children}
                </main>
                <Footer />
            </div>

            <Toaster />
            </ThemeProvider>
        </body>
        </html>
    );
}

