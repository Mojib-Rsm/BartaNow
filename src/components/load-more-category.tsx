
'use client';

import { useState, useRef, useEffect } from 'react';
import type { Article } from '@/lib/types';
import { getMoreArticlesAction } from '@/app/actions';
import ArticleCard from './article-card';
import { Loader2 } from 'lucide-react';
import { useDebouncedCallback } from 'use-debounce';
import { Button } from './ui/button';

type LoadMoreCategoryProps = {
    initialArticles: Article[];
    totalPages: number;
    category: string;
};

export default function LoadMoreCategory({ initialArticles, totalPages, category }: LoadMoreCategoryProps) {
    const [articles, setArticles] = useState<Article[]>(initialArticles);
    const [page, setPage] = useState(2);
    const [loading, setLoading] = useState(false);
    const [initialAutoLoadDone, setInitialAutoLoadDone] = useState(false);
    const loaderRef = useRef(null);

    const loadMoreArticles = async () => {
        if (loading || page > totalPages) return;
        setLoading(true);
        const newArticles = await getMoreArticlesAction({ 
            page, 
            limit: 12, 
            category: category as any 
        });

        setArticles((prevArticles) => {
            const existingIds = new Set(prevArticles.map(a => a.id));
            const uniqueNewArticles = newArticles.filter(a => !existingIds.has(a.id));
            return [...prevArticles, ...uniqueNewArticles];
        });
        
        setPage((prevPage) => prevPage + 1);
        setLoading(false);
    };

    const handleManualLoad = () => {
        loadMoreArticles();
    };

    const debouncedAutoLoad = useDebouncedCallback(async () => {
        await loadMoreArticles();
        setInitialAutoLoadDone(true);
    }, 300);

     useEffect(() => {
        if (initialAutoLoadDone) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const target = entries[0];
                if (target.isIntersecting && !loading) {
                    debouncedAutoLoad();
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
    }, [debouncedAutoLoad, initialAutoLoadDone, loading]);


    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {articles.map((article) => (
                    <ArticleCard key={article.id} article={article} />
                ))}
            </div>

            <div ref={loaderRef} className="flex justify-center mt-8 h-10">
                 {loading ? (
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                 ) : (
                    <>
                        {initialAutoLoadDone && page <= totalPages && (
                             <Button onClick={handleManualLoad} variant="outline">
                                আরও পড়ুন
                            </Button>
                        )}
                        {page > totalPages && <p className="text-muted-foreground">সব আর্টিকেল লোড করা হয়েছে।</p>}
                    </>
                 )}
            </div>
        </>
    );
}
