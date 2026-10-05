import React, { useState } from 'react';
import { PlanPhase } from '../../types';
import { Calendar, CheckCircle2, Clock, ChevronDown, ChevronUp } from 'lucide-react';

interface RoadmapGanttChartProps {
  phases: PlanPhase[];
}

export const RoadmapGanttChart: React.FC<RoadmapGanttChartProps> = ({ phases }) => {
  const [selectedPhaseIdx, setSelectedPhaseIdx] = useState<number | null>(0);
  const [isExpanded, setIsExpanded] = useState(false);

  const totalWeeks = phases.reduce((acc, p) => acc + (p.estimated_weeks || 3), 0);

  return (
    <div className="glass-panel rounded-3xl p-6 shadow-glass flex flex-col justify-between">
      
      {/* Header */}
      <div>
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-serif font-bold text-slate-900">
                Execution Roadmap
              </h3>
              <p className="text-xs text-slate-500">
                Timeline calibrated to protect against scope creep
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs text-slate-500 hover:text-slate-900 flex items-center gap-1 p-1 rounded-md transition-colors"
          >
            <span>{isExpanded ? "Collapse" : "Deliverables"}</span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* 1-Line Takeaway in Classic Blue */}
        <div className="my-2.5 px-3.5 py-2 rounded-xl bg-blue-50/60 border border-blue-200 text-xs text-slate-700 flex items-center justify-between gap-2">
          <div>
            <strong className="text-blue-900 font-semibold">Delivery Horizon: </strong>
            {phases.length} gated phases spanning approx. {totalWeeks} cumulative execution weeks.
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 font-bold shrink-0">
            {totalWeeks} wks
          </span>
        </div>
      </div>

      {/* Gantt / Horizontal Bar Timeline */}
      <div className="space-y-2.5 my-3">
        {phases.map((phase, idx) => {
          const isSelected = selectedPhaseIdx === idx || isExpanded;
          const weeks = phase.estimated_weeks || (idx + 1) * 2;
          const widthPercent = Math.min(100, Math.max(25, (weeks / Math.max(1, totalWeeks)) * 100));

          return (
            <div
              key={idx}
              onClick={() => setSelectedPhaseIdx(selectedPhaseIdx === idx ? null : idx)}
              className="p-3 rounded-2xl bg-white border border-slate-300 hover:border-blue-400 transition-colors cursor-pointer shadow-2xs"
            >
              <div className="flex items-center justify-between text-xs mb-1.5 gap-2">
                <div className="flex items-center gap-2 truncate">
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 font-bold text-[10px] flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <span className="font-bold text-slate-900 truncate">
                    {phase.phase_name}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0 text-slate-500 font-mono text-[11px]">
                  <Clock className="w-3 h-3 text-blue-600" />
                  <span>{phase.duration}</span>
                </div>
              </div>

              {/* Progress track */}
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-1.5 border border-slate-200/60">
                <div
                  className="h-full bg-gradient-to-r from-blue-600 to-blue-500 rounded-full transition-all duration-500"
                  style={{ width: `${widthPercent}%` }}
                />
              </div>

              {/* Expandable actions list */}
              {isSelected && (
                <div className="mt-2.5 pt-2 border-t border-slate-100 space-y-1 text-xs animate-fade-in">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Phase Gate Deliverables:
                  </span>
                  {phase.actions.map((act, i) => (
                    <div key={i} className="flex items-start gap-2 text-slate-600 text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                      <span>{act}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="text-[10px] text-slate-400 pt-2 border-t border-slate-100 flex justify-between">
        <span>Click phase card to inspect gate criteria</span>
        <span className="font-mono text-slate-600">{phases.length} phases configured</span>
      </div>

    </div>
  );
};
