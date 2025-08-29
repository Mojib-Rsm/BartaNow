
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { User, Comment } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { createCommentAction } from '@/app/actions';
import { getAllComments } from '@/lib/api';
import { Loader2 } from 'lucide-react';

export default function CommentsSection({ articleId }: { articleId: string }) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [user, setUser] = useState<User | null>(null);
    const [loadingComments, setLoadingComments] = useState(true);
    const [posting, setPosting] = useState(false);
    const { toast } = useToast();

    const fetchComments = async () => {
        const fetchedComments = await getAllComments({ articleId, status: 'approved' });
        setComments(fetchedComments);
        setLoadingComments(false);
    };

    useEffect(() => {
        const storedUser = localStorage.getItem('bartaNowUser');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        fetchComments();
    }, [articleId]);

    const handlePostComment = async () => {
        if (!newComment.trim() || !user) return;
        
        setPosting(true);
        const result = await createCommentAction({
            text: newComment,
            articleId: articleId,
            userId: user.id,
            userName: user.name,
            userAvatar: user.avatarUrl || `https://i.pravatar.cc/150?u=${user.id}`,
        });
        setPosting(false);

        if (result.success) {
            setNewComment('');
            toast({
                title: 'সফল',
                description: 'আপনার মন্তব্যটি পর্যালোচনার জন্য জমা দেওয়া হয়েছে।',
            });
            // You might want to refresh comments, but since it's pending, we won't see it yet.
            // fetchComments(); 
        } else {
             toast({
                variant: 'destructive',
                title: 'ব্যর্থ',
                description: result.message,
            });
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
                disabled={!user || posting}
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
            <Button onClick={handlePostComment} disabled={!user || !newComment.trim() || posting}>
                 {posting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                পোস্ট করুন
            </Button>
        </div>
         {loadingComments ? (
             <div className="flex justify-center"><Loader2 className="h-6 w-6 animate-spin"/></div>
         ) : comments.length > 0 ? (
             <div className="space-y-4">
                {comments.map(comment => (
                    <div key={comment.id} className="flex items-start gap-4">
                        <Avatar>
                            <AvatarImage src={comment.userAvatar} alt={comment.userName} />
                            <AvatarFallback>{comment.userName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <div className="flex items-baseline gap-2">
                            <p className="font-semibold text-sm">{comment.userName}</p>
                            <p className="text-xs text-muted-foreground">{new Date(comment.timestamp).toLocaleString('bn-BD')}</p>
                            </div>
                            <p className="text-sm text-foreground/90">{comment.text}</p>
                        </div>
                    </div>
                ))}
            </div>
         ) : (
             <p className="text-center text-sm text-muted-foreground py-4">এখনো কোনো মন্তব্য নেই। প্রথম মন্তব্যটি আপনিই করুন।</p>
         )}
      </CardContent>
    </Card>
  );
}
