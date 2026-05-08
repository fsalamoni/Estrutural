'use client';

import { useState, FormEvent, useEffect } from 'react';
import { Category, CategoryInput, CATEGORY_COLOR_OPTIONS, getCategoryColorClass } from '@/lib/types';
import { createCategory, updateCategory } from '@/lib/firebase/firestore';
import { toast } from '@/components/ui/Toast';

interface Props {
  category?: Category;
  nextOrder: number;
  onClose: () => void;
}

const EMPTY: CategoryInput = {
  name: '',
  description: '',
  color: 'tertiary',
  icon: 'category',
  order: 0,
};

const COMMON_ICONS = [
  'category',
  'apps',
  'rocket_launch',
  'auto_awesome',
  'workspaces',
  'casino',
  'gavel',
  'school',
  'sports_esports',
  'psychology',
  'business_center',
  'science',
];

export default function CategoryForm({ category, nextOrder, onClose }: Props) {
  const isEditing = !!category;
  const [form, setForm] = useState<CategoryInput>(
    category
      ? {
          name: category.name,
          description: category.description,
          color: category.color,
          icon: category.icon,
          order: category.order,
        }
      : { ...EMPTY, order: nextOrder }
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && !saving) onClose();
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [saving, onClose]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      if (isEditing) {
        await updateCategory(category!.id, form);
      } else {
        await createCategory(form);
      }
      toast(isEditing ? 'Categoria atualizada com sucesso' : 'Categoria criada com sucesso');
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar categoria');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget && !saving) onClose(); }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="cat-form-title"
        className="w-full max-w-lg rounded-xl border border-outline-variant bg-surface-container shadow-[0_0_60px_rgba(0,0,0,0.7)] animate-slide-up overflow-y-auto max-h-[90vh]"
      >
        <div className="flex items-center justify-between border-b border-outline-variant px-6 py-5">
          <div className="flex items-center gap-2">
            <span className="w-1 h-6 bg-secondary rounded-full" />
            <h2 id="cat-form-title" className="font-display text-lg font-bold text-on-surface uppercase tracking-wide">
              {isEditing ? 'Editar Categoria' : 'Nova Categoria'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-on-primary-container hover:text-on-surface transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <section className="glass-panel rounded-xl p-5 space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-1 h-5 bg-secondary rounded-full" />
              <h3 className="font-display text-xs font-semibold text-on-surface uppercase tracking-widest">
                Identidade
              </h3>
            </div>

            <div className="space-y-1.5">
              <label className="font-label text-xs text-on-surface-variant uppercase tracking-widest">
                Nome <span className="text-error">*</span>
              </label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="Ex: RPG, Jurídico, Produtividade..."
                className="w-full bg-surface-container-lowest border-b border-outline-variant focus:border-secondary text-on-surface py-3 px-0 placeholder:text-outline/50 focus:outline-none transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-label text-xs text-on-surface-variant uppercase tracking-widest">
                Descrição
              </label>
              <textarea
                rows={2}
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="Para que serve essa categoria..."
                className="w-full resize-none bg-surface-container-lowest border-b border-outline-variant focus:border-secondary text-on-surface py-3 px-0 placeholder:text-outline/50 focus:outline-none transition-colors"
              />
            </div>
          </section>

          <section className="glass-panel rounded-xl p-5 space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-1 h-5 bg-tertiary rounded-full" />
              <h3 className="font-display text-xs font-semibold text-on-surface uppercase tracking-widest">
                Aparência
              </h3>
            </div>

            <div className="space-y-2">
              <label className="font-label text-xs text-on-surface-variant uppercase tracking-widest">
                Cor
              </label>
              <div className="grid grid-cols-3 gap-2">
                {CATEGORY_COLOR_OPTIONS.map((c) => (
                  <button
                    type="button"
                    key={c.value}
                    onClick={() => setForm((f) => ({ ...f, color: c.value }))}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-label uppercase tracking-wider transition-all ${c.className} ${
                      form.color === c.value
                        ? 'ring-2 ring-on-surface scale-[1.02]'
                        : 'opacity-70 hover:opacity-100'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-current" />
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="font-label text-xs text-on-surface-variant uppercase tracking-widest">
                Ícone
              </label>
              <div className="grid grid-cols-6 gap-2">
                {COMMON_ICONS.map((icon) => (
                  <button
                    type="button"
                    key={icon}
                    onClick={() => setForm((f) => ({ ...f, icon }))}
                    className={`flex items-center justify-center h-10 rounded-lg border transition-all ${
                      form.icon === icon
                        ? 'border-secondary bg-secondary-container/20 text-secondary'
                        : 'border-outline-variant text-on-surface-variant hover:border-secondary hover:text-on-surface'
                    }`}
                    title={icon}
                  >
                    <span className="material-symbols-outlined text-lg">{icon}</span>
                  </button>
                ))}
              </div>
              <input
                type="text"
                value={form.icon}
                onChange={(e) => setForm((f) => ({ ...f, icon: e.target.value }))}
                placeholder="Ou digite o nome de outro Material Symbol"
                className="w-full mt-2 rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2 text-xs text-on-surface-variant placeholder:text-outline/50 focus:border-secondary focus:outline-none transition-colors"
              />
            </div>

            {/* Live preview */}
            <div className="rounded-lg border border-outline-variant bg-surface-container-lowest p-4">
              <p className="text-[10px] font-label uppercase tracking-widest text-on-primary-container mb-2">
                Pré-visualização
              </p>
              <div
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-label uppercase tracking-wider ${getCategoryColorClass(form.color)}`}
              >
                <span className="material-symbols-outlined text-sm">{form.icon || 'category'}</span>
                {form.name || 'Nome da categoria'}
              </div>
            </div>
          </section>

          <section className="glass-panel rounded-xl p-5 space-y-2">
            <label className="font-label text-xs text-on-surface-variant uppercase tracking-widest">
              Ordem
            </label>
            <input
              type="number"
              min={0}
              value={form.order}
              onChange={(e) => setForm((f) => ({ ...f, order: Number(e.target.value) }))}
              className="w-full bg-surface-container-lowest border-b border-outline-variant focus:border-secondary text-on-surface py-3 focus:outline-none transition-colors"
            />
          </section>

          {error && (
            <p className="rounded-lg border border-error-container bg-error-container/20 px-4 py-3 text-sm text-error font-sans">
              {error}
            </p>
          )}

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="flex-1 rounded-xl border border-outline-variant py-3 text-xs font-display font-medium text-on-surface-variant hover:text-on-surface hover:border-on-surface-variant transition-all disabled:opacity-50 uppercase tracking-widest"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 rounded-xl bg-secondary text-on-secondary py-3 text-xs font-display font-semibold hover:shadow-[0_0_15px_rgba(208,188,255,0.3)] active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed uppercase tracking-widest"
            >
              {saving ? 'Salvando...' : isEditing ? 'Salvar Alterações' : 'Criar Categoria'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
