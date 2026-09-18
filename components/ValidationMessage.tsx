'use client';

import { AlertCircle } from 'lucide-react';

interface ValidationMessageProps {
  error?: string | null;
  className?: string;
}

export default function ValidationMessage({ error, className = '' }: ValidationMessageProps) {
  if (!error) return null;

  return (
    <div
      role="alert"
      className={`flex items-center gap-1.5 text-xs font-medium text-rose-500 dark:text-rose-400 mt-1.5 animate-in fade-in-50 duration-150 ${className}`}
    >
      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
      <span>{error}</span>
    </div>
  );
}
