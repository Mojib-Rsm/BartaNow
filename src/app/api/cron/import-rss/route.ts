
import { NextResponse } from 'next/server';
import { parseStringPromise } from 'xml2js';
import { getArticles, createArticle, getArticleBySlug } from '@/lib/api';
import { rssFeeds } from '@/lib/rss-feeds';
import type { Article } from '@/lib/types';
import { mockDb } from '@/lib/data'; // for mock user

export async function GET() {
  const results = [];
  const defaultAuthor = mockDb.users.find(u => u.role === 'editor') || mockDb.users[0];

  for (const feedConfig of rssFeeds) {
    try {
      const response = await fetch(feedConfig.url, { next: { revalidate: 3600 } }); // Cache for 1 hour
      if (!response.ok) {
        throw new Error(`Failed to fetch RSS feed: ${response.statusText}`);
      }
      const xml = await response.text();
      const parsed = await parseStringPromise(xml, { explicitArray: false, trim: true });
      
      const items = parsed.rss.channel.item;
      let importedCount = 0;

      for (const item of items) {
        const slug = item.link.split('/').pop();
        if (!slug) continue;

        // Check if article with this slug already exists
        const existingArticle = await getArticleBySlug(slug);
        if (existingArticle) {
          continue; // Skip if article already exists
        }
        
        let category: Article['category'] = feedConfig.defaultCategory;
        if (item.category) {
            const feedCategory = Array.isArray(item.category) ? item.category[0] : item.category;
            category = feedConfig.categoryMap[feedCategory] || feedConfig.defaultCategory;
        }

        const newArticleData: Omit<Article, 'id' | 'publishedAt' | 'aiSummary' | 'slug'> = {
          title: item.title,
          content: [item.description || ''],
          imageUrl: item['media:content']?.$.url || item.enclosure?.$.url || 'https://picsum.photos/seed/placeholder/800/600',
          authorId: defaultAuthor.id,
          authorName: defaultAuthor.name,
          authorAvatarUrl: defaultAuthor.avatarUrl || '',
          category: category,
          sponsored: true, // Mark as sponsored/syndicated
        };

        await createArticle(newArticleData);
        importedCount++;
      }
      results.push({ feed: feedConfig.name, status: 'success', imported: importedCount });

    } catch (error) {
      console.error(`Error processing feed ${feedConfig.name}:`, error);
      results.push({ feed: feedConfig.name, status: 'error', message: error.message });
    }
  }

  return NextResponse.json({ message: 'RSS import process completed.', results });
}
