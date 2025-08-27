import { getArticles } from '@/lib/api';
import ArticleCard from '@/components/article-card';
import Pagination from '@/components/pagination';
import SeedButton from '@/components/seed-button';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Target, Search } from 'lucide-react';


type HomePageProps = {
  searchParams?: {
    page?: string;
  };
};

export default async function Home({ searchParams }: HomePageProps) {
  const page = searchParams?.page ? parseInt(searchParams.page, 10) : 1;
  const { articles, totalPages } = await getArticles({ page, limit: 12 });

  const mainArticle = articles.length > 0 ? articles[0] : null;
  const sideArticles = articles.length > 1 ? articles.slice(1, 5) : [];
  const latestArticles = articles.length > 5 ? articles.slice(5, 11) : [];


  return (
    <div className="space-y-8">
      
      {/* Local News Section */}
      <section className="bg-muted/50 p-3 rounded-md">
        <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 text-primary font-bold">
                <Target className="h-5 w-5" />
                <span>আমার এলাকার খবর</span>
            </div>
            <div className="flex-grow grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                <Select>
                    <SelectTrigger>
                        <SelectValue placeholder="বিভাগ" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="dhaka">ঢাকা</SelectItem>
                        <SelectItem value="chittagong">চট্টগ্রাম</SelectItem>
                        <SelectItem value="khulna">খুলনা</SelectItem>
                        <SelectItem value="rajshahi">রাজশাহী</SelectItem>
                        <SelectItem value="sylhet">সিলেট</SelectItem>
                        <SelectItem value="barisal">বরিশাল</SelectItem>
                        <SelectItem value="rangpur">রংপুর</SelectItem>
                        <SelectItem value="mymensingh">ময়মনসিংহ</SelectItem>
                    </SelectContent>
                </Select>
                <Select>
                    <SelectTrigger>
                        <SelectValue placeholder="জেলা" />
                    </SelectTrigger>
                    <SelectContent>
                        {/* District options would be populated based on division */}
                    </SelectContent>
                </Select>
                <Select>
                    <SelectTrigger>
                        <SelectValue placeholder="উপজেলা" />
                    </SelectTrigger>
                    <SelectContent>
                        {/* Upazila options would be populated based on district */}
                    </SelectContent>
                </Select>
            </div>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Search className="h-4 w-4" />
                খুঁজুন
            </Button>
        </div>
      </section>

      {/* Main News Section */}
      {mainArticle && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-xl font-bold font-headline text-primary">আপনার জন্য</h2>
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5.5 13L10.5 7.5L5.5 2" stroke="currentColor" stroke-width="2"></path></svg>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Large Featured Article */}
            <div className="lg:col-span-2 md:col-span-2">
              <Link href={`/articles/${mainArticle.id}`} className="block group">
                <Card className="overflow-hidden h-full flex flex-col border-0 shadow-none rounded-none">
                  <div className="relative w-full h-64 md:h-80">
                    <Image
                      src={mainArticle.imageUrl}
                      alt={mainArticle.title}
                      fill
                      className="object-cover"
                      data-ai-hint={mainArticle.imageHint}
                      priority
                    />
                  </div>
                  <CardContent className="p-0 pt-4 space-y-2 flex-grow">
                    <h2 className="text-2xl md:text-3xl font-bold font-headline text-foreground group-hover:text-primary transition-colors duration-200">
                      {mainArticle.title}
                    </h2>
                    <p className="text-muted-foreground line-clamp-2 text-md">
                      {mainArticle.aiSummary}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </div>
            
            {/* Side Articles */}
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {sideArticles.map((article) => (
                 <Link key={article.id} href={`/articles/${article.id}`} className="block group">
                  <Card className="border-0 shadow-none rounded-none">
                      <div className="relative w-full h-32">
                         <Image
                          src={article.imageUrl}
                          alt={article.title}
                          fill
                          className="object-cover"
                          data-ai-hint={article.imageHint}
                        />
                      </div>
                      <CardContent className="p-0 pt-3">
                          <h3 className="text-lg font-headline font-bold line-clamp-3 group-hover:text-primary transition-colors duration-200 h-20">
                              {article.title}
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{article.aiSummary}</p>
                      </CardContent>
                  </Card>
                 </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {latestArticles.length > 0 && (
        <section>
            <div className="border-t border-b my-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {latestArticles.slice(0,3).map((article) => (
                      <ArticleCard key={article.id} article={article} variant="compact" />
                  ))}
              </div>
            </div>
        </section>
      )}
      
      {articles.length === 0 && (
         <div className="text-center py-16 col-span-full">
            <p className="text-muted-foreground mb-4">কোনো আর্টিকেল খুঁজে পাওয়া যায়নি।</p>
             <div className="absolute top-4 right-4 z-50">
              <SeedButton />
            </div>
        </div>
      )}

      {totalPages > 1 && (
        <Pagination currentPage={page} totalPages={totalPages} />
      )}
    </div>
  );
}