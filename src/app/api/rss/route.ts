
import { getArticles } from '@/lib/api';
import RSS from 'rss';
import { NextResponse } from 'next/server';

export async function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.bartanow.com';
  const feed = new RSS({
    title: 'BartaNow | বার্তা নাও - সর্বশেষ সংবাদ',
    description: 'বার্তা নাও থেকে সর্বশেষ এবং নির্ভরযোগ্য সংবাদের জন্য আপনার বিশ্বস্ত উৎস।',
    feed_url: `${siteUrl}/api/rss`,
    site_url: siteUrl,
    language: 'bn',
    pubDate: new Date(),
    ttl: 60,
  });

  const { articles } = await getArticles({ limit: 20 });

  articles.forEach(article => {
    feed.item({
      title: article.title,
      description: article.aiSummary,
      url: `${siteUrl}/${article.slug}`,
      guid: article.id,
      author: article.authorName,
      date: article.publishedAt,
      enclosure: {
        url: article.imageUrl,
        type: 'image/jpeg', // Assuming jpeg, adjust if needed
      },
      categories: [article.category],
    });
  });

  const xml = feed.xml({ indent: true });

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
}
