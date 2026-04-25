'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-dark-bg px-4 text-center">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-red-900/10 blur-3xl" />
      </div>
      <div className="relative">
        <p className="mb-2 text-7xl">⚠️</p>
        <h1 className="mb-3 text-2xl font-bold text-white">Algo deu errado</h1>
        <p className="mb-8 max-w-sm text-gray-500">
          {error.message || 'Ocorreu um erro inesperado. Tente novamente.'}
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="rounded-xl bg-accent-purple px-6 py-3 text-sm font-semibold text-white
                       hover:bg-violet-600 transition-colors"
          >
            Tentar novamente
          </button>
          <a
            href="/"
            className="rounded-xl border border-dark-border px-6 py-3 text-sm font-medium
                       text-gray-400 hover:text-white transition-colors"
          >
            Ir para o início
          </a>
        </div>
      </div>
    </main>
  );
}
