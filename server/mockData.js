// Multiple Vendors Dataset for FlowGuard AI
export const demoVendors = [
  {
    vendorId: "V001",
    vendorName: "ABC Office Supplies",
    email: "vendor.abc@flowguard.ai",
    phone: "+91 98765 43210",
    address: "124 Industrial Estate, Hubli, Karnataka",
    gstNumber: "29AAACA1234A1Z5",
    totalOrdersCount: 12,
    completedOrdersCount: 8,
    pendingPaymentAmount: 120000,
    paidAmount: 480000
  },
  {
    vendorId: "V002",
    vendorName: "Sri Lakshmi Furnitures",
    email: "vendor.lakshmi@flowguard.ai",
    phone: "+91 98765 12345",
    address: "45 Furniture Park, Bengaluru, Karnataka",
    gstNumber: "29BBBCL5678B1Z2",
    totalOrdersCount: 8,
    completedOrdersCount: 5,
    pendingPaymentAmount: 85000,
    paidAmount: 320000
  },
  {
    vendorId: "V003",
    vendorName: "Metro Stationery",
    email: "vendor.metro@flowguard.ai",
    phone: "+91 98765 88888",
    address: "88 Commercial Street, Mysuru, Karnataka",
    gstNumber: "29CCCMM9911C1Z8",
    totalOrdersCount: 15,
    completedOrdersCount: 15,
    pendingPaymentAmount: 0,
    paidAmount: 650000
  },
  {
    vendorId: "V004",
    vendorName: "Prime Industrial Supplies",
    email: "vendor.prime@flowguard.ai",
    phone: "+91 98765 77777",
    address: "10-B Peenya Industrial Area, Bengaluru, Karnataka",
    gstNumber: "29DDDPP4433D1Z9",
    totalOrdersCount: 6,
    completedOrdersCount: 3,
    pendingPaymentAmount: 150000,
    paidAmount: 220000
  }
];

export const companyProfile = {
  companyId: "C001",
  companyName: "XYZ Company",
  email: "admin@xyzcompany.com",
  phone: "+91 80000 11111",
  address: "XYZ Tech Park, Whitefield, Bengaluru, Karnataka",
  gstNumber: "29XYZCO9988C1Z1",
  totalPayableAmount: 1245000,
  paidAmount: 820000,
  pendingAmount: 325000,
  processingAmount: 100000
};

