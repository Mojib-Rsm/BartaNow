
'use client';

import { useEffect, useState } from 'react';
import type { User } from '@/lib/types';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import UploadForm from './upload-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function MediaUploadPage() {
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
        <Card>
            <CardHeader>
                <CardTitle>নতুন মিডিয়া আপলোড করুন</CardTitle>
                <CardDescription>
                    এখানে ছবি বা অন্যান্য মিডিয়া ফাইল আপলোড করুন। ফাইল টেনে এনে এখানে ছাড়তে পারেন।
                </CardDescription>
            </CardHeader>
            <CardContent>
                <UploadForm userId={user.id} />
            </CardContent>
        </Card>
    )
}
