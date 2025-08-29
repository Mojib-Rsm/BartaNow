
'use client';

import { Suspense, useEffect, useState } from 'react';
import ArticleCreateForm from "./article-create-form"
import type { User } from '@/lib/types';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

function ArticleCreatePageContent() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const storedUser = localStorage.getItem('bartaNowUser');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser) as User;
            setUser(parsedUser);
        } else {
            router.push('/login');
        }
        setLoading(false);
    }, [router]);


    if(loading) {
        return <div className="flex justify-center items-center h-full"><Loader2 className="h-8 w-8 animate-spin" /></div>;
    }

    if (!user) {
        return <p>দয়া করে লগইন করুন।</p>
    }

    return (
        <div>
            <ArticleCreateForm userId={user.id} />
        </div>
    )
}

export default function ArticleCreatePage() {
    return (
        <Suspense fallback={<div className="flex justify-center items-center h-full"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
            <ArticleCreatePageContent />
        </Suspense>
    )
}
