import React, { useState } from 'react';
import { AlternativePath, DecisionPathAnalysis } from '../../types';
import { GitBranch, ArrowRight, ChevronDown, ChevronUp, Check } from 'lucide-react';

interface AlternativesComparisonProps {
  decisionAnalysis?: DecisionPathAnalysis;
  onSelectAlternativeAsVariation?: (alt: AlternativePath) => void;
}

export const AlternativesComparison: React.FC<AlternativesComparisonProps> = ({
  decisionAnalysis,
  onSelectAlternativeAsVariation
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!decisionAnalysis || !decisionAnalysis.alternatives || decisionAnalysis.alternatives.length === 0) {
    return null;
  }

  const { alternatives, simplification_advice, diagnosis } = decisionAnalysis;

  return (
    <div className="glass-panel rounded-3xl p-6 sm:p-8 shadow-glass flex flex-col justify-between">
      
      {/* Header */}
      <div>
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
              <GitBranch className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-serif font-bold text-slate-900">
                Decision Paths & High-Feasibility De-scoping
              </h3>
              <p className="text-xs text-slate-500">
                Alternative engineering routes to bypass primary failure points
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs text-slate-500 hover:text-slate-900 flex items-center gap-1 p-1 rounded-md transition-colors"
          >
            <span>{isExpanded ? "Hide" : "Diagnosis"}</span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* 1-Line Takeaway in Classic Blue */}
        <div className="my-2.5 px-3.5 py-2 rounded-xl bg-blue-50/60 border border-blue-200 text-xs text-slate-700">
          <strong className="text-blue-900 font-semibold">De-scoping Rule: </strong>
          "{simplification_advice}"
        </div>
      </div>

      {isExpanded && diagnosis && (
        <div className="p-3 mb-4 rounded-2xl bg-white/80 border border-slate-200 text-xs text-slate-600 leading-relaxed shadow-xs animate-fade-in">
          <strong className="text-slate-900 block mb-1 font-semibold">Root Cause Diagnosis:</strong>
          {diagnosis}
        </div>
      )}

      {/* Alternative Path Cards */}
      <div className="space-y-3 my-2">
        {alternatives.map((alt, idx) => (
          <div
            key={idx}
            className={`p-4 rounded-2xl border transition-all flex flex-col justify-between shadow-xs ${
              alt.is_best_pick
                ? 'bg-blue-50/70 border-blue-300 ring-1 ring-blue-300'
                : 'bg-white/70 border-slate-200/80 hover:border-slate-300'
            }`}
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-slate-900">
                    {alt.name}
                  </h4>
                  {alt.is_best_pick && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-600 text-white font-bold text-[10px] shadow-xs">
                      <Check className="w-3 h-3" />
                      Highest Feasibility
                    </span>
                  )}
                </div>

                {alt.estimated_savings && (
                  <span className="text-[11px] font-mono font-bold text-blue-700 bg-white/90 px-2 py-0.5 rounded-md border border-blue-200 shrink-0">
                    {alt.estimated_savings}
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-600 leading-relaxed mb-2 font-normal">
                {alt.reasoning}
              </p>

              <div className="text-[11px] text-slate-500 bg-white/60 p-2 rounded-xl border border-slate-200/60 mb-3">
                <strong className="text-slate-700 font-semibold">Trade-off / Compromise: </strong>
                {alt.trade_offs}
              </div>
            </div>

            {onSelectAlternativeAsVariation && (
              <button
                onClick={() => onSelectAlternativeAsVariation(alt)}
                className={`self-start inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  alt.is_best_pick
                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                }`}
              >
                <span>Audit This Route as Variation</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="text-[10px] text-slate-400 pt-2 border-t border-slate-100 flex justify-between">
        <span>Evaluated for maximum launch velocity</span>
        <span className="font-mono text-slate-600">{alternatives.length} alternatives modeled</span>
      </div>

    </div>
  );
};
