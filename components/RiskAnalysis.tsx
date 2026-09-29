import React from 'react';
import { Risk } from '../types';
import { AlertTriangle, AlertCircle } from 'lucide-react';

interface RiskAnalysisProps {
  risks: Risk[];
}

export const RiskAnalysis: React.FC<RiskAnalysisProps> = ({ risks }) => {
  const getSeverityStyle = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'high':
        return 'text-rose-700 bg-rose-50 border-rose-200';
      case 'medium':
        return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'low':
        return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      default:
        return 'text-slate-700 bg-slate-50 border-slate-200';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col h-full shadow-sm">
      <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Failure Risk Assessment</h3>
            <p className="text-xs text-slate-500">Uncovered blindspots & probability</p>
          </div>
        </div>
        <span className="text-xs font-bold text-slate-600 bg-white px-2.5 py-1 rounded-full border border-slate-200 shadow-xs">
          {risks.length} Risks Identified
        </span>
      </div>
      
      <div className="p-4 space-y-3 overflow-y-auto custom-scrollbar flex-1 max-h-[380px]">
        {risks.map((risk, idx) => (
          <div
            key={idx}
            className="bg-white rounded-xl p-3.5 border border-slate-200 hover:border-slate-300 hover:shadow-xs transition-all"
          >
            <div className="flex justify-between items-center mb-2">
              <div className="flex gap-2">
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${getSeverityStyle(risk.probability)}`}>
                  Probability: {risk.probability}
                </span>
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${getSeverityStyle(risk.impact)}`}>
                  Impact: {risk.impact}
                </span>
              </div>
            </div>
            <p className="text-slate-800 text-sm leading-relaxed font-normal">
              {risk.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
