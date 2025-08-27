
'use client';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { BarChart, LineChart, Users, Newspaper, View } from 'lucide-react'
import {
  LineChart as RechartsLineChart,
  BarChart as RechartsBarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Line,
  Bar,
} from 'recharts';
import type { ChartConfig } from '@/components/ui/chart';

const totalViewsData = [
  { month: 'Jan', views: 2400 },
  { month: 'Feb', views: 1398 },
  { month: 'Mar', views: 9800 },
  { month: 'Apr', views: 3908 },
  { month: 'May', views: 4800 },
  { month: 'Jun', views: 3800 },
  { month: 'Jul', views: 4300 },
];
const totalViewsConfig = {
  views: {
    label: 'Views',
    color: 'hsl(var(--primary))',
  },
} satisfies ChartConfig;

const visitorsData = [
  { date: '2024-07-01', visitors: 222 },
  { date: '2024-07-02', visitors: 190 },
  { date: '2024-07-03', visitors: 350 },
  { date: '2024-07-04', visitors: 280 },
  { date: '2024-07-05', visitors: 410 },
  { date: '2024-07-06', visitors: 380 },
  { date: '2024-07-07', visitors: 520 },
];
const visitorsConfig = {
  visitors: {
    label: 'Visitors',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;


const topCategoriesData = [
  { name: 'রাজনীতি', articles: 120 },
  { name: 'খেলা', articles: 98 },
  { name: 'বিনোদন', articles: 86 },
  { name: 'প্রযুক্তি', articles: 75 },
  { name: 'আন্তর্জাতিক', articles: 60 },
  { name: 'অর্থনীতি', articles: 45 },
];
const topCategoriesConfig = {
  articles: {
    label: 'Articles',
    color: 'hsl(var(--primary))',
  },
} satisfies ChartConfig;


export default function AdminPage() {
  return (
    <div className="space-y-6 py-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">সর্বমোট ভিউ</CardTitle>
                    <View className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">1.2M</div>
                    <p className="text-xs text-muted-foreground">গত মাসের চেয়ে +20.1%</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">সক্রিয় ব্যবহারকারী</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">+2350</div>
                     <p className="text-xs text-muted-foreground">গত ঘন্টার চেয়ে +180.1%</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">মোট আর্টিকেল</CardTitle>
                    <Newspaper className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">+573</div>
                    <p className="text-xs text-muted-foreground">এই মাসে +19%</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">সর্বোচ্চ ক্যাটাগরি</CardTitle>
                    <BarChart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">রাজনীতি</div>
                    <p className="text-xs text-muted-foreground">সর্বমোট 120 টি আর্টিকেল</p>
                </CardContent>
            </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="lg:col-span-4">
                <CardHeader>
                    <CardTitle>Total Views</CardTitle>
                     <CardDescription>
                        গত ৬ মাসের ভিউয়ের সংখ্যা
                    </CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                    <ResponsiveContainer width="100%" height={350}>
                        <RechartsLineChart data={totalViewsData}>
                            <CartesianGrid vertical={false} />
                            <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
                            <YAxis />
                            <Tooltip
                                cursor={false}
                                content={<div className="rounded-lg border bg-background p-2 shadow-sm">
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="flex flex-col">
                                            <span className="text-[0.70rem] uppercase text-muted-foreground">Views</span>
                                            <span className="font-bold text-muted-foreground">
                                                {/* @ts-ignore */}
                                                {totalViewsData.find(d => d.month === Tooltip.arguments?.[0]?.payload?.[0]?.payload?.month)?.views}
                                            </span>
                                        </div>
                                    </div>
                                </div>}
                             />
                             <Line dataKey="views" type="monotone" stroke="hsl(var(--primary))" strokeWidth={2} dot={true} />
                        </RechartsLineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
             <Card className="lg:col-span-3">
                <CardHeader>
                    <CardTitle>Top Categories</CardTitle>
                     <CardDescription>
                        আর্টিকেলের সংখ্যা অনুযায়ী সর্বোচ্চ ক্যাটাগরি
                    </CardDescription>
                </CardHeader>
                <CardContent>
                     <ResponsiveContainer width="100%" height={350}>
                        <RechartsBarChart data={topCategoriesData} layout="vertical">
                           <CartesianGrid horizontal={false} />
                          <XAxis type="number" hide />
                          <YAxis dataKey="name" type="category" tickLine={false} axisLine={false} tickMargin={10} width={80}/>
                          <Tooltip cursor={{ fill: 'hsl(var(--muted))' }} />
                          <Bar dataKey="articles" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                        </RechartsBarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>

    </div>
  )
}
