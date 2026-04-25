import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/hooks/useAuth';

const BASE_URL = 'https://protagonistarpg.com.br';

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'Protagonista RPG — Plataformas',
    template: '%s | Protagonista RPG',
  },
  description: 'Hub central de acesso às plataformas Protagonista RPG. Escolha a plataforma que deseja acessar.',
  keywords: ['protagonista rpg', 'rpg', 'plataformas', 'acesso'],
  authors: [{ name: 'Protagonista RPG' }],
  creator: 'Protagonista RPG',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: BASE_URL,
    siteName: 'Protagonista RPG',
    title: 'Protagonista RPG — Plataformas',
    description: 'Hub central de acesso às plataformas Protagonista RPG.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Protagonista RPG — Plataformas',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Protagonista RPG — Plataformas',
    description: 'Hub central de acesso às plataformas Protagonista RPG.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
