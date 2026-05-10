'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import {
  getFirebaseAuth,
  getFirebaseConfigurationError,
} from '@/lib/firebase/config';
import {
  getAdminConfigurationError,
  isAdmin,
  signInWithEmail,
  signInWithGoogle,
  signOut,
} from '@/lib/firebase/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdminUser: boolean;
  configError: string | null;
  signInWithEmail: (email: string, password: string) => Promise<User>;
  signInWithGoogle: () => Promise<User>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

function getAuthConfigurationError(): string | null {
  return getFirebaseConfigurationError() ?? getAdminConfigurationError();
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const configurationError = getAuthConfigurationError();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(() => configurationError == null);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    if (configurationError) {
      return;
    }

    const unsubscribe = onAuthStateChanged(
      getFirebaseAuth(),
      (u) => {
        setUser(u);
        setAuthError(null);
        setLoading(false);
      },
      () => {
        setAuthError('Falha ao inicializar a autenticacao do Firebase.');
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [configurationError]);

  const configError = configurationError ?? authError;

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAdminUser: isAdmin(user),
        configError,
        signInWithEmail,
        signInWithGoogle,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
