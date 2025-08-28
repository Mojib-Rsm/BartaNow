import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import Link from "next/link"

export default async function AppearanceManagementPage() {
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <div>
            <h1 className="text-3xl font-bold">থিম ও মেন্যু কাস্টমাইজেশন</h1>
            <p className="text-muted-foreground">এখান থেকে ওয়েবসাইটের মেন্যু, থিম এবং অন্যান্য ظاهরি বিষয় পরিচালনা করুন।</p>
        </div>
        <Button asChild>
            <Link href="/admin/appearance/menu">
                <PlusCircle className="mr-2 h-4 w-4" />
                নতুন মেন্যু তৈরি করুন
            </Link>
        </Button>
      </div>
      <div className="text-center py-16 border-2 border-dashed rounded-lg">
        <p className="text-muted-foreground">ড্র্যাগ-অ্যান্ড-ড্রপ মেন্যু বিল্ডার ফিচারটি শীঘ্রই আসছে।</p>
        <p className="text-muted-foreground text-sm">আপনার প্রধান মেন্যু এখন ডাটাবেস থেকে ডাইনামিকভাবে লোড হচ্ছে।</p>
      </div>
    </div>
  )
}
