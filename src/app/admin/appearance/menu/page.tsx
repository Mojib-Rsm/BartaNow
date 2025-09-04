
import { getMenuItems } from '@/lib/api';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import MenuManager from './menu-manager';

export default async function MenuManagementPage() {
    const menuItems = await getMenuItems();

    return (
        <div className="w-full">
            <Card>
                <CardHeader>
                    <CardTitle>মেন্যু ম্যানেজমেন্ট</CardTitle>
                    <CardDescription>
                        এখান থেকে আপনার ওয়েবসাইটের প্রধান নেভিগেশন মেন্যু পরিচালনা করুন। আইটেমগুলো ড্র্যাগ করে ক্রম পরিবর্তন করতে পারবেন।
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <MenuManager initialItems={menuItems} />
                </CardContent>
            </Card>
        </div>
    )
}
