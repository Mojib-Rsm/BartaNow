import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const historyLogs = [
  { id: 'log-1', title: 'স্মার্টফোন বাজারে নতুন বিপ্লব', status: 'Published', publishedAt: '2024-08-01 10:30 AM', generatedBy: 'AI' },
  { id: 'log-2', title: 'বিশ্বকাপ ক্রিকেটে বাংলাদেশের প্রস্তুতি', status: 'Published', publishedAt: '2024-08-01 10:00 AM', generatedBy: 'AI' },
  { id: 'log-3', title: 'শেয়ার বাজারে অস্থিরতা', status: 'Skipped', publishedAt: '2024-07-31 05:00 PM', generatedBy: 'Admin' },
  { id: 'log-4', title: 'মহাকাশে নতুন অভিযান', status: 'Published', publishedAt: '2024-07-31 04:30 PM', generatedBy: 'AI' },
];

export function HistoryTab() {
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
              <TableHead>দ্বারা</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {historyLogs.map((log) => (
              <TableRow key={log.id}>
                <TableCell className="font-medium">{log.title}</TableCell>
                <TableCell>
                    <Badge variant={log.status === 'Published' ? 'default' : 'secondary'}>
                        {log.status}
                    </Badge>
                </TableCell>
                <TableCell>{log.publishedAt}</TableCell>
                <TableCell>{log.generatedBy}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
