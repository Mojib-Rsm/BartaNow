'use client';

import type { MemeNews } from '@/lib/types';
import Image from 'next/image';
import Link from 'next/link';

type MemeCardProps = {
  meme: MemeNews;
};

export default function MemeCard({ meme }: MemeCardProps) {
  return (
    <Link href={`/articles/${meme.articleId}`} className="block group">
      <div className="relative aspect-square w-full bg-black rounded-lg overflow-hidden border-2 border-transparent group-hover:border-primary transition-all duration-300">
        <Image
          src={meme.imageUrl}
          alt={meme.title}
          fill
          className="object-contain"
          data-ai-hint={meme.imageHint}
        />
        <div className="absolute inset-0 flex flex-col justify-between p-4 text-center pointer-events-none">
          <h2 className="text-2xl md:text-3xl font-extrabold text-white uppercase" style={{ WebkitTextStroke: '2px black', textShadow: '2px 2px 4px #000' }}>
            {meme.topText}
          </h2>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white uppercase" style={{ WebkitTextStroke: '2px black', textShadow: '2px 2px 4px #000' }}>
            {meme.bottomText}
          </h2>
        </div>
      </div>
      <p className="text-center mt-2 font-semibold text-muted-foreground group-hover:text-primary transition-colors">
        {meme.title}
      </p>
    </Link>
  );
}
