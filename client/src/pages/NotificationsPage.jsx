import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Bell, CheckCircle2, AlertTriangle, Clock, ExternalLink, CheckCheck } from 'lucide-react';

export default function NotificationsPage() {
  const { notifications, setNotifications, setSelectedInvoiceId, setActiveTab, userRole } = useApp();
  const [filter, setFilter] = useState('ALL');

  const roleNotifs = notifications.filter(
    n => n.recipientRole === 'all' || n.recipientRole === userRole
  );

  const filteredNotifs = roleNotifs.filter(n => {
    if (filter === 'UNREAD') return !n.read;
    if (filter === 'PAYMENT') return n.type === 'payment_completed';
    if (filter === 'CORRECTION') return n.type === 'correction_required';
    return true;
  });

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleNotifClick = (notif) => {
    setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, read: true } : n));
    if (notif.invoiceId) {
      setSelectedInvoiceId(notif.invoiceId);
      setActiveTab('invoice-details');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* HEADER */}
      <div className="bg-white rounded-3xl border border-surface-border p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-brand-100 text-brand-800 text-xs font-bold px-3 py-1 rounded-full border border-brand-200 uppercase">
              Real-Time Alert Feed
            </span>
            <span className="text-xs text-charcoal-500 font-medium">Notification Center</span>
          </div>
          <h1 className="text-2xl font-extrabold text-charcoal-900 mt-2">
            Activity & Payment Notifications
          </h1>
          <p className="text-xs text-charcoal-600 mt-1">
            Real-time updates for invoice approvals, correction requests, AI escalations, and payment completions.
          </p>
        </div>

        <button
          onClick={handleMarkAllRead}
          className="bg-surface-light hover:bg-brand-50 border border-surface-border text-brand-700 px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2"
        >
          <CheckCheck className="w-4 h-4 text-brand-600" /> Mark All as Read
        </button>
      </div>

      {/* FILTER TABS */}
      <div className="flex items-center gap-2 text-xs">
        {[
          { id: 'ALL', label: 'All Notifications' },
          { id: 'UNREAD', label: 'Unread Only' },
          { id: 'PAYMENT', label: '🎉 Payment Completed' },
          { id: 'CORRECTION', label: 'Correction Requests' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`px-3.5 py-2 rounded-xl font-bold transition-all ${
              filter === tab.id
                ? 'bg-brand-600 text-white shadow-xs'
                : 'bg-white text-charcoal-700 border border-surface-border hover:bg-surface-light'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* NOTIFICATIONS LIST */}
      <div className="bg-white rounded-3xl border border-surface-border p-6 shadow-xs divide-y divide-gray-100">
        {filteredNotifs.length === 0 ? (
          <div className="py-12 text-center text-xs text-charcoal-500">
            No notifications matching this filter.
          </div>
        ) : (
          filteredNotifs.map((notif) => (
            <div
              key={notif.id}
              onClick={() => handleNotifClick(notif)}
              className={`p-4 hover:bg-surface-muted cursor-pointer transition-colors flex items-start gap-4 ${
                !notif.read ? 'bg-brand-50/60' : ''
              }`}
            >
              <div className={`p-3 rounded-2xl shrink-0 ${
                notif.type === 'payment_completed' ? 'bg-brand-600 text-white' :
                notif.type === 'correction_required' ? 'bg-brand-100 text-brand-800' :
                'bg-surface-light text-brand-600 border border-surface-border'
              }`}>
                {notif.type === 'payment_completed' ? <CheckCircle2 className="w-6 h-6" /> :
                 notif.type === 'correction_required' ? <AlertTriangle className="w-6 h-6" /> :
                 <Bell className="w-6 h-6" />}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm font-extrabold text-charcoal-900">{notif.title}</h3>
                  <span className="text-[11px] text-charcoal-400 font-mono">{notif.timestamp}</span>
                </div>

                <p className="text-xs text-charcoal-700 mt-1 leading-relaxed">{notif.message}</p>

                {notif.paymentHighlight && (
                  <div className="mt-2 p-3 bg-brand-100/70 border border-brand-300 rounded-xl text-xs font-bold text-brand-900 inline-flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-brand-600" />
                    <span>Payment Completed: ₹{(notif.amount || 52000).toLocaleString('en-IN')} paid for Invoice {notif.invoiceNumber}</span>
                  </div>
                )}

                <div className="mt-2">
                  <span className="text-xs font-bold text-brand-700 inline-flex items-center gap-1 hover:underline">
                    Inspect Invoice {notif.invoiceNumber} <ExternalLink className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}
