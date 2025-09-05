
import { getArticles, getAllPages, getAllAuthors, getAllCategories } from '@/lib/api';
import { generateNonAiSlug } from '@/lib/utils';

const URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.bartanow.com';

function generateSiteMapIndex() {
  return `<?xml version="1.0" encoding="UTF-8"?>
   <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     <sitemap>
       <loc>${URL}/sitemap-general.xml</loc>
     </sitemap>
     <sitemap>
       <loc>${URL}/sitemap-news.xml</loc>
     </sitemap>
   </sitemapindex>
 `;
}

export async function GET() {
  const body = generateSiteMapIndex();

  return new Response(body, {
    status: 200,
    headers: {
      'Cache-control': 'public, s-maxage=86400, stale-while-revalidate',
      'content-type': 'application/xml; charset=utf-8',
    },
  });
}
