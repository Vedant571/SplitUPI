'use client';

import { ArrowDown, History, Sparkles, CreditCard, Sliders, QrCode } from 'lucide-react';

interface HeroSectionProps {
  onStartSplit: () => void;
  onOpenHistory: () => void;
}

export default function HeroSection({ onStartSplit, onOpenHistory }: HeroSectionProps) {
  return (
    <section className="pt-10 pb-12 sm:pt-16 sm:pb-16 text-center max-w-4xl mx-auto px-4">
      {/* Pill badge */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-blue-200 dark:border-blue-900/60 bg-blue-50/70 dark:bg-blue-950/40 text-blue-700 dark:text-cyan-300 text-xs font-semibold mb-6 shadow-sm">
        <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400" />
        <span>UPI Bill-Splitting & Partial-Payment Generator</span>
      </div>

      {/* Main Headline */}
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-950 dark:text-white leading-[1.15] mb-5">
        Split a Bill. <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400 bg-clip-text text-transparent">Pay with UPI.</span>
      </h1>

      {/* Subtitle */}
      <p className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-8 font-normal leading-relaxed">
        Create multiple UPI payment QR codes for splitting bills and making partial payments.
      </p>

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-14">
        <button
          onClick={onStartSplit}
          id="hero-create-split-btn"
          className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2"
        >
          <span>Create Payment Split</span>
          <ArrowDown className="w-4 h-4" />
        </button>

        <button
          onClick={onOpenHistory}
          id="hero-view-history-btn"
          className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white/70 dark:bg-slate-900/70 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-sm shadow-sm transition-all flex items-center justify-center gap-2"
        >
          <History className="w-4 h-4 text-slate-500 dark:text-slate-400" />
          <span>View History</span>
        </button>
      </div>

      {/* 3-Step Process Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
        {/* Step 1 */}
        <div className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/60 dark:bg-slate-900/50 backdrop-blur-sm shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 flex items-center justify-center text-blue-600 dark:text-cyan-400 mb-3.5">
            <CreditCard className="w-5 h-5" />
          </div>
          <div className="text-xs font-bold text-blue-600 dark:text-cyan-400 uppercase tracking-wider mb-1">
            Step 1
          </div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white mb-1.5">
            Enter payment details
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Enter the recipient UPI ID, name, bill amount, and number of payments.
          </p>
        </div>

        {/* Step 2 */}
        <div className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/60 dark:bg-slate-900/50 backdrop-blur-sm shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 border border-cyan-200 dark:border-cyan-900 flex items-center justify-center text-cyan-600 dark:text-cyan-400 mb-3.5">
            <Sliders className="w-5 h-5" />
          </div>
          <div className="text-xs font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider mb-1">
            Step 2
          </div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white mb-1.5">
            Choose your split
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Automatically split the amount or manually customize each payment.
          </p>
        </div>

        {/* Step 3 */}
        <div className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/60 dark:bg-slate-900/50 backdrop-blur-sm shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-3.5">
            <QrCode className="w-5 h-5" />
          </div>
          <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-1">
            Step 3
          </div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white mb-1.5">
            Scan and pay
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Generate individual UPI QR codes and open them in supported UPI apps.
          </p>
        </div>
      </div>
    </section>
  );
}
