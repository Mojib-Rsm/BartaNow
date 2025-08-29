
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import WriterForm from './writer-form';

export default function AiWriterPage() {
  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">AI কনটেন্ট রাইটার</h1>
        <p className="text-muted-foreground">এখানে একটি বিষয় বা শিরোনাম লিখে দিন, এআই আপনার জন্য একটি পূর্ণাঙ্গ আর্টিকেল তৈরি করে দেবে।</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>আর্টিকেল তৈরি করুন</CardTitle>
          <CardDescription>
            নিচের বক্সে আপনার কাঙ্ক্ষিত আর্টিকেলের বিষয় লিখুন এবং &quot;আর্টিকেল তৈরি করুন&quot; বাটনে ক্লিক করুন।
          </CardDescription>
        </CardHeader>
        <CardContent>
          <WriterForm />
        </CardContent>
      </Card>
    </div>
  );
}
