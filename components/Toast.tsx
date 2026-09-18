'use client';

import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  text: string;
  type?: 'success' | 'info' | 'error';
}

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export default function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full px-4 sm:px-0 pointer-events-none no-print">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-start justify-between gap-3 p-3.5 rounded-2xl border shadow-xl text-xs font-semibold backdrop-blur-md animate-in slide-in-from-bottom-3 duration-200 ${
            toast.type === 'error'
              ? 'bg-rose-950/90 text-white border-rose-800'
              : toast.type === 'success'
              ? 'bg-slate-900/90 dark:bg-slate-800/90 text-white border-slate-700'
              : 'bg-blue-950/90 text-white border-blue-800'
          }`}
        >
          <div className="flex items-start gap-2">
            {toast.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            ) : toast.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            )}
            <span className="leading-snug">{toast.text}</span>
          </div>

          <button
            onClick={() => onDismiss(toast.id)}
            className="text-white/60 hover:text-white shrink-0 p-0.5"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}
