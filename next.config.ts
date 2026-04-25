import type { NextConfig } from 'next';

// Validate required environment variables at build time
const REQUIRED_ENV_VARS = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID',
  'NEXT_PUBLIC_ADMIN_UID',
] as const;

const missing = REQUIRED_ENV_VARS.filter(
  (key) => !process.env[key] || process.env[key]?.includes('placeholder') || process.env[key]?.includes('your-')
);

if (missing.length > 0) {
  // Warn but don't fail — allows `npm run build:next` locally without .env.local
  console.warn(
    `\n⚠️  Variáveis de ambiente não configuradas:\n${missing.map((k) => `   • ${k}`).join('\n')}\n` +
    `   Preencha .env.local antes de fazer deploy.\n`
  );
}

const FIREBASE_CSP_ORIGINS = [
  'https://*.googleapis.com',
  'https://*.firebaseio.com',
  'https://*.firebaseapp.com',
  'https://*.cloudfunctions.net',
  'https://*.gstatic.com',
  'https://identitytoolkit.googleapis.com',
  'https://securetoken.googleapis.com',
  'wss://*.firebaseio.com',
].join(' ');

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'firebasestorage.googleapis.com' },
      { protocol: 'https', hostname: '*.googleusercontent.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
    ],
  },

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Frame-Options',        value: 'DENY' },
          { key: 'X-Content-Type-Options',  value: 'nosniff' },
          { key: 'Referrer-Policy',         value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy',      value: 'camera=(), microphone=(), geolocation=()' },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              `connect-src 'self' ${FIREBASE_CSP_ORIGINS}`,
              `script-src 'self' 'unsafe-inline' 'unsafe-eval' ${FIREBASE_CSP_ORIGINS}`,
              `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com`,
              `img-src 'self' data: blob: https:`,
              `font-src 'self' data: https://fonts.gstatic.com`,
              `frame-src https://accounts.google.com`,
              `object-src 'none'`,
              `base-uri 'self'`,
              `form-action 'self'`,
            ].join('; '),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
