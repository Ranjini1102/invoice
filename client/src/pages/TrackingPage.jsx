import React from 'react';
import { useApp } from '../context/AppContext';
import FlipkartOrderTimeline from '../components/FlipkartOrderTimeline';
import { GitCommit } from 'lucide-react';

export default function TrackingPage() {
  const { orders, selectedOrderId, setSelectedOrderId } = useApp();

  const selectedOrder = orders.find(o => o.id === selectedOrderId) || orders[0];

  return (
    <div className="space-y-6 font-sans">
      
      {/* HEADER */}
      <div className="bg-white rounded-3xl border border-surface-border p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-brand-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase">
              Flipkart-Style Order Tracking
            </span>
            <span className="text-xs text-charcoal-500 font-medium">End-to-End Visibility</span>
          </div>
          <h1 className="text-2xl font-extrabold text-charcoal-900 mt-2">
            Where is My Order Right Now?
          </h1>
          <p className="text-xs text-charcoal-600 mt-1 font-medium">
            Real-time step-by-step lifecycle tracking from placement to treasury payout.
          </p>
        </div>

        {/* SELECT ORDER DROPDOWN */}
        <div className="flex items-center gap-2 bg-surface-light p-2 rounded-2xl border border-surface-border">
          <span className="text-xs font-bold text-charcoal-700 pl-2">Select Order:</span>
          <select
            value={selectedOrderId}
            onChange={(e) => setSelectedOrderId(e.target.value)}
            className="bg-white border border-brand-200 rounded-xl px-3 py-1.5 text-xs font-mono font-bold text-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-600"
          >
            {orders.map((ord) => (
              <option key={ord.id} value={ord.id}>
                {ord.orderNumber} - {ord.vendorName} (₹{ord.amount?.toLocaleString('en-IN')})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* FLIPKART ORDER TIMELINE */}
      <FlipkartOrderTimeline order={selectedOrder} />

    </div>
  );
}
