import React, { useState, useEffect } from 'react';
import { UserInput } from '../types';
import { PlayCircle, ShieldAlert, Loader2, Wand2, RotateCcw, ArrowRight, CornerDownLeft, Sparkles, CheckCircle2 } from 'lucide-react';

interface InputFormProps {
  onSubmit: (data: UserInput) => void;
  isLoading: boolean;
  initialValues?: UserInput | null;
}

interface PlanPreset {
  title: string;
  badge: string;
  projectName: string;
  plan: string;
  constraints: string;
  resources: string;
  evidence: string;
}

const PRESETS: PlanPreset[] = [
  {
    title: "Solo Micro-SaaS",
    badge: "Fast Launch",
    projectName: "AI Feedback Widget",
    plan: "Build and launch a lightweight customer feedback widget for indie software builders. Reach $1k MRR within 60 days by cold emailing 100 Shopify/Webflow creators.",
    constraints: "2 hours per day on weekday evenings, full-time job",
    resources: "$300 budget, intermediate TypeScript/React, no existing audience",
    evidence: "3 active Reddit threads asking for simpler, cheaper alternatives to Canny; competitors charge $79/mo minimum."
  },
  {
    title: "Mobile App MVP",
    badge: "Consumer",
    projectName: "Calorie Scanner App",
    plan: "Develop an iOS & Android AI food photo calorie tracker. Launch with in-app subscription and acquire 500 active weekly users in 3 months via TikTok organic videos.",
    constraints: "15 hours per week, launching on Apple App Store & Google Play",
    resources: "$1,200 savings for Apple Developer fee + API costs, Flutter knowledge",
    evidence: "Top 3 competitors have 4.6+ star ratings and high search volume for 'fast photo calorie tracker' on App Store."
  },
  {
    title: "Freelance to Agency",
    badge: "Service Scale",
    projectName: "Workflow Automation Studio",
    plan: "Transition from solo web designer to a 3-person automation agency specializing in Make.com and Zapier setups. Sign 4 recurring retainer clients at $2,500/mo.",
    constraints: "40 hours/week, working alone initially before hiring first contractor",
    resources: "3 previous client case studies, $2,000 working capital, strong portfolio",
    evidence: "2 existing clients expressed interest in continuing monthly automation maintenance."
  },
  {
    title: "E-Commerce Brand",
    badge: "Physical",
    projectName: "Cold Brew Pods D2C",
    plan: "Manufacture and sell biodegradable single-serve cold brew pods directly through Shopify. Achieve 150 first orders in the first 45 days using Instagram ad tests.",
    constraints: "Weekends only, 10 hours/week, reliance on overseas supplier delivery",
    resources: "$2,500 inventory capital, basic Shopify setup skills",
    evidence: "Sample batch produced positive taste ratings from 25 local survey testers."
  }
];

