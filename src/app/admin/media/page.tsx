
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import Link from "next/link"

export default async function MediaManagementPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <div>
            <h1 className="text-3xl font-bold">মিডিয়া ম্যানেজমেন্ট</h1>
            <p className="text-muted-foreground">এখান থেকে ওয়েবসাইটের সব ছবি, ভিডিও এবং অন্যান্য মিডিয়া পরিচালনা করুন।</p>
        </div>
        <Button asChild>
            <Link href="/admin/media/upload">
                <PlusCircle className="mr-2 h-4 w-4" />
                নতুন মিডিয়া যোগ করুন
            </Link>
        </Button>
      </div>
      <div className="text-center py-16 border-2 border-dashed rounded-lg">
        <p className="text-muted-foreground">এই ফিচারটি শীঘ্রই আসছে।</p>
        <p className="text-muted-foreground text-sm">মিডিয়া লাইব্রেরি এখানে দেখানো হবে।</p>
      </div>
    </div>
  )
}
