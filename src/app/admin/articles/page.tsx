
import { getArticles } from "@/lib/api"
import { columns } from "./columns"
import { DataTable } from "./data-table"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"

export default async function ArticleManagementPage() {
  // Fetch all articles for the admin table
  const { articles } = await getArticles({ limit: 1000 }) 

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <div>
            <h1 className="text-3xl font-bold">আর্টিকেল ম্যানেজমেন্ট</h1>
            <p className="text-muted-foreground">এখান থেকে সব আর্টিকেল দেখুন, এডিট করুন অথবা নতুন আর্টিকেল যোগ করুন।</p>
        </div>
        <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            নতুন আর্টিকেল যোগ করুন
        </Button>
      </div>
      <DataTable columns={columns} data={articles} />
    </div>
  )
}