import React from 'react';
import { CheckCircle2, X } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  if (!toast || !toast.show) return null;

  return (
    <div className="fixed top-20 right-6 z-50 animate-in slide-in-from-top-5 duration-300">
      <div className="bg-white border-2 border-brand-600 rounded-2xl p-4 shadow-2xl flex items-start gap-3 max-w-md">
        <div className="p-2 bg-brand-100 text-brand-700 rounded-xl shrink-0">
          <CheckCircle2 className="w-6 h-6 text-brand-600 animate-bounce" />
        </div>

        <div className="flex-1 min-w-0 pr-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-extrabold text-brand-800 uppercase tracking-wider">
              {toast.title || '✓ PAYMENT COMPLETED'}
            </h4>
            <span className="text-[10px] text-charcoal-400 font-mono">{toast.time || 'Just now'}</span>
          </div>

          <p className="text-sm font-bold text-charcoal-900 mt-1 leading-snug">
            {toast.message}
          </p>

          {toast.details && (
            <div className="mt-2 bg-brand-50 p-2 rounded-lg text-xs font-mono text-brand-900 border border-brand-200">
              {toast.details}
            </div>
          )}
        </div>

        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
