'use client';

import Link from 'next/link';
import { FormEvent, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { isAdmin, signOut } from '@/lib/firebase/auth';

const DEFAULT_REDIRECT = '/admin';

function getSafeRedirectPath(redirect: string | null) {
  if (!redirect?.trim() || !redirect.startsWith('/') || redirect.startsWith('//')) {
    return DEFAULT_REDIRECT;
  }

  try {
    const url = new URL(redirect, 'https://fsalomone.web.app');

    if (url.origin !== 'https://fsalomone.web.app') {
      return DEFAULT_REDIRECT;
    }

    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return DEFAULT_REDIRECT;
  }
}

export default function AdminLoginPage() {
  const { user, isAdminUser, loading, configError, signInWithEmail, signInWithGoogle } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = getSafeRedirectPath(searchParams.get('redirect'));

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!loading && user && isAdminUser) {
      router.replace(redirect);
    }
  }, [user, isAdminUser, loading, router, redirect]);

  async function handleEmailLogin(e: FormEvent) {
    e.preventDefault();

    if (configError) {
      setError(configError);
      return;
    }

    setIsLoading(true);
    setError('');
    try {
      const u = await signInWithEmail(email, password);
      if (!isAdmin(u)) {
        setError('Esta conta nao tem permissao de administrador.');
        await signOut();
        return;
      }
      router.replace(redirect);
    } catch {
      setError('E-mail ou senha inválidos. Verifique suas credenciais.');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleGoogleLogin() {
    if (configError) {
      setError(configError);
      return;
    }

    setIsLoading(true);
    setError('');
    try {
      const u = await signInWithGoogle();
      if (!isAdmin(u)) {
        setError('Esta conta Google não tem permissão de administrador.');
        await signOut();
        return;
      }
      router.replace(redirect);
    } catch {
      setError('Falha no login com Google. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-outline-variant border-t-secondary" />
      </div>
    );
  }

  return (
    <main className="min-h-screen obsidian-gradient arcane-pattern flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative glows */}
      <div className="absolute top-1/4 -left-24 w-96 h-96 bg-secondary-container/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-24 w-96 h-96 bg-tertiary/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Brand header */}
      <header className="fixed top-0 w-full z-50 flex justify-center items-center h-20">
        <div className="font-display font-black tracking-[0.2em] text-on-surface opacity-30 text-base uppercase">
          SALOMONE
        </div>
      </header>

      {/* Login card */}
      <div className="w-full max-w-md z-10">
        <div className="bg-surface-container/60 backdrop-blur-2xl p-8 border border-white/10 rounded-xl shadow-[0_0_50px_rgba(0,0,0,0.5)] animate-slide-up">
          {/* Icon + title */}
          <div className="flex flex-col items-center mb-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-secondary-container to-[#0A0A0C] border border-secondary-container/50 rounded-full flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(87,27,193,0.3)]">
              <span
                className="material-symbols-outlined text-secondary text-3xl"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                shield
              </span>
            </div>
            <h1 className="font-display text-2xl font-bold text-on-surface tracking-tight mb-2 uppercase">
              Acesso Archivist
            </h1>
            <p className="font-sans text-on-surface-variant text-sm max-w-[280px]">
              Entre com suas credenciais para gerenciar as plataformas do portal.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleEmailLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="font-label text-xs text-on-surface-variant uppercase tracking-widest ml-1">
                Identificador Admin
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-outline group-focus-within:text-secondary transition-colors">
                    fingerprint
                  </span>
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="fsalamoni@gmail.com"
                  autoComplete="email"
                  className="w-full bg-surface-container-lowest border border-outline-variant focus:border-secondary text-on-surface py-4 pl-12 pr-4 rounded-xl placeholder:text-outline/50 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="font-label text-xs text-on-surface-variant uppercase tracking-widest ml-1">
                Vault Passcode
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-outline group-focus-within:text-secondary transition-colors">
                    key
                  </span>
                </div>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full bg-surface-container-lowest border border-outline-variant focus:border-secondary text-on-surface py-4 pl-12 pr-4 rounded-xl placeholder:text-outline/50 focus:outline-none transition-colors"
                />
              </div>
            </div>

            {error && (
              <p role="alert" className="rounded-xl border border-error-container bg-error-container/20 px-4 py-3 text-sm text-error">
                {error}
              </p>
            )}

            {configError && !error && (
              <p role="alert" className="rounded-xl border border-error-container bg-error-container/20 px-4 py-3 text-sm text-error">
                {configError}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading || Boolean(configError)}
              className="w-full bg-secondary-container hover:bg-secondary-container/90 text-on-secondary-container font-display text-sm font-semibold py-4 rounded-xl transition-all flex items-center justify-center gap-3 group disabled:opacity-60 disabled:cursor-not-allowed uppercase tracking-wider"
            >
              <span>{isLoading ? 'Inicializando...' : 'Inicializar Sessão Segura'}</span>
              <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">terminal</span>
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6 gap-4">
            <div className="h-px bg-white/10 flex-grow" />
            <span className="font-label text-xs text-outline uppercase tracking-widest">Federação Segura</span>
            <div className="h-px bg-white/10 flex-grow" />
          </div>

          {/* Google */}
          <button
            onClick={handleGoogleLogin}
            disabled={isLoading || Boolean(configError)}
            aria-label="Entrar com Google"
            className="w-full bg-surface-container-low hover:bg-surface-container-high border border-white/5 py-4 rounded-xl flex items-center justify-center gap-3 transition-colors text-on-surface disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span className="font-sans">Entrar com Google</span>
          </button>
        </div>

        {/* Status indicator */}
        <div className="mt-6 flex justify-between items-center px-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-tertiary animate-pulse shadow-[0_0_8px_#e9c349]" />
            <span className="font-label text-xs text-on-surface-variant">NODE STATUS: ATIVO</span>
          </div>
          <span className="font-label text-xs text-outline">LEVEL 4 ENCRYPTION</span>
        </div>

        <p className="mt-6 text-center text-xs text-on-primary-container">
          ←{' '}
          <Link href="/" className="hover:text-on-surface-variant transition-colors font-label">
            Voltar para o portal
          </Link>
        </p>
      </div>

      {/* Vignette */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_50%,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
    </main>
  );
}
