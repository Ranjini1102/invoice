import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import FlipkartTimeline from '../components/FlipkartTimeline';
import AIVerificationCard from '../components/AIVerificationCard';
import TwoWayChat from '../components/TwoWayChat';
import AIAgentWidget from '../components/AIAgentWidget';
import {
  FileText,
  User,
  Building,
  Calendar,
  DollarSign,
  CheckCircle2,
  AlertTriangle,
  Download,
  Paperclip,
  Clock,
  Send,
  ShieldCheck,
  Upload,
  ArrowLeft,
  Sparkles
} from 'lucide-react';

export default function InvoiceDetails() {
  const {
    selectedInvoice,
    userRole,
    handleUpdateStatus,
    setActiveTab,
    setInvoices
  } = useApp();

  const [txnInput, setTxnInput] = useState('');
  const [showPayPrompt, setShowPayPrompt] = useState(false);
  const [correctionInput, setCorrectionInput] = useState('');
  const [showCorrectionPrompt, setShowCorrectionPrompt] = useState(false);
  const [correctedAmount, setCorrectedAmount] = useState('');

  if (!selectedInvoice) {
    return (
      <div className="text-center py-16">
        <p className="text-sm text-charcoal-500">No invoice selected.</p>
        <button
          onClick={() => setActiveTab('invoices')}
          className="mt-3 bg-brand-600 text-white px-4 py-2 rounded-xl text-xs font-bold"
        >
          View All Invoices
        </button>
      </div>
    );
  }

  const invoice = selectedInvoice;

  // Correction re-upload handler for Vendor
  const handleVendorReuploadCorrection = (e) => {
    e.preventDefault();
    const newAmt = parseFloat(correctedAmount) || invoice.amount;
    
    setInvoices(prev => prev.map(inv => {
      if (inv.id !== invoice.id) return inv;
      const nowStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
      return {
        ...inv,
        amount: newAmt,
        status: "PO Matched",
        stageIndex: 2,
        aiVerification: {
          ...inv.aiVerification,
          verified: true,
          poMatched: true,
          amountMatched: true,
          mismatchReason: null,
          extractedDetails: { ...inv.aiVerification.extractedDetails, amount: newAmt }
        },
        chatHistory: [
          ...inv.chatHistory,
          { id: `msg-${Date.now()}`, senderRole: 'vendor', senderName: `${inv.vendorName} (Vendor)`, message: `Uploaded corrected invoice for ₹${newAmt.toLocaleString('en-IN')}.`, timestamp: nowStr },
          { id: `msg-${Date.now()+1}`, senderRole: 'company', senderName: `${inv.companyName} Admin`, message: 'Correction received. Verification started.', timestamp: nowStr }
        ]
      };
    }));
    setShowCorrectionPrompt(false);
  };

  return (
    <div className="space-y-6">
      
      {/* BACK & HEADER BAR */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setActiveTab('invoices')}
          className="inline-flex items-center gap-2 text-xs font-bold text-charcoal-600 hover:text-brand-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Invoices List
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs text-charcoal-500 font-medium">Viewing as:</span>
          <span className="bg-brand-100 text-brand-800 text-xs font-bold px-2.5 py-0.5 rounded-full border border-brand-200 uppercase">
            {userRole === 'vendor' ? 'Vendor Portal' : 'Company Admin Portal'}
          </span>
        </div>
      </div>

      {/* TOP INVOICE SUMMARY CARD */}
      <div className="bg-white rounded-3xl border border-surface-border p-6 shadow-xs relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-surface-border">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-extrabold text-charcoal-900 font-mono">
                {invoice.invoiceNumber}
              </h1>
              <span className={`inline-flex items-center gap-1 text-xs font-extrabold px-3 py-1 rounded-full ${
                invoice.status === 'Paid' ? 'bg-brand-600 text-white' :
                invoice.status === 'Correction Required' ? 'bg-brand-50 text-brand-900 border border-brand-300' :
                'bg-brand-100 text-brand-800 border border-brand-200'
              }`}>
                {invoice.status === 'Paid' && <CheckCircle2 className="w-3.5 h-3.5" />}
                {invoice.status}
              </span>
            </div>
            <p className="text-xs text-charcoal-500 mt-1 font-medium">
              Submitted by <span className="font-bold text-charcoal-900">{invoice.vendorName}</span> to <span className="font-bold text-charcoal-900">{invoice.companyName}</span>
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs text-charcoal-500 font-medium block">Total Payable Amount</span>
            <span className="text-3xl font-extrabold text-brand-700 font-mono">
              ₹{invoice.amount?.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* METRICS ROW */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 text-xs">
          <div>
            <span className="text-charcoal-500 font-medium block">Invoice Date</span>
            <span className="font-bold text-charcoal-900">{invoice.invoiceDate}</span>
          </div>
          <div>
            <span className="text-charcoal-500 font-medium block">Payment Due Date</span>
            <span className="font-bold text-charcoal-900">{invoice.dueDate}</span>
          </div>
          <div>
            <span className="text-charcoal-500 font-medium block">Purchase Order</span>
            <span className="font-bold font-mono text-brand-700">{invoice.poNumber || 'PO-8842'}</span>
          </div>
          <div>
            <span className="text-charcoal-500 font-medium block">Goods Receipt #</span>
            <span className="font-bold font-mono text-charcoal-800">{invoice.receiptNumber || 'REC-9912'}</span>
          </div>
        </div>

        {/* ADMIN ACTION BUTTONS BAR */}
        <div className="mt-5 pt-4 border-t border-surface-border flex flex-wrap items-center justify-between gap-3 bg-surface-light p-3 rounded-2xl">
          <span className="text-xs font-bold text-charcoal-700">Quick Actions:</span>

          <div className="flex flex-wrap items-center gap-2">
            {/* COMPANY ADMIN CONTROLS */}
            {userRole === 'company' && (
              <>
                {invoice.status !== 'Approved' && invoice.status !== 'Paid' && invoice.status !== 'Payment Processing' && (
                  <button
                    onClick={() => handleUpdateStatus(invoice.id, 'Approved', 'Approved by Store Admin')}
                    className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs"
                  >
                    Approve Invoice
                  </button>
                )}

                {invoice.status !== 'Correction Required' && invoice.status !== 'Paid' && (
                  <button
                    onClick={() => handleUpdateStatus(invoice.id, 'Correction Required', 'Amount mismatch with PO. Please re-upload corrected invoice.')}
                    className="bg-brand-50 hover:bg-brand-100 text-brand-900 border border-brand-300 px-3.5 py-2 rounded-xl text-xs font-bold transition-all"
                  >
                    Request Correction
                  </button>
                )}

                {invoice.status !== 'Paid' && (
                  <button
                    onClick={() => setShowPayPrompt(!showPayPrompt)}
                    className="bg-brand-700 hover:bg-brand-800 text-white px-4 py-2 rounded-xl text-xs font-extrabold transition-all shadow-md flex items-center gap-1.5 animate-pulse-subtle"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Mark Payment as Paid
                  </button>
                )}
              </>
            )}

            {/* VENDOR RE-UPLOAD CORRECTION CONTROL */}
            {userRole === 'vendor' && invoice.status === 'Correction Required' && (
              <button
                onClick={() => setShowCorrectionPrompt(!showCorrectionPrompt)}
                className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2"
              >
                <Upload className="w-4 h-4" /> Upload Corrected Invoice
              </button>
            )}
          </div>
        </div>

        {/* PAY PROMPT MODAL INLINE */}
        {showPayPrompt && (
          <div className="mt-3 p-4 bg-brand-50 border border-brand-200 rounded-2xl text-xs space-y-3">
            <h4 className="font-bold text-brand-900">Enter Payment Reference Details</h4>
            <div className="flex gap-2">
              <input
                type="text"
                value={txnInput}
                onChange={(e) => setTxnInput(e.target.value)}
                placeholder="Bank Transaction Ref ID (e.g., TXN-99834112)..."
                className="flex-1 bg-white border border-brand-200 rounded-xl px-3 py-2 text-xs text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-brand-600"
              />
              <button
                onClick={() => {
                  handleUpdateStatus(invoice.id, 'Paid', 'Payment processed via RTGS', txnInput || 'TXN-99834112');
                  setShowPayPrompt(false);
                }}
                className="bg-brand-600 hover:bg-brand-700 text-white font-bold px-4 py-2 rounded-xl shadow-xs"
              >
                Confirm & Mark Paid
              </button>
            </div>
          </div>
        )}

        {/* CORRECTION RE-UPLOAD INLINE FORM */}
        {showCorrectionPrompt && (
          <form onSubmit={handleVendorReuploadCorrection} className="mt-3 p-4 bg-brand-50 border border-brand-200 rounded-2xl text-xs space-y-3">
            <h4 className="font-bold text-brand-900">Upload Corrected Invoice Details</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-charcoal-700 mb-1">Revised Amount (₹)</label>
                <input
                  type="number"
                  value={correctedAmount}
                  onChange={(e) => setCorrectedAmount(e.target.value)}
                  placeholder={`Current: ${invoice.amount}`}
                  className="w-full bg-white border border-brand-200 rounded-xl px-3 py-2 text-xs text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-brand-600"
                />
              </div>
              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-2 rounded-xl shadow-xs"
                >
                  Submit Revision to Company
                </button>
              </div>
            </div>
          </form>
        )}
      </div>

      {/* 1. FLIPKART-STYLE INVOICE TRACKING TIMELINE */}
      <FlipkartTimeline invoice={invoice} />

      {/* GRID: AI VERIFICATION & AI AGENT PANEL */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 2. AI VERIFICATION RESULT */}
        <AIVerificationCard invoice={invoice} />

        {/* 3. FLOWGUARD AI INVOICE AGENT */}
        <AIAgentWidget invoice={invoice} />
      </div>

      {/* 4. TWO-WAY INVOICE COMMUNICATION */}
      <TwoWayChat invoice={invoice} />

      {/* DOCUMENTS & AUDIT HISTORY GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* SUPPORTING DOCUMENTS LIST */}
        <div className="bg-white rounded-2xl border border-surface-border p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-charcoal-900 flex items-center gap-2">
              <Paperclip className="w-4 h-4 text-brand-600" /> Attached Invoice Documents
            </h3>
            <span className="text-xs text-charcoal-500 font-medium">
              {invoice.documents?.length || 0} File(s)
            </span>
          </div>

          <div className="space-y-2 text-xs">
            {invoice.documents?.map((doc) => (
              <div
                key={doc.id}
                className="p-3 rounded-xl bg-surface-light border border-surface-border flex items-center justify-between hover:border-brand-200 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-[10px]">
                    {doc.type}
                  </div>
                  <div>
                    <p className="font-bold text-charcoal-900 truncate max-w-[200px]">{doc.name}</p>
                    <p className="text-[10px] text-charcoal-500">{doc.size} • Uploaded {doc.date}</p>
                  </div>
                </div>

                <a
                  href={doc.url}
                  download
                  className="p-2 text-brand-700 hover:bg-brand-50 rounded-lg transition-colors"
                  title="Download document"
                >
                  <Download className="w-4 h-4" />
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* ACTIVITY HISTORY AUDIT LOG */}
        <div className="bg-white rounded-2xl border border-surface-border p-6 shadow-xs">
          <h3 className="text-sm font-bold text-charcoal-900 mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4 text-brand-600" /> Immutable Activity Audit Log
          </h3>

          <div className="space-y-3 text-xs max-h-56 overflow-y-auto pr-2">
            {invoice.activityHistory?.map((act) => (
              <div key={act.id} className="flex items-start gap-3 pb-2 border-b border-gray-100">
                <div className="w-2 h-2 rounded-full bg-brand-600 mt-1.5 shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-charcoal-900">{act.title}</span>
                    <span className="text-[10px] text-charcoal-400">{act.timestamp}</span>
                  </div>
                  <p className="text-charcoal-600 mt-0.5">{act.description}</p>
                  <span className="text-[10px] text-brand-700 font-semibold">By: {act.actor}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
