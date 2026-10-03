import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { demoVendors, companyProfile, initialOrders, initialNotifications } from './mockData.js';
import { runAIBillMatchingAgent, generateAIFollowUpAlerts } from './aiService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*', methods: ['GET', 'POST', 'PUT'] } });

app.use(cors());
app.use(express.json());

let vendors = [...demoVendors];
let company = { ...companyProfile };
let orders = [...initialOrders];
let notifications = [...initialNotifications];

function broadcast(type, payload) {
  io.emit(type, payload);
}

// REST ENDPOINTS

// Get Vendors
app.get('/api/vendors', (req, res) => {
  res.json({ success: true, data: vendors });
});

// Get Company Profile
app.get('/api/company', (req, res) => {
  res.json({ success: true, data: company });
});

// Get Orders (Supports ?vendorId=V001 for strict data isolation)
app.get('/api/orders', (req, res) => {
  const { vendorId } = req.query;
  if (vendorId) {
    const vendorOrders = orders.filter(o => o.vendorId === vendorId);
    return res.json({ success: true, data: vendorOrders });
  }
  res.json({ success: true, data: orders });
});

// Get Order by ID
app.get('/api/orders/:id', (req, res) => {
  const order = orders.find(o => o.id === req.params.id || o.orderNumber === req.params.id);
  if (!order) return res.status(404).json({ success: false, message: "Order not found" });

  const aiMatchResult = runAIBillMatchingAgent(order);
  res.json({ success: true, data: { ...order, aiVerification: aiMatchResult } });
});

// Create Order (Vendor)
app.post('/api/orders', (req, res) => {
  const { vendorId, vendorName, companyName, items, amount, expectedDeliveryDate, poNumber } = req.body;
  const newId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
  const nowStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

  const vId = vendorId || "V001";
  const vName = vendorName || (vendors.find(v => v.vendorId === vId)?.vendorName || "ABC Office Supplies");

  const newOrder = {
    id: newId,
    orderNumber: newId,
    vendorId: vId,
    vendorName: vName,
    companyName: companyName || "XYZ Company",
    items: items || [
      { id: "i-1", name: "Office Chairs", expectedQty: 20, receivedQty: 20, unitPrice: 2500 },
      { id: "i-2", name: "Executive Tables", expectedQty: 10, receivedQty: 10, unitPrice: 3000 }
    ],
    amount: parseFloat(amount) || 85000,
    currency: "₹",
    orderDate: new Date().toISOString().split('T')[0],
    expectedDeliveryDate: expectedDeliveryDate || "2026-10-15",
    status: "Order Placed",
    stageIndex: 0,
    poNumber: poNumber || `PO-${Math.floor(8000 + Math.random() * 1000)}`,
    trackingNumber: `TRK-IND-${Math.floor(100000 + Math.random() * 900000)}`,
    courierName: "FlowGuard Express Logistics",
    deliveryStatusLog: [
      { title: "Order Confirmed", timestamp: `${nowStr}, Just now`, location: "Procurement Desk" }
    ],
    receivingVerification: { confirmed: false, hasIssue: false, issueType: null, issueDescription: null, resolved: false },
    returnReplacement: null,
    vendorBill: { uploaded: false, invoiceNumber: "", billAmount: 0, invoiceDate: "", fileUrl: null },
    companyGstBill: { uploaded: false, gstNumber: "", taxableAmount: 0, gstAmount: 0, totalAmount: 0, fileUrl: null },
    paymentDetails: { transactionId: "-", paymentDate: null, dueDate: expectedDeliveryDate || "15 Oct 2026", status: "PENDING", amount: parseFloat(amount) || 85000 },
    timeline: [
      { stage: "Order Placed", date: nowStr, time: "Just now", responsible: `Vendor (${vName})`, comment: "Order placed." },
      { stage: "Order Confirmed", date: "-", time: "-", responsible: "XYZ Company", comment: "Pending" },
      { stage: "Order Processing", date: "-", time: "-", responsible: "Warehouse Hub", comment: "Pending" },
      { stage: "Order Dispatched", date: "-", time: "-", responsible: "Express Courier", comment: "Pending" },
      { stage: "In Transit", date: "-", time: "-", responsible: "FlowGuard Logistics", comment: "Pending" },
      { stage: "Out for Delivery", date: "-", time: "-", responsible: "Delivery Driver", comment: "Pending" },
      { stage: "Delivered", date: "-", time: "-", responsible: "Store Dock", comment: "Pending" }
    ]
  };

  orders.unshift(newOrder);

  const notif = {
    id: `notif-${Date.now()}`,
    vendorId: vId,
    orderId: newOrder.id,
    orderNumber: newOrder.orderNumber,
    recipientRole: "company",
    title: "New Order Placed",
    message: `${vName} placed Order ${newOrder.orderNumber} for ₹${newOrder.amount.toLocaleString('en-IN')}`,
    type: "order_placed",
    timestamp: nowStr,
    read: false
  };
  notifications.unshift(notif);

  broadcast('ORDER_UPDATED', newOrder);
  broadcast('NEW_NOTIFICATION', notif);

  res.status(201).json({ success: true, data: newOrder });
});

// Update Order Status / Payment Status (Company Action)
app.put('/api/orders/:id/status', (req, res) => {
  const { status, comment, transactionId } = req.body;
  const order = orders.find(o => o.id === req.params.id);
  if (!order) return res.status(404).json({ success: false, message: "Order not found" });

  const nowStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  order.status = status;

  if (status === "Paid") {
    const refId = transactionId || `PAY-${Math.floor(100000 + Math.random() * 900000)}`;
    order.paymentDetails = {
      transactionId: refId,
      paymentDate: nowStr,
      dueDate: order.paymentDetails?.dueDate || nowStr,
      status: "PAID",
      amount: order.amount
    };

    // Update Company totals
    company.paidAmount += order.amount;
    company.pendingAmount = Math.max(0, company.pendingAmount - order.amount);

    // Create Prominent Vendor Notification
    const paymentNotif = {
      id: `notif-paid-${Date.now()}`,
      vendorId: order.vendorId,
      orderId: order.id,
      orderNumber: order.orderNumber,
      invoiceNumber: order.vendorBill?.invoiceNumber || "INV-1024",
      amount: order.amount,
      vendorName: order.vendorName,
      recipientRole: "vendor",
      title: "🎉 PAYMENT COMPLETED",
      message: `₹${order.amount.toLocaleString('en-IN')} payment for Order ${order.orderNumber} has been successfully completed.`,
      type: "payment_completed",
      timestamp: `${nowStr}, ${timeStr}`,
      read: false,
      paymentHighlight: true,
      transactionId: refId
    };
    notifications.unshift(paymentNotif);
    broadcast('PAYMENT_COMPLETED_ALERT', paymentNotif);
  }

  broadcast('ORDER_UPDATED', order);
  res.json({ success: true, data: order });
});

// Notifications
app.get('/api/notifications', (req, res) => {
  const { vendorId, recipientRole } = req.query;
  let filtered = [...notifications];
  if (recipientRole === 'vendor' && vendorId) {
    filtered = filtered.filter(n => n.recipientRole === 'vendor' && n.vendorId === vendorId);
  } else if (recipientRole === 'company') {
    filtered = filtered.filter(n => n.recipientRole === 'company');
  }
  res.json({ success: true, data: filtered });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`FlowGuard AI Multi-Tenant Server listening on port ${PORT}`);
});
