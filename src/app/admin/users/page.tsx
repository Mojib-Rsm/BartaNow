

import { getAllUsers } from "@/lib/api"
import { columns } from "./columns"
import { DataTable } from "./data-table"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import Link from "next/link"

export default async function UserManagementPage() {
  const users = await getAllUsers();

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <div>
            <h1 className="text-3xl font-bold">ব্যবহারকারী ম্যানেজমেন্ট</h1>
            <p className="text-muted-foreground">এখান থেকে সব ব্যবহারকারী দেখুন এবং তাদের রোল পরিচালনা করুন।</p>
        </div>
        {/* <Button asChild>
            <Link href="#">
                <PlusCircle className="mr-2 h-4 w-4" />
                নতুন ব্যবহারকারী যোগ করুন
            </Link>
        </Button> */}
      </div>
      <DataTable columns={columns} data={users} />
    </div>
  )
}
