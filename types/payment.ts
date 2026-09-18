export type SplitMode = 'auto' | 'manual';

export interface SplitPart {
  id: string;
  partNumber: number;
  amount: number; // In Rupees (e.g. 1999.00)
  amountPaise: number; // Integer in Paise (e.g. 199900)
}

export interface PaymentFormValues {
  upiId: string;
  recipientName: string;
  totalAmount: number | '';
  partsCount: number;
}

export interface PaymentSplitData {
  id: string;
  createdAt: string;
  upiId: string;
  recipientName: string;
  totalAmount: number;
  partsCount: number;
  splitMode: SplitMode;
  parts: SplitPart[];
}

export interface ValidationErrors {
  upiId?: string;
  recipientName?: string;
  totalAmount?: string;
  partsCount?: string;
  manualSplits?: string;
}

export interface SplitValidationStatus {
  isValid: boolean;
  totalEntered: number;
  requiredTotal: number;
  difference: number; // totalEntered - requiredTotal
  statusMessage: string;
  statusType: 'valid' | 'under' | 'over';
}

export interface HistoryItem {
  id: string;
  createdAt: string;
  recipientName: string;
  upiId: string;
  totalAmount: number;
  partsCount: number;
  splitAmounts: number[];
}
