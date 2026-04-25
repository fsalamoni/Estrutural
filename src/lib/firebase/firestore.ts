import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  serverTimestamp,
  Query,
  DocumentData,
} from 'firebase/firestore';
import { db } from './config';
import { Platform, PlatformInput } from '../types';

const COLLECTION = 'platforms';

function docToPlatform(id: string, data: DocumentData): Platform {
  return { id, ...data } as Platform;
}

export function subscribePublicPlatforms(
  callback: (platforms: Platform[]) => void,
  onError?: (err: Error) => void
): () => void {
  const q = query(
    collection(db, COLLECTION),
    where('visible', '==', true),
    orderBy('order', 'asc')
  ) as Query<DocumentData>;

  return onSnapshot(
    q,
    (snap) => callback(snap.docs.map((d) => docToPlatform(d.id, d.data()))),
    (err) => onError?.(err)
  );
}

export function subscribeAllPlatforms(
  callback: (platforms: Platform[]) => void,
  onError?: (err: Error) => void
): () => void {
  const q = query(
    collection(db, COLLECTION),
    orderBy('order', 'asc')
  ) as Query<DocumentData>;

  return onSnapshot(
    q,
    (snap) => callback(snap.docs.map((d) => docToPlatform(d.id, d.data()))),
    (err) => onError?.(err)
  );
}

export async function createPlatform(data: PlatformInput): Promise<string> {
  const ref = await addDoc(collection(db, COLLECTION), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updatePlatform(
  id: string,
  data: Partial<PlatformInput>
): Promise<void> {
  await updateDoc(doc(db, COLLECTION, id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function deletePlatform(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION, id));
}

export async function toggleVisibility(id: string, visible: boolean): Promise<void> {
  await updateDoc(doc(db, COLLECTION, id), {
    visible,
    updatedAt: serverTimestamp(),
  });
}

export async function updateOrder(id: string, order: number): Promise<void> {
  await updateDoc(doc(db, COLLECTION, id), { order });
}
