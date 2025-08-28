
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { User } from '@/lib/types';

type Comment = {
  id: number;
  author: string;
  avatar: string;
  text: string;
  timestamp: string;
};

const mockComments: Comment[] = [
    { id: 1, author: 'আরিফ হোসেন', avatar: 'https://i.pravatar.cc/150?u=commenter-1', text: 'খুবই তথ্যবহুল একটি লেখা। ধন্যবাদ!', timestamp: '২ ঘন্টা আগে' },
    { id: 2, author: 'সুমি আক্তার', avatar: 'https://i.pravatar.cc/150?u=commenter-2', text: 'এই বিষয়ে আরও বিস্তারিত জানতে চাই।', timestamp: '১ ঘন্টা আগে' },
];


export default function CommentsSection({ articleId }: { articleId: string }) {
    const [comments, setComments] = useState(mockComments);
    const [newComment, setNewComment] = useState('');
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('bartaNowUser');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const handlePostComment = () => {
        if (newComment.trim() && user) {
            const comment: Comment = {
                id: Date.now(),
                author: user.name,
                avatar: user.avatarUrl || `/user.png`,
                text: newComment,
                timestamp: 'এখন',
            };
            setComments([comment, ...comments]);
            setNewComment('');
        }
    };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-xl">মতামত দিন</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
            <Textarea 
                placeholder={user ? "আপনার মতামত লিখুন..." : "মতামত জানাতে লগইন করুন"}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                disabled={!user}
            />
             {!user && (
                <p className="text-xs text-muted-foreground">
                    মতামত জানাতে অনুগ্রহ করে{' '}
                    <Link href="/login" className="text-primary hover:underline">
                         লগইন করুন
                    </Link>
                    ।
                </p>
             )}
        </div>
        <div className="flex justify-end">
            <Button onClick={handlePostComment} disabled={!user || !newComment.trim()}>
                পোস্ট করুন
            </Button>
        </div>
        <div className="space-y-4">
            {comments.map(comment => (
                <div key={comment.id} className="flex items-start gap-4">
                    <Avatar>
                        <AvatarImage src={comment.avatar} alt={comment.author} />
                        <AvatarFallback>{comment.author.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                        <div className="flex items-baseline gap-2">
                           <p className="font-semibold text-sm">{comment.author}</p>
                           <p className="text-xs text-muted-foreground">{comment.timestamp}</p>
                        </div>
                        <p className="text-sm text-foreground/90">{comment.text}</p>
                    </div>
                </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}
