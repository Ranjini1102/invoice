import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Package, Search, CheckCircle2, ArrowRight } from 'lucide-react';

export default function VendorOrdersPage() {
  const { orders, setSelectedOrderId, setActiveTab } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const vendorOrders = orders;

  const filteredOrders = vendorOrders.filter((ord) => {
    const matchesSearch =
      ord.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ord.companyName.toLowerCase().includes(searchTerm.toLowerCase());

    if (statusFilter === 'ALL') return matchesSearch;
    if (statusFilter === 'ACTIVE') return matchesSearch && ord.status !== 'Paid';
    if (statusFilter === 'PROCESSING') return matchesSearch && (ord.status === 'Order Confirmed' || ord.status === 'Order Processing');
    if (statusFilter === 'DISPATCHED') return matchesSearch && (ord.status === 'Order Dispatched' || ord.status === 'In Transit' || ord.status === 'Out for Delivery');
    if (statusFilter === 'DELIVERED') return matchesSearch && ord.status === 'Delivered';
    if (statusFilter === 'ISSUES') return matchesSearch && (ord.receivingVerification?.hasIssue || ord.returnReplacement);
    if (statusFilter === 'COMPLETED') return matchesSearch && ord.status === 'Paid';

    return matchesSearch;
  });

  return (
    <div className="space-y-6 font-sans">
      
      {/* HEADER */}
      <div className="bg-white rounded-3xl border border-surface-border p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="bg-brand-100 text-brand-800 text-xs font-bold px-3 py-1 rounded-full border border-brand-200 uppercase">
            Supplier Order Registry
          </span>
          <h1 className="text-2xl font-extrabold text-charcoal-900 mt-2">
            My Submitted Orders
          </h1>
          <p className="text-xs text-charcoal-600 mt-1 font-medium">
            Filter and inspect all procurement orders submitted to XYZ Company.
          </p>
        </div>

        {/* SEARCH INPUT */}
        <div className="relative min-w-[260px]">
          <Search className="w-4 h-4 text-charcoal-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Order # or Company..."
            className="w-full bg-surface-light border border-surface-border rounded-xl pl-9 pr-4 py-2.5 text-xs text-charcoal-900 placeholder-charcoal-500 focus:outline-none focus:ring-2 focus:ring-brand-600"
          />
        </div>
      </div>

      {/* FILTER TABS (REQUIREMENT 5 FORMAT) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-extrabold">
        {[
          { id: 'ALL', label: 'All Orders' },
          { id: 'ACTIVE', label: 'Active Orders' },
          { id: 'PROCESSING', label: 'Processing' },
          { id: 'DISPATCHED', label: 'Dispatched / In Transit' },
          { id: 'DELIVERED', label: 'Delivered' },
          { id: 'ISSUES', label: '⚠ Issues / Returns' },
          { id: 'COMPLETED', label: '✓ Completed' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setStatusFilter(tab.id)}
            className={`px-3 py-2 rounded-xl transition-all shrink-0 ${
              statusFilter === tab.id
                ? 'bg-brand-600 text-white shadow-xs'
                : 'bg-white text-charcoal-700 hover:bg-surface-light border border-surface-border'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ORDERS LIST */}
      <div className="bg-white rounded-3xl border border-surface-border p-6 shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-surface-border text-charcoal-500 uppercase tracking-wider text-[10px] bg-surface-light">
                <th className="p-3 font-bold">Order ID</th>
                <th className="p-3 font-bold">Order Date</th>
                <th className="p-3 font-bold">Company</th>
                <th className="p-3 font-bold">Consignment Items</th>
                <th className="p-3 font-bold">Amount</th>
                <th className="p-3 font-bold">Expected Delivery</th>
                <th className="p-3 font-bold">Current Status</th>
                <th className="p-3 font-bold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium text-charcoal-800">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-charcoal-500 font-medium">
                    No orders matching this filter.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-surface-muted transition-colors">
                    <td className="p-3 font-mono font-bold text-brand-700">{ord.orderNumber}</td>
                    <td className="p-3 text-charcoal-500">{ord.orderDate}</td>
                    <td className="p-3 font-bold">{ord.companyName}</td>
                    <td className="p-3">{ord.items?.map(i => `${i.name} (${i.expectedQty})`).join(', ')}</td>
                    <td className="p-3 font-mono font-extrabold text-charcoal-900">₹{ord.amount?.toLocaleString('en-IN')}</td>
                    <td className="p-3 text-charcoal-500">{ord.expectedDeliveryDate}</td>
                    <td className="p-3">
                      <span className={`inline-flex items-center gap-1 text-[11px] font-extrabold px-2.5 py-1 rounded-full ${
                        ord.status === 'Paid' ? 'bg-brand-600 text-white' : 'bg-brand-100 text-brand-800 border border-brand-200'
                      }`}>
                        {ord.status === 'Paid' && <CheckCircle2 className="w-3 h-3" />}
                        {ord.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => {
                          setSelectedOrderId(ord.id);
                          setActiveTab('order-details');
                        }}
                        className="bg-brand-600 hover:bg-brand-700 text-white font-extrabold px-3 py-1.5 rounded-lg text-xs shadow-2xs transition-colors inline-flex items-center gap-1"
                      >
                        View Tracking <ArrowRight className="w-3 h-3" />
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
