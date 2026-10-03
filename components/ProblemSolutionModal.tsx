import React from 'react';
import { ProblemSolutionDetail } from '../types';
import { X, AlertCircle, CheckCircle2, IndianRupee, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { formatINR } from '../utils/currencyUtils';

interface ProblemSolutionModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: ProblemSolutionDetail | null;
  onApplySolution?: (stepText: string) => void;
}

export const ProblemSolutionModal: React.FC<ProblemSolutionModalProps> = ({
  isOpen,
  onClose,
  item,
  onApplySolution
}) => {
  if (!isOpen || !item) return null;

  const severityBadge =
    item.severity === 'Critical'
      ? 'bg-red-50 text-red-700 border-red-200'
      : item.severity === 'High'
      ? 'bg-orange-50 text-orange-700 border-orange-200'
      : 'bg-blue-50 text-blue-700 border-blue-200';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm no-print animate-fade-in">
      <div
        className="relative w-full max-w-lg bg-white/95 backdrop-blur-2xl border border-slate-200/90 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Ribbon */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-blue-50/70 to-red-50/40">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-600 text-white shadow-sm shadow-blue-500/25">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  {item.sectorName}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${severityBadge}`}>
                  {item.severity} Risk
                </span>
              </div>
              <h3 className="text-base font-serif font-bold text-slate-900">
                Problem & Actionable Engineering Solution
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-white/80 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1 custom-scrollbar">
          
          {/* Identified Problem Card */}
          <div className="p-4 rounded-2xl bg-red-50/70 border border-red-200/80 space-y-2">
            <div className="flex items-center gap-2 text-red-800 font-bold text-xs uppercase tracking-wider">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>Diagnosed Problem</span>
            </div>
            <p className="text-sm font-semibold text-slate-900 leading-snug">
              {item.problem}
            </p>
            {item.rootCause && (
              <div className="pt-1.5 border-t border-red-200/60 text-xs text-red-900/90 leading-relaxed">
                <strong className="text-red-950">Root Cause: </strong>
                {item.rootCause}
              </div>
            )}
          </div>

          {/* Actionable Engineering Solution Card */}
          <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200/80 space-y-2">
            <div className="flex items-center gap-2 text-blue-800 font-bold text-xs uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
              <span>Recommended Engineering Solution</span>
            </div>
            <p className="text-sm text-slate-800 leading-relaxed">
              {item.solution}
            </p>
          </div>

          {/* Financial Impact in INR (₹) */}
          <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-emerald-600 text-white shrink-0">
                <IndianRupee className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
                  Projected Financial Impact
                </span>
                <span className="text-xs font-semibold text-emerald-950">
                  {item.financialImpactInr}
                </span>
              </div>
            </div>
          </div>

          {/* Actionable De-scope Step */}
          {item.actionableDeScopeStep && (
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Immediate Action Item:
              </span>
              <p className="font-medium text-slate-900">
                {item.actionableDeScopeStep}
              </p>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/60 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200/60 transition-colors"
          >
            Close
          </button>

          {onApplySolution && (
            <button
              onClick={() => {
                onApplySolution(item.actionableDeScopeStep || item.solution);
                onClose();
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/25 transition-all active:scale-[0.99]"
            >
              <span>Apply Fix to De-scoped Iteration</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
