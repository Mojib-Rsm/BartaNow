'use client';

import { useState, useEffect, useRef } from 'react';
import type { Article } from '@/lib/types';
import { getMoreArticlesAction } from '@/app/actions';
import ArticleCard from './article-card';
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
    const loaderRef = useRef(null);

    const debouncedLoadMore = useDebouncedCallback(async () => {
        if (loading || page > totalPages) return;
        setLoading(true);
        const newArticles = await getMoreArticlesAction({ page, limit: 6 });
        setArticles((prevArticles) => [...prevArticles, ...newArticles]);
        setPage((prevPage) => prevPage + 1);
        setLoading(false);
    }, 300);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                const target = entries[0];
                if (target.isIntersecting) {
                    debouncedLoadMore();
                }
            },
            { rootMargin: '200px' } 
        );

        if (loaderRef.current) {
            observer.observe(loaderRef.current);
        }

        return () => {
            if (loaderRef.current) {
                observer.unobserve(loaderRef.current);
            }
        };
    }, [debouncedLoadMore]);

    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {articles.map((article) => (
                    <ArticleCard key={article.id} article={article} />
                ))}
            </div>
            
            <div ref={loaderRef} className="flex justify-center mt-8">
                 {loading && <Loader2 className="h-8 w-8 animate-spin text-primary" />}
                 {page > totalPages && <p className="text-muted-foreground">সব আর্টিকেল লোড করা হয়েছে।</p>}
            </div>
        </>
    );
}
