
import { getArticles } from "@/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { format, isFuture } from "date-fns";
import { bn } from "date-fns/locale";
import { Clock } from "lucide-react";

const statusVariantMap: { [key: string]: 'default' | 'secondary' | 'destructive' | 'outline' } = {
  Published: 'default',
  Draft: 'secondary',
  'Pending Review': 'outline',
  Scheduled: 'outline',
};

const statusColorMap: { [key: string]: string } = {
    Published: 'bg-green-600 hover:bg-green-700',
    Draft: 'bg-gray-500 hover:bg-gray-600',
    'Pending Review': 'bg-yellow-500 hover:bg-yellow-600 border-yellow-500 text-black',
    Scheduled: 'bg-amber-500 hover:bg-amber-600 border-amber-500',
};


export async function HistoryTab() {
  const { articles: historyLogs } = await getArticles({ isAiGenerated: true, limit: 100 });

  return (
    <Card>
      <CardHeader>
        <CardTitle>পোস্ট ইতিহাস</CardTitle>
        <CardDescription>
          অটো-পোস্ট সিস্টেম দ্বারা প্রকাশিত বা স্কিপ করা পোস্টগুলোর লগ এখানে দেখুন।
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>শিরোনাম</TableHead>
              <TableHead>স্ট্যাটাস</TableHead>
              <TableHead>প্রকাশের সময়</TableHead>
              <TableHead>লেখক</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {historyLogs.length > 0 ? historyLogs.map((log) => {
              const isScheduled = log.status === 'Scheduled' && isFuture(new Date(log.publishedAt));
              const displayStatus = isScheduled ? 'Scheduled' : log.status;
              return (
                <TableRow key={log.id}>
                    <TableCell className="font-medium">
                        <Link href={`/admin/articles/edit/${log.id}`} className="hover:underline">
                            {log.title}
                        </Link>
                    </TableCell>
                    <TableCell>
                        <Badge 
                            variant={statusVariantMap[displayStatus] || 'outline'}
                            className={`${statusColorMap[displayStatus]} text-white`}
                        >
                            {isScheduled && <Clock className="mr-1 h-3 w-3" />}
                            {displayStatus}
                        </Badge>
                    </TableCell>
                    <TableCell>{format(new Date(log.publishedAt), 'd MMM, yyyy h:mm a', { locale: bn })}</TableCell>
                    <TableCell>{log.authorName}</TableCell>
                </TableRow>
            )}) : (
                 <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                        No history found.
                    </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
