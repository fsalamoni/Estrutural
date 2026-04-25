import PlatformGrid from '@/components/landing/PlatformGrid';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="bg-[#0A0A0C]/80 backdrop-blur-xl border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.5)] sticky top-0 z-50 flex justify-between items-center w-full px-6 py-4">
        <span className="text-xl font-black tracking-[0.15em] text-white uppercase font-display">
          PROTAGONISTA
        </span>
        <a
          href="/admin"
          className="group flex items-center gap-2 text-xs font-label text-on-primary-container hover:text-on-surface transition-colors uppercase tracking-widest"
          title="Área administrativa"
        >
          <span className="material-symbols-outlined text-[18px]">admin_panel_settings</span>
          <span className="hidden sm:inline">Admin</span>
        </a>
      </header>

      {/* Hero + grid */}
      <div className="bg-hero-mesh">
        <section className="max-w-[1440px] mx-auto px-6 pt-24 pb-16 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary-container/20 border border-secondary/20 mb-8">
            <span
              className="material-symbols-outlined text-secondary"
              style={{ fontSize: '14px', fontVariationSettings: "'FILL' 1" }}
            >
              auto_awesome
            </span>
            <span className="font-label text-secondary uppercase tracking-[0.08em] text-xs">
              Portal Central · protagonistarpg.com.br
            </span>
          </div>

          <h1 className="font-display font-black text-[clamp(2rem,5vw,3rem)] leading-[1.1] tracking-[-0.02em] text-white mb-6 max-w-4xl mx-auto">
            Acesse suas{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-tertiary">
              Plataformas Digitais
            </span>
          </h1>

          <p className="font-sans text-lg text-on-surface-variant max-w-2xl mx-auto mb-12 leading-relaxed">
            Escolha a plataforma que deseja acessar. Clique no card para ser
            direcionado ao acesso correspondente.
          </p>
        </section>

        <section className="max-w-6xl mx-auto px-6 pb-24">
          <PlatformGrid />

          {/* Admin link */}
          <div className="mt-16 flex justify-center">
            <a
              href="/admin"
              className="group flex items-center gap-4 px-6 py-3 rounded-full border border-white/5 hover:border-tertiary/30 transition-all"
            >
              <span className="material-symbols-outlined text-on-surface-variant group-hover:text-tertiary transition-colors">
                admin_panel_settings
              </span>
              <span className="font-label text-xs text-on-surface-variant group-hover:text-white uppercase tracking-widest">
                Acesso restrito ao administrador
              </span>
              <span className="material-symbols-outlined text-on-surface-variant text-sm group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </a>
          </div>
        </section>

        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-50" />
      </div>

      {/* Footer */}
      <footer className="bg-[#0A0A0C] w-full py-12 border-t border-purple-900/30 flex flex-col items-center gap-4">
        <p className="font-label text-xs uppercase tracking-widest text-gray-600">
          © {new Date().getFullYear()} PROTAGONISTA RPG. TODOS OS DIREITOS RESERVADOS.
        </p>
      </footer>
    </main>
  );
}
