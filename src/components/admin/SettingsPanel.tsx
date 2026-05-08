'use client';

import { Category, Platform, getCategoryColorClass } from '@/lib/types';

interface Props {
  platforms: Platform[];
  categories: Category[];
}

export default function SettingsPanel({ platforms, categories }: Props) {
  const platformsWithoutCategory = platforms.filter((p) => !p.categoryId);
  const orphanCategoryIds = platforms
    .map((p) => p.categoryId)
    .filter(
      (id): id is string =>
        !!id && !categories.some((c) => c.id === id)
    );
  const uniqueOrphanIds = Array.from(new Set(orphanCategoryIds));

  const distribution = categories
    .map((c) => ({
      category: c,
      count: platforms.filter((p) => p.categoryId === c.id).length,
    }))
    .sort((a, b) => b.count - a.count);

  return (
    <div className="space-y-6">
      <section className="glass-panel rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-2">
          <span className="w-1 h-6 bg-secondary rounded-full" />
          <h3 className="font-display text-base font-bold text-on-surface uppercase tracking-wide">
            Saúde do catálogo
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-4">
            <p className="text-[10px] font-label uppercase tracking-widest text-on-primary-container mb-1">
              Plataformas
            </p>
            <p className="font-display text-3xl font-black text-on-surface">{platforms.length}</p>
          </div>
          <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-4">
            <p className="text-[10px] font-label uppercase tracking-widest text-on-primary-container mb-1">
              Categorias
            </p>
            <p className="font-display text-3xl font-black text-on-surface">{categories.length}</p>
          </div>
          <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-4">
            <p className="text-[10px] font-label uppercase tracking-widest text-on-primary-container mb-1">
              Sem categoria
            </p>
            <p
              className={`font-display text-3xl font-black ${
                platformsWithoutCategory.length > 0 ? 'text-tertiary' : 'text-on-surface'
              }`}
            >
              {platformsWithoutCategory.length}
            </p>
          </div>
        </div>

        {(platformsWithoutCategory.length > 0 || uniqueOrphanIds.length > 0) && (
          <div className="rounded-lg border border-tertiary/40 bg-tertiary/10 p-4 space-y-2">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-tertiary text-sm">warning</span>
              <span className="font-label text-xs uppercase tracking-widest text-tertiary">
                Atenção
              </span>
            </div>
            {platformsWithoutCategory.length > 0 && (
              <p className="text-sm text-on-surface-variant">
                <strong className="text-on-surface">{platformsWithoutCategory.length}</strong>{' '}
                plataforma(s) ainda não foram associadas a nenhuma categoria.
              </p>
            )}
            {uniqueOrphanIds.length > 0 && (
              <p className="text-sm text-on-surface-variant">
                <strong className="text-on-surface">{uniqueOrphanIds.length}</strong>{' '}
                plataforma(s) referenciam categorias que não existem mais.
              </p>
            )}
          </div>
        )}
      </section>

      <section className="glass-panel rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-2">
          <span className="w-1 h-6 bg-tertiary rounded-full" />
          <h3 className="font-display text-base font-bold text-on-surface uppercase tracking-wide">
            Distribuição por categoria
          </h3>
        </div>

        {categories.length === 0 ? (
          <p className="text-sm text-on-surface-variant py-8 text-center">
            Nenhuma categoria criada ainda. Acesse a aba <strong>Categorias</strong> para começar.
          </p>
        ) : (
          <div className="space-y-3">
            {distribution.map(({ category, count }) => {
              const pct = platforms.length === 0 ? 0 : (count / platforms.length) * 100;
              return (
                <div key={category.id} className="space-y-1.5">
                  <div className="flex items-center justify-between gap-3">
                    <div
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-label uppercase tracking-wider ${getCategoryColorClass(category.color)}`}
                    >
                      <span className="material-symbols-outlined text-sm">
                        {category.icon || 'category'}
                      </span>
                      {category.name}
                    </div>
                    <span className="font-display text-sm font-bold text-on-surface">
                      {count} {count === 1 ? 'plataforma' : 'plataformas'}
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-surface-container rounded-full overflow-hidden">
                    <div
                      className="h-full bg-secondary rounded-full transition-all"
                      style={{ width: `${Math.max(2, pct)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section className="glass-panel rounded-xl p-6 space-y-3">
        <div className="flex items-center gap-2">
          <span className="w-1 h-6 bg-secondary rounded-full" />
          <h3 className="font-display text-base font-bold text-on-surface uppercase tracking-wide">
            Como funciona
          </h3>
        </div>
        <ul className="space-y-2 text-sm text-on-surface-variant font-sans">
          <li className="flex gap-2">
            <span className="material-symbols-outlined text-secondary text-base mt-0.5">
              check_circle
            </span>
            Categorias agrupam plataformas no portal e no painel admin.
          </li>
          <li className="flex gap-2">
            <span className="material-symbols-outlined text-secondary text-base mt-0.5">
              check_circle
            </span>
            Toda plataforma pode ter <strong>uma</strong> categoria; é opcional.
          </li>
          <li className="flex gap-2">
            <span className="material-symbols-outlined text-secondary text-base mt-0.5">
              check_circle
            </span>
            Excluir uma categoria em uso é bloqueado — reatribua as plataformas primeiro.
          </li>
          <li className="flex gap-2">
            <span className="material-symbols-outlined text-secondary text-base mt-0.5">
              check_circle
            </span>
            A ordem das categorias define a ordem dos grupos exibidos no portal.
          </li>
        </ul>
      </section>
    </div>
  );
}
