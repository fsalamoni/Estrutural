'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Platform, AUTH_METHOD_LABELS } from '@/lib/types';
import { deletePlatform, toggleVisibility, updateOrder } from '@/lib/firebase/firestore';
import { toast } from '@/components/ui/Toast';
import PlatformForm from './PlatformForm';

interface Props {
  platforms: Platform[];
}

export default function PlatformTable({ platforms }: Props) {
  const [editing, setEditing] = useState<Platform | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Platform | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [movingId, setMovingId] = useState<string | null>(null);

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
      toast(!currentVisible ? 'Plataforma exibida na landing page' : 'Plataforma ocultada');
    } catch {
      toast('Erro ao alterar visibilidade.', 'error');
    }
  }

  async function handleMove(index: number, direction: 'up' | 'down') {
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= platforms.length) return;

    const current = platforms[index];
    const swapWith = platforms[swapIndex];
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

      {confirmDelete && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="dialog-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
        >
          <div className="w-full max-w-sm rounded-2xl border border-red-800 bg-dark-card p-6 animate-slide-up">
            <h3 id="dialog-title" className="mb-2 text-lg font-semibold text-white">
              Excluir &ldquo;{confirmDelete.name}&rdquo;?
            </h3>
            <p className="mb-6 text-sm text-gray-400">
              Esta ação não pode ser desfeita. A plataforma e seu ícone serão removidos permanentemente.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 rounded-xl border border-dark-border py-2 text-sm text-gray-400
                           hover:text-white transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(confirmDelete)}
                disabled={deleting}
                className="flex-1 rounded-xl bg-red-700 py-2 text-sm font-semibold text-white
                           hover:bg-red-600 transition-colors disabled:opacity-60"
              >
                {deleting ? 'Excluindo...' : 'Excluir'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-dark-border">
        {platforms.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-3 text-4xl">📭</div>
            <p className="text-gray-400">Nenhuma plataforma cadastrada ainda.</p>
            <p className="text-sm text-gray-600 mt-1">Clique em &ldquo;Nova Plataforma&rdquo; para começar.</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-dark-border bg-dark-bg">
                <th className="w-8 px-2 py-3" />
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Plataforma
                </th>
                <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 sm:table-cell">
                  Acesso
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Visível
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-border">
              {platforms.map((p, index) => (
                <tr
                  key={p.id}
                  className={`transition-colors hover:bg-dark-hover ${!p.visible ? 'opacity-50' : ''}`}
                >
                  {/* Reorder controls */}
                  <td className="px-2 py-4">
                    <div className="flex flex-col gap-0.5">
                      <button
                        onClick={() => handleMove(index, 'up')}
                        disabled={index === 0 || movingId === p.id}
                        aria-label={`Mover ${p.name} para cima`}
                        className="flex h-5 w-5 items-center justify-center rounded text-gray-600
                                   hover:bg-dark-border hover:text-gray-300 disabled:opacity-20
                                   disabled:cursor-not-allowed transition-all text-xs"
                      >
                        ▲
                      </button>
                      <button
                        onClick={() => handleMove(index, 'down')}
                        disabled={index === platforms.length - 1 || movingId === p.id}
                        aria-label={`Mover ${p.name} para baixo`}
                        className="flex h-5 w-5 items-center justify-center rounded text-gray-600
                                   hover:bg-dark-border hover:text-gray-300 disabled:opacity-20
                                   disabled:cursor-not-allowed transition-all text-xs"
                      >
                        ▼
                      </button>
                    </div>
                  </td>

                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative h-9 w-9 flex-shrink-0 overflow-hidden rounded-lg
                                      border border-dark-border bg-dark-bg">
                        {p.iconUrl ? (
                          <Image src={p.iconUrl} alt={`Logo de ${p.name}`} fill className="object-contain p-1" unoptimized />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-sm
                                          font-bold text-accent-glow">
                            {p.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-white">{p.name}</div>
                        {p.description && (
                          <div className="mt-0.5 text-xs text-gray-500 line-clamp-1">
                            {p.description}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="hidden px-4 py-4 sm:table-cell">
                    <span className="text-xs text-gray-400">{AUTH_METHOD_LABELS[p.authMethod]}</span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <button
                      role="switch"
                      aria-checked={p.visible}
                      aria-label={`${p.visible ? 'Ocultar' : 'Exibir'} ${p.name}`}
                      onClick={() => handleToggle(p.id, p.visible)}
                      className={`relative inline-flex h-5 w-9 rounded-full transition-colors
                        ${p.visible ? 'bg-accent-purple' : 'bg-gray-700'}`}
                    >
                      <span
                        className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow
                          transition-transform ${p.visible ? 'translate-x-4' : 'translate-x-0.5'}`}
                      />
                    </button>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setEditing(p)}
                        className="rounded-lg border border-dark-border px-3 py-1.5 text-xs
                                   text-gray-400 hover:border-accent-purple hover:text-white
                                   transition-all"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => setConfirmDelete(p)}
                        className="rounded-lg border border-red-900/50 px-3 py-1.5 text-xs
                                   text-red-400 hover:bg-red-900/20 hover:border-red-700
                                   transition-all"
                      >
                        Excluir
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
