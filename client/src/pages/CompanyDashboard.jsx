import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Building2,
  AlertTriangle,
  CheckCircle2,
  Truck,
  FileCheck,
  CreditCard,
  ArrowRight
} from 'lucide-react';
import ChartsSection from '../components/ChartsSection';

export default function CompanyDashboard() {
  const { orders, setSelectedOrderId, setActiveTab, handleUpdateOrderStatus } = useApp();

  const newOrders = orders.filter(o => o.status === 'Order Placed').length;
  const processing = orders.filter(o => o.status === 'Order Accepted' || o.status === 'Order Processing').length;
  const dispatched = orders.filter(o => o.status === 'Order Dispatched' || o.status === 'Out for Delivery').length;
  const delivered = orders.filter(o => o.status === 'Delivered').length;
  const issuesReported = orders.filter(o => o.receivingVerification?.hasIssue && !o.receivingVerification?.resolved).length;
  const billsPending = orders.filter(o => !o.companyGstBill?.uploaded).length;
  const paymentPending = orders.filter(o => o.status !== 'Paid').length;
  const paymentsCompleted = orders.filter(o => o.status === 'Paid').length;

  return (
    <div className="space-y-6 font-sans">
      
      {/* HEADER */}
      <div className="bg-white rounded-3xl border border-surface-border p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-brand-600 text-white text-xs font-extrabold px-3 py-1 rounded-full uppercase">
              Company Store Admin Portal
            </span>
            <span className="text-xs text-charcoal-500 font-medium">XYZ Manufacturing</span>
          </div>
          <h1 className="text-2xl font-extrabold text-charcoal-900 mt-2">
            Procurement, Fulfillment & Payout Operations
          </h1>
          <p className="text-xs text-charcoal-600 mt-1 font-medium">
            Review vendor order requests, mark dispatch status, upload GST bills, resolve delivery issues, and authorize payouts.
          </p>
        </div>
      </div>

      {/* NEEDS ATTENTION SECTION (REQUIREMENT 17 FORMAT) */}
      <div className="bg-brand-50 border border-brand-300 rounded-3xl p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-brand-700" />
            <h3 className="text-sm font-extrabold text-brand-900">
              Needs Attention Dashboard Alerts
            </h3>
          </div>
          <span className="text-xs bg-white text-brand-800 font-extrabold px-2.5 py-0.5 rounded-full border border-brand-200">
            AI Operations Diagnostics
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-bold">
          <div className="bg-white p-3.5 rounded-2xl border border-brand-200 flex items-center justify-between">
            <span className="text-charcoal-900">⚠ {newOrders} new order(s) require approval</span>
            <button onClick={() => setActiveTab('orders')} className="text-[11px] text-brand-700 hover:underline">Review</button>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-brand-300 flex items-center justify-between">
            <span className="text-brand-900">⚠ {issuesReported} delivery issue(s) reported</span>
            <button onClick={() => setActiveTab('orders')} className="text-[11px] bg-brand-600 text-white px-2 py-0.5 rounded">Inspect</button>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-brand-200 flex items-center justify-between">
            <span className="text-charcoal-900">⚠ {billsPending} GST bill(s) pending</span>
            <button onClick={() => setActiveTab('orders')} className="text-[11px] text-brand-700 hover:underline">Upload</button>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-brand-200 flex items-center justify-between">
            <span className="text-charcoal-900">⚠ {paymentPending} payment(s) waiting approval</span>
            <button onClick={() => setActiveTab('orders')} className="text-[11px] text-brand-700 hover:underline">Authorize</button>
          </div>
        </div>
      </div>

      {/* METRICS CARDS (REQUIREMENT 17) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        <div className="bg-white p-3.5 rounded-2xl border border-surface-border shadow-xs">
          <span className="text-[10px] text-charcoal-500 font-semibold block">New Orders</span>
          <span className="text-xl font-extrabold text-charcoal-900 mt-1 block">{newOrders}</span>
        </div>
        <div className="bg-white p-3.5 rounded-2xl border border-surface-border shadow-xs">
          <span className="text-[10px] text-charcoal-500 font-semibold block">Processing</span>
          <span className="text-xl font-extrabold text-brand-700 mt-1 block">{processing}</span>
        </div>
        <div className="bg-white p-3.5 rounded-2xl border border-surface-border shadow-xs">
          <span className="text-[10px] text-charcoal-500 font-semibold block">Dispatched</span>
          <span className="text-xl font-extrabold text-brand-600 mt-1 block">{dispatched}</span>
        </div>
        <div className="bg-white p-3.5 rounded-2xl border border-surface-border shadow-xs">
          <span className="text-[10px] text-charcoal-500 font-semibold block">Delivered</span>
          <span className="text-xl font-extrabold text-brand-700 mt-1 block">{delivered}</span>
        </div>
        <div className="bg-white p-3.5 rounded-2xl border border-surface-border shadow-xs">
          <span className="text-[10px] text-charcoal-500 font-semibold block">Issues</span>
          <span className="text-xl font-extrabold text-brand-800 mt-1 block">{issuesReported}</span>
        </div>
        <div className="bg-white p-3.5 rounded-2xl border border-surface-border shadow-xs">
          <span className="text-[10px] text-charcoal-500 font-semibold block">Bills Pending</span>
          <span className="text-xl font-extrabold text-charcoal-800 mt-1 block">{billsPending}</span>
        </div>
        <div className="bg-white p-3.5 rounded-2xl border border-surface-border shadow-xs">
          <span className="text-[10px] text-charcoal-500 font-semibold block">Payment Pending</span>
          <span className="text-xl font-extrabold text-charcoal-900 mt-1 block">{paymentPending}</span>
        </div>
        <div className="bg-white p-3.5 rounded-2xl border border-surface-border shadow-xs">
          <span className="text-[10px] text-charcoal-500 font-semibold block">Paid</span>
          <span className="text-xl font-extrabold text-brand-700 mt-1 block">{paymentsCompleted}</span>
        </div>
      </div>

      {/* ACTION TABLE */}
      <div className="bg-white rounded-3xl border border-surface-border p-6 shadow-xs">
        <h3 className="text-base font-extrabold text-charcoal-900 mb-4">Orders Awaiting Action</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-surface-border text-charcoal-500 uppercase tracking-wider text-[10px] bg-surface-light">
                <th className="p-3 font-bold">Order #</th>
                <th className="p-3 font-bold">Vendor Name</th>
                <th className="p-3 font-bold">Amount</th>
                <th className="p-3 font-bold">Status</th>
                <th className="p-3 font-bold text-right">Quick Store Controls</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium text-charcoal-800">
              {orders.map((ord) => (
                <tr key={ord.id} className="hover:bg-surface-muted transition-colors">
                  <td className="p-3 font-mono font-bold text-brand-700">{ord.orderNumber}</td>
                  <td className="p-3 font-bold">{ord.vendorName}</td>
                  <td className="p-3 font-bold font-mono">₹{ord.amount?.toLocaleString('en-IN')}</td>
                  <td className="p-3">
                    <span className="text-[11px] font-extrabold bg-surface-light px-2.5 py-1 rounded-full border border-surface-border">
                      {ord.status}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {ord.status === 'Order Placed' && (
                        <button
                          onClick={() => handleUpdateOrderStatus(ord.id, 'Order Accepted', 'Accepted by Store Admin')}
                          className="bg-brand-600 hover:bg-brand-700 text-white font-extrabold px-3 py-1 rounded-lg text-xs"
                        >
                          Accept Order
                        </button>
                      )}

                      {ord.status === 'Order Accepted' && (
                        <button
                          onClick={() => handleUpdateOrderStatus(ord.id, 'Order Dispatched', 'Dispatched via express logistics')}
                          className="bg-brand-700 hover:bg-brand-800 text-white font-extrabold px-3 py-1 rounded-lg text-xs"
                        >
                          Dispatch Order
                        </button>
                      )}

                      {ord.status !== 'Paid' && (
                        <button
                          onClick={() => handleUpdateOrderStatus(ord.id, 'Paid', 'Payment cleared', '', 'PAY-847291')}
                          className="bg-brand-600 hover:bg-brand-700 text-white font-extrabold px-3 py-1 rounded-lg text-xs"
                        >
                          Mark Paid
                        </button>
                      )}

                      <button
                        onClick={() => {
                          setSelectedOrderId(ord.id);
                          setActiveTab('order-details');
                        }}
                        className="bg-white border border-surface-border text-charcoal-800 font-bold px-2.5 py-1 rounded-lg text-xs"
                      >
                        Inspect
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CHARTS */}
      <ChartsSection orders={orders} />

    </div>
  );
}
