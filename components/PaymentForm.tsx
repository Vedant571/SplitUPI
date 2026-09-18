'use client';

import { useState } from 'react';
import { PaymentFormValues, ValidationErrors } from '@/types/payment';
import { validateUpiId, validateRecipientName, validateTotalAmount, validatePartsCount, MIN_PARTS, MAX_PARTS } from '@/lib/validators';
import ValidationMessage from './ValidationMessage';
import { ArrowRight, RotateCcw, User, AtSign, Users, Sparkles } from 'lucide-react';

interface PaymentFormProps {
  initialValues?: PaymentFormValues;
  onSubmit: (values: PaymentFormValues) => void;
  onReset?: () => void;
}

const PRESET_AMOUNTS = [1000, 2000, 4000, 5000];
const PRESET_PARTS = [2, 3, 4, 5];

export default function PaymentForm({ initialValues, onSubmit, onReset }: PaymentFormProps) {
  const [upiId, setUpiId] = useState(initialValues?.upiId || '');
  const [recipientName, setRecipientName] = useState(initialValues?.recipientName || '');
  const [totalAmount, setTotalAmount] = useState<number | ''>(
    initialValues?.totalAmount !== undefined ? initialValues.totalAmount : ''
  );
  const [partsCount, setPartsCount] = useState<number>(initialValues?.partsCount || 3);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateAll = () => {
    const upiError = validateUpiId(upiId);
    const nameError = validateRecipientName(recipientName);
    const amountError = validateTotalAmount(totalAmount);
    const partsError = validatePartsCount(partsCount);

    const newErrors: ValidationErrors = {};
    if (upiError) newErrors.upiId = upiError;
    if (nameError) newErrors.recipientName = nameError;
    if (amountError) newErrors.totalAmount = amountError;
    if (partsError) newErrors.partsCount = partsError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    if (field === 'upiId') {
      const err = validateUpiId(upiId);
      setErrors((prev) => ({ ...prev, upiId: err || undefined }));
    } else if (field === 'recipientName') {
      const err = validateRecipientName(recipientName);
      setErrors((prev) => ({ ...prev, recipientName: err || undefined }));
    } else if (field === 'totalAmount') {
      const err = validateTotalAmount(totalAmount);
      setErrors((prev) => ({ ...prev, totalAmount: err || undefined }));
    } else if (field === 'partsCount') {
      const err = validatePartsCount(partsCount);
      setErrors((prev) => ({ ...prev, partsCount: err || undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({
      upiId: true,
      recipientName: true,
      totalAmount: true,
      partsCount: true,
    });

    if (validateAll()) {
      onSubmit({
        upiId: upiId.trim(),
        recipientName: recipientName.trim(),
        totalAmount: Number(totalAmount),
        partsCount: Number(partsCount),
      });
    }
  };

  const handleReset = () => {
    setUpiId('');
    setRecipientName('');
    setTotalAmount('');
    setPartsCount(3);
    setErrors({});
    setTouched({});
    if (onReset) onReset();
  };

  const loadExample = () => {
    setUpiId('merchant@upi');
    setRecipientName('ABC Store');
    setTotalAmount(4000);
    setPartsCount(3);
    setErrors({});
  };

  return (
    <form
      id="payment-form"
      onSubmit={handleSubmit}
      className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-6 shadow-md transition-all space-y-6"
    >
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Step 1: Payment Information
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Enter recipient UPI details and bill split parameters.
          </p>
        </div>

        <button
          type="button"
          onClick={loadExample}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-cyan-400 hover:text-blue-700 p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/50 transition-colors"
          title="Fill with prompt example (ABC Store, ₹4,000, 3 parts)"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Load Example</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Recipient UPI ID */}
        <div>
          <label
            htmlFor="input-upi-id"
            className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1.5"
          >
            Recipient UPI ID <span className="text-rose-500">*</span>
          </label>
          <div className="relative flex items-center">
            <AtSign className="absolute left-3.5 w-4 h-4 text-slate-400 dark:text-slate-500" />
            <input
              id="input-upi-id"
              name="upiId"
              type="text"
              placeholder="e.g. merchant@upi or 9876543210@paytm"
              value={upiId}
              onChange={(e) => {
                setUpiId(e.target.value);
                if (touched.upiId) {
                  setErrors((prev) => ({ ...prev, upiId: validateUpiId(e.target.value) || undefined }));
                }
              }}
              onBlur={() => handleBlur('upiId')}
              className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-sm font-medium bg-slate-50/70 dark:bg-slate-800/60 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all ${
                errors.upiId && touched.upiId
                  ? 'border-rose-400 dark:border-rose-600 focus:ring-rose-500/20'
                  : 'border-slate-200 dark:border-slate-700 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-cyan-400'
              }`}
            />
          </div>
          <ValidationMessage error={touched.upiId ? errors.upiId : null} />
        </div>

        {/* Recipient Name */}
        <div>
          <label
            htmlFor="input-recipient-name"
            className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1.5"
          >
            Recipient / Store Name <span className="text-rose-500">*</span>
          </label>
          <div className="relative flex items-center">
            <User className="absolute left-3.5 w-4 h-4 text-slate-400 dark:text-slate-500" />
            <input
              id="input-recipient-name"
              name="recipientName"
              type="text"
              placeholder="e.g. ABC Store or Rahul Sharma"
              value={recipientName}
              onChange={(e) => {
                setRecipientName(e.target.value);
                if (touched.recipientName) {
                  setErrors((prev) => ({ ...prev, recipientName: validateRecipientName(e.target.value) || undefined }));
                }
              }}
              onBlur={() => handleBlur('recipientName')}
              className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-sm font-medium bg-slate-50/70 dark:bg-slate-800/60 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all ${
                errors.recipientName && touched.recipientName
                  ? 'border-rose-400 dark:border-rose-600 focus:ring-rose-500/20'
                  : 'border-slate-200 dark:border-slate-700 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-cyan-400'
              }`}
            />
          </div>
          <ValidationMessage error={touched.recipientName ? errors.recipientName : null} />
        </div>

        {/* Total Bill Amount */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label
              htmlFor="input-total-amount"
              className="text-xs font-semibold text-slate-700 dark:text-slate-200"
            >
              Total Bill Amount (INR) <span className="text-rose-500">*</span>
            </label>
            <span className="text-[11px] text-slate-400 dark:text-slate-500">
              Max ₹1,00,000
            </span>
          </div>

          <div className="relative flex items-center">
            <span className="absolute left-3.5 text-base font-bold text-slate-500 dark:text-slate-400">
              ₹
            </span>
            <input
              id="input-total-amount"
              name="totalAmount"
              type="number"
              step="any"
              min="0.01"
              max="100000"
              placeholder="4000"
              value={totalAmount}
              onChange={(e) => {
                const val = e.target.value === '' ? '' : parseFloat(e.target.value);
                setTotalAmount(val);
                if (touched.totalAmount) {
                  setErrors((prev) => ({ ...prev, totalAmount: validateTotalAmount(val) || undefined }));
                }
              }}
              onBlur={() => handleBlur('totalAmount')}
              className={`w-full pl-8 pr-3.5 py-2.5 rounded-xl border text-base font-bold bg-slate-50/70 dark:bg-slate-800/60 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all ${
                errors.totalAmount && touched.totalAmount
                  ? 'border-rose-400 dark:border-rose-600 focus:ring-rose-500/20'
                  : 'border-slate-200 dark:border-slate-700 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-cyan-400'
              }`}
            />
          </div>
          <ValidationMessage error={touched.totalAmount ? errors.totalAmount : null} />

          {/* Preset amount pills */}
          <div className="flex items-center gap-1.5 mt-2">
            <span className="text-[11px] text-slate-400 dark:text-slate-500">Quick:</span>
            {PRESET_AMOUNTS.map((amt) => (
              <button
                key={amt}
                type="button"
                onClick={() => {
                  setTotalAmount(amt);
                  setErrors((prev) => ({ ...prev, totalAmount: undefined }));
                }}
                className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-950/60 hover:text-blue-600 dark:hover:text-cyan-400 transition-colors"
              >
                ₹{amt.toLocaleString('en-IN')}
              </button>
            ))}
          </div>
        </div>

        {/* Number of Payment Parts */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label
              htmlFor="input-parts-count"
              className="text-xs font-semibold text-slate-700 dark:text-slate-200"
            >
              Number of Payment Parts <span className="text-rose-500">*</span>
            </label>
            <span className="text-[11px] text-slate-400 dark:text-slate-500">
              Min {MIN_PARTS}, Max {MAX_PARTS}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative flex-1 flex items-center">
              <Users className="absolute left-3.5 w-4 h-4 text-slate-400 dark:text-slate-500" />
              <input
                id="input-parts-count"
                name="partsCount"
                type="number"
                min={MIN_PARTS}
                max={MAX_PARTS}
                value={partsCount}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  setPartsCount(isNaN(val) ? 0 : val);
                  if (touched.partsCount) {
                    setErrors((prev) => ({ ...prev, partsCount: validatePartsCount(val) || undefined }));
                  }
                }}
                onBlur={() => handleBlur('partsCount')}
                className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-base font-bold bg-slate-50/70 dark:bg-slate-800/60 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all ${
                  errors.partsCount && touched.partsCount
                    ? 'border-rose-400 dark:border-rose-600 focus:ring-rose-500/20'
                    : 'border-slate-200 dark:border-slate-700 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-cyan-400'
                }`}
              />
            </div>

            {/* Quick parts buttons */}
            <div className="flex items-center gap-1">
              {PRESET_PARTS.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => {
                    setPartsCount(p);
                    setErrors((prev) => ({ ...prev, partsCount: undefined }));
                  }}
                  className={`w-8 h-8 rounded-lg text-xs font-bold flex items-center justify-center transition-all ${
                    partsCount === p
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
          <ValidationMessage error={touched.partsCount ? errors.partsCount : null} />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
        <button
          type="button"
          onClick={handleReset}
          className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Form</span>
        </button>

        <button
          type="submit"
          id="submit-payment-splits-btn"
          className="w-full sm:w-auto px-7 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-semibold text-sm shadow-md shadow-blue-600/25 hover:shadow-blue-600/40 transition-all flex items-center justify-center gap-2"
        >
          <span>Generate Payment Splits</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </form>
  );
}
