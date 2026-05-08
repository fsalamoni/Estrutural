import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { getStorageService } from './config';

export const MAX_PLATFORM_ICON_SIZE_BYTES = 5 * 1024 * 1024;

export const ALLOWED_PLATFORM_ICON_TYPES = [
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/svg+xml',
  'image/gif',
  'image/avif',
  'image/x-icon',
  'image/vnd.microsoft.icon',
] as const;

export function isFirebaseStorageUrl(url: string): boolean {
  return url.includes('firebasestorage.googleapis.com');
}

function storageRefFromUrl(url: string) {
  const storage = getStorageService();
  // Parse path from Firebase Storage HTTPS URL:
  // https://firebasestorage.googleapis.com/v0/b/BUCKET/o/path%2Fto%2Ffile?token=...
  const pathEncoded = url.split('/o/')[1]?.split('?')[0];
  if (!pathEncoded) throw new Error('URL do Storage inválida');
  return ref(storage, decodeURIComponent(pathEncoded));
}

export function validatePlatformIconFile(file: File): void {
  if (!ALLOWED_PLATFORM_ICON_TYPES.includes(file.type as (typeof ALLOWED_PLATFORM_ICON_TYPES)[number])) {
    throw new Error('O ícone deve ser uma imagem PNG, JPEG, WEBP, SVG, GIF, AVIF ou ICO.');
  }

  if (file.size > MAX_PLATFORM_ICON_SIZE_BYTES) {
    throw new Error('O ícone deve ter no máximo 5 MB.');
  }
}

export async function uploadPlatformIcon(file: File, platformId: string): Promise<string> {
  validatePlatformIconFile(file);

  const storage = getStorageService();
  const ext = file.name.split('.').pop()?.toLowerCase() ?? 'png';
  const path = `platform-icons/${platformId}.${ext}`;
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file, { contentType: file.type });
  return await getDownloadURL(storageRef);
}

export async function deletePlatformIcon(iconUrl: string): Promise<void> {
  if (!iconUrl || !isFirebaseStorageUrl(iconUrl)) return;
  try {
    await deleteObject(storageRefFromUrl(iconUrl));
  } catch {
    // File may have already been deleted or path changed — safe to ignore
  }
}
