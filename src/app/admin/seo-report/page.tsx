
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { getArticles } from "@/lib/api";
import { SeoOverview } from "./seo-overview";
import type { Metadata } from 'next';
import { SeoReportsTable } from "./seo-reports-table";
import { columns } from "./columns";

export const metadata: Metadata = {
  title: 'SEO রিপোর্ট',
  description: 'ওয়েবসাইটের সার্বিক SEO স্বাস্থ্য এবং আর্টিকেলভিত্তিক বিশ্লেষণ দেখুন।',
};

export default async function SeoReportPage() {
    const { articles } = await getArticles({ limit: 1000 }); // Fetch all articles

    // This is a simplified analysis logic. In a real app, this would be much more complex.
    const analyzedArticles = articles.map(article => {
        let score = 0;
        let issues: string[] = [];

        // Title length check
        const hasMetaTitle = !!article.englishTitle && article.englishTitle.length > 0;
        if (article.title.length > 40 && article.title.length < 70) score += 20;
        else if (article.title.length < 40) issues.push("শিরোনামটি খুব ছোট");
        else issues.push("শিরোনামটি খুব দীর্ঘ");

        // Slug check
        if (article.slug && article.slug.length > 0) score += 10;
        else issues.push("আর্টিকেলের লিংক (slug) নেই");

        // AI Summary as meta description
        const hasGoodMetaDescription = article.aiSummary && article.aiSummary.length > 70 && article.aiSummary.length < 160;
        if (hasGoodMetaDescription) score += 20;
        else if (!article.aiSummary) issues.push("মেটা ডেসক্রিপশন (AI Summary) নেই");
        else issues.push("মেটা ডেসক্রিপশনের দৈর্ঘ্য مناسب নয়");
        
        // Featured image check
        if (article.imageUrl && !article.imageUrl.includes('placeholder')) score += 15;
        else issues.push("ফিচার্ড ইমেজ নেই");
        
        // Content length check
        const wordCount = article.content.split(/\s+/).length;
        if (wordCount > 300) score += 15; // Roughly 300 words
        else issues.push("কনটেন্ট খুব ছোট");
        
        // Tags check
        if (article.tags && article.tags.length > 0) score += 10;
        else issues.push("কোনো ট্যাগ ব্যবহার করা হয়নি");
        
        // Focus keywords check
        if (article.focusKeywords && article.focusKeywords.length > 0) score += 10;
        else issues.push("ফোকাস কীওয়ার্ড নেই");

        return {
            ...article,
            seo: {
                score: score,
                issues: issues,
                wordCount: wordCount,
                hasMetaTitle: hasMetaTitle,
                hasGoodMetaDescription: hasGoodMetaDescription,
            }
        };
    });

  return (
    <div className="w-full space-y-6">
        <div>
            <h1 className="text-3xl font-bold">SEO রিপোর্ট ও বিশ্লেষণ</h1>
            <p className="text-muted-foreground">এখান থেকে ওয়েবসাইটের সার্বিক SEO স্বাস্থ্য এবং আর্টিকেলভিত্তিক বিশ্লেষণ দেখুন।</p>
        </div>

        <SeoOverview articles={analyzedArticles} />

        <Card>
            <CardHeader>
                <CardTitle>আর্টিকেলভিত্তিক বিশ্লেষণ</CardTitle>
                <CardDescription>
                    এখানে প্রতিটি আর্টিকেলের SEO স্কোর এবং উন্নতির জন্য পরামর্শ দেখানো হচ্ছে।
                </CardDescription>
            </CardHeader>
            <CardContent>
                <SeoReportsTable columns={columns} data={analyzedArticles} />
            </CardContent>
        </Card>

    </div>
  );
}
