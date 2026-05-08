'use client';

import { useMemo } from 'react';
import { usePublicPlatforms, useCategories } from '@/hooks/usePlatforms';
import { Category, Platform, getCategoryColorClass } from '@/lib/types';
import PlatformCard from './PlatformCard';

export default function PlatformGrid() {
  const { platforms, loading, error } = usePublicPlatforms();
  const { categories } = useCategories();

  const categoryById = useMemo(() => {
    const map = new Map<string, Category>();
    categories.forEach((c) => map.set(c.id, c));
    return map;
  }, [categories]);

  const groups = useMemo(() => {
    if (categories.length === 0) {
      return [{ category: null as Category | null, items: platforms }];
    }
    const result: { category: Category | null; items: Platform[] }[] = categories
      .map((c) => ({
        category: c,
        items: platforms.filter((p) => p.categoryId === c.id),
      }))
      .filter((g) => g.items.length > 0);

    const uncategorized = platforms.filter(
      (p) => !p.categoryId || !categoryById.has(p.categoryId)
    );
    if (uncategorized.length > 0) {
      result.push({ category: null, items: uncategorized });
    }
    return result;
  }, [platforms, categories, categoryById]);

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

  if (groups.length <= 1) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {platforms.map((platform) => (
          <PlatformCard
            key={platform.id}
            platform={platform}
            category={platform.categoryId ? categoryById.get(platform.categoryId) : undefined}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {groups.map(({ category, items }) => (
        <section key={category?.id ?? 'uncategorized'} className="space-y-5">
          <header className="flex items-center gap-3">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-label uppercase tracking-wider ${
                category
                  ? getCategoryColorClass(category.color)
                  : 'border-outline-variant text-on-surface-variant'
              }`}
            >
              <span className="material-symbols-outlined text-sm">
                {category?.icon || 'apps'}
              </span>
              {category?.name ?? 'Outras plataformas'}
            </span>
            <span className="text-xs text-on-primary-container font-label uppercase tracking-widest">
              {items.length} {items.length === 1 ? 'plataforma' : 'plataformas'}
            </span>
            {category?.description && (
              <span className="text-xs text-on-surface-variant font-sans hidden md:inline-block">
                · {category.description}
              </span>
            )}
          </header>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((platform) => (
              <PlatformCard
                key={platform.id}
                platform={platform}
                category={category ?? undefined}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
