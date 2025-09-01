
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default async function SocialManagementPage() {
  return (
    <div className="w-full space-y-6">
      <div>
        <h1 className="text-3xl font-bold">সোশ্যাল মিডিয়া ম্যানেজমেন্ট</h1>
        <p className="text-muted-foreground">এখান থেকে আপনার সোশ্যাল মিডিয়া প্রোফাইল এবং শেয়ারিং অপশন পরিচালনা করুন।</p>
      </div>

       <Card>
        <CardHeader>
          <CardTitle>সোশ্যাল মিডিয়া লিংক</CardTitle>
          <CardDescription>
            আপনার সোশ্যাল মিডিয়া পেজের লিংকগুলো যোগ করুন। এগুলো সাইটের ফুটার এবং অন্যান্য জায়গায় ব্যবহৃত হবে।
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="facebookUrl">ফেসবুক URL</Label>
            <Input id="facebookUrl" placeholder="https://facebook.com/yourpage" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="twitterUrl">টুইটার (X) URL</Label>
            <Input id="twitterUrl" placeholder="https://twitter.com/yourhandle" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="youtubeUrl">ইউটিউব URL</Label>
            <Input id="youtubeUrl" placeholder="https://youtube.com/yourchannel" />
          </div>
           <div className="space-y-2">
            <Label htmlFor="instagramUrl">ইনস্টাগ্রাম URL</Label>
            <Input id="instagramUrl" placeholder="https://instagram.com/yourprofile" />
          </div>
        </CardContent>
        <CardContent>
            <Button>সংরক্ষণ করুন</Button>
        </CardContent>
      </Card>

      <div className="text-center py-16 border-2 border-dashed rounded-lg mt-8">
        <p className="text-muted-foreground">ভবিষ্যতে এখানে আরও সোশ্যাল মিডিয়া ইন্টিগ্রেশন ফিচার যোগ করা হবে।</p>
        <p className="text-muted-foreground text-sm">যেমন: অটো-পোস্টিং, সোশ্যাল ফিড ইত্যাদি।</p>
      </div>
    </div>
  )
}
