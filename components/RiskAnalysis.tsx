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
        return 'text-rose-950 bg-rose-200 border-2 border-slate-900 shadow-[1px_1px_0px_#0f172a]';
      case 'medium':
        return 'text-amber-950 bg-amber-200 border-2 border-slate-900 shadow-[1px_1px_0px_#0f172a]';
      case 'low':
        return 'text-emerald-950 bg-emerald-200 border-2 border-slate-900 shadow-[1px_1px_0px_#0f172a]';
      default:
        return 'text-slate-950 bg-slate-200 border-2 border-slate-900 shadow-[1px_1px_0px_#0f172a]';
    }
  };

  return (
    <div className="bg-white rounded-2xl border-3 border-slate-900 overflow-hidden flex flex-col h-full shadow-[6px_6px_0px_#0f172a] transition-all">
      <div className="p-5 border-b-2 border-slate-900 flex items-center justify-between bg-slate-50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-400 border-2 border-slate-900 text-slate-900 rounded-xl shadow-[2px_2px_0px_#0f172a]">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-900 tracking-tight">Failure Risk Assessment</h3>
            <p className="text-xs text-slate-500 font-medium">Uncovered blindspots & probability</p>
          </div>
        </div>
        <span className="text-xs font-black text-slate-900 bg-white px-3 py-1 rounded-lg border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a]">
          {risks.length} Risks
        </span>
      </div>
      
      <div className="p-4 space-y-3 overflow-y-auto custom-scrollbar flex-1 max-h-[380px]">
        {risks.map((risk, idx) => (
          <div
            key={idx}
            className="bg-white rounded-xl p-4 border-2 border-slate-900 shadow-[3px_3px_0px_#0f172a] hover:shadow-[5px_5px_0px_#0f172a] hover:-translate-y-0.5 transition-all"
          >
            <div className="flex justify-between items-center mb-2.5">
              <div className="flex gap-2">
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${getSeverityStyle(risk.probability)}`}>
                  Probability: {risk.probability}
                </span>
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${getSeverityStyle(risk.impact)}`}>
                  Impact: {risk.impact}
                </span>
              </div>
            </div>
            <p className="text-slate-800 text-sm leading-relaxed font-medium">
              {risk.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
