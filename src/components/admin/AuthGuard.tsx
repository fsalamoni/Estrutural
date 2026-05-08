'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading, isAdminUser, configError } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !configError && (!user || !isAdminUser)) {
      router.replace('/admin/login');
    }
  }, [user, loading, isAdminUser, router, configError]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-surface-container-lowest">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-outline-variant border-t-secondary" />
      </div>
    );
  }

  if (configError) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-surface-container-lowest px-4 text-center">
        <h2 className="font-display text-xl font-bold text-on-surface mb-3">Admin indisponivel</h2>
        <p className="max-w-md text-sm text-on-surface-variant mb-6">{configError}</p>
        <Link
          href="/"
          className="rounded-xl border border-outline-variant px-5 py-3 text-xs font-display text-on-surface-variant hover:text-on-surface transition-colors uppercase tracking-widest"
        >
          Voltar ao portal
        </Link>
      </div>
    );
  }

  if (!user || !isAdminUser) return null;

  return <>{children}</>;
}
