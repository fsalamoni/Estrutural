import { Timestamp } from 'firebase/firestore';

export interface Platform {
  id: string;
  name: string;
  description: string;
  accessUrl: string;
  iconUrl: string;
  authMethod: 'email' | 'google' | 'ambos' | 'nenhum';
  categoryId: string;
  visible: boolean;
  order: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export type PlatformInput = Omit<Platform, 'id' | 'createdAt' | 'updatedAt'>;

export interface Category {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  order: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export type CategoryInput = Omit<Category, 'id' | 'createdAt' | 'updatedAt'>;

export const AUTH_METHOD_LABELS: Record<Platform['authMethod'], string> = {
  email: 'E-mail',
  google: 'Google',
  ambos: 'E-mail + Google',
  nenhum: 'Acesso direto',
};

export const AUTH_METHOD_COLORS: Record<Platform['authMethod'], string> = {
  email: 'bg-secondary-container/10 text-secondary border-secondary/20',
  google: 'bg-tertiary/10 text-tertiary border-tertiary/20',
  ambos: 'bg-secondary-container/20 text-on-secondary-container border-secondary-container/30',
  nenhum: 'bg-surface-container-high text-on-surface-variant border-outline-variant',
};

export const CATEGORY_COLOR_OPTIONS = [
  { value: 'tertiary', label: 'Âmbar', className: 'bg-tertiary/15 text-tertiary border-tertiary/30' },
  { value: 'secondary', label: 'Roxo', className: 'bg-secondary-container/20 text-secondary border-secondary/30' },
  { value: 'success', label: 'Verde', className: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' },
  { value: 'info', label: 'Azul', className: 'bg-sky-500/15 text-sky-400 border-sky-500/30' },
  { value: 'warning', label: 'Laranja', className: 'bg-orange-500/15 text-orange-400 border-orange-500/30' },
  { value: 'neutral', label: 'Neutro', className: 'bg-surface-container-high text-on-surface-variant border-outline-variant' },
] as const;

export type CategoryColor = (typeof CATEGORY_COLOR_OPTIONS)[number]['value'];

export function getCategoryColorClass(color: string): string {
  return (
    CATEGORY_COLOR_OPTIONS.find((c) => c.value === color)?.className ??
    'bg-surface-container-high text-on-surface-variant border-outline-variant'
  );
}
