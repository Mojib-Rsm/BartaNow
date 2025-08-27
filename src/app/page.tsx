import { getArticles, getMemeNews } from '@/lib/api';
import HomePageClient from '@/components/home-page-client';
import SeedButton from '@/components/seed-button';

export default async function Home() {
    const [
        initialArticles,
        latestArticlesResult,
        politicsResult,
        nationalResult,
        sportsResult,
        entertainmentResult,
        techResult,
        editorsPicksResult,
        videoArticlesResult,
        islamicLifeResult,
        factCheckResult,
        memeNewsResult,
      ] = await Promise.all([
        getArticles({ page: 1, limit: 13 }),
        getArticles({ page: 1, limit: 6 }),
        getArticles({ category: 'রাজনীতি', limit: 4 }),
        getArticles({ category: 'জাতীয়', limit: 3 }),
        getArticles({ category: 'খেলা', limit: 4 }),
        getArticles({ category: 'বিনোদন', limit: 4 }),
        getArticles({ category: 'প্রযুক্তি', limit: 4 }),
        getArticles({ editorsPick: true, limit: 4 }),
        getArticles({ hasVideo: true, limit: 5 }),
        getArticles({ category: 'ইসলামী জীবন', limit: 4 }),
        getArticles({ category: 'তথ্য যাচাই', limit: 4 }),
        getMemeNews(),
      ]);

      const { articles } = initialArticles;

       if (articles.length === 0) {
        return (
          <div className="text-center py-16 col-span-full">
            <p className="text-muted-foreground mb-4">কোনো আর্টিকেল খুঁজে পাওয়া যায়নি।</p>
            <div className="absolute top-4 right-4 z-50">
              <SeedButton />
            </div>
          </div>
        );
      }

    return <HomePageClient
        initialArticles={initialArticles}
        latestArticlesResult={latestArticlesResult}
        politicsResult={politicsResult}
        nationalResult={nationalResult}
        sportsResult={sportsResult}
        entertainmentResult={entertainmentResult}
        techResult={techResult}
        editorsPicksResult={editorsPicksResult}
        videoArticlesResult={videoArticlesResult}
        islamicLifeResult={islamicLifeResult}
        factCheckResult={factCheckResult}
        memeNewsResult={memeNewsResult}
    />
}
