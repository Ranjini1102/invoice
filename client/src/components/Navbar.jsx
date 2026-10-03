import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldCheck,
  Bell,
  LayoutDashboard,
  Package,
  Plus,
  GitCommit,
  MessageSquare,
  Bot,
  BarChart3,
  UserCheck,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ExternalLink,
  LogOut
} from 'lucide-react';

export default function Navbar() {
  const {
    setIsLoggedIn,
    userRole,
    setUserRole,
    activeTab,
    setActiveTab,
    notifications,
    setNotifications,
    setSelectedOrderId,
    run24StepDemoScenario
  } = useApp();

  const [showNotifDropdown, setShowNotifDropdown] = useState(false);

  const roleNotifs = notifications.filter(
    n => n.recipientRole === 'all' || n.recipientRole === userRole
  );
  const unreadCount = roleNotifs.filter(n => !n.read).length;

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
    { id: 'orders', label: 'Orders', icon: Package },
    { id: 'tracking', label: 'Tracking', icon: GitCommit },
    { id: 'chat', label: 'Messages', icon: MessageSquare },
    { id: 'ai-agent', label: 'AI Agent', icon: Bot },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-surface-border shadow-xs font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* LOGO */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center text-white shadow-sm hover:bg-brand-700 transition-colors">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-charcoal-900 font-sans">
                  FlowGuard <span className="text-brand-600">AI</span>
                </span>
                <span className="bg-brand-100 text-brand-800 text-[10px] px-2 py-0.5 rounded-full font-extrabold border border-brand-200">
                  Order & Payment Platform
                </span>
              </div>
              <p className="text-[10px] text-charcoal-500 font-medium">Two-Way Order, Delivery & Bill Verification</p>
            </div>
          </div>

          {/* MAIN NAV TABS */}
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
            
            {/* PROMINENT GREEN "+ PLACE NEW ORDER" BUTTON */}
            <button
              onClick={() => setActiveTab('create-order')}
              className="bg-brand-600 hover:bg-brand-700 text-white font-extrabold px-3.5 py-2 rounded-xl text-xs shadow-sm transition-all flex items-center gap-1.5 shrink-0"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Place New Order</span>
            </button>

            {/* 24-STEP DEMO SCENARIO BUTTON */}
            <button
              onClick={run24StepDemoScenario}
              className="hidden lg:flex items-center gap-1.5 bg-brand-100 hover:bg-brand-200 text-brand-800 border border-brand-300 px-3 py-2 rounded-xl text-xs font-extrabold transition-all"
              title="Demonstrate Company Mark Paid -> Vendor Payment Completed notification flow"
            >
              <Zap className="w-3.5 h-3.5 text-brand-600 fill-current" />
              <span>24-Step Demo</span>
            </button>

            {/* ROLE SWITCHER TOGGLE */}
            <div className="flex items-center bg-surface-muted p-1 rounded-xl border border-surface-border">
              <button
                onClick={() => setUserRole('vendor')}
                className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-extrabold transition-all ${
                  userRole === 'vendor'
                    ? 'bg-white text-brand-700 shadow-xs border border-brand-200'
                    : 'text-charcoal-500 hover:text-charcoal-800'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5 text-brand-600" />
                Vendor
              </button>
              <button
                onClick={() => setUserRole('company')}
                className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-extrabold transition-all ${
                  userRole === 'company'
                    ? 'bg-white text-brand-700 shadow-xs border border-brand-200'
                    : 'text-charcoal-500 hover:text-charcoal-800'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-brand-600" />
                Company
              </button>
            </div>

            {/* NOTIFICATIONS BELL */}
            <div className="relative">
              <button
                onClick={() => setShowNotifDropdown(!showNotifDropdown)}
                className="relative p-2 rounded-xl text-charcoal-700 hover:bg-surface-light hover:text-brand-600 transition-colors border border-transparent hover:border-surface-border"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-brand-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center border-2 border-white animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* NOTIFICATION DROPDOWN POPUP */}
              {showNotifDropdown && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-surface-border z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-4 py-3 bg-brand-50 border-b border-brand-200 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4 text-brand-600" />
                      <h3 className="text-sm font-bold text-charcoal-900">Notification Feed</h3>
                    </div>
                    {unreadCount > 0 && (
                      <span className="text-xs bg-brand-600 text-white px-2 py-0.5 rounded-full font-bold">
                        {unreadCount} unread
                      </span>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-gray-100">
                    {roleNotifs.length === 0 ? (
                      <div className="p-6 text-center text-xs text-charcoal-500">
                        No notifications yet.
                      </div>
                    ) : (
                      roleNotifs.slice(0, 6).map((notif) => (
                        <div
                          key={notif.id}
                          onClick={() => handleNotifClick(notif)}
                          className={`p-3 hover:bg-surface-muted cursor-pointer transition-colors flex items-start gap-3 ${
                            !notif.read ? 'bg-brand-50/70 border-l-4 border-l-brand-600' : ''
                          }`}
                        >
                          <div className={`p-2 rounded-lg shrink-0 ${
                            notif.type === 'payment_completed' ? 'bg-brand-600 text-white' :
                            'bg-surface-light text-brand-600 border border-surface-border'
                          }`}>
                            {notif.type === 'payment_completed' ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="text-xs font-bold text-charcoal-900 truncate">{notif.title}</p>
                              <span className="text-[10px] text-charcoal-500">{notif.timestamp}</span>
                            </div>
                            <p className="text-xs text-charcoal-700 mt-0.5 line-clamp-2">{notif.message}</p>
                            <span className="text-[10px] text-brand-700 font-bold inline-flex items-center gap-1 mt-1">
                              View Order {notif.orderNumber} <ExternalLink className="w-2.5 h-2.5" />
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="p-2 text-center bg-gray-50 border-t border-gray-100">
                    <button
                      onClick={() => {
                        setActiveTab('notifications');
                        setShowNotifDropdown(false);
                      }}
                      className="text-xs text-brand-700 font-bold hover:underline"
                    >
                      View All Notifications
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* LOGOUT BUTTON */}
            <button
              onClick={() => setIsLoggedIn(false)}
              className="p-2 rounded-xl text-gray-400 hover:text-red-600 hover:bg-gray-100 transition-colors"
              title="Logout to Role Selection Screen"
            >
              <LogOut className="w-4 h-4" />
            </button>

          </div>
        </div>
      </div>
    </header>
  );
}
