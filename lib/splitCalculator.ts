import { SplitPart } from '@/types/payment';
import { toPaise, fromPaise } from './currency';

/**
 * Calculates automatic split distribution.
 * If total is a whole rupee amount, generates clean whole rupee splits when possible.
 * If total has decimals or cannot be divided in whole rupees without fractional paise,
 * divides exact integer paise.
 * In all cases, sum of parts is mathematically guaranteed to equal totalAmount.
 */
export function calculateAutoSplit(totalAmount: number, partsCount: number): SplitPart[] {
  if (!totalAmount || totalAmount <= 0 || !partsCount || partsCount < 1) {
    return [];
  }

  const isWholeRupee = Number.isInteger(totalAmount);

  if (isWholeRupee) {
    const base = Math.floor(totalAmount / partsCount);
    const remainder = totalAmount % partsCount;

    return Array.from({ length: partsCount }, (_, index) => {
      const amount = index < remainder ? base + 1 : base;
      return {
        id: `split-part-${index + 1}`,
        partNumber: index + 1,
        amount,
        amountPaise: amount * 100,
      };
    });
  }

  // Decimal total: exact integer paise distribution
  const totalPaise = toPaise(totalAmount);
  const basePaise = Math.floor(totalPaise / partsCount);
  const remainderPaise = totalPaise % partsCount;

  return Array.from({ length: partsCount }, (_, index) => {
    const amountPaise = index < remainderPaise ? basePaise + 1 : basePaise;
    const amount = fromPaise(amountPaise);
    return {
      id: `split-part-${index + 1}`,
      partNumber: index + 1,
      amount,
      amountPaise,
    };
  });
}

/**
 * Recalculates the last manual split amount to auto-balance the total if desired.
 */
export function autoBalanceLastPart(amounts: number[], totalAmount: number): number[] {
  if (amounts.length < 2) return amounts;
  const targetPaise = toPaise(totalAmount);
  const sumPrecedingPaise = amounts
    .slice(0, amounts.length - 1)
    .reduce((acc, curr) => acc + toPaise(curr), 0);
  
  const remainingPaise = targetPaise - sumPrecedingPaise;
  if (remainingPaise <= 0) return amounts;

  const balanced = [...amounts];
  balanced[balanced.length - 1] = fromPaise(remainingPaise);
  return balanced;
}
