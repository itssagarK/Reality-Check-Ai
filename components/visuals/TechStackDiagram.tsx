import React, { useState } from 'react';
import { TechStackItem } from '../../types';
import { Layers, Server, Database, Cloud, Cpu, Layout, ChevronDown, ChevronUp } from 'lucide-react';

interface TechStackDiagramProps {
  stack: TechStackItem[];
}

export const TechStackDiagram: React.FC<TechStackDiagramProps> = ({ stack }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getLayerIcon = (layer: string) => {
    const l = layer.toLowerCase();
    if (l.includes('front')) return Layout;
    if (l.includes('back')) return Server;
    if (l.includes('data')) return Database;
    if (l.includes('host') || l.includes('infra')) return Cloud;
    return Cpu;
  };

  const paidCount = stack.filter(s => s.is_paid).length;
  const freeCount = stack.length - paidCount;

  return (
    <div className="glass-panel rounded-3xl p-6 shadow-glass flex flex-col justify-between">
      
      {/* Header */}
      <div>
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-serif font-bold text-slate-900">
                Technology & Architecture Stack
              </h3>
              <p className="text-xs text-slate-500">
                Layered component blueprint with cost tier breakdown
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

        {/* 1-Line Takeaway in Classic Blue */}
        <div className="my-2.5 px-3.5 py-2 rounded-xl bg-blue-50/60 border border-blue-200 text-xs text-slate-700 flex items-center justify-between gap-2">
          <div>
            <strong className="text-blue-900 font-semibold">Cost Profile: </strong>
            {paidCount === 0 ? "100% Free / Open-Source Tier Viable" : `${paidCount} Paid / ${freeCount} Free Components — Low fixed operational burden.`}
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 font-bold shrink-0">
            {freeCount} Free Tier
          </span>
        </div>
      </div>

      {/* Layered Stack Diagram */}
      <div className="space-y-2 my-2">
        {stack.map((item, idx) => {
          const Icon = getLayerIcon(item.layer);
          return (
            <div
              key={idx}
              className="p-3 rounded-2xl bg-white/70 backdrop-blur-md border border-slate-200/80 hover:border-blue-300 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-xs"
            >
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 shadow-xs shrink-0">
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block leading-tight">
                    {item.layer}
                  </span>
                  <span className="text-xs font-bold text-slate-900">
                    {item.tool}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                {isExpanded && (
                  <span className="text-xs text-slate-500 max-w-xs truncate hidden md:inline">
                    {item.purpose}
                  </span>
                )}
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                    item.is_paid
                      ? 'bg-amber-50 text-amber-800 border-amber-200'
                      : 'bg-blue-50 text-blue-700 border-blue-200'
                  }`}
                >
                  {item.is_paid ? 'Paid Tier' : 'Free / OSS'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {isExpanded && (
        <div className="pt-3 border-t border-slate-200 text-xs text-slate-600 space-y-1">
          <span className="font-semibold text-slate-900 text-[11px] block">
            Architectural Guidance:
          </span>
          {stack.map((item, i) => (
            <div key={i} className="flex items-start gap-1.5 text-[11px]">
              <span className="font-medium text-slate-800">• {item.tool}:</span>
              <span>{item.purpose}</span>
            </div>
          ))}
        </div>
      )}

      <div className="text-[10px] text-slate-400 pt-2 border-t border-slate-100 flex justify-between">
        <span>Stack optimized for builder autonomy</span>
        <span className="font-mono text-slate-600">{stack.length} layers mapped</span>
      </div>

    </div>
  );
};
