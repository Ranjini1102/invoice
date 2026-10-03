import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Plus, Trash2, Package, ShieldCheck, Upload, ArrowRight } from 'lucide-react';

export default function CreateOrderPage() {
  const { createOrderApi, handleUploadInvoice, userRole, setActiveTab, setOrders, setSelectedOrderId, triggerGreenToast } = useApp();

  const [companyName, setCompanyName] = useState('XYZ Manufacturing');
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState('2026-10-10');
  const [poNumber, setPoNumber] = useState(`PO-${Math.floor(8000 + Math.random() * 1000)}`);
  
  const [items, setItems] = useState([
    { id: '1', name: 'Office Chairs', expectedQty: 20, unitPrice: 2500 },
    { id: '2', name: 'Executive Tables', expectedQty: 10, unitPrice: 3000 },
    { id: '3', name: 'Stationery Supplies Bundle', expectedQty: 50, unitPrice: 100 }
  ]);

  const handleItemChange = (idx, field, value) => {
    const next = [...items];
    next[idx][field] = field === 'expectedQty' || field === 'unitPrice' ? parseFloat(value) || 0 : value;
    setItems(next);
  };

  const handleAddItem = () => {
    setItems([...items, { id: `${Date.now()}`, name: '', expectedQty: 10, unitPrice: 1000 }]);
  };

  const handleRemoveItem = (idx) => {
    if (items.length <= 1) return;
    setItems(items.filter((_, i) => i !== idx));
  };

  const totalAmount = items.reduce((sum, i) => sum + (i.expectedQty * i.unitPrice), 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const nowStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

    const newOrder = {
      id: newId,
      orderNumber: newId,
      vendorName: userRole === 'vendor' ? 'ABC Supplies' : 'TechCorp Vendor',
      companyName,
      items,
      amount: totalAmount,
      currency: "₹",
      orderDate: new Date().toISOString().split('T')[0],
      expectedDeliveryDate,
      status: "Order Placed",
      stageIndex: 0,
      poNumber,
      trackingNumber: `TRK-IND-${Math.floor(100000 + Math.random() * 900000)}`,
      courierName: "FlowGuard Express Logistics",
      deliveryStatusLog: [],
      receivingVerification: { confirmed: false, hasIssue: false, issueType: null, issueDescription: null, resolved: false },
      returnReplacement: null,
      vendorBill: { uploaded: false, invoiceNumber: "", billAmount: 0, invoiceDate: "", fileUrl: null },
      companyGstBill: { uploaded: false, gstNumber: "", taxableAmount: 0, gstAmount: 0, totalAmount: 0, fileUrl: null },
      aiVerification: { runCompleted: false, matched: false, summaryMessage: "Awaiting Order Delivery" },
      paymentDetails: { transactionId: "-", paymentDate: null, paymentMethod: "NEFT", bankReference: "-", status: "PENDING" },
      timeline: [
        { stage: "Order Placed", completed: true, current: true, date: nowStr, time: "Just now", responsible: "Vendor", comment: "Order submitted." },
        { stage: "Order Accepted", completed: false, current: false, date: "-", time: "-", responsible: "Company Procurement", comment: "Pending" },
        { stage: "Order Processing", completed: false, current: false, date: "-", time: "-", responsible: "Warehouse Ops", comment: "Pending" },
        { stage: "Order Dispatched", completed: false, current: false, date: "-", time: "-", responsible: "Express Logistics", comment: "Pending" },
        { stage: "Out for Delivery", completed: false, current: false, date: "-", time: "-", responsible: "Courier Driver", comment: "Pending" },
        { stage: "Delivered", completed: false, current: false, date: "-", time: "-", responsible: "Recipient Dock", comment: "Pending" },
        { stage: "Received & Verified", completed: false, current: false, date: "-", time: "-", responsible: "Store Inspector", comment: "Pending" },
        { stage: "Bill Verified", completed: false, current: false, date: "-", time: "-", responsible: "FlowGuard AI", comment: "Pending" },
        { stage: "Payment Processing", completed: false, current: false, date: "-", time: "-", responsible: "Treasury", comment: "Pending" },
        { stage: "Payment Completed", completed: false, current: false, date: "-", time: "-", responsible: "Bank Gateway", comment: "Pending" }
      ],
      chatHistory: [
        { id: `msg-${Date.now()}`, senderRole: "ai", senderName: "FlowGuard AI Agent", message: `Order ${newId} placed successfully. Sent to ${companyName} for review.`, timestamp: nowStr }
      ],
      activityHistory: [
        { id: `act-${Date.now()}`, title: "Order Created", description: `Order ${newId} placed for ₹${totalAmount.toLocaleString('en-IN')}`, timestamp: nowStr, actor: "Vendor" }
      ]
    };

    setOrders(prev => [newOrder, ...prev]);
    setSelectedOrderId(newId);
    setActiveTab('order-details');
    triggerGreenToast('Order Placed', `Order ${newId} submitted successfully for ₹${totalAmount.toLocaleString('en-IN')}.`, `Company: ${companyName}`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 font-sans">
      
      {/* HEADER */}
      <div className="bg-white rounded-3xl border border-surface-border p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="bg-brand-100 text-brand-800 text-xs font-bold px-3 py-1 rounded-full border border-brand-200 uppercase">
            Vendor Order Request Form
          </span>
          <h1 className="text-2xl font-extrabold text-charcoal-900 mt-2">
            Create & Place New Business Order
          </h1>
          <p className="text-xs text-charcoal-600 mt-1">
            Specify order items, quantities, expected delivery date, and upload Purchase Order document.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-brand-50 px-3 py-2 rounded-xl border border-brand-200">
          <ShieldCheck className="w-5 h-5 text-brand-600" />
          <span className="text-xs font-bold text-brand-900">Encrypted Order Registry</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* ORDER HEADER FIELDS */}
        <div className="bg-white rounded-3xl border border-surface-border p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-extrabold text-charcoal-900 pb-2 border-b border-surface-border">
            Target Company & Delivery Parameters
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-bold text-charcoal-700 mb-1">Target Company / Store *</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
                className="w-full bg-surface-light border border-surface-border rounded-xl px-3 py-2 text-xs font-bold text-charcoal-900 focus:ring-2 focus:ring-brand-600"
              />
            </div>

            <div>
              <label className="block font-bold text-charcoal-700 mb-1">Expected Delivery Date *</label>
              <input
                type="date"
                value={expectedDeliveryDate}
                onChange={(e) => setExpectedDeliveryDate(e.target.value)}
                required
                className="w-full bg-surface-light border border-surface-border rounded-xl px-3 py-2 text-xs font-bold text-charcoal-900 focus:ring-2 focus:ring-brand-600"
              />
            </div>

            <div>
              <label className="block font-bold text-charcoal-700 mb-1">Purchase Order (PO) #</label>
              <input
                type="text"
                value={poNumber}
                onChange={(e) => setPoNumber(e.target.value)}
                className="w-full bg-surface-light border border-surface-border rounded-xl px-3 py-2 text-xs font-mono font-bold text-brand-700 focus:ring-2 focus:ring-brand-600"
              />
            </div>
          </div>
        </div>

        {/* ITEMS LIST MANIFEST */}
        <div className="bg-white rounded-3xl border border-surface-border p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-surface-border">
            <h3 className="text-sm font-extrabold text-charcoal-900">
              Order Consignment Items
            </h3>

            <button
              type="button"
              onClick={handleAddItem}
              className="bg-brand-50 hover:bg-brand-100 text-brand-700 font-extrabold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1 border border-brand-200"
            >
              <Plus className="w-3.5 h-3.5" /> Add Item Line
            </button>
          </div>

          <div className="space-y-3">
            {items.map((it, idx) => (
              <div key={it.id || idx} className="grid grid-cols-12 gap-3 items-center bg-surface-light p-3 rounded-2xl border border-surface-border text-xs">
                <div className="col-span-5">
                  <label className="block font-semibold text-charcoal-500 text-[10px] mb-0.5">Item Name</label>
                  <input
                    type="text"
                    value={it.name}
                    onChange={(e) => handleItemChange(idx, 'name', e.target.value)}
                    placeholder="Item description..."
                    required
                    className="w-full bg-white border border-surface-border rounded-xl px-3 py-1.5 text-xs font-bold text-charcoal-900"
                  />
                </div>

                <div className="col-span-3">
                  <label className="block font-semibold text-charcoal-500 text-[10px] mb-0.5">Quantity</label>
                  <input
                    type="number"
                    value={it.expectedQty}
                    onChange={(e) => handleItemChange(idx, 'expectedQty', e.target.value)}
                    required
                    className="w-full bg-white border border-surface-border rounded-xl px-3 py-1.5 text-xs font-mono font-bold text-charcoal-900"
                  />
                </div>

                <div className="col-span-3">
                  <label className="block font-semibold text-charcoal-500 text-[10px] mb-0.5">Unit Price (₹)</label>
                  <input
                    type="number"
                    value={it.unitPrice}
                    onChange={(e) => handleItemChange(idx, 'unitPrice', e.target.value)}
                    required
                    className="w-full bg-white border border-surface-border rounded-xl px-3 py-1.5 text-xs font-mono font-bold text-brand-700"
                  />
                </div>

                <div className="col-span-1 text-right">
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(idx)}
                    className="p-2 text-gray-400 hover:text-red-600 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 text-right">
            <span className="text-xs text-charcoal-500 font-semibold mr-2">Calculated Total Order Amount:</span>
            <span className="text-2xl font-extrabold text-brand-700 font-mono">
              ₹{totalAmount.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <div className="text-right">
          <button
            type="submit"
            className="bg-brand-600 hover:bg-brand-700 text-white font-extrabold px-8 py-3.5 rounded-2xl text-sm shadow-md transition-all inline-flex items-center gap-2"
          >
            <ShieldCheck className="w-5 h-5" /> Submit Order Request to Company
          </button>
        </div>

      </form>

    </div>
  );
}
