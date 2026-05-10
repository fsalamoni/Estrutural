'use client';

import { usePublicPlatforms } from '@/hooks/usePlatforms';
import { comparePlatformCategories, getPlatformCategory, Platform } from '@/lib/types';
import PlatformCard from './PlatformCard';

export default function PlatformGrid() {
  const { platforms, loading, error, warning } = usePublicPlatforms();

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

  const groupedPlatforms = Array.from(
    platforms.reduce((sections, platform) => {
      const category = getPlatformCategory(platform);
      const categoryPlatforms = sections.get(category) ?? [];
      categoryPlatforms.push(platform);
      sections.set(category, categoryPlatforms);
      return sections;
    }, new Map<string, Platform[]>()).entries()
  ).sort(([leftCategory], [rightCategory]) => comparePlatformCategories(leftCategory, rightCategory));

  return (
    <div className="space-y-12">
      {warning && (
        <div className="rounded-xl border border-secondary/20 bg-secondary-container/10 px-4 py-3 text-sm text-on-surface-variant">
          {warning}
        </div>
      )}

      {groupedPlatforms.map(([category, sectionPlatforms]) => (
        <section key={category}>
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <p className="font-label text-[11px] uppercase tracking-[0.18em] text-on-primary-container">
                Tipo de Plataforma
              </p>
              <h2 className="font-display text-2xl font-bold text-white mt-1">{category}</h2>
            </div>
            <span className="rounded-full border border-outline-variant bg-surface-container/70 px-3 py-1 text-[11px] font-label uppercase tracking-widest text-on-surface-variant">
              {sectionPlatforms.length} {sectionPlatforms.length === 1 ? 'plataforma' : 'plataformas'}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {sectionPlatforms.map((platform) => (
              <PlatformCard key={platform.id} platform={platform} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
