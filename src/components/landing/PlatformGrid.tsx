'use client';

import { usePublicPlatforms } from '@/hooks/usePlatforms';
import PlatformCard from './PlatformCard';

export default function PlatformGrid() {
  const { platforms, loading, error } = usePublicPlatforms();

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <span className="material-symbols-outlined text-5xl text-on-primary-container mb-4">
          warning
        </span>
        <p className="font-display text-lg font-semibold text-on-surface-variant">
          Não foi possível carregar as plataformas.
        </p>
        <p className="font-sans text-sm text-on-primary-container mt-1">
          Verifique sua conexão e recarregue a página.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-56 rounded-xl border border-outline-variant bg-surface-container animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (platforms.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <span className="material-symbols-outlined text-5xl text-secondary mb-4">
          rocket_launch
        </span>
        <p className="font-display text-lg font-semibold text-on-surface-variant">
          Plataformas em breve...
        </p>
        <p className="font-sans text-sm text-on-primary-container mt-1">
          As plataformas serão exibidas aqui quando configuradas.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {platforms.map((platform) => (
        <PlatformCard key={platform.id} platform={platform} />
      ))}
    </div>
  );
}
