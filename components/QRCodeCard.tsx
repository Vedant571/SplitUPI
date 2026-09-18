'use client';

import { useState, useEffect } from 'react';
import { generateUpiUri, generateQrDataUrl, triggerUpiIntent, isMobileDevice } from '@/lib/upi';
import { formatINR } from '@/lib/currency';
import { downloadBrandedQrCard } from '@/lib/qrExport';
import Disclaimer from './Disclaimer';
import {
  ExternalLink,
  Copy,
  Check,
  Download,
  Share2,
  Smartphone,
  Loader2,
} from 'lucide-react';

interface QRCodeCardProps {
  partNumber: number;
  totalParts: number;
  amount: number;
  recipientName: string;
  upiId: string;
  onToast: (message: string, type?: 'success' | 'info' | 'error') => void;
}

export default function QRCodeCard({
  partNumber,
  totalParts,
  amount,
  recipientName,
  upiId,
  onToast,
}: QRCodeCardProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [copiedUri, setCopiedUri] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // Generate UPI URI
  const upiUri = generateUpiUri({
    upiId,
    recipientName,
    amount,
    transactionNote: `SplitUPI Payment ${partNumber} of ${totalParts}`,
  });

  // Generate QR Code data URL
  useEffect(() => {
    let active = true;
    generateQrDataUrl(upiUri, 380).then((url) => {
      if (active) setQrDataUrl(url);
    });
    return () => {
      active = false;
    };
  }, [upiUri]);

  const handleCopyUpiId = async () => {
    try {
      await navigator.clipboard.writeText(upiId);
      setCopiedUpi(true);
      onToast(`UPI ID copied: ${upiId}`, 'success');
      setTimeout(() => setCopiedUpi(false), 2000);
    } catch {
      onToast('Unable to copy UPI ID to clipboard', 'error');
    }
  };

  const handleCopyUri = async () => {
    try {
      await navigator.clipboard.writeText(upiUri);
      setCopiedUri(true);
      onToast('UPI Payment URI copied', 'success');
      setTimeout(() => setCopiedUri(false), 2000);
    } catch {
      onToast('Unable to copy URI', 'error');
    }
  };

  const handleOpenUpiApp = () => {
    const isMobile = isMobileDevice();
    const result = triggerUpiIntent(upiUri);
    if (result.success) {
      onToast(result.message, 'info');
    } else {
      if (!isMobile) {
        onToast(
          'UPI intent links require a mobile device with UPI apps installed. Scan the QR code above with your phone camera or payment app.',
          'info'
        );
      } else {
        onToast(result.message, 'error');
      }
    }
  };

  const handleDownload = async () => {
    if (!qrDataUrl) return;
    setIsDownloading(true);
    try {
      await downloadBrandedQrCard({
        partNumber,
        totalParts,
        amount,
        recipientName,
        upiId,
        qrDataUrl,
      });
      onToast(`Downloaded QR voucher for Part ${partNumber}`, 'success');
    } catch (e) {
      console.error(e);
      onToast('Failed to download QR code', 'error');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-lg shadow-slate-200/40 dark:shadow-none p-5 sm:p-6 flex flex-col justify-between transition-all hover:border-blue-400 dark:hover:border-slate-700">
      <div>
        {/* Header: Payment Part Badge & Part info */}
        <div className="flex items-center justify-between mb-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-cyan-400 border border-blue-200 dark:border-blue-900">
            Payment {partNumber} of {totalParts}
          </div>
          <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
            UPI INR
          </span>
        </div>

        {/* Amount */}
        <div className="text-center my-2">
          <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-950 dark:text-white">
            {formatINR(amount, true)}
          </div>
        </div>

        {/* QR Code Container - Always High Contrast White Background */}
        <div className="my-4 flex flex-col items-center justify-center">
          <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-inner flex items-center justify-center">
            {qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt={`UPI Payment QR Code for ₹${amount}`}
                className="w-52 h-52 sm:w-56 sm:h-56 object-contain select-none"
              />
            ) : (
              <div className="w-52 h-52 sm:w-56 sm:h-56 flex flex-col items-center justify-center text-slate-400 text-xs gap-2">
                <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                <span>Generating QR...</span>
              </div>
            )}
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 font-medium">
            Scan using Google Pay, PhonePe, Paytm, or BHIM
          </span>
        </div>

        {/* Recipient Details */}
        <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 p-3 mb-4 space-y-1 text-center">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Pay to: <span className="text-slate-900 dark:text-white font-bold">{recipientName}</span>
          </div>
          <div className="text-xs font-mono text-slate-700 dark:text-slate-300 break-all select-all">
            {upiId}
          </div>
        </div>

        {/* Payment Status Notice */}
        <Disclaimer variant="card-notice" className="mb-4" />

        {/**
         * ------------------------------------------------------------------
         * FUTURE EXTENSION PLACEHOLDER: PAYMENT VERIFICATION WEBHOOK
         * ------------------------------------------------------------------
         * In a production environment with a licensed Payment Aggregator (PA)
         * or UPI Merchant API (e.g., Razorpay, Cashfree, Decentro),
         * this card would listen to a WebSocket or polling endpoint:
         *
         * useEffect(() => {
         *   const socket = new WebSocket(`${PAYMENT_WS_URL}/status/${txId}`);
         *   socket.onmessage = (e) => setVerificationStatus(JSON.parse(e.data));
         * }, [txId]);
         * ------------------------------------------------------------------
         */}
      </div>

      {/* Action Buttons */}
      <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
        {/* Open in UPI App */}
        <button
          type="button"
          onClick={handleOpenUpiApp}
          id={`open-upi-btn-${partNumber}`}
          className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white text-xs font-bold shadow-sm shadow-blue-600/20 transition-all flex items-center justify-center gap-2"
        >
          <Smartphone className="w-4 h-4" />
          <span>Open in UPI App</span>
          <ExternalLink className="w-3.5 h-3.5 opacity-80" />
        </button>

        {/* Secondary Actions Grid */}
        <div className="grid grid-cols-2 gap-2">
          {/* Copy UPI ID */}
          <button
            type="button"
            onClick={handleCopyUpiId}
            id={`copy-upi-btn-${partNumber}`}
            className="py-2 px-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
            title="Copy UPI ID to clipboard"
          >
            {copiedUpi ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-emerald-600 dark:text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                <span>Copy UPI</span>
              </>
            )}
          </button>

          {/* Download QR */}
          <button
            type="button"
            onClick={handleDownload}
            disabled={isDownloading || !qrDataUrl}
            id={`download-qr-btn-${partNumber}`}
            className="py-2 px-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
            title="Download QR code image voucher"
          >
            {isDownloading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" />
            ) : (
              <Download className="w-3.5 h-3.5 text-slate-400" />
            )}
            <span>{isDownloading ? 'Saving...' : 'Download QR'}</span>
          </button>
        </div>

        {/* Copy URI Link */}
        <button
          type="button"
          onClick={handleCopyUri}
          className="w-full text-center text-[11px] font-medium text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-cyan-400 py-1 transition-colors flex items-center justify-center gap-1"
        >
          {copiedUri ? (
            <span className="text-emerald-600 dark:text-emerald-400">✓ UPI URI Copied</span>
          ) : (
            <>
              <Share2 className="w-3 h-3" />
              <span>Copy Payment URI (`upi://pay`)</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
