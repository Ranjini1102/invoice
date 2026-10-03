import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import CompanyBillDetailsModal from '../components/CompanyBillDetailsModal';
import { CreditCard, Search, Filter, CheckCircle2, Clock, AlertTriangle, ArrowRight, FileText, Upload } from 'lucide-react';

export default function CompanyPaymentsPage() {
  const { orders, companyProfile, handleUpdateOrderStatus, setSelectedOrderId, setActiveTab } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modal State for Bill Details & Preview
  const [selectedBillOrder, setSelectedBillOrder] = useState(null);
  const [isBillModalOpen, setIsBillModalOpen] = useState(false);

  const handleOpenBillDetails = (ord) => {
    setSelectedBillOrder(ord);
    setIsBillModalOpen(true);
  };

  const filteredOrders = orders.filter((ord) => {
    const matchesSearch =
      ord.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ord.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (ord.vendorBill?.invoiceNumber || '').toLowerCase().includes(searchTerm.toLowerCase());

    const payStatus = ord.paymentDetails?.status || 'PENDING';

    if (statusFilter === 'ALL') return matchesSearch;
    if (statusFilter === 'PAID') return matchesSearch && payStatus === 'PAID';
    if (statusFilter === 'PENDING') return matchesSearch && payStatus === 'PENDING';
    if (statusFilter === 'PROCESSING') return matchesSearch && payStatus === 'PROCESSING';
    if (statusFilter === 'OVERDUE') return matchesSearch && payStatus === 'OVERDUE';

    return matchesSearch;
  });

  return (
    <div className="space-y-6 font-sans">
      
      {/* COMPANY FINANCIAL SUMMARY CARDS */}
      <div className="bg-white rounded-3xl border border-surface-border p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="bg-brand-600 text-white text-xs font-extrabold px-3 py-1 rounded-full uppercase">
            Company Treasury & Payments
          </span>
          <h1 className="text-2xl font-extrabold text-charcoal-900 mt-2">
            Vendor Payments & Bill Payout Authorization
          </h1>
          <p className="text-xs text-charcoal-600 mt-1 font-medium">
            Manage vendor bills, inspect tax invoice images, enter GST details, and authorize NEFT payouts.
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="bg-surface-light p-3 rounded-2xl border border-surface-border">
            <span className="text-charcoal-500 font-sans font-bold block text-[10px]">Total Paid Volume</span>
            <span className="font-extrabold text-brand-700 text-lg">₹{companyProfile?.paidAmount?.toLocaleString('en-IN')}</span>
          </div>

          <div className="bg-surface-light p-3 rounded-2xl border border-surface-border">
            <span className="text-charcoal-500 font-sans font-bold block text-[10px]">Pending Payouts</span>
            <span className="font-extrabold text-charcoal-900 text-lg">₹{companyProfile?.pendingAmount?.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>

      {/* FILTER TABS & SEARCH BAR */}
      <div className="bg-white rounded-3xl border border-surface-border p-6 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          
          {/* SEARCH INPUT */}
          <div className="relative min-w-[280px]">
            <Search className="w-4 h-4 text-charcoal-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by Vendor, Order #, or Invoice #..."
              className="w-full bg-surface-light border border-surface-border rounded-xl pl-9 pr-4 py-2.5 text-xs text-charcoal-900 placeholder-charcoal-500 focus:outline-none focus:ring-2 focus:ring-brand-600 font-sans"
            />
          </div>

          {/* FILTER TABS */}
          <div className="flex items-center gap-2 overflow-x-auto text-xs font-bold">
            {[
              { id: 'ALL', label: 'All Payments' },
              { id: 'PENDING', label: 'Pending Payout' },
              { id: 'PROCESSING', label: 'Processing' },
              { id: 'PAID', label: '✓ Paid / Settled' },
              { id: 'OVERDUE', label: '⚠ Overdue' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3.5 py-2 rounded-xl transition-all shrink-0 ${
                  statusFilter === tab.id
                    ? 'bg-brand-600 text-white shadow-xs'
                    : 'bg-surface-light text-charcoal-700 hover:bg-brand-50 border border-surface-border'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

        </div>

        {/* PAYMENTS TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-surface-border text-charcoal-500 uppercase tracking-wider text-[10px] bg-surface-light">
                <th className="p-3 font-bold">Vendor Name</th>
                <th className="p-3 font-bold">Order ID</th>
                <th className="p-3 font-bold">Vendor Invoice</th>
                <th className="p-3 font-bold">Payable Amount</th>
                <th className="p-3 font-bold">Bill Image & GST Details</th>
                <th className="p-3 font-bold">Payout Status</th>
                <th className="p-3 font-bold text-right">Payment Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium text-charcoal-800">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-charcoal-500">
                    No matching payment records found.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((ord) => {
                  const payStatus = ord.paymentDetails?.status || 'PENDING';
                  return (
                    <tr key={ord.id} className="hover:bg-surface-muted transition-colors">
                      <td className="p-3 font-extrabold text-charcoal-900">{ord.vendorName}</td>
                      <td className="p-3 font-mono font-bold text-brand-700">{ord.orderNumber}</td>
                      <td className="p-3 font-mono text-charcoal-700">{ord.vendorBill?.invoiceNumber || 'INV-1024'}</td>
                      <td className="p-3 font-mono font-extrabold text-charcoal-900 text-sm">
                        ₹{ord.amount?.toLocaleString('en-IN')}
                      </td>

                      {/* BILL DETAILS BUTTON COLUMN */}
                      <td className="p-3">
                        <button
                          onClick={() => handleOpenBillDetails(ord)}
                          className="bg-brand-50 hover:bg-brand-100 text-brand-800 border border-brand-300 font-bold px-3 py-1.5 rounded-xl text-xs transition-colors flex items-center gap-1.5 shadow-2xs"
                        >
                          <FileText className="w-3.5 h-3.5 text-brand-600" />
                          <span>Bill Image & Details</span>
                        </button>
                      </td>

                      <td className="p-3">
                        <span className={`inline-flex items-center gap-1 text-[11px] font-extrabold px-2.5 py-1 rounded-full ${
                          payStatus === 'PAID' ? 'bg-brand-600 text-white' :
                          payStatus === 'PROCESSING' ? 'bg-brand-100 text-brand-800 border border-brand-200' :
                          payStatus === 'OVERDUE' ? 'bg-brand-50 text-brand-900 border border-brand-300' :
                          'bg-surface-light text-charcoal-800 border border-surface-border'
                        }`}>
                          {payStatus === 'PAID' && <CheckCircle2 className="w-3.5 h-3.5" />}
                          {payStatus}
                        </span>
                      </td>

                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {payStatus !== 'PAID' && (
                            <button
                              onClick={() => handleUpdateOrderStatus(ord.id, 'Paid', 'Payment cleared via HDFC RTGS Gateway', '', 'PAY-847291')}
                              className="bg-brand-600 hover:bg-brand-700 text-white font-extrabold px-3 py-1.5 rounded-xl text-xs shadow-2xs transition-colors flex items-center gap-1 animate-pulse-subtle"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" /> Mark Paid
                            </button>
                          )}

                          <button
                            onClick={() => {
                              setSelectedOrderId(ord.id);
                              setActiveTab('order-details');
                            }}
                            className="bg-white hover:bg-surface-light border border-surface-border text-charcoal-800 font-bold px-2.5 py-1 rounded-lg text-xs"
                          >
                            Review & Pay
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
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
