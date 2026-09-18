'use client';

import { ShieldCheck } from 'lucide-react';
import Disclaimer from './Disclaimer';

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-200 dark:border-slate-800/80 bg-white/40 dark:bg-slate-950/40 py-10 px-4 sm:px-6 no-print transition-colors">
      <div className="max-w-4xl mx-auto flex flex-col items-center gap-6">
        <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-semibold text-sm">
          <div className="w-5 h-5 rounded-md bg-blue-600 flex items-center justify-center text-white text-[10px]">₹</div>
          <span>SplitUPI Payment Utility</span>
        </div>

        <Disclaimer variant="footer" className="max-w-2xl text-center" />

        <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Zero Credentials Stored</span>
          </div>
          <span>•</span>
          <span>Standards-Compliant UPI URIs</span>
          <span>•</span>
          <div className="flex items-center gap-1">
            <span>Built with modern React & Next.js</span>
          </div>
        </div>

        <p className="text-[11px] text-slate-400 dark:text-slate-600">
          © {new Date().getFullYear()} SplitUPI. Designed for legitimate bill-splitting and partial payments.
        </p>
      </div>
    </footer>
  );
}
