import React, { useState, useEffect } from 'react';
import { UserInput } from '../types';
import { PlayCircle, ShieldAlert, Loader2, Sparkles, Wand2, RotateCcw, Check, ArrowRight } from 'lucide-react';

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!plan.trim()) return;
    onSubmit({
      plan,
      constraints,
      resources,
      evidence,
      projectName: projectName.trim() || undefined,
      projectId: initialValues?.projectId
    });
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-4">
      
      {/* Interactive Quick-Fill Presets Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-lg bg-indigo-50 text-indigo-600">
              <Wand2 className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              1-Click Plan Ideas
            </span>
            <span className="text-xs text-slate-500 font-normal hidden sm:inline">
              · Try a sample plan instantly
            </span>
          </div>
          {(plan || projectName) && (
            <button
              type="button"
              onClick={handleClear}
              className="text-xs text-slate-500 hover:text-rose-600 flex items-center gap-1 font-medium transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              Reset fields
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {PRESETS.map((preset, idx) => {
            const isSelected = activePresetIndex === idx;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleApplyPreset(preset, idx)}
                className={`p-2.5 rounded-xl text-left border transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-indigo-50/80 border-indigo-500 text-indigo-950 shadow-sm ring-1 ring-indigo-500'
                    : 'bg-slate-50 hover:bg-white border-slate-200 hover:border-indigo-300 text-slate-800 hover:shadow-sm'
                }`}
              >
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 block mb-1">
                    {preset.badge}
                  </span>
                  <span className="text-xs font-bold block truncate text-slate-900">
                    {preset.title}
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 truncate mt-1">
                  {preset.projectName}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Input Form Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-50 rounded-xl text-indigo-600">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Plan Feasibility Auditor</h2>
              <p className="text-xs text-slate-500">Provide your realistic constraints so the AI can simulate failure points</p>
            </div>
          </div>
          <span className="text-[11px] font-medium text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full hidden sm:inline-block">
            Gemini Feasibility Engine
          </span>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Project Name */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="projectName" className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                Project Name <span className="font-normal text-slate-400 lowercase">(optional)</span>
              </label>
            </div>
            <input
              type="text"
              id="projectName"
              className="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 rounded-xl p-3 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all"
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
              <label htmlFor="plan" className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                The Plan Description <span className="text-rose-500">*</span>
              </label>
              <span className="text-xs text-slate-400">Be concrete on goals & timeline</span>
            </div>
            <textarea
              id="plan"
              required
              rows={4}
              className="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 rounded-xl p-3.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all resize-none"
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
              <label htmlFor="constraints" className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                Time Constraints
              </label>
              <input
                type="text"
                id="constraints"
                className="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 rounded-xl p-3 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all"
                placeholder="e.g. 2 hours/day, full-time job..."
                value={constraints}
                onChange={(e) => setConstraints(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="resources" className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                Budget & Skills
              </label>
              <input
                type="text"
                id="resources"
                className="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 rounded-xl p-3 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all"
                placeholder="e.g. $500 budget, Junior React dev..."
                value={resources}
                onChange={(e) => setResources(e.target.value)}
              />
            </div>
          </div>

          {/* Supporting Evidence */}
          <div className="space-y-1.5">
            <label htmlFor="evidence" className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
              Supporting Validation & Data <span className="font-normal text-slate-400 lowercase">(optional)</span>
            </label>
            <textarea
              id="evidence"
              rows={2}
              className="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 rounded-xl p-3 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all resize-none"
              placeholder="e.g. Pre-orders, customer interview notes, competitor pricing, or past project metrics..."
              value={evidence}
              onChange={(e) => setEvidence(e.target.value)}
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading || !plan.trim()}
              className={`w-full py-4 rounded-xl font-bold text-base flex items-center justify-center gap-2.5 transition-all duration-200 shadow-md ${
                isLoading || !plan.trim()
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300'
                  : 'bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white shadow-indigo-200 hover:shadow-indigo-300'
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Auditing Feasibility & Simulating Risks...</span>
                </>
              ) : (
                <>
                  <PlayCircle className="w-5 h-5" />
                  <span>Execute Reality Check</span>
                  <ArrowRight className="w-4 h-4 ml-1 opacity-70" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
