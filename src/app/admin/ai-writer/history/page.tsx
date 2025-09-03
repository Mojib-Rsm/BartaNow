
import { getArticles } from "@/lib/api"
import { columns } from "./columns"
import { DataTable } from "./data-table"

export default async function AiWriterHistoryPage() {
  const { articles } = await getArticles({ isAiGenerated: true, limit: 1000 });

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <div>
            <h1 className="text-3xl font-bold">AI জেনারেটেড আর্টিকেলের ইতিহাস</h1>
            <p className="text-muted-foreground">AI দ্বারা তৈরি করা সমস্ত আর্টিকেল এখানে দেখুন এবং পরিচালনা করুন।</p>
        </div>
      </div>
      <DataTable columns={columns} data={articles} />
    </div>
  )
}
