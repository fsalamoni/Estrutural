'use client';

import { useEffect, useRef, useState } from 'react';

export type ToastType = 'success' | 'error';

interface ToastMessage {
  id: number;
  message: string;
  type: ToastType;
}

let toastId = 0;
let addToastFn: ((msg: string, type: ToastType) => void) | null = null;
const pendingToasts: Array<{ message: string; type: ToastType }> = [];

export function toast(message: string, type: ToastType = 'success') {
  if (addToastFn) {
    addToastFn(message, type);
    return;
  }

  pendingToasts.push({ message, type });
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const timeoutIdsRef = useRef<number[]>([]);

  useEffect(() => {
    const enqueueToast = (message: string, type: ToastType) => {
      const id = ++toastId;
      setToasts((prev) => [...prev, { id, message, type }]);

      const timeoutId = window.setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 3500);
      timeoutIdsRef.current.push(timeoutId);
    };

    addToastFn = enqueueToast;

    while (pendingToasts.length > 0) {
      const pendingToast = pendingToasts.shift();
      if (pendingToast) {
        enqueueToast(pendingToast.message, pendingToast.type);
      }
    }

    return () => {
      if (addToastFn === enqueueToast) {
        addToastFn = null;
      }

      timeoutIdsRef.current.forEach((timeoutId) => window.clearTimeout(timeoutId));
      timeoutIdsRef.current = [];
    };
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
          className={`flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-label
                      shadow-lg backdrop-blur-sm animate-slide-up whitespace-nowrap uppercase tracking-wider
            ${t.type === 'success'
              ? 'border-tertiary/30 bg-surface-container text-tertiary shadow-[0_0_12px_rgba(233,195,73,0.15)]'
              : 'border-error-container bg-error-container/20 text-error'
            }`}
        >
          <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
            {t.type === 'success' ? 'check_circle' : 'error'}
          </span>
          {t.message}
        </div>
      ))}
    </div>
  );
}
