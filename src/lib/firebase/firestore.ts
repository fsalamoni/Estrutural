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
  getDocs,
} from 'firebase/firestore';
import { getDb } from './config';
import { deletePlatformIcon } from './storage';
import { getPlatformCategory, Platform, PlatformInput } from '../types';

const COLLECTION = 'platforms';
const CATEGORIES_COLLECTION = 'categories';

function docToPlatform(id: string, data: DocumentData): Platform {
  return {
    id,
    ...data,
    category: getPlatformCategory(typeof data.category === 'string' ? data.category : null),
  } as Platform;
}

function docToCategory(id: string, data: DocumentData): Category {
  return { id, ...data } as Category;
}

export function subscribePublicPlatforms(
  callback: (platforms: Platform[]) => void,
  onError?: (err: Error) => void
): () => void {
  const db = getDb();
  const q = query(
    collection(db, COLLECTION),
    where('visible', '==', true)
  ) as Query<DocumentData>;

  return onSnapshot(
    q,
    (snap) => callback(
      snap.docs
        .map((d) => docToPlatform(d.id, d.data()))
        .sort((left, right) => left.order - right.order)
    ),
    (err) => onError?.(err)
  );
}

export function subscribeAllPlatforms(
  callback: (platforms: Platform[]) => void,
  onError?: (err: Error) => void
): () => void {
  const db = getDb();
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
  const db = getDb();
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
  const db = getDb();
  await updateDoc(doc(db, COLLECTION, id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function deletePlatform(id: string, iconUrl?: string): Promise<void> {
  const db = getDb();
  await deleteDoc(doc(db, COLLECTION, id));
  if (iconUrl) await deletePlatformIcon(iconUrl);
}

export async function toggleVisibility(id: string, visible: boolean): Promise<void> {
  const db = getDb();
  await updateDoc(doc(db, COLLECTION, id), {
    visible,
    updatedAt: serverTimestamp(),
  });
}

export async function updateOrder(id: string, order: number): Promise<void> {
  const db = getDb();
  await updateDoc(doc(db, COLLECTION, id), { order });
}

export function subscribeCategories(
  callback: (categories: Category[]) => void,
  onError?: (err: Error) => void
): () => void {
  const q = query(
    collection(db, CATEGORIES_COLLECTION),
    orderBy('order', 'asc')
  ) as Query<DocumentData>;

  return onSnapshot(
    q,
    (snap) => callback(snap.docs.map((d) => docToCategory(d.id, d.data()))),
    (err) => onError?.(err)
  );
}

export async function createCategory(data: CategoryInput): Promise<string> {
  const ref = await addDoc(collection(db, CATEGORIES_COLLECTION), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateCategory(
  id: string,
  data: Partial<CategoryInput>
): Promise<void> {
  await updateDoc(doc(db, CATEGORIES_COLLECTION, id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteCategory(id: string): Promise<void> {
  const platformsUsingCategory = await getDocs(
    query(collection(db, COLLECTION), where('categoryId', '==', id))
  );
  if (!platformsUsingCategory.empty) {
    throw new Error(
      `Esta categoria está em uso por ${platformsUsingCategory.size} plataforma(s). Reatribua-as antes de excluir.`
    );
  }
  await deleteDoc(doc(db, CATEGORIES_COLLECTION, id));
}

export async function updateCategoryOrder(id: string, order: number): Promise<void> {
  await updateDoc(doc(db, CATEGORIES_COLLECTION, id), { order });
}
