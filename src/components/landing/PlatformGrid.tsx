'use client';

import { usePublicPlatforms } from '@/hooks/usePlatforms';
import PlatformCard from './PlatformCard';

export default function PlatformGrid() {
  const { platforms, loading, error } = usePublicPlatforms();

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="mb-4 text-5xl">⚠️</div>
        <p className="text-lg font-medium text-gray-400">Não foi possível carregar as plataformas.</p>
        <p className="mt-1 text-sm text-gray-600">Verifique sua conexão e recarregue a página.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-44 rounded-2xl border border-dark-border bg-dark-card animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (platforms.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="mb-4 text-5xl">🚀</div>
        <p className="text-lg font-medium text-gray-400">Plataformas em breve...</p>
        <p className="mt-1 text-sm text-gray-600">As plataformas serão exibidas aqui.</p>
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
