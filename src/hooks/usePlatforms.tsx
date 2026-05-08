'use client';

import { useEffect, useState } from 'react';
import { Platform } from '@/lib/types';
import { subscribePublicPlatforms, subscribeAllPlatforms } from '@/lib/firebase/firestore';

export function usePublicPlatforms() {
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = subscribePublicPlatforms(
      (data) => {
        setPlatforms(data);
        setLoading(false);
        setError(null);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );
    return unsubscribe;
  }, []);

  return { platforms, loading, error };
}

export function useAllPlatforms() {
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeAllPlatforms(
      (data) => {
        setPlatforms(data);
        setLoading(false);
        setError(null);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );
    return unsubscribe;
  }, []);

  return { platforms, loading, error };
}
