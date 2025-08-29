

import {
  LayoutGrid,
  Newspaper,
  Users,
  Settings,
  ShieldCheck,
  ImageIcon,
  MessagesSquare,
  BellRing,
  FileText,
  BarChartHorizontal,
  Rss,
  Palette,
  UploadCloud,
  BrainCircuit,
  Tags,
  PlusCircle,
  FileSignature,
  LineChart,
  Link as LinkIcon,
  MapPin,
  HomeIcon,
  Megaphone,
  BarChart,
  Contact,
  FolderOpen
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
    label: 'Dashboard',
    icon: LayoutGrid,
    roles: ['admin', 'editor', 'reporter'],
    exactMatch: true,
  },
  {
    label: 'Category',
    icon: FolderOpen,
    roles: ['admin', 'editor', 'reporter'],
    children: [
        { path: '/admin/articles/categories', label: 'All Categories' },
        { path: '/admin/articles/categories/create', label: 'Add New' },
    ],
  },
  {
    label: 'News Manages',
    icon: Newspaper,
    roles: ['admin', 'editor', 'reporter'],
    children: [
        { path: '/admin/articles', label: 'All News' },
        { path: '/admin/articles/create', label: 'Add New' },
    ],
  },
  {
    label: 'Blog Manages',
    icon: FileSignature,
    roles: ['admin', 'editor'],
     children: [
        { path: '/admin/pages', label: 'All Pages' },
        { path: '/admin/pages/create', label: 'Add New' },
    ],
  },
   {
    path: '/admin/ai-writer',
    label: 'Bulk Post',
    icon: BrainCircuit,
    roles: ['admin', 'editor', 'reporter'],
  },
  {
    label: 'Staff Manages',
    icon: Users,
    roles: ['admin', 'editor'],
     children: [
        { path: '/admin/users', label: 'All Staff' },
    ],
  },
   {
    path: '#roles-permissions',
    label: 'Roles & Permissions',
    icon: ShieldCheck,
    roles: ['admin'],
  },
   {
    label: 'Media / Gallery',
    icon: ImageIcon,
    roles: ['admin', 'editor', 'reporter'],
     children: [
        { path: '/admin/media', label: 'Library' },
        { path: '/admin/media/upload', label: 'Add New' },
    ],
  },
  {
    path: '/admin/comments',
    label: 'Comments',
    icon: MessagesSquare,
    roles: ['admin', 'editor'],
  },
   {
    path: '/admin/articles/tags',
    label: 'Tag',
    icon: Tags,
    roles: ['admin', 'editor'],
  },
  {
    path: '#seo-report',
    label: 'SEO Report',
    icon: LineChart,
    roles: ['admin'],
  },
   {
    path: '/admin/subscribers',
    label: 'Contact Messages',
    icon: Contact,
    roles: ['admin', 'editor'],
  },
   {
    path: '/admin/appearance',
    label: 'Home Page Manages',
    icon: HomeIcon,
    roles: ['admin'],
  },
  {
    path: '/admin/ads',
    label: 'Ad Spaces',
    icon: Megaphone,
    roles: ['admin'],
  },
   {
    path: '#report',
    label: 'Report',
    icon: BarChart,
    roles: ['admin'],
  },
   {
    path: '#social',
    label: 'Social',
    icon: LinkIcon,
    roles: ['admin'],
  },
   {
    path: '#location',
    label: 'Location',
    icon: MapPin,
    roles: ['admin'],
  },
  {
    path: '/admin/settings',
    label: 'Settings',
    icon: Settings,
    roles: ['admin'],
  },
];
