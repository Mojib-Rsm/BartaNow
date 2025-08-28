
import { getAllPages } from "@/lib/api"
import { columns } from "./columns"
import { DataTable } from "./data-table"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import Link from "next/link"

export default async function PageManagementPage() {
  const pages = await getAllPages();

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <div>
            <h1 className="text-3xl font-bold">পেজ ম্যানেজমেন্ট</h1>
            <p className="text-muted-foreground">এখান থেকে ওয়েবসাইটের স্ট্যাটিক পেজ (যেমন About, Contact) পরিচালনা করুন।</p>
        </div>
        <Button asChild>
            <Link href="/admin/pages/create">
                <PlusCircle className="mr-2 h-4 w-4" />
                নতুন পেজ যোগ করুন
            </Link>
        </Button>
      </div>
      <DataTable columns={columns} data={pages} />
    </div>
  )
}
