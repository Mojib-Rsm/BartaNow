import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Edit, Play, SkipForward, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const queuedPosts = [
  { id: 'q-1', title: 'নতুন গেমিং ল্যাপটপের রিভিউ', category: 'প্রযুক্তি', scheduledFor: '10:30 AM' },
  { id: 'q-2', title: 'নির্বাচনী ইশতেহার নিয়ে বিশ্লেষণ', category: 'রাজনীতি', scheduledFor: '11:00 AM' },
  { id: 'q-3', title: 'ঈদের নাটক: কোনটি দেখবেন?', category: 'বিনোদন', scheduledFor: '11:30 AM' },
];

export function QueueTab() {
  return (
     <Card>
        <CardHeader>
            <CardTitle>প্রকাশের অপেক্ষায় থাকা পোস্ট</CardTitle>
            <CardDescription>
                এই পোস্টগুলো সিস্টেম দ্বারা স্বয়ংক্রিয়ভাবে তৈরি হয়েছে এবং নির্ধারিত সময়ে প্রকাশিত হবে।
            </CardDescription>
        </CardHeader>
        <CardContent>
            <div className="space-y-4">
                {queuedPosts.map(post => (
                    <div key={post.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                            <p className="font-semibold">{post.title}</p>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                                <Badge variant="outline">{post.category}</Badge>
                                <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {post.scheduledFor}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                             <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
                             <Button variant="ghost" size="icon"><Play className="h-4 w-4 text-green-600" /></Button>
                             <Button variant="ghost" size="icon"><SkipForward className="h-4 w-4 text-yellow-600" /></Button>
                             <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button>
                        </div>
                    </div>
                ))}
                {queuedPosts.length === 0 && (
                    <div className="text-center py-12 border-2 border-dashed rounded-lg">
                        <p className="text-muted-foreground">এই মুহূর্তে কোনো পোস্ট Queue-তে নেই।</p>
                    </div>
                )}
            </div>
        </CardContent>
     </Card>
  );
}
