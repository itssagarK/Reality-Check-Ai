import React from 'react';
import { PlanPhase } from '../types';
import { Calendar, CheckCircle2, Clock } from 'lucide-react';

interface PlanTimelineProps {
  phases: PlanPhase[];
}

export const PlanTimeline: React.FC<PlanTimelineProps> = ({ phases }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col h-full shadow-sm">
      <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Realistic Execution Roadmap</h3>
            <p className="text-xs text-slate-500">Corrected timeline calibrated to constraints</p>
          </div>
        </div>
        <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-200">
          {phases.length} Phases
        </span>
      </div>
      
      <div className="p-5 overflow-y-auto custom-scrollbar flex-1 max-h-[380px]">
        <div className="relative border-l-2 border-slate-200 ml-3 space-y-6 pb-2">
          {phases.map((phase, idx) => (
            <div key={idx} className="relative pl-6 group">
              {/* Timeline marker node */}
              <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-white border-4 border-indigo-600 shadow-xs"></div>
              
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-2">
                <h4 className="text-sm font-bold text-slate-900">{phase.phase_name}</h4>
                <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100 mt-1 sm:mt-0 w-fit flex items-center gap-1">
                  <Clock className="w-3 h-3 text-indigo-500" />
                  {phase.duration}
                </span>
              </div>
              
              <ul className="space-y-1.5">
                {phase.actions.map((action, actionIdx) => (
                  <li key={actionIdx} className="flex items-start gap-2 text-slate-600 text-xs">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="leading-snug">{action}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
