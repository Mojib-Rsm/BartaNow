
'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Pie, PieChart } from 'recharts';
import { FileCheck2, FileClock, FileWarning } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

type AnalyzedArticle = {
    id: string;
    seo: {
        score: number;
        issues: string[];
    }
}

type SeoOverviewProps = {
    articles: AnalyzedArticle[];
}

const StatCard = ({ title, value, icon: Icon, colorClass, description }: { title: string, value: string, icon: React.ElementType, colorClass: string, description: string }) => (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            <Icon className={`h-4 w-4 text-muted-foreground ${colorClass}`} />
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">{value}</div>
            <p className="text-xs text-muted-foreground">{description}</p>
        </CardContent>
    </Card>
);

const GaugeChart = ({ score }: { score: number }) => {
    const scoreColor = score > 80 ? 'hsl(var(--primary))' : score > 50 ? 'hsl(var(--chart-2))' : 'hsl(var(--destructive))';
    return (
        <div className="relative flex h-48 w-48 items-center justify-center">
            <Progress value={score} className="absolute h-full w-full rounded-full" style={{ background: `conic-gradient(${scoreColor} ${score * 3.6}deg, hsl(var(--muted)) 0deg)` }} />
            <div className="absolute flex h-[85%] w-[85%] items-center justify-center rounded-full bg-background">
                <span className="text-4xl font-bold" style={{ color: scoreColor }}>{score}</span>
            </div>
        </div>
    );
};

export function SeoOverview({ articles }: SeoOverviewProps) {

    const seoStats = useMemo(() => {
        if (!articles || articles.length === 0) {
            return {
                averageScore: 0,
                goodCount: 0,
                improvementCount: 0,
                criticalCount: 0
            };
        }

        const totalScore = articles.reduce((acc, article) => acc + article.seo.score, 0);
        const averageScore = Math.round(totalScore / articles.length);
        
        const goodCount = articles.filter(a => a.seo.score >= 80).length;
        const improvementCount = articles.filter(a => a.seo.score >= 50 && a.seo.score < 80).length;
        const criticalCount = articles.filter(a => a.seo.score < 50).length;
        
        return { averageScore, goodCount, improvementCount, criticalCount };
    }, [articles]);


    const breakdownData = [
        { name: 'Good', value: seoStats.goodCount, fill: 'hsl(var(--chart-1))' },
        { name: 'Needs Improvement', value: seoStats.improvementCount, fill: 'hsl(var(--chart-2))' },
        { name: 'Critical', value: seoStats.criticalCount, fill: 'hsl(var(--destructive))' },
    ];
    
    const chartConfig = {
      good: { label: "Good", color: "hsl(var(--chart-1))" },
      improvement: { label: "Needs Improvement", color: "hsl(var(--chart-2))" },
      critical: { label: "Critical", color: "hsl(var(--destructive))" },
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-1 flex flex-col items-center justify-center p-6">
                <h3 className="text-lg font-semibold mb-4">সার্বিক SEO স্কোর</h3>
                <GaugeChart score={seoStats.averageScore} />
                 <p className="text-sm text-muted-foreground mt-4 text-center">আপনার সকল পোস্টের গড় SEO স্কোর</p>
            </Card>

            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                <StatCard 
                    title="মোট পোস্ট"
                    value={new Intl.NumberFormat('bn-BD').format(articles.length)}
                    icon={FileCheck2}
                    colorClass=""
                    description="বিশ্লেষণ করা মোট পোস্টের সংখ্যা"
                />
                 <StatCard 
                    title="উন্নতি প্রয়োজন"
                    value={new Intl.NumberFormat('bn-BD').format(seoStats.improvementCount)}
                    icon={FileClock}
                    colorClass="text-orange-500"
                    description="এই পোস্টগুলোর SEO উন্নত করা যেতে পারে"
                />
                <StatCard 
                    title="ভালো SEO"
                    value={new Intl.NumberFormat('bn-BD').format(seoStats.goodCount)}
                    icon={FileCheck2}
                    colorClass="text-green-500"
                    description="এই পোস্টগুলোর SEO স্কোর ৮০ বা তার বেশি"
                />
                <StatCard 
                    title="গুরুতর সমস্যা"
                    value={new Intl.NumberFormat('bn-BD').format(seoStats.criticalCount)}
                    icon={FileWarning}
                    colorClass="text-red-500"
                    description="এই পোস্টগুলোতে জরুরি ভিত্তিতে SEO ঠিক করা প্রয়োজন"
                />
            </div>
            
            <Card className="lg:col-span-3">
                <CardHeader>
                    <CardTitle>SEO Breakdown</CardTitle>
                </CardHeader>
                <CardContent className="h-[250px] flex items-center justify-center">
                     <ChartContainer config={chartConfig} className="mx-auto aspect-square h-full">
                          <PieChart>
                            <ChartTooltip content={<ChartTooltipContent nameKey="name" hideLabel />} />
                            <Pie data={breakdownData} dataKey="value" nameKey="name" innerRadius={60} strokeWidth={5}>
                            </Pie>
                          </PieChart>
                     </ChartContainer>
                </CardContent>
            </Card>

        </div>
    );
}
