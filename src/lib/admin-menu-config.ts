

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
  BrainCircuit,
  Tags,
  LayoutGrid,
  PlusCircle,
  FileSignature
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export type AdminMenuItem = {
  path?: string;
  label: string;
  icon: LucideIcon;
  roles?: ('admin' | 'editor' | 'reporter' | 'user')[];
  children?: Omit<AdminMenuItem, 'icon' | 'children'>[];
  exactMatch?: boolean;
};

export const adminMenuConfig: AdminMenuItem[] = [
  {
    path: '/admin',
    label: 'ড্যাশবোর্ড',
    icon: BarChart2,
    roles: ['admin', 'editor', 'reporter'],
    exactMatch: true,
  },
  {
    label: 'আর্টিকেলস',
    icon: Newspaper,
    roles: ['admin', 'editor', 'reporter'],
    children: [
        { path: '/admin/articles', label: 'সকল আর্টিকেল' },
        { path: '/admin/articles/create', label: 'নতুন যোগ করুন' },
        { path: '/admin/articles/categories', label: 'ক্যাটাগরি' },
        { path: '/admin/articles/tags', label: 'ট্যাগ' },
    ],
  },
   {
    label: 'AI টুলস',
    icon: BrainCircuit,
    roles: ['admin', 'editor', 'reporter'],
    children: [
        { path: '/admin/ai-writer', label: 'কনটেন্ট রাইটার' },
    ],
  },
   {
    label: 'পেজসমূহ',
    icon: FileText,
    roles: ['admin', 'editor'],
    children: [
        { path: '/admin/pages', label: 'সকল পেজ' },
        { path: '/admin/pages/create', label: 'নতুন যোগ করুন' },
    ],
  },
  {
    label: 'ব্যবহারকারীগণ',
    icon: Users,
    roles: ['admin', 'editor'],
     children: [
        { path: '/admin/users', label: 'সকল ব্যবহারকারী' },
    ],
  },
  {
    path: '/admin/comments',
    label: 'মন্তব্যসমূহ',
    icon: MessagesSquare,
    roles: ['admin', 'editor'],
  },
  {
    label: 'এনগেজমেন্ট',
    icon: BarChartHorizontal,
    roles: ['admin', 'editor', 'reporter'],
    children: [
        { path: '/admin/polls', label: 'জরিপ' },
        { path: '/admin/subscribers', label: 'সাবস্ক্রাইবার' },
        { path: '/admin/newsletter', label: 'নিউজলেটার' },
        { path: '/admin/notifications', label: 'নোটিফিকেশন' },
    ]
  },
  {
    label: 'মিডিয়া',
    icon: ImageIcon,
    roles: ['admin', 'editor', 'reporter'],
     children: [
        { path: '/admin/media', label: 'লাইব্রেরি' },
        { path: '/admin/media/upload', label: 'নতুন আপলোড' },
    ],
  },
  {
    label: 'ইম্পোর্ট ও সিঙ্ক',
    icon: UploadCloud,
    roles: ['admin', 'editor'],
     children: [
        { path: '/admin/import', label: 'WordPress ইম্পোর্ট' },
        { path: '/admin/rss', label: 'RSS ফিড' },
    ],
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
