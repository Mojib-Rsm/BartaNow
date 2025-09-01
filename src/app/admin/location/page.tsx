
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import Link from "next/link"

export default async function LocationManagementPage() {
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <div>
            <h1 className="text-3xl font-bold">লোকেশন ম্যানেজমেন্ট</h1>
            <p className="text-muted-foreground">এখান থেকে বিভিন্ন বিভাগ, জেলা ও শহরভিত্তিক কনটেন্ট পরিচালনা করুন।</p>
        </div>
        <Button asChild>
            <Link href="/admin/location/create">
                <PlusCircle className="mr-2 h-4 w-4" />
                নতুন লোকেশন যোগ করুন
            </Link>
        </Button>
      </div>
      <div className="text-center py-16 border-2 border-dashed rounded-lg">
        <p className="text-muted-foreground">এই ফিচারটি শীঘ্রই আসছে।</p>
        <p className="text-muted-foreground text-sm">লোকেশনভিত্তিক খবরের তালিকা এবং ম্যানেজমেন্ট অপশন এখানে দেখানো হবে।</p>
      </div>
    </div>
  )
}
