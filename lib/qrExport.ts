import { formatINR } from './currency';

export interface QrCardExportParams {
  partNumber: number;
  totalParts: number;
  amount: number;
  recipientName: string;
  upiId: string;
  qrDataUrl: string;
}

/**
 * Generates an elegant, high-resolution branded PNG voucher card for an individual QR code.
 */
export async function downloadBrandedQrCard({
  partNumber,
  totalParts,
  amount,
  recipientName,
  upiId,
  qrDataUrl,
}: QrCardExportParams): Promise<void> {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Hi-res canvas dimensions (2x scale for retina crispness)
  const width = 600;
  const height = 750;
  canvas.width = width;
  canvas.height = height;

  // Background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);

  // Border & Header accent
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, width, 90);

  // SplitUPI Brand text
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('SplitUPI', 32, 45);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText('Payment Voucher', 32, 70);

  // Payment part badge on right
  ctx.fillStyle = '#2563eb';
  ctx.beginPath();
  ctx.roundRect(width - 160, 28, 128, 34, 17);
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.font = '600 13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(`PART ${partNumber} OF ${totalParts}`, width - 96, 50);

  // Amount display
  ctx.textAlign = 'center';
  ctx.fillStyle = '#64748b';
  ctx.font = '13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText('AMOUNT TO PAY', width / 2, 130);

  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 44px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText(formatINR(amount, true), width / 2, 180);

  // Draw QR Code image
  const qrImage = new Image();
  qrImage.crossOrigin = 'anonymous';

  await new Promise<void>((resolve, reject) => {
    qrImage.onload = () => resolve();
    qrImage.onerror = reject;
    qrImage.src = qrDataUrl;
  });

  const qrSize = 340;
  const qrX = (width - qrSize) / 2;
  const qrY = 210;

  // White box with border for QR
  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(qrX - 10, qrY - 10, qrSize + 20, qrSize + 20, 16);
  ctx.fill();
  ctx.stroke();

  ctx.drawImage(qrImage, qrX, qrY, qrSize, qrSize);

  // Recipient info
  ctx.textAlign = 'center';
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 18px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText(recipientName, width / 2, 600);

  ctx.fillStyle = '#64748b';
  ctx.font = '15px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText(`UPI ID: ${upiId}`, width / 2, 630);

  // Unverified notice footer
  ctx.fillStyle = '#94a3b8';
  ctx.font = '11px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText('Scan with any UPI App • Payment status cannot be automatically verified', width / 2, 680);
  ctx.fillText('SplitUPI is a bill-splitting utility and does not process funds', width / 2, 700);

  // Trigger download
  const link = document.createElement('a');
  const safeName = recipientName.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
  link.download = `splitupi-part${partNumber}-${safeName}-${amount}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
}

/**
 * Triggers standard browser print dialog for the all-in-one printable layout.
 */
export function printPaymentVouchers(): void {
  if (typeof window !== 'undefined') {
    window.print();
  }
}
