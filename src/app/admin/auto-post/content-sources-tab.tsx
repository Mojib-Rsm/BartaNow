'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export function ContentSourcesTab() {
  const [manualKeywords, setManualKeywords] = useState("বাংলাদেশ ক্রিকেট, নতুন স্মার্টফোন, শেয়ার বাজার, আন্তর্জাতিক রাজনীতি");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSave = () => {
    setIsLoading(true);
    // In a real app, this would save to a database.
    setTimeout(() => {
      toast({
        title: "সফল",
        description: "কীওয়ার্ড তালিকা সফলভাবে সংরক্ষণ করা হয়েছে।",
      });
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>কীওয়ার্ড তালিকা (ম্যানুয়াল)</CardTitle>
          <CardDescription>
            অটো-পোস্টের জন্য বিষয়বস্তু বা কীওয়ার্ডগুলো কমা দিয়ে আলাদা করে নিচে লিখুন। সিস্টেম এখান থেকে একটি কীওয়ার্ড বেছে নিয়ে আর্টিকেল তৈরি করবে।
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2">
            <Label htmlFor="manualKeywords">কীওয়ার্ডের তালিকা</Label>
            <Textarea
              id="manualKeywords"
              value={manualKeywords}
              onChange={(e) => setManualKeywords(e.target.value)}
              rows={6}
              placeholder="e.g., Bangladesh cricket, new smartphones, stock market"
            />
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          সংরক্ষণ করুন
        </Button>
      </div>
    </div>
  );
}
