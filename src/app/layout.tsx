import type { Metadata } from 'next';
import { Epilogue, Manrope, Space_Grotesk } from 'next/font/google';
import '@fontsource/material-symbols-outlined';
import './globals.css';
import { AuthProvider } from '@/hooks/useAuth';
import { SITE_URL } from '@/lib/site';

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

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Plataformas Salomone',
    template: '%s | Plataformas Salomone',
  },
  description: 'Hub central de acesso e direcionamento para as plataformas Salomone.',
  keywords: ['salomone', 'plataformas', 'hub', 'acesso'],
  authors: [{ name: 'Plataformas Salomone' }],
  creator: 'Plataformas Salomone',
  icons: { icon: '/favicon.svg', shortcut: '/favicon.svg' },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: SITE_URL,
    siteName: 'Plataformas Salomone',
    title: 'Plataformas Salomone',
    description: 'Hub central de acesso e direcionamento para as plataformas Salomone.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Plataformas Salomone' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Plataformas Salomone',
    description: 'Hub central de acesso e direcionamento para as plataformas Salomone.',
    images: ['/og-image.png'],
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${epilogue.variable} ${manrope.variable} ${spaceGrotesk.variable}`}>
      <body className="bg-background text-on-surface font-sans">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
