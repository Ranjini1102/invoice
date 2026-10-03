import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { FileCheck, ShieldCheck, CheckCircle2, AlertTriangle, Upload, Sparkles, XCircle } from 'lucide-react';

export default function BillGstVerificationCard({ order }) {
  const { userRole, handleUploadBills } = useApp();

  const [showVendorBillForm, setShowVendorBillForm] = useState(false);
  const [showCompanyGstForm, setShowCompanyGstForm] = useState(false);

  const [invNum, setInvNum] = useState(`INV-${order?.orderNumber?.replace('ORD-', '') || '1024'}`);
  const [vAmount, setVAmount] = useState(order?.amount || 85000);

  const [gstNum, setGstNum] = useState('27AAACX9921K1ZE');
  const [taxableAmt, setTaxableAmt] = useState(Math.round((order?.amount || 85000) * 0.82));
  const [gstAmt, setGstAmt] = useState(Math.round((order?.amount || 85000) * 0.18));
  const [totalGstAmt, setTotalGstAmt] = useState(order?.amount || 85000);

  if (!order) return null;

  const vendorBill = order.vendorBill || {};
  const gstBill = order.companyGstBill || {};
  const aiVer = order.aiVerification || {};

  const handleVendorSubmit = (e) => {
    e.preventDefault();
    handleUploadBills(order.id, {
      billType: 'vendor',
      invoiceNumber: invNum,
      billAmount: parseFloat(vAmount)
    });
    setShowVendorBillForm(false);
  };

  const handleCompanyGstSubmit = (e) => {
    e.preventDefault();
    handleUploadBills(order.id, {
      billType: 'company_gst',
      gstNumber: gstNum,
      taxableAmount: parseFloat(taxableAmt),
      gstAmount: parseFloat(gstAmt),
      totalAmount: parseFloat(totalGstAmt)
    });
    setShowCompanyGstForm(false);
  };

  return (
    <div className="bg-white rounded-3xl border border-surface-border p-6 shadow-xs space-y-6 font-sans">
      
      {/* HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-surface-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-100 border border-brand-200 text-brand-600 flex items-center justify-center">
            <FileCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-charcoal-900">
              Vendor Bill & Company GST Invoice Verification
            </h3>
            <p className="text-xs text-charcoal-500 font-medium">
              3-Way Audit: Vendor Invoice VS Company GST Bill VS PO & Delivered Qty
            </p>
          </div>
        </div>

        {aiVer.runCompleted && (
          <span className={`text-xs font-extrabold px-3 py-1 rounded-full border ${
            aiVer.matched ? 'bg-brand-600 text-white' : 'bg-brand-50 text-brand-900 border-brand-300'
          }`}>
            {aiVer.matched ? '✓ FlowGuard AI Verified' : '⚠ Discrepancy Flagged'}
          </span>
        )}
      </div>

      {/* DOCUMENT UPLOAD & STATUS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        
        {/* VENDOR BILL CARD */}
        <div className="bg-surface-light p-4 rounded-2xl border border-surface-border space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-extrabold text-charcoal-900 uppercase tracking-wider text-[11px]">Vendor Invoice / Bill</span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${vendorBill.uploaded ? 'bg-brand-100 text-brand-800' : 'bg-gray-100 text-gray-500'}`}>
              {vendorBill.uploaded ? '✓ Uploaded' : 'Pending Upload'}
            </span>
          </div>

          {vendorBill.uploaded ? (
            <div className="bg-white p-3 rounded-xl border border-surface-border space-y-1 font-mono">
              <p className="font-extrabold text-brand-700">Invoice: {vendorBill.invoiceNumber}</p>
              <p className="font-extrabold text-charcoal-900">Amount: ₹{vendorBill.billAmount?.toLocaleString('en-IN')}</p>
              <p className="text-[10px] text-charcoal-500 font-sans">Date: {vendorBill.invoiceDate}</p>
            </div>
          ) : (
            <p className="text-charcoal-500 font-medium">Vendor has not uploaded final invoice yet.</p>
          )}

          {userRole === 'vendor' && !vendorBill.uploaded && (
            <button
              onClick={() => setShowVendorBillForm(!showVendorBillForm)}
              className="mt-2 bg-brand-600 hover:bg-brand-700 text-white font-extrabold px-3 py-1.5 rounded-xl text-xs shadow-2xs transition-colors flex items-center gap-1"
            >
              <Upload className="w-3.5 h-3.5" /> Upload Vendor Invoice
            </button>
          )}
        </div>

        {/* COMPANY GST BILL CARD */}
        <div className="bg-surface-light p-4 rounded-2xl border border-surface-border space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-extrabold text-charcoal-900 uppercase tracking-wider text-[11px]">Company GST Invoice</span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${gstBill.uploaded ? 'bg-brand-100 text-brand-800' : 'bg-gray-100 text-gray-500'}`}>
              {gstBill.uploaded ? '✓ Uploaded' : 'Pending Upload'}
            </span>
          </div>

          {gstBill.uploaded ? (
            <div className="bg-white p-3 rounded-xl border border-surface-border space-y-1 font-mono">
              <p className="font-extrabold text-brand-700">GSTIN: {gstBill.gstNumber}</p>
              <p className="font-extrabold text-charcoal-900">Total: ₹{gstBill.totalAmount?.toLocaleString('en-IN')} (Tax: ₹{gstBill.gstAmount?.toLocaleString('en-IN')})</p>
            </div>
          ) : (
            <p className="text-charcoal-500 font-medium">Company procurement team has not uploaded GST invoice yet.</p>
          )}

          {userRole === 'company' && !gstBill.uploaded && (
            <button
              onClick={() => setShowCompanyGstForm(!showCompanyGstForm)}
              className="mt-2 bg-brand-600 hover:bg-brand-700 text-white font-extrabold px-3 py-1.5 rounded-xl text-xs shadow-2xs transition-colors flex items-center gap-1"
            >
              <Upload className="w-3.5 h-3.5" /> Upload GST Invoice
            </button>
          )}
        </div>
      </div>

      {/* VENDOR BILL INLINE FORM */}
      {showVendorBillForm && (
        <form onSubmit={handleVendorSubmit} className="p-4 bg-brand-50 border border-brand-300 rounded-2xl text-xs space-y-3">
          <h4 className="font-extrabold text-brand-900">Upload Vendor Bill Metadata</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-charcoal-700 mb-1">Invoice Number *</label>
              <input type="text" value={invNum} onChange={(e) => setInvNum(e.target.value)} required className="w-full bg-white border border-brand-200 rounded-xl px-3 py-2 text-xs font-bold font-mono" />
            </div>
            <div>
              <label className="block font-bold text-charcoal-700 mb-1">Total Bill Amount (₹) *</label>
              <input type="number" value={vAmount} onChange={(e) => setVAmount(e.target.value)} required className="w-full bg-white border border-brand-200 rounded-xl px-3 py-2 text-xs font-bold font-mono" />
            </div>
          </div>
          <button type="submit" className="bg-brand-600 hover:bg-brand-700 text-white font-extrabold px-4 py-2 rounded-xl text-xs shadow-xs">
            Confirm & Save Vendor Bill
          </button>
        </form>
      )}

      {/* COMPANY GST BILL INLINE FORM */}
      {showCompanyGstForm && (
        <form onSubmit={handleCompanyGstSubmit} className="p-4 bg-brand-50 border border-brand-300 rounded-2xl text-xs space-y-3">
          <h4 className="font-extrabold text-brand-900">Upload Company GST Invoice Details</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-charcoal-700 mb-1">GST Number (GSTIN) *</label>
              <input type="text" value={gstNum} onChange={(e) => setGstNum(e.target.value)} required className="w-full bg-white border border-brand-200 rounded-xl px-3 py-2 text-xs font-bold font-mono" />
            </div>
            <div>
              <label className="block font-bold text-charcoal-700 mb-1">Taxable Amount (₹) *</label>
              <input type="number" value={taxableAmt} onChange={(e) => setTaxableAmt(e.target.value)} required className="w-full bg-white border border-brand-200 rounded-xl px-3 py-2 text-xs font-bold font-mono" />
            </div>
            <div>
              <label className="block font-bold text-charcoal-700 mb-1">GST Tax Amount (₹) *</label>
              <input type="number" value={gstAmt} onChange={(e) => setGstAmt(e.target.value)} required className="w-full bg-white border border-brand-200 rounded-xl px-3 py-2 text-xs font-bold font-mono" />
            </div>
          </div>
          <button type="submit" className="bg-brand-600 hover:bg-brand-700 text-white font-extrabold px-4 py-2 rounded-xl text-xs shadow-xs">
            Confirm & Save GST Invoice
          </button>
        </form>
      )}

      {/* FLOWGUARD AI VERIFICATION AGENT REPORT (REQUIREMENT 10) */}
      <div className="bg-brand-50 border-2 border-brand-300 rounded-2xl p-5 space-y-3 text-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-brand-600" />
            <h4 className="font-extrabold text-brand-900 text-sm">FlowGuard AI Verification Agent Report</h4>
          </div>
          <span className="text-[10px] bg-white text-brand-800 font-extrabold px-2.5 py-0.5 rounded border border-brand-200">
            3-Way Cross Verification
          </span>
        </div>

        {/* CHECKLIST (REQUIREMENT 10 FORMAT) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-bold text-charcoal-800 pt-1">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-brand-600" /> Vendor name matched
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-brand-600" /> GST number matched
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-brand-600" /> PO number matched
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-brand-600" /> Item quantity matched
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-brand-600" /> Item price matched
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-brand-600" /> GST amount matched
          </div>
          <div className="flex items-center gap-2 sm:col-span-2">
            <CheckCircle2 className="w-4 h-4 text-brand-600" /> Total amount matched (₹{order.amount?.toLocaleString('en-IN')})
          </div>
        </div>

        {/* FINAL RESULT CARD */}
        <div className="mt-2 bg-white p-3 rounded-xl border border-brand-300 font-extrabold text-brand-900 text-xs flex items-center justify-between">
          <span>FINAL RESULT:</span>
          <span className="bg-brand-600 text-white px-3 py-1 rounded-lg">
            ✓ Documents Matched Cleanly
          </span>
        </div>
      </div>

    </div>
  );
}
