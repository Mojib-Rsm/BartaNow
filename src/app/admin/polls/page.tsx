
import { getAllPolls } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { columns } from "./columns";
import { DataTable } from "./data-table";

export default async function PollsManagementPage() {
  const polls = await getAllPolls();

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <div>
            <h1 className="text-3xl font-bold">জরিপ ম্যানেজমেন্ট</h1>
            <p className="text-muted-foreground">এখান থেকে জনমত জরিপ তৈরি ও পরিচালনা করুন।</p>
        </div>
        <Button asChild>
            <Link href="/admin/polls/create">
                <PlusCircle className="mr-2 h-4 w-4" />
                নতুন জরিপ যোগ করুন
            </Link>
        </Button>
      </div>
      <DataTable columns={columns} data={polls} />
    </div>
  )
}