export const initialOrders = [
  {
    id: "ORD-1024",
    orderNumber: "ORD-1024",
    vendorId: "V001", // ABC Office Supplies
    vendorName: "ABC Office Supplies",
    companyName: "XYZ Company",
    items: [
      { id: "item-1", name: "Office Chairs", expectedQty: 20, receivedQty: 18, unitPrice: 2500 },
      { id: "item-2", name: "Executive Tables", expectedQty: 10, receivedQty: 10, unitPrice: 3000 },
      { id: "item-3", name: "Stationery Supplies Bundle", expectedQty: 50, receivedQty: 50, unitPrice: 100 }
    ],
    amount: 85000,
    currency: "₹",
    orderDate: "2026-10-05",
    expectedDeliveryDate: "2026-10-10",
    status: "Out for Delivery",
    stageIndex: 5, // 0: Placed, 1: Confirmed, 2: Processing, 3: Dispatched, 4: In Transit, 5: Out for Delivery, 6: Delivered
    poNumber: "PO-8842",
    trackingNumber: "TRK-IND-991823",
    courierName: "FlowGuard Express Logistics",
    deliveryStatusLog: [
      { title: "Order Confirmed", timestamp: "05 Oct, 11:20 AM", location: "Procurement Desk" },
      { title: "Order Processing", timestamp: "06 Oct, 02:00 PM", location: "Depot Warehouse" },
      { title: "Order Dispatched", timestamp: "07 Oct, 10:30 AM", location: "Central Distribution Hub" },
      { title: "In Transit", timestamp: "08 Oct, 04:15 PM", location: "En-route sorting center" },
      { title: "Out for Delivery", timestamp: "09 Oct, 09:20 AM", location: "Local Vehicle #4" }
    ],
    receivingVerification: {
      confirmed: false,
      hasIssue: true,
      issueType: "Quantity Mismatch",
      issueDescription: "Received 18 Office Chairs instead of 20. 2 chairs missing.",
      resolved: false
    },
    returnReplacement: {
      id: "RET-1024",
      reason: "2 Office Chairs Missing",
      status: "Replacement Approved", // Issue Reported -> Company Reviewing -> Replacement Approved -> Replacement Dispatched -> Replacement Delivered -> Issue Resolved
      stageIndex: 2
    },
    vendorBill: {
      uploaded: true,
      invoiceNumber: "INV-1024",
      billAmount: 85000,
      invoiceDate: "2026-10-05",
      fileUrl: "#"
    },
    companyGstBill: {
      uploaded: true,
      gstNumber: "29XYZCO9988C1Z1",
      taxableAmount: 72033,
      gstAmount: 12967,
      totalAmount: 85000,
      fileUrl: "#"
    },
    paymentDetails: {
      transactionId: "PAY-847291",
      paymentDate: "10 Oct 2026",
      dueDate: "10 Oct 2026",
      status: "PAID",
      amount: 85000
    },
    timeline: [
      { stage: "Order Placed", date: "05 Oct", time: "10:30 AM", responsible: "Vendor (ABC Office Supplies)", comment: "Order placed." },
      { stage: "Order Confirmed", date: "05 Oct", time: "11:20 AM", responsible: "XYZ Company", comment: "Confirmed by Procurement." },
      { stage: "Order Processing", date: "06 Oct", time: "02:00 PM", responsible: "Warehouse Hub", comment: "Packed & quality checked." },
      { stage: "Order Dispatched", date: "07 Oct", time: "10:30 AM", responsible: "Express Courier", comment: "Handed over for transport." },
      { stage: "In Transit", date: "08 Oct", time: "04:15 PM", responsible: "FlowGuard Logistics", comment: "En-route to city depot." },
      { stage: "Out for Delivery", date: "09 Oct", time: "09:20 AM", responsible: "Delivery Driver", comment: "Out for final destination delivery." },
      { stage: "Delivered", date: "-", time: "-", responsible: "Store Dock", comment: "Pending arrival" }
    ]
  },
  {
    id: "ORD-1030",
    orderNumber: "ORD-1030",
    vendorId: "V002", // Sri Lakshmi Furnitures
    vendorName: "Sri Lakshmi Furnitures",
    companyName: "XYZ Company",
    items: [
      { id: "item-10", name: "Conference Room Sofa Set", expectedQty: 4, receivedQty: 4, unitPrice: 10500 }
    ],
    amount: 42000,
    currency: "₹",
    orderDate: "2026-10-06",
    expectedDeliveryDate: "2026-10-12",
    status: "Delivered",
    stageIndex: 6,
    poNumber: "PO-9011",
    trackingNumber: "TRK-IND-4412",
    courierName: "VRL Logistics",
    deliveryStatusLog: [
      { title: "Dispatched", timestamp: "07 Oct, 09:00 AM", location: "Lakshmi Depot" },
      { title: "Delivered", timestamp: "09 Oct, 02:00 PM", location: "XYZ Office" }
    ],
    receivingVerification: { confirmed: true, hasIssue: false, issueType: null, issueDescription: null, resolved: true },
    returnReplacement: null,
    vendorBill: { uploaded: true, invoiceNumber: "INV-1030", billAmount: 42000, invoiceDate: "2026-10-06", fileUrl: "#" },
    companyGstBill: { uploaded: true, gstNumber: "29XYZCO9988C1Z1", taxableAmount: 35593, gstAmount: 6407, totalAmount: 42000, fileUrl: "#" },
    paymentDetails: {
      transactionId: "PAY-110293",
      paymentDate: null,
      dueDate: "12 Oct 2026",
      status: "PROCESSING",
      amount: 42000
    },
    timeline: [
      { stage: "Order Placed", date: "06 Oct", time: "09:00 AM", responsible: "Sri Lakshmi Furnitures", comment: "Placed" },
      { stage: "Order Confirmed", date: "06 Oct", time: "11:00 AM", responsible: "XYZ Company", comment: "Confirmed" },
      { stage: "Order Processing", date: "06 Oct", time: "03:00 PM", responsible: "Furnitures Depot", comment: "Processing" },
      { stage: "Order Dispatched", date: "07 Oct", time: "09:00 AM", responsible: "VRL Logistics", comment: "Dispatched" },
      { stage: "In Transit", date: "08 Oct", time: "10:00 AM", responsible: "VRL Transport", comment: "In transit" },
      { stage: "Out for Delivery", date: "09 Oct", time: "08:00 AM", responsible: "Local Vehicle", comment: "Out for delivery" },
      { stage: "Delivered", date: "09 Oct", time: "02:00 PM", responsible: "Recipient Desk", comment: "Delivered" }
    ]
  },
  {
    id: "ORD-1035",
    orderNumber: "ORD-1035",
    vendorId: "V003", // Metro Stationery
    vendorName: "Metro Stationery",
    companyName: "XYZ Company",
    items: [
      { id: "item-20", name: "A4 Printing Paper Boxes", expectedQty: 100, receivedQty: 100, unitPrice: 285 }
    ],
    amount: 28500,
    currency: "₹",
    orderDate: "2026-10-01",
    expectedDeliveryDate: "2026-10-05",
    status: "Delivered",
    stageIndex: 6,
    poNumber: "PO-7710",
    trackingNumber: "TRK-IND-8812",
    courierName: "DTDC Courier",
    deliveryStatusLog: [
      { title: "Delivered", timestamp: "04 Oct, 03:00 PM", location: "XYZ Stationery Store" }
    ],
    receivingVerification: { confirmed: true, hasIssue: false, resolved: true },
    returnReplacement: null,
    vendorBill: { uploaded: true, invoiceNumber: "INV-1035", billAmount: 28500, invoiceDate: "2026-10-01", fileUrl: "#" },
    companyGstBill: { uploaded: true, gstNumber: "29XYZCO9988C1Z1", taxableAmount: 24152, gstAmount: 4348, totalAmount: 28500, fileUrl: "#" },
    paymentDetails: {
      transactionId: "PAY-991203",
      paymentDate: null,
      dueDate: "08 Oct 2026",
      status: "OVERDUE",
      amount: 28500
    },
    timeline: [
      { stage: "Order Placed", date: "01 Oct", time: "08:00 AM", responsible: "Metro Stationery", comment: "Placed" },
      { stage: "Order Confirmed", date: "01 Oct", time: "09:00 AM", responsible: "XYZ Company", comment: "Confirmed" },
      { stage: "Order Processing", date: "02 Oct", time: "10:00 AM", responsible: "Metro Hub", comment: "Processed" },
      { stage: "Order Dispatched", date: "03 Oct", time: "09:00 AM", responsible: "DTDC", comment: "Dispatched" },
      { stage: "In Transit", date: "03 Oct", time: "02:00 PM", responsible: "DTDC", comment: "In Transit" },
      { stage: "Out for Delivery", date: "04 Oct", time: "09:00 AM", responsible: "DTDC Driver", comment: "Out for Delivery" },
      { stage: "Delivered", date: "04 Oct", time: "03:00 PM", responsible: "Store Manager", comment: "Delivered" }
    ]
  },
  {
    id: "ORD-1040",
    orderNumber: "ORD-1040",
    vendorId: "V004", // Prime Industrial Supplies
    vendorName: "Prime Industrial Supplies",
    companyName: "XYZ Company",
    items: [
      { id: "item-30", name: "Heavy Duty Safety Gloves & Helmets", expectedQty: 50, receivedQty: 50, unitPrice: 3000 }
    ],
    amount: 150000,
    currency: "₹",
    orderDate: "2026-10-04",
    expectedDeliveryDate: "2026-10-14",
    status: "In Transit",
    stageIndex: 4,
    poNumber: "PO-6620",
    trackingNumber: "TRK-IND-3392",
    courierName: "Safexpress Cargo",
    deliveryStatusLog: [
      { title: "Dispatched", timestamp: "06 Oct, 11:00 AM", location: "Peenya Industrial Hub" },
      { title: "In Transit", timestamp: "08 Oct, 09:00 AM", location: "Highway Hub" }
    ],
    receivingVerification: { confirmed: false, hasIssue: false, resolved: false },
    returnReplacement: null,
    vendorBill: { uploaded: true, invoiceNumber: "INV-1040", billAmount: 150000, invoiceDate: "2026-10-04", fileUrl: "#" },
    companyGstBill: { uploaded: false, gstNumber: "", taxableAmount: 0, gstAmount: 0, totalAmount: 0, fileUrl: null },
    paymentDetails: {
      transactionId: "-",
      paymentDate: null,
      dueDate: "14 Oct 2026",
      status: "PENDING",
      amount: 150000
    },
    timeline: [
      { stage: "Order Placed", date: "04 Oct", time: "10:00 AM", responsible: "Prime Industrial", comment: "Placed" },
      { stage: "Order Confirmed", date: "04 Oct", time: "02:00 PM", responsible: "XYZ Company", comment: "Confirmed" },
      { stage: "Order Processing", date: "05 Oct", time: "09:00 AM", responsible: "Prime Warehouse", comment: "Processing" },
      { stage: "Order Dispatched", date: "06 Oct", time: "11:00 AM", responsible: "Safexpress", comment: "Dispatched" },
      { stage: "In Transit", date: "08 Oct", time: "09:00 AM", responsible: "Safexpress Cargo", comment: "In Transit" },
      { stage: "Out for Delivery", date: "-", time: "-", responsible: "Cargo Driver", comment: "Pending" },
      { stage: "Delivered", date: "-", time: "-", responsible: "Factory Dock", comment: "Pending" }
    ]
  }
];

