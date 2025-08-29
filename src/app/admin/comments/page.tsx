
import { getAllComments } from "@/lib/api"
import { columns } from "./columns"
import { DataTable } from "./data-table"
import type { Comment } from "@/lib/types"

type SearchParams = {
  searchParams?: {
    userName?: string;
    articleId?: string;
    status?: Comment['status'];
  }
}

export default async function CommentsManagementPage({ searchParams }: SearchParams) {
  const { userName, articleId, status } = searchParams || {};
  const comments = await getAllComments({ userName, articleId, status });

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <div>
            <h1 className="text-3xl font-bold">মন্তব্য ও এনগেজমেন্ট</h1>
            <p className="text-muted-foreground">এখান থেকে ওয়েবসাইটের সব মন্তব্য অ্যাপ্রুভ, এডিট বা ডিলিট করুন।</p>
        </div>
      </div>
      <DataTable columns={columns} data={comments as Comment[]} />
    </div>
  )
}
