'use client';

import { useState, useEffect, useRef } from 'react';
import {
  PaymentFormValues,
  PaymentSplitData,
  SplitMode,
  SplitPart,
  SplitValidationStatus,
  HistoryItem,
} from '@/types/payment';
import { calculateAutoSplit, autoBalanceLastPart } from '@/lib/splitCalculator';
import { validateManualSplits } from '@/lib/validators';
import { getStoredHistory, saveHistoryItem, deleteHistoryItem, clearHistory } from '@/lib/storage';
import { printPaymentVouchers } from '@/lib/qrExport';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import PaymentForm from '@/components/PaymentForm';
import SplitCalculator from '@/components/SplitCalculator';
import PaymentSummary from '@/components/PaymentSummary';
import QRCodeGrid from '@/components/QRCodeGrid';
import BulkDownloadModal from '@/components/BulkDownloadModal';
import PaymentHistory from '@/components/PaymentHistory';
import ToastContainer, { ToastMessage } from '@/components/Toast';

export default function Home() {
  // Form and calculation states
  const [formValues, setFormValues] = useState<PaymentFormValues | null>(null);
  const [splitMode, setSplitMode] = useState<SplitMode>('auto');
  const [parts, setParts] = useState<SplitPart[]>([]);
  const [currentStep, setCurrentStep] = useState<'form' | 'splits' | 'qr'>('form');

  // Modals & toasts
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // DOM Refs for smooth scrolling
  const builderRef = useRef<HTMLDivElement>(null);
  const qrSectionRef = useRef<HTMLDivElement>(null);

  // Load history from localStorage on client mount
  useEffect(() => {
    setHistory(getStoredHistory());
  }, []);

  // Toast notification helper
  const showToast = (text: string, type: 'success' | 'info' | 'error' = 'info') => {
    const id = `${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    setToasts((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Step 1: Handle initial form submission
  const handleFormSubmit = (values: PaymentFormValues) => {
    setFormValues(values);
    const initialParts = calculateAutoSplit(Number(values.totalAmount), values.partsCount);
    setParts(initialParts);
    setSplitMode('auto');
    setCurrentStep('splits');

    setTimeout(() => {
      builderRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  // Handle split mode switch
  const handleSplitModeChange = (mode: SplitMode) => {
    setSplitMode(mode);
    if (mode === 'auto' && formValues && formValues.totalAmount !== '') {
      const autoParts = calculateAutoSplit(Number(formValues.totalAmount), formValues.partsCount);
      setParts(autoParts);
    }
  };

  // Handle manual split amount changes
  const handlePartAmountChange = (index: number, newAmount: number) => {
    setParts((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        amount: newAmount,
        amountPaise: Math.round(newAmount * 100),
      };
      return updated;
    });
  };

  // Auto-balance last part in manual mode
  const handleAutoBalance = () => {
    if (!formValues || formValues.totalAmount === '') return;
    const currentAmounts = parts.map((p) => p.amount);
    const balancedAmounts = autoBalanceLastPart(currentAmounts, Number(formValues.totalAmount));

    setParts((prev) =>
      prev.map((p, idx) => ({
        ...p,
        amount: balancedAmounts[idx],
        amountPaise: Math.round(balancedAmounts[idx] * 100),
      }))
    );
    showToast('Adjusted last payment part to balance the total bill', 'success');
  };

  // Live validation calculations
  const totalBillNumber = formValues && formValues.totalAmount !== '' ? Number(formValues.totalAmount) : 0;
  const currentSplitAmounts = parts.map((p) => p.amount);
  const validationResult = validateManualSplits(currentSplitAmounts, totalBillNumber);

  const validationStatus: SplitValidationStatus = {
    isValid: validationResult.isValid,
    totalEntered: validationResult.totalEntered,
    requiredTotal: totalBillNumber,
    difference: validationResult.difference,
    statusMessage: validationResult.statusMessage,
    statusType: validationResult.statusType,
  };

  // Step 2 -> 3: Generate QR codes and save to history
  const handleGenerateQr = () => {
    if (!formValues || !validationStatus.isValid) {
      showToast('Please fix split amounts so they equal the total bill', 'error');
      return;
    }

    // Save to LocalStorage history
    const saved = saveHistoryItem({
      recipientName: formValues.recipientName,
      upiId: formValues.upiId,
      totalAmount: totalBillNumber,
      partsCount: parts.length,
      splitAmounts: parts.map((p) => p.amount),
    });

    if (saved) {
      setHistory(getStoredHistory());
    }

    setCurrentStep('qr');
    showToast(`Generated ${parts.length} UPI payment QR codes!`, 'success');

    setTimeout(() => {
      qrSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 150);
  };

  // Start fresh split
  const handleNewSplit = () => {
    setCurrentStep('form');
    setFormValues(null);
    setParts([]);
    setSplitMode('auto');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Edit current split
  const handleEditSplit = () => {
    setCurrentStep('splits');
    setTimeout(() => {
      builderRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  // View item from history
  const handleViewHistoryItem = (item: HistoryItem) => {
    const values: PaymentFormValues = {
      upiId: item.upiId,
      recipientName: item.recipientName,
      totalAmount: item.totalAmount,
      partsCount: item.partsCount,
    };

    setFormValues(values);
    setSplitMode('manual');

    const loadedParts: SplitPart[] = item.splitAmounts.map((amt, idx) => ({
      id: `history-part-${idx + 1}`,
      partNumber: idx + 1,
      amount: amt,
      amountPaise: Math.round(amt * 100),
    }));

    setParts(loadedParts);
    setCurrentStep('qr');
    showToast(`Loaded split for ${item.recipientName}`, 'info');

    setTimeout(() => {
      qrSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 150);
  };

  // Delete item from history
  const handleDeleteHistoryItem = (id: string) => {
    deleteHistoryItem(id);
    setHistory(getStoredHistory());
    showToast('Split record deleted', 'info');
  };

  // Clear all history
  const handleClearAllHistory = () => {
    clearHistory();
    setHistory([]);
    showToast('All split payment history cleared', 'info');
  };

  // PaymentSplitData object for QR Grid & Bulk Download
  const currentSplitData: PaymentSplitData | null = formValues
    ? {
        id: `split-${Date.now()}`,
        createdAt: new Date().toISOString(),
        upiId: formValues.upiId,
        recipientName: formValues.recipientName,
        totalAmount: totalBillNumber,
        partsCount: parts.length,
        splitMode,
        parts,
      }
    : null;

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <Header
        historyCount={history.length}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onNewSplit={handleNewSplit}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-4 space-y-12">
        {/* Landing Hero (Visible on top) */}
        <HeroSection
          onStartSplit={() => {
            builderRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }}
          onOpenHistory={() => setIsHistoryOpen(true)}
        />

        {/* Form and Builder Section */}
        <div ref={builderRef} id="builder" className="space-y-8 scroll-mt-24">
          {/* Step 1: Payment Form */}
          <PaymentForm
            initialValues={formValues || undefined}
            onSubmit={handleFormSubmit}
            onReset={handleNewSplit}
          />

          {/* Step 2: Split Calculator (Visible when form is submitted) */}
          {currentStep !== 'form' && formValues && (
            <div className="space-y-6 animate-in fade-in-50 duration-300">
              {/* Payment Summary Bar */}
              <PaymentSummary
                totalBill={totalBillNumber}
                partsCount={parts.length}
                totalSplitAmount={validationStatus.totalEntered}
                difference={validationStatus.difference}
                isValid={validationStatus.isValid}
                statusMessage={validationStatus.statusMessage}
              />

              {/* Calculator Component */}
              <SplitCalculator
                totalBill={totalBillNumber}
                partsCount={parts.length}
                splitMode={splitMode}
                onSplitModeChange={handleSplitModeChange}
                parts={parts}
                onChangePartAmount={handlePartAmountChange}
                onAutoBalance={handleAutoBalance}
                validationStatus={validationStatus}
                onGenerateQr={handleGenerateQr}
                onReset={() => {
                  setCurrentStep('form');
                  builderRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
              />
            </div>
          )}

          {/* Step 3: Generated QR Codes Grid */}
          {currentStep === 'qr' && currentSplitData && (
            <div ref={qrSectionRef} id="qr-section" className="scroll-mt-24 animate-in fade-in-50 duration-300">
              <QRCodeGrid
                splitData={currentSplitData}
                onEditSplit={handleEditSplit}
                onNewSplit={handleNewSplit}
                onOpenBulkModal={() => setIsBulkModalOpen(true)}
                onPrint={printPaymentVouchers}
                onToast={showToast}
              />
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <Footer />

      {/* Modals & Drawers */}
      {currentSplitData && (
        <BulkDownloadModal
          isOpen={isBulkModalOpen}
          onClose={() => setIsBulkModalOpen(false)}
          splitData={currentSplitData}
          onPrint={printPaymentVouchers}
        />
      )}

      <PaymentHistory
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onView={handleViewHistoryItem}
        onDelete={handleDeleteHistoryItem}
        onClearAll={handleClearAllHistory}
      />

      {/* Toast Feedback */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
