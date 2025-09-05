
import { getArticles } from '@/lib/api';
import { NextResponse } from 'next/server';
import { generateNonAiSlug } from '@/lib/utils';

const URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.bartanow.com';

// Google News sitemaps should only contain articles from the last 48 hours.
function generateNewsSiteMap(articles: any[]) {
  const twoDaysAgo = new Date();
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

  const recentArticles = articles.filter(
    (article) => new Date(article.publishedAt) > twoDaysAgo
  );

  const escapeXml = (unsafe: string) => 
    unsafe.replace(/[<>&'"]/g, (c) => {
      switch (c) {
        case '<': return '&lt;';
        case '>': return '&gt;';
        case '&': return '&amp;';
        case '\'': return '&apos;';
        case '"': return '&quot;';
        default: return c;
      }
    });

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
  ${recentArticles
    .map(({ slug, category, publishedAt, title }) => {
      const categorySlug = generateNonAiSlug(category || "uncategorized");
      return `
  <url>
    <loc>${`${URL}/${encodeURIComponent(categorySlug)}/${slug}`}</loc>
    <news:news>
      <news:publication>
        <news:name>BartaNow | বার্তা নাও</news:name>
        <news:language>bn</news:language>
      </news:publication>
      <news:publication_date>${publishedAt}</news:publication_date>
      <news:title>${escapeXml(title)}</news:title>
    </news:news>
  </url>
      `;
    })
    .join('')}
</urlset>`;
}

export async function GET() {
  // Fetch a reasonable number of recent articles
  const { articles } = await getArticles({ limit: 100 });

  const body = generateNewsSiteMap(articles);

  return new NextResponse(body, {
    status: 200,
    headers: {
      'Cache-control': 'public, s-maxage=3600, stale-while-revalidate', // Cache for 1 hour
      'content-type': 'application/xml; charset=utf-8',
    },
  });
}
