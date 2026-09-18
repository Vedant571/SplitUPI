# SplitUPI — Modern UPI Bill-Splitting & Partial-Payment Utility

SplitUPI is a modern, responsive web application designed for UPI bill splitting and partial payments. When a user enters a total bill amount, recipient name, recipient UPI ID, and desired number of parts, SplitUPI calculates exact payments (using integer-paise precision to guarantee zero rounding errors) and generates high-contrast, standards-compliant UPI payment QR codes.

> **Legal / Safety Disclaimer**:  
> SplitUPI is a client-side bill-splitting and QR-generation utility. It does not process, hold, or transmit funds, and it does not verify UPI payments in this MVP. Splitting payments does not alter the underlying value or nature of a sale, nor does it eliminate or reduce taxes, fees, or merchant liabilities. Users remain strictly responsible for applicable taxes, merchant invoices, and UPI terms of service.

---

## Key Features

- **Exact Split Arithmetic**: Automatic split guarantees that the sum of all parts mathematically equals the total bill amount down to the single paise.
- **Auto & Manual Split Modes**: Switch effortlessly between automatic equal distribution and fully customized manual amounts with live discrepancy tracking.
- **Auto-Balance Assistant**: Quickly balance the remaining discrepancy onto the final payment part with one click.
- **High-Contrast UPI QR Codes**: Generates high-density, crisp QR codes with dedicated white quiet-zone padding for effortless camera and scanner recognition.
- **Deep-Link UPI Intent Integration**: Mobile users can tap **Open in UPI App** to launch installed apps like Google Pay, PhonePe, Paytm, or BHIM directly via `upi://pay` URIs.
- **Informative Fallback Handling**: On desktop or non-UPI environments, users receive clear guidance to scan the QR code rather than pretending a payment was initiated.
- **Export & Printable Vouchers**:
  - **Individual QR Voucher**: Downloads a high-resolution, branded PNG voucher card with payment number, amount, recipient info, and QR code.
  - **Bulk Payment Sheet**: Clean modal layout and printable view (`window.print()`) formatted for A4 paper and PDF saving.
- **Local Browser History**: Safely saves past splits in browser `localStorage` (never storing banking credentials, OTPs, or PINs). Supports instant reloading and item deletion with confirmation.
- **Aesthetic Fintech UI**: Built with dark and light mode support, responsive layout (1 column on mobile, 2 columns on tablet, 3 columns on desktop), and accessible contrast.

---

## Tech Stack

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **QR Generation**: [qrcode](https://www.npmjs.com/package/qrcode)
- **Persistence**: Browser `localStorage` (SSR-safe)

---

## How It Works

### 1. UPI Payment URIs
UPI payments follow the NPCI specification scheme:
```text
upi://pay?pa=merchant@upi&pn=ABC%20Store&am=1999.00&cu=INR&tn=SplitUPI%20Payment%201%20of%203
```
- `pa`: Recipient Virtual Payment Address (UPI ID), URL-encoded.
- `pn`: Recipient / Payee Name, URL-encoded.
- `am`: Transaction amount formatted to 2 decimal places (or integer without trailing zeros).
- `cu`: Currency code (`INR`).
- `tn`: Transaction note indicating the split part.

### 2. QR Code Generation
QR codes encode the dynamic `upi://pay` URI string using `errorCorrectionLevel: 'M'` with a minimum margin (quiet zone) of 4 units, ensuring scannability across various lighting conditions and phone camera resolutions.

### 3. Exact Split Calculation
Floating-point math in JavaScript can suffer from precision drift (e.g. `0.1 + 0.2 !== 0.3`). SplitUPI eliminates this by converting Rupee amounts to integer **paise** (`Math.round(rupees * 100)`):
- Base paise per part: $\lfloor \text{totalPaise} / N \rfloor$
- Remainder paise: $\text{totalPaise} \pmod N$
- The first $R$ parts receive $\text{basePaise} + 1$, while remaining parts receive $\text{basePaise}$.
- When total is a whole integer, it prioritizes clean whole-rupee parts (e.g., ₹4,000 / 3 = ₹1,334 + ₹1,333 + ₹1,333).
- Invariant: $\sum \text{parts} \equiv \text{total}$ is strictly preserved.

---

## Local Development

### Prerequisites
- Node.js 18.x or higher
- npm 9.x or higher

### Installation
```bash
git clone <repo-url>
cd "Upi split bill"
npm install
```

### Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your web browser.

### Production Build
```bash
npm run build
npm run start
```

---

## Current MVP Limitations & Payment Verification

### Why Payment Verification is NOT in this MVP
1. Direct UPI deep links (`upi://pay`) and static QR codes do not provide a client-side callback or browser redirect when paid in an external UPI app.
2. Legitimate verification requires a registered **Merchant Payment Aggregator** (e.g. Razorpay, Cashfree, Decentro, or bank APIs) that listens to webhook notifications triggered by the banking switch.
3. Pretending that a web page knows whether a payment succeeded without verified backend webhooks is insecure and deceptive. SplitUPI prominently displays:
   > **"Payment status cannot be automatically verified"**

### Future Production Roadmap
- **Serverless Webhook Handler**: Secure endpoint to receive server-to-server payment notifications.
- **Live Transaction Reconciliation**: Real-time WebSocket channel to mark individual split parts as verified when received.
- **Dynamic Payment Links**: Option to generate short links for sharing splits directly via WhatsApp or SMS.
- **Multi-Merchant Dashboard**: Authenticated portal for recurring merchants.
