'use client';

import { useEffect, useState } from 'react';
import { Platform } from '@/lib/types';
import { subscribePublicPlatforms, subscribeAllPlatforms } from '@/lib/firebase/firestore';

export function usePublicPlatforms() {
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribePublicPlatforms((data) => {
      setPlatforms(data);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  return { platforms, loading };
}

export function useAllPlatforms() {
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeAllPlatforms((data) => {
      setPlatforms(data);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  return { platforms, loading };
}
