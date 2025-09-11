
import { getArticles, getAllPages, getAllAuthors, getAllCategories, getAllTags } from '@/lib/api';
import { generateNonAiSlug } from '@/lib/utils';
import type { Article, Author, Page, Category, Tag } from '@/lib/types';
import { NextResponse } from 'next/server';

const URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.bartanow.com';

function escapeXml(unsafe: string | undefined) {
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

function generateSiteMap(
    articles: Article[], 
    pages: Page[], 
    authors: Author[],
    categories: Category[],
    tags: Tag[]
    ) {
  let xml = `<?xml version="1.0" encoding="UTF-8"?>`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">`;

  // Add homepage
  xml += `
    <url>
      <loc>${URL}</loc>
      <priority>1.00</priority>
    </url>
  `;

  // Add static pages from the database
  pages.forEach((page) => {
    xml += `
      <url>
        <loc>${`${URL}/p/${page.slug}`}</loc>
        <lastmod>${new Date(page.lastUpdatedAt).toISOString()}</lastmod>
        <priority>0.80</priority>
      </url>
    `;
  });
  
  // Add other key static pages not in the DB
  const staticRoutes = [
    '/contact', 
    '/archive', 
    '/fact-check', 
    '/category/videos', 
    '/special-coverage', 
    '/subscribe',
    '/p/privacy-policy',
    '/p/terms-of-use'
  ];
  staticRoutes.forEach(route => {
      xml += `
      <url>
        <loc>${`${URL}${route}`}</loc>
        <priority>0.70</priority>
      </url>
    `;
  });

  // Add articles
  articles.forEach((article) => {
    const categorySlug = generateNonAiSlug(article.category || 'uncategorized');
    xml += `
      <url>
        <loc>${`${URL}/${categorySlug}/${article.slug}`}</loc>
        <lastmod>${new Date(article.publishedAt).toISOString()}</lastmod>
        <priority>0.90</priority>
        <image:image>
            <image:loc>${escapeXml(article.imageUrl)}</image:loc>
            <image:title>${escapeXml(article.title)}</image:title>
            <image:caption>${escapeXml(article.aiSummary)}</image:caption>
        </image:image>
      </url>
    `;
  });
  
  // Add categories
  categories.forEach((category) => {
    xml += `
        <url>
            <loc>${`${URL}/category/${generateNonAiSlug(category.name)}`}</loc>
            <priority>0.80</priority>
        </url>
    `;
  });

  // Add tags
  tags.forEach((tag) => {
    xml += `
        <url>
            <loc>${`${URL}/tag/${tag.slug}`}</loc>
            <priority>0.70</priority>
        </url>
    `;
  });
  
   // Add authors
  authors.forEach((author) => {
    xml += `
        <url>
            <loc>${`${URL}/authors/${author.id}`}</loc>
            <priority>0.70</priority>
        </url>
    `;
  });

  xml += `</urlset>`;
  return xml;
}

export async function GET() {
    const [
        { articles },
        pages,
        authors,
        categories,
        tags
    ] = await Promise.all([
        getArticles({ limit: 10000 }), // get all articles
        getAllPages(),
        getAllAuthors(),
        getAllCategories(),
        getAllTags()
    ]);

    const body = generateSiteMap(articles, pages, authors, categories, tags);

    return new NextResponse(body, {
        status: 200,
        headers: {
        'Cache-control': 'public, s-maxage=86400, stale-while-revalidate',
        'content-type': 'application/xml; charset=utf-8',
        },
    });
}
