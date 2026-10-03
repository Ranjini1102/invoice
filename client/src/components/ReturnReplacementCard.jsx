import React from 'react';
import { useApp } from '../context/AppContext';
import { RotateCcw, CheckCircle2, Truck, Clock, ShieldCheck } from 'lucide-react';

export default function ReturnReplacementCard({ order }) {
  const { userRole, handleReplacementAction } = useApp();

  if (!order || !order.returnReplacement) return null;

  const ret = order.returnReplacement;
  const currentStageIndex = ret.stageIndex !== undefined ? ret.stageIndex : 1;

  const stages = [
    { title: "Issue Reported", completed: true },
    { title: "Company Reviewing", completed: currentStageIndex >= 1 },
    { title: "Approved", completed: currentStageIndex >= 2 },
    { title: "Replacement Dispatched", completed: currentStageIndex >= 3 },
    { title: "Replacement Delivered", completed: currentStageIndex >= 4 },
    { title: "Issue Resolved", completed: currentStageIndex >= 5 }
  ];

  return (
    <div className="bg-white rounded-3xl border border-surface-border p-6 shadow-xs space-y-4 font-sans">
      
      {/* HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-surface-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-100 border border-brand-200 text-brand-600 flex items-center justify-center">
            <RotateCcw className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-extrabold text-charcoal-900">
                Return & Replacement Lifecycle Tracker ({ret.id || 'RET-1024'})
              </h3>
              <span className="bg-brand-600 text-white text-[10px] px-2 py-0.5 rounded-full font-extrabold uppercase">
                {ret.status}
              </span>
            </div>
            <p className="text-xs text-charcoal-500 font-medium">
              Reason: <span className="font-bold text-charcoal-900">{ret.reason || '2 Chairs Missing'}</span>
            </p>
          </div>
        </div>

        {/* COMPANY ADMIN CONTROLS */}
        {userRole === 'company' && ret.status !== 'Issue Resolved' && (
          <div className="flex flex-wrap items-center gap-2">
            {currentStageIndex < 2 && (
              <button
                onClick={() => handleReplacementAction(order.id, 'approve', 'Approved replacement')}
                className="bg-brand-600 hover:bg-brand-700 text-white font-extrabold px-3 py-1.5 rounded-xl text-xs shadow-2xs"
              >
                Approve Replacement
              </button>
            )}

            {currentStageIndex >= 2 && currentStageIndex < 3 && (
              <button
                onClick={() => handleReplacementAction(order.id, 'dispatch', 'Replacement items dispatched')}
                className="bg-brand-700 hover:bg-brand-800 text-white font-extrabold px-3 py-1.5 rounded-xl text-xs shadow-2xs flex items-center gap-1"
              >
                <Truck className="w-3.5 h-3.5" /> Dispatch Replacement
              </button>
            )}

            {currentStageIndex >= 3 && currentStageIndex < 5 && (
              <button
                onClick={() => handleReplacementAction(order.id, 'resolve', 'Issue resolved cleanly')}
                className="bg-brand-600 hover:bg-brand-700 text-white font-extrabold px-3.5 py-1.5 rounded-xl text-xs shadow-xs flex items-center gap-1"
              >
                <CheckCircle2 className="w-3.5 h-3.5" /> Mark Issue Resolved
              </button>
            )}
          </div>
        )}
      </div>

      {/* REPLACEMENT TIMELINE NODES */}
      <div className="py-2 overflow-x-auto">
        <div className="min-w-[650px] flex items-center justify-between relative">
          
          <div className="absolute top-4 left-4 right-4 h-1 bg-gray-200 -z-0">
            <div
              className="h-full bg-brand-600 transition-all duration-500 rounded-full"
              style={{ width: `${(currentStageIndex / (stages.length - 1)) * 100}%` }}
            />
          </div>

          {stages.map((st, idx) => {
            const isDone = st.completed || idx <= currentStageIndex;
            const isCurrent = idx === currentStageIndex;

            return (
              <div key={idx} className="flex flex-col items-center relative z-10 text-center w-24">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-xs ${
                  isDone ? 'bg-brand-600 text-white' : isCurrent ? 'bg-brand-600 text-white ring-4 ring-brand-200 animate-bounce' : 'bg-white border border-gray-300 text-gray-400'
                }`}>
                  {isDone ? <CheckCircle2 className="w-4 h-4" /> : '○'}
                </div>

                <span className={`text-[10px] font-extrabold mt-2 leading-tight ${
                  isDone ? 'text-charcoal-900' : 'text-gray-400'
                }`}>
                  {st.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
