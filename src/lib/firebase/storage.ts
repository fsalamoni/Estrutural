import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from './config';

export async function uploadPlatformIcon(file: File, platformId: string): Promise<string> {
  const ext = file.name.split('.').pop() ?? 'png';
  const storageRef = ref(storage, `platform-icons/${platformId}.${ext}`);
  await uploadBytes(storageRef, file, { contentType: file.type });
  return await getDownloadURL(storageRef);
}

export async function deletePlatformIcon(iconUrl: string): Promise<void> {
  try {
    const storageRef = ref(storage, iconUrl);
    await deleteObject(storageRef);
  } catch {
    // Icon may not exist in Storage (external URL), silently ignore
  }
}
