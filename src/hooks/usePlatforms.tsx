'use client';

import { useEffect, useState } from 'react';
import { Platform } from '@/lib/types';
import { subscribePublicPlatforms, subscribeAllPlatforms } from '@/lib/firebase/firestore';
import { PUBLIC_PLATFORM_FALLBACK } from '@/lib/publicPlatformFallback';

const PUBLIC_PLATFORM_FALLBACK_WARNING = 'Exibindo catalogo de contingencia enquanto a sincronizacao ao vivo e restabelecida.';

export function usePublicPlatforms() {
  const [platforms, setPlatforms] = useState<Platform[]>(PUBLIC_PLATFORM_FALLBACK);
  const [loading, setLoading] = useState(PUBLIC_PLATFORM_FALLBACK.length === 0);
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(
    PUBLIC_PLATFORM_FALLBACK.length > 0 ? PUBLIC_PLATFORM_FALLBACK_WARNING : null
  );

  useEffect(() => {
    const unsubscribe = subscribePublicPlatforms(
      (data) => {
        setPlatforms(data);
        setLoading(false);
        setError(null);
        setWarning(null);
      },
      (err) => {
        if (PUBLIC_PLATFORM_FALLBACK.length > 0) {
          setPlatforms((currentPlatforms) => currentPlatforms.length > 0 ? currentPlatforms : PUBLIC_PLATFORM_FALLBACK);
          setError(null);
          setWarning(PUBLIC_PLATFORM_FALLBACK_WARNING);
          setLoading(false);
          return;
        }

        setError(err.message);
        setLoading(false);
      }
    );
    return unsubscribe;
  }, []);

  return { platforms, loading, error, warning };
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
