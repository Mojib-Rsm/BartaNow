
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function SettingsPage() {
  return (
    <div className="w-full space-y-6">
      <div>
        <h1 className="text-3xl font-bold">সেটিংস ও কনফিগারেশন</h1>
        <p className="text-muted-foreground">এখান থেকে ওয়েবসাইটের সাধারণ সেটিংস, এসইও, এবং অন্যান্য বিষয় পরিচালনা করুন।</p>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">সাধারণ</TabsTrigger>
          <TabsTrigger value="seo">এসইও</TabsTrigger>
          <TabsTrigger value="social">সোশ্যাল মিডিয়া</TabsTrigger>
          <TabsTrigger value="advanced">অ্যাডভান্সড</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>সাধারণ সেটিংস</CardTitle>
              <CardDescription>সাইটের নাম, লোগো এবং পরিচিতি পরিবর্তন করুন। এই পরিবর্তনগুলো পুরো সাইটে প্রতিফলিত হবে।</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="siteTitle">সাইটের শিরোনাম</Label>
                <Input id="siteTitle" defaultValue="বার্তা নাও" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="siteTagline">সাইটের ট্যাগলাইন</Label>
                <Input id="siteTagline" defaultValue="আপনার প্রতিদিনের খবরের উৎস" />
              </div>
               <div className="space-y-2">
                <Label htmlFor="logo">লোগো</Label>
                <Input id="logo" type="file" />
                <p className="text-sm text-muted-foreground">সেরা ফলাফলের জন্য PNG, JPG বা SVG ফাইল আপলোড করুন।</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button>সংরক্ষণ করুন</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="seo">
          <Card>
            <CardHeader>
              <CardTitle>এসইও সেটিংস</CardTitle>
              <CardDescription>সার্চ ইঞ্জিনে আপনার সাইটের র‍্যাঙ্কিং উন্নত করতে হোমপেজের জন্য মেটা টাইটেল এবং ডেসক্রিপশন সেট করুন।</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="seoTitle">মেটা শিরোনাম</Label>
                <Input id="seoTitle" defaultValue="বার্তা নাও - সর্বশেষ সংবাদ ও বিশ্লেষণ" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="seoDescription">মেটা ডেসক্রিপশন</Label>
                <Input id="seoDescription" defaultValue="রাজনীতি, প্রযুক্তি, খেলা, বিনোদন, এবং আরও অনেক কিছুর উপর সর্বশেষ খবর ও আপডেট পান।" />
              </div>
            </CardContent>
             <CardFooter>
              <Button>সংরক্ষণ করুন</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="social">
            <Card>
                <CardHeader>
                <CardTitle>সোশ্যাল মিডিয়া ইন্টিগ্রেশন</CardTitle>
                <CardDescription>আপনার সোশ্যাল মিডিয়া পেজের লিংকগুলো যোগ করুন। এগুলো সাইটের ফুটার এবং শেয়ার বাটনগুলোতে ব্যবহৃত হবে।</CardDescription>
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
                </CardContent>
                <CardFooter>
                <Button>সংরক্ষণ করুন</Button>
                </CardFooter>
            </Card>
        </TabsContent>
        
        <TabsContent value="advanced">
            <Card className="border-destructive">
                <CardHeader>
                <CardTitle className="text-destructive">মেইনটেন্যান্স মোড</CardTitle>
                <CardDescription>
                    এটি চালু করলে সাধারণ ব্যবহারকারীরা আপনার সাইট দেখতে পারবেন না। শুধুমাত্র অ্যাডমিন লগইন করতে পারবেন। সাইটে বড় কোনো পরিবর্তনের সময় এটি ব্যবহার করুন।
                </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center space-x-2">
                        <Switch id="maintenance-mode" />
                        <Label htmlFor="maintenance-mode">মেইনটেন্যান্স মোড চালু করুন</Label>
                    </div>
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>

    </div>
  );
}
