'use client';

import { useState } from 'react';
import { Platform } from '@/lib/types';
import { createPlatform, createCategory } from '@/lib/firebase/firestore';
import { PLATFORM_CATALOG, CATEGORY_CATALOG } from '@/lib/seed-data';
import { useCategories } from '@/hooks/usePlatforms';
import { toast } from '@/components/ui/Toast';

interface Props {
  existing: Platform[];
}

type Status = 'idle' | 'preview' | 'importing' | 'done';

export default function SeedCatalogButton({ existing }: Props) {
  const { categories } = useCategories();
  const [status, setStatus] = useState<Status>('idle');
  const [progress, setProgress] = useState(0);

  const existingNames = new Set(existing.map((p) => p.name.trim().toLowerCase()));
  const missingPlatforms = PLATFORM_CATALOG.filter(
    (p) => !existingNames.has(p.name.trim().toLowerCase())
  );

  const existingCategoryNames = new Set(
    categories.map((c) => c.name.trim().toLowerCase())
  );
  const missingCategories = CATEGORY_CATALOG.filter(
    (c) => !existingCategoryNames.has(c.name.trim().toLowerCase())
  );

  const totalToImport = missingPlatforms.length + missingCategories.length;

  if (totalToImport === 0 && status !== 'done') {
    return null;
  }

  async function handleImport() {
    setStatus('importing');
    setProgress(0);
    let imported = 0;
    let failed = 0;

    // Build slug -> id map: existing categories first, then newly created.
    const slugToId = new Map<string, string>();
    for (const c of categories) {
      const matchingSeed = CATEGORY_CATALOG.find(
        (s) => s.name.trim().toLowerCase() === c.name.trim().toLowerCase()
      );
      if (matchingSeed) slugToId.set(matchingSeed.slug, c.id);
    }

    // Create missing categories first.
    for (const c of missingCategories) {
      try {
        const { slug, ...rest } = c;
        const id = await createCategory(rest);
        slugToId.set(slug, id);
        imported++;
      } catch {
        failed++;
      }
      setProgress(imported + failed);
    }

    // Create missing platforms with resolved categoryId.
    for (const p of missingPlatforms) {
      try {
        const { categorySlug, ...rest } = p;
        const categoryId = categorySlug ? slugToId.get(categorySlug) ?? '' : '';
        await createPlatform({ ...rest, categoryId });
        imported++;
      } catch {
        failed++;
      }
      setProgress(imported + failed);
    }

    setStatus('done');
    if (failed === 0) {
      toast(`${imported} item(ns) importado(s) com sucesso.`);
    } else {
      toast(`${imported} importado(s), ${failed} falharam. Verifique as regras do Firestore.`, 'error');
    }
  }

  return (
    <>
      <button
        onClick={() => setStatus('preview')}
        className="flex items-center gap-2 rounded-xl border border-tertiary/40 bg-tertiary/10 px-5 py-3 font-display text-sm font-semibold text-tertiary transition-all hover:bg-tertiary/20 hover:shadow-[0_0_15px_rgba(255,193,7,0.25)] whitespace-nowrap"
      >
        <span className="material-symbols-outlined">inventory_2</span>
        Importar Catálogo ({totalToImport})
      </button>

      {status === 'preview' && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="seed-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) setStatus('idle');
          }}
        >
          <div className="glass-panel w-full max-w-2xl rounded-xl border border-outline-variant shadow-[0_0_60px_rgba(0,0,0,0.7)] animate-slide-up overflow-hidden">
            <div className="flex items-center justify-between border-b border-outline-variant px-6 py-5">
              <div className="flex items-center gap-2">
                <span className="w-1 h-6 bg-tertiary rounded-full" />
                <h2
                  id="seed-title"
                  className="font-display text-lg font-bold text-on-surface uppercase tracking-wide"
                >
                  Importar Catálogo
                </h2>
              </div>
              <button
                onClick={() => setStatus('idle')}
                className="text-on-primary-container hover:text-on-surface transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              {missingCategories.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-label uppercase tracking-widest text-tertiary">
                    Categorias ({missingCategories.length})
                  </p>
                  <ul className="space-y-2">
                    {missingCategories.map((c) => (
                      <li
                        key={c.slug}
                        className="flex items-start gap-3 rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-3"
                      >
                        <span className="material-symbols-outlined text-lg mt-0.5 text-tertiary">
                          {c.icon}
                        </span>
                        <div className="flex-1 min-w-0">
                          <span className="font-display text-sm font-semibold text-on-surface">
                            {c.name}
                          </span>
                          <p className="text-xs text-on-surface-variant mt-0.5 line-clamp-2">
                            {c.description}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {missingPlatforms.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-label uppercase tracking-widest text-secondary">
                    Plataformas ({missingPlatforms.length})
                  </p>
                  <ul className="space-y-2">
                    {missingPlatforms.map((p) => (
                      <li
                        key={p.name}
                        className="flex items-start gap-3 rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-3"
                      >
                        <span
                          className={`material-symbols-outlined text-lg mt-0.5 ${
                            p.visible ? 'text-secondary' : 'text-on-primary-container'
                          }`}
                        >
                          {p.visible ? 'visibility' : 'visibility_off'}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-display text-sm font-semibold text-on-surface">
                              {p.name}
                            </span>
                            {!p.visible && (
                              <span className="text-[10px] font-label uppercase tracking-widest text-on-primary-container border border-outline-variant rounded px-1.5 py-0.5">
                                oculto
                              </span>
                            )}
                            {p.categorySlug && (
                              <span className="text-[10px] font-label uppercase tracking-widest text-tertiary border border-tertiary/40 rounded px-1.5 py-0.5">
                                {p.categorySlug}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-on-surface-variant mt-0.5 line-clamp-2">
                            {p.description}
                          </p>
                          {p.accessUrl && (
                            <p className="text-[11px] text-on-primary-container mt-1 font-mono truncate">
                              {p.accessUrl}
                            </p>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="flex gap-3 border-t border-outline-variant px-6 py-4">
              <button
                onClick={() => setStatus('idle')}
                className="flex-1 rounded-xl border border-outline-variant py-3 text-xs font-display font-medium text-on-surface-variant hover:text-on-surface transition-all uppercase tracking-widest"
              >
                Cancelar
              </button>
              <button
                onClick={handleImport}
                className="flex-1 rounded-xl bg-tertiary text-on-tertiary py-3 text-xs font-display font-semibold hover:shadow-[0_0_15px_rgba(255,193,7,0.4)] transition-all uppercase tracking-widest"
              >
                Importar {totalToImport}
              </button>
            </div>
          </div>
        </div>
      )}

      {status === 'importing' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="glass-panel rounded-xl border border-outline-variant p-8 max-w-sm w-full text-center space-y-4">
            <div className="h-10 w-10 mx-auto animate-spin rounded-full border-2 border-outline-variant border-t-tertiary" />
            <p className="font-display text-sm text-on-surface">
              Importando catálogo...
            </p>
            <p className="text-xs text-on-surface-variant font-mono">
              {progress} / {totalToImport}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
