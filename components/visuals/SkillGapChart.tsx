import React, { useState } from 'react';
import { SkillGapItem } from '../../types';
import { Award, ChevronDown, ChevronUp } from 'lucide-react';

interface SkillGapChartProps {
  skills: SkillGapItem[];
}

export const SkillGapChart: React.FC<SkillGapChartProps> = ({ skills }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const largestGapItem = [...skills].sort((a, b) => (b.required_level - b.current_level) - (a.required_level - a.current_level))[0];
  const maxGap = largestGapItem ? Math.max(0, largestGapItem.required_level - largestGapItem.current_level) : 0;

  return (
    <div className="glass-panel rounded-3xl p-6 shadow-glass flex flex-col justify-between">
      
      {/* Header */}
      <div>
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-serif font-bold text-slate-900">
                Skill Gap Analysis
              </h3>
              <p className="text-xs text-slate-500">
                Required proficiency vs current builder level
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs text-slate-500 hover:text-slate-900 flex items-center gap-1 p-1 rounded-md transition-colors"
          >
            <span>{isExpanded ? "Hide" : "Details"}</span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* 1-Line Takeaway in Classic Red & Blue */}
        <div className="my-2.5 px-3.5 py-2 rounded-xl bg-red-50/70 border border-red-200 text-xs text-slate-700">
          <strong className="text-red-700 font-semibold">Primary Skill Deficit: </strong>
          {largestGapItem ? `${largestGapItem.skill} has a -${maxGap}% execution gap. Recommended: leverage managed solutions or pre-built libraries.` : "Skill coverage is balanced."}
        </div>
      </div>

      {/* Paired Progress Bars */}
      <div className="space-y-3.5 my-2">
        {skills.map((item, idx) => {
          const deficit = Math.max(0, item.required_level - item.current_level);
          const isDeficitSignificant = deficit >= 20;

          return (
            <div key={idx} className="space-y-1.5 p-2 rounded-xl hover:bg-white/80 transition-colors">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-900">
                  {item.skill}
                </span>
                <div className="flex items-center gap-2 font-mono text-[11px]">
                  <span className="text-slate-500">Current: {item.current_level}%</span>
                  <span className="text-slate-300">/</span>
                  <span className="font-semibold text-slate-700">Req: {item.required_level}%</span>
                  {deficit > 0 ? (
                    <span className={`px-1.5 py-0.2 rounded-md font-bold text-[10px] border ${
                      isDeficitSignificant ? 'bg-red-50 text-red-700 border-red-200' : 'bg-amber-50 text-amber-800 border-amber-200'
                    }`}>
                      -{deficit}%
                    </span>
                  ) : (
                    <span className="px-1.5 py-0.2 rounded-md font-bold text-[10px] bg-blue-50 text-blue-700 border border-blue-200">
                      Met
                    </span>
                  )}
                </div>
              </div>

              {/* Stacked relative comparison bar */}
              <div className="relative w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200/60">
                {/* Required Level Marker */}
                <div
                  className="absolute top-0 bottom-0 bg-slate-300/80 rounded-full"
                  style={{ width: `${item.required_level}%` }}
                />
                {/* Current Level Fill (Classic Blue) */}
                <div
                  className="absolute top-0 bottom-0 bg-blue-600 rounded-full transition-all duration-500"
                  style={{ width: `${item.current_level}%` }}
                />
              </div>

              {isExpanded && (
                <p className="text-[11px] text-slate-500 leading-snug pt-1">
                  {item.gap_summary}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[10px] text-slate-400">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
            <span>Current Proficiency</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
            <span>Required Threshold</span>
          </div>
        </div>
        <span className="font-mono">{skills.length} domains tested</span>
      </div>

    </div>
  );
};
