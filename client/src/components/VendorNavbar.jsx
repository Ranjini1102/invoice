import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldCheck,
  Bell,
  LayoutDashboard,
  Package,
  Plus,
  GitCommit,
  CreditCard,
  User,
  LogOut,
  UserCheck,
  ExternalLink,
  Clock,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

export default function VendorNavbar() {
  const {
    activeVendor,
    currentVendorId,
    setCurrentVendorId,
    demoVendors,
    activeTab,
    setActiveTab,
    notifications,
    setNotifications,
    setSelectedOrderId,
    setAuthScreen,
    handleLogout
  } = useApp();

  const [showNotifDropdown, setShowNotifDropdown] = useState(false);

  // Vendor-isolated notifications
  const vendorNotifs = notifications.filter(
    n => n.recipientRole === 'vendor' && n.vendorId === currentVendorId
  );
  const unreadCount = vendorNotifs.filter(n => !n.read).length;

  const handleNotifClick = (notif) => {
    setNotifications(prev =>
      prev.map(n => (n.id === notif.id ? { ...n, read: true } : n))
    );
    if (notif.orderId) {
      setSelectedOrderId(notif.orderId);
      setActiveTab('order-details');
    }
    setShowNotifDropdown(false);
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'my-orders', label: 'My Orders', icon: Package },
    { id: 'tracking', label: 'Track Order', icon: GitCommit },
    { id: 'my-payments', label: 'My Payments', icon: CreditCard },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-surface-border shadow-xs font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* LOGO & VENDOR BADGE */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center text-white shadow-sm">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-charcoal-900 font-sans">
                  FlowGuard <span className="text-brand-600">AI</span>
                </span>
                <span className="bg-brand-100 text-brand-800 text-[10px] px-2 py-0.5 rounded-full font-extrabold border border-brand-200">
                  Vendor Portal
                </span>
              </div>
              <p className="text-[10px] text-charcoal-500 font-medium">Order Tracking & Payout Hub</p>
            </div>
          </div>

          {/* VENDOR-SPECIFIC NAV TABS */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-extrabold transition-all ${
                    isActive
                      ? 'bg-brand-50 text-brand-700 border border-brand-200 shadow-xs'
                      : 'text-charcoal-700 hover:bg-surface-light hover:text-brand-600'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-brand-600' : 'text-charcoal-500'}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* RIGHT CONTROLS */}
          <div className="flex items-center gap-3">
            
            {/* MULTIPLE VENDOR ACCOUNT SWITCHER DROPDOWN (REQUIREMENT 3) */}
            <div className="flex items-center gap-1.5 bg-brand-50 px-2.5 py-1 rounded-xl border border-brand-200">
              <UserCheck className="w-3.5 h-3.5 text-brand-600 shrink-0" />
              <select
                value={currentVendorId}
                onChange={(e) => setCurrentVendorId(e.target.value)}
                className="bg-transparent text-xs font-extrabold text-brand-900 focus:outline-none cursor-pointer"
              >
                {demoVendors.map((v) => (
                  <option key={v.vendorId} value={v.vendorId}>
                    {v.vendorName} ({v.vendorId})
                  </option>
                ))}
              </select>
            </div>

            {/* "+ PLACE NEW ORDER" BUTTON */}
            <button
              onClick={() => setActiveTab('create-order')}
              className="bg-brand-600 hover:bg-brand-700 text-white font-extrabold px-3 py-1.5 rounded-xl text-xs shadow-sm transition-all flex items-center gap-1 shrink-0"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>New Order</span>
            </button>

            {/* NOTIFICATIONS BELL */}
            <div className="relative">
              <button
                onClick={() => setShowNotifDropdown(!showNotifDropdown)}
                className="relative p-2 rounded-xl text-charcoal-700 hover:bg-surface-light hover:text-brand-600 transition-colors border border-transparent hover:border-surface-border"
                aria-label="Vendor Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-brand-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center border-2 border-white animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* DROPDOWN */}
              {showNotifDropdown && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-surface-border z-50 overflow-hidden animate-in fade-in duration-200">
                  <div className="px-4 py-3 bg-brand-50 border-b border-brand-200 flex items-center justify-between">
                    <h3 className="text-xs font-extrabold text-brand-900 uppercase tracking-wider">Vendor Notifications</h3>
                    <span className="text-xs text-brand-700 font-bold">{unreadCount} new</span>
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-gray-100 text-xs">
                    {vendorNotifs.length === 0 ? (
                      <div className="p-6 text-center text-charcoal-500">No notifications for {activeVendor?.vendorName}.</div>
                    ) : (
                      vendorNotifs.map((notif) => (
                        <div
                          key={notif.id}
                          onClick={() => handleNotifClick(notif)}
                          className={`p-3 hover:bg-surface-muted cursor-pointer flex items-start gap-3 ${!notif.read ? 'bg-brand-50/70' : ''}`}
                        >
                          <div className="p-2 bg-brand-600 text-white rounded-lg shrink-0">
                            {notif.type === 'payment_completed' ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                          </div>
                          <div>
                            <p className="font-bold text-charcoal-900">{notif.title}</p>
                            <p className="text-charcoal-600 text-[11px]">{notif.message}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* PROMINENT EXPLICIT LOGOUT BUTTON */}
            <button
              onClick={handleLogout || (() => setAuthScreen('login'))}
              className="bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-extrabold px-3 py-1.5 rounded-xl text-xs transition-all flex items-center gap-1.5 shadow-2xs"
              title="Logout from Vendor Account"
            >
              <LogOut className="w-3.5 h-3.5 text-red-600" />
              <span className="hidden sm:inline">Logout</span>
            </button>

          </div>
        </div>
      </div>
    </header>
  );
}
