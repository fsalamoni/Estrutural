import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { getStorageService } from './config';

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

export async function uploadPlatformIcon(file: File, platformId: string): Promise<string> {
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
