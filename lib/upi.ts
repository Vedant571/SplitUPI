import QRCode from 'qrcode';
import { formatUpiAmount } from './currency';

export interface UpiUriParams {
  upiId: string;
  recipientName: string;
  amount: number;
  transactionNote?: string;
}

/**
 * Builds a standards-compliant UPI payment intent URI.
 * Format: upi://pay?pa=<UPI_ID>&pn=<NAME>&am=<AMOUNT>&cu=INR
 * Parameters are properly URL encoded.
 */
export function generateUpiUri({
  upiId,
  recipientName,
  amount,
  transactionNote,
}: UpiUriParams): string {
  const cleanUpiId = upiId.trim();
  const cleanName = recipientName.trim();
  const formattedAmount = formatUpiAmount(amount);

  const params = new URLSearchParams();
  params.set('pa', cleanUpiId);
  params.set('pn', cleanName);
  params.set('am', formattedAmount);
  params.set('cu', 'INR');

  if (transactionNote && transactionNote.trim()) {
    params.set('tn', transactionNote.trim());
  }

  // Construct upi://pay URI manually to ensure exact standard scheme and encoding
  return `upi://pay?${params.toString()}`;
}

/**
 * Generates a high-contrast QR code Data URL (PNG) with required quiet-zone padding.
 */
export async function generateQrDataUrl(
  uri: string,
  width: number = 400
): Promise<string> {
  return QRCode.toDataURL(uri, {
    errorCorrectionLevel: 'M',
    margin: 4, // Ample quiet zone for scanning reliability
    width,
    color: {
      dark: '#000000', // Crisp black modules
      light: '#ffffff', // Pure white background
    },
  });
}

/**
 * Generates SVG string for vector rendering if needed.
 */
export async function generateQrSvg(uri: string): Promise<string> {
  return QRCode.toString(uri, {
    type: 'svg',
    errorCorrectionLevel: 'M',
    margin: 4,
    color: {
      dark: '#000000',
      light: '#ffffff',
    },
  });
}

/**
 * Checks if the user agent is a mobile device (Android / iOS)
 * which supports UPI deep links.
 */
export function isMobileDevice(): boolean {
  if (typeof window === 'undefined') return false;
  const ua = navigator.userAgent || navigator.vendor || '';
  return /android|iphone|ipad|ipod/i.test(ua);
}

/**
 * Attempts to launch the UPI app on mobile or returns guidance for desktop.
 */
export function triggerUpiIntent(uri: string): {
  success: boolean;
  message: string;
} {
  if (typeof window === 'undefined') {
    return { success: false, message: 'Window object unavailable' };
  }

  const mobile = isMobileDevice();

  if (mobile) {
    try {
      window.location.href = uri;
      return {
        success: true,
        message: 'Opening your UPI app (Google Pay, PhonePe, Paytm)...',
      };
    } catch {
      return {
        success: false,
        message: 'Unable to launch UPI app automatically. Please scan the QR code instead.',
      };
    }
  }

  return {
    success: false,
    message:
      'UPI deep-links require a mobile device with a UPI app installed. Please scan this QR code with Google Pay, PhonePe, Paytm, or your banking app.',
  };
}
