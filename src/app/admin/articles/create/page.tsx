
'use client';

import { useEffect, useState } from 'react';
import ArticleCreateForm from "./article-create-form"
import type { User } from '@/lib/types';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ArticleCreatePage() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const storedUser = localStorage.getItem('bartaNowUser');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser) as User;
            setUser(parsedUser);
        } else {
            // Redirect to login if not authenticated
            router.push('/login');
        }
        setLoading(false);
    }, [router]);


    if(loading) {
        return <div className="flex justify-center items-center h-full"><Loader2 className="h-8 w-8 animate-spin" /></div>;
    }

    if (!user) {
        // This case should be handled by the redirect, but as a fallback
        return <p>দয়া করে লগইন করুন।</p>
    }

    return (
        <div>
            <ArticleCreateForm userId={user.id} />
        </div>
    )
}
