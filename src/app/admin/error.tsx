'use client';

import Link from 'next/link';

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-surface-container-lowest px-4 text-center">
      <span className="material-symbols-outlined text-5xl text-error mb-4 block" style={{ fontVariationSettings: "'FILL' 1" }}>
        warning
      </span>
      <h2 className="font-display text-xl font-bold text-on-surface mb-2">Erro no painel admin</h2>
      <p className="font-sans text-sm text-on-surface-variant mb-6 max-w-sm">
        {error.message || 'Ocorreu um erro inesperado.'}
      </p>
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="rounded-xl bg-secondary-container text-on-secondary-container px-5 py-2.5 text-xs font-display font-semibold hover:brightness-110 transition-all uppercase tracking-widest"
        >
          Tentar novamente
        </button>
        <Link
          href="/"
          className="rounded-xl border border-outline-variant px-5 py-2.5 text-xs font-display text-on-surface-variant hover:text-on-surface transition-colors uppercase tracking-widest"
        >
          Voltar ao site
        </Link>
      </div>
    </div>
  );
}
