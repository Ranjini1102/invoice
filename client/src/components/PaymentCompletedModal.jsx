import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, ShieldCheck, Download, X, PartyPopper } from 'lucide-react';

export default function PaymentCompletedModal() {
  const { paymentSuccessModal, setPaymentSuccessModal, setSelectedInvoiceId, setActiveTab } = useApp();

  if (!paymentSuccessModal.open || !paymentSuccessModal.data) return null;

  const data = paymentSuccessModal.data;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border-2 border-brand-600 relative overflow-hidden transform animate-in zoom-in-95 duration-300">
        
        {/* GREEN DECORATIVE ACCENT TOP STRIP */}
        <div className="absolute top-0 left-0 right-0 h-3 bg-brand-600" />

        {/* CLOSE BUTTON */}
        <button
          onClick={() => setPaymentSuccessModal({ open: false, data: null })}
          className="absolute top-5 right-5 p-1.5 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* ICON & TITLE */}
        <div className="text-center pt-2">
          <div className="w-20 h-20 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center mx-auto mb-3 border-4 border-brand-200 shadow-inner">
            <CheckCircle2 className="w-12 h-12 text-brand-600 animate-bounce" />
          </div>

          <span className="text-xs font-extrabold text-brand-800 uppercase tracking-widest bg-brand-100 px-3 py-1 rounded-full border border-brand-300">
            Vendor Notification
          </span>

          <h2 className="text-2xl font-extrabold text-charcoal-900 mt-2">
            ✓ PAYMENT COMPLETED
          </h2>
          <p className="text-xs font-bold text-brand-700 mt-1">
            "Payment successfully completed."
          </p>
        </div>

        {/* PROMINENT DETAILS CARD (REQUIREMENT 2 FORMAT) */}
        <div className="my-6 bg-brand-50 rounded-2xl p-5 border border-brand-300 space-y-3 font-sans">
          
          <div className="flex items-center justify-between pb-2 border-b border-brand-200 text-xs">
            <span className="text-charcoal-600 font-semibold">Invoice:</span>
            <span className="font-extrabold text-charcoal-900 font-mono text-sm">{data.invoiceNumber || 'INV-1024'}</span>
          </div>

          <div className="flex items-center justify-between pb-2 border-b border-brand-200 text-xs">
            <span className="text-charcoal-600 font-semibold">Vendor:</span>
            <span className="font-bold text-charcoal-900">{data.vendorName || 'ABC Supplies'}</span>
          </div>

          <div className="flex items-center justify-between pb-2 border-b border-brand-200 text-xs">
            <span className="text-charcoal-600 font-semibold">Amount:</span>
            <span className="font-extrabold text-brand-700 text-xl font-mono">
              ₹{(data.amount || 52000).toLocaleString('en-IN')}
            </span>
          </div>

          <div className="flex items-center justify-between pb-2 border-b border-brand-200 text-xs">
            <span className="text-charcoal-600 font-semibold">Payment Date:</span>
            <span className="font-bold text-charcoal-800">{data.timestamp || new Date().toLocaleDateString('en-GB')}</span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-charcoal-600 font-semibold">Reference ID:</span>
            <span className="font-extrabold text-brand-800 font-mono bg-white px-2 py-0.5 rounded border border-brand-200">
              {data.transactionId || 'PAY-784521'}
            </span>
          </div>

        </div>

        {/* FOOTER ACTIONS */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setPaymentSuccessModal({ open: false, data: null });
              if (data.invoiceId) {
                setSelectedInvoiceId(data.invoiceId);
                setActiveTab('invoice-details');
              }
            }}
            className="flex-1 bg-brand-600 hover:bg-brand-700 text-white py-3 rounded-xl font-extrabold text-xs shadow-md transition-colors flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" /> View Invoice Timeline
          </button>
        </div>

      </div>
    </div>
  );
}
