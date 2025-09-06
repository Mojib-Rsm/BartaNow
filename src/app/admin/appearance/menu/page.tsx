
import { getMenuItems, getAllCategories } from '@/lib/api';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import MenuManager from './menu-manager';

export default async function MenuManagementPage() {
    const [menuItems, categories] = await Promise.all([
        getMenuItems(),
        getAllCategories(),
    ]);

    return (
        <div className="w-full">
            <Card>
                <CardHeader>
                    <CardTitle>মেন্যু ও ক্যাটাগরি ম্যানেজমেন্ট</CardTitle>
                    <CardDescription>
                        এখান থেকে আপনার ওয়েবসাইটের প্রধান নেভিগেশন মেন্যু এবং ক্যাটাগরির ক্রম পরিচালনা করুন। আইটেমগুলো ড্র্যাগ করে ক্রম পরিবর্তন করতে পারবেন।
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <MenuManager initialMenuItems={menuItems} initialCategories={categories} />
                </CardContent>
            </Card>
        </div>
    )
}
