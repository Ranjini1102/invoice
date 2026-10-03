import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { demoVendors, companyProfile, initialOrders, initialNotifications } from '../../../server/mockData.js';
import {
  fetchOrders,
  fetchNotifications,
  createOrderApi,
  updateOrderStatusApi,
  confirmReceivingApi,
  updateReplacementApi,
  uploadBillsApi
} from '../services/api.js';

const AppContext = createContext();

export function AppProvider({ children }) {
  // Screen Management ('landing', 'login', 'app')
  const [authScreen, setAuthScreen] = useState('landing');
  const [loginRole, setLoginRole] = useState('vendor'); // 'vendor' or 'company'
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('vendor'); // 'vendor' or 'company'
  const [currentVendorId, setCurrentVendorId] = useState('V001'); // Vendor account switcher

  const [orders, setOrders] = useState(initialOrders);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [selectedOrderId, setSelectedOrderId] = useState('ORD-1024');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [paymentSuccessModal, setPaymentSuccessModal] = useState({ open: false, data: null });
  const [toast, setToast] = useState({ show: false, title: '', message: '', details: '', time: '' });

  // Sync data with backend
  useEffect(() => {
    async function loadData() {
      const ords = await fetchOrders();
      if (ords && ords.length > 0) setOrders(ords);

      const notifs = await fetchNotifications();
      if (notifs && notifs.length > 0) setNotifications(notifs);
    }
    loadData();
    const interval = setInterval(loadData, 4000);
    return () => clearInterval(interval);
  }, []);

  const activeVendor = demoVendors.find(v => v.vendorId === currentVendorId) || demoVendors[0];

  // Data isolation: Filter orders by vendor if vendor logged in
  const filteredOrders = userRole === 'vendor'
    ? orders.filter(o => o.vendorId === currentVendorId)
    : orders;

  const selectedOrder = orders.find(o => o.id === selectedOrderId) || orders[0];

  const triggerGreenToast = (title, message, details = '') => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setToast({ show: true, title, message, details, time: timeStr });
    setTimeout(() => setToast({ show: false, title: '', message: '', details: '', time: '' }), 5000);
  };

  const triggerPaymentCompletedAlert = (paymentInfo) => {
    setPaymentSuccessModal({ open: true, data: paymentInfo });
    try {
      confetti({
        particleCount: 140,
        spread: 85,
        origin: { y: 0.6 },
        colors: ['#16A34A', '#22C55E', '#86EFAC', '#DCFCE7']
      });
    } catch (e) {
      console.log('Confetti effect triggered');
    }
  };

  // Status Change Handler (Order Workflow)
  const handleUpdateOrderStatus = async (id, newStatus, comment = '', trackingNum = '', transactionId = '') => {
    const nowStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const refId = transactionId || `PAY-${Math.floor(100000 + Math.random() * 900000)}`;

    setOrders(prev => prev.map(ord => {
      if (ord.id !== id) return ord;

      let stageIdx = ord.stageIndex;
      if (newStatus === "Order Accepted") stageIdx = 1;
      if (newStatus === "Order Processing") stageIdx = 2;
      if (newStatus === "Order Dispatched") stageIdx = 3;
      if (newStatus === "Out for Delivery") stageIdx = 4;
      if (newStatus === "Delivered") stageIdx = 5;
      if (newStatus === "Received & Verified") stageIdx = 6;
      if (newStatus === "Bill Verified") stageIdx = 7;
      if (newStatus === "Payment Processing") stageIdx = 8;
      if (newStatus === "Paid") stageIdx = 9;

      const newTimeline = ord.timeline.map((t, i) => {
        if (i < stageIdx) return { ...t, completed: true, current: false };
        if (i === stageIdx) return { ...t, completed: newStatus === 'Paid', current: newStatus !== 'Paid', date: nowStr, time: timeStr, comment: comment || t.comment };
        return t;
      });

      const updatedOrd = {
        ...ord,
        status: newStatus,
        stageIndex: stageIdx,
        trackingNumber: trackingNum || ord.trackingNumber,
        timeline: newTimeline,
        paymentDetails: newStatus === "Paid" ? {
          transactionId: refId,
          paymentDate: nowStr,
          paymentMethod: "NEFT / RTGS Bank Transfer",
          bankReference: `HDFC000${Math.floor(1000 + Math.random() * 9000)}-${refId}`,
          status: "PAID"
        } : ord.paymentDetails
      };

      if (newStatus === "Paid") {
        const paymentNotif = {
          id: `notif-paid-${Date.now()}`,
          orderId: ord.id,
          orderNumber: ord.orderNumber,
          vendorId: ord.vendorId,
          invoiceNumber: ord.vendorBill?.invoiceNumber || "INV-1024",
          amount: ord.amount,
          vendorName: ord.vendorName,
          recipientRole: "vendor",
          title: "✓ PAYMENT COMPLETED",
          message: `Payment of ₹${ord.amount.toLocaleString('en-IN')} for Order ${ord.orderNumber} has been successfully completed.`,
          type: "payment_completed",
          timestamp: `${nowStr}, ${timeStr}`,
          read: false,
          transactionId: refId
        };
        setNotifications(nPrev => [paymentNotif, ...nPrev]);
        triggerGreenToast('✓ PAYMENT COMPLETED', `Payment of ₹${ord.amount.toLocaleString('en-IN')} for Order ${ord.orderNumber} successfully completed.`, `Ref ID: ${refId}`);
        triggerPaymentCompletedAlert(paymentNotif);
      } else {
        triggerGreenToast(`Order Status: ${newStatus}`, `Order ${ord.orderNumber} moved to ${newStatus}.`, `Vendor: ${ord.vendorName}`);
      }

      return updatedOrd;
    }));

    await updateOrderStatusApi(id, newStatus, comment, trackingNum, refId);
  };

  // Confirm Received Items & Report Missing/Damaged Issue
  const handleConfirmReceiving = async (id, receivingData) => {
    const nowStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setOrders(prev => prev.map(ord => {
      if (ord.id !== id) return ord;

      const updatedItems = ord.items.map(it => {
        const match = (receivingData.itemsReceived || []).find(r => r.id === it.id || r.name === it.name);
        return match ? { ...it, receivedQty: parseInt(match.receivedQty) } : it;
      });

      const hasIssue = receivingData.hasIssue;
      const isResolved = !hasIssue;

      return {
        ...ord,
        items: updatedItems,
        receivingVerification: {
          confirmed: true,
          hasIssue,
          issueType: receivingData.issueType || null,
          issueDescription: receivingData.issueDescription || null,
          resolved: isResolved
        },
        returnReplacement: hasIssue ? {
          id: `RET-${ord.orderNumber.replace('ORD-', '')}`,
          reason: receivingData.issueDescription || `${receivingData.issueType} reported`,
          status: "Company Reviewing",
          stageIndex: 1
        } : null,
        stageIndex: isResolved ? 6 : ord.stageIndex,
        timeline: ord.timeline.map((t, i) => {
          if (i === 6 && isResolved) return { ...t, completed: true, current: true, date: nowStr, time: timeStr, comment: "✓ All items verified cleanly." };
          return t;
        }),
        chatHistory: [
          ...(ord.chatHistory || []),
          {
            id: `msg-${Date.now()}`,
            senderRole: "vendor",
            senderName: `${ord.vendorName} (Vendor)`,
            message: hasIssue ? `⚠ Issue Reported: ${receivingData.issueDescription}` : "✓ All items received in perfect condition.",
            timestamp: `${nowStr}, ${timeStr}`
          }
        ]
      };
    }));

    if (receivingData.hasIssue) {
      triggerGreenToast('Issue Reported', `Reported ${receivingData.issueType} on Order ${id}.`, 'Company notified for replacement approval.');
    } else {
      triggerGreenToast('Items Verified', `All items received cleanly for Order ${id}.`, 'Proceeding to Bill & GST verification.');
    }

    await confirmReceivingApi(id, receivingData);
  };

  // Return / Replacement Handler
  const handleReplacementAction = async (id, action, comment = '') => {
    const nowStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setOrders(prev => prev.map(ord => {
      if (ord.id !== id) return ord;

      let retStatus = "Company Reviewing";
      let retStageIdx = 1;

      if (action === 'approve') { retStatus = "Approved"; retStageIdx = 2; }
      if (action === 'dispatch') { retStatus = "Replacement Dispatched"; retStageIdx = 3; }
      if (action === 'resolve') { retStatus = "Issue Resolved"; retStageIdx = 5; }

      const isResolved = action === 'resolve';

      return {
        ...ord,
        returnReplacement: {
          ...ord.returnReplacement,
          status: retStatus,
          stageIndex: retStageIdx
        },
        items: isResolved ? ord.items.map(it => ({ ...it, receivedQty: it.expectedQty })) : ord.items,
        receivingVerification: isResolved ? { ...ord.receivingVerification, resolved: true } : ord.receivingVerification,
        stageIndex: isResolved ? 6 : ord.stageIndex,
        timeline: ord.timeline.map((t, i) => {
          if (i === 6 && isResolved) return { ...t, completed: true, current: true, date: nowStr, time: timeStr, comment: "✓ Replacement received & issue resolved." };
          return t;
        }),
        chatHistory: [
          ...(ord.chatHistory || []),
          {
            id: `msg-${Date.now()}`,
            senderRole: userRole === 'vendor' ? 'vendor' : 'company',
            senderName: userRole === 'vendor' ? `${ord.vendorName}` : `${ord.companyName} Admin`,
            message: isResolved ? "Replacement received. All items verified cleanly." : `Replacement Action: ${retStatus}`,
            timestamp: `${nowStr}, ${timeStr}`
          }
        ]
      };
    }));

    triggerGreenToast('Replacement Updated', `Replacement status updated to: ${action}`, `Order ${id}`);
    await updateReplacementApi(id, action, comment);
  };

  // Upload Vendor Bill & Company GST Bill
  const handleUploadBills = async (id, billData) => {
    const nowStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setOrders(prev => prev.map(ord => {
      if (ord.id !== id) return ord;

      const isVendorBill = billData.billType === 'vendor';

      const updatedVendorBill = isVendorBill ? {
        uploaded: true,
        invoiceNumber: billData.invoiceNumber || `INV-${ord.orderNumber.replace('ORD-', '')}`,
        billAmount: parseFloat(billData.billAmount) || ord.amount,
        invoiceDate: nowStr,
        fileUrl: "#"
      } : ord.vendorBill;

      const updatedGstBill = !isVendorBill ? {
        uploaded: true,
        gstNumber: billData.gstNumber || "27AAACX9921K1ZE",
        taxableAmount: parseFloat(billData.taxableAmount) || Math.round(ord.amount * 0.82),
        gstAmount: parseFloat(billData.gstAmount) || Math.round(ord.amount * 0.18),
        totalAmount: parseFloat(billData.totalAmount) || ord.amount,
        fileUrl: "#"
      } : ord.companyGstBill;

      const bothUploaded = updatedVendorBill?.uploaded && updatedGstBill?.uploaded;

      return {
        ...ord,
        vendorBill: updatedVendorBill,
        companyGstBill: updatedGstBill,
        aiVerification: {
          runCompleted: bothUploaded,
          matched: bothUploaded,
          vendorNameMatched: true,
          gstNumberMatched: true,
          poNumberMatched: true,
          itemQuantityMatched: true,
          itemPriceMatched: true,
          gstAmountMatched: true,
          totalAmountMatched: true,
          duplicateDetected: false,
          summaryMessage: bothUploaded ? "✓ Documents Matched Successfully" : "Awaiting both Vendor Bill & Company GST Invoice"
        },
        stageIndex: bothUploaded ? 7 : ord.stageIndex,
        timeline: ord.timeline.map((t, i) => {
          if (i === 7 && bothUploaded) return { ...t, completed: true, current: true, date: nowStr, time: timeStr, comment: "✓ FlowGuard AI Agent: Bill & GST matched 100%." };
          return t;
        }),
        chatHistory: [
          ...(ord.chatHistory || []),
          {
            id: `msg-${Date.now()}`,
            senderRole: isVendorBill ? 'vendor' : 'company',
            senderName: isVendorBill ? `${ord.vendorName}` : `${ord.companyName} Admin`,
            message: isVendorBill ? `Uploaded Vendor Bill ${updatedVendorBill.invoiceNumber}` : `Uploaded Company GST Invoice (${updatedGstBill.gstNumber})`,
            timestamp: `${nowStr}, ${timeStr}`
          }
        ]
      };
    }));

    triggerGreenToast('Bill Uploaded', `Document uploaded for Order ${id}.`, 'FlowGuard AI Verification Agent cross-matching...');
    await uploadBillsApi(id, billData);
  };

  // Two-Way Chat Sender
  const handleSendMessage = (orderId, text, roleOverride = null) => {
    const nowStr = `${new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}, ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    const role = roleOverride || userRole;
    const name = role === 'vendor' ? `${activeVendor.vendorName} (Vendor)` : role === 'ai' ? 'FlowGuard AI Agent' : `${companyProfile.companyName} Admin`;

    setOrders(prev => prev.map(ord => {
      if (ord.id !== orderId) return ord;
      return {
        ...ord,
        chatHistory: [
          ...(ord.chatHistory || []),
          { id: `msg-${Date.now()}`, senderRole: role, senderName: name, message: text, timestamp: nowStr }
        ]
      };
    }));
  };

  // Logout Action
  const handleLogout = () => {
    setIsLoggedIn(false);
    setAuthScreen('login');
    setActiveTab('dashboard');
    triggerGreenToast('Logged Out', 'Successfully logged out of FlowGuard AI.', 'Select Vendor or Company portal to log back in.');
  };

  // 24-STEP END-TO-END DEMO SCENARIO AUTOMATION
  const run24StepDemoScenario = () => {
    setSelectedOrderId('ORD-1024');
    setActiveTab('order-details');
    setUserRole('company');
    handleUpdateOrderStatus('ORD-1024', 'Paid', 'Payment processed via HDFC RTGS Gateway', '', 'PAY-847291');
  };

  return (
    <AppContext.Provider
      value={{
        authScreen,
        setAuthScreen,
        loginRole,
        setLoginRole,
        isLoggedIn,
        setIsLoggedIn,
        userRole,
        setUserRole,
        currentVendorId,
        setCurrentVendorId,
        demoVendors,
        companyProfile,
        activeVendor,
        orders,
        setOrders,
        filteredOrders,
        notifications,
        setNotifications,
        selectedOrderId,
        setSelectedOrderId,
        selectedOrder,
        activeTab,
        setActiveTab,
        toast,
        setToast,
        paymentSuccessModal,
        setPaymentSuccessModal,
        handleUpdateOrderStatus,
        handleConfirmReceiving,
        handleReplacementAction,
        handleUploadBills,
        handleSendMessage,
        handleLogout,
        run24StepDemoScenario,
        triggerGreenToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
