import React from 'react';
import { useApp } from '../context/AppContext';
import AIAgentWidget from '../components/AIAgentWidget';
import { Bot, ShieldAlert, Zap, Clock, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function AIAgentPage() {
  const { orders, filteredOrders, selectedOrderId, setSelectedOrderId } = useApp();

  const ordersList = filteredOrders || orders || [];
  const selectedOrder = ordersList.find(ord => ord.id === selectedOrderId) || ordersList[0];

  return (
    <div className="space-y-6 font-sans">
      
      {/* HEADER */}
      <div className="bg-white rounded-3xl border border-surface-border p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-brand-600 text-white text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wide">
              Autonomous AI Monitoring
            </span>
            <span className="text-xs text-charcoal-500 font-medium">FlowGuard AI Verification Agent 2.0</span>
          </div>
          <h1 className="text-2xl font-extrabold text-charcoal-900 mt-2">
            FlowGuard AI Verification & Diagnostic Dashboard
          </h1>
          <p className="text-xs text-charcoal-600 mt-1 font-medium">
            Monitors order progress, cross-checks Vendor Bills vs Company GST Invoices, detects quantity mismatches, and sends automated payout reminders.
          </p>
        </div>

        {/* SELECT ORDER */}
        {ordersList.length > 0 && (
          <div className="flex items-center gap-2 bg-surface-light p-2 rounded-2xl border border-surface-border">
            <span className="text-xs font-bold text-charcoal-700 pl-2">Inspect Order:</span>
            <select
              value={selectedOrderId}
              onChange={(e) => setSelectedOrderId(e.target.value)}
              className="bg-white border border-brand-200 rounded-xl px-3 py-1.5 text-xs font-mono font-bold text-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-600"
            >
              {ordersList.map((ord) => (
                <option key={ord.id} value={ord.id}>
                  {ord.orderNumber} ({ord.vendorName}) - Status: {ord.status}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* AI AGENT WIDGET */}
      {selectedOrder ? (
        <AIAgentWidget order={selectedOrder} invoice={selectedOrder} />
      ) : (
        <div className="p-8 bg-white rounded-3xl border border-surface-border text-center text-charcoal-500 text-xs font-bold">
          No active orders found for AI Verification.
        </div>
      )}

      {/* AGENT DIAGNOSTIC OVERVIEW */}
      <div className="bg-white rounded-3xl border border-surface-border p-6 shadow-xs">
        <h3 className="text-base font-extrabold text-charcoal-900 mb-4">
          Pipeline Health & Stuck Approval Diagnostics
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-brand-50 border border-brand-200">
            <div className="flex items-center gap-2 text-brand-900 font-extrabold mb-1">
              <Clock className="w-4 h-4 text-brand-600" /> Pending Approval Escalations
            </div>
            <p className="text-brand-800 leading-relaxed font-medium">
              Orders stuck in verification queue receive automated reminders sent to Company Finance Admins.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-brand-50 border border-brand-200">
            <div className="flex items-center gap-2 text-brand-900 font-extrabold mb-1">
              <AlertTriangle className="w-4 h-4 text-brand-600" /> 3-Way Discrepancy Checks
            </div>
            <p className="text-brand-800 leading-relaxed font-medium">
              FlowGuard AI cross-validates Vendor Bills against GST Invoices & physical receiving reports in real-time.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-brand-50 border border-brand-200">
            <div className="flex items-center gap-2 text-brand-900 font-extrabold mb-1">
              <CheckCircle2 className="w-4 h-4 text-brand-600" /> Instant Payout Alerts
            </div>
            <p className="text-brand-800 leading-relaxed font-medium">
              Automatic 🎉 PAYMENT COMPLETED alerts dispatched to Vendor dashboard upon payment clearance.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
