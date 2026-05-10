import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  User,
} from 'firebase/auth';
import { getFirebaseAuth } from './config';

const googleProvider = new GoogleAuthProvider();

function getConfiguredAdminEmail(): string | null {
  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL?.trim().toLowerCase();

  return adminEmail ? adminEmail : null;
}

export function getAdminConfigurationError(): string | null {
  return getConfiguredAdminEmail() ? null : 'Admin nao configurado no ambiente atual. Campo ausente: NEXT_PUBLIC_ADMIN_EMAIL.';
}

export async function signInWithEmail(email: string, password: string): Promise<User> {
  const result = await signInWithEmailAndPassword(getFirebaseAuth(), email, password);
  return result.user;
}

export async function signInWithGoogle(): Promise<User> {
  const result = await signInWithPopup(getFirebaseAuth(), googleProvider);
  return result.user;
}

export async function signOut(): Promise<void> {
  await firebaseSignOut(getFirebaseAuth());
}

export function isAdmin(user: Pick<User, 'email'> | null): boolean {
  const adminEmail = getConfiguredAdminEmail();

  return Boolean(adminEmail && typeof user?.email === 'string' && user.email.toLowerCase() === adminEmail);
}
