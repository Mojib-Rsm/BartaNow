
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import type { MenuItem } from '@/lib/types';
import { createMenuItemAction, updateMenuItemAction } from '@/app/actions';
import { useState } from 'react';

const menuItemSchema = z.object({
  name: z.string().min(2, "নাম কমপক্ষে ২ অক্ষরের হতে হবে।"),
  href: z.string().min(1, "লিংক আবশ্যক।"),
});

type FormValues = z.infer<typeof menuItemSchema>;

type MenuFormProps = {
    item: MenuItem | null;
    onSuccess: (item: MenuItem) => void;
    onCancel: () => void;
};

export default function MenuForm({ item, onSuccess, onCancel }: MenuFormProps) {
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();
    const isEditing = !!item;

    const form = useForm<FormValues>({
        resolver: zodResolver(menuItemSchema),
        defaultValues: {
            name: item?.name || '',
            href: item?.href || '',
        },
    });

    const onSubmit = async (data: FormValues) => {
        setLoading(true);
        const result = isEditing
            ? await updateMenuItemAction(item!.id, data)
            : await createMenuItemAction(data);
        
        setLoading(false);

        if (result.success && result.item) {
            toast({
                title: 'সফল',
                description: result.message,
            });
            onSuccess(result.item);
        } else {
            toast({
                variant: 'destructive',
                title: 'ব্যর্থ',
                description: result.message,
            });
        }
    };

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
            <div className="grid gap-2">
                <Label htmlFor="name">মেন্যু নাম</Label>
                <Input id="name" {...form.register('name')} placeholder="যেমন: সর্বশেষ" />
                {form.formState.errors.name && (
                    <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>
                )}
            </div>
            <div className="grid gap-2">
                <Label htmlFor="href">লিংক (URL)</Label>
                <Input id="href" {...form.register('href')} placeholder="/category/latest" />
                 {form.formState.errors.href && (
                    <p className="text-xs text-destructive">{form.formState.errors.href.message}</p>
                )}
            </div>
            <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="ghost" onClick={onCancel}>বাতিল করুন</Button>
                <Button type="submit" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isEditing ? 'আপডেট করুন' : 'তৈরি করুন'}
                </Button>
            </div>
        </form>
    );
}
