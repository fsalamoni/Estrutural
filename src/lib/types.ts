import { Timestamp } from 'firebase/firestore';

export interface Platform {
  id: string;
  name: string;
  description: string;
  category: string;
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

export const DEFAULT_PLATFORM_CATEGORY = 'Outros';

export const PLATFORM_CATEGORY_SUGGESTIONS = [
  'Trabalho',
  'IA',
  'RPG',
  'Jogos',
  DEFAULT_PLATFORM_CATEGORY,
] as const;

const PLATFORM_CATEGORY_ALIASES: Record<string, (typeof PLATFORM_CATEGORY_SUGGESTIONS)[number]> = {
  trabalho: 'Trabalho',
  juridica: 'Trabalho',
  juridicas: 'Trabalho',
  juridico: 'Trabalho',
  gestao: 'Trabalho',
  ia: 'IA',
  rpg: 'RPG',
  jogos: 'Jogos',
  entretenimento: 'Jogos',
  outro: 'Outros',
  outros: 'Outros',
  outras: 'Outros',
  produtividade: 'Outros',
  educacao: 'Outros',
  saude: 'Outros',
  'educacao & saude': 'Outros',
};

const CATEGORY_PRIORITY = new Map(
  PLATFORM_CATEGORY_SUGGESTIONS.map((category, index) => [normalizeCategoryKey(category), index])
);

function normalizeCategoryKey(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase();
}

export function getPlatformCategory(platform: Pick<Platform, 'category'> | string | null | undefined): string {
  const rawCategory = typeof platform === 'string' ? platform : platform?.category;

  if (!rawCategory?.trim()) {
    return DEFAULT_PLATFORM_CATEGORY;
  }

  const trimmedCategory = rawCategory.trim();
  const normalizedCategory = normalizeCategoryKey(trimmedCategory);
  const aliasedCategory = PLATFORM_CATEGORY_ALIASES[normalizedCategory];

  if (aliasedCategory) {
    return aliasedCategory;
  }

  const canonicalCategory = PLATFORM_CATEGORY_SUGGESTIONS.find(
    (suggestion) => normalizeCategoryKey(suggestion) === normalizedCategory
  );

  return canonicalCategory ?? trimmedCategory;
}

export function comparePlatformCategories(left: string, right: string): number {
  const leftCategory = getPlatformCategory(left);
  const rightCategory = getPlatformCategory(right);
  const leftPriority = CATEGORY_PRIORITY.get(normalizeCategoryKey(leftCategory));
  const rightPriority = CATEGORY_PRIORITY.get(normalizeCategoryKey(rightCategory));

  if (leftPriority != null && rightPriority != null) {
    return leftPriority - rightPriority;
  }

  if (leftPriority != null) {
    return -1;
  }

  if (rightPriority != null) {
    return 1;
  }

  return leftCategory.localeCompare(rightCategory, 'pt-BR');
}

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
