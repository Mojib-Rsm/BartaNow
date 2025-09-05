
      
'use client'

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription
} from "@/components/ui/card"
import {
  Users,
  Newspaper,
  Eye,
  MessageCircle,
  FileText,
  BarChartHorizontal,
  FolderKanban,
  FileQuestion,
  Smile,
  Languages,
  Grid,
  CheckSquare,
  Users2,
  Box,
  FileDown,
  LineChart,
  BookOpen,
  Radio
} from 'lucide-react'
import {
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import Image from 'next/image';
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState, useEffect, useMemo } from "react";
import type { Article, Comment, User, Page, Poll, MemeNews } from "@/lib/types";
import { getArticles, getAllComments, getAllUsers, getAllPages, getAllPolls, getMemeNews, getAllAds, getAllCategories } from "@/lib/api";
import { generateNonAiSlug } from "@/lib/utils";

const StatCard = ({ title, value, icon: Icon, subValue1, subValue2, bgColor }: { title: string, value: string | number, icon?: React.ElementType, subValue1?: string, subValue2?: string, bgColor?: string }) => (
    <Card className={`text-white ${bgColor}`}>
        <CardContent className="p-4 flex items-center gap-4">
            {Icon && <div className="p-3 bg-white/20 rounded-lg"><Icon className="h-6 w-6" /></div>}
            <div>
                <div className="text-2xl font-bold">{value}</div>
                <p className="text-sm opacity-80">{title}</p>
                {subValue1 && subValue2 && (
                    <div className="flex gap-4 text-xs mt-1">
                        <span>{subValue1}</span>
                        <span>{subValue2}</span>
                    </div>
                )}
            </div>
        </CardContent>
    </Card>
);

const MiniStatCard = ({ title, value, icon: Icon, color }: { title: string, value: string | number, icon: React.ElementType, color: string }) => (
    <Card>
        <CardContent className="p-4 flex items-start gap-4">
             <div className={`p-2 rounded-lg`} style={{ backgroundColor: `${color}1A`}}>
                <Icon className="h-5 w-5" style={{ color: color }}/>
             </div>
            <div>
                <div className="text-xl font-bold">{new Intl.NumberFormat('bn-BD').format(Number(value))}</div>
                <p className="text-sm text-muted-foreground">{title}</p>
            </div>
        </CardContent>
    </Card>
);

const UserStatisticChart = () => {
    // This data is still simulated as user creation date is not tracked in the DB.
    const data = [
        { name: 'Jan', free: 4000, subscribed: 2400 },
        { name: 'Feb', free: 3000, subscribed: 1398 },
        { name: 'Mar', free: 2000, subscribed: 9800 },
        { name: 'Apr', free: 2780, subscribed: 3908 },
        { name: 'May', free: 1890, subscribed: 4800 },
        { name: 'Jun', free: 2390, subscribed: 3800 },
        { name: 'Jul', free: 3490, subscribed: 4300 },
    ];
    return (
        <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <Tooltip />
                <Legend iconType="circle" />
                <Bar dataKey="free" name="Free Users" fill="#3B82F6" barSize={10} radius={[5, 5, 0, 0]} />
                <Bar dataKey="subscribed" name="Subscribed" fill="#F97316" barSize={10} radius={[5, 5, 0, 0]} />
            </ComposedChart>
        </ResponsiveContainer>
    );
};

