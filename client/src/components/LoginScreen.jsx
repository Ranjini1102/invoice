import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, UserCheck, Building2, Lock, Mail, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function LoginScreen() {
  const { setIsLoggedIn, setUserRole, setActiveTab, triggerGreenToast } = useApp();

  const [activeLoginTab, setActiveLoginTab] = useState('vendor'); // 'vendor' or 'company'

  // Vendor credentials state
  const [vendorEmail, setVendorEmail] = useState('vendor@abcsupplies.com');
  const [vendorPassword, setVendorPassword] = useState('••••••••••••');

  // Company credentials state
  const [companyEmail, setCompanyEmail] = useState('admin@xyzmfg.com');
  const [companyPassword, setCompanyPassword] = useState('••••••••••••');

  const handleVendorSubmit = (e) => {
    e.preventDefault();
    setUserRole('vendor');
    setIsLoggedIn(true);
    setActiveTab('dashboard');
    triggerGreenToast('Vendor Logged In', 'Welcome back, ABC Supplies (Vendor Portal)', 'Role: Vendor Admin');
  };

  const handleCompanySubmit = (e) => {
    e.preventDefault();
    setUserRole('company');
    setIsLoggedIn(true);
    setActiveTab('dashboard');
    triggerGreenToast('Company Admin Logged In', 'Welcome back, XYZ Manufacturing Store Admin', 'Role: Store Admin');
  };

  return (
    <div className="min-h-screen bg-surface-muted flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans selection:bg-brand-100 selection:text-brand-900">
      
      {/* BRAND LOGO HEADER */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="w-16 h-16 rounded-2xl bg-brand-600 text-white flex items-center justify-center mx-auto mb-4 shadow-md">
          <ShieldCheck className="w-10 h-10" />
        </div>

        <h1 className="text-3xl font-extrabold text-charcoal-900 tracking-tight">
          FlowGuard <span className="text-brand-600">AI</span>
        </h1>
        <p className="mt-2 text-xs font-bold text-brand-800 uppercase tracking-widest bg-brand-100 px-3 py-1 rounded-full border border-brand-200 inline-block">
          Two-Way Order, Delivery & Payment Platform
        </p>
        <p className="mt-2 text-xs text-charcoal-600 font-medium">
          Dedicated Role-Based Authentication Portal
        </p>
      </div>

      {/* LOGIN CONTAINER CARD */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white rounded-3xl border-2 border-brand-200 p-8 shadow-md">
          
          {/* LOGIN TYPE TOGGLE TABS (VENDOR LOGIN vs COMPANY LOGIN) */}
          <div className="flex items-center bg-surface-light p-1 rounded-2xl border border-surface-border mb-6">
            <button
              onClick={() => setActiveLoginTab('vendor')}
              className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 ${
                activeLoginTab === 'vendor'
                  ? 'bg-brand-600 text-white shadow-xs'
                  : 'text-charcoal-600 hover:text-charcoal-900'
              }`}
            >
              <UserCheck className="w-4 h-4" /> Vendor Login
            </button>
            <button
              onClick={() => setActiveLoginTab('company')}
              className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 ${
                activeLoginTab === 'company'
                  ? 'bg-brand-600 text-white shadow-xs'
                  : 'text-charcoal-600 hover:text-charcoal-900'
              }`}
            >
              <Building2 className="w-4 h-4" /> Company Login
            </button>
          </div>

          {/* FORM 1: DEDICATED VENDOR LOGIN PAGE */}
          {activeLoginTab === 'vendor' && (
            <form onSubmit={handleVendorSubmit} className="space-y-4 text-xs">
              <div className="bg-brand-50 p-3 rounded-2xl border border-brand-200 flex items-center gap-2 text-brand-900 font-bold mb-2">
                <UserCheck className="w-5 h-5 text-brand-600 shrink-0" />
                <div>
                  <p className="text-xs">Vendor Portal Login</p>
                  <p className="text-[10px] text-brand-700 font-normal">ABC Supplies • Supplier Account</p>
                </div>
              </div>

              <div>
                <label className="block font-bold text-charcoal-700 mb-1">Vendor Email / Account ID</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-charcoal-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    value={vendorEmail}
                    onChange={(e) => setVendorEmail(e.target.value)}
                    required
                    placeholder="vendor@abcsupplies.com"
                    className="w-full bg-surface-light border border-surface-border rounded-xl pl-9 pr-3 py-2 text-xs text-charcoal-900 font-bold focus:ring-2 focus:ring-brand-600"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-charcoal-700 mb-1">Vendor Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-charcoal-400 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    value={vendorPassword}
                    onChange={(e) => setVendorPassword(e.target.value)}
                    required
                    className="w-full bg-surface-light border border-surface-border rounded-xl pl-9 pr-3 py-2 text-xs text-charcoal-900 font-bold focus:ring-2 focus:ring-brand-600"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-1.5 text-[11px] text-charcoal-600 font-medium">
                  <input type="checkbox" defaultChecked className="rounded text-brand-600 focus:ring-brand-600" />
                  Remember Vendor session
                </label>
                <span className="text-[11px] text-brand-700 font-bold hover:underline cursor-pointer">Forgot password?</span>
              </div>

              <button
                type="submit"
                className="w-full bg-brand-600 hover:bg-brand-700 text-white font-extrabold py-3 rounded-2xl text-xs shadow-md transition-all flex items-center justify-center gap-2 mt-4"
              >
                Sign In to Vendor Dashboard <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleVendorSubmit}
                className="w-full bg-surface-light hover:bg-brand-50 border border-brand-200 text-brand-800 font-bold py-2 rounded-xl text-[11px] transition-colors"
              >
                ⚡ Quick Demo Login as ABC Supplies (Vendor)
              </button>
            </form>
          )}

          {/* FORM 2: DEDICATED COMPANY LOGIN PAGE */}
          {activeLoginTab === 'company' && (
            <form onSubmit={handleCompanySubmit} className="space-y-4 text-xs">
              <div className="bg-brand-50 p-3 rounded-2xl border border-brand-200 flex items-center gap-2 text-brand-900 font-bold mb-2">
                <Building2 className="w-5 h-5 text-brand-600 shrink-0" />
                <div>
                  <p className="text-xs">Company Store Admin Login</p>
                  <p className="text-[10px] text-brand-700 font-normal">XYZ Manufacturing • Procurement Account</p>
                </div>
              </div>

              <div>
                <label className="block font-bold text-charcoal-700 mb-1">Company Admin Email / Store ID</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-charcoal-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    value={companyEmail}
                    onChange={(e) => setCompanyEmail(e.target.value)}
                    required
                    placeholder="admin@xyzmfg.com"
                    className="w-full bg-surface-light border border-surface-border rounded-xl pl-9 pr-3 py-2 text-xs text-charcoal-900 font-bold focus:ring-2 focus:ring-brand-600"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-charcoal-700 mb-1">Store Admin Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-charcoal-400 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    value={companyPassword}
                    onChange={(e) => setCompanyPassword(e.target.value)}
                    required
                    className="w-full bg-surface-light border border-surface-border rounded-xl pl-9 pr-3 py-2 text-xs text-charcoal-900 font-bold focus:ring-2 focus:ring-brand-600"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-1.5 text-[11px] text-charcoal-600 font-medium">
                  <input type="checkbox" defaultChecked className="rounded text-brand-600 focus:ring-brand-600" />
                  Remember Store Admin session
                </label>
                <span className="text-[11px] text-brand-700 font-bold hover:underline cursor-pointer">Forgot password?</span>
              </div>

              <button
                type="submit"
                className="w-full bg-brand-600 hover:bg-brand-700 text-white font-extrabold py-3 rounded-2xl text-xs shadow-md transition-all flex items-center justify-center gap-2 mt-4"
              >
                Sign In to Company Dashboard <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleCompanySubmit}
                className="w-full bg-surface-light hover:bg-brand-50 border border-brand-200 text-brand-800 font-bold py-2 rounded-xl text-[11px] transition-colors"
              >
                ⚡ Quick Demo Login as XYZ Manufacturing (Company)
              </button>
            </form>
          )}

        </div>

        {/* FOOTER METRIC */}
        <div className="mt-8 text-center text-xs text-charcoal-500 font-semibold">
          FlowGuard AI • Two-Way Order, Delivery, Item Verification & Payment Platform
        </div>
      </div>

    </div>
  );
}
