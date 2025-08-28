

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
  FileText,
  BarChartHorizontal,
  Send,
  Rss,
  Palette,
  UploadCloud,
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
    path: '/admin/pages',
    label: 'পেজসমূহ',
    icon: FileText,
    roles: ['admin', 'editor'],
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
    path: '/admin/polls',
    label: 'জরিপ',
    icon: BarChartHorizontal,
    roles: ['admin', 'editor', 'reporter'],
  },
  {
    path: '/admin/subscribers',
    label: 'সাবস্ক্রাইবার',
    icon: Users,
    roles: ['admin', 'editor'],
  },
  {
    path: '/admin/newsletter',
    label: 'নিউজলেটার',
    icon: Send,
    roles: ['admin', 'editor'],
  },
  {
    path: '/admin/media',
    label: 'মিডিয়া',
    icon: ImageIcon,
    roles: ['admin', 'editor', 'reporter'],
  },
  {
    path: '/admin/import',
    label: 'WordPress ইম্পোর্ট',
    icon: UploadCloud,
    roles: ['admin'],
  },
  {
    path: '/admin/rss',
    label: 'RSS ফিড',
    icon: Rss,
    roles: ['admin', 'editor'],
  },
  {
    path: '/admin/appearance',
    label: 'Appearance',
    icon: Palette,
    roles: ['admin'],
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