export const initialNotifications = [
  {
    id: "notif-v1",
    vendorId: "V001",
    orderId: "ORD-1024",
    orderNumber: "ORD-1024",
    recipientRole: "vendor",
    title: "Order Dispatched",
    message: "Your order ORD-1024 is Out for Delivery.",
    type: "order_dispatched",
    timestamp: "09 Oct, 09:20 AM",
    read: false
  },
  {
    id: "notif-v1-paid",
    vendorId: "V001",
    orderId: "ORD-1024",
    orderNumber: "ORD-1024",
    recipientRole: "vendor",
    title: "🎉 PAYMENT COMPLETED",
    message: "₹85,000 payment for Order ORD-1024 has been successfully completed.",
    type: "payment_completed",
    timestamp: "10 Oct 2026",
    read: false,
    paymentHighlight: true,
    amount: 85000,
    transactionId: "PAY-847291"
  },
  {
    id: "notif-c1",
    vendorId: "V001",
    orderId: "ORD-1024",
    orderNumber: "ORD-1024",
    recipientRole: "company",
    title: "Missing Item Reported",
    message: "ABC Office Supplies reported 2 chairs missing from ORD-1024.",
    type: "issue_reported",
    timestamp: "09 Oct, 11:00 AM",
    read: false
  }
];
