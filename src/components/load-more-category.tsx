'use client';

import { useState } from 'react';
import type { Article } from '@/lib/types';
import { getMoreArticlesAction } from '@/app/actions';
import ArticleCard from './article-card';
import { Button } from './ui/button';
import { Loader2 } from 'lucide-react';
import { useDebouncedCallback } from 'use-debounce';

type LoadMoreCategoryProps = {
    initialArticles: Article[];
    totalPages: number;
    category: string;
};

export default function LoadMoreCategory({ initialArticles, totalPages, category }: LoadMoreCategoryProps) {
    const [articles, setArticles] = useState<Article[]>(initialArticles);
    const [page, setPage] = useState(2);
    const [loading, setLoading] = useState(false);

    const debouncedLoadMore = useDebouncedCallback(async () => {
        setLoading(true);
        const newArticles = await getMoreArticlesAction({ 
            page, 
            limit: 12, 
            category: category as any 
        });
        setArticles((prevArticles) => [...prevArticles, ...newArticles]);
        setPage((prevPage) => prevPage + 1);
        setLoading(false);
    }, 300);

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {articles.map((article) => (
                    <ArticleCard key={article.id} article={article} />
                ))}
            </div>

            {page <= totalPages && (
                <div className="flex justify-center mt-8">
                    <Button onClick={() => debouncedLoadMore()} disabled={loading} variant="outline" size="lg">
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                লোড হচ্ছে...
                            </>
                        ) : (
                            'আরও লোড করুন'
                        )}
                    </Button>
                </div>
            )}
        </>
    );
}
