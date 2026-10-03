import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import CompanyBillDetailsModal from '../components/CompanyBillDetailsModal';
import { PackageCheck, Search, CheckCircle2, ArrowRight, FileText } from 'lucide-react';

export default function CompanyOrdersPage() {
  const { orders, setSelectedOrderId, setActiveTab } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  // Modal State for Bill Details & Image
  const [selectedBillOrder, setSelectedBillOrder] = useState(null);
  const [isBillModalOpen, setIsBillModalOpen] = useState(false);

  const handleOpenBillDetails = (ord) => {
    setSelectedBillOrder(ord);
    setIsBillModalOpen(true);
  };

  const filteredOrders = orders.filter(ord =>
    ord.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ord.vendorName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 font-sans">
      
      {/* HEADER */}
      <div className="bg-white rounded-3xl border border-surface-border p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="bg-brand-600 text-white text-xs font-extrabold px-3 py-1 rounded-full uppercase">
            Store Operations
          </span>
          <h1 className="text-2xl font-extrabold text-charcoal-900 mt-2">
            Company Orders & Bill Verification Overview
          </h1>
          <p className="text-xs text-charcoal-600 mt-1 font-medium">
            Summarized operational view of all active procurement orders, tax invoices, and vendor bills.
          </p>
        </div>

        <div className="relative min-w-[260px]">
          <Search className="w-4 h-4 text-charcoal-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search Order # or Vendor..."
            className="w-full bg-surface-light border border-surface-border rounded-xl pl-9 pr-4 py-2 text-xs font-bold text-charcoal-900"
          />
        </div>
      </div>

      {/* SUMMARY TABLE */}
      <div className="bg-white rounded-3xl border border-surface-border p-6 shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-surface-border text-charcoal-500 uppercase tracking-wider text-[10px] bg-surface-light">
                <th className="p-3 font-bold">Order ID</th>
                <th className="p-3 font-bold">Vendor Name</th>
                <th className="p-3 font-bold">Items</th>
                <th className="p-3 font-bold">Amount</th>
                <th className="p-3 font-bold">Bill & GST Details</th>
                <th className="p-3 font-bold">Order Status</th>
                <th className="p-3 font-bold text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium text-charcoal-800">
              {filteredOrders.map((ord) => (
                <tr key={ord.id} className="hover:bg-surface-muted transition-colors">
                  <td className="p-3 font-mono font-bold text-brand-700">{ord.orderNumber}</td>
                  <td className="p-3 font-bold text-charcoal-900">{ord.vendorName}</td>
                  <td className="p-3">{ord.items?.map(i => i.name).join(', ')}</td>
                  <td className="p-3 font-mono font-extrabold text-charcoal-900">₹{ord.amount?.toLocaleString('en-IN')}</td>

                  {/* BILL DETAILS BUTTON */}
                  <td className="p-3">
                    <button
                      onClick={() => handleOpenBillDetails(ord)}
                      className="bg-brand-50 hover:bg-brand-100 text-brand-800 border border-brand-300 font-bold px-2.5 py-1 rounded-lg text-xs transition-colors flex items-center gap-1 shrink-0"
                    >
                      <FileText className="w-3.5 h-3.5 text-brand-600" />
                      <span>Bill Image</span>
                    </button>
                  </td>

                  <td className="p-3">
                    <span className="bg-surface-light px-2.5 py-1 rounded-full font-extrabold border border-surface-border">
                      {ord.status}
                    </span>
                  </td>

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

      {/* BILL DETAILS MODAL */}
      <CompanyBillDetailsModal
        order={selectedBillOrder}
        isOpen={isBillModalOpen}
        onClose={() => setIsBillModalOpen(false)}
      />

    </div>
  );
}
