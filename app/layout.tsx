import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SplitUPI — Modern UPI Bill Splitting & Partial Payments',
  description:
    'Calculate and generate multiple UPI payment QR codes for splitting bills between friends or making partial payments. High-contrast QR codes, exact integer-paise calculations, and deep-link UPI intents.',
  keywords: [
    'UPI Split Bill',
    'Split UPI',
    'UPI QR code generator',
    'Partial payment UPI',
    'Bill splitting India',
    'Google Pay QR',
    'PhonePe QR',
    'Paytm QR',
  ],
  authors: [{ name: 'SplitUPI Team' }],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased min-h-screen bg-[#f8fafc] text-[#0f172a] dark:bg-[#0b0f17] dark:text-[#f8fafc] transition-colors">
        {children}
      </body>
    </html>
  );
}
