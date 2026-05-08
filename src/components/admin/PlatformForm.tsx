'use client';

import { useState, useRef, FormEvent, useEffect } from 'react';
import Image from 'next/image';
import {
  DEFAULT_PLATFORM_CATEGORY,
  PLATFORM_CATEGORY_SUGGESTIONS,
  Platform,
  PlatformInput,
} from '@/lib/types';
import { createPlatform, updatePlatform } from '@/lib/firebase/firestore';
import { uploadPlatformIcon, deletePlatformIcon, isFirebaseStorageUrl } from '@/lib/firebase/storage';
import { toast } from '@/components/ui/Toast';

interface Props {
  platform?: Platform;
  nextOrder: number;
  onClose: () => void;
}

const EMPTY: PlatformInput = {
  name: '',
  description: '',
  category: DEFAULT_PLATFORM_CATEGORY,
  accessUrl: '',
  iconUrl: '',
  authMethod: 'email',
  visible: true,
  order: 0,
};

export default function PlatformForm({ platform, nextOrder, onClose }: Props) {
  const isEditing = !!platform;
  const [form, setForm] = useState<PlatformInput>(
    platform
      ? {
          name: platform.name,
          description: platform.description,
          category: platform.category,
          accessUrl: platform.accessUrl,
          iconUrl: platform.iconUrl,
          authMethod: platform.authMethod,
          visible: platform.visible,
          order: platform.order,
        }
      : { ...EMPTY, order: nextOrder }
  );
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [iconPreview, setIconPreview] = useState<string>(platform?.iconUrl ?? '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && !saving) onClose();
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [saving, onClose]);

  function handleIconChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setIconFile(file);
    setIconPreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      let iconUrl = form.iconUrl;
      if (isEditing) {
        if (iconFile) {
          const oldUrl = platform!.iconUrl;
          if (oldUrl && isFirebaseStorageUrl(oldUrl)) {
            const oldExt = oldUrl.split('.').pop()?.split('?')[0];
            const newExt = iconFile.name.split('.').pop()?.toLowerCase();
            if (oldExt !== newExt) await deletePlatformIcon(oldUrl);
          }
          iconUrl = await uploadPlatformIcon(iconFile, platform!.id);
        }
        await updatePlatform(platform!.id, { ...form, iconUrl });
      } else {
        const newId = await createPlatform({ ...form, iconUrl: '' });
        if (iconFile) {
          iconUrl = await uploadPlatformIcon(iconFile, newId);
          await updatePlatform(newId, { iconUrl });
        } else if (form.iconUrl) {
          await updatePlatform(newId, { iconUrl: form.iconUrl });
        }
      }
      toast(isEditing ? 'Plataforma atualizada com sucesso' : 'Plataforma criada com sucesso');
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar plataforma');
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
        aria-labelledby="form-title"
        className="w-full max-w-lg rounded-xl border border-outline-variant bg-surface-container shadow-[0_0_60px_rgba(0,0,0,0.7)] animate-slide-up overflow-y-auto max-h-[90vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-outline-variant px-6 py-5">
          <div className="flex items-center gap-2">
            <span className="w-1 h-6 bg-tertiary rounded-full" />
            <h2 id="form-title" className="font-display text-lg font-bold text-on-surface uppercase tracking-wide">
              {isEditing ? 'Editar Plataforma' : 'Nova Plataforma'}
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
          {/* Identity & Visuals */}
          <section className="glass-panel rounded-xl p-5 space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-1 h-5 bg-tertiary rounded-full" />
              <h3 className="font-display text-xs font-semibold text-on-surface uppercase tracking-widest">
                Identidade &amp; Visual
              </h3>
            </div>

            {/* Icon upload */}
            <div>
              <label className="font-label text-xs text-on-surface-variant uppercase tracking-widest mb-2 block">
                Ícone
              </label>
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 flex-shrink-0 rounded-lg border-2 border-dashed border-outline-variant bg-surface-container-lowest flex items-center justify-center overflow-hidden">
                  {iconPreview ? (
                    <Image src={iconPreview} alt="preview" width={56} height={56} className="object-contain p-1" unoptimized />
                  ) : (
                    <span className="material-symbols-outlined text-on-primary-container">image</span>
                  )}
                </div>
                <div className="flex-1 space-y-2">
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2 text-xs font-label text-on-surface-variant hover:border-secondary hover:text-on-surface transition-all flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-sm">cloud_upload</span>
                    Enviar arquivo (PNG, SVG, WEBP)
                  </button>
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleIconChange} />
                  <input
                    type="url"
                    placeholder="Ou cole uma URL de imagem"
                    value={iconFile ? '' : form.iconUrl}
                    onChange={(e) => {
                      setIconFile(null);
                      setIconPreview(e.target.value);
                      setForm((f) => ({ ...f, iconUrl: e.target.value }));
                    }}
                    className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2 text-xs text-on-surface-variant placeholder:text-outline/50 focus:border-secondary focus:outline-none transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Name */}
            <div className="space-y-1.5">
              <label className="font-label text-xs text-on-surface-variant uppercase tracking-widest">
                Nome <span className="text-error">*</span>
              </label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="Ex: Notion, Discord, GitHub..."
                className="w-full bg-surface-container-lowest border-b border-outline-variant focus:border-tertiary text-on-surface py-3 px-0 placeholder:text-outline/50 focus:outline-none transition-colors"
              />
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="font-label text-xs text-on-surface-variant uppercase tracking-widest">
                Descrição
              </label>
              <textarea
                rows={2}
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="Descreva brevemente o que é essa plataforma..."
                className="w-full resize-none bg-surface-container-lowest border-b border-outline-variant focus:border-tertiary text-on-surface py-3 px-0 placeholder:text-outline/50 focus:outline-none transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-label text-xs text-on-surface-variant uppercase tracking-widest">
                Categoria
              </label>
              <input
                list="platform-category-options"
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                placeholder="Ex: Trabalho, IA, RPG, Jogos, Outros"
                className="w-full bg-surface-container-lowest border-b border-outline-variant focus:border-tertiary text-on-surface py-3 px-0 placeholder:text-outline/50 focus:outline-none transition-colors"
              />
              <datalist id="platform-category-options">
                {PLATFORM_CATEGORY_SUGGESTIONS.map((category) => (
                  <option key={category} value={category} />
                ))}
              </datalist>
            </div>
          </section>

          {/* Auth & Access */}
          <section className="glass-panel rounded-xl p-5 space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-1 h-5 bg-secondary rounded-full" />
              <h3 className="font-display text-xs font-semibold text-on-surface uppercase tracking-widest">
                Autenticação &amp; Acesso
              </h3>
            </div>

            <div className="space-y-1.5">
              <label className="font-label text-xs text-on-surface-variant uppercase tracking-widest">
                URL de Acesso <span className="text-error">*</span>
              </label>
              <div className="flex items-center border-b border-outline-variant focus-within:border-secondary transition-colors">
                <span className="material-symbols-outlined text-sm text-on-primary-container mr-2">link</span>
                <input
                  required
                  type="url"
                  value={form.accessUrl}
                  onChange={(e) => setForm((f) => ({ ...f, accessUrl: e.target.value }))}
                  placeholder="https://..."
                  className="flex-1 bg-transparent text-on-surface py-3 placeholder:text-outline/50 focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-label text-xs text-on-surface-variant uppercase tracking-widest">
                Método de Acesso
              </label>
              <select
                value={form.authMethod}
                onChange={(e) => setForm((f) => ({ ...f, authMethod: e.target.value as Platform['authMethod'] }))}
                className="w-full bg-surface-container-lowest border-b border-outline-variant focus:border-secondary text-on-surface py-3 focus:outline-none transition-colors"
              >
                <option value="email">E-mail</option>
                <option value="google">Google</option>
                <option value="ambos">E-mail + Google</option>
                <option value="nenhum">Acesso direto (sem login)</option>
              </select>
            </div>
          </section>

          {/* Config */}
          <section className="glass-panel rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-1 h-5 bg-tertiary rounded-full" />
              <h3 className="font-display text-xs font-semibold text-on-surface uppercase tracking-widest">
                Configuração
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1.5">
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
              </div>
              <div className="space-y-1.5">
                <label className="font-label text-xs text-on-surface-variant uppercase tracking-widest">
                  Visibilidade
                </label>
                <div className="flex items-center gap-4 py-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="visible" checked={form.visible} onChange={() => setForm((f) => ({ ...f, visible: true }))} className="text-tertiary" />
                    <span className="text-on-surface font-sans text-sm">Ativo</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="visible" checked={!form.visible} onChange={() => setForm((f) => ({ ...f, visible: false }))} className="text-tertiary" />
                    <span className="text-on-surface-variant font-sans text-sm">Oculto</span>
                  </label>
                </div>
              </div>
            </div>
          </section>

          {error && (
            <p className="rounded-lg border border-error-container bg-error-container/20 px-4 py-3 text-sm text-error font-sans">
              {error}
            </p>
          )}

          {/* Actions */}
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
              {saving ? 'Salvando...' : isEditing ? 'Salvar Alterações' : 'Criar Plataforma'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
