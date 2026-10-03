# FlowGuard AI – Smart Invoice & Payment Tracking Platform

> **"Upload → Verify → Communicate → Approve → Track → Pay → Notify"**

FlowGuard AI is a modern, responsive two-way invoice management and payment tracking platform connecting **Vendors** and **Company/Store Admins**. Modeled after e-commerce order tracking systems (like Flipkart/Amazon), it provides end-to-end transparency, AI-assisted verification, isolated 2-way invoice communication, and real-time payment completion notifications.

---

## 🎨 Visual Identity & Theme
- **Strict Color Palette**: Pure White (`#FFFFFF`), Soft Mint (`#F4FBF6` / `#F7FCF8`), Primary Brand Green (`#16A34A`), Dark Green (`#15803D`), Soft Green (`#DCFCE7`), Dark Charcoal (`#1F2937`).
- **Design Style**: Minimal, premium, professional FinTech SaaS aesthetic ("White dashboard + Green financial technology").
- **Zero Distractions**: No blue, purple, or orange clutter. Status badges and indicators strictly adhere to the white/green palette.

---

## ✨ Key Features & USPs

### 1. 🛒 Flipkart-Style Invoice Tracking Timeline
Step-by-step visual tracker for every invoice:
1. `✓ Invoice Uploaded`
2. `✓ AI Verification Completed`
3. `✓ PO & Receipt Matched`
4. `✓ Company Review`
5. `✓ Approved`
6. `● Payment Processing`
7. `✓ Payment Completed`

### 2. 💬 Two-Way Invoice Communication Thread
- Every invoice possesses its own **isolated 2-way discussion channel**.
- Real-time chat between Vendor and Store Admin.
- Enables uploading corrected invoices directly in-thread.

### 3. 🤖 FlowGuard AI Invoice Agent
- **Proactive Document Checks**: Detects missing POs or receipts.
- **Approval Escalation**: Flags stuck invoices waiting > 2 days.
- **Due Date Reminders**: Sends approaching due date alerts.
- **Diagnostic Answers**: Explains why an invoice is delayed and provides instant resolution steps.

### 4. 🔍 AI OCR & PO Verification Engine
- Extracts Invoice #, Vendor Name, Company Name, Amount, Dates, and Line Items.
- Compares invoice against Purchase Order (PO) and flags discrepancies (e.g., *Invoice ₹52,000 vs PO ₹50,000*).

### 5. 🎉 Prominent Payment Completion Notification
- Triggers instant **Celebratory Confetti & Green Banner Popup** when Company marks payment as `Paid`.
- Updates timeline, logs transaction reference ID, and notifies Vendor notification center & dashboard.

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18+) & NPM

### Installation & Launching

1. **Install Root & Server Dependencies**:
   ```bash
   cd server
   npm install
   ```

2. **Install Client Dependencies**:
   ```bash
   cd ../client
   npm install
   ```

3. **Run Backend Server** (Port 5000):
   ```bash
   cd server
   npm start
   ```

4. **Run Frontend Application** (Port 3000):
   ```bash
   cd client
   npm run dev
   ```

5. **Open Application**:
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## ⚡ 1-Click Presentation Demo Scenario

To showcase the complete flow during a project presentation:
1. Click the **`⚡ Demo Scenario`** button in the top navigation bar.
2. The platform automatically executes:
   - Vendor uploads `INV-1024` (₹52,000)
   - AI cross-verifies against PO-8842
   - Company reviews & approves
   - Moves to Payment Processing
   - Marks as Paid → **🎉 Payment Completed Modal with Confetti appears!**

---

## 📁 Project Structure

```
flowguard-ai/
├── client/                 # Vite + React + Tailwind CSS Frontend
│   ├── src/
│   │   ├── components/     # FlipkartTimeline, AIVerificationCard, TwoWayChat, AIAgentWidget, PaymentCompletedModal
│   │   ├── context/        # AppContext (Global State & Real-time Handlers)
│   │   ├── pages/          # VendorDashboard, CompanyDashboard, InvoiceDetails, UploadInvoice, TrackingPage, etc.
│   │   └── services/       # API integration layer
├── server/                 # Express + Socket.IO Backend Server
│   ├── server.js           # REST API routes & Socket broadcasts
│   ├── aiService.js        # AI verification & FlowGuard Agent engine
│   └── mockData.js         # Initial demo invoices (INV-1024, INV-1025, etc.)
└── README.md
```
