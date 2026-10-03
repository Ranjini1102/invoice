import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Bot, CheckCircle2, AlertTriangle, Clock, Send, Sparkles, ArrowRight, Bell } from 'lucide-react';
import { processAIChatQuery } from '../../../server/aiService';

export default function AIAgentWidget({ order, invoice }) {
  const currentOrder = order || invoice;
  const { handleSendMessage, setSelectedOrderId, setActiveTab } = useApp();
  const [aiQuery, setAiQuery] = useState('');
  const [aiAnswer, setAiAnswer] = useState(null);
  const [reminderSent, setReminderSent] = useState(false);

  if (!currentOrder) return null;

  const handleAskAgent = (e) => {
    e.preventDefault();
    if (!aiQuery.trim()) return;
    const ans = processAIChatQuery(aiQuery, currentOrder);
    setAiAnswer(ans);
    handleSendMessage(currentOrder.id, `@ai ${aiQuery}`, 'ai');
    setAiQuery('');
  };

  const handleSendReminder = () => {
    handleSendMessage(
      currentOrder.id,
      `🤖 FlowGuard AI Agent: Priority Reminder sent to ${currentOrder.companyName || 'Company'} Admin regarding ${currentOrder.orderNumber || currentOrder.id}.`,
      'ai'
    );
    setReminderSent(true);
    setTimeout(() => setReminderSent(false), 4000);
  };

  const isPaid = currentOrder.status === 'Paid';
  const orderNum = currentOrder.orderNumber || currentOrder.id;
  const invNum = currentOrder.vendorBill?.invoiceNumber || `INV-${orderNum.replace('ORD-', '')}`;

  return (
    <div className="bg-white rounded-3xl border border-brand-200 p-6 shadow-xs relative overflow-hidden space-y-4 font-sans">
      
      {/* BRAND GREEN ACCENT TOP BAR */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-brand-600" />

      {/* HEADER */}
      <div className="flex items-center justify-between pb-3 border-b border-surface-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-100 border border-brand-200 text-brand-600 flex items-center justify-center font-bold">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-extrabold text-charcoal-900">
                FlowGuard AI Agent
              </h3>
              <span className="bg-brand-600 text-white text-[10px] px-2 py-0.5 rounded-full font-extrabold uppercase">
                Active Monitoring
              </span>
            </div>
            <p className="text-xs text-charcoal-500 font-medium">
              Autonomous Order Tracking, 3-Way Match & Delay Diagnostics
            </p>
          </div>
        </div>
      </div>

      {/* AGENT DIAGNOSTIC CARD */}
      {isPaid ? (
        /* AFTER PAYMENT DIAGNOSTIC */
        <div className="p-4 rounded-2xl bg-brand-50 border border-brand-300 text-brand-900 space-y-2">
          <div className="flex items-center gap-2 font-extrabold text-brand-800 text-sm">
            <CheckCircle2 className="w-5 h-5 text-brand-600" />
            <span>✓ PAYMENT COMPLETED</span>
          </div>
          <p className="text-xs font-bold text-charcoal-900">
            ₹{currentOrder.amount?.toLocaleString('en-IN')} for {orderNum} ({invNum}) has been successfully paid.
          </p>
          <p className="text-xs text-brand-700 font-medium">
            Vendor <span className="font-bold">{currentOrder.vendorName}</span> has been notified via green success modal and alert feed.
          </p>
        </div>
      ) : (
        /* WORKFLOW MONITORING DIAGNOSTIC */
        <div className="p-4 rounded-2xl bg-brand-50/80 border border-brand-200 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-brand-800 uppercase tracking-wider flex items-center gap-1">
              <Clock className="w-4 h-4 text-brand-600" /> Workflow Diagnostic
            </span>
            <span className="text-[10px] bg-white text-brand-800 font-bold px-2 py-0.5 rounded border border-brand-200">
              {currentOrder.status}
            </span>
          </div>

          <p className="text-xs font-extrabold text-charcoal-900 leading-relaxed">
            "{orderNum} ({invNum}) is currently at stage: <span className="text-brand-700 underline">{currentOrder.status}</span>."
          </p>

          <div className="bg-white p-3 rounded-xl border border-brand-200 space-y-2">
            <span className="text-[11px] font-bold text-brand-700 block">Recommended Action:</span>
            <p className="text-xs text-charcoal-700 font-medium">
              "Send automated reminder to Company Admin ({currentOrder.companyName || 'XYZ Company'})"
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                onClick={handleSendReminder}
                disabled={reminderSent}
                className="bg-brand-600 hover:bg-brand-700 text-white font-extrabold px-3 py-1.5 rounded-lg text-xs shadow-2xs transition-colors flex items-center gap-1"
              >
                <Bell className="w-3.5 h-3.5" />
                {reminderSent ? '✓ Reminder Sent!' : 'Send Reminder'}
              </button>

              <button
                onClick={() => {
                  setSelectedOrderId(currentOrder.id);
                  setActiveTab('order-details');
                }}
                className="bg-white hover:bg-surface-light border border-surface-border text-charcoal-800 font-bold px-3 py-1.5 rounded-lg text-xs transition-colors"
              >
                View Order Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DYNAMIC AGENT RESPONSE BOX */}
      {aiAnswer && (
        <div className="p-4 rounded-2xl bg-white border border-brand-300 text-xs text-charcoal-900 shadow-2xs">
          <div className="flex items-center gap-2 font-extrabold mb-1 text-brand-800">
            <Bot className="w-4 h-4 text-brand-600" /> FlowGuard AI Answer:
          </div>
          <p className="leading-relaxed font-medium">{aiAnswer}</p>
        </div>
      )}

      {/* INTERACTIVE AGENT ASK INPUT */}
      <form onSubmit={handleAskAgent} className="flex items-center gap-2">
        <input
          type="text"
          value={aiQuery}
          onChange={(e) => setAiQuery(e.target.value)}
          placeholder={`Ask AI Verification Agent about ${orderNum}...`}
          className="flex-1 bg-surface-light border border-brand-200 rounded-xl px-4 py-2.5 text-xs text-charcoal-900 placeholder-charcoal-500 focus:outline-none focus:ring-2 focus:ring-brand-600 font-sans"
        />
        <button
          type="submit"
          className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1"
        >
          <Sparkles className="w-3.5 h-3.5" /> Ask Agent
        </button>
      </form>

    </div>
  );
}
