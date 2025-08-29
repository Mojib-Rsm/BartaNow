
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, FileEdit } from 'lucide-react';
import { generateArticleAction, suggestTrendingTopicsAction } from '@/app/actions';
import type { GenerateArticleOutput } from '@/ai/flows/generate-article';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import { translateForSlug } from '@/ai/flows/translate-for-slug';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const formSchema = z.object({
  prompt: z.string().min(5, { message: 'বিষয়টি কমপক্ষে ৫ অক্ষরের হতে হবে।' }),
});

type FormValues = z.infer<typeof formSchema>;
type ArticleVariant = GenerateArticleOutput['variants'][0];

export default function WriterForm() {
  const [loading, setLoading] = useState(false);
  const [topicSuggestions, setTopicSuggestions] = useState<string[]>([]);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [generatedVariants, setGeneratedVariants] = useState<ArticleVariant[] | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ArticleVariant | null>(null);
  const router = useRouter();

  const { toast } = useToast();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: '',
    },
  });

  const handleSuggestTopics = async () => {
    setIsSuggesting(true);
    setTopicSuggestions([]);
    try {
      const result = await suggestTrendingTopicsAction();
      if (result.success && result.topics) {
        setTopicSuggestions(result.topics);
      } else {
        toast({ variant: "destructive", title: "ব্যর্থ", description: result.message });
      }
    } catch (error) {
      toast({ variant: "destructive", title: "ত্রুটি", description: "AI টপিক আনতে একটি সমস্যা হয়েছে।" });
    }
    setIsSuggesting(false);
  };
  
  const handleCreateArticle = async () => {
    if (!selectedVariant) return;
    const slug = await translateForSlug(selectedVariant.title);
    
    const params = new URLSearchParams({
        title: selectedVariant.title,
        content: selectedVariant.content,
        category: selectedVariant.category,
        slug: slug,
    });
    router.push(`/admin/articles/create?${params.toString()}`);
  }

  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    setGeneratedVariants(null);
    setSelectedVariant(null);
    try {
        const result = await generateArticleAction(data.prompt);
        if (result.success && result.article?.variants.length) {
            setGeneratedVariants(result.article.variants);
            setSelectedVariant(result.article.variants[0]); // Select the first variant by default
            toast({
                title: "সফল",
                description: "AI আপনার জন্য একাধিক আর্টিকেল ভ্যারিয়েন্ট তৈরি করেছে।",
            });
        } else {
            toast({
                variant: "destructive",
                title: "ব্যর্থ",
                description: result.message || "কোনো আর্টিকেল তৈরি করা যায়নি।",
            });
        }
    } catch (error) {
         toast({
            variant: "destructive",
            title: "ত্রুটি",
            description: "AI আর্টিকেল তৈরি করতে একটি সমস্যা হয়েছে।",
        });
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid gap-2">
                    <Label htmlFor="prompt">আর্টিকেলের বিষয় বা শিরোনাম</Label>
                    <Textarea 
                        id="prompt" 
                        placeholder="যেমন: বাংলাদেশের রাজনীতিতে নতুন মেরুকরণ" 
                        {...form.register('prompt')} 
                        rows={4}
                    />
                    {form.formState.errors.prompt && (
                    <p className="text-xs text-destructive">{form.formState.errors.prompt.message}</p>
                    )}
                </div>
                 <Button type="submit" disabled={loading}>
                    {loading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            তৈরি হচ্ছে...
                        </>
                    ) : (
                        <>
                            <Sparkles className="mr-2 h-4 w-4" />
                            আর্টিকেল তৈরি করুন
                        </>
                    )}
                </Button>
            </form>
             <Card className="bg-muted/50">
                <CardHeader>
                    <CardTitle className="text-lg">ট্রেন্ডিং টপিক</CardTitle>
                    <CardDescription>
                        এখান থেকে ট্রেন্ডিং টপিক নিয়ে আর্টিকেল লিখতে পারেন।
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {isSuggesting && <Loader2 className="h-5 w-5 animate-spin" />}
                    {topicSuggestions.length > 0 && (
                        <ul className="space-y-2 list-disc list-inside text-sm">
                            {topicSuggestions.map((topic, i) => (
                                <li key={i} className="hover:text-primary cursor-pointer" onClick={() => form.setValue('prompt', topic)}>
                                    {topic}
                                </li>
                            ))}
                        </ul>
                    )}
                </CardContent>
                <CardFooter>
                     <Button type="button" onClick={handleSuggestTopics} disabled={isSuggesting} variant="outline">
                        {isSuggesting ? "সাজেশন আসছে..." : "নতুন টপিক খুঁজুন"}
                     </Button>
                </CardFooter>
            </Card>
        </div>

        {generatedVariants && generatedVariants.length > 0 && (
            <Card className="mt-6 border-primary">
                <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                        <span>AI দ্বারা তৈরিকৃত খসড়া</span>
                        {selectedVariant && <Badge variant="secondary">{selectedVariant.category}</Badge>}
                    </CardTitle>
                    <CardDescription>
                        AI আপনার জন্য কয়েকটি সংস্করণ তৈরি করেছে। আপনার পছন্দেরটি বেছে নিন।
                    </CardDescription>
                </CardHeader>
                <CardContent>
                     <Tabs defaultValue="variant-0" className="w-full" onValueChange={(value) => setSelectedVariant(generatedVariants[parseInt(value.split('-')[1])])}>
                        <TabsList className="grid w-full grid-cols-3">
                           {generatedVariants.map((_, index) => (
                             <TabsTrigger key={index} value={`variant-${index}`}>ভ্যারিয়েন্ট {index + 1}</TabsTrigger>
                           ))}
                        </TabsList>
                         {generatedVariants.map((variant, index) => (
                             <TabsContent key={index} value={`variant-${index}`} className="space-y-4 mt-4">
                                <div>
                                    <Label>শিরোনাম</Label>
                                    <Input value={variant.title} readOnly />
                                </div>
                                <div>
                                    <Label>কনটেন্ট</Label>
                                    <div
                                        className="prose dark:prose-invert max-w-none border rounded-md p-4 h-96 overflow-y-auto bg-background"
                                        dangerouslySetInnerHTML={{ __html: variant.content }}
                                    />
                                </div>
                             </TabsContent>
                         ))}
                    </Tabs>
                </CardContent>
                <CardFooter>
                    <Button onClick={handleCreateArticle} disabled={!selectedVariant}>
                        <FileEdit className="mr-2 h-4 w-4" />
                        এই ভ্যারিয়েন্টটি ব্যবহার করুন
                    </Button>
                </CardFooter>
            </Card>
        )}
    </div>
  );
}
