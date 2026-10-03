import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CreditCard, CheckCircle2, Clock, Search, ArrowRight } from 'lucide-react';

export default function VendorPaymentsPage() {
  const { orders, setSelectedOrderId, setActiveTab } = useApp();
  const [filter, setFilter] = useState('ALL');

  const vendorPayments = orders;

  const totalSum = vendorPayments.reduce((s, o) => s + o.amount, 0);
  const paidSum = vendorPayments.filter(o => o.paymentDetails?.status === 'PAID').reduce((s, o) => s + o.amount, 0);
  const pendingSum = vendorPayments.filter(o => o.paymentDetails?.status === 'PENDING').reduce((s, o) => s + o.amount, 0);
  const processingSum = vendorPayments.filter(o => o.paymentDetails?.status === 'PROCESSING').reduce((s, o) => s + o.amount, 0);

  const filtered = vendorPayments.filter(o => {
    const payStatus = o.paymentDetails?.status || 'PENDING';
    if (filter === 'PAID') return payStatus === 'PAID';
    if (filter === 'PENDING') return payStatus === 'PENDING';
    if (filter === 'PROCESSING') return payStatus === 'PROCESSING';
    return true;
  });

  return (
    <div className="space-y-6 font-sans">
      
      {/* HEADER */}
      <div className="bg-white rounded-3xl border border-surface-border p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="bg-brand-100 text-brand-800 text-xs font-bold px-3 py-1 rounded-full border border-brand-200 uppercase">
            Vendor Financial Ledger
          </span>
          <h1 className="text-2xl font-extrabold text-charcoal-900 mt-2">
            My Payments & Settlement History
          </h1>
          <p className="text-xs text-charcoal-600 mt-1 font-medium">
            Real-time tracking of bank transfers, processing payouts, and settled receivables.
          </p>
        </div>
      </div>

      {/* METRICS CARDS (REQUIREMENT 9 FORMAT) */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-surface-border shadow-xs">
          <span className="text-xs text-charcoal-500 font-bold block">Total Amount</span>
          <span className="text-2xl font-extrabold text-charcoal-900 font-mono mt-1 block">
            ₹{totalSum.toLocaleString('en-IN')}
          </span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-brand-200 shadow-xs">
          <span className="text-xs text-charcoal-500 font-bold block">Paid / Settled</span>
          <span className="text-2xl font-extrabold text-brand-700 font-mono mt-1 block">
            ₹{paidSum.toLocaleString('en-IN')}
          </span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-surface-border shadow-xs">
          <span className="text-xs text-charcoal-500 font-bold block">Pending Payout</span>
          <span className="text-2xl font-extrabold text-charcoal-900 font-mono mt-1 block">
            ₹{pendingSum.toLocaleString('en-IN')}
          </span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-surface-border shadow-xs">
          <span className="text-xs text-charcoal-500 font-bold block">Processing</span>
          <span className="text-2xl font-extrabold text-brand-600 font-mono mt-1 block">
            ₹{processingSum.toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      {/* FILTER TABS & PAYMENT TABLE (REQUIREMENT 9 FORMAT) */}
      <div className="bg-white rounded-3xl border border-surface-border p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 overflow-x-auto text-xs font-bold">
          {[
            { id: 'ALL', label: 'All Payments' },
            { id: 'PAID', label: '✓ Paid' },
            { id: 'PROCESSING', label: '● Processing' },
            { id: 'PENDING', label: '○ Pending' }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setFilter(t.id)}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                filter === t.id ? 'bg-brand-600 text-white shadow-xs' : 'bg-surface-light border border-surface-border text-charcoal-700'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-surface-border text-charcoal-500 uppercase tracking-wider text-[10px] bg-surface-light">
                <th className="p-3 font-bold">Order ID</th>
                <th className="p-3 font-bold">Invoice #</th>
                <th className="p-3 font-bold">Payable Amount</th>
                <th className="p-3 font-bold">Payment Status</th>
                <th className="p-3 font-bold">Payment / Due Date</th>
                <th className="p-3 font-bold text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium text-charcoal-800">
              {filtered.map((ord) => {
                const payStatus = ord.paymentDetails?.status || 'PENDING';
                return (
                  <tr key={ord.id} className="hover:bg-surface-muted transition-colors">
                    <td className="p-3 font-mono font-bold text-brand-700">{ord.orderNumber}</td>
                    <td className="p-3 font-mono text-charcoal-700">{ord.vendorBill?.invoiceNumber || 'INV-1024'}</td>
                    <td className="p-3 font-mono font-extrabold text-charcoal-900 text-sm">
                      ₹{ord.amount?.toLocaleString('en-IN')}
                    </td>
                    <td className="p-3">
                      <span className={`inline-flex items-center gap-1 text-[11px] font-extrabold px-2.5 py-1 rounded-full ${
                        payStatus === 'PAID' ? 'bg-brand-600 text-white' :
                        payStatus === 'PROCESSING' ? 'bg-brand-100 text-brand-800 border border-brand-200' :
                        'bg-surface-light text-charcoal-800 border border-surface-border'
                      }`}>
                        {payStatus === 'PAID' ? '✓ PAID' : payStatus === 'PROCESSING' ? '● PROCESSING' : '○ PENDING'}
                      </span>
                    </td>
                    <td className="p-3 text-charcoal-500">
                      {ord.paymentDetails?.paymentDate || ord.paymentDetails?.dueDate || ord.expectedDeliveryDate}
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => {
                          setSelectedOrderId(ord.id);
                          setActiveTab('order-details');
                        }}
                        className="bg-brand-600 hover:bg-brand-700 text-white font-extrabold px-3 py-1 rounded-lg text-xs"
                      >
                        View Order
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
