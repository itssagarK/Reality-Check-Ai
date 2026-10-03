import React, { useState, useEffect } from 'react';
import { UserInput } from '../types';
import { X, Loader2, PlayCircle, GitFork, Plus, SlidersHorizontal } from 'lucide-react';

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
      techStack: baseInput.techStack,
      targetPlatform: baseInput.targetPlatform,
      targetScale: baseInput.targetScale,
      variationLabel: variationLabel.trim() || `Iteration ${iterationNumber}`
    });
  };

  const handleQuickAdd = (type: 'timeline' | 'scope' | 'resources' | 'validation') => {
    if (type === 'timeline') {
      const extra = 'Extended timeline by +60 days for validation and buffer.';
      setConstraints((prev) => (prev ? `${prev}, ${extra}` : extra));
    } else if (type === 'scope') {
      const extra = 'Narrowed MVP scope to 1 core problem/feature, cut secondary dependencies.';
      setPlan((prev) => `${prev}\n\n[Variation Adjustment: ${extra}]`);
    } else if (type === 'resources') {
      const extra = 'Allocated ₹1,00,000 runway buffer + outsourced landing page design.';
      setResources((prev) => (prev ? `${prev}, ${extra}` : extra));
    } else if (type === 'validation') {
      const extra = 'Targeting 15 qualitative user discovery calls and pre-orders before building.';
      setEvidence((prev) => (prev ? `${prev}\n${extra}` : extra));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm no-print">
      <div
        className="relative w-full max-w-xl bg-white/95 backdrop-blur-xl border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
              <GitFork className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-serif font-bold text-slate-900">
                Test De-scoped Iteration #{iterationNumber}
              </h3>
              <p className="text-xs text-slate-500">
                Modify variables to simulate how your feasibility score increases
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto flex-1 custom-scrollbar">
          
          {/* Quick-Tweak Presets */}
          <div className="p-3 bg-blue-50/60 rounded-2xl border border-blue-100 space-y-1.5">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-blue-900 uppercase tracking-wider">
              <SlidersHorizontal className="w-3 h-3 text-blue-600" />
              1-Click De-scoping Levers:
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              <button
                type="button"
                onClick={() => handleQuickAdd('scope')}
                className="px-2.5 py-1 rounded-xl bg-white border border-blue-200 text-xs font-semibold text-blue-700 hover:bg-blue-600 hover:text-white transition-all shadow-xs flex items-center gap-1"
              >
                <Plus className="w-3 h-3" /> Cut Scope to 1 Core Loop
              </button>
              <button
                type="button"
                onClick={() => handleQuickAdd('timeline')}
                className="px-2.5 py-1 rounded-xl bg-white border border-blue-200 text-xs font-semibold text-blue-700 hover:bg-blue-600 hover:text-white transition-all shadow-xs flex items-center gap-1"
              >
                <Plus className="w-3 h-3" /> +60 Days Buffer
              </button>
              <button
                type="button"
                onClick={() => handleQuickAdd('resources')}
                className="px-2.5 py-1 rounded-xl bg-white border border-blue-200 text-xs font-semibold text-blue-700 hover:bg-blue-600 hover:text-white transition-all shadow-xs flex items-center gap-1"
              >
                <Plus className="w-3 h-3" /> Add ₹1 Lakh Runway
              </button>
              <button
                type="button"
                onClick={() => handleQuickAdd('validation')}
                className="px-2.5 py-1 rounded-xl bg-white border border-blue-200 text-xs font-semibold text-blue-700 hover:bg-blue-600 hover:text-white transition-all shadow-xs flex items-center gap-1"
              >
                <Plus className="w-3 h-3" /> Add Discovery Target
              </button>
            </div>
          </div>

          {/* Iteration Label */}
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-700">
              Iteration Name / Hypothesis
            </label>
            <input
              type="text"
              value={variationLabel}
              onChange={(e) => setVariationLabel(e.target.value)}
              placeholder="e.g. v2 - Strict MVP Single Core Feature"
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Plan Description */}
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-700">
              Adjusted Plan Scope
            </label>
            <textarea
              rows={4}
              value={plan}
              onChange={(e) => setPlan(e.target.value)}
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-blue-500 resize-none"
            />
          </div>

          {/* Constraints & Resources */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700">
                Timeline Constraints
              </label>
              <input
                type="text"
                value={constraints}
                onChange={(e) => setConstraints(e.target.value)}
                className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700">
                Budget & Skills
              </label>
              <input
                type="text"
                value={resources}
                onChange={(e) => setResources(e.target.value)}
                className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Validation */}
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-700">
              Market Validation / Proof of Concept
            </label>
            <textarea
              rows={2}
              value={evidence}
              onChange={(e) => setEvidence(e.target.value)}
              className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-blue-500 resize-none"
            />
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !plan.trim()}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-md shadow-blue-500/25 flex items-center gap-1.5"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Auditing Variation...</span>
                </>
              ) : (
                <>
                  <PlayCircle className="w-3.5 h-3.5" />
                  <span>Run Iteration #{iterationNumber}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
