import React from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, UserCheck, Building2, ArrowRight, Package, Truck, FileCheck, CreditCard, Sparkles } from 'lucide-react';

export default function LandingPage() {
  const { setAuthScreen, setLoginRole } = useApp();

  const handleOpenVendorLogin = () => {
    setLoginRole('vendor');
    setAuthScreen('login');
  };

  const handleOpenCompanyLogin = () => {
    setLoginRole('company');
    setAuthScreen('login');
  };

  return (
    <div className="min-h-screen bg-white text-charcoal-900 font-sans selection:bg-brand-100 selection:text-brand-900">
      
      {/* LANDING HEADER NAV */}
      <header className="border-b border-surface-border bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-brand-600 text-white flex items-center justify-center shadow-md">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <span className="font-extrabold text-2xl tracking-tight text-charcoal-900">
                FlowGuard <span className="text-brand-600">AI</span>
              </span>
              <p className="text-[10px] text-charcoal-500 font-bold uppercase tracking-wider">Enterprise Procurement & Payout Platform</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleOpenVendorLogin}
              className="bg-surface-light hover:bg-brand-50 border border-brand-200 text-brand-800 font-extrabold px-4 py-2.5 rounded-xl text-xs transition-all flex items-center gap-2"
            >
              <UserCheck className="w-4 h-4 text-brand-600" /> Vendor Login
            </button>

            <button
              onClick={handleOpenCompanyLogin}
              className="bg-brand-600 hover:bg-brand-700 text-white font-extrabold px-5 py-2.5 rounded-xl text-xs shadow-md transition-all flex items-center gap-2"
            >
              <Building2 className="w-4 h-4" /> Company Login
            </button>
          </div>

        </div>
      </header>

      {/* HERO SECTION */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <span className="bg-brand-100 text-brand-800 text-xs font-extrabold px-4 py-1.5 rounded-full border border-brand-300 uppercase tracking-widest inline-block mb-4">
          B2B Procurement & Payment Intelligence
        </span>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-charcoal-900 tracking-tight max-w-4xl mx-auto leading-tight">
          "From Order to Payment — <span className="text-brand-600 underline decoration-brand-300">Everything Tracked.</span>"
        </h1>

        <p className="mt-6 text-base sm:text-lg text-charcoal-600 max-w-2xl mx-auto font-medium leading-relaxed">
          FlowGuard AI connects Vendors and Enterprises in one transparent two-way platform with Flipkart-style order tracking, physical delivery item counts, 3-way bill & GST verification, and instant payment clearance alerts.
        </p>

        {/* TWO CLEAR CTA BUTTONS */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={handleOpenVendorLogin}
            className="bg-brand-600 hover:bg-brand-700 text-white font-extrabold px-8 py-4 rounded-2xl text-sm shadow-xl transition-all flex items-center gap-3 group"
          >
            <UserCheck className="w-5 h-5" />
            <span>Access Vendor Portal</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={handleOpenCompanyLogin}
            className="bg-white hover:bg-surface-light border-2 border-brand-600 text-brand-700 font-extrabold px-8 py-4 rounded-2xl text-sm shadow-md transition-all flex items-center gap-3"
          >
            <Building2 className="w-5 h-5 text-brand-600" />
            <span>Access Company Admin Portal</span>
          </button>
        </div>
      </section>

      {/* SIMPLE PROCESS EXPLANATION DIAGRAM (REQUIREMENT 1) */}
      <section className="py-16 bg-surface-light border-y border-surface-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-xs font-extrabold text-brand-700 uppercase tracking-widest">End-to-End Workflow</h2>
            <p className="text-2xl font-extrabold text-charcoal-900 mt-1">How FlowGuard AI Simplifies B2B Commerce</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 relative">
            
            <div className="bg-white p-6 rounded-3xl border border-surface-border shadow-xs text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-brand-100 text-brand-700 flex items-center justify-center mx-auto font-bold">
                <UserCheck className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-sm text-charcoal-900">1. Vendor</h3>
              <p className="text-xs text-charcoal-500 font-medium">Logs in & submits structured order request with items & PO</p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-surface-border shadow-xs text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-brand-100 text-brand-700 flex items-center justify-center mx-auto font-bold">
                <Package className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-sm text-charcoal-900">2. Order</h3>
              <p className="text-xs text-charcoal-500 font-medium">Company confirms & packs order at central warehouse</p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-surface-border shadow-xs text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-brand-100 text-brand-700 flex items-center justify-center mx-auto font-bold">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-sm text-charcoal-900">3. Delivery</h3>
              <p className="text-xs text-charcoal-500 font-medium">Flipkart-style 10-stage live shipment tracking</p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-surface-border shadow-xs text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-brand-100 text-brand-700 flex items-center justify-center mx-auto font-bold">
                <FileCheck className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-sm text-charcoal-900">4. Verification</h3>
              <p className="text-xs text-charcoal-500 font-medium">FlowGuard AI cross-checks Vendor Bill vs GST Invoice</p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-brand-300 shadow-xs text-center space-y-2 bg-brand-50/50">
              <div className="w-12 h-12 rounded-2xl bg-brand-600 text-white flex items-center justify-center mx-auto font-bold shadow-xs">
                <CreditCard className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-sm text-brand-900">5. Payment</h3>
              <p className="text-xs text-brand-800 font-bold">Instant 🎉 Payment Completed notification & receipt</p>
            </div>

          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-8 bg-white border-t border-surface-border text-center text-xs text-charcoal-500 font-semibold">
        FlowGuard AI • Two-Way Order, Delivery, Item Verification & Payment Platform
      </footer>

    </div>
  );
}
