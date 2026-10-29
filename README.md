# 🌿 FlowGuard AI – Smart Invoice & Payment Tracking Platform

> **Upload → Verify → Communicate → Approve → Track → Pay → Notify**

🔗 **Live Demo:** https://invoice-iota-peach.vercel.app/

## 📌 About the Project

FlowGuard AI is a modern, responsive, AI-assisted invoice management and payment tracking platform connecting Vendors and Company/Store Administrators. Inspired by e-commerce tracking systems like Amazon and Flipkart, it provides end-to-end invoice visibility, document verification, two-way communication, approval workflows, and payment notifications.

## ✨ Key Features

### 🛒 1. Flipkart-Style Invoice Tracking
- Track invoices from upload to payment completion.
- Visual timeline with real-time status updates.
- Monitor verification, PO matching, company review, approval, and payment.

### 💬 2. Two-Way Invoice Communication
- Dedicated chat thread for every invoice.
- Communication between vendors and administrators.
- Upload corrected invoices directly within conversations.

### 🤖 3. FlowGuard AI Invoice Agent
- Detect missing purchase orders and receipts.
- Flag invoices pending approval for more than two days.
- Send approaching due-date reminders.
- Explain invoice delays and suggest resolution steps.

### 🔍 4. AI OCR & PO Verification
- Extract invoice numbers, vendor details, dates, amounts, and line items.
- Compare invoice information against purchase orders.
- Detect discrepancies and missing documents.
- Example: Flag an invoice of ₹52,000 against a PO of ₹50,000.

### 🎉 5. Payment Completion Notifications
- Update invoice status when payment is marked as completed.
- Display a green success banner with a confetti animation.
- Record transaction reference IDs.
- Notify vendors through their dashboard.

### ⚡ 6. One-Click Demo Scenario
Demonstrate the complete invoice lifecycle:

1. Upload invoice `INV-1024` for ₹52,000.
2. Verify it against purchase order `PO-8842`.
3. Review and approve the invoice.
4. Move it to payment processing.
5. Mark the invoice as paid.
6. Display the payment completion modal with confetti.

## 🎨 UI/UX Design & Visual Identity

FlowGuard AI features a premium FinTech SaaS interface with a modern white-and-green theme, elegant 3D-style cards, smooth animations, and responsive layouts.

### Color Palette

| Color | Hex Code |
|---|---|
| Pure White | `#FFFFFF` |
| Soft Mint | `#F4FBF6` |
| Primary Green | `#16A34A` |
| Dark Green | `#15803D` |
| Soft Green | `#DCFCE7` |
| Dark Charcoal | `#1F2937` |

### Design Highlights
- Premium white dashboard with soft mint backgrounds.
- 3D-style cards with layered shadows and hover effects.
- Glassmorphism-inspired panels.
- Smooth transitions and interactive buttons.
- Animated invoice tracking timelines.
- Green success notifications and payment animations.
- Responsive design for desktop, tablet, and mobile.
- Consistent green status indicators without unnecessary blue, purple, or orange accents.

## 👥 User Roles

### Vendor Dashboard
- Upload invoices and supporting documents.
- View AI verification results.
- Track invoice approvals and payments.
- Communicate with company administrators.
- Upload corrected invoices.
- Receive payment notifications.

### Company / Store Admin Dashboard
- View and manage submitted invoices.
- Verify invoices against purchase orders.
- Review discrepancies and missing documents.
- Approve or reject invoices.
- Update payment statuses.
- Monitor pending approvals and overdue invoices.

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| Frontend | React.js, Vite |
| Styling | CSS, Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas, when configured |
| Real-Time Communication | Socket.IO |
| AI Verification | OCR and invoice validation services |
| Deployment | Vercel |

## 📂 Project Structure

```text
flowguard-ai/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── FlipkartTimeline.jsx
│   │   │   ├── AIVerificationCard.jsx
│   │   │   ├── TwoWayChat.jsx
│   │   │   ├── AIAgentWidget.jsx
│   │   │   └── PaymentCompletedModal.jsx
│   │   ├── context/
│   │   │   └── AppContext.jsx
│   │   ├── pages/
│   │   │   ├── VendorDashboard.jsx
│   │   │   ├── CompanyDashboard.jsx
│   │   │   ├── InvoiceDetails.jsx
│   │   │   ├── UploadInvoice.jsx
│   │   │   └── TrackingPage.jsx
│   │   ├── services/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
├── server/
│   ├── server.js
│   ├── aiService.js
│   ├── mockData.js
│   └── package.json
└── README.md
```

*Note: This structure represents the intended architecture. Actual filenames may differ.*

## 🚀 Installation & Setup

### Prerequisites
- Node.js v18 or later
- npm
- MongoDB Atlas account, if using database integration

### 1. Clone the Repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd flowguard-ai
```

### 2. Install Backend Dependencies

```bash
cd server
npm install
```

### 3. Install Frontend Dependencies

Open a separate terminal:

```bash
cd client
npm install
```

### 4. Configure Environment Variables

Create a `.env` file inside the `server` directory:

```env
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
```

Add any additional environment variables required by your implementation. Never expose API keys or database credentials in your repository.

### 5. Start the Backend

```bash
cd server
npm start
```

### 6. Start the Frontend

Open another terminal:

```bash
cd client
npm run dev
```

Open the local URL displayed in your terminal. Vite typically uses `http://localhost:5173` unless configured otherwise.

## 🔐 Security & Reliability
- Role-based access for vendors and administrators.
- Server-side invoice validation.
- Secure document upload handling.
- Environment-based configuration for credentials.
- Audit trails for approval and payment updates.
- Separation of demonstration data from real financial transactions.

## 🎯 Project Objectives

- Automate invoice verification and tracking.
- Reduce manual processing and administrative workload.
- Improve communication between vendors and companies.
- Identify invoice discrepancies at an early stage.
- Provide transparent payment status updates.
- Reduce delays caused by missing documents and pending approvals.

## 🌐 Live Demo

**Explore FlowGuard AI:** https://invoice-iota-peach.vercel.app/

---

**FlowGuard AI — Smarter Invoices. Transparent Payments. Seamless Business Operations.**
