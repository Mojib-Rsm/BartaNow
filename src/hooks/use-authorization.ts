
'use client';

import { useState, useEffect, useCallback } from 'react';
import type { User, Permission } from '@/lib/types';
import { roles } from '@/lib/roles-and-permissions';

/**
 * Custom hook to manage user authorization based on roles and permissions.
 */
export const useAuthorization = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Function to load user from localStorage
    const loadUser = () => {
      const storedUser = localStorage.getItem('bartaNowUser');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        setUser(null);
      }
    };

    // Initial load
    loadUser();

    // Listen for changes in localStorage to sync across tabs/components
    window.addEventListener('storage', loadUser);

    // Cleanup listener on component unmount
    return () => {
      window.removeEventListener('storage', loadUser);
    };
  }, []);

  /**
   * Checks if the current user has a specific permission.
   * @param permission The permission to check for.
   * @returns True if the user has the permission, false otherwise.
   */
  const hasPermission = useCallback((permission: Permission): boolean => {
    if (!user || !user.role) {
      return false;
    }

    const userRole = roles[user.role];
    if (!userRole) {
      return false;
    }

    return userRole.permissions.includes(permission);
  }, [user]);

  return {
    user,
    hasPermission,
    currentRole: user?.role,
  };
};
