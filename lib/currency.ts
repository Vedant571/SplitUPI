/**
 * Currency utility functions for INR (Indian Rupee) and Paise operations.
 * Handles exact integer arithmetic internally to avoid IEEE-754 floating point issues.
 */

export function toPaise(rupees: number): number {
  if (isNaN(rupees) || !isFinite(rupees)) return 0;
  return Math.round(rupees * 100);
}

export function fromPaise(paise: number): number {
  if (isNaN(paise) || !isFinite(paise)) return 0;
  return Number((paise / 100).toFixed(2));
}

export function formatINR(amount: number, forceDecimals = false): string {
  if (isNaN(amount) || !isFinite(amount)) return '₹0';
  
  const absAmount = Math.abs(amount);
  const isNegative = amount < 0;
  const hasDecimals = absAmount % 1 !== 0 || forceDecimals;
  
  const formatted = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: hasDecimals ? 2 : 0,
    maximumFractionDigits: 2,
  }).format(absAmount);

  return isNegative ? `-${formatted}` : formatted;
}

/**
 * Format amount specifically for the UPI payment URL.
 * UPI standard requires amount in decimal format, up to 2 decimal places (e.g. "1999" or "1999.50").
 */
export function formatUpiAmount(amount: number): string {
  if (isNaN(amount) || amount <= 0) return '0.00';
  // Remove unnecessary trailing zeroes if exact integer, or keep standard 2 decimals
  const fixed = amount.toFixed(2);
  // Standard UPI URI format accepts e.g. 1999 or 1999.50
  if (fixed.endsWith('.00')) {
    return fixed.slice(0, -3);
  }
  return fixed;
}

/**
 * Parse string input into clean positive number with at most 2 decimal digits.
 */
export function parseAmountInput(input: string): number | null {
  const trimmed = input.trim();
  if (!trimmed) return null;
  const num = parseFloat(trimmed);
  if (isNaN(num) || !isFinite(num) || num < 0) return null;
  return Number(num.toFixed(2));
}
