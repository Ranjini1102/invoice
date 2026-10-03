import React from 'react';
import { AppProvider, useApp } from './context/AppContext';

import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import VendorNavbar from './components/VendorNavbar';
import CompanyNavbar from './components/CompanyNavbar';
import PaymentCompletedModal from './components/PaymentCompletedModal';
import Toast from './components/Toast';

// Vendor Pages
import VendorDashboard from './pages/VendorDashboard';
import VendorOrdersPage from './pages/VendorOrdersPage';
import TrackingPage from './pages/TrackingPage';
import VendorPaymentsPage from './pages/VendorPaymentsPage';
import VendorProfilePage from './pages/VendorProfilePage';
import CreateOrderPage from './pages/CreateOrderPage';

// Company Pages
import CompanyDashboard from './pages/CompanyDashboard';
import CompanyPaymentsPage from './pages/CompanyPaymentsPage';
import CompanyVendorsPage from './pages/CompanyVendorsPage';
import CompanyOrdersPage from './pages/CompanyOrdersPage';

// Shared Pages
import OrderDetails from './pages/OrderDetails';
import ChatPage from './pages/ChatPage';
import AIAgentPage from './pages/AIAgentPage';
import NotificationsPage from './pages/NotificationsPage';
import ReportsPage from './pages/ReportsPage';

function MainContent() {
  const { authScreen, userRole, activeTab, toast, setToast } = useApp();

  // SCREEN 1: LANDING PAGE (REQUIREMENT 1)
  if (authScreen === 'landing') {
    return <LandingPage />;
  }

  // SCREEN 2: LOGIN PAGE (REQUIREMENT 2)
  if (authScreen === 'login') {
    return <LoginPage />;
  }

  // SCREEN 3: LOGGED-IN APPLICATION EXPERIENCE
  const renderVendorTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return <VendorDashboard />;
      case 'my-orders':
        return <VendorOrdersPage />;
      case 'create-order':
        return <CreateOrderPage />;
      case 'tracking':
        return <TrackingPage />;
      case 'my-payments':
        return <VendorPaymentsPage />;
      case 'profile':
        return <VendorProfilePage />;
      case 'chat':
        return <ChatPage />;
      case 'ai-agent':
        return <AIAgentPage />;
      case 'notifications':
        return <NotificationsPage />;
      case 'order-details':
        return <OrderDetails />;
      default:
        return <VendorDashboard />;
    }
  };

  const renderCompanyTab = () => {
    switch (activeTab) {
      case 'company-payments':
        return <CompanyPaymentsPage />;
      case 'company-vendors':
        return <CompanyVendorsPage />;
      case 'company-orders':
        return <CompanyOrdersPage />;
      case 'dashboard':
        return <CompanyDashboard />;
      case 'company-ai':
        return <AIAgentPage />;
      case 'chat':
        return <ChatPage />;
      case 'notifications':
        return <NotificationsPage />;
      case 'reports':
        return <ReportsPage />;
      case 'order-details':
        return <OrderDetails />;
      default:
        return <CompanyPaymentsPage />;
    }
  };

  return (
    <div className="min-h-screen bg-surface-muted text-charcoal-800 font-sans flex flex-col selection:bg-brand-100 selection:text-brand-900">
      
      {/* SEPARATE NAVBAR BASED ON USER ROLE (REQUIREMENT 23) */}
      {userRole === 'vendor' ? <VendorNavbar /> : <CompanyNavbar />}

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {userRole === 'vendor' ? renderVendorTab() : renderCompanyTab()}
      </main>

      {/* FOOTER */}
      <footer className="bg-white border-t border-surface-border py-6 mt-12 text-center text-xs text-charcoal-500 font-medium">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-bold text-charcoal-900">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-600 inline-block" />
            FlowGuard AI – Two-Way Order, Delivery & Payment Tracking Platform
          </div>

          <div className="flex items-center gap-4 text-charcoal-600 font-semibold">
            <span>White + Green Theme</span>
            <span>•</span>
            <span>Multiple Vendors Isolated</span>
            <span>•</span>
            <span>FlowGuard AI Verification Agent</span>
          </div>
        </div>
      </footer>

      {/* OVERLAY MODALS & TOASTS */}
      <PaymentCompletedModal />
      <Toast toast={toast} onClose={() => setToast({ show: false, title: '', message: '', details: '', time: '' })} />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
