'use client';

import { HistoryItem } from '@/types/payment';
import { formatINR } from '@/lib/currency';
import { Trash2, ArrowUpRight, Calendar } from 'lucide-react';

interface HistoryCardProps {
  item: HistoryItem;
  onView: (item: HistoryItem) => void;
  onDelete: (id: string) => void;
}

export default function HistoryCard({ item, onView, onDelete }: HistoryCardProps) {
  const formattedDate = new Date(item.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm hover:border-blue-400 dark:hover:border-slate-700 transition-all flex flex-col justify-between gap-3">
      <div>
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">
              {item.recipientName}
            </h4>
            <div className="text-xs font-mono text-slate-500 dark:text-slate-400">
              {item.upiId}
            </div>
          </div>
          <div className="text-right">
            <div className="text-base font-extrabold text-blue-600 dark:text-cyan-400">
              {formatINR(item.totalAmount, true)}
            </div>
            <div className="text-[11px] text-slate-400 dark:text-slate-500">
              {item.partsCount} payments
            </div>
          </div>
        </div>

        {/* Split pills preview */}
        <div className="flex flex-wrap gap-1.5 my-2">
          {item.splitAmounts.map((amt, idx) => (
            <span
              key={idx}
              className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium"
            >
              #{idx + 1}: {formatINR(amt, false)}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-1 text-[11px] text-slate-400 dark:text-slate-500 mt-1">
          <Calendar className="w-3 h-3" />
          <span>{formattedDate}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/80">
        <button
          type="button"
          onClick={() => onDelete(item.id)}
          className="text-xs font-medium text-rose-500 hover:text-rose-600 dark:hover:text-rose-400 p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors flex items-center gap-1"
          title="Delete this history entry"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Delete</span>
        </button>

        <button
          type="button"
          onClick={() => onView(item)}
          className="text-xs font-semibold text-blue-600 dark:text-cyan-400 hover:text-blue-700 dark:hover:text-cyan-300 px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 transition-colors flex items-center gap-1"
        >
          <span>View Split</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
