
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import Link from "next/link"

export default async function AdsManagementPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <div>
            <h1 className="text-3xl font-bold">বিজ্ঞাপন ম্যানেজমেন্ট</h1>
            <p className="text-muted-foreground">এখান থেকে ওয়েবসাইটের সব বিজ্ঞাপন পরিচালনা করুন।</p>
        </div>
        <Button asChild>
            <Link href="/admin/ads/create">
                <PlusCircle className="mr-2 h-4 w-4" />
                নতুন বিজ্ঞাপন যোগ করুন
            </Link>
        </Button>
      </div>
      <div className="text-center py-16 border-2 border-dashed rounded-lg">
        <p className="text-muted-foreground">এই ফিচারটি শীঘ্রই আসছে।</p>
        <p className="text-muted-foreground text-sm">বিজ্ঞাপন তালিকা এখানে দেখানো হবে।</p>
      </div>
    </div>
  )
}
