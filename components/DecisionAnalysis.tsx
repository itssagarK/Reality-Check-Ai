import React from 'react';
import { DecisionPathAnalysis, AlternativePath } from '../types';
import { GitBranch, Microscope, Lightbulb, PlusCircle, ArrowRight, ShieldCheck } from 'lucide-react';

interface DecisionAnalysisProps {
  analysis: DecisionPathAnalysis;
  onTestAlternativeAsVariation?: (alt: AlternativePath) => void;
}

export const DecisionAnalysis: React.FC<DecisionAnalysisProps> = ({
  analysis,
  onTestAlternativeAsVariation
}) => {
  return (
    <div className="space-y-6">
        
      {/* Diagnosis Section */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2.5 bg-purple-50 text-purple-700 rounded-xl">
            <Microscope className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Decision Path Diagnosis</h3>
            <p className="text-xs text-slate-500">Root cause why this specific execution approach struggles</p>
          </div>
        </div>
        
        <p className="text-slate-700 text-sm sm:text-base leading-relaxed mb-6 font-normal">
          {analysis.diagnosis}
        </p>
        
        {/* Simplification Advice Card */}
        <div className="bg-amber-50/70 rounded-xl border border-amber-200 p-4 sm:p-5 flex gap-3.5 items-start">
          <div className="p-1.5 bg-amber-100 text-amber-800 rounded-lg shrink-0 mt-0.5">
            <Lightbulb className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider mb-1">
              Recommended Simplification
            </h4>
            <p className="text-amber-950 text-sm leading-relaxed font-medium">
              "{analysis.simplification_advice}"
            </p>
          </div>
        </div>
      </div>

      {/* Alternative Paths Header */}
      <div className="flex items-center justify-between px-1">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <GitBranch className="w-5 h-5 text-indigo-600" />
          High-Feasibility Alternative Paths
        </h3>
        <span className="text-xs text-slate-500 hidden sm:inline">
          Test an alternative as an iteration to compare Reality Scores
        </span>
      </div>
      
      {/* Alternatives Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {analysis.alternatives.map((alt, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col h-full hover:border-indigo-300 hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-100">
              <h4 className="text-base font-bold text-slate-900">{alt.name}</h4>
              <span className="text-[11px] font-bold bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full border border-indigo-100">
                Option {idx + 1}
              </span>
            </div>
            
            <p className="text-xs sm:text-sm text-slate-600 mb-5 flex-grow leading-relaxed">
              {alt.reasoning}
            </p>
            
            <div className="mt-auto space-y-3">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1 tracking-wider">
                  Required Strategic Trade-offs
                </span>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  {alt.trade_offs}
                </p>
              </div>

              {onTestAlternativeAsVariation && (
                <button
                  type="button"
                  onClick={() => onTestAlternativeAsVariation(alt)}
                  className="w-full py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-all"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  Test this Alternative as Plan Variation
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
