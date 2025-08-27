import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'সাবস্ক্রাইব করুন',
  description: 'বার্তা নাও-এর প্রিমিয়াম সেবা পেতে সাবস্ক্রাইব করুন।',
};

const tiers = [
  {
    name: 'মাসিক',
    price: '৳১০০',
    period: '/ মাস',
    features: [
      'সকল প্রিমিয়াম আর্টিকেল পড়ুন',
      'বিজ্ঞাপন ছাড়া পড়ার অভিজ্ঞতা',
      'বিশেষ নিউজলেটারে অ্যাক্সেস',
      'মাসিক সাপোর্টার ব্যাজ',
    ],
    buttonText: 'মাসিক প্ল্যান বেছে নিন',
    variant: 'outline' as const,
  },
  {
    name: 'বাৎসরিক',
    price: '৳১০০০',
    period: '/ বছর',
    features: [
      'মাসিক প্ল্যানের সবকিছু',
      'দুটি মাস বিনামূল্যে!',
      'বিশেষ ইভেন্টে আমন্ত্রণ',
      'বার্ষিক সাপোর্টার ব্যাজ',
    ],
    buttonText: 'বাৎসরিক প্ল্যান বেছে নিন',
    variant: 'default' as const,
  },
  {
    name: 'আজীবন',
    price: '৳৫০০০',
    period: ' (এককালীন)',
    features: [
      'বাৎসরিক প্ল্যানের সবকিছু',
      'আজীবন অ্যাক্সেস',
      'সম্পাদকের সাথে সরাসরি যোগাযোগ',
      'আজীবন সাপোর্টার ব্যাজ',
    ],
    buttonText: 'আজীবন সাপোর্টার হন',
    variant: 'outline' as const,
  },
];

export default function SubscribePage() {
  return (
    <div className="container mx-auto py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold font-headline text-primary">আমাদের সেবা সাবস্ক্রাইব করুন</h1>
        <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
          স্বাধীন সাংবাদিকতাকে সমর্থন করুন এবং সেরা পড়ার অভিজ্ঞতা উপভোগ করুন। আপনার পছন্দের প্ল্যানটি বেছে নিন।
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {tiers.map((tier) => (
          <Card key={tier.name} className={`flex flex-col ${tier.variant === 'default' ? 'border-primary shadow-lg' : ''}`}>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-headline">{tier.name}</CardTitle>
              <CardDescription>
                <span className="text-4xl font-bold">{tier.price}</span>
                <span className="text-muted-foreground">{tier.period}</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <ul className="space-y-3">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-green-500" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full" variant={tier.variant}>
                {tier.buttonText}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
       <div className="text-center mt-12 text-sm text-muted-foreground">
        <p>যেকোনো প্ল্যান যেকোনো সময় বাতিল করা যাবে।</p>
      </div>
    </div>
  );
}
