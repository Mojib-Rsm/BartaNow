
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import Link from "next/link"

export default function CreateAdPage() {
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>নতুন বিজ্ঞাপন যোগ করুন</CardTitle>
        <CardDescription>
          একটি নতুন বিজ্ঞাপন স্লট তৈরি করতে নিচের তথ্যগুলো পূরণ করুন। এই ফিচারটি এখনও নির্মাণাধীন।
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="ad-name">বিজ্ঞাপনের নাম</Label>
          <Input id="ad-name" placeholder="যেমন: হেডার ব্যানার" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="ad-placement">বিজ্ঞাপনের স্থান</Label>
          <Select>
            <SelectTrigger id="ad-placement">
              <SelectValue placeholder="স্থান নির্বাচন করুন" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="header">হেডার</SelectItem>
              <SelectItem value="sidebar_top">সাইডবার (উপরে)</SelectItem>
              <SelectItem value="sidebar_bottom">সাইডবার (নিচে)</SelectItem>
              <SelectItem value="in_article">আর্টিকেলের মধ্যে</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="ad-image">বিজ্ঞাপনের ছবি/স্ক্রিপ্ট</Label>
          <Input id="ad-image" placeholder="ইমেজ URL অথবা বিজ্ঞাপনের কোড" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="ad-target">টার্গেট URL</Label>
          <Input id="ad-target" placeholder="https://example.com" />
        </div>
        <div className="flex items-center space-x-2">
          <Switch id="ad-active" />
          <Label htmlFor="ad-active">বিজ্ঞাপনটি সক্রিয় থাকবে</Label>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="ghost" asChild>
            <Link href="/admin/ads">বাতিল করুন</Link>
          </Button>
          <Button disabled>সংরক্ষণ করুন (শীঘ্রই আসছে)</Button>
        </div>
      </CardContent>
    </Card>
  )
}
