
import { getArticles } from '@/lib/api';
import { NextResponse } from 'next/server';
import { generateNonAiSlug } from '@/lib/utils';
import type { Article } from '@/lib/types';

const URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.bartanow.com';

// Google News sitemaps should ideally contain articles from the last 48 hours.
// This function will prioritize recent articles but will fall back to the latest articles
// to ensure the sitemap is never empty.
function generateNewsSiteMap(articles: Article[]) {
  const twoDaysAgo = new Date();
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

  let recentArticles = articles.filter(
    (article) => new Date(article.publishedAt) > twoDaysAgo
  );

  // If no articles in the last 48 hours, fall back to the 10 most recent articles to avoid an empty sitemap
  if (recentArticles.length === 0 && articles.length > 0) {
    recentArticles = articles.slice(0, 10);
  }

  const escapeXml = (unsafe: string | undefined) => {
    if (!unsafe) return '';
    return unsafe.replace(/[<>&'"]/g, (c) => {
      switch (c) {
        case '<': return '&lt;';
        case '>': return '&gt;';
        case '&': return '&amp;';
        case '\'': return '&apos;';
        case '"': return '&quot;';
        default: return c;
      }
    });
  }

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
