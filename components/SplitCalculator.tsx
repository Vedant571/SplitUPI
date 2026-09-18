'use client';

import { SplitMode, SplitPart, SplitValidationStatus } from '@/types/payment';
import { formatINR } from '@/lib/currency';
import ManualSplitEditor from './ManualSplitEditor';
import { Sparkles, SlidersHorizontal, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';

interface SplitCalculatorProps {
  totalBill: number;
  partsCount: number;
  splitMode: SplitMode;
  onSplitModeChange: (mode: SplitMode) => void;
  parts: SplitPart[];
  onChangePartAmount: (index: number, newAmount: number) => void;
  onAutoBalance: () => void;
  validationStatus: SplitValidationStatus;
  onGenerateQr: () => void;
  onReset: () => void;
}

export default function SplitCalculator({
  totalBill,
  partsCount,
  splitMode,
  onSplitModeChange,
  parts,
  onChangePartAmount,
  onAutoBalance,
  validationStatus,
  onGenerateQr,
  onReset,
}: SplitCalculatorProps) {
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-6 shadow-md transition-all space-y-6">
      {/* Mode Switcher Tabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Choose Split Method
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Total bill of {formatINR(totalBill, true)} divided into {partsCount} payments
          </p>
        </div>

        <div className="inline-flex p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 w-full sm:w-auto">
          <button
            type="button"
            id="tab-auto-split"
            onClick={() => onSplitModeChange('auto')}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              splitMode === 'auto'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-cyan-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Automatic Split</span>
          </button>

          <button
            type="button"
            id="tab-manual-split"
            onClick={() => onSplitModeChange('manual')}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              splitMode === 'manual'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-cyan-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Manual Split</span>
          </button>
        </div>
      </div>

      {/* Auto Split View */}
      {splitMode === 'auto' ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {parts.map((part) => (
              <div
                key={part.id}
                className="p-4 rounded-xl border border-blue-100 dark:border-blue-950 bg-gradient-to-b from-blue-50/50 to-transparent dark:from-blue-950/20 dark:to-transparent flex flex-col justify-between"
              >
                <div className="text-[11px] font-bold text-blue-600 dark:text-cyan-400 uppercase tracking-wider mb-1">
                  Payment #{part.partNumber}
                </div>
                <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
                  {formatINR(part.amount, true)}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
                  Part {part.partNumber} of {partsCount}
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 p-3 rounded-xl border border-emerald-200 dark:border-emerald-900/40">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>
              All {partsCount} parts automatically balanced to equal exactly {formatINR(totalBill, true)}.
            </span>
          </div>
        </div>
      ) : (
        /* Manual Split View */
        <ManualSplitEditor
          parts={parts}
          onChangeAmount={onChangePartAmount}
          onAutoBalance={onAutoBalance}
          requiredTotal={totalBill}
        />
      )}

      {/* Live Validation Bar */}
      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-4 text-slate-600 dark:text-slate-300">
          <div>
            Total Entered: <span className="font-bold text-slate-900 dark:text-white">{formatINR(validationStatus.totalEntered, true)}</span>
          </div>
          <div>
            Required: <span className="font-bold text-slate-900 dark:text-white">{formatINR(validationStatus.requiredTotal, true)}</span>
          </div>
          <div>
            Difference: <span className={`font-bold ${validationStatus.isValid ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
              {formatINR(Math.abs(validationStatus.difference), true)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 font-semibold">
          {validationStatus.isValid ? (
            <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>✓ Valid Split</span>
            </span>
          ) : (
            <span className="text-rose-500 dark:text-rose-400 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              <span>{validationStatus.statusMessage}</span>
            </span>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <button
          type="button"
          onClick={onReset}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          Edit Bill Details
        </button>

        <button
          type="button"
          id="generate-qr-btn"
          onClick={onGenerateQr}
          disabled={!validationStatus.isValid}
          className={`w-full sm:w-auto px-7 py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-md ${
            validationStatus.isValid
              ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/25 cursor-pointer hover:-translate-y-0.5'
              : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed shadow-none'
          }`}
        >
          <span>Generate Payment QR Codes</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
