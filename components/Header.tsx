'use client';

import { QrCode, History, Sparkles } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

interface HeaderProps {
  historyCount: number;
  onOpenHistory: () => void;
  onNewSplit: () => void;
}

export default function Header({ historyCount, onOpenHistory, onNewSplit }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-[#0b0f17]/80 backdrop-blur-md no-print transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <div
          onClick={onNewSplit}
          className="flex items-center gap-2.5 cursor-pointer select-none group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <QrCode className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white">
                Split<span className="text-blue-600 dark:text-cyan-400">UPI</span>
              </span>
              <span className="text-[10px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-cyan-300 border border-blue-200 dark:border-blue-800/60">
                MVP
              </span>
            </div>
          </div>
        </div>

        {/* Right navigation actions */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <button
            onClick={onNewSplit}
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-cyan-400 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>New Split</span>
          </button>

          <button
            onClick={onOpenHistory}
            id="history-btn"
            aria-label="View split payment history"
            className="inline-flex items-center gap-2 text-xs font-medium px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all shadow-sm"
          >
            <History className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
            <span>History</span>
            {historyCount > 0 && (
              <span className="px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-blue-600 text-white min-w-4 text-center">
                {historyCount}
              </span>
            )}
          </button>

          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
