import React, { useState } from 'react';
import { SavedAudit } from '../types';
import { X, Trash2, Clock, ChevronRight, Search, FileText } from 'lucide-react';

interface HistorySidebarProps {
  isOpen: boolean;
  onClose: () => void;
  history: SavedAudit[];
  onSelect: (audit: SavedAudit) => void;
  onClear: () => void;
  onDelete: (id: string) => void;
}

export const HistorySidebar: React.FC<HistorySidebarProps> = ({
  isOpen, onClose, history, onSelect, onClear, onDelete
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredHistory = history.filter((item) => {
    if (!searchTerm.trim()) return true;
    const query = searchTerm.toLowerCase();
    const plan = item.userInput.plan.toLowerCase();
    const proj = (item.userInput.projectName || '').toLowerCase();
    const label = (item.variationLabel || '').toLowerCase();
    return plan.includes(query) || proj.includes(query) || label.includes(query);
  });

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 transition-opacity"
          onClick={onClose}
        />
      )}
      
      {/* 3D Sidebar Drawer */}
      <div className={`fixed top-0 right-0 h-full w-full sm:w-[420px] bg-white border-l-4 border-slate-900 z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'} flex flex-col shadow-[-10px_0px_0px_rgba(15,23,42,0.15)]`}>
        {/* Header */}
        <div className="p-5 border-b-2 border-slate-900 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-600 border-2 border-slate-900 text-white shadow-[2px_2px_0px_#0f172a]">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">Audit History</h3>
              <p className="text-xs text-slate-500 font-medium">{history.length} saved project evaluations</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-700 hover:text-slate-950 hover:bg-slate-200 rounded-lg transition-colors border border-slate-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        {history.length > 0 && (
          <div className="p-4 border-b-2 border-slate-200 bg-white">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search past audits..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border-2 border-slate-900 rounded-xl text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:border-indigo-600 shadow-[2px_2px_0px_#0f172a]"
              />
            </div>
          </div>
        )}
        
        {/* List of Audits */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 custom-scrollbar">
          {history.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="w-14 h-14 rounded-2xl border-2 border-slate-900 bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3 shadow-[3px_3px_0px_#0f172a]">
                <FileText className="w-7 h-7" />
              </div>
              <h4 className="text-sm font-black text-slate-900 mb-1">No Audits Saved Yet</h4>
              <p className="text-xs text-slate-500 font-medium max-w-xs mx-auto">
                Once you audit a plan, its Reality Score and failure breakdown will be saved here automatically.
              </p>
            </div>
          ) : filteredHistory.length === 0 ? (
            <div className="text-center py-12 text-xs text-slate-500 font-bold">
              No audits matched your search.
            </div>
          ) : (
            filteredHistory.map((item) => {
              const score = item.result.reality_score;
              const badgeStyle =
                score >= 75
                  ? 'bg-emerald-300 text-slate-950 border-slate-900'
                  : score >= 40
                  ? 'bg-amber-300 text-slate-950 border-slate-900'
                  : 'bg-rose-300 text-slate-950 border-slate-900';

              return (
                <div
                  key={item.id}
                  className="group relative bg-white border-2 border-slate-900 hover:border-indigo-600 rounded-xl p-4 transition-all cursor-pointer shadow-[3px_3px_0px_#0f172a] hover:shadow-[5px_5px_0px_#0f172a] hover:-translate-y-0.5"
                  onClick={() => onSelect(item)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                      {item.variationLabel && (
                        <span className="font-black px-2 py-0.5 rounded bg-indigo-100 text-slate-950 border border-slate-900 text-[10px]">
                          {item.variationLabel}
                        </span>
                      )}
                      <span>
                        {new Date(item.timestamp).toLocaleDateString()} {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <button 
                      onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}
                      className="text-slate-400 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                      title="Delete audit"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {item.userInput.projectName && (
                    <div className="text-xs font-black text-slate-900 mb-1">
                      {item.userInput.projectName}
                    </div>
                  )}

                  <h3 className="text-xs text-slate-700 font-medium line-clamp-2 leading-relaxed mb-3">
                    {item.userInput.plan}
                  </h3>

                  <div className="flex items-center justify-between pt-2.5 border-t border-slate-200">
                    <span className={`text-[11px] px-2.5 py-0.5 rounded-md font-black border ${badgeStyle}`}>
                      Reality Score: {score}
                    </span>
                    <span className="text-xs font-black text-indigo-700 flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                      View <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
        
        {/* Footer */}
        {history.length > 0 && (
          <div className="p-4 border-t-2 border-slate-900 bg-slate-50">
            <button 
              onClick={onClear}
              className="neo-3d-btn w-full py-2.5 flex items-center justify-center gap-2 text-xs font-black text-rose-700 bg-white hover:bg-rose-50 rounded-xl transition-all"
            >
              <Trash2 className="w-4 h-4" />
              Clear All Audit History
            </button>
          </div>
        )}
      </div>
    </>
  );
};
