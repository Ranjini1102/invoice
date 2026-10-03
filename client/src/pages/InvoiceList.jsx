import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { FileText, Search, Filter, CheckCircle2, ArrowRight } from 'lucide-react';

export default function InvoiceList() {
  const { invoices, setSelectedInvoiceId, setActiveTab } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch =
      inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.companyName.toLowerCase().includes(searchTerm.toLowerCase());

    if (statusFilter === 'ALL') return matchesSearch;
    if (statusFilter === 'PAID') return matchesSearch && inv.status === 'Paid';
    if (statusFilter === 'PENDING') return matchesSearch && (inv.status === 'PO Matched' || inv.status === 'Approval Pending' || inv.status === 'Uploaded');
    if (statusFilter === 'PROCESSING') return matchesSearch && inv.status === 'Payment Processing';
    if (statusFilter === 'CORRECTION') return matchesSearch && inv.status === 'Correction Required';

    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* HEADER & SEARCH BAR */}
      <div className="bg-white rounded-3xl border border-surface-border p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-charcoal-900">
            Enterprise Invoice Registry
          </h1>
          <p className="text-xs text-charcoal-600 mt-1">
            Search, filter, and track invoices across vendor and store pipelines.
          </p>
        </div>

        {/* SEARCH INPUT */}
        <div className="relative min-w-[280px]">
          <Search className="w-4 h-4 text-charcoal-500 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Invoice #, Vendor, or Company..."
            className="w-full bg-surface-light border border-surface-border rounded-xl pl-9 pr-4 py-2.5 text-xs text-charcoal-900 placeholder-charcoal-500 focus:outline-none focus:ring-2 focus:ring-brand-600"
          />
        </div>
      </div>

      {/* FILTER TABS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {[
          { id: 'ALL', label: 'All Invoices' },
          { id: 'PENDING', label: 'Pending Review' },
          { id: 'PROCESSING', label: 'Payment Processing' },
          { id: 'PAID', label: '🎉 Paid / Settled' },
          { id: 'CORRECTION', label: 'Correction Required' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setStatusFilter(tab.id)}
            className={`px-3.5 py-2 rounded-xl font-bold transition-all shrink-0 ${
              statusFilter === tab.id
                ? 'bg-brand-600 text-white shadow-xs'
                : 'bg-white text-charcoal-700 hover:bg-surface-light border border-surface-border'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* INVOICES TABLE */}
      <div className="bg-white rounded-3xl border border-surface-border p-6 shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-surface-border text-charcoal-500 uppercase tracking-wider text-[10px] bg-surface-light">
                <th className="p-3 font-bold">Invoice #</th>
                <th className="p-3 font-bold">Vendor</th>
                <th className="p-3 font-bold">Company / Store</th>
                <th className="p-3 font-bold">Amount</th>
                <th className="p-3 font-bold">Invoice Date</th>
                <th className="p-3 font-bold">Due Date</th>
                <th className="p-3 font-bold">Flipkart-Style Stage</th>
                <th className="p-3 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium text-charcoal-800">
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-charcoal-500">
                    No matching invoices found.
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-surface-muted transition-colors">
                    <td className="p-3 font-mono font-bold text-brand-700">{inv.invoiceNumber}</td>
                    <td className="p-3 font-bold text-charcoal-900">{inv.vendorName}</td>
                    <td className="p-3">{inv.companyName}</td>
                    <td className="p-3 font-mono font-extrabold text-charcoal-900">
                      ₹{inv.amount.toLocaleString('en-IN')}
                    </td>
                    <td className="p-3 text-charcoal-500">{inv.invoiceDate}</td>
                    <td className="p-3 text-charcoal-500">{inv.dueDate}</td>
                    <td className="p-3">
                      <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full ${
                        inv.status === 'Paid' ? 'bg-brand-600 text-white' :
                        inv.status === 'Payment Processing' ? 'bg-brand-100 text-brand-800 border border-brand-200' :
                        inv.status === 'Correction Required' ? 'bg-brand-50 text-brand-900 border border-brand-300' :
                        'bg-surface-light text-charcoal-800 border border-surface-border'
                      }`}>
                        {inv.status === 'Paid' && <CheckCircle2 className="w-3 h-3" />}
                        {inv.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => {
                          setSelectedInvoiceId(inv.id);
                          setActiveTab('invoice-details');
                        }}
                        className="bg-brand-600 hover:bg-brand-700 text-white px-3 py-1.5 rounded-lg font-bold text-xs shadow-2xs transition-colors"
                      >
                        Open Detail
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
