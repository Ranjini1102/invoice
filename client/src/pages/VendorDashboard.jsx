import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Package,
  Truck,
  CheckCircle2,
  AlertTriangle,
  Plus,
  ArrowRight,
  Clock,
  RotateCcw
} from 'lucide-react';
import ChartsSection from '../components/ChartsSection';

export default function VendorDashboard() {
  const { orders, setSelectedOrderId, setActiveTab } = useApp();

  const totalOrders = orders.length;
  const activeOrders = orders.filter(o => o.status !== 'Paid').length;
  const outForDelivery = orders.filter(o => o.status === 'Out for Delivery').length;
  const deliveredCount = orders.filter(o => o.status === 'Delivered' || o.status === 'Received & Verified' || o.status === 'Bill Verified' || o.status === 'Payment Processing' || o.status === 'Paid').length;
  const issuesCount = orders.filter(o => o.receivingVerification?.hasIssue || o.returnReplacement).length;
  const paymentPending = orders.filter(o => o.status !== 'Paid').length;
  const paymentCompleted = orders.filter(o => o.status === 'Paid').length;

  return (
    <div className="space-y-6 font-sans">
      
      {/* HEADER */}
      <div className="bg-white rounded-3xl border border-surface-border p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-brand-100 text-brand-800 text-xs font-bold px-3 py-1 rounded-full border border-brand-200 uppercase">
              Vendor Portal
            </span>
            <span className="text-xs text-charcoal-500 font-medium">ABC Supplies</span>
          </div>
          <h1 className="text-2xl font-extrabold text-charcoal-900 mt-2">
            Vendor Order & Delivery Tracking Dashboard
          </h1>
          <p className="text-xs text-charcoal-600 mt-1 font-medium">
            "Order Placed → Dispatched → Delivery → Receiving → Issues/Returns → Bill/GST → Payment"
          </p>
        </div>

        <button
          onClick={() => setActiveTab('create-order')}
          className="bg-brand-600 hover:bg-brand-700 text-white font-extrabold px-4 py-2.5 rounded-xl text-xs shadow-md transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4 stroke-[3]" /> Place New Order
        </button>
      </div>

      {/* VENDOR DASHBOARD CARDS (REQUIREMENT 16) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        <div className="bg-white p-3.5 rounded-2xl border border-surface-border shadow-xs">
          <span className="text-[11px] text-charcoal-500 font-semibold block">Total Orders</span>
          <span className="text-xl font-extrabold text-charcoal-900 mt-1 block">{totalOrders}</span>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-surface-border shadow-xs">
          <span className="text-[11px] text-charcoal-500 font-semibold block">Active Orders</span>
          <span className="text-xl font-extrabold text-brand-700 mt-1 block">{activeOrders}</span>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-surface-border shadow-xs">
          <span className="text-[11px] text-charcoal-500 font-semibold block">Out for Delivery</span>
          <span className="text-xl font-extrabold text-brand-600 mt-1 block">{outForDelivery}</span>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-surface-border shadow-xs">
          <span className="text-[11px] text-charcoal-500 font-semibold block">Delivered</span>
          <span className="text-xl font-extrabold text-brand-700 mt-1 block">{deliveredCount}</span>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-surface-border shadow-xs">
          <span className="text-[11px] text-charcoal-500 font-semibold block">Issues / Returns</span>
          <span className="text-xl font-extrabold text-brand-800 mt-1 block">{issuesCount}</span>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-surface-border shadow-xs">
          <span className="text-[11px] text-charcoal-500 font-semibold block">Payment Pending</span>
          <span className="text-xl font-extrabold text-charcoal-900 mt-1 block">{paymentPending}</span>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-surface-border shadow-xs">
          <span className="text-[11px] text-charcoal-500 font-semibold block">Payment Completed</span>
          <span className="text-xl font-extrabold text-brand-700 mt-1 block">{paymentCompleted}</span>
        </div>
      </div>

      {/* TRACK YOUR ORDERS SECTION (REQUIREMENT 16) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-extrabold text-charcoal-900">Track Your Orders</h2>
          <button onClick={() => setActiveTab('orders')} className="text-xs font-bold text-brand-700 hover:underline">
            View All Orders →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {orders.map((ord) => (
            <div key={ord.id} className="bg-white rounded-3xl border border-surface-border p-5 shadow-xs hover:border-brand-300 transition-all space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-extrabold text-brand-700 font-mono text-base">{ord.orderNumber}</span>
                  <p className="text-xs text-charcoal-500 font-semibold mt-0.5">Target: {ord.companyName}</p>
                </div>
                <span className={`text-xs font-extrabold px-3 py-1 rounded-full ${
                  ord.status === 'Paid' ? 'bg-brand-600 text-white' : 'bg-brand-100 text-brand-800 border border-brand-200'
                }`}>
                  {ord.status}
                </span>
              </div>

              <div className="bg-surface-light p-3 rounded-2xl text-xs space-y-1 font-medium">
                <p className="text-charcoal-900 font-bold">Items: {ord.items?.map(i => `${i.name} (${i.expectedQty})`).join(', ')}</p>
                <div className="flex justify-between pt-1">
                  <span className="text-charcoal-500">Order Amount:</span>
                  <span className="font-extrabold font-mono text-brand-700 text-sm">₹{ord.amount?.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-charcoal-500">Expected Delivery:</span>
                  <span className="font-bold text-charcoal-900">{ord.expectedDeliveryDate}</span>
                </div>
              </div>

              <div className="pt-1 flex items-center justify-between">
                <span className="text-[11px] text-brand-800 font-bold">
                  Stage {ord.stageIndex + 1} of 10: {ord.timeline[ord.stageIndex]?.stage || ord.status}
                </span>
                <button
                  onClick={() => {
                    setSelectedOrderId(ord.id);
                    setActiveTab('order-details');
                  }}
                  className="bg-brand-600 hover:bg-brand-700 text-white font-extrabold px-4 py-2 rounded-xl text-xs shadow-2xs transition-colors flex items-center gap-1"
                >
                  Track Order <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CHARTS */}
      <ChartsSection orders={orders} />

    </div>
  );
}
