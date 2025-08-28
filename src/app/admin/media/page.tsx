
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import Link from "next/link"
import { getAllMedia } from "@/lib/api"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { format } from 'date-fns'

export default async function MediaManagementPage() {
    const mediaItems = await getAllMedia();

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <div>
            <h1 className="text-3xl font-bold">মিডিয়া লাইব্রেরি</h1>
            <p className="text-muted-foreground">এখান থেকে ওয়েবসাইটের সব ছবি, ভিডিও এবং অন্যান্য মিডিয়া পরিচালনা করুন।</p>
        </div>
        <Button asChild>
            <Link href="/admin/media/upload">
                <PlusCircle className="mr-2 h-4 w-4" />
                নতুন মিডিয়া যোগ করুন
            </Link>
        </Button>
      </div>
      
      {mediaItems.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {mediaItems.map(item => (
                <Card key={item.id} className="group overflow-hidden">
                    <CardContent className="p-0">
                        <div className="relative aspect-square w-full">
                            <Image src={item.url} alt={item.fileName} fill className="object-cover" />
                        </div>
                        <div className="p-2 text-xs">
                            <p className="font-semibold truncate group-hover:text-primary">{item.fileName}</p>
                            <p className="text-muted-foreground">{format(new Date(item.uploadedAt), 'PP')}</p>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
      ) : (
         <div className="text-center py-16 border-2 border-dashed rounded-lg">
            <p className="text-muted-foreground">কোনো মিডিয়া খুঁজে পাওয়া যায়নি।</p>
            <p className="text-muted-foreground text-sm">নতুন মিডিয়া যোগ করতে উপরের বাটনে ক্লিক করুন।</p>
        </div>
      )}
    </div>
  )
}
