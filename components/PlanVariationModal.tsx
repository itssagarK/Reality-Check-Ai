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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl bg-white border-3 border-slate-900 rounded-2xl shadow-[10px_10px_0px_#0f172a] overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b-2 border-slate-900 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-600 border-2 border-slate-900 text-white shadow-[2px_2px_0px_#0f172a]">
              <GitFork className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                New Plan Variation
                <span className="text-xs px-2.5 py-0.5 rounded-lg bg-indigo-100 text-slate-900 font-black border-2 border-slate-900 shadow-[1px_1px_0px_#0f172a]">
                  Iteration {iterationNumber}
                </span>
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Adjust key constraints to test how your Reality Score trajectory responds
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-1.5 text-slate-600 hover:text-slate-950 hover:bg-slate-200 rounded-lg transition-colors border border-slate-300 disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
          {/* Quick Adjustment Shortcuts */}
          <div className="bg-slate-50 p-4 rounded-xl border-2 border-slate-900 shadow-[3px_3px_0px_#0f172a]">
            <div className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest text-slate-900 mb-2.5">
              <SlidersHorizontal className="w-4 h-4 text-indigo-600" />
              1-Click Feasibility Levers
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleQuickAdd('timeline')}
                className="neo-3d-btn text-xs px-3 py-1.5 rounded-lg bg-white hover:bg-indigo-50 text-slate-900 flex items-center gap-1 font-bold"
              >
                <Plus className="w-3.5 h-3.5 text-indigo-600" /> +60 Days Buffer
              </button>
              <button
                type="button"
                onClick={() => handleQuickAdd('scope')}
                className="neo-3d-btn text-xs px-3 py-1.5 rounded-lg bg-white hover:bg-indigo-50 text-slate-900 flex items-center gap-1 font-bold"
              >
                <Plus className="w-3.5 h-3.5 text-indigo-600" /> Cut MVP Scope 50%
              </button>
              <button
                type="button"
                onClick={() => handleQuickAdd('resources')}
                className="neo-3d-btn text-xs px-3 py-1.5 rounded-lg bg-white hover:bg-indigo-50 text-slate-900 flex items-center gap-1 font-bold"
              >
                <Plus className="w-3.5 h-3.5 text-indigo-600" /> +$1,500 Runway
              </button>
              <button
                type="button"
                onClick={() => handleQuickAdd('validation')}
                className="neo-3d-btn text-xs px-3 py-1.5 rounded-lg bg-white hover:bg-indigo-50 text-slate-900 flex items-center gap-1 font-bold"
              >
                <Plus className="w-3.5 h-3.5 text-indigo-600" /> Pre-Validate Demand
              </button>
            </div>
          </div>

          {/* Variation Label */}
          <div className="space-y-1.5">
            <label className="block text-xs font-black text-slate-900 uppercase tracking-wider">
              Variation Label / Hypothesis
            </label>
            <input
              type="text"
              value={variationLabel}
              onChange={(e) => setVariationLabel(e.target.value)}
              placeholder={`e.g. v${iterationNumber} - Extended timeline to 90 days`}
              className="w-full bg-slate-50 hover:bg-white focus:bg-white border-2 border-slate-900 focus:border-indigo-600 focus:shadow-[3px_3px_0px_#4f46e5] rounded-xl p-3 text-sm text-slate-900 font-medium placeholder-slate-400 outline-none transition-all shadow-[2px_2px_0px_#0f172a]"
            />
          </div>

          {/* Plan Textarea */}
          <div className="space-y-1.5">
            <label className="block text-xs font-black text-slate-900 uppercase tracking-wider">
              Plan Description <span className="text-rose-600">*</span>
            </label>
            <textarea
              required
              rows={4}
              value={plan}
              onChange={(e) => setPlan(e.target.value)}
              className="w-full bg-slate-50 hover:bg-white focus:bg-white border-2 border-slate-900 focus:border-indigo-600 focus:shadow-[3px_3px_0px_#4f46e5] rounded-xl p-3 text-sm text-slate-900 font-medium placeholder-slate-400 outline-none resize-none transition-all shadow-[2px_2px_0px_#0f172a]"
              placeholder="Refine the plan details..."
            />
          </div>

          {/* Constraints & Resources */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-xs font-black text-slate-900 uppercase tracking-wider">
                Time Constraints
              </label>
              <input
                type="text"
                value={constraints}
                onChange={(e) => setConstraints(e.target.value)}
                className="w-full bg-slate-50 hover:bg-white focus:bg-white border-2 border-slate-900 focus:border-indigo-600 focus:shadow-[3px_3px_0px_#4f46e5] rounded-xl p-3 text-sm text-slate-900 font-medium placeholder-slate-400 outline-none transition-all shadow-[2px_2px_0px_#0f172a]"
                placeholder="e.g. 10 hrs/week, 90-day horizon"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-black text-slate-900 uppercase tracking-wider">
                Budget & Skills
              </label>
              <input
                type="text"
                value={resources}
                onChange={(e) => setResources(e.target.value)}
                className="w-full bg-slate-50 hover:bg-white focus:bg-white border-2 border-slate-900 focus:border-indigo-600 focus:shadow-[3px_3px_0px_#4f46e5] rounded-xl p-3 text-sm text-slate-900 font-medium placeholder-slate-400 outline-none transition-all shadow-[2px_2px_0px_#0f172a]"
                placeholder="e.g. $2k budget, no-code stack"
              />
            </div>
          </div>

          {/* Supporting Evidence */}
          <div className="space-y-1.5">
            <label className="block text-xs font-black text-slate-900 uppercase tracking-wider">
              Supporting Validation Data
            </label>
            <textarea
              rows={2}
              value={evidence}
              onChange={(e) => setEvidence(e.target.value)}
              className="w-full bg-slate-50 hover:bg-white focus:bg-white border-2 border-slate-900 focus:border-indigo-600 focus:shadow-[3px_3px_0px_#4f46e5] rounded-xl p-3 text-sm text-slate-900 font-medium placeholder-slate-400 outline-none resize-none transition-all shadow-[2px_2px_0px_#0f172a]"
              placeholder="e.g. Survey responses from 20 leads, competitor pricing benchmark..."
            />
          </div>

          {/* Footer Submit */}
          <div className="pt-3 flex items-center justify-end gap-3 border-t-2 border-slate-200">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2.5 rounded-xl text-xs font-black text-slate-700 hover:text-slate-950 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isLoading || !plan.trim()}
              className={`px-5 py-3 rounded-xl font-black text-xs flex items-center gap-2 transition-all ${
                isLoading || !plan.trim()
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed border-2 border-slate-400'
                  : 'neo-3d-btn-primary'
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
