import React from 'react';
import { PlanPhase } from '../types';
import { Calendar, CheckCircle2, Clock } from 'lucide-react';

interface PlanTimelineProps {
  phases: PlanPhase[];
}

export const PlanTimeline: React.FC<PlanTimelineProps> = ({ phases }) => {
  return (
    <div className="bg-white rounded-2xl border-3 border-slate-900 overflow-hidden flex flex-col h-full shadow-[6px_6px_0px_#0f172a] transition-all">
      <div className="p-5 border-b-2 border-slate-900 flex items-center justify-between bg-slate-50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-600 border-2 border-slate-900 text-white rounded-xl shadow-[2px_2px_0px_#0f172a]">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-900 tracking-tight">Realistic Execution Roadmap</h3>
            <p className="text-xs text-slate-500 font-medium">Calibrated milestones to prevent burnout</p>
          </div>
        </div>
        <span className="text-xs font-black text-slate-900 bg-indigo-100 px-3 py-1 rounded-lg border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a]">
          {phases.length} Phases
        </span>
      </div>
      
      <div className="p-5 overflow-y-auto custom-scrollbar flex-1 max-h-[380px]">
        <div className="relative border-l-4 border-slate-900 ml-3.5 space-y-6 pb-2">
          {phases.map((phase, idx) => (
            <div key={idx} className="relative pl-6 group">
              {/* 3D Timeline marker node */}
              <div className="absolute -left-[13px] top-1 w-6 h-6 rounded-full bg-indigo-600 border-3 border-slate-900 shadow-[2px_2px_0px_#0f172a] flex items-center justify-center text-[10px] font-black text-white">
                {idx + 1}
              </div>
              
              <div className="bg-slate-50 border-2 border-slate-900 rounded-xl p-3.5 shadow-[3px_3px_0px_#0f172a] hover:shadow-[5px_5px_0px_#0f172a] hover:-translate-y-0.5 transition-all">
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-2">
                  <h4 className="text-sm font-black text-slate-900">{phase.phase_name}</h4>
                  <span className="text-xs font-extrabold text-indigo-900 bg-white px-2.5 py-0.5 rounded-md border-2 border-slate-900 shadow-[1px_1px_0px_#0f172a] mt-1 sm:mt-0 w-fit flex items-center gap-1">
                    <Clock className="w-3 h-3 text-indigo-600" />
                    {phase.duration}
                  </span>
                </div>
                
                <ul className="space-y-1.5 pt-1 border-t border-slate-200">
                  {phase.actions.map((action, actionIdx) => (
                    <li key={actionIdx} className="flex items-start gap-2 text-slate-700 text-xs font-medium">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="leading-snug">{action}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
