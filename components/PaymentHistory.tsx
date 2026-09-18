'use client';

import { useState } from 'react';
import { HistoryItem } from '@/types/payment';
import HistoryCard from './HistoryCard';
import { X, History, Trash2, AlertTriangle } from 'lucide-react';

interface PaymentHistoryProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryItem[];
  onView: (item: HistoryItem) => void;
  onDelete: (id: string) => void;
  onClearAll: () => void;
}

export default function PaymentHistory({
  isOpen,
  onClose,
  history,
  onView,
  onDelete,
  onClearAll,
}: PaymentHistoryProps) {
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [confirmClearAll, setConfirmClearAll] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 flex items-center justify-center text-blue-600 dark:text-cyan-400">
              <History className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Split Payment History
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {history.length} saved {history.length === 1 ? 'split' : 'splits'} in local browser storage
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {history.length > 0 && (
              <button
                type="button"
                onClick={() => setConfirmClearAll(true)}
                className="px-3 py-1.5 rounded-xl border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 text-xs font-semibold hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Clear All</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-4">
          {/* Clear All Confirmation Banner */}
          {confirmClearAll && (
            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 flex flex-col sm:flex-row items-center justify-between gap-3 animate-in fade-in duration-150">
              <div className="flex items-center gap-2 text-xs text-rose-700 dark:text-rose-300">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>Are you sure you want to clear all history records?</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setConfirmClearAll(false)}
                  className="px-3 py-1 text-xs font-medium rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onClearAll();
                    setConfirmClearAll(false);
                  }}
                  className="px-3 py-1 text-xs font-semibold rounded-lg bg-rose-600 text-white hover:bg-rose-700"
                >
                  Yes, Clear All
                </button>
              </div>
            </div>
          )}

          {/* Delete Single Item Confirmation Banner */}
          {confirmDeleteId && (
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 flex flex-col sm:flex-row items-center justify-between gap-3 animate-in fade-in duration-150">
              <div className="flex items-center gap-2 text-xs text-amber-800 dark:text-amber-300">
                <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600" />
                <span>Delete this split payment record?</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setConfirmDeleteId(null)}
                  className="px-3 py-1 text-xs font-medium rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onDelete(confirmDeleteId);
                    setConfirmDeleteId(null);
                  }}
                  className="px-3 py-1 text-xs font-semibold rounded-lg bg-rose-600 text-white hover:bg-rose-700"
                >
                  Confirm Delete
                </button>
              </div>
            </div>
          )}

          {/* History List or Empty State */}
          {history.length === 0 ? (
            <div className="py-14 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
                <History className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                No Payment Splits Yet
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                Generate a bill split to see your recent transactions saved locally on this browser.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((item) => (
                <HistoryCard
                  key={item.id}
                  item={item}
                  onView={(it) => {
                    onView(it);
                    onClose();
                  }}
                  onDelete={(id) => setConfirmDeleteId(id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
