import { FirebaseApp, getApp, getApps, initializeApp } from 'firebase/app';
import { Auth, getAuth } from 'firebase/auth';
import { Firestore, getFirestore } from 'firebase/firestore';
import { FirebaseStorage, getStorage } from 'firebase/storage';

const firebaseConfigEntries = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
} as const;

const firebaseConfig = { ...firebaseConfigEntries };

const missingFirebaseConfigKeys = Object.entries(firebaseConfigEntries)
  .filter(([, value]) => typeof value !== 'string' || value.length === 0)
  .map(([key]) => key);

export const isFirebaseConfigured = missingFirebaseConfigKeys.length === 0;

export function getFirebaseConfigurationError(): string | null {
  if (isFirebaseConfigured) {
    return null;
  }

  return `Firebase nao configurado no ambiente atual. Campos ausentes: ${missingFirebaseConfigKeys.join(', ')}.`;
}

function assertFirebaseConfigured(): void {
  const configurationError = getFirebaseConfigurationError();

  if (configurationError) {
    throw new Error(configurationError);
  }
}

export function getFirebaseApp(): FirebaseApp {
  assertFirebaseConfigured();
  return getApps().length ? getApp() : initializeApp(firebaseConfig);
}

export function getFirebaseAuth(): Auth {
  return getAuth(getFirebaseApp());
}

export function getDb(): Firestore {
  return getFirestore(getFirebaseApp());
}

export function getStorageService(): FirebaseStorage {
  return getStorage(getFirebaseApp());
}

export default getFirebaseApp;
