'use client';

import { PaymentSplitData } from '@/types/payment';
import { formatINR } from '@/lib/currency';
import QRCodeCard from './QRCodeCard';
import Disclaimer from './Disclaimer';
import { Printer, Download, Edit3, Plus } from 'lucide-react';

interface QRCodeGridProps {
  splitData: PaymentSplitData;
  onEditSplit: () => void;
  onNewSplit: () => void;
  onOpenBulkModal: () => void;
  onPrint: () => void;
  onToast: (message: string, type?: 'success' | 'info' | 'error') => void;
}

export default function QRCodeGrid({
  splitData,
  onEditSplit,
  onNewSplit,
  onOpenBulkModal,
  onPrint,
  onToast,
}: QRCodeGridProps) {
  const { recipientName, upiId, totalAmount, partsCount, parts } = splitData;

  return (
    <div className="space-y-6">
      {/* Top Toolbar */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-5 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 no-print">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Generated Payment Splits
            </h3>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-cyan-400 border border-blue-200 dark:border-blue-900">
              {partsCount} QR Codes
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Total {formatINR(totalAmount, true)} for {recipientName} ({upiId})
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <button
            type="button"
            onClick={onOpenBulkModal}
            id="download-all-btn"
            className="flex-1 md:flex-none px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm flex items-center justify-center gap-1.5 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download All QR Codes</span>
          </button>

          <button
            type="button"
            onClick={onPrint}
            id="print-sheet-btn"
            className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-200 text-xs font-semibold shadow-sm flex items-center justify-center gap-1.5 transition-all"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Sheet</span>
          </button>

          <button
            type="button"
            onClick={onEditSplit}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Split</span>
          </button>

          <button
            type="button"
            onClick={onNewSplit}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Split</span>
          </button>
        </div>
      </div>

      {/* Compliance Disclaimer Banner */}
      <Disclaimer variant="qr-banner" className="no-print" />

      {/* QR Codes Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {parts.map((part) => (
          <QRCodeCard
            key={part.id}
            partNumber={part.partNumber}
            totalParts={partsCount}
            amount={part.amount}
            recipientName={recipientName}
            upiId={upiId}
            onToast={onToast}
          />
        ))}
      </div>
    </div>
  );
}
