
'use client';

import type { Article } from '@/lib/types';
import Link from 'next/link';
import Image from 'next/image';
import { PlayCircle } from 'lucide-react';
import { generateNonAiSlug } from '@/lib/utils';
import { Card, CardContent } from './ui/card';

type VideoCardProps = {
  article: Article;
  isFeatured?: boolean;
};

export default function VideoCard({ article, isFeatured = false }: VideoCardProps) {
  const categorySlug = generateNonAiSlug(article.category || 'uncategorized');
  const articleUrl = `/${categorySlug}/${article.slug}`;

  if (isFeatured) {
    return (
      <div>
        <div className="relative aspect-video w-full rounded-lg overflow-hidden group">
          <iframe
            src={article.videoUrl}
            title={article.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          ></iframe>
        </div>
        <h2 className="text-2xl font-bold font-headline mt-2 hover:text-primary">
          <Link href={articleUrl}>{article.title}</Link>
        </h2>
      </div>
    );
  }

  return (
    <Link href={articleUrl} className="flex items-center gap-4 group">
      <div className="relative w-24 h-16 shrink-0 rounded-md overflow-hidden">
        <Image 
          src={article.imageUrl}
          alt={article.title}
          fill
          className="object-cover"
          data-ai-hint={article.imageHint}
        />
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
          <PlayCircle className="h-8 w-8 text-white/80" />
        </div>
      </div>
      <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">
        {article.title}
      </h3>
    </Link>
  );
}
