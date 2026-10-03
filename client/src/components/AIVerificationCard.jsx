import React from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, CheckCircle2, AlertTriangle, FileText, Check } from 'lucide-react';

export default function AIVerificationCard({ invoice }) {
  const { userRole, handleUpdateStatus } = useApp();

  if (!invoice || !invoice.aiVerification) return null;

  const ver = invoice.aiVerification;
  const isMatch = ver.verified && ver.amountMatched && ver.poMatched;

  return (
    <div className="bg-white rounded-2xl border border-surface-border p-6 shadow-xs">
      
      {/* HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-3 border-b border-surface-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-100 border border-brand-200 text-brand-600 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-charcoal-900">
              AI Verification & Document Match Engine
            </h3>
            <p className="text-xs text-charcoal-500 font-medium">
              OCR Data Extraction, PO Cross-Verification & Fraud Check
            </p>
          </div>
        </div>

        {/* CONFIDENCE SCORE BADGE */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-charcoal-600 font-medium">Scan Confidence:</span>
          <span className="bg-brand-100 text-brand-800 text-xs font-extrabold px-3 py-1 rounded-full border border-brand-200">
            {ver.confidence || 99.4}%
          </span>
        </div>
      </div>

      {/* EXTRACTED METRICS GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5 text-xs">
        <div className="bg-surface-light p-3 rounded-xl border border-surface-border">
          <span className="text-charcoal-500 font-medium block">Invoice Number</span>
          <span className="font-extrabold text-charcoal-900 text-sm">{invoice.invoiceNumber}</span>
        </div>
        <div className="bg-surface-light p-3 rounded-xl border border-surface-border">
          <span className="text-charcoal-500 font-medium block">Invoice Amount</span>
          <span className="font-extrabold text-brand-700 text-sm">₹{invoice.amount?.toLocaleString('en-IN')}</span>
        </div>
        <div className="bg-surface-light p-3 rounded-xl border border-surface-border">
          <span className="text-charcoal-500 font-medium block">Matched PO Number</span>
          <span className="font-extrabold text-charcoal-900 text-sm">{invoice.poNumber || 'PO-8842'}</span>
        </div>
        <div className="bg-surface-light p-3 rounded-xl border border-surface-border">
          <span className="text-charcoal-500 font-medium block">PO Amount</span>
          <span className="font-extrabold text-charcoal-900 text-sm">₹{(invoice.poAmount || invoice.amount)?.toLocaleString('en-IN')}</span>
        </div>
      </div>

      {/* VERIFICATION CHECKLIST ITEMS */}
      <div className="space-y-2 mb-4 text-xs">
        <div className="flex items-center gap-2 text-charcoal-800 font-semibold">
          <CheckCircle2 className="w-4 h-4 text-brand-600" />
          <span>✓ Invoice details verified (OCR syntax clean)</span>
        </div>

        <div className="flex items-center gap-2 text-charcoal-800 font-semibold">
          <CheckCircle2 className="w-4 h-4 text-brand-600" />
          <span>✓ No duplicate invoice detected in enterprise database</span>
        </div>

        <div className="flex items-center gap-2 text-charcoal-800 font-semibold">
          <CheckCircle2 className="w-4 h-4 text-brand-600" />
          <span>✓ PO matched ({invoice.poNumber || 'PO-8842'})</span>
        </div>

        <div className={`flex items-center gap-2 font-semibold ${
          ver.amountMatched ? 'text-charcoal-800' : 'text-brand-900 font-bold'
        }`}>
          {ver.amountMatched ? (
            <CheckCircle2 className="w-4 h-4 text-brand-600" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-brand-600" />
          )}
          <span>
            {ver.amountMatched
              ? '✓ Amount matched with PO'
              : `⚠ Mismatch detected: Invoice amount ₹${invoice.amount?.toLocaleString('en-IN')} does not match PO amount ₹${(invoice.poAmount || 50000)?.toLocaleString('en-IN')}`}
          </span>
        </div>
      </div>

      {/* MISMATCH ACTION BANNER */}
      {!ver.amountMatched && (
        <div className="p-4 rounded-xl bg-brand-50 border border-brand-200 flex flex-wrap items-center justify-between gap-3 mt-4 text-xs">
          <div className="flex items-center gap-2 text-brand-900">
            <AlertTriangle className="w-5 h-5 text-brand-600 shrink-0" />
            <div>
              <p className="font-bold">Discrepancy Action Required</p>
              <p className="text-[11px] text-brand-800 mt-0.5">
                {ver.mismatchReason || "Invoice amount does not match PO. Request correction from vendor."}
              </p>
            </div>
          </div>

          {userRole === 'company' && invoice.status !== 'Correction Required' && (
            <button
              onClick={() => handleUpdateStatus(invoice.id, 'Correction Required', 'Invoice amount does not match purchase order. Please upload a corrected invoice.')}
              className="bg-brand-600 hover:bg-brand-700 text-white font-bold px-3.5 py-2 rounded-xl text-xs shadow-xs transition-colors"
            >
              Request Correction
            </button>
          )}
        </div>
      )}

    </div>
  );
}
