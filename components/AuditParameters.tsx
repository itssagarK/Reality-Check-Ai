import React from 'react';
import { UserInput } from '../types';
import { AlignLeft, Clock, Hammer, Link, FileText } from 'lucide-react';

interface AuditParametersProps {
  input: UserInput;
}

export const AuditParameters: React.FC<AuditParametersProps> = ({ input }) => {
  return (
    <div className="bg-white border-3 border-slate-900 rounded-2xl overflow-hidden shadow-[6px_6px_0px_#0f172a] flex flex-col">
      <div className="p-4 border-b-2 border-slate-900 bg-slate-50 flex items-center justify-between">
        <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-indigo-600 border border-slate-900"></div>
          Audited Parameters
        </h3>
        {input.variationLabel && (
          <span className="text-[11px] font-black text-slate-950 bg-indigo-100 border-2 border-slate-900 px-2.5 py-0.5 rounded-lg shadow-[1px_1px_0px_#0f172a]">
            {input.variationLabel}
          </span>
        )}
      </div>
      
      <div className="p-5 space-y-4">
        {/* Project Name if present */}
        {input.projectName && (
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
              Project
            </span>
            <span className="text-sm font-black text-slate-900">
              {input.projectName}
            </span>
          </div>
        )}

        {/* Plan */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-slate-700">
            <AlignLeft className="w-3.5 h-3.5" />
            <span className="text-[10px] font-black uppercase tracking-wider">The Plan</span>
          </div>
          <p className="text-slate-900 text-sm leading-relaxed border-l-3 border-indigo-600 pl-3 py-0.5 font-medium bg-slate-50 rounded-r-lg">
            {input.plan}
          </p>
        </div>

        {/* Constraints */}
        {input.constraints && (
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-slate-700">
              <Clock className="w-3.5 h-3.5" />
              <span className="text-[10px] font-black uppercase tracking-wider">Constraints</span>
            </div>
            <p className="text-slate-800 text-xs bg-slate-50 p-2.5 rounded-xl border-2 border-slate-900 leading-relaxed font-bold shadow-[2px_2px_0px_#0f172a]">
              {input.constraints}
            </p>
          </div>
        )}

        {/* Resources */}
        {input.resources && (
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-slate-700">
              <Hammer className="w-3.5 h-3.5" />
              <span className="text-[10px] font-black uppercase tracking-wider">Resources</span>
            </div>
            <p className="text-slate-800 text-xs bg-slate-50 p-2.5 rounded-xl border-2 border-slate-900 leading-relaxed font-bold shadow-[2px_2px_0px_#0f172a]">
              {input.resources}
            </p>
          </div>
        )}

        {/* Evidence */}
        {input.evidence && (
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-slate-700">
              <Link className="w-3.5 h-3.5" />
              <span className="text-[10px] font-black uppercase tracking-wider">Supporting Evidence</span>
            </div>
            <p className="text-slate-800 text-xs bg-slate-50 p-2.5 rounded-xl border-2 border-slate-900 whitespace-pre-wrap leading-relaxed font-bold shadow-[2px_2px_0px_#0f172a]">
              {input.evidence}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
