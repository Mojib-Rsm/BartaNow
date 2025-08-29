
'use client';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card"
import { BarChart, Users, Newspaper, Eye, MessageCircle, FileText, Languages, SquareTerminal, Percent, CheckCircle } from 'lucide-react'
import {
  LineChart as RechartsLineChart,
  BarChart as RechartsBarChart,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Line,
  Bar,
  TooltipProps
} from 'recharts';
import type { ChartConfig } from '@/components/ui/chart';
import { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent";
import Image from "next/image";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const userStatsData = [
  { month: "Jan", free: 12000, subscribed: 8000 },
  { month: "Feb", free: 18000, subscribed: 11000 },
  { month: "Mar", free: 15000, subscribed: 9000 },
  { month: "Apr", free: 17000, subscribed: 12000 },
  { month: "May", free: 14000, subscribed: 10000 },
  { month: "Jun", free: 22000, subscribed: 15000 },
  { month: "Jul", free: 18000, subscribed: 12000 },
  { month: "Aug", free: 21000, subscribed: 14000 },
  { month: "Sep", free: 19000, subscribed: 13000 },
  { month: "Oct", free: 23000, subscribed: 16000 },
  { month: "Nov", free: 25000, subscribed: 18000 },
  { month: "Dec", free: 20000, subscribed: 15000 },
];

const categoryWiseNewsData = [
  { name: 'Business', value: 400, color: 'hsl(var(--chart-1))' },
  { name: 'Politics', value: 300, color: 'hsl(var(--chart-2))' },
  { name: 'Health', value: 300, color: 'hsl(var(--chart-3))' },
  { name: 'Sports', value: 200, color: 'hsl(var(--chart-4))' },
  { name: 'Travels', value: 278, color: 'hsl(var(--chart-5))' },
  { name: "Family's", value: 189, color: '#8884d8' },
  { name: 'Science', value: 239, color: '#ffc658' },
  { name: 'Technology', value: 349, color: '#82ca9d' },
  { name: 'Religion', value: 150, color: '#ff8042' },
];

const mostViewedNews = [
    { title: 'US inflation decelerating in boost to economy...', category: 'Business', views: '7k', comments: '500', imageUrl: 'https://picsum.photos/seed/inflation/100/100'},
    { title: 'US inflation decelerating in boost to economy...', category: 'Politics', views: '7k', comments: '500', imageUrl: 'https://picsum.photos/seed/politics-news/100/100'},
    { title: 'US inflation decelerating in boost to economy...', category: 'Family\'s', views: '7k', comments: '500', imageUrl: 'https://picsum.photos/seed/family-news/100/100'},
    { title: 'US inflation decelerating in boost to economy...', category: 'Business', views: '7k', comments: '500', imageUrl: 'https://picsum.photos/seed/business-news/100/100'},
];

const latestComments = [
    { name: 'Jenny Wilson', comment: 'Great News', time: '2 Mins ago', avatarUrl: 'https://i.pravatar.cc/150?u=jenny-wilson' },
    { name: 'Marvin McKinney', comment: 'Great News', time: '2 Mins ago', avatarUrl: 'https://i.pravatar.cc/150?u=marvin-mckinney' },
    { name: 'Robert Fox', comment: 'Great News', time: '2 Mins ago', avatarUrl: 'https://i.pravatar.cc/150?u=robert-fox' },
    { name: 'Cody Fisher', comment: 'Great News', time: '2 Mins ago', avatarUrl: 'https://i.pravatar.cc/150?u=cody-fisher' },
    { name: 'Jane Cooper', comment: 'Great News', time: '2 Mins ago', avatarUrl: 'https://i.pravatar.cc/150?u=jane-cooper' },
];

const CustomTooltip = ({ active, payload, label }: TooltipProps<ValueType, NameType>) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border bg-background p-2 shadow-sm">
          <div className="grid grid-cols-1 gap-2">
            <div className="flex flex-col">
              <span className="text-lg font-bold text-foreground">
                {label}
              </span>
              <div className="text-sm text-muted-foreground">
                {payload.map(p => (
                    <div key={p.name} style={{color: p.color}}>
                        {p.name}: {p.value}
                    </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    }
    return null;
};

export default function AdminPage() {
  return (
    <div className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="bg-gradient-to-br from-blue-100 to-blue-200">
                <CardHeader>
                    <CardTitle>News Readers</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-4xl font-bold">30,000</div>
                    <div className="flex justify-between mt-2">
                        <div>
                            <p className="text-sm text-muted-foreground">Subscribe Users</p>
                            <p className="font-bold text-lg">10,000</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Free Users</p>
                            <p className="font-bold text-lg">20,000</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Featured Section</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-100 rounded-md">
                            <FileText className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="text-4xl font-bold">8+</div>
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Language</CardTitle>
                </CardHeader>
                 <CardContent>
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-red-100 rounded-md">
                            <Languages className="h-6 w-6 text-red-600" />
                        </div>
                        <div className="text-4xl font-bold">40+</div>
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Ad Spaces</CardTitle>
                </CardHeader>
                 <CardContent>
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-green-100 rounded-md">
                            <Percent className="h-6 w-6 text-green-600" />
                        </div>
                        <div className="text-4xl font-bold">4</div>
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Category</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-purple-100 rounded-md">
                            <CheckCircle className="h-6 w-6 text-purple-600" />
                        </div>
                        <div className="text-4xl font-bold">9+</div>
                    </div>
                </CardContent>
            </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
                <Card>
                    <CardHeader>
                        <CardTitle>User Statistic</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <RechartsBarChart data={userStatsData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend />
                                <Bar dataKey="free" name="Free Users" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]}/>
                                <Bar dataKey="subscribed" name="Subscribed" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]}/>
                            </RechartsBarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
            <div className="space-y-6">
                 <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                             <div className="p-3 bg-orange-100 rounded-md">
                                <Newspaper className="h-6 w-6 text-orange-600" />
                            </div>
                            <div>
                                <p className="text-muted-foreground">Published News</p>
                                <p className="font-bold text-2xl">300</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                             <div className="p-3 bg-green-100 rounded-md">
                                <Newspaper className="h-6 w-6 text-green-600" />
                            </div>
                            <div>
                                <p className="text-muted-foreground">Draft News</p>
                                <p className="font-bold text-2xl">30</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                 <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                             <div className="p-3 bg-red-100 rounded-md">
                                <Newspaper className="h-6 w-6 text-red-600" />
                            </div>
                            <div>
                                <p className="text-muted-foreground">Breaking News</p>
                                <p className="font-bold text-2xl">15</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                 <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                             <div className="p-3 bg-purple-100 rounded-md">
                                <FileText className="h-6 w-6 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-muted-foreground">Total Blogs</p>
                                <p className="font-bold text-2xl">40</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-1">
                <CardHeader>
                    <CardTitle>Most Viewed News</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {mostViewedNews.map((news, index) => (
                        <div key={index} className="flex items-center gap-4">
                            <Image src={news.imageUrl} alt={news.title} width={80} height={80} className="rounded-md object-cover" />
                            <div>
                                <Badge variant="outline" className="mb-1">{news.category}</Badge>
                                <h3 className="font-semibold line-clamp-2">{news.title}</h3>
                                <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                                    <span className="flex items-center gap-1"><Eye className="h-3 w-3" /> {news.views}</span>
                                    <span className="flex items-center gap-1"><MessageCircle className="h-3 w-3" /> {news.comments}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>
            <Card className="lg:col-span-1">
                <CardHeader>
                    <CardTitle>Latest Comments</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                     {latestComments.map((comment, index) => (
                        <div key={index} className="flex items-center gap-3">
                           <Avatar>
                                <AvatarImage src={comment.avatarUrl} alt={comment.name} />
                                <AvatarFallback>{comment.name[0]}</AvatarFallback>
                           </Avatar>
                           <div className="flex-1">
                                <div className="flex justify-between items-baseline">
                                    <p className="font-semibold text-sm">{comment.name}</p>
                                    <p className="text-xs text-muted-foreground">{comment.time}</p>
                                </div>
                               <p className="text-sm text-muted-foreground">{comment.comment}</p>
                           </div>
                        </div>
                     ))}
                </CardContent>
            </Card>
             <Card className="lg:col-span-1">
                <CardHeader>
                    <CardTitle>Category Wise News</CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                            <Pie
                                data={categoryWiseNewsData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={80}
                                innerRadius={60}
                                fill="#8884d8"
                                dataKey="value"
                                paddingAngle={5}
                            >
                                {categoryWiseNewsData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-4 text-sm">
                        {categoryWiseNewsData.map((entry) => (
                            <div key={entry.name} className="flex items-center gap-2">
                                <div className="h-2.5 w-2.5 rounded-full" style={{backgroundColor: entry.color}} />
                                <span>{entry.name}</span>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    </div>
  )
}
