import React, { useState } from 'react';
import { Risk } from '../../types';
import { ShieldAlert, ShieldCheck, ChevronDown, ChevronUp } from 'lucide-react';

interface RisksBarChartProps {
  risks: Risk[];
}

export const RisksBarChart: React.FC<RisksBarChartProps> = ({ risks }) => {
  const [selectedRiskIdx, setSelectedRiskIdx] = useState<number | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  // Sort risks by severity_score descending
  const sortedRisks = [...risks].sort((a, b) => {
    const scoreA = a.severity_score || (a.impact === 'High' ? 9 : a.impact === 'Medium' ? 6 : 3);
    const scoreB = b.severity_score || (b.impact === 'High' ? 9 : b.impact === 'Medium' ? 6 : 3);
    return scoreB - scoreA;
  });

  const getSeverityStyle = (prob: string, impact: string) => {
    const isHigh = impact === 'High' || prob === 'High';
    const isLow = impact === 'Low' && prob === 'Low';
    if (isHigh) {
      return {
        bar: 'bg-gradient-to-r from-red-500 to-red-600',
        badge: 'bg-red-50 text-red-700 border-red-200/90',
      };
    }
    if (isLow) {
      return {
        bar: 'bg-gradient-to-r from-blue-500 to-blue-600',
        badge: 'bg-blue-50 text-blue-700 border-blue-200/90',
      };
    }
    return {
      bar: 'bg-gradient-to-r from-amber-500 to-orange-500',
      badge: 'bg-amber-50 text-amber-800 border-amber-200/90',
    };
  };

  const highestRisk = sortedRisks[0];

  return (
    <div className="glass-panel rounded-3xl p-6 shadow-glass flex flex-col justify-between">
      
      {/* Header */}
      <div>
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-red-50 text-red-600 border border-red-100">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-serif font-bold text-slate-900">
                Failure Risk Distribution
              </h3>
              <p className="text-xs text-slate-500">
                Sorted by compounding impact & probability severity
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs text-slate-500 hover:text-slate-900 flex items-center gap-1 p-1 rounded-md transition-colors"
          >
            <span>{isExpanded ? "Hide" : "Mitigations"}</span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* 1-Line Takeaway in Classic Red */}
        <div className="my-2.5 px-3.5 py-2 rounded-xl bg-red-50/80 border border-red-200 text-xs text-slate-700">
          <strong className="text-red-700 font-semibold">Critical Risk: </strong>
          {highestRisk ? `"${highestRisk.description.slice(0, 75)}..." (${highestRisk.probability} Prob · ${highestRisk.impact} Impact)` : "No acute single-point-of-failure identified."}
        </div>
      </div>

      {/* Horizontal Bar Chart */}
      <div className="space-y-3.5 my-2">
        {sortedRisks.map((risk, idx) => {
          const style = getSeverityStyle(risk.probability, risk.impact);
          const scoreVal = risk.severity_score || (risk.impact === 'High' ? 9 : risk.impact === 'Medium' ? 6 : 3);
          const fillWidth = `${Math.min(100, Math.max(15, scoreVal * 10))}%`;
          const isSelected = selectedRiskIdx === idx || isExpanded;

          return (
            <div
              key={idx}
              onClick={() => setSelectedRiskIdx(selectedRiskIdx === idx ? null : idx)}
              className="cursor-pointer group p-2.5 rounded-2xl hover:bg-white/80 transition-colors border border-transparent hover:border-slate-200/80"
            >
              <div className="flex items-center justify-between text-xs mb-1.5 gap-2">
                <span className="font-semibold text-slate-800 truncate">
                  {risk.description}
                </span>
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border shrink-0 ${style.badge}`}>
                  {risk.probability} Prob · {risk.impact} Impact
                </span>
              </div>

              {/* Progress bar container */}
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200/60">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${style.bar}`}
                  style={{ width: fillWidth }}
                />
              </div>

              {/* Expandable Mitigation */}
              {isSelected && (
                <div className="mt-2.5 p-3.5 bg-blue-50/70 rounded-2xl border border-blue-200/80 text-xs flex items-start gap-2.5 animate-fade-in">
                  <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-blue-900 block text-[11px] mb-0.5">
                      Recommended Engineering Mitigation:
                    </span>
                    <p className="text-slate-700 leading-relaxed text-[11px]">
                      {risk.mitigation || "Enforce conservative checkpoints and early customer commitments."}
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="text-[10px] text-slate-400 pt-2 border-t border-slate-100 flex items-center justify-between">
        <span>Click any risk bar to view actionable mitigation</span>
        <span className="font-mono text-slate-600">{sortedRisks.length} risks audited</span>
      </div>

    </div>
  );
};
