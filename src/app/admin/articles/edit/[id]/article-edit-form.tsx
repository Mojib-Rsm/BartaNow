
'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { Article, Author } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { updateArticleAction } from '@/app/actions';
import Link from 'next/link';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const formSchema = z.object({
  id: z.string(),
  title: z.string().min(10, "শিরোনাম কমপক্ষে ১০ অক্ষরের হতে হবে।"),
  content: z.string().min(50, "কনটেন্ট কমপক্ষে ৫০ অক্ষরের হতে হবে।"),
  category: z.enum(['রাজনীতি' , 'খেলা' , 'প্রযুক্তি' , 'বিনোদন' , 'অর্থনীতি' , 'আন্তর্জাতিক' , 'মতামত' , 'স্বাস্থ্য' , 'শিক্ষা' , 'পরিবেশ' , 'বিশেষ-কভারেজ' , 'জাতীয়' , 'ইসলামী-জীবন' , 'তথ্য-যাচাই' , 'মিম-নিউজ', 'ভিডিও' , 'সর্বশেষ' , 'সম্পাদকের-পছন্দ']),
  imageUrl: z.string().url("সঠিক ইমেজ URL দিন।").optional().or(z.literal('')),
  authorId: z.string().min(1, "লেখক নির্বাচন করুন।"),
});


type FormValues = z.infer<typeof formSchema>;

type ArticleEditFormProps = {
    article: Article;
    authors: Author[];
}

export default function ArticleEditForm({ article, authors }: ArticleEditFormProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: article.id,
      title: article.title || '',
      content: article.content.join('\n\n') || '',
      category: article.category || 'সর্বশেষ',
      imageUrl: article.imageUrl || '',
      authorId: article.authorId || '',
    },
  });
  const [useState] = React.useState(false);

  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    const result = await updateArticleAction(data);
    setLoading(false);

    if (result.success) {
      toast({
        title: 'সফল',
        description: 'আর্টিকেল সফলভাবে আপডেট হয়েছে।',
      });
      router.push('/admin/articles');
    } else {
      toast({
        variant: 'destructive',
        title: 'আপডেট ব্যর্থ',
        description: result.message,
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-headline">আর্টিকেল এডিট করুন</CardTitle>
        <CardDescription>
          আর্টিকেলের তথ্য পরিবর্তন করুন।
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

          <div className="grid gap-2">
            <Label htmlFor="title">শিরোনাম</Label>
            <Input id="title" {...form.register('title')} />
            {form.formState.errors.title && (
              <p className="text-xs text-destructive">{form.formState.errors.title.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="content">কনটেন্ট</Label>
            <Textarea id="content" {...form.register('content')} className="min-h-[200px]" />
             {form.formState.errors.content && (
              <p className="text-xs text-destructive">{form.formState.errors.content.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="grid gap-2">
                <Label htmlFor="category">ক্যাটাগরি</Label>
                <Select onValueChange={(value) => form.setValue('category', value as FormValues['category'])} defaultValue={form.getValues('category')}>
                    <SelectTrigger id="category">
                    <SelectValue placeholder="ক্যাটাগরি নির্বাচন করুন" />
                    </SelectTrigger>
                    <SelectContent>
                        {['রাজনীতি' , 'খেলা' , 'প্রযুক্তি' , 'বিনোদন' , 'অর্থনীতি' , 'আন্তর্জাতিক' , 'মতামত' , 'স্বাস্থ্য' , 'শিক্ষা' , 'পরিবেশ' , 'বিশেষ-কভারেজ' , 'জাতীয়' , 'ইসলামী-জীবন' , 'তথ্য-যাচাই' , 'মিম-নিউজ', 'ভিডিও' , 'সর্বশেষ' , 'সম্পাদকের-পছন্দ'].map(cat => (
                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                 {form.formState.errors.category && (
                    <p className="text-xs text-destructive">{form.formState.errors.category.message}</p>
                )}
            </div>
             <div className="grid gap-2">
                <Label htmlFor="authorId">লেখক</Label>
                <Select onValueChange={(value) => form.setValue('authorId', value)} defaultValue={form.getValues('authorId')}>
                    <SelectTrigger id="authorId">
                        <SelectValue placeholder="লেখক নির্বাচন করুন" />
                    </SelectTrigger>
                    <SelectContent>
                        {authors.map(author => (
                            <SelectItem key={author.id} value={author.id}>{author.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                 {form.formState.errors.authorId && (
                    <p className="text-xs text-destructive">{form.formState.errors.authorId.message}</p>
                )}
            </div>
          </div>
          
           <div className="grid gap-2">
            <Label htmlFor="imageUrl">ইমেজ URL</Label>
            <Input id="imageUrl" {...form.register('imageUrl')} />
            {form.formState.errors.imageUrl && (
              <p className="text-xs text-destructive">{form.formState.errors.imageUrl.message}</p>
            )}
          </div>


          <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="ghost" asChild>
                  <Link href="/admin/articles">বাতিল করুন</Link>
              </Button>
              <Button type="submit" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  আপডেট করুন
              </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
