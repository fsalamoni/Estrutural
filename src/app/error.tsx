'use client';

import Link from 'next/link';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center relative overflow-hidden">
      <div className="absolute top-1/4 -left-24 w-96 h-96 bg-error-container/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative">
        <span className="material-symbols-outlined text-7xl text-error mb-4 block" style={{ fontVariationSettings: "'FILL' 1" }}>
          warning
        </span>
        <h1 className="font-display text-2xl font-bold text-on-surface mb-3">Algo deu errado</h1>
        <p className="font-sans text-on-surface-variant mb-8 max-w-sm">
          {error.message || 'Ocorreu um erro inesperado. Tente novamente.'}
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="rounded-xl bg-secondary-container text-on-secondary-container px-6 py-3 text-sm font-display font-semibold hover:brightness-110 transition-all uppercase tracking-wider"
          >
            Tentar novamente
          </button>
          <Link
            href="/"
            className="rounded-xl border border-outline-variant px-6 py-3 text-sm font-display font-medium text-on-surface-variant hover:text-on-surface transition-colors uppercase tracking-wider"
          >
            Ir para o início
          </Link>
        </div>
      </div>
    </main>
  );
}
