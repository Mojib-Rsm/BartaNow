
import { getAllCategories } from "@/lib/api"
import { columns } from "./columns"
import { DataTable } from "./data-table"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import Link from "next/link"

export default async function CategoryManagementPage() {
  const categories = await getAllCategories();

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <div>
            <h1 className="text-3xl font-bold">ক্যাটাগরি ম্যানেজমেন্ট</h1>
            <p className="text-muted-foreground">এখান থেকে সব ক্যাটাগরি দেখুন, এডিট করুন অথবা নতুন ক্যাটাগরি যোগ করুন।</p>
        </div>
        <Button asChild>
            <Link href="/admin/articles/categories/create">
                <PlusCircle className="mr-2 h-4 w-4" />
                নতুন ক্যাটাগরি যোগ করুন
            </Link>
        </Button>
      </div>
      <DataTable columns={columns} data={categories} />
    </div>
  )
}
