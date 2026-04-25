import type { Metadata } from 'next';
import { Epilogue, Manrope, Space_Grotesk } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/hooks/useAuth';

const epilogue = Epilogue({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800', '900'],
  variable: '--font-epilogue',
  display: 'swap',
});

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-manrope',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['500'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

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
  icons: { icon: '/favicon.svg', shortcut: '/favicon.svg' },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: BASE_URL,
    siteName: 'Protagonista RPG',
    title: 'Protagonista RPG — Plataformas',
    description: 'Hub central de acesso às plataformas Protagonista RPG.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Protagonista RPG — Plataformas' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Protagonista RPG — Plataformas',
    description: 'Hub central de acesso às plataformas Protagonista RPG.',
    images: ['/og-image.png'],
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${epilogue.variable} ${manrope.variable} ${spaceGrotesk.variable}`}>
      <head>
        {/* Material Symbols icon font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=block"
        />
      </head>
      <body className="bg-background text-on-surface font-sans">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
