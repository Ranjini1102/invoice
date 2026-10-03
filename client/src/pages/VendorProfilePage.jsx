import React from 'react';
import { useApp } from '../context/AppContext';
import { UserCheck, ShieldCheck, Mail, Phone, MapPin, FileCheck, Package, CheckCircle2, LogOut } from 'lucide-react';

export default function VendorProfilePage() {
  const { activeVendor, orders, handleLogout } = useApp();

  const v = activeVendor || {
    vendorId: "V001",
    vendorName: "ABC Office Supplies",
    email: "vendor.abc@flowguard.ai",
    phone: "+91 98765 43210",
    address: "124 Industrial Estate, Hubli, Karnataka",
    gstNumber: "29AAACA1234A1Z5"
  };

  const vOrders = orders.filter(o => o.vendorId === v.vendorId);
  const totalOrdersCount = vOrders.length;
  const completedOrdersCount = vOrders.filter(o => o.status === 'Paid').length;
  const pendingPaymentsAmount = vOrders.filter(o => o.status !== 'Paid').reduce((sum, o) => sum + o.amount, 0);

  return (
    <div className="max-w-4xl mx-auto space-y-6 font-sans">
      
      {/* HEADER CARD */}
      <div className="bg-white rounded-3xl border border-surface-border p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-brand-100 border border-brand-200 text-brand-700 flex items-center justify-center font-extrabold text-xl shadow-xs">
            {v.vendorId}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold text-charcoal-900">{v.vendorName}</h1>
              <span className="bg-brand-600 text-white text-[10px] px-2.5 py-0.5 rounded-full font-extrabold uppercase">
                Verified Supplier
              </span>
            </div>
            <p className="text-xs text-charcoal-500 font-medium mt-0.5">Vendor Account ID: <span className="font-mono font-bold text-brand-700">{v.vendorId}</span></p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 font-extrabold px-4 py-2.5 rounded-xl text-xs transition-all flex items-center gap-2 shadow-2xs"
        >
          <LogOut className="w-4 h-4 text-red-600" /> Logout from Vendor Account
        </button>
      </div>

      {/* METRICS GRID (REQUIREMENT 11) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-surface-border shadow-xs">
          <span className="text-xs text-charcoal-500 font-bold block">Total Submitted Orders</span>
          <span className="text-3xl font-extrabold text-charcoal-900 mt-1 block">{totalOrdersCount}</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-surface-border shadow-xs">
          <span className="text-xs text-charcoal-500 font-bold block">Completed Orders</span>
          <span className="text-3xl font-extrabold text-brand-700 mt-1 block">{completedOrdersCount}</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-brand-200 shadow-xs">
          <span className="text-xs text-charcoal-500 font-bold block">Pending Payments Receivable</span>
          <span className="text-2xl font-extrabold text-brand-700 font-mono mt-1 block">
            ₹{pendingPaymentsAmount.toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      {/* PROFILE DETAILS CARD (REQUIREMENT 11) */}
      <div className="bg-white rounded-3xl border border-surface-border p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-extrabold text-charcoal-900 pb-2 border-b border-surface-border">
          Business Registration & Contact Details
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="flex items-start gap-3 p-3.5 bg-surface-light rounded-2xl border border-surface-border">
            <Mail className="w-4 h-4 text-brand-600 mt-0.5" />
            <div>
              <span className="text-charcoal-500 font-semibold block">Official Email</span>
              <span className="font-extrabold text-charcoal-900">{v.email}</span>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 bg-surface-light rounded-2xl border border-surface-border">
            <Phone className="w-4 h-4 text-brand-600 mt-0.5" />
            <div>
              <span className="text-charcoal-500 font-semibold block">Phone Number</span>
              <span className="font-extrabold text-charcoal-900">{v.phone}</span>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 bg-surface-light rounded-2xl border border-surface-border">
            <MapPin className="w-4 h-4 text-brand-600 mt-0.5" />
            <div>
              <span className="text-charcoal-500 font-semibold block">Business Registered Address</span>
              <span className="font-extrabold text-charcoal-900">{v.address}</span>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 bg-surface-light rounded-2xl border border-surface-border">
            <FileCheck className="w-4 h-4 text-brand-600 mt-0.5" />
            <div>
              <span className="text-charcoal-500 font-semibold block">GSTIN Registration Number</span>
              <span className="font-extrabold text-brand-700 font-mono">{v.gstNumber}</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
