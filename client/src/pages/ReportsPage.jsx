import React from 'react';
import { useApp } from '../context/AppContext';
import ChartsSection from '../components/ChartsSection';
import { BarChart3, Download, ShieldCheck, TrendingUp } from 'lucide-react';

export default function ReportsPage() {
  const { orders } = useApp();

  const ordersList = orders || [];
  const totalVolume = ordersList.reduce((sum, i) => sum + i.amount, 0);
  const paidVolume = ordersList.filter(i => i.status === 'Paid').reduce((sum, i) => sum + i.amount, 0);
  const pendingVolume = ordersList.filter(i => i.status !== 'Paid').reduce((sum, i) => sum + i.amount, 0);

  return (
    <div className="space-y-6 font-sans">
      
      {/* HEADER */}
      <div className="bg-white rounded-3xl border border-surface-border p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-brand-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
              Financial Analytics
            </span>
            <span className="text-xs text-charcoal-500 font-medium">Enterprise Treasury Reports</span>
          </div>
          <h1 className="text-2xl font-extrabold text-charcoal-900 mt-2">
            Order Payout & Turnaround Analytics
          </h1>
          <p className="text-xs text-charcoal-600 mt-1">
            Audit payment timelines, bottleneck distributions, and cashflow volume across vendors.
          </p>
        </div>

        <button className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-2">
          <Download className="w-4 h-4" /> Export CSV Report
        </button>
      </div>

      {/* METRICS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-surface-border shadow-xs">
          <span className="text-xs text-charcoal-500 font-medium">Total Pipeline Value</span>
          <p className="text-2xl font-extrabold text-charcoal-900 font-mono mt-1">₹{totalVolume.toLocaleString('en-IN')}</p>
          <span className="text-[10px] text-brand-700 font-semibold bg-brand-50 px-2 py-0.5 rounded mt-2 inline-block">100% Tracked</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-brand-200 shadow-xs">
          <span className="text-xs text-charcoal-500 font-medium">Paid Volume Settled</span>
          <p className="text-2xl font-extrabold text-brand-700 font-mono mt-1">₹{paidVolume.toLocaleString('en-IN')}</p>
          <span className="text-[10px] text-white font-semibold bg-brand-600 px-2 py-0.5 rounded mt-2 inline-block">🎉 Settled</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-surface-border shadow-xs">
          <span className="text-xs text-charcoal-500 font-medium">Pending Payout Pipeline</span>
          <p className="text-2xl font-extrabold text-charcoal-800 font-mono mt-1">₹{pendingVolume.toLocaleString('en-IN')}</p>
          <span className="text-[10px] text-charcoal-600 font-semibold bg-gray-100 px-2 py-0.5 rounded mt-2 inline-block">In Process</span>
        </div>
      </div>

      {/* CHARTS */}
      <ChartsSection orders={ordersList} invoices={ordersList} />

    </div>
  );
}
