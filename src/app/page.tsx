import PlatformGrid from '@/components/landing/PlatformGrid';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-dark-bg">
      {/* Background decoration */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full
                        bg-accent-purple/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full
                        bg-accent-blue/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Hero */}
        <div className="mb-16 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border
                          border-accent-purple/30 bg-accent-purple/10 px-4 py-1.5
                          text-sm text-accent-glow">
            <span className="h-1.5 w-1.5 rounded-full bg-accent-glow animate-pulse" />
            Protagonista RPG
          </div>

          <h1 className="mb-4 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Acesse suas{' '}
            <span className="bg-gradient-to-r from-accent-purple to-accent-blue
                             bg-clip-text text-transparent">
              plataformas
            </span>
          </h1>

          <p className="mx-auto max-w-2xl text-lg text-gray-400">
            Escolha a plataforma que deseja acessar. Clique no card para ser
            direcionado ao acesso correspondente.
          </p>
        </div>

        {/* Grid de plataformas */}
        <PlatformGrid />

        {/* Footer */}
        <footer className="mt-20 border-t border-dark-border pt-8 text-center">
          <p className="text-sm text-gray-600">
            © {new Date().getFullYear()} Protagonista RPG · protagonistarpg.com.br
          </p>
        </footer>
      </div>
    </main>
  );
}
