
import { getAllContactMessages } from "@/lib/api";
import { columns } from "./columns";
import { DataTable } from "./data-table";

export default async function ContactMessagesPage() {
  const messages = await getAllContactMessages();

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <div>
            <h1 className="text-3xl font-bold">যোগাযোগের বার্তা</h1>
            <p className="text-muted-foreground">ব্যবহারকারীদের পাঠানো বার্তাগুলো এখানে দেখুন।</p>
        </div>
      </div>
      <DataTable columns={columns} data={messages} />
    </div>
  );
}
