
import { getAllLocations } from "@/lib/api";
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import Link from "next/link"
import { DataTable } from "./data-table"
import { columns } from "./columns"

export default async function LocationManagementPage() {
  const locations = await getAllLocations();

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
      <DataTable columns={columns} data={locations} />
    </div>
  )
}
