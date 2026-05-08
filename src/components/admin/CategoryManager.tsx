'use client';

import { useState } from 'react';
import { Category, Platform, getCategoryColorClass } from '@/lib/types';
import { deleteCategory, updateCategoryOrder } from '@/lib/firebase/firestore';
import { toast } from '@/components/ui/Toast';
import CategoryForm from './CategoryForm';

interface Props {
  categories: Category[];
  platforms: Platform[];
  loading: boolean;
}

export default function CategoryManager({ categories, platforms, loading }: Props) {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Category | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [movingId, setMovingId] = useState<string | null>(null);

  function countPlatformsInCategory(categoryId: string): number {
    return platforms.filter((p) => p.categoryId === categoryId).length;
  }

  async function handleDelete(category: Category) {
    setDeleting(true);
    try {
      await deleteCategory(category.id);
      setConfirmDelete(null);
      toast('Categoria excluída com sucesso');
    } catch (err) {
      toast(
        err instanceof Error ? err.message : 'Erro ao excluir categoria',
        'error'
      );
    } finally {
      setDeleting(false);
    }
  }

  async function handleMove(index: number, direction: 'up' | 'down') {
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= categories.length) return;
    const current = categories[index];
    const swapWith = categories[swapIndex];
    setMovingId(current.id);
    try {
      await Promise.all([
        updateCategoryOrder(current.id, swapWith.order),
        updateCategoryOrder(swapWith.id, current.order),
      ]);
    } catch {
      toast('Erro ao reordenar categoria.', 'error');
    } finally {
      setMovingId(null);
    }
  }

  return (
    <>
      {showForm && (
        <CategoryForm
          nextOrder={(categories[categories.length - 1]?.order ?? 0) + 10}
          onClose={() => setShowForm(false)}
        />
      )}
      {editing && (
        <CategoryForm
          category={editing}
          nextOrder={editing.order}
          onClose={() => setEditing(null)}
        />
      )}

      {confirmDelete && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="cat-del-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
        >
          <div className="glass-panel w-full max-w-sm rounded-xl p-6 border border-error-container/30 animate-slide-up">
            <h3 id="cat-del-title" className="font-display text-lg font-bold text-on-surface mb-2">
              Excluir &ldquo;{confirmDelete.name}&rdquo;?
            </h3>
            <p className="font-sans text-sm text-on-surface-variant mb-6">
              {countPlatformsInCategory(confirmDelete.id) > 0
                ? `Esta categoria está em uso por ${countPlatformsInCategory(confirmDelete.id)} plataforma(s). Reatribua-as primeiro.`
                : 'Esta ação não pode ser desfeita.'}
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
                disabled={deleting || countPlatformsInCategory(confirmDelete.id) > 0}
                className="flex-1 rounded-xl bg-error-container py-2.5 text-sm font-display font-semibold text-on-error-container hover:brightness-110 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {deleting ? 'Excluindo...' : 'Excluir'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="font-display text-lg font-bold text-on-surface">Categorias</h3>
          <p className="text-xs text-on-primary-container font-sans mt-0.5">
            Organize as plataformas em grupos personalizados.
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-secondary text-on-secondary px-5 py-2.5 rounded-xl font-display text-sm font-semibold hover:shadow-[0_0_20px_rgba(208,188,255,0.4)] transition-all whitespace-nowrap"
        >
          <span className="material-symbols-outlined">add</span>
          Nova Categoria
        </button>
      </div>

      {loading ? (
        <div className="flex h-48 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-outline-variant border-t-secondary" />
        </div>
      ) : categories.length === 0 ? (
        <div className="glass-panel rounded-xl flex flex-col items-center justify-center py-20 text-center">
          <span className="material-symbols-outlined text-5xl text-on-primary-container mb-4">
            category
          </span>
          <p className="font-display font-semibold text-on-surface-variant">
            Nenhuma categoria criada ainda.
          </p>
          <p className="font-sans text-sm text-on-primary-container mt-1">
            Clique em &ldquo;Nova Categoria&rdquo; para começar a organizar.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {categories.map((c, index) => {
            const usage = countPlatformsInCategory(c.id);
            return (
              <div
                key={c.id}
                className="obsidian-card rounded-xl p-5 flex gap-4 items-center"
              >
                <div
                  className={`h-14 w-14 flex-shrink-0 rounded-lg border flex items-center justify-center ${getCategoryColorClass(c.color)}`}
                >
                  <span className="material-symbols-outlined text-2xl">
                    {c.icon || 'category'}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-2">
                    <div className="min-w-0">
                      <h4 className="font-display font-semibold text-on-surface truncate">
                        {c.name}
                      </h4>
                      {c.description && (
                        <p className="text-xs text-on-primary-container mt-0.5 line-clamp-1 font-sans">
                          {c.description}
                        </p>
                      )}
                    </div>
                    <span className="px-2 py-1 text-[10px] font-label font-bold rounded-lg uppercase border border-outline-variant text-on-surface-variant flex-shrink-0 ml-2">
                      {usage} {usage === 1 ? 'plataforma' : 'plataformas'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <div className="flex flex-col gap-0.5 mr-1">
                      <button
                        onClick={() => handleMove(index, 'up')}
                        disabled={index === 0 || movingId === c.id}
                        aria-label={`Mover ${c.name} para cima`}
                        className="p-1 text-on-primary-container hover:text-on-surface hover:bg-white/5 rounded transition-all disabled:opacity-20 disabled:cursor-not-allowed"
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
                          keyboard_arrow_up
                        </span>
                      </button>
                      <button
                        onClick={() => handleMove(index, 'down')}
                        disabled={index === categories.length - 1 || movingId === c.id}
                        aria-label={`Mover ${c.name} para baixo`}
                        className="p-1 text-on-primary-container hover:text-on-surface hover:bg-white/5 rounded transition-all disabled:opacity-20 disabled:cursor-not-allowed"
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
                          keyboard_arrow_down
                        </span>
                      </button>
                    </div>

                    <div className="ml-auto flex gap-1">
                      <button
                        onClick={() => setEditing(c)}
                        className="p-2 text-on-primary-container hover:text-on-surface hover:bg-white/5 rounded-lg transition-all"
                        title="Editar"
                      >
                        <span className="material-symbols-outlined text-lg">edit</span>
                      </button>
                      <button
                        onClick={() => setConfirmDelete(c)}
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
