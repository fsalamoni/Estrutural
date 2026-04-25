import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-dark-bg px-4 text-center">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-accent-purple/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-accent-blue/10 blur-3xl" />
      </div>

      <div className="relative">
        <p className="mb-2 text-8xl font-bold text-accent-purple/20">404</p>
        <h1 className="mb-3 text-2xl font-bold text-white">Página não encontrada</h1>
        <p className="mb-8 text-gray-500">A página que você está procurando não existe ou foi movida.</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl bg-accent-purple px-6 py-3
                     text-sm font-semibold text-white hover:bg-violet-600 transition-colors"
        >
          ← Voltar para o início
        </Link>
      </div>
    </main>
  );
}
