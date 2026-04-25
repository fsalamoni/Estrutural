import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center relative overflow-hidden">
      <div className="absolute top-1/4 -left-24 w-96 h-96 bg-secondary-container/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-24 w-96 h-96 bg-tertiary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative">
        <p className="font-display font-black text-[8rem] leading-none text-secondary-container/20 select-none">
          404
        </p>
        <h1 className="font-display text-2xl font-bold text-on-surface -mt-4 mb-3">
          Página não encontrada
        </h1>
        <p className="font-sans text-on-surface-variant mb-8 max-w-sm">
          A página que você está procurando não existe ou foi movida.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl bg-secondary-container text-on-secondary-container px-6 py-3 text-sm font-display font-semibold hover:shadow-[0_0_20px_rgba(87,27,193,0.4)] transition-all uppercase tracking-wider"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          Voltar para o início
        </Link>
      </div>
    </main>
  );
}
