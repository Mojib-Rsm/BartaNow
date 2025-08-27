import { getArticles } from '@/lib/api';
import type { Metadata } from 'next';
import ArchivePageClient from '@/components/archive-page-client';

export const metadata: Metadata = {
  title: 'আর্কাইভ | বার্তা নাও',
  description: 'তারিখ অনুযায়ী পুরনো খবর খুঁজে বের করুন',
};

export default async function ArchivePage() {
    const { articles } = await getArticles({ date: new Date().toISOString().split('T')[0] });
    return <ArchivePageClient initialArticles={articles} />;
}
