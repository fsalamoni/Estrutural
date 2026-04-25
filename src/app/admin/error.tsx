'use client';

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-dark-bg px-4 text-center">
      <p className="mb-3 text-5xl">⚠️</p>
      <h2 className="mb-2 text-xl font-bold text-white">Erro no painel admin</h2>
      <p className="mb-6 text-sm text-gray-500 max-w-sm">
        {error.message || 'Ocorreu um erro inesperado.'}
      </p>
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="rounded-xl bg-accent-purple px-5 py-2.5 text-sm font-semibold
                     text-white hover:bg-violet-600 transition-colors"
        >
          Tentar novamente
        </button>
        <a
          href="/"
          className="rounded-xl border border-dark-border px-5 py-2.5 text-sm text-gray-400
                     hover:text-white transition-colors"
        >
          Voltar ao site
        </a>
      </div>
    </div>
  );
}