const CategoryWiseNewsChart = ({ articles }: { articles: Article[] }) => {
    const categoryData = useMemo(() => {
        const categoryCounts = articles.reduce((acc, article) => {
            const category = article.category || 'Uncategorized';
            acc[category] = (acc[category] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const colors = ['#3B82F6', '#8B5CF6', '#10B981', '#F97316', '#F59E0B', '#14B8A6'];
        
        return Object.entries(categoryCounts)
            .map(([name, value], index) => ({ name, value, color: colors[index % colors.length] }))
            .sort((a,b) => b.value - a.value)
            .slice(0, 6);

    }, [articles]);

    if (categoryData.length === 0) {
        return <div className="text-center text-muted-foreground">No category data available.</div>;
    }
    
    return (
        <ResponsiveContainer width="100%" height={300}>
            <PieChart>
                <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} fill="#8884d8" paddingAngle={5}>
                    {categoryData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                </Pie>
                <Tooltip />
                <Legend iconType="circle" />
            </PieChart>
        </ResponsiveContainer>
    );
};


export default function AdminPage() {
    const [stats, setStats] = useState({
        totalArticles: 0,
        publishedArticles: 0,
        draftArticles: 0,
        breakingArticles: 0,
        totalUsers: 0,
        subscribedUsers: 0,
        freeUsers: 0,
        totalComments: 0,
        totalPages: 0,
        totalPolls: 0,
        totalAds: 0,
        totalMemeNews: 0,
        uniqueCategories: 0,
        mostViewed: [] as Article[],
        latestComments: [] as Comment[],
        allArticles: [] as Article[],
    });

    useEffect(() => {
        const fetchData = async () => {
            const [
                { articles, totalPages: totalArticlePages },
                comments,
                pages,
                users,
                polls,
                memeNews,
                ads,
                categories,
            ] = await Promise.all([
                getArticles({ limit: 10000 }),
                getAllComments(),
                getAllPages(),
                getAllUsers(),
                getAllPolls(),
                getMemeNews(),
                getAllAds(),
                getAllCategories(),
            ]);

            setStats({
                totalArticles: articles.length,
                publishedArticles: articles.filter(a => a.status === 'Published').length,
                draftArticles: articles.filter(a => a.status === 'Draft' || a.status === 'Pending Review' || a.status === 'Scheduled').length,
                breakingArticles: articles.filter(a => a.category === 'বিশেষ-কভারেজ').length, // Example logic
                totalUsers: users.length,
                subscribedUsers: 10000, // Mocked for now
                freeUsers: 20000, // Mocked for now
                totalComments: comments.length,
                totalPages: pages.length,
                totalPolls: polls.length,
                totalAds: ads.length,
                totalMemeNews: memeNews.length,
                uniqueCategories: categories.length,
                mostViewed: articles.slice(0, 5), // Using latest as most viewed for now
                latestComments: comments.slice(0, 5),
                allArticles: articles,
            });
        };
        fetchData();
    }, []);

  return (
    <div className="space-y-6">
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard title="News Readers" value={new Intl.NumberFormat('bn-BD').format(stats.totalUsers)} subValue1={`Subscribe: ${new Intl.NumberFormat('bn-BD').format(stats.subscribedUsers)}`} subValue2={`Free: ${new Intl.NumberFormat('bn-BD').format(stats.freeUsers)}`} bgColor="bg-blue-500" />
            <StatCard title="Total Categories" value={stats.uniqueCategories} icon={Grid} bgColor="bg-teal-500" />
            <StatCard title="Language" value="40+" icon={Languages} bgColor="bg-rose-500" />
            <StatCard title="Ad Spaces" value={stats.totalAds} icon={CheckSquare} bgColor="bg-green-500" />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-6">
                <MiniStatCard title="Published News" value={stats.publishedArticles} icon={Newspaper} color="#F97316" />
                <MiniStatCard title="Draft News" value={stats.draftArticles} icon={FileDown} color="#10B981" />
                <MiniStatCard title="Breaking News" value={stats.breakingArticles} icon={FileText} color="#EF4444" />
                <MiniStatCard title="Total Pages" value={stats.totalPages} icon={Box} color="#8B5CF6" />
                <MiniStatCard title="SEO Score" value="78" icon={BarChartHorizontal} color="#3B82F6" />
                <MiniStatCard title="Readability Score" value="85" icon={BookOpen} color="#14B8A6" />
                <MiniStatCard title="Live Show" value="5" icon={Radio} color="#F43F5E" />
            </div>
            <div className="lg:col-span-2">
                 <Card>
                    <CardHeader>
                        <CardTitle>User Statistic</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <UserStatisticChart />
                    </CardContent>
                </Card>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-1">
                <CardHeader><CardTitle>Latest News</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    {stats.mostViewed.map(article => (
                        <div key={article.id} className="flex items-center gap-4">
                            <Image src={article.imageUrl} alt={article.title} width={80} height={60} className="rounded-md object-cover h-16 w-20" />
                            <div>
                                <Badge variant="secondary" className="mb-1 text-xs">{article.category}</Badge>
                                <h3 className="text-sm font-semibold line-clamp-2">{article.title}</h3>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>
             <Card className="lg:col-span-1">
                <CardHeader><CardTitle>Latest Comments</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    {stats.latestComments.map(comment => (
                       <div key={comment.id} className="flex items-center gap-3">
                            <Avatar className="h-9 w-9">
                                <AvatarImage src={comment.userAvatar} alt={comment.userName} />
                                <AvatarFallback>{comment.userName.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="text-sm font-semibold">{comment.userName}</p>
                                <p className="text-xs text-muted-foreground line-clamp-1">{comment.text}</p>
                            </div>
                            <span className="text-xs text-muted-foreground ml-auto whitespace-nowrap">
                                {new Date(comment.timestamp).toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                    ))}
                </CardContent>
            </Card>
             <Card className="lg:col-span-1">
                <CardHeader><CardTitle>Category Wise News</CardTitle></CardHeader>
                <CardContent>
                    <CategoryWiseNewsChart articles={stats.allArticles} />
                </CardContent>
            </Card>
        </div>
    </div>
  )
}

    