
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { getArticles, getAllUsers } from "@/lib/api";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { Metadata } from 'next';
import { Flame, UserCheck } from "lucide-react";

export const metadata: Metadata = {
  title: 'রিপোর্ট ও অ্যানালিটিক্স',
  description: 'ওয়েবসাইটের পারফরম্যান্স এবং কন্টেন্ট সম্পর্কে বিস্তারিত রিপোর্ট দেখুন।',
};

export default async function ReportsPage() {
    const [{ articles }, allUsers] = await Promise.all([
        getArticles({ limit: 1000 }),
        getAllUsers(),
    ]);

    // Top Viewed Articles (Simulated for demo)
    const topArticles = articles
        .map(a => ({ ...a, views: Math.floor(Math.random() * 5000) + 100 }))
        .sort((a, b) => b.views - a.views)
        .slice(0, 10);

    // Top Authors by article count
    const authorCounts = articles.reduce((acc, article) => {
        acc[article.authorName] = (acc[article.authorName] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const topAuthors = Object.entries(authorCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([name, count]) => ({ name, count }));

    // Category Distribution
    const categoryCounts = articles.reduce((acc, article) => {
        acc[article.category] = (acc[article.category] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);
    
    const categoryData = Object.entries(categoryCounts)
        .map(([name, posts]) => ({ name, posts }))
        .sort((a,b) => b.posts - a.posts);


  return (
    <div className="w-full space-y-6">
        <div>
            <h1 className="text-3xl font-bold">রিপোর্ট ও অ্যানালিটিক্স</h1>
            <p className="text-muted-foreground">এখান থেকে আপনার ওয়েবসাইটের সার্বিক পারফরম্যান্স সম্পর্কে ধারণা নিন।</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Flame className="text-primary" /> সর্বাধিক পঠিত আর্টিকেল</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-2">
                        {topArticles.map((article, index) => (
                            <li key={article.id} className="flex justify-between items-center text-sm">
                                <span className="truncate pr-2">{index + 1}. {article.title}</span>
                                <span className="font-semibold whitespace-nowrap">{new Intl.NumberFormat('bn-BD').format(article.views)} ভিউ</span>
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><UserCheck className="text-primary" /> সেরা লেখক</CardTitle>
                </CardHeader>
                <CardContent>
                     <ul className="space-y-2">
                        {topAuthors.map((author, index) => (
                            <li key={author.name} className="flex justify-between items-center text-sm">
                                <span>{index + 1}. {author.name}</span>
                                <span className="font-semibold">{new Intl.NumberFormat('bn-BD').format(author.count)} টি পোস্ট</span>
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>
        </div>
        
        <Card>
            <CardHeader>
                <CardTitle>ক্যাটাগরি অনুযায়ী পোস্টের সংখ্যা</CardTitle>
                 <CardDescription>কোন ক্যাটাগরিতে কতগুলো পোস্ট আছে তার একটি চিত্র।</CardDescription>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={categoryData} layout="vertical" margin={{ top: 5, right: 20, left: 80, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                        <XAxis type="number" />
                        <YAxis type="category" dataKey="name" width={80} tick={{ fontSize: 12 }} interval={0} />
                        <Tooltip formatter={(value) => `${new Intl.NumberFormat('bn-BD').format(Number(value))} টি`} />
                        <Legend />
                        <Bar dataKey="posts" name="পোস্টের সংখ্যা" fill="#3B82F6" barSize={20} />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    </div>
  );
}
