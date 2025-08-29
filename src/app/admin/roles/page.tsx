
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { roles, allPermissions } from "@/lib/roles-and-permissions";
import type { Role, User, Permission } from "@/lib/types";
import { Check, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const permissionTranslations: Record<Permission, string> = {
    'create_article': 'আর্টিকেল তৈরি',
    'edit_article': 'আর্টিকেল এডিট',
    'delete_article': 'আর্টিকেল ডিলিট',
    'publish_article': 'আর্টিকেল প্রকাশ',
    'create_page': 'পেজ তৈরি',
    'edit_page': 'পেজ এডিট',
    'delete_page': 'পেজ ডিলিট',
    'create_poll': 'জরিপ তৈরি',
    'edit_poll': 'জরিপ এডিট',
    'delete_poll': 'জরিপ ডিলিট',
    'manage_comments': 'মন্তব্য পরিচালনা',
    'approve_comment': 'মন্তব্য অনুমোদন',
    'delete_comment': 'মন্তব্য ডিলিট',
    'view_users': 'ব্যবহারকারী দেখা',
    'create_user': 'ব্যবহারকারী তৈরি',
    'edit_user_profile': 'প্রোফাইল এডিট',
    'delete_user': 'ব্যবহারকারী ডিলিট',
    'change_user_role': 'রোল পরিবর্তন',
    'block_user': 'ব্যবহারকারী ব্লক',
    'manage_media': 'মিডিয়া পরিচালনা',
    'upload_media': 'মিডিয়া আপলোড',
    'delete_media': 'মিডিয়া ডিলিট',
    'manage_settings': 'সেটিংস পরিচালনা',
    'manage_ads': 'বিজ্ঞাপন পরিচালনা',
    'send_notification': 'নোটিফিকেশন পাঠানো',
    'manage_newsletter': 'নিউজলেটার পরিচালনা',
    'manage_rss': 'RSS ফিড পরিচালনা',
    'create_rss': 'RSS ফিড তৈরি',
    'edit_rss': 'RSS ফিড এডিট',
    'delete_rss': 'RSS ফিড ডিলিট',
    'login_as_user': 'অন্য হিসেবে লগইন',
    'manage_tags': 'ট্যাগ পরিচালনা',
    'create_tag': 'ট্যাগ তৈরি',
    'edit_tag': 'ট্যাগ এডিট',
    'delete_tag': 'ট্যাগ ডিলিট',
    'view_reports': 'রিপোর্ট দেখা',
    'view_contact_messages': 'যোগাযোগ বার্তা দেখা',
    'delete_contact_message': 'যোগাযোগ বার্তা ডিলিট'
};


const RoleCard = ({ roleName, role }: { roleName: string, role: Role }) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="capitalize">{roleName}</CardTitle>
                <CardDescription>
                    এই রোলের ব্যবহারকারীরা নিম্নলিখিত কাজগুলো করতে পারবেন।
                </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {Object.keys(allPermissions).map(permission => (
                    <div key={permission} className="flex items-center gap-2">
                        {role.permissions.includes(permission as Permission) ? (
                            <Check className="h-4 w-4 text-green-500" />
                        ) : (
                            <X className="h-4 w-4 text-destructive" />
                        )}
                        <span className="text-sm">{permissionTranslations[permission as Permission] || permission}</span>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
};


export default function RolesAndPermissionsPage() {
    return (
        <div className="w-full space-y-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold">ভূমিকা ও অনুমতিসমূহ</h1>
                    <p className="text-muted-foreground">আপনার ওয়েবসাইটের বিভিন্ন ব্যবহারকারীর ভূমিকা এবং তাদের ক্ষমতা দেখুন।</p>
                </div>
            </div>

            <div className="space-y-6">
                {(Object.keys(roles) as Array<keyof typeof roles>).map(roleKey => (
                    <RoleCard key={roleKey} roleName={roleKey} role={roles[roleKey]} />
                ))}
            </div>
        </div>
    );
}
