import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import FlipkartOrderTimeline from '../components/FlipkartOrderTimeline';
import ReceivedItemVerificationCard from '../components/ReceivedItemVerificationCard';
import ReturnReplacementCard from '../components/ReturnReplacementCard';
import BillGstVerificationCard from '../components/BillGstVerificationCard';
import TwoWayChat from '../components/TwoWayChat';
import AIAgentWidget from '../components/AIAgentWidget';
import CompanyBillDetailsModal from '../components/CompanyBillDetailsModal';
import {
  Package,
  Truck,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  ShieldCheck,
  CreditCard,
  Clock,
  FileText
} from 'lucide-react';

export default function OrderDetails() {
  const {
    selectedOrder,
    userRole,
    handleUpdateOrderStatus,
    setActiveTab
  } = useApp();

  const [txnInput, setTxnInput] = useState('');
  const [showPayPrompt, setShowPayPrompt] = useState(false);

  // Modal state for Bill Image & Details
  const [isBillModalOpen, setIsBillModalOpen] = useState(false);

  if (!selectedOrder) {
    return (
      <div className="text-center py-16">
        <p className="text-xs text-charcoal-500">No order selected.</p>
        <button onClick={() => setActiveTab('orders')} className="mt-3 bg-brand-600 text-white px-4 py-2 rounded-xl text-xs font-bold">
          View All Orders
        </button>
      </div>
    );
  }

  const order = selectedOrder;

  return (
    <div className="space-y-6 font-sans">
      
      {/* BACK & HEADER BAR */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setActiveTab('orders')}
          className="inline-flex items-center gap-2 text-xs font-bold text-charcoal-600 hover:text-brand-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Orders Registry
        </button>

        <span className="bg-brand-100 text-brand-800 text-xs font-bold px-3 py-1 rounded-full border border-brand-200 uppercase">
          {userRole === 'vendor' ? 'Vendor Portal' : 'Company Admin Portal'}
        </span>
      </div>

      {/* 1. ORDER SUMMARY CARD */}
      <div className="bg-white rounded-3xl border border-surface-border p-6 shadow-xs relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-surface-border">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-extrabold text-charcoal-900 font-mono">
                {order.orderNumber}
              </h1>
              <span className="bg-brand-600 text-white text-xs px-3 py-1 rounded-full font-extrabold uppercase">
                {order.status}
              </span>
            </div>
            <p className="text-xs text-charcoal-600 mt-1 font-medium">
              Vendor: <span className="font-bold text-charcoal-900">{order.vendorName}</span> | Target Store: <span className="font-bold text-charcoal-900">{order.companyName}</span>
            </p>
          </div>

          <div className="flex items-center gap-3 text-right">
            <div>
              <span className="text-xs text-charcoal-500 font-medium block">Total Payable Amount</span>
              <span className="text-3xl font-extrabold text-brand-700 font-mono">
                ₹{order.amount?.toLocaleString('en-IN')}
              </span>
            </div>

            {/* PROMINENT BILL DETAILS & IMAGE BUTTON */}
            <button
              onClick={() => setIsBillModalOpen(true)}
              className="bg-brand-50 hover:bg-brand-100 text-brand-800 border border-brand-300 font-extrabold px-3.5 py-2.5 rounded-2xl text-xs transition-colors flex items-center gap-1.5 shadow-2xs"
            >
              <FileText className="w-4 h-4 text-brand-600" />
              <span>Bill Details & Image</span>
            </button>
          </div>
        </div>

        {/* 2. ITEM LIST SUMMARY */}
        <div className="pt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="bg-surface-light p-3.5 rounded-2xl border border-surface-border">
            <span className="text-charcoal-500 font-semibold block">Consignment Items</span>
            <p className="font-bold text-charcoal-900 mt-1">
              {order.items?.map(i => `${i.name} (${i.expectedQty})`).join(', ')}
            </p>
          </div>

          <div className="bg-surface-light p-3.5 rounded-2xl border border-surface-border">
            <span className="text-charcoal-500 font-semibold block">Purchase Order & Tracking #</span>
            <p className="font-bold font-mono text-brand-700 mt-1">{order.poNumber} • {order.trackingNumber}</p>
          </div>

          <div className="bg-surface-light p-3.5 rounded-2xl border border-surface-border">
            <span className="text-charcoal-500 font-semibold block">Expected Delivery Date</span>
            <p className="font-bold text-charcoal-900 mt-1">{order.expectedDeliveryDate}</p>
          </div>
        </div>

        {/* ADMIN CONTROLS BAR */}
        {userRole === 'company' && order.status !== 'Paid' && (
          <div className="mt-5 pt-4 border-t border-surface-border flex flex-wrap items-center justify-between gap-3 bg-surface-light p-3 rounded-2xl">
            <span className="text-xs font-bold text-charcoal-700">Company Operations Actions:</span>

            <div className="flex flex-wrap items-center gap-2">
              {order.status === 'Order Placed' && (
                <button
                  onClick={() => handleUpdateOrderStatus(order.id, 'Order Accepted', 'Accepted by Company Procurement')}
                  className="bg-brand-600 hover:bg-brand-700 text-white font-extrabold px-4 py-2 rounded-xl text-xs shadow-xs"
                >
                  Accept Order
                </button>
              )}

              {order.status === 'Order Accepted' && (
                <button
                  onClick={() => handleUpdateOrderStatus(order.id, 'Order Dispatched', 'Dispatched via Express Logistics')}
                  className="bg-brand-700 hover:bg-brand-800 text-white font-extrabold px-4 py-2 rounded-xl text-xs shadow-xs flex items-center gap-1"
                >
                  <Truck className="w-4 h-4" /> Dispatch Order
                </button>
              )}

              {order.status === 'Order Dispatched' && (
                <button
                  onClick={() => handleUpdateOrderStatus(order.id, 'Out for Delivery', 'Out for final delivery')}
                  className="bg-brand-600 hover:bg-brand-700 text-white font-extrabold px-4 py-2 rounded-xl text-xs shadow-xs"
                >
                  Mark Out for Delivery
                </button>
              )}

              {order.status === 'Out for Delivery' && (
                <button
                  onClick={() => handleUpdateOrderStatus(order.id, 'Delivered', 'Delivered to recipient dock')}
                  className="bg-brand-600 hover:bg-brand-700 text-white font-extrabold px-4 py-2 rounded-xl text-xs shadow-xs"
                >
                  Mark Delivered
                </button>
              )}

              <button
                onClick={() => setIsBillModalOpen(true)}
                className="bg-brand-50 border border-brand-300 text-brand-800 font-extrabold px-3 py-2 rounded-xl text-xs flex items-center gap-1"
              >
                <FileText className="w-4 h-4 text-brand-600" /> Enter / Inspect Bill
              </button>

              <button
                onClick={() => setShowPayPrompt(!showPayPrompt)}
                className="bg-brand-600 hover:bg-brand-700 text-white font-extrabold px-4 py-2 rounded-xl text-xs shadow-md flex items-center gap-1.5 animate-pulse-subtle"
              >
                <CheckCircle2 className="w-4 h-4" /> Mark Payment as Paid
              </button>
            </div>
          </div>
        )}

        {/* PAY PROMPT FORM */}
        {showPayPrompt && (
          <div className="mt-3 p-4 bg-brand-50 border border-brand-300 rounded-2xl text-xs space-y-3">
            <h4 className="font-extrabold text-brand-900">Enter Payment Reference Details</h4>
            <div className="flex gap-2">
              <input
                type="text"
                value={txnInput}
                onChange={(e) => setTxnInput(e.target.value)}
                placeholder="Bank Reference ID (e.g., PAY-847291)..."
                className="flex-1 bg-white border border-brand-200 rounded-xl px-3 py-2 text-xs text-charcoal-900 font-mono font-bold"
              />
              <button
                onClick={() => {
                  handleUpdateOrderStatus(order.id, 'Paid', 'Payment cleared via HDFC RTGS Gateway', '', txnInput || 'PAY-847291');
                  setShowPayPrompt(false);
                }}
                className="bg-brand-600 hover:bg-brand-700 text-white font-extrabold px-4 py-2 rounded-xl shadow-xs"
              >
                Confirm & Mark Paid
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 3. FLIPKART-STYLE ORDER TRACKING TIMELINE */}
      <FlipkartOrderTimeline order={order} />

      {/* 4. DELIVERY TRACKING CARD */}
      <div className="bg-white rounded-3xl border border-surface-border p-6 shadow-xs space-y-3 text-xs">
        <h3 className="text-sm font-extrabold text-charcoal-900 flex items-center gap-2">
          <Truck className="w-4 h-4 text-brand-600" /> Delivery & Logistics Shipment Audit
        </h3>

        <div className="bg-surface-light p-4 rounded-2xl border border-surface-border space-y-2">
          <div className="flex items-center justify-between font-extrabold text-charcoal-900">
            <span>Courier: {order.courierName}</span>
            <span className="font-mono text-brand-700">Tracking: {order.trackingNumber}</span>
          </div>

          <div className="space-y-1 pt-1 font-medium text-charcoal-700">
            {order.deliveryStatusLog?.map((log, idx) => (
              <div key={idx} className="flex items-center justify-between py-1 border-b border-gray-100 last:border-0">
                <span className="font-bold text-brand-800">✓ {log.title}</span>
                <span className="text-charcoal-500">{log.location} • {log.timestamp}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5. RECEIVED ITEM VERIFICATION */}
      <ReceivedItemVerificationCard order={order} />

      {/* 6 & 7. MISSING / DAMAGED ITEMS & RETURN / REPLACEMENT */}
      <ReturnReplacementCard order={order} />

      {/* 8. TWO-WAY COMMUNICATION */}
      <TwoWayChat invoice={order} />

      {/* 9, 10 & 11. VENDOR BILL, COMPANY GST BILL & AI VERIFICATION */}
      <BillGstVerificationCard order={order} />

      {/* AI FOLLOW-UP AGENT WIDGET */}
      <AIAgentWidget invoice={order} />

      {/* 12 & 13. PAYMENT DETAILS & IMMUTABLE ACTIVITY HISTORY */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* PAYMENT DETAILS */}
        <div className="bg-white rounded-3xl border border-surface-border p-6 shadow-xs text-xs space-y-3">
          <h3 className="text-sm font-extrabold text-charcoal-900 flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-brand-600" /> Payment Settlement Details
          </h3>

          <div className="bg-surface-light p-4 rounded-2xl border border-surface-border space-y-2 font-mono">
            <div className="flex justify-between">
              <span className="text-charcoal-500">Payment Status:</span>
              <span className={`font-extrabold ${order.status === 'Paid' ? 'text-brand-700' : 'text-charcoal-700'}`}>
                {order.paymentDetails?.status || 'PENDING'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-charcoal-500">Transaction Ref ID:</span>
              <span className="font-bold text-charcoal-900">{order.paymentDetails?.transactionId || '-'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-charcoal-500">Payment Date:</span>
              <span className="font-bold text-charcoal-900">{order.paymentDetails?.paymentDate || '-'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-charcoal-500">Payout Channel:</span>
              <span className="font-bold text-charcoal-900">{order.paymentDetails?.paymentMethod || 'NEFT Transfer'}</span>
            </div>
          </div>
        </div>

        {/* ACTIVITY HISTORY */}
        <div className="bg-white rounded-3xl border border-surface-border p-6 shadow-xs text-xs space-y-3">
          <h3 className="text-sm font-extrabold text-charcoal-900 flex items-center gap-2">
            <Clock className="w-4 h-4 text-brand-600" /> Immutable Activity History
          </h3>

          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {order.activityHistory?.map((act) => (
              <div key={act.id} className="pb-2 border-b border-gray-100 last:border-0">
                <div className="flex justify-between font-bold text-charcoal-900">
                  <span>{act.title}</span>
                  <span className="text-[10px] text-charcoal-400">{act.timestamp}</span>
                </div>
                <p className="text-charcoal-600 text-[11px]">{act.description}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* BILL DETAILS MODAL */}
      <CompanyBillDetailsModal
        order={order}
        isOpen={isBillModalOpen}
        onClose={() => setIsBillModalOpen(false)}
      />

    </div>
  );
}
