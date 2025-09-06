
import type { Metadata } from 'next';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/header';
import Footer from '@/components/footer';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import GoogleAnalytics from '@/components/google-analytics';
import { headers } from 'next/headers';
import { Noto_Sans_Bengali, Playfair_Display, PT_Sans } from 'next/font/google'

const noto_sans_bengali = Noto_Sans_Bengali({
  subsets: ['bengali'],
  display: 'swap',
  variable: '--font-noto-sans-bengali',
})
 
const playfair_display = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-playfair-display',
})
 
const pt_sans = PT_Sans({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
  variable: '--font-pt-sans',
})


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
    const isSpecialRoute = pathname.startsWith('/admin') || pathname.startsWith('/login') || pathname.startsWith('/install');

    return (
        <html lang="bn" dir="ltr" className={`${noto_sans_bengali.variable} ${playfair_display.variable} ${pt_sans.variable} h-full`} suppressHydrationWarning>
        <head>
            <title>BartaNow | বার্তা নাও - আপনার প্রতিদিনের খবরের উৎস</title>
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
            
            {isSpecialRoute ? (
                 <div className="h-full bg-muted/40">
                    {children}
                 </div>
            ) : (
                <div className="font-body antialiased bg-background flex flex-col min-h-screen">
                    <Header />
                    <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
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

    