
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ImportForm from './import-form';

export default function ImportPage() {
  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">WordPress থেকে ইম্পোর্ট করুন</h1>
        <p className="text-muted-foreground">আপনার WordPress সাইট থেকে কন্টেন্ট ইম্পোর্ট করতে XML ফাইল আপলোড করুন।</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>XML ফাইল আপলোড</CardTitle>
          <CardDescription>
            WordPress অ্যাডমিন প্যানেলের Tools &gt; Export থেকে আপনার সমস্ত কন্টেন্টের জন্য একটি এক্সপোর্ট ফাইল ডাউনলোড করুন এবং এখানে আপলোড করুন।
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ImportForm />
        </CardContent>
      </Card>
    </div>
  );
}
