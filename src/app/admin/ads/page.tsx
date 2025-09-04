
import { getAllAds } from "@/lib/api";
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import Link from "next/link"
import { DataTable } from "./data-table"
import { columns } from "./columns"

export default async function AdsManagementPage() {
  const ads = await getAllAds();

  return (
    <div className="w-full">
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
       <DataTable columns={columns} data={ads} />
    </div>
  )
}
