
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from "@/components/ui/card"
import {
  BarChart,
  Users,
  Newspaper,
  Eye,
  MessageCircle,
  FileText,
  BarChartHorizontal,
  FolderKanban,
  FileQuestion,
  Smile,
} from 'lucide-react'
import {
  getAllComments,
  getArticles,
  getAllPages,
  getAllUsers,
  getAllPolls,
  getMemeNews,
} from '@/lib/api'
import { mockDb } from "@/lib/data";

const StatCard = ({ title, value, icon: Icon }: { title: string, value: string | number, icon: React.ElementType }) => (
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

export default async function AdminPage() {
    const [
        { articles },
        comments,
        pages,
        users,
        polls,
        memeNews
    ] = await Promise.all([
        getArticles({ limit: 10000 }), // Get all articles for counts
        getAllComments(),
        getAllPages(),
        getAllUsers(),
        getAllPolls(),
        getMemeNews(),
    ]);

    const totalArticles = articles.length;
    const totalComments = comments.length;
    const totalPages = pages.length;
    const totalUsers = users.length;
    const totalPolls = polls.length;
    const totalMemeNews = memeNews.length;
    const uniqueCategories = new Set(mockDb.articles.map(a => a.category)).size;

    // Mock data for stats that don't have an API yet
    const totalVisitors = 12530;
    const totalReports = 5;

  return (
    <div className="space-y-6">
        <h1 className="text-3xl font-bold">ড্যাশবোর্ড</h1>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <StatCard title="সর্বমোট ব্লগ" value={totalArticles} icon={Newspaper} />
            <StatCard title="সর্বমোট ব্যবহারকারী" value={totalUsers} icon={Users} />
            <StatCard title="সর্বমোট ভিজিটর" value={totalVisitors} icon={Eye} />
            <StatCard title="সর্বমোট মন্তব্য" value={totalComments} icon={MessageCircle} />
            <StatCard title="সর্বমোট পেজ" value={totalPages} icon={FileText} />
            <StatCard title="সর্বমোট ক্যাটাগরি" value={uniqueCategories} icon={FolderKanban} />
            <StatCard title="সর্বমোট জরিপ" value={totalPolls} icon={BarChartHorizontal} />
            <StatCard title="সর্বমোট মিম নিউজ" value={totalMemeNews} icon={Smile} />
            <StatCard title="সর্বমোট রিপোর্ট" value={totalReports} icon={FileQuestion} />
        </div>
        
        {/* You can add back the charts here if needed, for now focusing on stat cards */}
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
          <p className="text-muted-foreground">এখানে বিস্তারিত গ্রাফ এবং চার্ট দেখানো হবে।</p>
        </div>
    </div>
  )
}
