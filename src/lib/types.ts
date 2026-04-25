import { Timestamp } from 'firebase/firestore';

export interface Platform {
  id: string;
  name: string;
  description: string;
  accessUrl: string;
  iconUrl: string;
  authMethod: 'email' | 'google' | 'ambos' | 'nenhum';
  visible: boolean;
  order: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export type PlatformInput = Omit<Platform, 'id' | 'createdAt' | 'updatedAt'>;

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
