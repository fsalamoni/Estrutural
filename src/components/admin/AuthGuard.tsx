'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading, isAdminUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || !isAdminUser)) {
      router.replace('/admin/login');
    }
  }, [user, loading, isAdminUser, router]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-dark-bg">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-dark-border
                        border-t-accent-purple" />
      </div>
    );
  }

  if (!user || !isAdminUser) return null;

  return <>{children}</>;
}
