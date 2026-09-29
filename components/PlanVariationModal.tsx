import React, { useState, useEffect } from 'react';
import { UserInput } from '../types';
import { X, Sparkles, Loader2, PlayCircle, GitFork, Plus, SlidersHorizontal } from 'lucide-react';

interface PlanVariationModalProps {
  isOpen: boolean;
  onClose: () => void;
  baseInput: UserInput | null;
  onSubmitVariation: (variationInput: UserInput) => Promise<void>;
  isLoading: boolean;
  iterationNumber: number;
}

export const PlanVariationModal: React.FC<PlanVariationModalProps> = ({
  isOpen,
  onClose,
  baseInput,
  onSubmitVariation,
  isLoading,
  iterationNumber
}) => {
  const [variationLabel, setVariationLabel] = useState('');
  const [plan, setPlan] = useState('');
  const [constraints, setConstraints] = useState('');
  const [resources, setResources] = useState('');
  const [evidence, setEvidence] = useState('');

  useEffect(() => {
    if (baseInput) {
      setPlan(baseInput.plan || '');
      setConstraints(baseInput.constraints || '');
      setResources(baseInput.resources || '');
      setEvidence(baseInput.evidence || '');
      setVariationLabel(`v${iterationNumber} - `);
    }
  }, [baseInput, iterationNumber, isOpen]);

  if (!isOpen || !baseInput) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!plan.trim() || isLoading) return;

    await onSubmitVariation({
      plan,
      constraints,
      resources,
      evidence,
      projectId: baseInput.projectId,
      projectName: baseInput.projectName,
      variationLabel: variationLabel.trim() || `Iteration ${iterationNumber}`
    });
  };

  // Quick preset helper functions
  const handleQuickAdd = (type: 'timeline' | 'scope' | 'resources' | 'validation') => {
    if (type === 'timeline') {
      const extra = 'Extended timeline by +60 days for validation and buffer.';
      setConstraints((prev) => (prev ? `${prev}, ${extra}` : extra));
    } else if (type === 'scope') {
      const extra = 'Narrowed MVP scope to 1 core problem/feature, cut secondary dependencies.';
      setPlan((prev) => `${prev}\n\n[Variation Adjustment: ${extra}]`);
    } else if (type === 'resources') {
      const extra = 'Allocated $1,500 runway buffer + outsourced landing page design.';
      setResources((prev) => (prev ? `${prev}, ${extra}` : extra));
    } else if (type === 'validation') {
      const extra = 'Targeting 15 qualitative user discovery calls and pre-orders before building.';
      setEvidence((prev) => (prev ? `${prev}\n${extra}` : extra));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <GitFork className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                New Plan Variation
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-bold border border-indigo-200">
                  Iteration {iterationNumber}
                </span>
              </h3>
              <p className="text-xs text-slate-500">
                Adjust key constraints to test how your Reality Score trajectory responds
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
          {/* Quick Adjustment Shortcuts */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-2">
              <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-600" />
              1-Click Feasibility Levers
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleQuickAdd('timeline')}
                className="text-xs px-2.5 py-1 rounded-lg bg-white hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-200 hover:border-indigo-300 transition-colors flex items-center gap-1 font-medium shadow-xs"
              >
                <Plus className="w-3 h-3 text-indigo-600" /> +60 Days Buffer
              </button>
              <button
                type="button"
                onClick={() => handleQuickAdd('scope')}
                className="text-xs px-2.5 py-1 rounded-lg bg-white hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-200 hover:border-indigo-300 transition-colors flex items-center gap-1 font-medium shadow-xs"
              >
                <Plus className="w-3 h-3 text-indigo-600" /> Cut MVP Scope 50%
              </button>
              <button
                type="button"
                onClick={() => handleQuickAdd('resources')}
                className="text-xs px-2.5 py-1 rounded-lg bg-white hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-200 hover:border-indigo-300 transition-colors flex items-center gap-1 font-medium shadow-xs"
              >
                <Plus className="w-3 h-3 text-indigo-600" /> +$1,500 Runway
              </button>
              <button
                type="button"
                onClick={() => handleQuickAdd('validation')}
                className="text-xs px-2.5 py-1 rounded-lg bg-white hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-200 hover:border-indigo-300 transition-colors flex items-center gap-1 font-medium shadow-xs"
              >
                <Plus className="w-3 h-3 text-indigo-600" /> Pre-Validate Demand
              </button>
            </div>
          </div>

          {/* Variation Label */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
              Variation Label / Hypothesis
            </label>
            <input
              type="text"
              value={variationLabel}
              onChange={(e) => setVariationLabel(e.target.value)}
              placeholder={`e.g. v${iterationNumber} - Extended timeline to 90 days`}
              className="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 rounded-xl p-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all"
            />
          </div>

          {/* Plan Textarea */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
              Plan Description <span className="text-rose-500">*</span>
            </label>
            <textarea
              required
              rows={4}
              value={plan}
              onChange={(e) => setPlan(e.target.value)}
              className="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 rounded-xl p-3 text-sm text-slate-900 placeholder-slate-400 outline-none resize-none transition-all"
              placeholder="Refine the plan details..."
            />
          </div>

          {/* Constraints & Resources */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                Time Constraints
              </label>
              <input
                type="text"
                value={constraints}
                onChange={(e) => setConstraints(e.target.value)}
                className="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 rounded-xl p-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all"
                placeholder="e.g. 10 hrs/week, 90-day horizon"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                Budget & Skills
              </label>
              <input
                type="text"
                value={resources}
                onChange={(e) => setResources(e.target.value)}
                className="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 rounded-xl p-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all"
                placeholder="e.g. $2k budget, no-code stack"
              />
            </div>
          </div>

          {/* Supporting Evidence */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
              Supporting Validation Data
            </label>
            <textarea
              rows={2}
              value={evidence}
              onChange={(e) => setEvidence(e.target.value)}
              className="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 rounded-xl p-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none resize-none transition-all"
              placeholder="e.g. Survey responses from 20 leads, competitor pricing benchmark..."
            />
          </div>

          {/* Footer Submit */}
          <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isLoading || !plan.trim()}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-md ${
                isLoading || !plan.trim()
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300'
                  : 'bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white shadow-indigo-100'
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Auditing Variation...
                </>
              ) : (
                <>
                  <PlayCircle className="w-4 h-4" />
                  Audit & Plot Variation
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
