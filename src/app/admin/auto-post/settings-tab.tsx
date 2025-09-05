
'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function SettingsTab() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const form = useForm({
    defaultValues: {
      autoPostEnabled: true,
      frequency: '30',
      categories: ['রাজনীতি', 'খেলা'],
      postLength: '700',
      language: 'Bangla',
      maxPostsPerDay: 50,
    }
  });

  const onSubmit = (data: any) => {
    setIsLoading(true);
    console.log(data);
    // In a real app, this would save to a database.
    setTimeout(() => {
      toast({
        title: "সফল",
        description: "অটো-পোস্ট সেটিংস সফলভাবে সংরক্ষণ করা হয়েছে।",
      });
      setIsLoading(false);
    }, 1500);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>সাধারণ সেটিংস</CardTitle>
          <CardDescription>
            অটো-পোস্ট ফিচারটি চালু বা বন্ধ করুন এবং পোস্ট তৈরির সাধারণ নিয়মাবলী সেট করুন।
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-2">
            <Controller
              name="autoPostEnabled"
              control={form.control}
              render={({ field }) => (
                <Switch
                  id="autoPostEnabled"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
            <Label htmlFor="autoPostEnabled">অটো-পোস্ট চালু করুন</Label>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>পোস্ট ফ্রিকোয়েন্সি</Label>
              <Controller
                name="frequency"
                control={form.control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger><SelectValue placeholder="সময় নির্ধারণ করুন" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">প্রতি ১০ মিনিট</SelectItem>
                      <SelectItem value="15">প্রতি ১৫ মিনিট</SelectItem>
                      <SelectItem value="30">প্রতি ৩০ মিনিট</SelectItem>
                      <SelectItem value="60">প্রতি ১ ঘণ্টা</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className="space-y-2">
                <Label htmlFor="maxPostsPerDay">প্রতিদিন সর্বোচ্চ পোস্ট</Label>
                <Input
                    id="maxPostsPerDay"
                    type="number"
                    {...form.register('maxPostsPerDay', { valueAsNumber: true })}
                />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>কনটেন্ট রুলস</CardTitle>
          <CardDescription>
            কোন ক্যাটাগরিতে, কোন ভাষায় এবং কী ধরনের কনটেন্ট তৈরি হবে তা নির্ধারণ করুন।
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label>ক্যাটাগরি</Label>
            <p className="text-sm text-muted-foreground"> (মাল্টি-সিলেক্ট ফিচার শীঘ্রই আসছে)</p>
             <Controller
                name="categories"
                control={form.control}
                render={({ field }) => (
                    <Select onValueChange={(val) => field.onChange([val])} defaultValue={field.value[0]}>
                        <SelectTrigger><SelectValue placeholder="ক্যাটাগরি নির্বাচন করুন" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="রাজনীতি">রাজনীতি</SelectItem>
                            <SelectItem value="খেলা">খেলা</SelectItem>
                            <SelectItem value="প্রযুক্তি">প্রযুক্তি</SelectItem>
                            <SelectItem value="বিনোদন">বিনোদন</SelectItem>
                            <SelectItem value="আন্তর্জাতিক">আন্তর্জাতিক</SelectItem>
                        </SelectContent>
                    </Select>
                )}
                />
          </div>
          <div className="space-y-2">
            <Label>আর্টিকেলের দৈর্ঘ্য</Label>
             <Controller
                name="postLength"
                control={form.control}
                render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger><SelectValue placeholder="দৈর্ঘ্য নির্বাচন করুন" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="700">~৭০০ শব্দ</SelectItem>
                            <SelectItem value="1000">~১০০০ শব্দ</SelectItem>
                            <SelectItem value="1500">~১৫০০ শব্দ</SelectItem>
                            <SelectItem value="2000">~২০০০ শব্দ</SelectItem>
                        </SelectContent>
                    </Select>
                )}
                />
          </div>
          <div className="space-y-2">
            <Label>ভাষা</Label>
             <Controller
                name="language"
                control={form.control}
                render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger><SelectValue placeholder="ভাষা নির্বাচন করুন" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Bangla">বাংলা</SelectItem>
                            <SelectItem value="English">ইংরেজি</SelectItem>
                        </SelectContent>
                    </Select>
                )}
              />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          সেটিংস সংরক্ষণ করুন
        </Button>
      </div>
    </form>
  );
}

