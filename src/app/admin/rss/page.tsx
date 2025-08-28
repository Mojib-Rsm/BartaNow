
import { getAllRssFeeds } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { columns } from "./columns";
import { DataTable } from "./data-table";

export default async function RssManagementPage() {
  const feeds = await getAllRssFeeds();

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">RSS ফিড ম্যানেজমেন্ট</h1>
          <p className="text-muted-foreground">এখান থেকে RSS ফিড যোগ করুন, এডিট করুন এবং ইম্পোর্ট করুন।</p>
        </div>
        <Button asChild>
          <Link href="/admin/rss/create">
            <PlusCircle className="mr-2 h-4 w-4" />
            নতুন ফিড যোগ করুন
          </Link>
        </Button>
      </div>
      <DataTable columns={columns} data={feeds} />
    </div>
  )
}
