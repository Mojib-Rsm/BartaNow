
import type { Metadata } from 'next';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import ContactForm from '@/components/contact-form';

export const metadata: Metadata = {
  title: 'যোগাযোগ করুন',
  description: 'আমাদের সাথে যোগাযোগ করতে ফর্মটি পূরণ করুন।',
};

export default function ContactPage() {
  return (
    <div className="container mx-auto max-w-3xl py-12">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-headline">যোগাযোগ করুন</CardTitle>
          <CardDescription>
            আপনার যেকোনো প্রশ্ন, মতামত বা পরামর্শের জন্য আমরা সর্বদা প্রস্তুত। নিচের ফর্মটি পূরণ করুন।
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ContactForm />
        </CardContent>
      </Card>
    </div>
  );
}
