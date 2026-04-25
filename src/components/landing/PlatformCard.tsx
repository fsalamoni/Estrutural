'use client';

import Image from 'next/image';
import { Platform, AUTH_METHOD_LABELS, AUTH_METHOD_COLORS } from '@/lib/types';

interface Props {
  platform: Platform;
}

export default function PlatformCard({ platform }: Props) {
  return (
    <a
      href={platform.accessUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group block rounded-2xl border border-dark-border bg-glass backdrop-blur-sm p-6
                 hover:border-accent-purple/50 hover:bg-dark-hover
                 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg
                 hover:shadow-accent-purple/10 animate-fade-in"
    >
      {/* Ícone */}
      <div className="mb-4 flex items-center gap-4">
        <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-xl
                        border border-dark-border bg-dark-bg">
          {platform.iconUrl ? (
            <Image
              src={platform.iconUrl}
              alt={`Logo de ${platform.name}`}
              fill
              className="object-contain p-2"
              unoptimized
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-2xl font-bold
                            text-accent-glow">
              {platform.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        <div className="min-w-0">
          <h3 className="truncate text-lg font-semibold text-white group-hover:text-accent-glow
                         transition-colors">
            {platform.name}
          </h3>
          <span
            className={`inline-block rounded-full border px-2 py-0.5 text-xs font-medium
                        ${AUTH_METHOD_COLORS[platform.authMethod]}`}
          >
            {AUTH_METHOD_LABELS[platform.authMethod]}
          </span>
        </div>
      </div>

      {/* Descrição */}
      {platform.description && (
        <p className="text-sm leading-relaxed text-gray-400 group-hover:text-gray-300
                      transition-colors line-clamp-3">
          {platform.description}
        </p>
      )}

      {/* CTA */}
      <div className="mt-4 flex items-center gap-1 text-sm font-medium text-accent-glow
                      opacity-0 group-hover:opacity-100 transition-opacity">
        <span>Acessar plataforma</span>
        <span className="translate-x-0 transition-transform group-hover:translate-x-1">→</span>
      </div>
    </a>
  );
}
