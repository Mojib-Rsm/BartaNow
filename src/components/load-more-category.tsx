'use client';

import { useState, useRef, useEffect } from 'react';
import type { Article } from '@/lib/types';
import { getMoreArticlesAction } from '@/app/actions';
import ArticleCard from './article-card';
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
    const loaderRef = useRef(null);

    const debouncedLoadMore = useDebouncedCallback(async () => {
        if (loading || page > totalPages) return;
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {articles.map((article) => (
                    <ArticleCard key={article.id} article={article} />
                ))}
            </div>

            <div ref={loaderRef} className="flex justify-center mt-8 h-10">
                 {loading && <Loader2 className="h-8 w-8 animate-spin text-primary" />}
                 {page > totalPages && !loading && <p className="text-muted-foreground">সব আর্টিকেল লোড করা হয়েছে।</p>}
            </div>
        </>
    );
}
