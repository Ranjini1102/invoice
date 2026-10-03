import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Send, Bot, User, Building, Paperclip, CheckCheck, Sparkles } from 'lucide-react';

export default function TwoWayChat({ invoice }) {
  const { userRole, handleSendMessage } = useApp();
  const [inputText, setInputText] = useState('');
  const [isAiSuggesting, setIsAiSuggesting] = useState(false);

  if (!invoice) return null;

  const chatHistory = invoice.chatHistory || [];

  const onSend = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    handleSendMessage(invoice.id, inputText);
    setInputText('');
  };

  const handleAskAI = (promptText) => {
    setInputText(promptText);
  };

  return (
    <div className="bg-white rounded-2xl border border-surface-border shadow-xs flex flex-col h-[520px]">
      
      {/* CHAT HEADER */}
      <div className="p-4 border-b border-surface-border bg-surface-light flex items-center justify-between rounded-t-2xl">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center font-bold">
            <MessageSquareHeaderIcon className="w-5 h-5 text-brand-600" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-charcoal-900">
              Invoice Discussion Thread ({invoice.invoiceNumber})
            </h3>
            <p className="text-[11px] text-charcoal-500 font-medium">
              Private 2-Way Channel between {invoice.vendorName} & {invoice.companyName}
            </p>
          </div>
        </div>

        <span className="text-[11px] bg-brand-100 text-brand-800 px-2.5 py-1 rounded-full font-semibold border border-brand-200">
          ● Live Encrypted Thread
        </span>
      </div>

      {/* QUICK AI PROMPT SUGGESTIONS */}
      <div className="px-4 py-2 bg-brand-50/50 border-b border-surface-border flex items-center gap-2 overflow-x-auto text-xs">
        <span className="text-[10px] text-brand-700 font-bold uppercase shrink-0 flex items-center gap-1">
          <Sparkles className="w-3 h-3" /> Quick Prompts:
        </span>
        <button
          onClick={() => handleAskAI("@ai Why is this invoice delayed?")}
          className="bg-white hover:bg-brand-50 text-charcoal-700 px-2.5 py-1 rounded-lg border border-brand-200 shrink-0 font-medium hover:text-brand-700 transition-colors"
        >
          Ask AI Delay Reason
        </button>
        <button
          onClick={() => handleAskAI("Corrected invoice uploaded.")}
          className="bg-white hover:bg-brand-50 text-charcoal-700 px-2.5 py-1 rounded-lg border border-brand-200 shrink-0 font-medium hover:text-brand-700 transition-colors"
        >
          Reply "Correction Uploaded"
        </button>
        <button
          onClick={() => handleAskAI("Please confirm receipt of supporting purchase order.")}
          className="bg-white hover:bg-brand-50 text-charcoal-700 px-2.5 py-1 rounded-lg border border-brand-200 shrink-0 font-medium hover:text-brand-700 transition-colors"
        >
          Confirm Receipt
        </button>
      </div>

      {/* MESSAGES SCROLL AREA */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {chatHistory.length === 0 ? (
          <div className="text-center py-12 text-xs text-charcoal-500">
            No messages yet. Start the conversation regarding {invoice.invoiceNumber}.
          </div>
        ) : (
          chatHistory.map((msg, idx) => {
            const isVendor = msg.senderRole === 'vendor';
            const isCompany = msg.senderRole === 'company';
            const isAI = msg.senderRole === 'ai';

            return (
              <div
                key={msg.id || idx}
                className={`flex gap-3 max-w-[85%] ${
                  isAI ? 'mx-auto max-w-md w-full' :
                  (userRole === 'vendor' && isVendor) || (userRole === 'company' && isCompany)
                    ? 'ml-auto flex-row-reverse'
                    : ''
                }`}
              >
                {/* AVATAR */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  isAI ? 'bg-brand-600 text-white' :
                  isVendor ? 'bg-brand-100 text-brand-700' :
                  'bg-gray-100 text-charcoal-700'
                }`}>
                  {isAI ? <Bot className="w-4 h-4" /> :
                   isVendor ? <User className="w-4 h-4" /> :
                   <Building className="w-4 h-4" />}
                </div>

                {/* BUBBLE */}
                <div className={`rounded-2xl p-3.5 shadow-2xs text-xs space-y-1 ${
                  isAI ? 'bg-brand-50 border border-brand-200 text-brand-900 w-full' :
                  (userRole === 'vendor' && isVendor) || (userRole === 'company' && isCompany)
                    ? 'bg-brand-600 text-white rounded-tr-none'
                    : 'bg-surface-light border border-surface-border text-charcoal-900 rounded-tl-none'
                }`}>
                  <div className="flex items-center justify-between gap-4 text-[10px] opacity-80 font-medium border-b border-black/5 pb-1">
                    <span className="font-bold">{msg.senderName}</span>
                    <span>{msg.timestamp}</span>
                  </div>

                  <p className="text-xs leading-relaxed font-sans">{msg.message}</p>

                  {msg.attachmentUrl && (
                    <div className="mt-2 p-2 bg-white/20 rounded-lg flex items-center gap-2 text-[11px] underline">
                      <Paperclip className="w-3 h-3" /> Attached File
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* INPUT FORM */}
      <form onSubmit={onSend} className="p-3 border-t border-surface-border bg-white rounded-b-2xl flex items-center gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={`Type a message as ${userRole === 'vendor' ? 'Vendor' : 'Company'} (or @ai to query FlowGuard AI)...`}
          className="flex-1 bg-surface-light border border-surface-border rounded-xl px-4 py-2.5 text-xs text-charcoal-900 placeholder-charcoal-500 focus:outline-none focus:ring-2 focus:ring-brand-600 font-sans"
        />

        <button
          type="submit"
          disabled={!inputText.trim()}
          className="bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white p-2.5 rounded-xl font-bold transition-all shadow-xs shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

    </div>
  );
}

function MessageSquareHeaderIcon(props) {
  return (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  );
}
