

import type { User, Role, Permission } from './types';

// Define all available permissions in the system
const allPermissions: Record<Permission, string> = {
    'create_article': 'আর্টিকেল তৈরি করুন',
    'edit_article': 'আর্টিকেল এডিট করুন',
    'delete_article': 'আর্টিকেল ডিলিট করুন',
    'publish_article': 'আর্টিকেল প্রকাশ করুন',
    
    'create_page': 'পেজ তৈরি করুন',
    'edit_page': 'পেজ এডিট করুন',
    'delete_page': 'পেজ ডিলিট করুন',

    'create_poll': 'জরিপ তৈরি করুন',
    'edit_poll': 'জরিপ এডিট করুন',
    'delete_poll': 'জরিপ ডিলিট করুন',

    'manage_comments': 'মন্তব্য পরিচালনা করুন',
    'approve_comment': 'মন্তব্য অনুমোদন করুন',
    'delete_comment': 'মন্তব্য ডিলিট করুন',

    'view_users': 'ব্যবহারকারী দেখুন',
    'create_user': 'ব্যবহারকারী তৈরি করুন',
    'edit_user_profile': 'ব্যবহারকারী প্রোফাইল এডিট করুন',
    'delete_user': 'ব্যবহারকারী ডিলিট করুন',
    'change_user_role': 'ব্যবহারকারী রোল পরিবর্তন করুন',
    'block_user': 'ব্যবহারকারী ব্লক করুন',

    'manage_media': 'মিডিয়া পরিচালনা করুন',
    'upload_media': 'মিডিয়া আপলোড করুন',
    'delete_media': 'মিডিয়া ডিলিট করুন',

    'manage_settings': 'সেটিংস পরিচালনা করুন',
    'manage_ads': 'বিজ্ঞাপন পরিচালনা করুন',
    'send_notification': 'নোটিফিকেশন পাঠান',
    'manage_newsletter': 'নিউজলেটার পরিচালনা করুন',
    'manage_rss': 'RSS ফিড পরিচালনা করুন',
    'create_rss': 'RSS ফিড তৈরি করুন',
    'edit_rss': 'RSS ফিড এডিট করুন',
    'delete_rss': 'RSS ফিড ডিলিট করুন',
    
    'login_as_user': 'অন্য ব্যবহারকারী হিসেবে লগইন করুন',
};


// Define roles and assign permissions
export const roles: Record<User['role'], Role> = {
  admin: {
    name: 'Admin',
    permissions: Object.keys(allPermissions) as Permission[], // Admin gets all permissions
  },
  editor: {
    name: 'Editor',
    permissions: [
      'create_article',
      'edit_article',
      'delete_article',
      'publish_article',
      'create_page',
      'edit_page',
      'delete_page',
      'create_poll',
      'edit_poll',
      'delete_poll',
      'manage_comments',
      'approve_comment',
      'delete_comment',
      'view_users',
      'edit_user_profile',
      'upload_media',
      'send_notification',
      'manage_newsletter',
      'manage_rss',
      'create_rss',
      'edit_rss',
      'delete_rss',
    ],
  },
  reporter: {
    name: 'Reporter',
    permissions: [
      'create_article',
      'edit_article', // Can be changed to 'edit_own_article' with more logic
      'upload_media',
    ],
  },
  user: {
    name: 'User',
    permissions: [],
  },
};

/**
 * Checks if a user with a given role has a specific permission.
 * @param role The role of the user.
 * @param permission The permission to check for.
 * @returns True if the user has the permission, false otherwise.
 */
export function hasPermission(role: User['role'], permission: Permission): boolean {
  if (!roles[role]) {
    return false;
  }
  return roles[role].permissions.includes(permission);
}
