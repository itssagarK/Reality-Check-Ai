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
    <div className="space-y-6 animate-pop-in">
        
      {/* 3D Diagnosis Section */}
      <div className="bg-white rounded-2xl border-3 border-slate-900 p-6 sm:p-8 shadow-[8px_8px_0px_#0f172a] relative overflow-hidden">
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2.5 bg-purple-600 border-2 border-slate-900 text-white rounded-xl shadow-[2px_2px_0px_#0f172a]">
            <Microscope className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-black text-slate-900 tracking-tight">Decision Path Diagnosis</h3>
            <p className="text-xs text-slate-500 font-medium">Root cause why this specific execution approach struggles</p>
          </div>
        </div>
        
        <p className="text-slate-800 text-sm sm:text-base leading-relaxed mb-6 font-medium">
          {analysis.diagnosis}
        </p>
        
        {/* Simplification Advice Card */}
        <div className="bg-amber-100 border-2 border-slate-900 rounded-xl p-4 sm:p-5 flex gap-3.5 items-start shadow-[3px_3px_0px_#0f172a]">
          <div className="p-2 bg-amber-400 border-2 border-slate-900 text-slate-950 rounded-lg shrink-0 shadow-[1px_1px_0px_#0f172a]">
            <Lightbulb className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-1">
              Recommended Simplification
            </h4>
            <p className="text-slate-900 text-sm leading-relaxed font-bold">
              "{analysis.simplification_advice}"
            </p>
          </div>
        </div>
      </div>

      {/* Alternative Paths Header */}
      <div className="flex items-center justify-between px-1">
        <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
          <GitBranch className="w-5 h-5 text-indigo-600" />
          High-Feasibility Alternative Paths
        </h3>
        <span className="text-xs font-bold text-slate-500 hidden sm:inline">
          Test an alternative as an iteration to compare Reality Scores
        </span>
      </div>
      
      {/* Alternatives 3D Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {analysis.alternatives.map((alt, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl border-3 border-slate-900 p-6 flex flex-col h-full shadow-[6px_6px_0px_#0f172a] hover:shadow-[8px_8px_0px_#0f172a] hover:-translate-y-1 transition-all duration-200"
          >
            <div className="flex items-center justify-between mb-3.5 pb-3 border-b-2 border-slate-200">
              <h4 className="text-base font-black text-slate-900">{alt.name}</h4>
              <span className="text-[11px] font-black bg-indigo-100 text-slate-900 px-3 py-1 rounded-lg border-2 border-slate-900 shadow-[1px_1px_0px_#0f172a]">
                Option {idx + 1}
              </span>
            </div>
            
            <p className="text-xs sm:text-sm text-slate-700 mb-5 flex-grow leading-relaxed font-medium">
              {alt.reasoning}
            </p>
            
            <div className="mt-auto space-y-3">
              <div className="bg-slate-50 p-3.5 rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a]">
                <span className="text-[10px] font-black text-slate-600 uppercase block mb-1 tracking-wider">
                  Required Strategic Trade-offs
                </span>
                <p className="text-xs text-slate-800 leading-relaxed font-bold">
                  {alt.trade_offs}
                </p>
              </div>

              {onTestAlternativeAsVariation && (
                <button
                  type="button"
                  onClick={() => onTestAlternativeAsVariation(alt)}
                  className="w-full py-2.5 px-3 rounded-xl neo-3d-btn-primary text-xs font-black flex items-center justify-center gap-2"
                >
                  <PlusCircle className="w-4 h-4" />
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
