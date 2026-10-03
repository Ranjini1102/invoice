import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PackageCheck, AlertTriangle, CheckCircle2, Upload, ArrowRight } from 'lucide-react';

export default function ReceivedItemVerificationCard({ order }) {
  const { userRole, handleConfirmReceiving } = useApp();

  const [showIssueForm, setShowIssueForm] = useState(false);
  const [issueType, setIssueType] = useState('Quantity Mismatch');
  const [issueDescription, setIssueDescription] = useState('Received 18 Office Chairs instead of 20.');
  const [itemsState, setItemsState] = useState(
    (order?.items || []).map(it => ({ ...it, receivedQty: it.receivedQty !== undefined ? it.receivedQty : it.expectedQty }))
  );

  if (!order) return null;

  const receiving = order.receivingVerification || {};

  const handleQtyChange = (id, val) => {
    setItemsState(prev => prev.map(it => it.id === id ? { ...it, receivedQty: val } : it));
  };

  const handleConfirmEverythingReceived = () => {
    handleConfirmReceiving(order.id, {
      confirmed: true,
      hasIssue: false,
      itemsReceived: order.items.map(it => ({ ...it, receivedQty: it.expectedQty }))
    });
  };

  const handleSubmitIssueReport = (e) => {
    e.preventDefault();
    handleConfirmReceiving(order.id, {
      confirmed: true,
      hasIssue: true,
      issueType,
      issueDescription,
      itemsReceived: itemsState
    });
    setShowIssueForm(false);
  };

  return (
    <div className="bg-white rounded-3xl border border-surface-border p-6 shadow-xs space-y-4 font-sans">
      
      {/* HEADER */}
      <div className="flex items-center justify-between pb-3 border-b border-surface-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-100 border border-brand-200 text-brand-600 flex items-center justify-center">
            <PackageCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-charcoal-900">
              Received Item Verification & Physical Goods Count
            </h3>
            <p className="text-xs text-charcoal-500 font-medium">
              Confirm item quantities received at delivery dock before bill verification
            </p>
          </div>
        </div>

        {receiving.confirmed && (
          <span className={`text-xs font-extrabold px-3 py-1 rounded-full border ${
            receiving.hasIssue ? 'bg-brand-50 text-brand-900 border-brand-300' : 'bg-brand-100 text-brand-800 border-brand-200'
          }`}>
            {receiving.hasIssue ? '⚠ Delivery Issue Logged' : '✓ Verified 100% Correct'}
          </span>
        )}
      </div>

      {/* ITEMS LIST SUMMARY */}
      <div className="space-y-2 text-xs">
        <h4 className="font-extrabold text-charcoal-700 uppercase tracking-wider">Consignment Item Manifest</h4>

        <div className="border border-surface-border rounded-2xl overflow-hidden divide-y divide-gray-100">
          <div className="bg-surface-light p-3 font-bold text-charcoal-500 uppercase tracking-wider text-[10px] grid grid-cols-12">
            <span className="col-span-5">Item Description</span>
            <span className="col-span-3 text-center">Expected Qty</span>
            <span className="col-span-4 text-right">Received Count</span>
          </div>

          {order.items?.map((it) => {
            const hasMismatch = it.receivedQty !== undefined && it.receivedQty < it.expectedQty;
            return (
              <div key={it.id} className={`p-3 grid grid-cols-12 items-center font-semibold ${hasMismatch ? 'bg-brand-50/70 text-brand-900' : 'text-charcoal-900'}`}>
                <span className="col-span-5 font-bold">{it.name}</span>
                <span className="col-span-3 text-center font-mono">{it.expectedQty} units</span>
                <span className="col-span-4 text-right font-mono font-extrabold">
                  {hasMismatch ? (
                    <span className="text-brand-900 bg-brand-100 px-2 py-0.5 rounded border border-brand-300">
                      ⚠ {it.receivedQty} received ({it.expectedQty - it.receivedQty} missing)
                    </span>
                  ) : (
                    <span>✓ {it.receivedQty || it.expectedQty} received</span>
                  )}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* VERIFICATION PROMPT FOR VENDOR (REQUIREMENT 6) */}
      {userRole === 'vendor' && !receiving.confirmed && (
        <div className="p-5 rounded-2xl bg-brand-50 border-2 border-brand-200 space-y-4">
          <div className="flex items-center gap-3">
            <PackageCheck className="w-6 h-6 text-brand-600 shrink-0" />
            <div>
              <h4 className="text-sm font-extrabold text-charcoal-900">Did you receive all items correctly?</h4>
              <p className="text-xs text-charcoal-600 mt-0.5">
                Verify consignment physical box count and inspect for damages before approving bill.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              onClick={handleConfirmEverythingReceived}
              className="bg-brand-600 hover:bg-brand-700 text-white font-extrabold px-5 py-2.5 rounded-xl text-xs shadow-md transition-all flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" /> Yes, Everything Received
            </button>

            <button
              onClick={() => setShowIssueForm(!showIssueForm)}
              className="bg-white hover:bg-brand-100 text-brand-900 border-2 border-brand-300 font-extrabold px-4 py-2.5 rounded-xl text-xs transition-all flex items-center gap-2"
            >
              <AlertTriangle className="w-4 h-4 text-brand-600" /> Report an Issue
            </button>
          </div>
        </div>
      )}

      {/* REPORT ISSUE FORM INLINE */}
      {showIssueForm && (
        <form onSubmit={handleSubmitIssueReport} className="p-5 rounded-2xl bg-white border-2 border-brand-600 shadow-sm space-y-4 text-xs">
          <h4 className="font-extrabold text-charcoal-900 text-sm flex items-center gap-2 border-b border-gray-100 pb-2">
            <AlertTriangle className="w-5 h-5 text-brand-600" /> Report Delivery Issue / Missing Items
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-charcoal-700 mb-1">Select Issue Category</label>
              <select
                value={issueType}
                onChange={(e) => setIssueType(e.target.value)}
                className="w-full bg-surface-light border border-brand-200 rounded-xl px-3 py-2 text-xs font-bold text-charcoal-900"
              >
                <option value="Quantity Mismatch">Quantity Mismatch (Missing Items)</option>
                <option value="Damaged Item">Damaged Item</option>
                <option value="Wrong Item">Wrong Item / Mis-shipment</option>
                <option value="Other Issue">Other Delivery Issue</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-charcoal-700 mb-1">Actual Quantity Received</label>
              <input
                type="number"
                value={itemsState[0]?.receivedQty || 18}
                onChange={(e) => handleQtyChange(itemsState[0]?.id, e.target.value)}
                className="w-full bg-surface-light border border-brand-200 rounded-xl px-3 py-2 text-xs font-mono font-bold text-brand-700"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-charcoal-700 mb-1">Issue Description & Proof Details</label>
            <textarea
              value={issueDescription}
              onChange={(e) => setIssueDescription(e.target.value)}
              rows={2}
              className="w-full bg-surface-light border border-brand-200 rounded-xl px-3 py-2 text-xs text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-brand-600"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              className="bg-surface-light hover:bg-brand-50 border border-surface-border text-charcoal-700 font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1"
            >
              <Upload className="w-3.5 h-3.5 text-brand-600" /> Upload Proof Photo
            </button>

            <button
              type="submit"
              className="bg-brand-600 hover:bg-brand-700 text-white font-extrabold px-5 py-2.5 rounded-xl text-xs shadow-xs"
            >
              Submit Issue Report to Company
            </button>
          </div>
        </form>
      )}

      {/* CONFIRMED ISSUE REPORT DISPLAY */}
      {receiving.hasIssue && (
        <div className="p-4 rounded-2xl bg-brand-50 border border-brand-300 text-xs text-brand-900 space-y-2">
          <div className="flex items-center gap-2 font-extrabold text-brand-800 text-sm">
            <AlertTriangle className="w-5 h-5 text-brand-600" />
            <span>⚠ Delivery Discrepancy Logged: {receiving.issueType}</span>
          </div>
          <p className="font-bold">{receiving.issueDescription || "2 chairs missing from delivery."}</p>
          <span className="text-[11px] bg-white text-brand-800 px-2 py-0.5 rounded font-extrabold border border-brand-200 inline-block">
            Status: {order.returnReplacement?.status || 'Company Reviewing'}
          </span>
        </div>
      )}

    </div>
  );
}
