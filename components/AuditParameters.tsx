import React from 'react';
import { UserInput } from '../types';
import { AlignLeft, Clock, Hammer, Link, FileText } from 'lucide-react';

interface AuditParametersProps {
  input: UserInput;
}

export const AuditParameters: React.FC<AuditParametersProps> = ({ input }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm flex flex-col">
      <div className="p-4 border-b border-slate-100 bg-slate-50/60 flex items-center justify-between">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-indigo-600"></div>
          Audited Parameters
        </h3>
        {input.variationLabel && (
          <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-full">
            {input.variationLabel}
          </span>
        )}
      </div>
      
      <div className="p-5 space-y-4">
        {/* Project Name if present */}
        {input.projectName && (
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Project
            </span>
            <span className="text-sm font-bold text-slate-900">
              {input.projectName}
            </span>
          </div>
        )}

        {/* Plan */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-slate-500">
            <AlignLeft className="w-3.5 h-3.5" />
            <span className="text-[10px] font-bold uppercase tracking-wider">The Plan</span>
          </div>
          <p className="text-slate-800 text-sm leading-relaxed border-l-2 border-indigo-500 pl-3 py-0.5">
            {input.plan}
          </p>
        </div>

        {/* Constraints */}
        {input.constraints && (
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-slate-500">
              <Clock className="w-3.5 h-3.5" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Constraints</span>
            </div>
            <p className="text-slate-700 text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 leading-relaxed font-medium">
              {input.constraints}
            </p>
          </div>
        )}

        {/* Resources */}
        {input.resources && (
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-slate-500">
              <Hammer className="w-3.5 h-3.5" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Resources</span>
            </div>
            <p className="text-slate-700 text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 leading-relaxed font-medium">
              {input.resources}
            </p>
          </div>
        )}

        {/* Evidence */}
        {input.evidence && (
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-slate-500">
              <Link className="w-3.5 h-3.5" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Supporting Evidence</span>
            </div>
            <p className="text-slate-700 text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 whitespace-pre-wrap leading-relaxed font-medium">
              {input.evidence}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
