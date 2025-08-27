'use client';

import { useState, useEffect } from 'react';
import type { Article } from '@/lib/types';
import { getMoreArticlesAction } from '@/app/actions';
import ArticleCard from './article-card';
import { Button } from './ui/button';
import { Loader2 } from 'lucide-react';
import { useDebouncedCallback } from 'use-debounce';

type LoadMoreProps = {
    initialArticles: Article[];
    totalPages: number;
};

export default function LoadMore({ initialArticles, totalPages }: LoadMoreProps) {
    const [articles, setArticles] = useState<Article[]>(initialArticles);
    const [page, setPage] = useState(2); // Start from the second page
    const [loading, setLoading] = useState(false);

    const debouncedLoadMore = useDebouncedCallback(async () => {
        setLoading(true);
        const newArticles = await getMoreArticlesAction({ page, limit: 6 });
        setArticles((prevArticles) => [...prevArticles, ...newArticles]);
        setPage((prevPage) => prevPage + 1);
        setLoading(false);
    }, 300);

    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
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
                            'আরও পড়ুন'
                        )}
                    </Button>
                </div>
            )}
        </>
    );
}
