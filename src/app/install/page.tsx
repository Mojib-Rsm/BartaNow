
'use client';

import { seedAction } from '@/app/actions';
import { useState } from 'react';
import { Rocket, CheckCircle, AlertTriangle, User, Key, Database, Building, Lock, Mail, Clapperboard, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

export type InstallFormData = {
  siteName: string;
  tagline: string;
  adminName: string;
  adminEmail: string;
  adminPassword: string;
  dbType: 'firestore' | 'mock' | 'postgresql';
  dbHost?: string;
  dbName?: string;
  dbUser?: string;
  dbPassword?: string;
};

const STEPS = [
  { id: 1, title: 'স্বাগতম' },
  { id: 2, title: 'সাইটের তথ্য' },
  { id: 3, title: 'অ্যাডমিন অ্যাকাউন্ট' },
  { id: 4, title: 'ডেটাবেস সেটআপ' },
  { id: 5, title: 'পর্যালোচনা ও ইন্সটল' },
];

export default function InstallPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [formData, setFormData] = useState<InstallFormData>({
      siteName: 'বার্তা নাও',
      tagline: 'আপনার প্রতিদিনের খবরের উৎস',
      adminName: 'Admin User',
      adminEmail: 'admin@bartanow.com',
      adminPassword: 'password123',
      dbType: 'firestore',
      dbHost: 'localhost',
      dbName: 'bartanow_db',
      dbUser: 'root',
      dbPassword: ''
  });
  const { toast } = useToast();

  const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, STEPS.length));
  const handlePrev = () => setCurrentStep(prev => Math.max(prev - 1, 1));
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRadioChange = (value: 'firestore' | 'mock' | 'postgresql') => {
      setFormData(prev => ({ ...prev, dbType: value }));
  }

  const handleInstall = async () => {
    setIsLoading(true);
    toast({ title: 'ইন্সটলেশন শুরু হচ্ছে...', description: 'অনুগ্রহ করে অপেক্ষা করুন, ডেটাবেস প্রস্তুত করা হচ্ছে।' });

    try {
      // Pass the form data to the seed action
      const actionResult = await seedAction(formData);

      if (actionResult.success) {
        toast({
          title: 'ইন্সটলেশন সফল!',
          description: 'আপনাকে অ্যাডমিন ড্যাশবোর্ডে নিয়ে যাওয়া হচ্ছে...',
          duration: 5000,
        });
        setCurrentStep(prev => prev + 1); 
      } else {
        toast({
          variant: 'destructive',
          title: 'ইন্সটলেশন ব্যর্থ',
          description: actionResult.message,
          duration: 9000,
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'একটি অপ্রত্যাশিত ত্রুটি ঘটেছে।';
      toast({
        variant: 'destructive',
        title: 'মারাত্মক ত্রুটি',
        description: errorMessage,
        duration: 9000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const progress = (currentStep / STEPS.length) * 100;

  return (
    <div className="container mx-auto flex min-h-[calc(100vh-15rem)] items-center justify-center py-12">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <Progress value={progress} className="mb-4" />
          <CardTitle className="text-2xl font-headline flex items-center gap-2">
            <Rocket className="h-6 w-6 text-primary" />
            <span>বার্তা নাও ইন্সটলার</span>
          </CardTitle>
          <CardDescription>
            ধাপ {new Intl.NumberFormat('bn-BD').format(currentStep)} / {new Intl.NumberFormat('bn-BD').format(STEPS.length)}: {STEPS[currentStep - 1]?.title || 'সম্পন্ন'}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="min-h-[300px]">
          {currentStep === 1 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">আপনার নিউজ পোর্টালে স্বাগতম!</h2>
              <p className="text-muted-foreground">
                এই ইন্সটলারটি আপনাকে কয়েকটি সহজ ধাপে আপনার ওয়েবসাইট সেটআপ করতে সাহায্য করবে। শুরু করার জন্য প্রস্তুত?
              </p>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="siteName" className="flex items-center gap-2"><Building className="h-4 w-4" /> সাইটের নাম</Label>
                    <Input id="siteName" name="siteName" value={formData.siteName} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="tagline" className="flex items-center gap-2"><Clapperboard className="h-4 w-4" /> ট্যাগলাইন</Label>
                    <Input id="tagline" name="tagline" value={formData.tagline} onChange={handleChange} />
                </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="adminName" className="flex items-center gap-2"><User className="h-4 w-4" /> আপনার নাম</Label>
                    <Input id="adminName" name="adminName" value={formData.adminName} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="adminEmail" className="flex items-center gap-2"><Mail className="h-4 w-4" /> ইমেইল অ্যাড্রেস</Label>
                    <Input id="adminEmail" type="email" name="adminEmail" value={formData.adminEmail} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="adminPassword" className="flex items-center gap-2"><Lock className="h-4 w-4" /> পাসওয়ার্ড</Label>
                    <Input id="adminPassword" type="password" name="adminPassword" value={formData.adminPassword} onChange={handleChange} />
                </div>
            </div>
          )}
          
          {currentStep === 4 && (
            <div className="space-y-6">
                <div className="space-y-2">
                    <Label className="flex items-center gap-2"><Database className="h-4 w-4" /> ডেটাবেস টাইপ</Label>
                    <RadioGroup value={formData.dbType} onValueChange={handleRadioChange} className="flex flex-wrap gap-4 pt-2">
                         <div className="flex items-center space-x-2">
                            <RadioGroupItem value="firestore" id="firestore" />
                            <Label htmlFor="firestore">Firebase Firestore (Recommended)</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="postgresql" id="postgresql" />
                            <Label htmlFor="postgresql">PostgreSQL</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="mock" id="mock" />
                            <Label htmlFor="mock">Local Mock DB (For Demo)</Label>
                        </div>
                    </RadioGroup>
                </div>

                {formData.dbType === 'postgresql' && (
                     <div className="space-y-6 border-t pt-6">
                         <p className="text-sm text-muted-foreground">আপনার PostgreSQL ডেটাবেসের তথ্য দিন। এই ফিচারটি এখনো নির্মাণাধীন।</p>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="dbHost">Database Host</Label>
                                <Input id="dbHost" name="dbHost" value={formData.dbHost} onChange={handleChange} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="dbName">Database Name</Label>
                                <Input id="dbName" name="dbName" value={formData.dbName} onChange={handleChange} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="dbUser">Username</Label>
                                <Input id="dbUser" name="dbUser" value={formData.dbUser} onChange={handleChange} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="dbPassword">Password</Label>
                                <Input id="dbPassword" type="password" name="dbPassword" value={formData.dbPassword} onChange={handleChange} />
                            </div>
                        </div>
                        <Button type="button" variant="outline" disabled>Test Connection</Button>
                    </div>
                )}
            </div>
          )}
          
          {currentStep === 5 && (
            <div className="space-y-4">
                <h3 className="font-semibold text-lg">পর্যালোচনা করুন</h3>
                <p className="text-muted-foreground">অনুগ্রহ করে নিশ্চিত করুন যে সমস্ত তথ্য সঠিক আছে। "Install Now" বাটনে ক্লিক করলে আপনার ডেটাবেস সেটআপ হবে এবং অ্যাডমিন ব্যবহারকারী তৈরি হবে।</p>
                <ul className="space-y-2 rounded-lg border p-4">
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500" /><strong>সাইটের নাম:</strong> {formData.siteName}</li>
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500" /><strong>ট্যাগলাইন:</strong> {formData.tagline}</li>
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500" /><strong>অ্যাডমিন নাম:</strong> {formData.adminName}</li>
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500" /><strong>অ্যাডমিন ইমেইল:</strong> {formData.adminEmail}</li>
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500" /><strong>ডেটাবেস:</strong> {formData.dbType === 'firestore' ? 'Firebase Firestore' : formData.dbType === 'postgresql' ? 'PostgreSQL' : 'Local Mock DB'}</li>
                </ul>
            </div>
          )}

          {currentStep > STEPS.length && (
               <div className="text-center space-y-4">
                    <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
                    <h2 className="text-2xl font-bold">ইন্সটলেশন সফল!</h2>
                    <p className="text-muted-foreground">আপনার ওয়েবসাইট এখন ব্যবহারের জন্য প্রস্তুত। অ্যাডমিন প্যানেলে যেতে নিচের বাটনে ক্লিক করুন।</p>
                    <Button onClick={() => router.push('/admin')}>অ্যাডমিন ড্যাশবোর্ডে যান</Button>
                </div>
          )}

        </CardContent>
        
        {currentStep <= STEPS.length && (
            <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={handlePrev} disabled={currentStep === 1 || isLoading}>
              পূর্ববর্তী
            </Button>
            
            {currentStep < STEPS.length ? (
              <Button onClick={handleNext}>
                পরবর্তী
              </Button>
            ) : (
              <Button onClick={handleInstall} disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? 'ইন্সটল হচ্ছে...' : 'এখনই ইন্সটল করুন'}
              </Button>
            )}
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
