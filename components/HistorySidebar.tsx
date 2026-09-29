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
          className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs z-50 transition-opacity"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar Drawer */}
      <div className={`fixed top-0 right-0 h-full w-full sm:w-[420px] bg-white border-l border-slate-200 z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'} flex flex-col shadow-2xl`}>
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Audit History</h3>
              <p className="text-xs text-slate-500">{history.length} saved project evaluations</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        {history.length > 0 && (
          <div className="p-4 border-b border-slate-100 bg-slate-50/50">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search past audits..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
          </div>
        )}
        
        {/* List of Audits */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
          {history.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                <FileText className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-700 mb-1">No Audits Saved Yet</h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Once you audit a plan, its Reality Score and failure breakdown will be saved here automatically.
              </p>
            </div>
          ) : filteredHistory.length === 0 ? (
            <div className="text-center py-12 text-xs text-slate-500">
              No audits matched your search.
            </div>
          ) : (
            filteredHistory.map((item) => {
              const score = item.result.reality_score;
              const badgeStyle =
                score >= 75
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                  : score >= 40
                  ? 'bg-amber-100 text-amber-800 border-amber-300'
                  : 'bg-rose-100 text-rose-800 border-rose-300';

              return (
                <div
                  key={item.id}
                  className="group relative bg-white hover:bg-indigo-50/30 border border-slate-200 hover:border-indigo-300 rounded-xl p-4 transition-all cursor-pointer shadow-xs hover:shadow-sm"
                  onClick={() => onSelect(item)}
                >
                  <div className="flex justify-between items-start mb-1.5">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      {item.variationLabel && (
                        <span className="font-bold px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200 text-[10px]">
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
                    <div className="text-xs font-bold text-slate-900 mb-1">
                      {item.userInput.projectName}
                    </div>
                  )}

                  <h3 className="text-xs text-slate-700 line-clamp-2 leading-relaxed mb-3">
                    {item.userInput.plan}
                  </h3>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold border ${badgeStyle}`}>
                      Reality Score: {score}
                    </span>
                    <span className="text-xs font-semibold text-indigo-600 flex items-center gap-0.5">
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
          <div className="p-4 border-t border-slate-100 bg-slate-50/50">
            <button 
              onClick={onClear}
              className="w-full py-2.5 flex items-center justify-center gap-2 text-xs font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-colors border border-rose-200"
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
