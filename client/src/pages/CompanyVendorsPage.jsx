import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Users, UserCheck, ArrowRight, Package, CreditCard, CheckCircle2 } from 'lucide-react';

export default function CompanyVendorsPage() {
  const { demoVendors, orders, setSelectedOrderId, setActiveTab } = useApp();
  const [selectedVendorFilter, setSelectedVendorFilter] = useState(null);

  const vendorList = demoVendors.map(v => {
    const vOrders = orders.filter(o => o.vendorId === v.vendorId);
    const activeCount = vOrders.filter(o => o.status !== 'Paid').length;
    const pendingPay = vOrders.filter(o => o.status !== 'Paid').reduce((sum, o) => sum + o.amount, 0);
    const paidSum = vOrders.filter(o => o.status === 'Paid').reduce((sum, o) => sum + o.amount, 0);

    return {
      ...v,
      vOrders,
      activeCount,
      pendingPay,
      paidSum
    };
  });

  const activeVendor = vendorList.find(v => v.vendorId === selectedVendorFilter) || null;

  return (
    <div className="space-y-6 font-sans">
      
      {/* HEADER */}
      <div className="bg-white rounded-3xl border border-surface-border p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="bg-brand-600 text-white text-xs font-extrabold px-3 py-1 rounded-full uppercase">
            Supplier Management
          </span>
          <h1 className="text-2xl font-extrabold text-charcoal-900 mt-2">
            Company Vendors Directory & Outstanding Balances
          </h1>
          <p className="text-xs text-charcoal-600 mt-1 font-medium">
            Overview of all onboarding vendors, active order volumes, pending payouts, and settled balances.
          </p>
        </div>

        {selectedVendorFilter && (
          <button
            onClick={() => setSelectedVendorFilter(null)}
            className="bg-surface-light hover:bg-brand-50 border border-brand-200 text-brand-800 font-extrabold px-3 py-1.5 rounded-xl text-xs"
          >
            Clear Selected Vendor Filter
          </button>
        )}
      </div>

      {/* VENDOR CARDS GRID (REQUIREMENT 15 FORMAT) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {vendorList.map((v) => (
          <div
            key={v.vendorId}
            onClick={() => setSelectedVendorFilter(v.vendorId)}
            className={`p-5 rounded-3xl border-2 transition-all cursor-pointer ${
              selectedVendorFilter === v.vendorId
                ? 'bg-brand-50 border-brand-600 shadow-md'
                : 'bg-white border-surface-border hover:border-brand-300 shadow-xs'
            }`}
          >
            <div className="flex items-center justify-between pb-2 border-b border-surface-border">
              <span className="font-extrabold text-charcoal-900 text-sm">{v.vendorName}</span>
              <span className="text-[10px] font-mono font-extrabold bg-brand-100 text-brand-800 px-2 py-0.5 rounded">
                {v.vendorId}
              </span>
            </div>

            <div className="mt-3 space-y-1.5 text-xs font-medium">
              <div className="flex justify-between">
                <span className="text-charcoal-500">Active Orders:</span>
                <span className="font-extrabold text-charcoal-900">{v.activeCount}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-charcoal-500">Pending Payouts:</span>
                <span className="font-extrabold text-brand-700 font-mono">₹{v.pendingPay.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-charcoal-500">Paid Amount:</span>
                <span className="font-extrabold text-charcoal-800 font-mono">₹{v.paidSum.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="mt-4 pt-2 border-t border-surface-border text-right">
              <span className="text-xs font-extrabold text-brand-700 inline-flex items-center gap-1 hover:underline">
                View Vendor History <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* FILTERED VENDOR ORDERS & PAYMENTS DRILL-DOWN */}
      {activeVendor && (
        <div className="bg-white rounded-3xl border border-surface-border p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-surface-border">
            <div>
              <h3 className="text-base font-extrabold text-charcoal-900">
                Vendor Drill-Down: {activeVendor.vendorName} ({activeVendor.vendorId})
              </h3>
              <p className="text-xs text-charcoal-500 font-medium">
                Showing isolated order history, invoices, and pending payouts for {activeVendor.vendorName}.
              </p>
            </div>

            <div className="text-right">
              <span className="text-xs text-charcoal-500 font-medium block">Total Outstanding Balance</span>
              <span className="text-xl font-extrabold text-brand-700 font-mono">₹{activeVendor.pendingPay.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-surface-border text-charcoal-500 uppercase tracking-wider text-[10px] bg-surface-light">
                  <th className="p-3 font-bold">Order #</th>
                  <th className="p-3 font-bold">Items</th>
                  <th className="p-3 font-bold">Amount</th>
                  <th className="p-3 font-bold">Status</th>
                  <th className="p-3 font-bold">Payout Status</th>
                  <th className="p-3 font-bold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium text-charcoal-800">
                {activeVendor.vOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-surface-muted transition-colors">
                    <td className="p-3 font-mono font-bold text-brand-700">{ord.orderNumber}</td>
                    <td className="p-3 font-bold">{ord.items?.map(i => i.name).join(', ')}</td>
                    <td className="p-3 font-mono font-extrabold text-charcoal-900">₹{ord.amount?.toLocaleString('en-IN')}</td>
                    <td className="p-3">{ord.status}</td>
                    <td className="p-3 font-extrabold text-brand-700">{ord.paymentDetails?.status || 'PENDING'}</td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => {
                          setSelectedOrderId(ord.id);
                          setActiveTab('order-details');
                        }}
                        className="bg-brand-600 hover:bg-brand-700 text-white font-extrabold px-3 py-1 rounded-lg text-xs"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
