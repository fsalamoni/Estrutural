'use client';

import { FormEvent, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function AdminLoginPage() {
  const { user, isAdminUser, loading, signInWithEmail, signInWithGoogle } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') ?? '/admin';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!loading && user && isAdminUser) {
      // Set session cookie for middleware
      document.cookie = `__session=${user.uid}; path=/; SameSite=Strict; Secure`;
      router.replace(redirect);
    }
  }, [user, isAdminUser, loading, router, redirect]);

  async function handleEmailLogin(e: FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const u = await signInWithEmail(email, password);
      document.cookie = `__session=${u.uid}; path=/; SameSite=Strict; Secure`;
      router.replace(redirect);
    } catch {
      setError('E-mail ou senha inválidos. Verifique suas credenciais.');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleGoogleLogin() {
    setIsLoading(true);
    setError('');
    try {
      const u = await signInWithGoogle();
      if (u.uid !== process.env.NEXT_PUBLIC_ADMIN_UID) {
        setError('Esta conta Google não tem permissão de administrador.');
        await import('@/lib/firebase/auth').then((m) => m.signOut());
        return;
      }
      document.cookie = `__session=${u.uid}; path=/; SameSite=Strict; Secure`;
      router.replace(redirect);
    } catch {
      setError('Falha no login com Google. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-dark-bg">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-dark-border border-t-accent-purple" />
      </div>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-dark-bg px-4">
      {/* Background decoration */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-accent-purple/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-accent-blue/10 blur-3xl" />
      </div>

      <div className="relative w-full max-w-sm">
        {/* Card de login */}
        <div className="rounded-2xl border border-dark-border bg-dark-card p-8 shadow-2xl shadow-black/50 animate-slide-up">
          <div className="mb-8 text-center">
            <div className="mb-3 inline-flex h-14 w-14 items-center justify-center rounded-2xl
                            bg-accent-purple/20 text-2xl">
              🔐
            </div>
            <h1 className="text-2xl font-bold text-white">Área Admin</h1>
            <p className="mt-1 text-sm text-gray-500">Acesso restrito ao administrador</p>
          </div>

          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-300">E-mail</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@exemplo.com"
                className="w-full rounded-xl border border-dark-border bg-dark-bg px-4 py-3
                           text-white placeholder-gray-600 focus:border-accent-purple
                           focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-300">Senha</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-dark-border bg-dark-bg px-4 py-3
                           text-white placeholder-gray-600 focus:border-accent-purple
                           focus:outline-none transition-colors"
              />
            </div>

            {error && (
              <p className="rounded-xl border border-red-800 bg-red-900/20 px-4 py-2.5
                            text-sm text-red-400">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-xl bg-accent-purple py-3 text-sm font-semibold
                         text-white hover:bg-violet-600 transition-colors
                         disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <div className="my-5 flex items-center gap-3">
            <div className="flex-1 border-t border-dark-border" />
            <span className="text-xs text-gray-600">ou</span>
            <div className="flex-1 border-t border-dark-border" />
          </div>

          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="flex w-full items-center justify-center gap-3 rounded-xl border
                       border-dark-border bg-dark-bg py-3 text-sm font-medium text-gray-300
                       hover:border-white/20 hover:text-white transition-all
                       disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Entrar com Google
          </button>
        </div>

        <p className="mt-6 text-center text-xs text-gray-700">
          ← <a href="/" className="hover:text-gray-500 transition-colors">Voltar para a landing page</a>
        </p>
      </div>
    </main>
  );
}
