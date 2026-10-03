import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, UserCheck, Building2, Lock, Mail, ArrowRight, ArrowLeft } from 'lucide-react';

export default function LoginPage() {
  const { setAuthScreen, setUserRole, setCurrentVendorId, setIsLoggedIn, setActiveTab, loginRole, setLoginRole, demoVendors, triggerGreenToast } = useApp();

  const [activeTab, setActiveTabLocal] = useState(loginRole || 'vendor');

  // Vendor selection state (Defaults to V001: ABC Office Supplies)
  const [selectedVendorId, setSelectedVendorId] = useState('V001');
  const [vendorEmail, setVendorEmail] = useState('vendor.abc@flowguard.ai');
  const [vendorPassword, setVendorPassword] = useState('••••••••••••');

  // Company credentials
  const [companyEmail, setCompanyEmail] = useState('admin@xyzcompany.com');
  const [companyPassword, setCompanyPassword] = useState('••••••••••••');

  const handleVendorSelect = (vId) => {
    setSelectedVendorId(vId);
    const v = demoVendors.find(item => item.vendorId === vId);
    if (v) setVendorEmail(v.email);
  };

  const handleVendorSubmit = (e) => {
    e.preventDefault();
    setUserRole('vendor');
    setCurrentVendorId(selectedVendorId);
    setIsLoggedIn(true);
    setAuthScreen('app');
    setActiveTab('dashboard');
    const v = demoVendors.find(item => item.vendorId === selectedVendorId);
    triggerGreenToast('Vendor Logged In', `Logged in as ${v?.vendorName || 'ABC Office Supplies'} (${selectedVendorId})`, 'Data Isolated Mode Active');
  };

  const handleCompanySubmit = (e) => {
    e.preventDefault();
    setUserRole('company');
    setIsLoggedIn(true);
    setAuthScreen('app');
    setActiveTab('dashboard');
    triggerGreenToast('Company Admin Logged In', 'Logged in as XYZ Company (Store Procurement Admin)', 'Global Overview Mode Active');
  };

  return (
    <div className="min-h-screen bg-surface-muted flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans selection:bg-brand-100 selection:text-brand-900">
      
      {/* BACK TO LANDING PAGE */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md mb-4 text-left">
        <button
          onClick={() => setAuthScreen('landing')}
          className="inline-flex items-center gap-2 text-xs font-bold text-charcoal-600 hover:text-brand-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to FlowGuard Landing Page
        </button>
      </div>

      {/* HEADER LOGO */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="w-14 h-14 rounded-2xl bg-brand-600 text-white flex items-center justify-center mx-auto mb-3 shadow-md">
          <ShieldCheck className="w-9 h-9" />
        </div>

        <h1 className="text-3xl font-extrabold text-charcoal-900 tracking-tight">
          FlowGuard <span className="text-brand-600">AI</span>
        </h1>
        <p className="mt-2 text-xs font-bold text-brand-800 uppercase tracking-widest bg-brand-100 px-3 py-1 rounded-full border border-brand-200 inline-block">
          Role-Based Portal Authentication
        </p>
      </div>

      {/* LOGIN CARD */}
      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white rounded-3xl border-2 border-brand-200 p-8 shadow-md">
          
          {/* LOGIN ROLE TABS */}
          <div className="flex items-center bg-surface-light p-1 rounded-2xl border border-surface-border mb-6">
            <button
              onClick={() => setActiveTabLocal('vendor')}
              className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'vendor'
                  ? 'bg-brand-600 text-white shadow-xs'
                  : 'text-charcoal-600 hover:text-charcoal-900'
              }`}
            >
              <UserCheck className="w-4 h-4" /> Vendor Login
            </button>
            <button
              onClick={() => setActiveTabLocal('company')}
              className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'company'
                  ? 'bg-brand-600 text-white shadow-xs'
                  : 'text-charcoal-600 hover:text-charcoal-900'
              }`}
            >
              <Building2 className="w-4 h-4" /> Company Login
            </button>
          </div>

          {/* VENDOR LOGIN FORM */}
          {activeTab === 'vendor' && (
            <form onSubmit={handleVendorSubmit} className="space-y-4 text-xs">
              
              {/* MULTIPLE VENDOR SELECTOR (REQUIREMENT 3) */}
              <div>
                <label className="block font-extrabold text-brand-800 mb-1">Select Vendor Account (Data Isolation Demo) *</label>
                <select
                  value={selectedVendorId}
                  onChange={(e) => handleVendorSelect(e.target.value)}
                  className="w-full bg-brand-50 border border-brand-300 rounded-xl px-3 py-2 text-xs font-bold text-brand-900 focus:ring-2 focus:ring-brand-600"
                >
                  {demoVendors.map((v) => (
                    <option key={v.vendorId} value={v.vendorId}>
                      {v.vendorName} ({v.vendorId})
                    </option>
                  ))}
                </select>
                <p className="text-[10px] text-charcoal-500 mt-1 font-medium">
                  🔒 Note: Vendor A (`V001`) never sees Vendor B (`V002`) orders or payments.
                </p>
              </div>

              <div>
                <label className="block font-bold text-charcoal-700 mb-1">Vendor Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-charcoal-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    value={vendorEmail}
                    onChange={(e) => setVendorEmail(e.target.value)}
                    required
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
                  Remember me
                </label>
                <span className="text-[11px] text-brand-700 font-bold hover:underline cursor-pointer">Forgot Password?</span>
              </div>

              <button
                type="submit"
                className="w-full bg-brand-600 hover:bg-brand-700 text-white font-extrabold py-3.5 rounded-2xl text-xs shadow-md transition-all flex items-center justify-center gap-2 mt-4"
              >
                Login as Vendor <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* COMPANY LOGIN FORM */}
          {activeTab === 'company' && (
            <form onSubmit={handleCompanySubmit} className="space-y-4 text-xs">
              <div className="bg-brand-50 p-3 rounded-2xl border border-brand-200 text-brand-900 font-bold mb-1">
                <p className="text-xs">XYZ Company Procurement Account</p>
                <p className="text-[10px] text-brand-700 font-normal">Global access across all vendor payments & orders</p>
              </div>

              <div>
                <label className="block font-bold text-charcoal-700 mb-1">Company Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-charcoal-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    value={companyEmail}
                    onChange={(e) => setCompanyEmail(e.target.value)}
                    required
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
                  Remember me
                </label>
                <span className="text-[11px] text-brand-700 font-bold hover:underline cursor-pointer">Forgot Password?</span>
              </div>

              <button
                type="submit"
                className="w-full bg-brand-600 hover:bg-brand-700 text-white font-extrabold py-3.5 rounded-2xl text-xs shadow-md transition-all flex items-center justify-center gap-2 mt-4"
              >
                Login as Company <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

        </div>
      </div>

    </div>
  );
}
