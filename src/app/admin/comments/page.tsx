
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import Link from "next/link"

export default async function CommentsManagementPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <div>
            <h1 className="text-3xl font-bold">মন্তব্য ও এনগেজমেন্ট</h1>
            <p className="text-muted-foreground">এখান থেকে ওয়েবসাইটের সব মন্তব্য অ্যাপ্রুভ, এডিট বা ডিলিট করুন।</p>
        </div>
      </div>
      <div className="text-center py-16 border-2 border-dashed rounded-lg">
        <p className="text-muted-foreground">এই ফিচারটি শীঘ্রই আসছে।</p>
        <p className="text-muted-foreground text-sm">মন্তব্য তালিকা এবং মডারেশন কিউ এখানে দেখানো হবে।</p>
      </div>
    </div>
  )
}
