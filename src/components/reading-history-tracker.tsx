

'use client';

import { useEffect, useState } from 'react';
import type { User } from '@/lib/types';
import { trackReadingHistoryAction } from '@/app/actions';

export default function ReadingHistoryTracker({ articleId }: { articleId: string }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('bartaNowUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    if (user && articleId) {
      // Don't await this, let it run in the background
      trackReadingHistoryAction(user.id, articleId);
    }
  }, [user, articleId]);

  return null; // This component doesn't render anything
}
