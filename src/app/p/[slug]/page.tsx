
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
 
  const description = page.content[0]?.substring(0, 160) || 'বার্তা নাও-এর একটি পেজ';

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

  return (
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

            <div className="prose prose-lg dark:prose-invert max-w-none space-y-6 text-foreground/90">
                {page.content.map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                ))}
            </div>
        </article>
    </div>
  );
}

    