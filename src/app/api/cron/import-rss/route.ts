
import { NextResponse } from 'next/server';
import { parseStringPromise } from 'xml2js';
import { getArticleBySlug, createArticle, getAllRssFeeds, createMedia } from '@/lib/api';
import type { Article } from '@/lib/types';
import { mockDb } from '@/lib/data'; // for mock user
import { uploadImage } from '@/lib/imagekit';

export async function GET() {
  const results = [];
  const defaultAuthor = mockDb.users.find(u => u.role === 'editor') || mockDb.users[0];

  const rssFeeds = await getAllRssFeeds();

  for (const feedConfig of rssFeeds) {
    try {
      const response = await fetch(feedConfig.url, { next: { revalidate: 3600 } }); // Cache for 1 hour
      if (!response.ok) {
        throw new Error(`Failed to fetch RSS feed: ${response.statusText}`);
      }
      const xml = await response.text();
      const parsed = await parseStringPromise(xml, { explicitArray: false, trim: true });
      
      const items = parsed.rss.channel.item;
      if (!items) {
        results.push({ feed: feedConfig.name, status: 'success', imported: 0, message: 'No items found in feed.' });
        continue;
      }
      
      const postItems = Array.isArray(items) ? items : [items];
      let importedCount = 0;

      for (const item of postItems) {
        const slug = item.link?.split('/').pop() || item.title.toLowerCase().replace(/\s+/g, '-');
        if (!slug) continue;

        // Check if article with this slug already exists
        const existingArticle = await getArticleBySlug(slug);
        if (existingArticle) {
          continue; // Skip if article already exists
        }
        
        let category: Article['category'] = feedConfig.defaultCategory;
        if (item.category) {
            const feedCategory = Array.isArray(item.category) ? item.category[0] : item.category;
            // Attempt to map category, case-insensitively
            const foundCategoryKey = Object.keys(feedConfig.categoryMap).find(key => key.toLowerCase() === feedCategory.toLowerCase());
            if(foundCategoryKey && feedConfig.categoryMap[foundCategoryKey]) {
                category = feedConfig.categoryMap[foundCategoryKey];
            }
        }
        
        // Extract image from various possible tags
        const sourceImageUrl = item['media:content']?.$?.url || item.enclosure?.$?.url;
        let finalImageUrl = 'https://picsum.photos/seed/placeholder/800/600'; // Default placeholder

        if (sourceImageUrl) {
            try {
                const imageResponse = await fetch(sourceImageUrl);
                if (imageResponse.ok) {
                    const blob = await imageResponse.blob();
                    const buffer = Buffer.from(await blob.arrayBuffer());
                    const base64String = `data:${blob.type};base64,${buffer.toString('base64')}`;
                    
                    finalImageUrl = await uploadImage(base64String, `${slug}-featured-image.png`);
                    
                    // Also save to media library
                    await createMedia({
                        fileName: `${slug}-featured-image.png`,
                        url: finalImageUrl,
                        mimeType: blob.type,
                        size: blob.size,
                        uploadedBy: defaultAuthor.id,
                    });
                }
            } catch (e) {
                console.error(`Could not download or upload image from RSS for post "${item.title}":`, e);
            }
        }
        
        // Extract description and clean up HTML
        const descriptionHtml = item.description || item['content:encoded'] || '';
        const descriptionText = descriptionHtml.replace(/<[^>]*>?/gm, ''); // Basic HTML strip
        const paragraphs = descriptionText.split('\n').filter(p => p.trim() !== '');

        const newArticleData: Omit<Article, 'id' | 'aiSummary' | 'slug'> = {
          title: item.title,
          content: paragraphs.length > 0 ? paragraphs : [descriptionText.substring(0, 400)], // Fallback content
          imageUrl: finalImageUrl,
          authorId: defaultAuthor.id,
          authorName: defaultAuthor.name,
          authorAvatarUrl: defaultAuthor.avatarUrl || '',
          category: category,
          sponsored: true, // Mark as sponsored/syndicated
          publishedAt: new Date(item.pubDate).toISOString()
        };

        await createArticle(newArticleData);
        importedCount++;
      }
      results.push({ feed: feedConfig.name, status: 'success', imported: importedCount });

    } catch (error: any) {
      console.error(`Error processing feed ${feedConfig.name}:`, error);
      results.push({ feed: feedConfig.name, status: 'error', message: error.message });
    }
  }

  return NextResponse.json({ message: 'RSS import process completed.', results });
}
