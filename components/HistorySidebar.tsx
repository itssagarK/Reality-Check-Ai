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
          className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs z-50 transition-opacity no-print"
          onClick={onClose}
        />
      )}
      
      {/* Glassmorphic Sidebar Drawer */}
      <div className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white/95 backdrop-blur-xl border-l border-slate-200 z-50 transform transition-transform duration-200 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'} flex flex-col shadow-2xl no-print`}>
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-600" />
            <div>
              <h3 className="text-sm font-serif font-bold text-slate-900">Audit Archive</h3>
              <p className="text-[11px] text-slate-500">{history.length} saved evaluations</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search Bar */}
        {history.length > 0 && (
          <div className="p-3 border-b border-slate-200 bg-slate-50/60">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search past audits..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>
        )}
        
        {/* List of Audits */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
          {history.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-2 border border-slate-200">
                <FileText className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-serif font-bold text-slate-900 mb-0.5">No Audits Saved Yet</h4>
              <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
                Audits you execute will automatically archive here.
              </p>
            </div>
          ) : filteredHistory.length === 0 ? (
            <div className="text-center py-10 text-xs text-slate-400">
              No audits matched your search.
            </div>
          ) : (
            filteredHistory.map((item) => {
              const score = item.result.reality_score;
              const badgeStyle =
                score >= 75
                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                  : score >= 40
                  ? 'bg-amber-50 text-amber-800 border-amber-200'
                  : 'bg-red-50 text-red-700 border-red-200';

              return (
                <div
                  key={item.id}
                  className="group relative bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl p-3.5 transition-all cursor-pointer shadow-xs"
                  onClick={() => onSelect(item)}
                >
                  <div className="flex justify-between items-start mb-1">
                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                      {item.variationLabel && (
                        <span className="font-semibold px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px]">
                          {item.variationLabel}
                        </span>
                      )}
                      <span className="text-[10px] font-mono">
                        {new Date(item.timestamp).toLocaleDateString()}
                      </span>
                    </div>

                    <button 
                      onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}
                      className="text-slate-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity p-0.5"
                      title="Delete audit"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {item.userInput.projectName && (
                    <div className="text-xs font-serif font-bold text-slate-900 mb-0.5">
                      {item.userInput.projectName}
                    </div>
                  )}

                  <h3 className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-2">
                    {item.userInput.plan}
                  </h3>

                  <div className="flex items-center justify-between pt-1.5 border-t border-slate-100">
                    <span className={`text-[10px] px-2 py-0.2 rounded-md font-mono font-bold border ${badgeStyle}`}>
                      Score: {score}
                    </span>
                    <span className="text-[11px] font-medium text-slate-600 flex items-center gap-0.5 group-hover:text-blue-600 transition-colors">
                      View Report
                      <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {history.length > 0 && (
          <div className="p-3 border-t border-slate-200 bg-slate-50/60 flex items-center justify-between">
            <span className="text-[11px] text-slate-500 font-mono">
              {history.length} {history.length === 1 ? 'audit' : 'audits'} stored locally
            </span>
            <button
              onClick={onClear}
              className="text-xs text-red-600 hover:text-red-700 font-semibold px-2.5 py-1 rounded-lg hover:bg-red-50 transition-colors"
            >
              Clear Archive
            </button>
          </div>
        )}
      </div>
    </>
  );
};
