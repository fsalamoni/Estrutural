'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useAllPlatforms } from '@/hooks/usePlatforms';
import PlatformTable from '@/components/admin/PlatformTable';
import PlatformForm from '@/components/admin/PlatformForm';

export default function AdminPage() {
  const { user, signOut } = useAuth();
  const { platforms, loading, error } = useAllPlatforms();
  const [showForm, setShowForm] = useState(false);

  async function handleSignOut() {
    await fetch('/api/auth/session', { method: 'DELETE' });
    await signOut();
    window.location.href = '/';
  }

  return (
    <main className="min-h-screen bg-dark-bg">
      {showForm && (
        <PlatformForm
          nextOrder={platforms.length}
          onClose={() => setShowForm(false)}
        />
      )}

      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-dark-border bg-dark-bg/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <a
              href="/"
              className="text-gray-500 hover:text-white transition-colors text-sm"
              title="Ver landing page"
            >
              ← Início
            </a>
            <span className="text-gray-700">/</span>
            <h1 className="text-lg font-semibold text-white">Painel Admin</h1>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-gray-500 sm:block">
              {user?.email}
            </span>
            <button
              onClick={handleSignOut}
              className="rounded-lg border border-dark-border px-3 py-1.5 text-sm text-gray-400
                         hover:border-red-800 hover:text-red-400 transition-all"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {/* Page header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Plataformas</h2>
            <p className="mt-1 text-sm text-gray-500">
              Gerencie os acessos exibidos na landing page.{' '}
              <span className="text-gray-600">
                {platforms.length} plataforma{platforms.length !== 1 ? 's' : ''} cadastrada{platforms.length !== 1 ? 's' : ''}
                {' · '}
                {platforms.filter((p) => p.visible).length} visível{platforms.filter((p) => p.visible).length !== 1 ? 'is' : ''}
              </span>
            </p>
          </div>

          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-accent-purple px-5 py-2.5
                       text-sm font-semibold text-white hover:bg-violet-600 transition-colors
                       shadow-lg shadow-accent-purple/20"
          >
            <span className="text-base">+</span>
            Nova Plataforma
          </button>
        </div>

        {/* Stats */}
        <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: 'Total', value: platforms.length, icon: '📦' },
            { label: 'Visíveis', value: platforms.filter((p) => p.visible).length, icon: '👁' },
            { label: 'Ocultas', value: platforms.filter((p) => !p.visible).length, icon: '🙈' },
            {
              label: 'Com Google',
              value: platforms.filter((p) => p.authMethod === 'google' || p.authMethod === 'ambos').length,
              icon: '🔑',
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-dark-border bg-dark-card px-4 py-3"
            >
              <div className="flex items-center gap-2 text-gray-500">
                <span>{stat.icon}</span>
                <span className="text-xs">{stat.label}</span>
              </div>
              <div className="mt-1 text-2xl font-bold text-white">{stat.value}</div>
            </div>
          ))}
        </div>

        {/* Tabela */}
        {error ? (
          <div className="flex h-48 flex-col items-center justify-center gap-3 rounded-2xl border border-red-800/50 bg-red-900/10">
            <p className="text-sm text-red-400">Erro ao carregar plataformas: {error}</p>
            <p className="text-xs text-gray-600">Verifique as regras do Firestore e tente recarregar a página.</p>
          </div>
        ) : loading ? (
          <div className="flex h-48 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-dark-border border-t-accent-purple" />
          </div>
        ) : (
          <PlatformTable platforms={platforms} />
        )}
      </div>
    </main>
  );
}
