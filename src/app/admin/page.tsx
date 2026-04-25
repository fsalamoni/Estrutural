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
    <div className="flex min-h-screen bg-surface-container-lowest">
      {showForm && (
        <PlatformForm
          nextOrder={platforms.length}
          onClose={() => setShowForm(false)}
        />
      )}

      {/* Sidebar */}
      <aside className="h-screen w-64 fixed left-0 top-0 bg-[#0A0A0C] border-r border-purple-900/20 z-30 flex flex-col py-8">
        <div className="px-6 mb-10">
          <h1 className="text-tertiary font-display font-bold tracking-tight text-xl text-glow-amber">
            ARCHIVIST
          </h1>
          <p className="text-on-primary-container text-xs mt-1 font-label uppercase tracking-widest">
            Administrador
          </p>
        </div>

        <nav className="flex-1 space-y-1 px-3">
          <div className="flex items-center gap-3 px-4 py-3 bg-secondary-container/20 text-secondary border-r-4 border-secondary font-display text-sm font-medium">
            <span className="material-symbols-outlined">dashboard</span>
            Plataformas
          </div>
          <a
            href="/"
            className="flex items-center gap-3 px-4 py-3 text-on-primary-container hover:text-on-surface hover:bg-white/5 hover:translate-x-1 transition-all font-display text-sm"
          >
            <span className="material-symbols-outlined">language</span>
            Ver Portal
          </a>
        </nav>

        <div className="px-6 mt-auto pt-6 border-t border-white/5 space-y-3">
          <p className="text-xs text-on-primary-container font-label truncate">{user?.email}</p>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 text-xs text-on-primary-container hover:text-error transition-colors font-label uppercase tracking-widest"
          >
            <span className="material-symbols-outlined text-sm">logout</span>
            Sair
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="ml-64 flex-1 min-h-screen p-8">
        {/* Top bar */}
        <header className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-8">
          <div>
            <h2 className="font-display text-2xl font-bold text-on-surface tracking-tight">
              System Overview
            </h2>
            <p className="text-on-primary-container text-sm font-sans mt-1">
              Gerenciando as plataformas do PROTAGONISTA
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-secondary text-on-secondary px-6 py-3 rounded-xl font-display text-sm font-semibold hover:shadow-[0_0_20px_rgba(208,188,255,0.4)] transition-all whitespace-nowrap"
          >
            <span className="material-symbols-outlined">add</span>
            Nova Plataforma
          </button>
        </header>

        {/* Bento stats grid */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="glass-panel p-5 rounded-xl flex flex-col justify-between h-32 inner-glow-purple border-l-4 border-tertiary">
            <span className="font-label text-xs text-tertiary uppercase tracking-widest text-glow-amber">
              Total
            </span>
            <span className="font-display text-4xl font-black text-on-surface">{platforms.length}</span>
          </div>

          <div className="glass-panel p-5 rounded-xl flex flex-col justify-between h-32 inner-glow-purple">
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-secondary text-sm">visibility</span>
              <span className="font-label text-xs text-secondary uppercase tracking-widest">Visíveis</span>
            </div>
            <span className="font-display text-4xl font-black text-on-surface">
              {platforms.filter((p) => p.visible).length}
            </span>
          </div>

          <div className="glass-panel p-5 rounded-xl flex flex-col justify-between h-32 inner-glow-purple">
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-on-primary-container text-sm">visibility_off</span>
              <span className="font-label text-xs text-on-primary-container uppercase tracking-widest">Ocultas</span>
            </div>
            <span className="font-display text-4xl font-black text-on-surface">
              {platforms.filter((p) => !p.visible).length}
            </span>
          </div>

          <div className="glass-panel col-span-2 md:col-span-1 p-5 rounded-xl h-32 relative overflow-hidden group">
            <div className="relative z-10">
              <span className="font-label text-xs text-on-primary-container uppercase tracking-widest">
                Google Auth
              </span>
              <div className="mt-3 flex items-center gap-3">
                <div className="h-1.5 flex-1 bg-surface-container rounded-full overflow-hidden">
                  <div
                    className="h-full bg-secondary shadow-[0_0_8px_rgba(208,188,255,0.8)] rounded-full"
                    style={{
                      width: `${Math.max(5, (platforms.filter((p) => p.authMethod === 'google' || p.authMethod === 'ambos').length / Math.max(platforms.length, 1)) * 100)}%`,
                    }}
                  />
                </div>
                <span className="font-display font-bold text-on-surface text-sm">
                  {platforms.filter((p) => p.authMethod === 'google' || p.authMethod === 'ambos').length}
                </span>
              </div>
              <p className="text-[10px] text-on-primary-container mt-1.5 font-label uppercase tracking-widest">
                plataformas
              </p>
            </div>
            <div className="absolute inset-0 opacity-10 bg-gradient-to-r from-secondary/0 via-secondary/20 to-secondary/0 group-hover:translate-x-full transition-transform duration-1000" />
          </div>
        </section>

        {/* Platform list */}
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-display text-lg font-bold text-on-surface">Plataformas Registradas</h3>
        </div>

        {error ? (
          <div className="glass-panel rounded-xl p-8 text-center border-l-4 border-error">
            <p className="text-sm text-error mb-1">Erro ao carregar plataformas: {error}</p>
            <p className="text-xs text-on-primary-container">
              Verifique as regras do Firestore e recarregue a página.
            </p>
          </div>
        ) : loading ? (
          <div className="flex h-48 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-outline-variant border-t-secondary" />
          </div>
        ) : (
          <PlatformTable platforms={platforms} />
        )}
      </main>
    </div>
  );
}
