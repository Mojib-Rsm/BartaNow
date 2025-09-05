
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ShieldCheck, BarChartHorizontal, Smile } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from 'next/link';

type Plugin = {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  isActive: boolean;
  settingsPath?: string;
};

const initialPlugins: Plugin[] = [
  {
    id: 'fact-check',
    name: 'তথ্য যাচাই সিস্টেম',
    description: 'আর্টিকেলে ফ্যাক্ট-চেক মিটার যোগ করুন এবং ভুল তথ্যের বিরুদ্ধে রিপোর্ট করুন।',
    icon: ShieldCheck,
    isActive: true,
    settingsPath: '/admin/articles?category=তথ্য-যাচাই',
  },
  {
    id: 'polls',
    name: 'মতামত জরিপ',
    description: 'পাঠকদের জন্য মতামত জরিপ তৈরি করুন এবং হোমপেজে প্রদর্শন করুন।',
    icon: BarChartHorizontal,
    isActive: true,
    settingsPath: '/admin/polls',
  },
  {
    id: 'meme-news',
    name: 'মিম নিউজ',
    description: 'মজার এবং ভাইরাল কন্টেন্টের জন্য মিম-ভিত্তিক নিউজ ফিচার চালু করুন।',
    icon: Smile,
    isActive: false,
    settingsPath: '/admin/articles?category=মিম-নিউজ',
  },
];

export default function PluginsPage() {
    const [plugins, setPlugins] = useState<Plugin[]>(initialPlugins);

    const togglePlugin = (id: string) => {
        setPlugins(prevPlugins =>
            prevPlugins.map(p =>
                p.id === id ? { ...p, isActive: !p.isActive } : p
            )
        );
    };

    return (
        <div className="w-full space-y-6">
            <div>
                <h1 className="text-3xl font-bold">প্লাগইন ম্যানেজমেন্ট</h1>
                <p className="text-muted-foreground">এখান থেকে ওয়েবসাইটের বিভিন্ন ফিচার (প্লাগইন) সক্রিয় বা নিষ্ক্রিয় করুন।</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {plugins.map((plugin) => (
                    <Card key={plugin.id} className="flex flex-col">
                        <CardHeader className="flex flex-row items-center gap-4">
                             <plugin.icon className="h-8 w-8 text-primary" />
                             <div>
                                <CardTitle>{plugin.name}</CardTitle>
                             </div>
                        </CardHeader>
                        <CardContent className="flex-grow">
                            <p className="text-sm text-muted-foreground">{plugin.description}</p>
                        </CardContent>
                        <CardFooter className="flex justify-between items-center bg-muted/50 p-4">
                            <div className="flex items-center space-x-2">
                                <Switch
                                    id={`switch-${plugin.id}`}
                                    checked={plugin.isActive}
                                    onCheckedChange={() => togglePlugin(plugin.id)}
                                />
                                <Label htmlFor={`switch-${plugin.id}`} className={plugin.isActive ? 'text-primary' : 'text-muted-foreground'}>
                                    {plugin.isActive ? 'সক্রিয়' : 'নিষ্ক্রিয়'}
                                </Label>
                            </div>
                           {plugin.settingsPath && (
                                <Button variant="link" size="sm" asChild>
                                    <Link href={plugin.settingsPath}>সেটিংস</Link>
                                </Button>
                           )}
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}
