import React from 'react';
import { RealityCheckResponse, UserInput } from '../types';
import { OctagonAlert, Target } from 'lucide-react';

interface ExecutiveSummaryProps {
  result: RealityCheckResponse;
  userInput: UserInput;
}

export const ExecutiveSummary: React.FC<ExecutiveSummaryProps> = ({ result, userInput }) => {
  const takeaways = result.key_takeaways || [
    `Feasibility Score of ${result.reality_score}/100 indicates key unit constraints need restructuring.`,
    `Stop Condition Trigger: ${result.stop_signal}`,
    result.decision_path_analysis?.simplification_advice || "Favor scope simplification and eliminate non-core dependencies."
  ];

  return (
    <div className="space-y-4">
      
      {/* 3 Key Takeaways Card (Glassmorphic) */}
      <div className="glass-panel rounded-3xl p-6 shadow-glass">
        <div className="flex items-center gap-2.5 mb-3.5">
          <div className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
            <Target className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-serif font-bold text-slate-900">
              Executive Brief: 3 Critical Feasibility Takeaways
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {takeaways.map((takeaway, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-white/70 backdrop-blur-md border border-slate-200/80 flex items-start gap-3 shadow-xs hover:border-blue-200 transition-colors"
            >
              <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5 border border-blue-200">
                {idx + 1}
              </span>
              <p className="text-xs text-slate-700 leading-relaxed font-normal">
                {takeaway}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Critical Stop Signal Banner (Classic Red Glassmorphic) */}
      <div className="p-5 rounded-2xl bg-red-50/80 backdrop-blur-md border border-red-200 shadow-glass-red flex flex-col sm:flex-row items-start gap-4">
        <div className="p-2.5 rounded-xl bg-red-600 text-white shrink-0 shadow-sm shadow-red-500/30">
          <OctagonAlert className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-red-800">
              Critical Stop Signal & Pivot Trigger
            </h4>
          </div>
          <p className="text-sm font-serif font-bold text-red-950 leading-relaxed">
            "{result.stop_signal}"
          </p>
          <p className="text-[11px] text-red-700">
            If this condition is encountered during build execution, immediately stop feature expansion and re-validate core customer mechanics.
          </p>
        </div>
      </div>

    </div>
  );
};
