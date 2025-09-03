'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SettingsTab } from './settings-tab';
import { QueueTab } from './queue-tab';
import { HistoryTab } from './history-tab';
import { ContentSourcesTab } from './content-sources-tab';

export default function AutoPostPage() {
  return (
    <div className="w-full space-y-6">
      <div>
        <h1 className="text-3xl font-bold">অটো-পোস্ট ম্যানেজমেন্ট</h1>
        <p className="text-muted-foreground">
          এখান থেকে স্বয়ংক্রিয়ভাবে আর্টিকেল তৈরি ও প্রকাশের নিয়মাবলী পরিচালনা করুন।
        </p>
      </div>

      <Tabs defaultValue="settings" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="settings">সেটিংস</TabsTrigger>
          <TabsTrigger value="queue">প্রকাশের অপেক্ষায় (Queue)</TabsTrigger>
          <TabsTrigger value="history">ইতিহাস</TabsTrigger>
          <TabsTrigger value="sources">কনটেন্ট সোর্স</TabsTrigger>
        </TabsList>
        <TabsContent value="settings">
          <SettingsTab />
        </TabsContent>
        <TabsContent value="queue">
          <QueueTab />
        </TabsContent>
        <TabsContent value="history">
          <HistoryTab />
        </TabsContent>
         <TabsContent value="sources">
          <ContentSourcesTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
