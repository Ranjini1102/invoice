import React from 'react';
import { CheckCircle2, Clock, ShieldCheck, ArrowRight } from 'lucide-react';

export default function FlipkartTimeline({ invoice }) {
  if (!invoice || !invoice.timeline) return null;

  const currentStageIndex = invoice.stageIndex !== undefined ? invoice.stageIndex : 0;

  // Generate explicit waiting text for Requirement 1
  const getExplicitWaitingText = () => {
    switch (invoice.status) {
      case "Uploaded":
        return "Currently waiting for AI Document Scan & Extraction";
      case "AI Verified":
        return "Currently waiting for PO & Receipt Matching";
      case "Correction Required":
        return "Currently waiting for Vendor to upload Corrected Invoice";
      case "PO Matched":
      case "Approval Pending":
        return "Currently waiting for Company Review & Approval";
      case "Approved":
        return "Currently waiting for Treasury Payout Batching";
      case "Payment Processing":
        return "Payment is currently being processed by Treasury";
      case "Paid":
        return "Payment completed successfully. Funds transferred to vendor.";
      default:
        return `Current Stage: ${invoice.status}`;
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-surface-border p-6 shadow-xs space-y-6">
      
      {/* SUMMARY CARD ABOVE TIMELINE (REQUIREMENT 8) */}
      <div className="bg-brand-50 border border-brand-200 rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-lg text-charcoal-900 font-mono">
              INVOICE {invoice.invoiceNumber}
            </span>
            <span className="bg-brand-600 text-white text-xs px-2.5 py-0.5 rounded-full font-bold uppercase">
              {invoice.status}
            </span>
          </div>
          <p className="text-xs text-charcoal-600 mt-1 font-medium">
            Vendor: <span className="font-bold text-charcoal-900">{invoice.vendorName}</span> | Target Store: <span className="font-bold text-charcoal-900">{invoice.companyName}</span>
          </p>
        </div>

        <div className="text-right">
          <span className="text-xs text-charcoal-500 font-medium block">Total Payable Amount</span>
          <span className="text-2xl font-extrabold text-brand-700 font-mono">
            ₹{invoice.amount?.toLocaleString('en-IN')}
          </span>
          <p className="text-xs font-bold text-brand-800 mt-0.5 flex items-center justify-end gap-1">
            <span className="w-2 h-2 rounded-full bg-brand-600 animate-ping inline-block" />
            {getExplicitWaitingText()}
          </p>
        </div>
      </div>

      {/* HEADER & CURRENT STAGE PROMINENT BANNER (REQUIREMENT 1) */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-base font-extrabold text-charcoal-900 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-brand-600" />
            Flipkart-Style Invoice Tracking Timeline
          </h3>
          <span className="text-xs text-brand-700 font-bold bg-brand-100 px-2.5 py-1 rounded-full border border-brand-200">
            Real-Time Stage Audit
          </span>
        </div>

        {/* VISUALLY PROMINENT CURRENT STAGE BANNER */}
        <div className={`p-4 rounded-2xl border flex items-center gap-3 ${
          invoice.status === 'Paid' ? 'bg-brand-600 text-white border-brand-700' :
          invoice.status === 'Correction Required' ? 'bg-brand-100 text-brand-900 border-brand-300' :
          'bg-white border-2 border-brand-600 text-charcoal-900 shadow-sm'
        }`}>
          <div className={`w-4 h-4 rounded-full shrink-0 ${
            invoice.status === 'Paid' ? 'bg-white text-brand-600 flex items-center justify-center font-bold text-xs' :
            'bg-brand-600 animate-ping'
          }`}>
            {invoice.status === 'Paid' ? '✓' : ''}
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold uppercase tracking-wider opacity-90">Current Stage</span>
              <span className="text-xs font-bold bg-brand-500/20 px-2 py-0.5 rounded text-current">
                Stage {currentStageIndex + 1} of 7
              </span>
            </div>
            <h4 className="text-sm font-extrabold mt-0.5">
              {invoice.timeline[currentStageIndex]?.stage || invoice.status}
              {invoice.status !== 'Paid' && <span className="ml-2 text-xs font-normal opacity-90">— CURRENT STAGE</span>}
            </h4>
            <p className="text-xs opacity-90 mt-0.5 font-medium">
              "{getExplicitWaitingText()}"
            </p>
          </div>
        </div>
      </div>

      {/* VISUAL TIMELINE NODES (REQUIREMENT 1) */}
      <div className="relative py-4 overflow-x-auto">
        <div className="min-w-[680px]">
          
          {/* TRACKING STAGES ROW */}
          <div className="flex items-start justify-between relative">
            
            {/* BACKGROUND CONNECTING LINE */}
            <div className="absolute top-5 left-6 right-6 h-1 bg-gray-200 -z-0">
              <div
                className="h-full bg-brand-600 transition-all duration-500 rounded-full"
                style={{
                  width: `${(currentStageIndex / (invoice.timeline.length - 1)) * 100}%`
                }}
              />
            </div>

            {/* STAGE NODES */}
            {invoice.timeline.map((step, idx) => {
              const isDone = step.completed || idx < currentStageIndex;
              const isCurrent = idx === currentStageIndex && invoice.status !== 'Paid';
              const isPaidEnd = invoice.status === 'Paid' && idx === 6;

              return (
                <div key={idx} className="flex flex-col items-center relative z-10 w-24 text-center">
                  
                  {/* NODE INDICATOR ICON */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all shadow-xs ${
                    isDone || isPaidEnd
                      ? 'bg-brand-600 text-white ring-4 ring-brand-100'
                      : isCurrent
                      ? 'bg-brand-600 text-white ring-4 ring-brand-300 animate-bounce'
                      : 'bg-white border-2 border-gray-300 text-gray-400'
                  }`}>
                    {isDone || isPaidEnd ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : isCurrent ? (
                      <span className="w-3.5 h-3.5 bg-white rounded-full block" />
                    ) : (
                      <span className="text-xs">○</span>
                    )}
                  </div>

                  {/* STAGE TITLE */}
                  <h4 className={`text-xs font-extrabold mt-2 leading-tight ${
                    isDone || isCurrent || isPaidEnd ? 'text-charcoal-900' : 'text-gray-400'
                  }`}>
                    {step.completed ? `✓ ${step.stage}` : isCurrent ? `🟢 ${step.stage}` : `○ ${step.stage}`}
                  </h4>

                  {/* PROMINENT CURRENT TAG */}
                  {isCurrent && (
                    <span className="text-[9px] bg-brand-600 text-white font-extrabold px-1.5 py-0.5 rounded mt-1 shadow-2xs uppercase tracking-tighter">
                      CURRENT
                    </span>
                  )}

                  {/* DATE & TIME */}
                  <p className="text-[10px] text-charcoal-500 font-medium mt-1">
                    {step.date && step.date !== '-' ? step.date : ''}
                  </p>
                  {step.time && step.time !== '-' && (
                    <p className="text-[9px] text-charcoal-400">{step.time}</p>
                  )}
                </div>
              );
            })}
          </div>

          {/* AUDIT DETAILS LIST */}
          <div className="mt-8 space-y-2">
            <h4 className="text-xs font-bold text-charcoal-500 uppercase tracking-wider">
              Stage Audit Details
            </h4>

            {invoice.timeline.map((step, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-xl border transition-all text-xs flex flex-wrap items-center justify-between gap-3 ${
                  idx === currentStageIndex
                    ? 'bg-brand-50 border-2 border-brand-600 shadow-2xs font-bold'
                    : step.completed
                    ? 'bg-white border-surface-border'
                    : 'bg-gray-50/50 border-gray-100 opacity-60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-2.5 h-2.5 rounded-full ${
                    step.completed ? 'bg-brand-600' : idx === currentStageIndex ? 'bg-brand-600 animate-ping' : 'bg-gray-300'
                  }`} />
                  <div>
                    <span className="font-extrabold text-charcoal-900 mr-2">{step.stage}</span>
                    <span className="text-charcoal-500 text-[11px]">by {step.responsible}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {step.comment && (
                    <span className="bg-white border border-surface-border px-2.5 py-1 rounded-md text-charcoal-800 font-medium italic">
                      "{step.comment}"
                    </span>
                  )}
                  <span className="text-charcoal-500 text-[11px] font-mono">
                    {step.date} {step.time !== '-' ? step.time : ''}
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
