
'use client';

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { getArticles, getAllUsers, getAllComments } from "@/lib/api";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { Article, User, Comment } from '@/lib/types';
import { Flame, UserCheck, MessageSquare, Newspaper } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

type ReportStats = {
    totalArticles: number;
    totalAuthors: number;
    totalComments: number;
    topArticles: (Article & { views: number })[];
    topAuthors: { name: string, count: number }[];
    categoryData: { name: string, posts: number }[];
}

const AnalyticsSkeleton = () => (
    <div className="w-full space-y-6">
         <div>
            <Skeleton className="h-9 w-1/3" />
            <Skeleton className="h-5 w-2/3 mt-2" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {[...Array(3)].map((_, i) => (
                <Card key={i}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <Skeleton className="h-5 w-24" />
                        <Skeleton className="h-5 w-5" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-8 w-12 mt-1" />
                    </CardContent>
                </Card>
             ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-1/2" />
                </CardHeader>
                <CardContent className="space-y-4">
                    {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-6 w-full" />)}
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                     <Skeleton className="h-6 w-1/2" />
                </CardHeader>
                 <CardContent className="space-y-4">
                    {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-6 w-full" />)}
                </CardContent>
            </Card>
        </div>
         <Card>
            <CardHeader>
                <Skeleton className="h-6 w-1/3" />
                <Skeleton className="h-4 w-1/2 mt-2" />
            </CardHeader>
            <CardContent>
                <Skeleton className="h-[400px] w-full" />
            </CardContent>
        </Card>
    </div>
);

const StatCard = ({ title, value, icon: Icon }: { title: string, value: string, icon: React.ElementType }) => (
     <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            <Icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">{new Intl.NumberFormat('bn-BD').format(Number(value))}</div>
        </CardContent>
    </Card>
);


export default function AnalyticsPage() {
    const [stats, setStats] = useState<ReportStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const [{ articles }, allUsers, allComments] = await Promise.all([
                    getArticles({ limit: 1000 }),
                    getAllUsers(),
                    getAllComments(),
                ]);

                // Top Viewed Articles (Simulated for demo)
                const topArticles = articles
                    .map(a => ({ ...a, views: Math.floor(Math.random() * 5000) + 100 }))
                    .sort((a, b) => b.views - a.views)
                    .slice(0, 5);

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
                    .sort((a,b) => b.posts - a.posts)
                    .slice(0, 10);
                
                setStats({ 
                    totalArticles: articles.length,
                    totalAuthors: allUsers.length,
                    totalComments: allComments.length,
                    topArticles, 
                    topAuthors, 
                    categoryData 
                });

            } catch (error) {
                console.error("Failed to fetch report data", error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    if (loading) {
        return <AnalyticsSkeleton />;
    }

    if (!stats) {
        return <div>রিপোর্ট লোড করা যায়নি।</div>
    }

    const { totalArticles, totalAuthors, totalComments, topArticles, topAuthors, categoryData } = stats;


  return (
    <>
    <head>
        <title>অ্যানালিটিক্স ও রিপোর্ট</title>
        <meta name="description" content="ওয়েবসাইটের পারফরম্যান্স এবং কন্টেন্ট সম্পর্কে বিস্তারিত রিপোর্ট দেখুন।" />
    </head>
    <div className="w-full space-y-6">
        <div>
            <h1 className="text-3xl font-bold">অ্যানালিটিক্স</h1>
            <p className="text-muted-foreground">এখান থেকে আপনার ওয়েবসাইটের সার্বিক পারফরম্যান্স সম্পর্কে ধারণা নিন।</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatCard title="মোট পোস্ট" value={String(totalArticles)} icon={Newspaper} />
            <StatCard title="মোট লেখক" value={String(totalAuthors)} icon={UserCheck} />
            <StatCard title="মোট মন্তব্য" value={String(totalComments)} icon={MessageSquare} />
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
        
        <Card>
            <CardHeader>
                <CardTitle>গুগল অ্যানালিটিক্স</CardTitle>
                <CardDescription>আরও বিস্তারিত তথ্যের জন্য, যেমন - পেজ ভিউ, ব্যবহারকারীর অবস্থান, রেফারেল সোর্স ইত্যাদি, আপনার গুগল অ্যানালিটিক্স ড্যাশবোর্ড ভিজিট করুন।</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground">
                    সাইটে গুগল অ্যানালিটিক্স ইন্টিগ্রেট করতে, আপনার প্রোজেক্টের এনভায়রনমেন্ট ফাইলে (`.env`) আপনার `NEXT_PUBLIC_GA_MEASUREMENT_ID` যোগ করুন।
                </p>
            </CardContent>
        </Card>
    </div>
    </>
  );
}
