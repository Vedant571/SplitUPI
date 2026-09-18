'use client';

import { CheckCircle2, AlertTriangle, Scale, Hash, Banknote } from 'lucide-react';
import { formatINR } from '@/lib/currency';

interface PaymentSummaryProps {
  totalBill: number;
  partsCount: number;
  totalSplitAmount: number;
  difference: number;
  isValid: boolean;
  statusMessage?: string;
  className?: string;
}

export default function PaymentSummary({
  totalBill,
  partsCount,
  totalSplitAmount,
  difference,
  isValid,
  statusMessage,
  className = '',
}: PaymentSummaryProps) {
  const diffAbs = Math.abs(difference);

  return (
    <div
      className={`rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-5 shadow-sm transition-all ${className}`}
    >
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-3.5 mb-4">
        <div className="flex items-center gap-2">
          <Scale className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Payment Summary
          </h3>
        </div>

        {/* Live Status Badge */}
        <div
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
            isValid
              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
              : difference < 0
              ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
              : 'bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
          }`}
        >
          {isValid ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>✓ Ready to Pay</span>
            </>
          ) : (
            <>
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>{statusMessage || (difference < 0 ? 'Under Total' : 'Over Total')}</span>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Total Bill */}
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-1">
            <Banknote className="w-3.5 h-3.5" />
            <span>Total Bill</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {formatINR(totalBill, true)}
          </div>
        </div>

        {/* Number of Payments */}
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-1">
            <Hash className="w-3.5 h-3.5" />
            <span>Payments</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {partsCount} {partsCount === 1 ? 'part' : 'parts'}
          </div>
        </div>

        {/* Total Split Amount */}
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span>Total Split Amount</span>
          </div>
          <div className={`text-lg font-bold ${isValid ? 'text-slate-900 dark:text-white' : 'text-rose-600 dark:text-rose-400'}`}>
            {formatINR(totalSplitAmount, true)}
          </div>
        </div>

        {/* Remaining / Difference */}
        <div className={`p-3 rounded-xl border ${
          isValid
            ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/40'
            : 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/50'
        }`}>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span>Remaining / Diff</span>
          </div>
          <div className={`text-lg font-bold ${
            isValid
              ? 'text-emerald-600 dark:text-emerald-400'
              : 'text-rose-600 dark:text-rose-400'
          }`}>
            {isValid ? '₹0.00' : `${difference > 0 ? '+' : '-'}${formatINR(diffAbs, true)}`}
          </div>
        </div>
      </div>
    </div>
  );
}
