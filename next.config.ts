import type { NextConfig } from 'next';

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
    ],
  },

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Frame-Options',          value: 'DENY' },
          { key: 'X-Content-Type-Options',    value: 'nosniff' },
          { key: 'Referrer-Policy',           value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy',        value: 'camera=(), microphone=(), geolocation=()' },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              `connect-src 'self' ${FIREBASE_CSP_ORIGINS}`,
              `script-src 'self' 'unsafe-inline' 'unsafe-eval' ${FIREBASE_CSP_ORIGINS}`,
              `style-src 'self' 'unsafe-inline'`,
              `img-src 'self' data: blob: https: firebasestorage.googleapis.com`,
              `font-src 'self' data:`,
              `frame-src 'none'`,
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
