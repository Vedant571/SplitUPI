import { toPaise } from './currency';

export const MIN_BILL_AMOUNT = 0.01;
export const MAX_BILL_AMOUNT = 100000;
export const MIN_PARTS = 2;
export const MAX_PARTS = 10;

/**
 * Validates basic UPI ID format.
 * Standard format: <username>@<bank/handle>
 * Example: merchant@upi, rahul.sharma@okaxis, 9876543210@paytm
 */
export function isValidUpiId(upiId: string): boolean {
  if (!upiId) return false;
  const trimmed = upiId.trim();
  // Valid characters: letters, numbers, dot, underscore, hyphen, with @ and provider handle
  const upiRegex = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z0-9]{2,64}$/;
  return upiRegex.test(trimmed);
}

export function validateUpiId(upiId: string): string | null {
  const trimmed = upiId.trim();
  if (!trimmed) {
    return 'Recipient UPI ID is required';
  }
  if (!trimmed.includes('@')) {
    return 'UPI ID must include an "@" handle (e.g. name@upi)';
  }
  if (!isValidUpiId(trimmed)) {
    return 'Please enter a valid UPI ID (e.g. name@okaxis or 9876543210@paytm)';
  }
  return null;
}

export function validateRecipientName(name: string): string | null {
  const trimmed = name.trim();
  if (!trimmed) {
    return 'Recipient or business name is required';
  }
  if (trimmed.length < 2) {
    return 'Name must be at least 2 characters';
  }
  if (trimmed.length > 70) {
    return 'Name cannot exceed 70 characters';
  }
  return null;
}

export function validateTotalAmount(amount: number | ''): string | null {
  if (amount === '' || amount === undefined || amount === null) {
    return 'Total bill amount is required';
  }
  if (isNaN(amount) || !isFinite(amount)) {
    return 'Please enter a valid numeric amount';
  }
  if (amount <= 0) {
    return 'Bill amount must be greater than ₹0';
  }
  if (amount < MIN_BILL_AMOUNT) {
    return `Minimum amount is ₹${MIN_BILL_AMOUNT}`;
  }
  if (amount > MAX_BILL_AMOUNT) {
    return `Maximum bill amount for SplitUPI MVP is ₹${MAX_BILL_AMOUNT.toLocaleString('en-IN')}`;
  }
  return null;
}

export function validatePartsCount(parts: number): string | null {
  if (!parts || isNaN(parts) || !isFinite(parts)) {
    return 'Number of payment parts is required';
  }
  if (!Number.isInteger(parts)) {
    return 'Number of parts must be a whole integer';
  }
  if (parts < MIN_PARTS) {
    return `Minimum number of parts is ${MIN_PARTS}`;
  }
  if (parts > MAX_PARTS) {
    return `Maximum number of parts is ${MAX_PARTS}`;
  }
  return null;
}

/**
 * Validates manual split amounts against the required total.
 * Returns difference and status message.
 */
export function validateManualSplits(
  splits: number[],
  requiredTotal: number
): {
  isValid: boolean;
  totalEntered: number;
  difference: number;
  statusType: 'valid' | 'under' | 'over';
  statusMessage: string;
} {
  const requiredPaise = toPaise(requiredTotal);
  let totalEnteredPaise = 0;

  for (let i = 0; i < splits.length; i++) {
    const val = splits[i];
    if (isNaN(val) || !isFinite(val) || val <= 0) {
      return {
        isValid: false,
        totalEntered: splits.reduce((a, b) => a + (isNaN(b) ? 0 : b), 0),
        difference: 0,
        statusType: 'under',
        statusMessage: `Payment #${i + 1} must be greater than ₹0`,
      };
    }
    totalEnteredPaise += toPaise(val);
  }

  const diffPaise = totalEnteredPaise - requiredPaise;
  const totalEntered = Number((totalEnteredPaise / 100).toFixed(2));
  const diffRupees = Number((diffPaise / 100).toFixed(2));

  if (diffPaise === 0) {
    return {
      isValid: true,
      totalEntered,
      difference: 0,
      statusType: 'valid',
      statusMessage: '✓ Split matches the total bill exactly',
    };
  } else if (diffPaise < 0) {
    return {
      isValid: false,
      totalEntered,
      difference: diffRupees,
      statusType: 'under',
      statusMessage: `Split is ₹${Math.abs(diffRupees).toFixed(2)} under the total bill`,
    };
  } else {
    return {
      isValid: false,
      totalEntered,
      difference: diffRupees,
      statusType: 'over',
      statusMessage: `Split is ₹${diffRupees.toFixed(2)} over the total bill`,
    };
  }
}
