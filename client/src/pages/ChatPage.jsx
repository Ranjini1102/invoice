import React from 'react';
import { useApp } from '../context/AppContext';
import TwoWayChat from '../components/TwoWayChat';
import { MessageSquare, Building2, UserCheck } from 'lucide-react';

export default function ChatPage() {
  const { invoices, selectedInvoiceId, setSelectedInvoiceId, userRole } = useApp();

  const selectedInvoice = invoices.find(inv => inv.id === selectedInvoiceId) || invoices[0];

  return (
    <div className="space-y-6">
      
      {/* HEADER */}
      <div className="bg-white rounded-3xl border border-surface-border p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-brand-100 text-brand-800 text-xs font-bold px-3 py-1 rounded-full border border-brand-200 uppercase">
              2-Way Encrypted Messaging
            </span>
            <span className="text-xs text-charcoal-500 font-medium">Invoice-Specific Threads</span>
          </div>
          <h1 className="text-2xl font-extrabold text-charcoal-900 mt-2">
            Vendor & Company Communication Hub
          </h1>
          <p className="text-xs text-charcoal-600 mt-1">
            Resolve document questions, confirm purchase orders, and track corrections directly linked to each invoice.
          </p>
        </div>

        {/* SELECT INVOICE THREAD */}
        <div className="flex items-center gap-2 bg-surface-light p-2 rounded-2xl border border-surface-border">
          <span className="text-xs font-bold text-charcoal-700 pl-2">Select Discussion:</span>
          <select
            value={selectedInvoiceId}
            onChange={(e) => setSelectedInvoiceId(e.target.value)}
            className="bg-white border border-brand-200 rounded-xl px-3 py-1.5 text-xs font-mono font-bold text-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-600"
          >
            {invoices.map((inv) => (
              <option key={inv.id} value={inv.id}>
                Thread: {inv.invoiceNumber} ({inv.vendorName})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* TWO-WAY CHAT COMPONENT */}
      <TwoWayChat invoice={selectedInvoice} />

    </div>
  );
}
