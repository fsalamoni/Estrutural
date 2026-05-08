'use client';

import Image from 'next/image';
import {
  Platform,
  Category,
  AUTH_METHOD_LABELS,
  AUTH_METHOD_COLORS,
  getCategoryColorClass,
} from '@/lib/types';

const AUTH_METHOD_ICONS: Record<Platform['authMethod'], string> = {
  email: 'mail',
  google: 'account_circle',
  ambos: 'lock_open',
  nenhum: 'link',
};

interface Props {
  platform: Platform;
  category?: Category;
}

export default function PlatformCard({ platform, category }: Props) {
  return (
    <a
      href={platform.accessUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="glass-card inner-glow-purple rounded-xl p-8 flex flex-col items-start group animate-fade-in"
    >
      {/* Icon */}
      <div
        className={`w-12 h-12 rounded-lg flex items-center justify-center mb-6 border transition-all
          ${platform.iconUrl
            ? 'bg-surface-container-low border-outline-variant group-hover:border-secondary'
            : 'bg-secondary-container/10 border-secondary/20 group-hover:border-secondary'
          }`}
      >
        {platform.iconUrl ? (
          <div className="relative w-8 h-8">
            <Image
              src={platform.iconUrl}
              alt={`Logo de ${platform.name}`}
              fill
              className="object-contain"
              unoptimized
            />
          </div>
        ) : (
          <span
            className="material-symbols-outlined text-secondary text-2xl"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            {AUTH_METHOD_ICONS[platform.authMethod]}
          </span>
        )}
      </div>

      {/* Category badge */}
      {category && (
        <span
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-[10px] font-label uppercase tracking-wider mb-3 ${getCategoryColorClass(category.color)}`}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>
            {category.icon || 'category'}
          </span>
          {category.name}
        </span>
      )}

      {/* Name */}
      <h3 className="font-display font-semibold text-2xl leading-snug text-white mb-3 group-hover:text-secondary transition-colors">
        {platform.name}
      </h3>

      {/* Description */}
      {platform.description && (
        <p className="font-sans text-base text-on-surface-variant mb-6 flex-grow line-clamp-3 leading-relaxed">
          {platform.description}
        </p>
      )}

      {/* Auth badge + CTA */}
      <div className="mt-auto w-full space-y-4">
        <div
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-label uppercase tracking-wider
            ${AUTH_METHOD_COLORS[platform.authMethod]}`}
        >
          <span className="material-symbols-outlined text-sm">{AUTH_METHOD_ICONS[platform.authMethod]}</span>
          {AUTH_METHOD_LABELS[platform.authMethod]}
        </div>

        <div className="flex items-center gap-2 text-sm font-display text-secondary opacity-0 group-hover:opacity-100 transition-opacity">
          <span>Acessar plataforma</span>
          <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">
            arrow_forward
          </span>
        </div>
      </div>
    </a>
  );
}
