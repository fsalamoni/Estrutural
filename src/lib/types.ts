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
  email: 'bg-blue-900/50 text-blue-300 border-blue-700',
  google: 'bg-red-900/50 text-red-300 border-red-700',
  ambos: 'bg-purple-900/50 text-purple-300 border-purple-700',
  nenhum: 'bg-gray-800/50 text-gray-400 border-gray-600',
};
