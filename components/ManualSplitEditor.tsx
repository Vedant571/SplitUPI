'use client';

import { SplitPart } from '@/types/payment';
import { formatINR } from '@/lib/currency';
import { Sparkles } from 'lucide-react';

interface ManualSplitEditorProps {
  parts: SplitPart[];
  onChangeAmount: (index: number, newAmount: number) => void;
  onAutoBalance: () => void;
  requiredTotal: number;
}

export default function ManualSplitEditor({
  parts,
  onChangeAmount,
  onAutoBalance,
  requiredTotal,
}: ManualSplitEditorProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
            Custom Payment Amounts
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Edit individual payment parts. They must sum exactly to {formatINR(requiredTotal, true)}.
          </p>
        </div>

        <button
          type="button"
          onClick={onAutoBalance}
          title="Adjust the last payment part to make the sum match exactly"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-cyan-300 border border-blue-200 dark:border-blue-900 hover:bg-blue-100 dark:hover:bg-blue-900/60 transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Auto-Balance Last Part</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {parts.map((part, index) => (
          <div
            key={part.id || index}
            className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm flex flex-col gap-2 focus-within:border-blue-500 dark:focus-within:border-cyan-500 transition-all"
          >
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
              <span className="uppercase tracking-wider">Payment #{index + 1}</span>
              <span className="text-[11px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                Part {index + 1} of {parts.length}
              </span>
            </div>

            <div className="relative flex items-center">
              <span className="absolute left-3 text-slate-400 dark:text-slate-500 font-medium text-sm">
                ₹
              </span>
              <input
                type="number"
                step="any"
                min="0.01"
                id={`manual-amount-${index + 1}`}
                value={part.amount === 0 ? '' : part.amount}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  onChangeAmount(index, isNaN(val) ? 0 : Number(val.toFixed(2)));
                }}
                className="w-full pl-7 pr-3 py-2 text-base font-bold rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/60 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-cyan-400 transition-all"
                placeholder="0.00"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
