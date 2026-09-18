'use client';

import { useState, useEffect } from 'react';
import { PaymentSplitData } from '@/types/payment';
import { formatINR } from '@/lib/currency';
import { generateUpiUri, generateQrDataUrl } from '@/lib/upi';
import { X, Printer, QrCode } from 'lucide-react';

interface BulkDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  splitData: PaymentSplitData;
  onPrint: () => void;
}

interface PartWithQr {
  partNumber: number;
  amount: number;
  qrUrl: string;
}

export default function BulkDownloadModal({
  isOpen,
  onClose,
  splitData,
  onPrint,
}: BulkDownloadModalProps) {
  const [partsWithQr, setPartsWithQr] = useState<PartWithQr[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isOpen) return;

    setLoading(true);
    const promises = splitData.parts.map(async (part) => {
      const uri = generateUpiUri({
        upiId: splitData.upiId,
        recipientName: splitData.recipientName,
        amount: part.amount,
        transactionNote: `SplitUPI ${part.partNumber} of ${splitData.partsCount}`,
      });
      const qrUrl = await generateQrDataUrl(uri, 300);
      return {
        partNumber: part.partNumber,
        amount: part.amount,
        qrUrl,
      };
    });

    Promise.all(promises).then((results) => {
      setPartsWithQr(results);
      setLoading(false);
    });
  }, [isOpen, splitData]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 w-full max-w-4xl rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header - Hidden on Print */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between no-print">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <QrCode className="w-5 h-5 text-blue-600 dark:text-cyan-400" />
              <span>All-In-One Payment Vouchers Sheet</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Print or save as PDF. Ready for physical display or digital distribution.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onPrint}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Content Body */}
        <div id="printable-area" className="p-6 sm:p-8 overflow-y-auto space-y-6 bg-slate-50/50 dark:bg-slate-950/50">
          {/* Document Header */}
          <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 text-center space-y-2 qr-print-card">
            <div className="inline-flex items-center gap-2 text-blue-600 dark:text-cyan-400 font-extrabold text-xl">
              <QrCode className="w-6 h-6" />
              <span>SplitUPI</span>
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              UPI Split Payment Sheet
            </h2>
            <div className="text-xs text-slate-500 dark:text-slate-400 space-y-0.5">
              <div>Recipient: <span className="font-semibold text-slate-800 dark:text-slate-200">{splitData.recipientName}</span></div>
              <div>UPI ID: <span className="font-mono text-slate-700 dark:text-slate-300">{splitData.upiId}</span></div>
              <div>
                Total Bill: <span className="font-bold text-slate-900 dark:text-white">{formatINR(splitData.totalAmount, true)}</span> ({splitData.partsCount} payments)
              </div>
            </div>
          </div>

          {/* Vouchers Grid */}
          {loading ? (
            <div className="py-20 text-center text-slate-400 text-sm">
              Rendering QR codes for print...
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {partsWithQr.map((item) => (
                <div
                  key={item.partNumber}
                  className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 flex flex-col items-center text-center qr-print-card shadow-sm"
                >
                  <div className="text-[11px] font-bold text-blue-600 dark:text-cyan-400 uppercase tracking-wider mb-1">
                    Payment {item.partNumber} of {splitData.partsCount}
                  </div>

                  <div className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2">
                    {formatINR(item.amount, true)}
                  </div>

                  {/* High contrast QR box */}
                  <div className="p-2 rounded-xl bg-white border border-slate-200 mb-2">
                    <img
                      src={item.qrUrl}
                      alt={`QR Part ${item.partNumber}`}
                      className="w-40 h-40 object-contain"
                    />
                  </div>

                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    Scan with GPay / PhonePe / Paytm
                  </div>
                  <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 font-mono break-all">
                    {splitData.upiId}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Compliance notice footer */}
          <div className="text-[11px] text-slate-400 dark:text-slate-500 text-center leading-relaxed border-t border-slate-200 dark:border-slate-800 pt-4">
            Payment status cannot be automatically verified. SplitUPI is a payment-splitting utility and does not process funds.
            Users are responsible for applicable taxes, merchant invoices, and UPI terms.
          </div>
        </div>
      </div>
    </div>
  );
}
