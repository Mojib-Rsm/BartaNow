

import { getArticles, getAllPages, getAllAuthors, getAllCategories } from '@/lib/api';
import { generateNonAiSlug } from '@/lib/utils';

const URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:9002';

function generateSiteMap(
    articles: any[], 
    pages: any[], 
    authors: any[], 
    categories: any[]
) {
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     <!-- Homepage -->
     <url>
       <loc>${URL}</loc>
       <lastmod>${new Date().toISOString()}</lastmod>
       <changefreq>daily</changefreq>
       <priority>1.0</priority>
     </url>
     <!-- Static pages -->
     <url><loc>${URL}/archive</loc><lastmod>${new Date().toISOString()}</lastmod></url>
     <url><loc>${URL}/fact-check</loc><lastmod>${new Date().toISOString()}</lastmod></url>
     <url><loc>${URL}/special-coverage</loc><lastmod>${new Date().toISOString()}</lastmod></url>
     <url><loc>${URL}/category/videos</loc><lastmod>${new Date().toISOString()}</lastmod></url>
     <url><loc>${URL}/subscribe</loc><lastmod>${new Date().toISOString()}</lastmod></url>
     
     <!-- Article pages -->
     ${articles
       .map(({ category, slug, publishedAt }) => {
         const categorySlug = generateNonAiSlug(category || "unnamed");
         return `
       <url>
           <loc>${`${URL}/${encodeURIComponent(categorySlug)}/${slug}`}</loc>
           <lastmod>${publishedAt}</lastmod>
           <changefreq>weekly</changefreq>
           <priority>0.8</priority>
       </url>
     `;
       })
       .join('')}
       
    <!-- Custom static pages -->
    ${pages
        .map(({ slug, lastUpdatedAt }) => {
            return `
        <url>
            <loc>${`${URL}/p/${slug}`}</loc>
            <lastmod>${lastUpdatedAt}</lastmod>
            <changefreq>monthly</changefreq>
            <priority>0.6</priority>
        </url>
        `;
        })
        .join('')}

    <!-- Category pages -->
    ${categories
        .map((category) => {
            const categorySlug = generateNonAiSlug(category.slug || category.name);
            return `
        <url>
            <loc>${`${URL}/category/${encodeURIComponent(categorySlug)}`}</loc>
            <lastmod>${new Date().toISOString()}</lastmod>
            <changefreq>daily</changefreq>
            <priority>0.9</priority>
        </url>
        `;
        })
        .join('')}

    <!-- Author pages -->
    ${authors
        .map(({ id }) => {
            return `
        <url>
            <loc>${`${URL}/authors/${id}`}</loc>
            <lastmod>${new Date().toISOString()}</lastmod>
            <changefreq>weekly</changefreq>
            <priority>0.7</priority>
        </url>
        `;
        })
        .join('')}
   </urlset>
 `;
}

export async function GET() {
  const { articles } = await getArticles({ limit: 1000 }); // Fetch all articles
  const pages = await getAllPages();
  const authors = await getAllAuthors();
  const categories = await getAllCategories();

  const body = generateSiteMap(articles, pages, authors, categories);

  return new Response(body, {
    status: 200,
    headers: {
      'Cache-control': 'public, s-maxage=86400, stale-while-revalidate',
      'content-type': 'application/xml; charset=utf-8',
    },
  });
}
