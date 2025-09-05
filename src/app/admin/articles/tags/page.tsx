
import { getAllTags } from "@/lib/api"
import { columns } from "./columns"
import { DataTable } from "./data-table"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import Link from "next/link"

export default async function TagManagementPage() {
  const tags = await getAllTags();

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <div>
            <h1 className="text-3xl font-bold">ট্যাগ ম্যানেজমেন্ট</h1>
            <p className="text-muted-foreground">এখান থেকে সব ট্যাগ দেখুন, এডিট করুন অথবা নতুন ট্যাগ যোগ করুন।</p>
        </div>
        <Button asChild>
            <Link href="/admin/articles/tags/create">
                <PlusCircle className="mr-2 h-4 w-4" />
                নতুন ট্যাগ যোগ করুন
            </Link>
        </Button>
      </div>
      <DataTable columns={columns} data={tags} />
    </div>
  )
}
