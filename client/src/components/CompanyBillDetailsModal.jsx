import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  FileText,
  Building2,
  UserCheck,
  CheckCircle2,
  Upload,
  Sparkles,
  Download,
  Image as ImageIcon,
  Printer,
  ShieldCheck,
  Calendar,
  CreditCard,
  FileCheck
} from 'lucide-react';

export default function CompanyBillDetailsModal({ order, isOpen, onClose }) {
  const { handleUploadBills, triggerGreenToast } = useApp();

  const [activeViewTab, setActiveViewTab] = useState('preview'); // 'preview' or 'edit'

  // Bill Form Fields
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [invoiceDate, setInvoiceDate] = useState('');
  const [gstNumber, setGstNumber] = useState('');
  const [taxableAmount, setTaxableAmount] = useState('');
  const [gstAmount, setGstAmount] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [hsnCode, setHsnCode] = useState('9403 / 4820');
  const [notes, setNotes] = useState('Tax Invoice verified against Purchase Order PO-8842.');
  const [billImageUploaded, setBillImageUploaded] = useState(true);

  useEffect(() => {
    if (order) {
      const vBill = order.vendorBill || {};
      const gBill = order.companyGstBill || {};
      const defaultAmt = order.amount || 85000;

      setInvoiceNumber(vBill.invoiceNumber || `INV-${order.orderNumber?.replace('ORD-', '') || '1024'}`);
      setInvoiceDate(vBill.invoiceDate || order.orderDate || '2026-10-05');
      setGstNumber(gBill.gstNumber || '29AAACA1234A1Z5');
      setTaxableAmount(gBill.taxableAmount || Math.round(defaultAmt * 0.82));
      setGstAmount(gBill.gstAmount || Math.round(defaultAmt * 0.18));
      setTotalAmount(vBill.billAmount || gBill.totalAmount || defaultAmt);
    }
  }, [order]);

  if (!isOpen || !order) return null;

  const handleSaveBillDetails = (e) => {
    e.preventDefault();

    // Save Vendor Bill info & Company GST info
    handleUploadBills(order.id, {
      billType: 'vendor',
      invoiceNumber,
      billAmount: parseFloat(totalAmount)
    });

    handleUploadBills(order.id, {
      billType: 'company_gst',
      gstNumber,
      taxableAmount: parseFloat(taxableAmount),
      gstAmount: parseFloat(gstAmount),
      totalAmount: parseFloat(totalAmount)
    });

    triggerGreenToast(
      '✓ Bill Details Saved & Verified',
      `Saved Tax Invoice ${invoiceNumber} for Order ${order.orderNumber}.`,
      'FlowGuard AI Verification Agent matched PO & GST 100%.'
    );

    setActiveViewTab('preview');
  };

  const isPaid = order.status === 'Paid';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-900/60 backdrop-blur-xs animate-in fade-in duration-200 font-sans">
      <div className="bg-white rounded-3xl border border-brand-200 shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* MODAL HEADER */}
        <div className="px-6 py-4 bg-white border-b border-surface-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-100 border border-brand-200 text-brand-700 flex items-center justify-center font-bold">
              <FileText className="w-6 h-6 text-brand-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-extrabold text-charcoal-900">
                  Vendor Bill & Tax Invoice Details
                </h2>
                <span className="bg-brand-100 text-brand-800 text-[10px] px-2.5 py-0.5 rounded-full font-extrabold border border-brand-200 uppercase">
                  Order {order.orderNumber}
                </span>
              </div>
              <p className="text-xs text-charcoal-500 font-medium">
                Vendor: <span className="font-bold text-charcoal-800">{order.vendorName}</span> ({order.vendorId})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* VIEW TOGGLE TABS */}
            <div className="flex items-center bg-surface-light p-1 rounded-xl border border-surface-border text-xs font-extrabold">
              <button
                onClick={() => setActiveViewTab('preview')}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 ${
                  activeViewTab === 'preview'
                    ? 'bg-brand-600 text-white shadow-xs'
                    : 'text-charcoal-600 hover:text-charcoal-900'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" /> View Bill Image
              </button>

              <button
                onClick={() => setActiveViewTab('edit')}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 ${
                  activeViewTab === 'edit'
                    ? 'bg-brand-600 text-white shadow-xs'
                    : 'text-charcoal-600 hover:text-charcoal-900'
                }`}
              >
                <FileCheck className="w-3.5 h-3.5" /> Edit Bill Details
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-charcoal-400 hover:text-charcoal-700 hover:bg-surface-light transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* MODAL BODY CONTENT */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* TAB 1: VISUAL BILL DOCUMENT IMAGE PREVIEW */}
          {activeViewTab === 'preview' && (
            <div className="space-y-6">
              
              {/* TOP ACTION STRIP */}
              <div className="bg-brand-50 p-4 rounded-2xl border border-brand-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-brand-900 font-extrabold">
                  <ShieldCheck className="w-5 h-5 text-brand-600" />
                  <span>3-Way AI Document Match Status:</span>
                  <span className="bg-brand-600 text-white px-2.5 py-0.5 rounded-full text-[11px]">
                    ✓ 100% Matched & Verified
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => window.print()}
                    className="bg-white border border-brand-300 text-brand-800 hover:bg-brand-100 font-bold px-3 py-1.5 rounded-xl transition-all flex items-center gap-1"
                  >
                    <Printer className="w-3.5 h-3.5" /> Print Bill
                  </button>

                  <button
                    onClick={() => triggerGreenToast('Downloading Bill', `Downloading PDF Invoice ${invoiceNumber}...`)}
                    className="bg-brand-600 hover:bg-brand-700 text-white font-extrabold px-3 py-1.5 rounded-xl shadow-xs transition-all flex items-center gap-1"
                  >
                    <Download className="w-3.5 h-3.5" /> Download Tax Invoice PDF
                  </button>
                </div>
              </div>

              {/* SIMULATED HIGH-FIDELITY TAX INVOICE DOCUMENT IMAGE */}
              <div className="bg-white border-2 border-charcoal-200 rounded-2xl p-8 shadow-md text-charcoal-900 font-sans space-y-6 relative overflow-hidden">
                
                {/* VERIFIED WATERMARK STAMP */}
                <div className="absolute top-12 right-12 border-4 border-brand-600 text-brand-600 font-black text-xs px-4 py-2 rounded-xl rotate-12 uppercase tracking-widest opacity-80 pointer-events-none flex items-center gap-1">
                  <CheckCircle2 className="w-5 h-5" /> FlowGuard AI Verified
                </div>

                {/* INVOICE HEADER BLOCK */}
                <div className="flex justify-between items-start border-b-2 border-charcoal-900 pb-6">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-brand-600 text-white font-bold flex items-center justify-center text-sm">
                        {order.vendorId?.substring(0, 2) || 'VB'}
                      </div>
                      <h1 className="text-xl font-extrabold tracking-tight text-charcoal-900">
                        {order.vendorName}
                      </h1>
                    </div>
                    <p className="text-xs text-charcoal-600 font-medium mt-1">124 Industrial Estate, Hubli, KA - 580021</p>
                    <p className="text-xs text-brand-700 font-mono font-bold mt-0.5">GSTIN: {gstNumber}</p>
                    <p className="text-xs text-charcoal-600 font-medium">Email: vendor.abc@flowguard.ai | Phone: +91 98765 43210</p>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-black text-brand-800 uppercase tracking-widest bg-brand-100 px-3 py-1 rounded-md inline-block mb-2 border border-brand-300">
                      TAX INVOICE
                    </span>
                    <p className="text-sm font-extrabold text-charcoal-900 font-mono">Invoice #: {invoiceNumber}</p>
                    <p className="text-xs text-charcoal-600 font-bold">Date: {invoiceDate}</p>
                    <p className="text-xs text-brand-700 font-mono font-bold mt-1">PO Reference: {order.poNumber || 'PO-8842'}</p>
                  </div>
                </div>

                {/* BILL TO & SHIP TO SECTION */}
                <div className="grid grid-cols-2 gap-6 bg-surface-light p-4 rounded-xl border border-surface-border text-xs">
                  <div>
                    <span className="font-extrabold text-charcoal-500 uppercase tracking-wider text-[10px] block mb-1">Billed To (Buyer):</span>
                    <p className="font-extrabold text-charcoal-900">{order.companyName || 'XYZ Company Procurement Unit'}</p>
                    <p className="text-charcoal-600 font-medium">XYZ Tech Park, Whitefield, Bengaluru, KA</p>
                    <p className="text-brand-700 font-mono font-bold">GSTIN: 29XYZCO9988C1Z1</p>
                  </div>

                  <div>
                    <span className="font-extrabold text-charcoal-500 uppercase tracking-wider text-[10px] block mb-1">Dispatch Logistics:</span>
                    <p className="font-extrabold text-charcoal-900">Tracking #: {order.trackingNumber || 'TRK-IND-991823'}</p>
                    <p className="text-charcoal-600 font-medium">Courier: FlowGuard Logistics Express</p>
                    <p className="text-brand-700 font-bold">Delivery Status: {order.status}</p>
                  </div>
                </div>

                {/* ITEMIZED TABLE */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-charcoal-900 text-white font-extrabold text-[11px]">
                        <th className="p-2.5">#</th>
                        <th className="p-2.5">Item Description</th>
                        <th className="p-2.5">HSN Code</th>
                        <th className="p-2.5 text-center">Qty</th>
                        <th className="p-2.5 text-right">Unit Price</th>
                        <th className="p-2.5 text-right">Total (₹)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 font-medium text-charcoal-800">
                      {(order.items || []).map((item, idx) => (
                        <tr key={item.id || idx}>
                          <td className="p-2.5 font-bold text-charcoal-500">{idx + 1}</td>
                          <td className="p-2.5 font-bold text-charcoal-900">{item.name}</td>
                          <td className="p-2.5 font-mono text-charcoal-500">{hsnCode}</td>
                          <td className="p-2.5 text-center font-bold">{item.expectedQty}</td>
                          <td className="p-2.5 text-right font-mono">₹{item.unitPrice?.toLocaleString('en-IN')}</td>
                          <td className="p-2.5 text-right font-mono font-bold">
                            ₹{(item.expectedQty * item.unitPrice)?.toLocaleString('en-IN')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* TAX BREAKDOWN & GRAND TOTAL */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 pt-4 border-t border-surface-border">
                  <div className="text-xs text-charcoal-600 space-y-1 max-w-sm">
                    <p className="font-bold text-charcoal-900">Payment Terms: NEFT / RTGS Bank Transfer</p>
                    <p className="text-[11px]">Bank: HDFC Bank Whitefield Branch | IFSC: HDFC0001024</p>
                    <p className="text-[11px]">Account #: 502000192847291</p>
                  </div>

                  <div className="w-full sm:w-72 bg-brand-50/70 p-4 rounded-xl border border-brand-200 text-xs space-y-2 font-mono">
                    <div className="flex justify-between text-charcoal-700 font-bold">
                      <span>Subtotal (Taxable):</span>
                      <span>₹{parseFloat(taxableAmount || 0).toLocaleString('en-IN')}</span>
                    </div>

                    <div className="flex justify-between text-charcoal-700 font-bold">
                      <span>IGST Tax (18%):</span>
                      <span>₹{parseFloat(gstAmount || 0).toLocaleString('en-IN')}</span>
                    </div>

                    <div className="flex justify-between text-brand-900 font-black text-sm pt-2 border-t border-brand-300">
                      <span>Grand Total:</span>
                      <span className="text-brand-700">₹{parseFloat(totalAmount || 0).toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>

                {/* FOOTER SIGNATURE & VERIFICATION */}
                <div className="pt-6 border-t border-dashed border-gray-300 flex justify-between items-center text-[10px] text-charcoal-500">
                  <div className="flex items-center gap-2">
                    <div className="w-12 h-12 bg-gray-100 rounded border border-gray-300 flex items-center justify-center font-bold text-gray-400">
                      [QR CODE]
                    </div>
                    <div>
                      <p className="font-bold text-charcoal-700">FlowGuard E-Invoice QR Verified</p>
                      <p>IRN: 8a7b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="font-bold text-charcoal-800">Authorized Signatory</p>
                    <p className="italic text-charcoal-500 mt-4">Signed digitally for {order.vendorName}</p>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB 2: PAGE / FORM TO EDIT BILL DETAILS FOR VENDOR */}
          {activeViewTab === 'edit' && (
            <form onSubmit={handleSaveBillDetails} className="space-y-6">
              
              <div className="bg-brand-50 p-4 rounded-2xl border border-brand-200 text-xs text-brand-900 font-bold">
                Enter or update Vendor Bill metadata & Company GST Invoice breakdown. Submitting updates FlowGuard AI 3-way match.
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                
                {/* BILL NUMBER */}
                <div>
                  <label className="block font-extrabold text-charcoal-800 mb-1">Vendor Invoice / Bill Number *</label>
                  <input
                    type="text"
                    value={invoiceNumber}
                    onChange={(e) => setInvoiceNumber(e.target.value)}
                    required
                    className="w-full bg-surface-light border border-surface-border rounded-xl px-3.5 py-2.5 text-xs text-charcoal-900 font-bold font-mono focus:ring-2 focus:ring-brand-600"
                  />
                </div>

                {/* INVOICE DATE */}
                <div>
                  <label className="block font-extrabold text-charcoal-800 mb-1">Invoice Date *</label>
                  <input
                    type="date"
                    value={invoiceDate}
                    onChange={(e) => setInvoiceDate(e.target.value)}
                    required
                    className="w-full bg-surface-light border border-surface-border rounded-xl px-3.5 py-2.5 text-xs text-charcoal-900 font-bold focus:ring-2 focus:ring-brand-600"
                  />
                </div>

                {/* VENDOR GSTIN */}
                <div>
                  <label className="block font-extrabold text-charcoal-800 mb-1">GSTIN Registration Number *</label>
                  <input
                    type="text"
                    value={gstNumber}
                    onChange={(e) => setGstNumber(e.target.value)}
                    required
                    className="w-full bg-surface-light border border-surface-border rounded-xl px-3.5 py-2.5 text-xs text-brand-800 font-bold font-mono focus:ring-2 focus:ring-brand-600"
                  />
                </div>

                {/* HSN CODE */}
                <div>
                  <label className="block font-extrabold text-charcoal-800 mb-1">HSN / SAC Tax Classification Code</label>
                  <input
                    type="text"
                    value={hsnCode}
                    onChange={(e) => setHsnCode(e.target.value)}
                    className="w-full bg-surface-light border border-surface-border rounded-xl px-3.5 py-2.5 text-xs text-charcoal-900 font-bold font-mono focus:ring-2 focus:ring-brand-600"
                  />
                </div>

                {/* TAXABLE AMOUNT */}
                <div>
                  <label className="block font-extrabold text-charcoal-800 mb-1">Taxable Subtotal Amount (₹) *</label>
                  <input
                    type="number"
                    value={taxableAmount}
                    onChange={(e) => setTaxableAmount(e.target.value)}
                    required
                    className="w-full bg-surface-light border border-surface-border rounded-xl px-3.5 py-2.5 text-xs text-charcoal-900 font-bold font-mono focus:ring-2 focus:ring-brand-600"
                  />
                </div>

                {/* GST TAX AMOUNT */}
                <div>
                  <label className="block font-extrabold text-charcoal-800 mb-1">GST Tax Amount (18% IGST) (₹) *</label>
                  <input
                    type="number"
                    value={gstAmount}
                    onChange={(e) => setGstAmount(e.target.value)}
                    required
                    className="w-full bg-surface-light border border-surface-border rounded-xl px-3.5 py-2.5 text-xs text-charcoal-900 font-bold font-mono focus:ring-2 focus:ring-brand-600"
                  />
                </div>

                {/* GRAND TOTAL */}
                <div className="md:col-span-2">
                  <label className="block font-extrabold text-brand-900 mb-1">Grand Total Payable Bill Amount (₹) *</label>
                  <input
                    type="number"
                    value={totalAmount}
                    onChange={(e) => setTotalAmount(e.target.value)}
                    required
                    className="w-full bg-brand-50 border-2 border-brand-300 rounded-xl px-4 py-3 text-sm text-brand-900 font-black font-mono focus:ring-2 focus:ring-brand-600"
                  />
                </div>

                {/* UPLOAD BILL IMAGE FILE BOX */}
                <div className="md:col-span-2 bg-surface-light p-4 rounded-2xl border border-dashed border-brand-300 text-center space-y-2">
                  <Upload className="w-8 h-8 text-brand-600 mx-auto" />
                  <p className="font-extrabold text-charcoal-900 text-xs">Upload Vendor Bill Image / PDF Attachment</p>
                  <p className="text-[11px] text-charcoal-500 font-medium">Supports JPG, PNG, PDF up to 10MB</p>
                  <button
                    type="button"
                    onClick={() => triggerGreenToast('Image Attached', `Attached bill scan file for ${invoiceNumber}.`)}
                    className="bg-white border border-brand-300 hover:bg-brand-50 text-brand-800 font-extrabold px-4 py-2 rounded-xl text-xs shadow-2xs transition-colors inline-flex items-center gap-1.5"
                  >
                    <ImageIcon className="w-4 h-4 text-brand-600" /> Choose Bill Scan Image
                  </button>
                </div>

                {/* NOTES */}
                <div className="md:col-span-2">
                  <label className="block font-bold text-charcoal-700 mb-1">Verification Audit Notes</label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full bg-surface-light border border-surface-border rounded-xl px-3.5 py-2.5 text-xs text-charcoal-900 font-medium focus:ring-2 focus:ring-brand-600"
                  />
                </div>

              </div>

              {/* SAVE BUTTON */}
              <div className="flex justify-end gap-3 pt-3 border-t border-surface-border">
                <button
                  type="button"
                  onClick={onClose}
                  className="bg-white border border-surface-border hover:bg-surface-light text-charcoal-800 font-extrabold px-5 py-2.5 rounded-xl text-xs transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="bg-brand-600 hover:bg-brand-700 text-white font-extrabold px-6 py-2.5 rounded-xl text-xs shadow-md transition-all flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" /> Save & Verify Bill Details
                </button>
              </div>

            </form>
          )}

        </div>

      </div>
    </div>
  );
}
