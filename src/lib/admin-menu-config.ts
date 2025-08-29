

import {
  LayoutGrid,
  Newspaper,
  Users,
  Settings,
  ShieldCheck,
  ImageIcon,
  MessagesSquare,
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
  FolderOpen,
  Image,
  Edit,
  FileUp,
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
    label: 'Posts',
    icon: Newspaper,
    roles: ['admin', 'editor', 'reporter'],
    path: '#posts',
    children: [
        { path: '/admin/articles', label: 'All Posts' },
        { path: '/admin/articles/create', label: 'Add New' },
        { path: '/admin/pages', label: 'Pages' },
        { path: '/admin/articles/categories', label: 'Categories' },
    ],
  },
   {
    path: '/admin/ai-writer',
    label: 'Bulk Post',
    icon: BrainCircuit,
    roles: ['admin', 'editor', 'reporter'],
  },
  {
    path: '#staff-manages',
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
    children: [
        { path: '/admin/roles', label: 'All Roles' },
    ]
  },
   {
    label: 'Media / Gallery',
    icon: ImageIcon,
    roles: ['admin', 'editor', 'reporter'],
    path: '#media-gallery',
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
    path: '#seo-report',
    label: 'SEO Report',
    icon: LineChart,
    roles: ['admin'],
  },
   {
    path: '#contact-messages',
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
    label: 'Tools',
    icon: Settings,
    roles: ['admin'],
    path: '#tools',
    children: [
        { path: '/admin/import', label: 'Import' },
    ],
  },
  {
    path: '/admin/settings',
    label: 'Settings',
    icon: Settings,
    roles: ['admin'],
  },
];
