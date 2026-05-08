import { Timestamp } from 'firebase/firestore';

export interface Platform {
  id: string;
  name: string;
  description: string;
  category: string;
  accessUrl: string;
  iconUrl: string;
  authMethod: 'email' | 'google' | 'ambos' | 'nenhum';
  visible: boolean;
  order: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export type PlatformInput = Omit<Platform, 'id' | 'createdAt' | 'updatedAt'>;

export const PLATFORM_AUTH_METHODS = ['email', 'google', 'ambos', 'nenhum'] as const;

export const MAX_PLATFORM_NAME_LENGTH = 120;
export const MAX_PLATFORM_DESCRIPTION_LENGTH = 1000;
export const MAX_PLATFORM_URL_LENGTH = 2048;

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

function ensureString(value: unknown, fieldLabel: string) {
  if (typeof value !== 'string') {
    throw new Error(`${fieldLabel} inválido.`);
  }

  return value.trim();
}

function validateRequiredText(value: unknown, fieldLabel: string, maxLength: number) {
  const normalized = ensureString(value, fieldLabel);

  if (!normalized) {
    throw new Error(`${fieldLabel} é obrigatório.`);
  }

  if (normalized.length > maxLength) {
    throw new Error(`${fieldLabel} deve ter no máximo ${maxLength} caracteres.`);
  }

  return normalized;
}

function validateOptionalText(value: unknown, fieldLabel: string, maxLength: number) {
  if (value == null) {
    return '';
  }

  const normalized = ensureString(value, fieldLabel);

  if (normalized.length > maxLength) {
    throw new Error(`${fieldLabel} deve ter no máximo ${maxLength} caracteres.`);
  }

  return normalized;
}

function validateHttpsUrl(value: unknown, fieldLabel: string, allowEmpty = false) {
  if (value == null) {
    if (allowEmpty) {
      return '';
    }

    throw new Error(`${fieldLabel} é obrigatório.`);
  }

  const normalized = ensureString(value, fieldLabel);

  if (!normalized) {
    if (allowEmpty) {
      return '';
    }

    throw new Error(`${fieldLabel} é obrigatório.`);
  }

  if (normalized.length > MAX_PLATFORM_URL_LENGTH) {
    throw new Error(`${fieldLabel} deve ter no máximo ${MAX_PLATFORM_URL_LENGTH} caracteres.`);
  }

  let parsedUrl: URL;

  try {
    parsedUrl = new URL(normalized);
  } catch {
    throw new Error(`${fieldLabel} deve ser uma URL válida.`);
  }

  if (parsedUrl.protocol !== 'https:') {
    throw new Error(`${fieldLabel} deve usar HTTPS.`);
  }

  return parsedUrl.toString();
}

function validateAuthMethod(value: unknown): Platform['authMethod'] {
  if (typeof value === 'string' && PLATFORM_AUTH_METHODS.includes(value as Platform['authMethod'])) {
    return value as Platform['authMethod'];
  }

  throw new Error('Método de acesso inválido.');
}

function validateOrder(value: unknown) {
  if (typeof value !== 'number' || !Number.isInteger(value) || value < 0) {
    throw new Error('Ordem inválida.');
  }

  return value;
}

function validateVisible(value: unknown) {
  if (typeof value !== 'boolean') {
    throw new Error('Visibilidade inválida.');
  }

  return value;
}

export function sanitizePlatformInput(input: PlatformInput): PlatformInput {
  return {
    name: validateRequiredText(input.name, 'Nome', MAX_PLATFORM_NAME_LENGTH),
    description: validateOptionalText(input.description, 'Descrição', MAX_PLATFORM_DESCRIPTION_LENGTH),
    category: getPlatformCategory(validateOptionalText(input.category, 'Categoria', MAX_PLATFORM_NAME_LENGTH)),
    accessUrl: validateHttpsUrl(input.accessUrl, 'URL de acesso'),
    iconUrl: validateHttpsUrl(input.iconUrl, 'URL do ícone', true),
    authMethod: validateAuthMethod(input.authMethod),
    visible: validateVisible(input.visible),
    order: validateOrder(input.order),
  };
}

export function sanitizePlatformPatch(input: Partial<PlatformInput>): Partial<PlatformInput> {
  const patch: Partial<PlatformInput> = {};

  if ('name' in input) {
    patch.name = validateRequiredText(input.name, 'Nome', MAX_PLATFORM_NAME_LENGTH);
  }

  if ('description' in input) {
    patch.description = validateOptionalText(input.description, 'Descrição', MAX_PLATFORM_DESCRIPTION_LENGTH);
  }

  if ('category' in input) {
    patch.category = getPlatformCategory(validateOptionalText(input.category, 'Categoria', MAX_PLATFORM_NAME_LENGTH));
  }

  if ('accessUrl' in input) {
    patch.accessUrl = validateHttpsUrl(input.accessUrl, 'URL de acesso');
  }

  if ('iconUrl' in input) {
    patch.iconUrl = validateHttpsUrl(input.iconUrl, 'URL do ícone', true);
  }

  if ('authMethod' in input) {
    patch.authMethod = validateAuthMethod(input.authMethod);
  }

  if ('visible' in input) {
    patch.visible = validateVisible(input.visible);
  }

  if ('order' in input) {
    patch.order = validateOrder(input.order);
  }

  return patch;
}
