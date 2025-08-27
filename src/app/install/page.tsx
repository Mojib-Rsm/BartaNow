
'use client';

import { useState } from 'react';
import { Rocket, CheckCircle, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { seedAction } from '@/app/actions';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"

const isAwsConfigured = process.env.NEXT_PUBLIC_AWS_CONFIGURED === 'true';

export default function InstallPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const { toast } = useToast();

  const handleSeed = async () => {
    setIsLoading(true);
    setResult(null);
    try {
      const actionResult = await seedAction();
      setResult(actionResult);

      if (actionResult.success) {
        toast({
          title: 'সফল',
          description: actionResult.message,
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'ত্রুটি',
          description: actionResult.message,
          duration: 9000,
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'একটি অপ্রত্যাশিত ত্রুটি ঘটেছে।';
      setResult({ success: false, message: errorMessage });
      toast({
        variant: 'destructive',
        title: 'ত্রুটি',
        description: errorMessage,
        duration: 9000,
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const awsWarning = "AWS credentials are not configured in your .env file. Seeding will use mock data locally and will not affect a real database. To seed a real DynamoDB database, please add your AWS credentials to the .env file at the root of the project.";

  return (
    <div className="container mx-auto flex min-h-[calc(100vh-20rem)] items-center justify-center py-12">
        <Card className="w-full max-w-lg">
            <CardHeader>
                <CardTitle className="text-2xl font-headline">ডেমো ডেটা ইন্সটল করুন</CardTitle>
                <CardDescription>
                    এই বাটনে ক্লিক করে আপনার ডেটাবেসে ডেমো আর্টিকেলগুলো যোগ করুন। এটি আপনার সাইটকে প্রাথমিক কন্টেন্ট দিয়ে চালু করতে সাহায্য করবে।
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                 {!isAwsConfigured && (
                    <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>AWS কনফিগার করা নেই</AlertTitle>
                        <AlertDescription>
                            আপনার `.env` ফাইলে AWS ক্রেডেনশিয়াল সেট করা নেই। সিডিং প্রক্রিয়াটি শুধুমাত্র লোকাল মক ডেটা ব্যবহার করবে, কোনো রিয়েল ডেটাবেস প্রভাবিত হবে না।
                        </AlertDescription>
                    </Alert>
                )}
                <Button onClick={handleSeed} disabled={isLoading} className="w-full">
                    <Rocket className="mr-2 h-4 w-4" />
                    {isLoading ? 'ডেটা সিডিং চলছে...' : 'ডেমো ডেটা সিড করুন'}
                </Button>
            </CardContent>
            {result && (
                 <CardFooter>
                    <Alert variant={result.success ? "default" : "destructive"} className="w-full">
                       {result.success ? <CheckCircle className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
                        <AlertTitle>{result.success ? 'সফল' : 'ব্যর্থ'}</AlertTitle>
                        <AlertDescription>
                            {result.message}
                        </AlertDescription>
                    </Alert>
                </CardFooter>
            )}
        </Card>
    </div>
  );
}
