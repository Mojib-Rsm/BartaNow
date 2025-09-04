

import { getPageBySlug } from '@/lib/api';
import { notFound } from 'next/navigation';
import type { Metadata, ResolvingMetadata } from 'next'
 
type Props = {
  params: { slug: string }
}
 
export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const page = await getPageBySlug(decodeURIComponent(params.slug))
 
  if (!page) {
    return {
        title: 'পেজ খুঁজে পাওয়া যায়নি'
    }
  }
 
  const description = page.content.substring(0, 160) || 'বার্তা নাও-এর একটি পেজ';

  return {
    title: page.title,
    description: description,
    openGraph: {
        title: page.title,
        description: description,
        type: 'article',
        url: `/p/${page.slug}`,
    },
    twitter: {
        card: 'summary',
        title: page.title,
        description: description,
    },
  }
}

export default async function StaticPage({ params }: { params: { slug:string } }) {
  const page = await getPageBySlug(decodeURIComponent(params.slug));

  if (!page) {
    notFound();
  }
    
  const publishedDate = new Date(page.publishedAt).toLocaleDateString('bn-BD', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: page.title,
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/p/${page.slug}`,
    description: page.content.substring(0, 160) || 'বার্তা নাও-এর একটি পেজ',
    datePublished: page.publishedAt,
    dateModified: page.lastUpdatedAt,
     publisher: {
        '@type': 'Organization',
        name: 'BartaNow | বার্তা নাও',
        logo: {
            '@type': 'ImageObject',
            url: 'https://raw.githubusercontent.com/Mojib-Rsm/BartaNow/refs/heads/main/public/log-heado.png',
        },
    },
  };

  return (
    <>
     <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-4xl mx-auto">
          <article className="bg-card p-6 sm:p-8 rounded-lg shadow-lg">
              <header className="mb-8 text-center border-b pb-4">
                  <h1 className="text-3xl md:text-5xl font-bold font-headline text-primary mb-4">
                  {page.title}
                  </h1>
                   <p className="text-sm text-muted-foreground">
                      সর্বশেষ আপডেট: {new Date(page.lastUpdatedAt).toLocaleDateString('bn-BD', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
              </header>

              <div 
                  className="prose prose-lg dark:prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: page.content }}
              />
          </article>
      </div>
    </>
  );
}
