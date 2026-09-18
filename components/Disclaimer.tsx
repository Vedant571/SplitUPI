'use client';

import { ShieldAlert, Info } from 'lucide-react';

interface DisclaimerProps {
  variant?: 'qr-banner' | 'footer' | 'card-notice';
  className?: string;
}

export default function Disclaimer({ variant = 'qr-banner', className = '' }: DisclaimerProps) {
  if (variant === 'qr-banner') {
    return (
      <div
        className={`rounded-xl border border-amber-200/70 bg-amber-50/80 p-3.5 text-xs text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/20 dark:text-amber-300 flex items-start gap-2.5 ${className}`}
      >
        <ShieldAlert className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
        <div className="leading-relaxed">
          <span className="font-semibold">Important Notice:</span> Generating multiple QR codes does not change the underlying value or nature of a sale. Use this tool only for legitimate bill splitting or partial-payment purposes. Users remain responsible for applicable taxes, merchant rules, invoices, and payment-provider terms.
        </div>
      </div>
    );
  }

  if (variant === 'card-notice') {
    return (
      <div className={`flex items-center justify-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 py-1 px-2 rounded-md bg-slate-100/80 dark:bg-slate-800/80 ${className}`}>
        <Info className="w-3 h-3 text-slate-400 dark:text-slate-500 shrink-0" />
        <span>Payment status cannot be automatically verified</span>
      </div>
    );
  }

  return (
    <p className={`text-xs text-slate-500 dark:text-slate-400 leading-relaxed text-center ${className}`}>
      SplitUPI is a payment-splitting utility. It does not process or hold funds and does not verify UPI payments in the MVP. Users are responsible for applicable taxes, invoices, merchant requirements, and payment-provider terms.
    </p>
  );
}
