'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import {
  Platform,
  Category,
  AUTH_METHOD_LABELS,
  AUTH_METHOD_COLORS,
  getCategoryColorClass,
} from '@/lib/types';
import { deletePlatform, toggleVisibility, updateOrder } from '@/lib/firebase/firestore';
import { toast } from '@/components/ui/Toast';
import PlatformForm from './PlatformForm';

interface Props {
  platforms: Platform[];
  categories: Category[];
}

export default function PlatformTable({ platforms, categories }: Props) {
  const [editing, setEditing] = useState<Platform | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Platform | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [movingId, setMovingId] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const categoryById = useMemo(() => {
    const map = new Map<string, Category>();
    categories.forEach((c) => map.set(c.id, c));
    return map;
  }, [categories]);

  const visiblePlatforms = useMemo(() => {
    if (filterCategory === 'all') return platforms;
    if (filterCategory === 'none') return platforms.filter((p) => !p.categoryId);
    return platforms.filter((p) => p.categoryId === filterCategory);
  }, [platforms, filterCategory]);

  async function handleDelete(platform: Platform) {
    setDeleting(true);
    try {
      await deletePlatform(platform.id, platform.iconUrl);
      setConfirmDelete(null);
      toast('Plataforma excluída com sucesso');
    } catch {
      toast('Erro ao excluir plataforma. Tente novamente.', 'error');
    } finally {
      setDeleting(false);
    }
  }

  async function handleToggle(id: string, currentVisible: boolean) {
    try {
      await toggleVisibility(id, !currentVisible);
      toast(!currentVisible ? 'Plataforma exibida no portal' : 'Plataforma ocultada');
    } catch {
      toast('Erro ao alterar visibilidade.', 'error');
    }
  }

  async function handleMove(index: number, direction: 'up' | 'down') {
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= visiblePlatforms.length) return;
    const current = visiblePlatforms[index];
    const swapWith = visiblePlatforms[swapIndex];
    setMovingId(current.id);
    try {
      await Promise.all([
        updateOrder(current.id, swapWith.order),
        updateOrder(swapWith.id, current.order),
      ]);
    } catch {
      toast('Erro ao reordenar plataforma.', 'error');
    } finally {
      setMovingId(null);
    }
  }

  return (
    <>
      {editing && (
        <PlatformForm
          platform={editing}
          nextOrder={platforms.length}
          onClose={() => setEditing(null)}
        />
      )}

      {/* Confirm delete dialog */}
      {confirmDelete && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="dialog-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
        >
          <div className="glass-panel w-full max-w-sm rounded-xl p-6 border border-error-container/30 animate-slide-up">
            <h3 id="dialog-title" className="font-display text-lg font-bold text-on-surface mb-2">
              Excluir &ldquo;{confirmDelete.name}&rdquo;?
            </h3>
            <p className="font-sans text-sm text-on-surface-variant mb-6">
              Esta ação não pode ser desfeita. A plataforma e seu ícone serão removidos permanentemente.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 rounded-xl border border-outline-variant py-2.5 text-sm font-display text-on-surface-variant hover:text-on-surface transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(confirmDelete)}
                disabled={deleting}
                className="flex-1 rounded-xl bg-error-container py-2.5 text-sm font-display font-semibold text-on-error-container hover:brightness-110 transition-all disabled:opacity-60"
              >
                {deleting ? 'Excluindo...' : 'Excluir'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Category filter */}
      {categories.length > 0 && (
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-label uppercase tracking-widest text-on-primary-container mr-1">
            Filtrar:
          </span>
          <button
            onClick={() => setFilterCategory('all')}
            className={`px-3 py-1.5 rounded-full border text-xs font-label uppercase tracking-wider transition-all ${
              filterCategory === 'all'
                ? 'bg-secondary-container/30 border-secondary text-secondary'
                : 'border-outline-variant text-on-surface-variant hover:border-secondary hover:text-secondary'
            }`}
          >
            Todas ({platforms.length})
          </button>
          {categories.map((c) => {
            const count = platforms.filter((p) => p.categoryId === c.id).length;
            return (
              <button
                key={c.id}
                onClick={() => setFilterCategory(c.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-label uppercase tracking-wider transition-all ${
                  filterCategory === c.id
                    ? getCategoryColorClass(c.color) + ' ring-1 ring-on-surface/30'
                    : 'border-outline-variant text-on-surface-variant hover:border-secondary hover:text-secondary'
                }`}
              >
                <span className="material-symbols-outlined text-sm">{c.icon || 'category'}</span>
                {c.name} ({count})
              </button>
            );
          })}
          {platforms.some((p) => !p.categoryId) && (
            <button
              onClick={() => setFilterCategory('none')}
              className={`px-3 py-1.5 rounded-full border text-xs font-label uppercase tracking-wider transition-all ${
                filterCategory === 'none'
                  ? 'border-tertiary text-tertiary bg-tertiary/10'
                  : 'border-outline-variant text-on-surface-variant hover:border-tertiary hover:text-tertiary'
              }`}
            >
              Sem categoria ({platforms.filter((p) => !p.categoryId).length})
            </button>
          )}
        </div>
      )}

      {/* Platform cards */}
      {visiblePlatforms.length === 0 ? (
        <div className="glass-panel rounded-xl flex flex-col items-center justify-center py-20 text-center">
          <span className="material-symbols-outlined text-5xl text-on-primary-container mb-4">
            inbox
          </span>
          <p className="font-display font-semibold text-on-surface-variant">
            {platforms.length === 0
              ? 'Nenhuma plataforma cadastrada ainda.'
              : 'Nenhuma plataforma nesse filtro.'}
          </p>
          <p className="font-sans text-sm text-on-primary-container mt-1">
            {platforms.length === 0
              ? 'Clique em “Nova Plataforma” para começar.'
              : 'Selecione outro filtro ou ajuste a categoria das plataformas.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {visiblePlatforms.map((p, index) => {
            const category = p.categoryId ? categoryById.get(p.categoryId) : undefined;
            return (
              <div
                key={p.id}
                className={`obsidian-card rounded-xl p-5 flex gap-5 items-center ${!p.visible ? 'opacity-50' : ''}`}
              >
                {/* Icon */}
                <div className="h-20 w-20 rounded-lg overflow-hidden flex-shrink-0 bg-surface-container flex items-center justify-center border border-outline-variant">
                  {p.iconUrl ? (
                    <Image
                      src={p.iconUrl}
                      alt={`Logo de ${p.name}`}
                      width={80}
                      height={80}
                      className="object-contain p-2"
                      unoptimized
                    />
                  ) : (
                    <span className="font-display text-2xl font-black text-secondary">
                      {p.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>

                {/* Info + actions */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-2">
                    <div className="min-w-0">
                      <h4 className="font-display font-semibold text-on-surface truncate">{p.name}</h4>
                      {p.description && (
                        <p className="text-xs text-on-primary-container mt-0.5 line-clamp-1 font-sans">
                          {p.description}
                        </p>
                      )}
                    </div>
                    <span
                      className={`px-2 py-1 text-[10px] font-label font-bold rounded-lg uppercase border flex-shrink-0 ml-2
                        ${AUTH_METHOD_COLORS[p.authMethod]}`}
                    >
                      {AUTH_METHOD_LABELS[p.authMethod]}
                    </span>
                  </div>

                  {/* Category badge */}
                  <div className="mb-3 min-h-[22px]">
                    {category ? (
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-[10px] font-label uppercase tracking-wider ${getCategoryColorClass(category.color)}`}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>
                          {category.icon || 'category'}
                        </span>
                        {category.name}
                      </span>
                    ) : p.categoryId ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-[10px] font-label uppercase tracking-wider border-error/40 text-error">
                        <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>
                          error
                        </span>
                        Categoria removida
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md border border-dashed border-outline-variant text-[10px] font-label uppercase tracking-wider text-on-primary-container">
                        Sem categoria
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    {/* Reorder */}
                    <div className="flex flex-col gap-0.5 mr-1">
                      <button
                        onClick={() => handleMove(index, 'up')}
                        disabled={index === 0 || movingId === p.id}
                        aria-label={`Mover ${p.name} para cima`}
                        className="p-1 text-on-primary-container hover:text-on-surface hover:bg-white/5 rounded transition-all disabled:opacity-20 disabled:cursor-not-allowed"
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
                          keyboard_arrow_up
                        </span>
                      </button>
                      <button
                        onClick={() => handleMove(index, 'down')}
                        disabled={index === visiblePlatforms.length - 1 || movingId === p.id}
                        aria-label={`Mover ${p.name} para baixo`}
                        className="p-1 text-on-primary-container hover:text-on-surface hover:bg-white/5 rounded transition-all disabled:opacity-20 disabled:cursor-not-allowed"
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
                          keyboard_arrow_down
                        </span>
                      </button>
                    </div>

                    {/* Visibility toggle */}
                    <button
                      role="switch"
                      aria-checked={p.visible}
                      aria-label={`${p.visible ? 'Ocultar' : 'Exibir'} ${p.name}`}
                      onClick={() => handleToggle(p.id, p.visible)}
                      className="p-2 text-on-primary-container hover:text-secondary rounded-lg transition-all"
                      title={p.visible ? 'Ocultar' : 'Exibir'}
                    >
                      <span className="material-symbols-outlined text-lg">
                        {p.visible ? 'visibility' : 'visibility_off'}
                      </span>
                    </button>

                    {/* Edit / Delete */}
                    <div className="ml-auto flex gap-1">
                      <button
                        onClick={() => setEditing(p)}
                        className="p-2 text-on-primary-container hover:text-on-surface hover:bg-white/5 rounded-lg transition-all"
                        title="Editar"
                      >
                        <span className="material-symbols-outlined text-lg">edit</span>
                      </button>
                      <button
                        onClick={() => setConfirmDelete(p)}
                        className="p-2 text-on-primary-container hover:text-error rounded-lg transition-all"
                        title="Excluir"
                      >
                        <span className="material-symbols-outlined text-lg">delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
