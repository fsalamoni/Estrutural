'use client';

import { useState, useRef, FormEvent } from 'react';
import Image from 'next/image';
import { Platform, PlatformInput } from '@/lib/types';
import { createPlatform, updatePlatform } from '@/lib/firebase/firestore';
import { uploadPlatformIcon } from '@/lib/firebase/storage';
import { toast } from '@/components/ui/Toast';

interface Props {
  platform?: Platform;
  nextOrder: number;
  onClose: () => void;
}

const EMPTY: PlatformInput = {
  name: '',
  description: '',
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
          iconUrl = await uploadPlatformIcon(iconFile, platform!.id);
        }
        await updatePlatform(platform!.id, { ...form, iconUrl });
      } else {
        // Create doc first to get ID, then upload icon
        const tempData: PlatformInput = { ...form, iconUrl: '' };
        const newId = await createPlatform(tempData);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl border border-dark-border bg-dark-card
                      shadow-2xl shadow-black/50 animate-slide-up overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-dark-border p-6">
          <h2 className="text-xl font-semibold text-white">
            {isEditing ? 'Editar Plataforma' : 'Nova Plataforma'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-white transition-colors text-xl"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 p-6">
          {/* Ícone */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">Ícone</label>
            <div className="flex items-center gap-4">
              <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl
                              border border-dark-border bg-dark-bg">
                {iconPreview ? (
                  <Image src={iconPreview} alt="preview" fill className="object-contain p-2" unoptimized />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-gray-600 text-2xl">
                    {form.name ? form.name.charAt(0).toUpperCase() : '?'}
                  </div>
                )}
              </div>
              <div className="flex-1 space-y-2">
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="w-full rounded-lg border border-dark-border bg-dark-bg px-3 py-2
                             text-sm text-gray-400 hover:border-accent-purple hover:text-white
                             transition-all text-left"
                >
                  📁 Enviar arquivo (PNG, SVG, WEBP)
                </button>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleIconChange}
                />
                <input
                  type="url"
                  placeholder="Ou cole uma URL de imagem"
                  value={iconFile ? '' : form.iconUrl}
                  onChange={(e) => {
                    setIconFile(null);
                    setIconPreview(e.target.value);
                    setForm((f) => ({ ...f, iconUrl: e.target.value }));
                  }}
                  className="w-full rounded-lg border border-dark-border bg-dark-bg px-3 py-2
                             text-sm text-gray-400 placeholder-gray-600
                             focus:border-accent-purple focus:outline-none focus:text-white"
                />
              </div>
            </div>
          </div>

          {/* Nome */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-300">
              Nome <span className="text-red-400">*</span>
            </label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="Ex: Notion, Discord, GitHub..."
              className="w-full rounded-lg border border-dark-border bg-dark-bg px-4 py-2.5
                         text-white placeholder-gray-600 focus:border-accent-purple
                         focus:outline-none transition-colors"
            />
          </div>

          {/* Descrição */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-300">Descrição</label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="Descreva brevemente o que é essa plataforma..."
              className="w-full resize-none rounded-lg border border-dark-border bg-dark-bg px-4 py-2.5
                         text-white placeholder-gray-600 focus:border-accent-purple
                         focus:outline-none transition-colors"
            />
          </div>

          {/* URL de Acesso */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-300">
              URL de Acesso <span className="text-red-400">*</span>
            </label>
            <input
              required
              type="url"
              value={form.accessUrl}
              onChange={(e) => setForm((f) => ({ ...f, accessUrl: e.target.value }))}
              placeholder="https://..."
              className="w-full rounded-lg border border-dark-border bg-dark-bg px-4 py-2.5
                         text-white placeholder-gray-600 focus:border-accent-purple
                         focus:outline-none transition-colors"
            />
          </div>

          {/* Método de Autenticação */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-300">
              Método de Acesso
            </label>
            <select
              value={form.authMethod}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  authMethod: e.target.value as Platform['authMethod'],
                }))
              }
              className="w-full rounded-lg border border-dark-border bg-dark-bg px-4 py-2.5
                         text-white focus:border-accent-purple focus:outline-none transition-colors"
            >
              <option value="email">E-mail</option>
              <option value="google">Google</option>
              <option value="ambos">E-mail + Google</option>
              <option value="nenhum">Acesso direto (sem login)</option>
            </select>
          </div>

          {/* Ordem */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-300">
              Ordem de exibição
            </label>
            <input
              type="number"
              min={0}
              value={form.order}
              onChange={(e) => setForm((f) => ({ ...f, order: Number(e.target.value) }))}
              className="w-full rounded-lg border border-dark-border bg-dark-bg px-4 py-2.5
                         text-white focus:border-accent-purple focus:outline-none transition-colors"
            />
          </div>

          {/* Visibilidade */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setForm((f) => ({ ...f, visible: !f.visible }))}
              className={`relative h-6 w-11 rounded-full transition-colors duration-200
                ${form.visible ? 'bg-accent-purple' : 'bg-gray-700'}`}
            >
              <span
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform
                  ${form.visible ? 'translate-x-5' : 'translate-x-0.5'}`}
              />
            </button>
            <span className="text-sm text-gray-300">
              {form.visible ? 'Visível na landing page' : 'Oculto (não aparece publicamente)'}
            </span>
          </div>

          {error && (
            <p className="rounded-lg border border-red-800 bg-red-900/20 px-4 py-2 text-sm text-red-400">
              {error}
            </p>
          )}

          {/* Ações */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="flex-1 rounded-xl border border-dark-border bg-dark-bg py-2.5 text-sm
                         font-medium text-gray-400 hover:text-white hover:border-gray-500
                         transition-all disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 rounded-xl bg-accent-purple py-2.5 text-sm font-semibold
                         text-white hover:bg-violet-600 transition-colors
                         disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {saving ? 'Salvando...' : isEditing ? 'Salvar Alterações' : 'Criar Plataforma'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
