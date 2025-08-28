
import { getAuthorById, getArticles } from '@/lib/api';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import ArticleCard from '@/components/article-card';
import type { Metadata } from 'next';

type Props = {
  params: { authorId: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const author = await getAuthorById(params.authorId);

  if (!author) {
    return {
      title: 'লেখক খুঁজে পাওয়া যায়নি',
    };
  }
  
  const description = author.bio || `${author.name} এর লেখা আর্টিকেলসমূহ।`;

  return {
    title: `${author.name} এর সকল লেখা`,
    description: description,
    openGraph: {
        title: `${author.name} | বার্তা নাও`,
        description: description,
        type: 'profile',
        images: [
          {
            url: author.avatarUrl,
            width: 150,
            height: 150,
            alt: author.name,
          },
        ],
    },
    twitter: {
        card: 'summary',
        title: `${author.name} | বার্তা নাও`,
        description: description,
    },
  };
}

export default async function AuthorPage({ params }: Props) {
  const author = await getAuthorById(params.authorId);

  if (!author) {
    notFound();
  }

  const { articles } = await getArticles({ authorId: params.authorId, limit: 100 }); // Fetch all articles by author

  const authorInitials = author.name
    .split(' ')
    .map((n) => n[0])
    .join('');

  return (
    <div className="space-y-8">
      <header className="flex flex-col sm:flex-row items-center gap-6 bg-card p-8 rounded-lg shadow-md">
        <Avatar className="h-24 w-24 text-4xl">
          <AvatarImage src={author.avatarUrl} alt={author.name} />
          <AvatarFallback>{authorInitials}</AvatarFallback>
        </Avatar>
        <div className="text-center sm:text-left">
          <h1 className="text-4xl font-bold font-headline text-primary">{author.name}</h1>
          {author.bio && <p className="text-muted-foreground mt-2 max-w-2xl">{author.bio}</p>}
        </div>
      </header>

      <section>
        <h2 className="text-2xl font-bold font-headline text-primary mb-4 pb-2 border-b-2 border-primary">
          {author.name} এর লেখা আর্টিকেলসমূহ
        </h2>

        {articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-muted-foreground">এই লেখকের কোনো আর্টিকেল খুঁজে পাওয়া যায়নি।</p>
          </div>
        )}
      </section>
    </div>
  );
}

    