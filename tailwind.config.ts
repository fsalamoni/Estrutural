import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Modern Arcana — Stitch design system
        background: '#121414',
        surface: '#121414',
        'surface-dim': '#121414',
        'surface-bright': '#37393a',
        'surface-container-lowest': '#0c0f0f',
        'surface-container-low': '#1a1c1c',
        'surface-container': '#1e2020',
        'surface-container-high': '#282a2b',
        'surface-container-highest': '#333535',
        'on-surface': '#e2e2e2',
        'on-surface-variant': '#c8c5ca',
        'on-primary-container': '#7a797b',
        outline: '#919095',
        'outline-variant': '#47464a',
        secondary: '#d0bcff',
        'secondary-container': '#571bc1',
        'on-secondary': '#3c0091',
        'on-secondary-container': '#c4abff',
        tertiary: '#e9c349',
        'tertiary-container': '#0f0a00',
        'on-tertiary': '#3c2f00',
        error: '#ffb4ab',
        'error-container': '#93000a',
        'on-error': '#690005',
        'on-error-container': '#ffdad6',
      },
      fontFamily: {
        sans: ['var(--font-manrope)', 'sans-serif'],
        display: ['var(--font-epilogue)', 'sans-serif'],
        label: ['var(--font-space-grotesk)', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '0.125rem',
        lg: '0.25rem',
        xl: '0.5rem',
        '2xl': '0.75rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
