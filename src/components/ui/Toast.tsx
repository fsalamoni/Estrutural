'use client';

import { useEffect, useState } from 'react';

export type ToastType = 'success' | 'error';

interface ToastMessage {
  id: number;
  message: string;
  type: ToastType;
}

let toastId = 0;
let addToastFn: ((msg: string, type: ToastType) => void) | null = null;

export function toast(message: string, type: ToastType = 'success') {
  addToastFn?.(message, type);
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    addToastFn = (message, type) => {
      const id = ++toastId;
      setToasts((prev) => [...prev, { id, message, type }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 3500);
    };
    return () => { addToastFn = null; };
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      className="fixed bottom-20 left-1/2 z-50 flex -translate-x-1/2 flex-col gap-2"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          role="status"
          className={`flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium
                      shadow-lg backdrop-blur-sm animate-slide-up whitespace-nowrap
            ${t.type === 'success'
              ? 'border-green-800 bg-green-900/80 text-green-300'
              : 'border-red-800 bg-red-900/80 text-red-300'
            }`}
        >
          <span aria-hidden="true">{t.type === 'success' ? '✓' : '✕'}</span>
          {t.message}
        </div>
      ))}
    </div>
  );
}