export const InputForm: React.FC<InputFormProps> = ({ onSubmit, isLoading, initialValues }) => {
  const [projectName, setProjectName] = useState(initialValues?.projectName || '');
  const [plan, setPlan] = useState(initialValues?.plan || '');
  const [constraints, setConstraints] = useState(initialValues?.constraints || '');
  const [resources, setResources] = useState(initialValues?.resources || '');
  const [evidence, setEvidence] = useState(initialValues?.evidence || '');
  const [activePresetIndex, setActivePresetIndex] = useState<number | null>(null);

  useEffect(() => {
    if (initialValues) {
      setProjectName(initialValues.projectName || '');
      setPlan(initialValues.plan || '');
      setConstraints(initialValues.constraints || '');
      setResources(initialValues.resources || '');
      setEvidence(initialValues.evidence || '');
    }
  }, [initialValues]);

  const handleApplyPreset = (preset: PlanPreset, idx: number) => {
    setProjectName(preset.projectName);
    setPlan(preset.plan);
    setConstraints(preset.constraints);
    setResources(preset.resources);
    setEvidence(preset.evidence);
    setActivePresetIndex(idx);
  };

  const handleClear = () => {
    setProjectName('');
    setPlan('');
    setConstraints('');
    setResources('');
    setEvidence('');
    setActivePresetIndex(null);
  };

  const triggerSubmit = () => {
    if (!plan.trim() || isLoading) return;
    onSubmit({
      plan: plan.trim(),
      constraints: constraints.trim(),
      resources: resources.trim(),
      evidence: evidence.trim(),
      projectName: projectName.trim() || undefined,
      projectId: initialValues?.projectId
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    triggerSubmit();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      triggerSubmit();
    }
  };

  const isFormValid = plan.trim().length > 10;

  return (
    <div className="w-full max-w-3xl mx-auto space-y-4 animate-pop-in" onKeyDown={handleKeyDown}>
      
      {/* 3D Interactive Quick-Fill Presets Console */}
      <div className="bg-white rounded-2xl border-3 border-slate-900 p-4 sm:p-5 shadow-[5px_5px_0px_#0f172a]">
        <div className="flex items-center justify-between gap-2 mb-3 pb-2 border-b-2 border-slate-200">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-600 text-white border border-slate-900 shadow-[1px_1px_0px_#0f172a]">
              <Wand2 className="w-4 h-4" />
            </span>
            <span className="text-xs font-black text-slate-900 uppercase tracking-widest">
              1-Click Plan Ideas
            </span>
            <span className="text-xs text-slate-500 font-medium hidden sm:inline">
              · Try a pre-configured plan to see how the engine works
            </span>
          </div>
          {(plan || projectName) && (
            <button
              type="button"
              onClick={handleClear}
              className="text-xs text-slate-700 hover:text-rose-600 font-black flex items-center gap-1 transition-colors px-2 py-0.5 rounded border border-slate-300 hover:border-rose-400 bg-slate-50"
            >
              <RotateCcw className="w-3 h-3" />
              Reset fields
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {PRESETS.map((preset, idx) => {
            const isSelected = activePresetIndex === idx;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleApplyPreset(preset, idx)}
                className={`p-3 rounded-xl text-left border-2 transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-indigo-600 border-slate-900 text-white shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] translate-y-0.5'
                    : 'bg-white hover:bg-slate-50 border-slate-900 text-slate-900 shadow-[3px_3px_0px_#0f172a] hover:shadow-[4px_4px_0px_#0f172a] hover:-translate-y-0.5 active:translate-y-0.5'
                }`}
              >
                <div>
                  <span className={`text-[10px] font-black uppercase tracking-wider block mb-1 ${isSelected ? 'text-indigo-200' : 'text-indigo-600'}`}>
                    {preset.badge}
                  </span>
                  <span className="text-xs font-black block truncate">
                    {preset.title}
                  </span>
                </div>
                <span className={`text-[11px] truncate mt-1.5 font-medium ${isSelected ? 'text-indigo-100' : 'text-slate-500'}`}>
                  {preset.projectName}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main 3D Input Form Card */}
      <div className="bg-white rounded-2xl border-3 border-slate-900 p-6 sm:p-7 shadow-[6px_6px_0px_#0f172a]">
        <div className="flex items-center justify-between pb-4 mb-5 border-b-2 border-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-600 border-2 border-slate-900 rounded-xl text-white shadow-[2px_2px_0px_#0f172a]">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Plan Feasibility Auditor</h2>
              <p className="text-xs text-slate-500 font-medium">Input your goals and real limits so the AI can simulate failure points</p>
            </div>
          </div>
          <span className="text-[11px] font-black text-slate-900 bg-indigo-100 border-2 border-slate-900 px-3 py-1 rounded-lg shadow-[2px_2px_0px_#0f172a] hidden sm:inline-block">
            Gemini Engine
          </span>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Project Name */}
          <div className="space-y-1.5">
            <label htmlFor="projectName" className="block text-xs font-black text-slate-900 uppercase tracking-wider">
              Project Name <span className="font-semibold text-slate-400 lowercase">(optional)</span>
            </label>
            <input
              type="text"
              id="projectName"
              className="w-full bg-slate-50 hover:bg-white focus:bg-white border-2 border-slate-900 focus:border-indigo-600 focus:shadow-[3px_3px_0px_#4f46e5] rounded-xl p-3 text-sm text-slate-900 font-medium placeholder-slate-400 outline-none transition-all shadow-[2px_2px_0px_#0f172a]"
              placeholder="e.g. AI Fitness Coach App, Micro-SaaS Launch..."
              value={projectName}
              onChange={(e) => {
                setProjectName(e.target.value);
                setActivePresetIndex(null);
              }}
            />
          </div>

          {/* The Plan */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="plan" className="block text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                The Plan Description <span className="text-rose-600">*</span>
                {plan.trim().length > 10 && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 inline" />
                )}
              </label>
              <span className="text-xs font-bold text-slate-400">
                {plan.length} chars
              </span>
            </div>
            <textarea
              id="plan"
              required
              rows={4}
              className="w-full bg-slate-50 hover:bg-white focus:bg-white border-2 border-slate-900 focus:border-indigo-600 focus:shadow-[3px_3px_0px_#4f46e5] rounded-xl p-3.5 text-sm text-slate-900 font-medium placeholder-slate-400 outline-none transition-all resize-none shadow-[2px_2px_0px_#0f172a]"
              placeholder="Be specific. E.g., 'I want to build a SaaS app in 2 months and acquire 100 paying customers through cold outreach...'"
              value={plan}
              onChange={(e) => {
                setPlan(e.target.value);
                setActivePresetIndex(null);
              }}
            />
          </div>

          {/* Time & Resources Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="constraints" className="block text-xs font-black text-slate-900 uppercase tracking-wider">
                Time Constraints
              </label>
              <input
                type="text"
                id="constraints"
                className="w-full bg-slate-50 hover:bg-white focus:bg-white border-2 border-slate-900 focus:border-indigo-600 focus:shadow-[3px_3px_0px_#4f46e5] rounded-xl p-3 text-sm text-slate-900 font-medium placeholder-slate-400 outline-none transition-all shadow-[2px_2px_0px_#0f172a]"
                placeholder="e.g. 2 hours/day, full-time job..."
                value={constraints}
                onChange={(e) => setConstraints(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="resources" className="block text-xs font-black text-slate-900 uppercase tracking-wider">
                Budget & Skills
              </label>
              <input
                type="text"
                id="resources"
                className="w-full bg-slate-50 hover:bg-white focus:bg-white border-2 border-slate-900 focus:border-indigo-600 focus:shadow-[3px_3px_0px_#4f46e5] rounded-xl p-3 text-sm text-slate-900 font-medium placeholder-slate-400 outline-none transition-all shadow-[2px_2px_0px_#0f172a]"
                placeholder="e.g. $500 budget, Junior React dev..."
                value={resources}
                onChange={(e) => setResources(e.target.value)}
              />
            </div>
          </div>

          {/* Supporting Evidence */}
          <div className="space-y-1.5">
            <label htmlFor="evidence" className="block text-xs font-black text-slate-900 uppercase tracking-wider">
              Supporting Validation & Data <span className="font-semibold text-slate-400 lowercase">(optional)</span>
            </label>
            <textarea
              id="evidence"
              rows={2}
              className="w-full bg-slate-50 hover:bg-white focus:bg-white border-2 border-slate-900 focus:border-indigo-600 focus:shadow-[3px_3px_0px_#4f46e5] rounded-xl p-3 text-sm text-slate-900 font-medium placeholder-slate-400 outline-none transition-all resize-none shadow-[2px_2px_0px_#0f172a]"
              placeholder="e.g. Pre-orders, customer interview notes, competitor pricing, or past project metrics..."
              value={evidence}
              onChange={(e) => setEvidence(e.target.value)}
            />
          </div>

          {/* Heavy 3D Mechanical Action Button with Shortcut Hint */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading || !isFormValid}
              className={`w-full py-4 rounded-xl font-black text-base flex items-center justify-center gap-3 transition-all duration-150 ${
                isLoading || !isFormValid
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed border-2 border-slate-400'
                  : 'neo-3d-btn-primary active:scale-[0.99]'
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Auditing Feasibility & Simulating Risks...</span>
                </>
              ) : (
                <>
                  <PlayCircle className="w-6 h-6" />
                  <span className="uppercase tracking-wider">Execute Reality Check</span>
                  <div className="hidden sm:flex items-center gap-0.5 text-xs px-2 py-0.5 bg-black/20 rounded border border-white/20 font-mono ml-1">
                    <span>⌘</span>
                    <CornerDownLeft className="w-3 h-3" />
                  </div>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
