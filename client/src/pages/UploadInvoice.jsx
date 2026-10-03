import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Upload, FileText, CheckCircle2, AlertTriangle, ShieldCheck, Sparkles } from 'lucide-react';

export default function UploadInvoice() {
  const { handleUploadInvoice, userRole } = useApp();

  const [formData, setFormData] = useState({
    invoiceNumber: `INV-${Math.floor(1000 + Math.random() * 9000)}`,
    vendorName: userRole === 'vendor' ? 'ABC Supplies' : 'TechCorp Vendor',
    companyName: 'XYZ Manufacturing',
    amount: '52000',
    invoiceDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 7*24*60*60*1000).toISOString().split('T')[0],
    poNumber: 'PO-8842',
    poAmount: '52000'
  });

  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer?.files?.[0]) {
      setFileName(e.dataTransfer.files[0].name);
      triggerSimulatedScan();
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files?.[0]) {
      setFileName(e.target.files[0].name);
      triggerSimulatedScan();
    }
  };

  const triggerSimulatedScan = () => {
    setIsScanning(true);
    setScanProgress(10);
    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          return 100;
        }
        return prev + 25;
      });
    }, 250);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleUploadInvoice(formData);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* HEADER */}
      <div className="bg-white rounded-3xl border border-surface-border p-6 shadow-xs text-center sm:text-left flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="bg-brand-100 text-brand-800 text-xs font-bold px-3 py-1 rounded-full border border-brand-200 uppercase">
            AI Automated Upload
          </span>
          <h1 className="text-2xl font-extrabold text-charcoal-900 mt-2">
            Upload Invoice & Supporting Documents
          </h1>
          <p className="text-xs text-charcoal-600 mt-1">
            FlowGuard AI automatically extracts key fields and matches against Purchase Orders in real-time.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-brand-50 px-3 py-2 rounded-xl border border-brand-200">
          <ShieldCheck className="w-5 h-5 text-brand-600" />
          <span className="text-xs font-bold text-brand-900">Zero-Data Loss Encryption</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* FILE DROP ZONE */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleFileDrop}
          className={`bg-white rounded-3xl border-2 border-dashed p-8 text-center transition-all ${
            dragActive ? 'border-brand-600 bg-brand-50/50 scale-[0.99]' : 'border-brand-200 hover:border-brand-400'
          }`}
        >
          <div className="w-16 h-16 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center mx-auto mb-3 border-2 border-brand-200">
            <Upload className="w-8 h-8" />
          </div>

          <h3 className="text-sm font-bold text-charcoal-900">
            Drag & Drop Invoice PDF / Receipt or Browse File
          </h3>
          <p className="text-xs text-charcoal-500 mt-1">Supports PDF, PNG, JPG up to 25MB</p>

          <label className="mt-4 inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-xs cursor-pointer transition-colors">
            <FileText className="w-4 h-4" /> Browse Document
            <input type="file" onChange={handleFileSelect} className="hidden" accept=".pdf,.png,.jpg,.jpeg" />
          </label>

          {fileName && (
            <div className="mt-4 p-3 bg-brand-50 rounded-xl inline-flex items-center gap-2 text-xs font-bold text-brand-900 border border-brand-200">
              <CheckCircle2 className="w-4 h-4 text-brand-600" /> Selected: {fileName}
            </div>
          )}

          {/* SIMULATED SCANNING PROGRESS BAR */}
          {isScanning && (
            <div className="mt-4 max-w-md mx-auto space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-brand-800">
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-brand-600 animate-spin" /> FlowGuard OCR Scanning...
                </span>
                <span>{scanProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                <div className="bg-brand-600 h-full transition-all duration-300 rounded-full" style={{ width: `${scanProgress}%` }} />
              </div>
            </div>
          )}
        </div>

        {/* INVOICE FORM FIELDS CARD */}
        <div className="bg-white rounded-3xl border border-surface-border p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-charcoal-900 pb-2 border-b border-surface-border">
            Invoice Metadata & Field Verification
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-charcoal-700 mb-1">Invoice Number *</label>
              <input
                type="text"
                name="invoiceNumber"
                value={formData.invoiceNumber}
                onChange={handleChange}
                required
                className="w-full bg-surface-light border border-surface-border rounded-xl px-3 py-2 text-xs text-charcoal-900 font-mono font-bold focus:ring-2 focus:ring-brand-600"
              />
            </div>

            <div>
              <label className="block font-semibold text-charcoal-700 mb-1">Vendor Name *</label>
              <input
                type="text"
                name="vendorName"
                value={formData.vendorName}
                onChange={handleChange}
                required
                className="w-full bg-surface-light border border-surface-border rounded-xl px-3 py-2 text-xs text-charcoal-900 focus:ring-2 focus:ring-brand-600"
              />
            </div>

            <div>
              <label className="block font-semibold text-charcoal-700 mb-1">Target Company / Store *</label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                required
                className="w-full bg-surface-light border border-surface-border rounded-xl px-3 py-2 text-xs text-charcoal-900 focus:ring-2 focus:ring-brand-600"
              />
            </div>

            <div>
              <label className="block font-semibold text-charcoal-700 mb-1">Invoice Amount (₹) *</label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                required
                className="w-full bg-surface-light border border-surface-border rounded-xl px-3 py-2 text-xs text-charcoal-900 font-bold font-mono focus:ring-2 focus:ring-brand-600"
              />
            </div>

            <div>
              <label className="block font-semibold text-charcoal-700 mb-1">Invoice Date *</label>
              <input
                type="date"
                name="invoiceDate"
                value={formData.invoiceDate}
                onChange={handleChange}
                required
                className="w-full bg-surface-light border border-surface-border rounded-xl px-3 py-2 text-xs text-charcoal-900 focus:ring-2 focus:ring-brand-600"
              />
            </div>

            <div>
              <label className="block font-semibold text-charcoal-700 mb-1">Payment Due Date *</label>
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                required
                className="w-full bg-surface-light border border-surface-border rounded-xl px-3 py-2 text-xs text-charcoal-900 focus:ring-2 focus:ring-brand-600"
              />
            </div>

            <div>
              <label className="block font-semibold text-charcoal-700 mb-1">Purchase Order (PO) Number</label>
              <input
                type="text"
                name="poNumber"
                value={formData.poNumber}
                onChange={handleChange}
                className="w-full bg-surface-light border border-surface-border rounded-xl px-3 py-2 text-xs text-charcoal-900 font-mono focus:ring-2 focus:ring-brand-600"
              />
            </div>

            <div>
              <label className="block font-semibold text-charcoal-700 mb-1">PO Reference Amount (₹)</label>
              <input
                type="number"
                name="poAmount"
                value={formData.poAmount}
                onChange={handleChange}
                className="w-full bg-surface-light border border-surface-border rounded-xl px-3 py-2 text-xs text-charcoal-900 font-mono focus:ring-2 focus:ring-brand-600"
              />
            </div>
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <div className="text-right">
          <button
            type="submit"
            className="bg-brand-600 hover:bg-brand-700 text-white font-extrabold px-8 py-3 rounded-2xl text-sm shadow-md transition-all inline-flex items-center gap-2"
          >
            <ShieldCheck className="w-5 h-5" /> Process & Submit Invoice
          </button>
        </div>

      </form>

    </div>
  );
}
