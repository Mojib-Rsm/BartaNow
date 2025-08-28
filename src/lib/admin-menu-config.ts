
import {
  Home,
  Newspaper,
  Users,
  Settings,
  BarChart2,
  Megaphone,
  ImageIcon,
  MessagesSquare,
  BellRing,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export type AdminMenuItem = {
  path: string;
  label: string;
  icon: LucideIcon;
  roles?: ('admin' | 'editor' | 'reporter' | 'user')[];
  children?: AdminMenuItem[];
};

export const adminMenuConfig: AdminMenuItem[] = [
  {
    path: '/admin',
    label: 'ড্যাশবোর্ড',
    icon: BarChart2,
    roles: ['admin', 'editor', 'reporter'],
  },
  {
    path: '/admin/articles',
    label: 'আর্টিকেলসমূহ',
    icon: Newspaper,
    roles: ['admin', 'editor', 'reporter'],
  },
  {
    path: '/admin/users',
    label: 'ব্যবহারকারীগণ',
    icon: Users,
    roles: ['admin', 'editor'],
  },
  {
    path: '/admin/comments',
    label: 'মন্তব্যসমূহ',
    icon: MessagesSquare,
    roles: ['admin', 'editor'],
  },
  {
    path: '/admin/media',
    label: 'মিডিয়া',
    icon: ImageIcon,
    roles: ['admin', 'editor', 'reporter'],
  },
  {
    path: '/admin/ads',
    label: 'বিজ্ঞাপন',
    icon: Megaphone,
    roles: ['admin'],
  },
  {
    path: '/admin/notifications',
    label: 'নোটিফিকেশন',
    icon: BellRing,
    roles: ['admin', 'editor'],
  },
  {
    path: '/admin/settings',
    label: 'সেটিংস',
    icon: Settings,
    roles: ['admin'],
  },
  {
    path: '/',
    label: 'ওয়েবসাইটে ফিরে যান',
    icon: Home,
  },
];
