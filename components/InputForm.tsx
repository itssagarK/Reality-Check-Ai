import React, { useState, useEffect } from 'react';
import { UserInput } from '../types';
import { PlayCircle, Loader2, RotateCcw, CornerDownLeft, CheckCircle2, Code2, Globe, Layers, Clock, Wallet, ShieldAlert, IndianRupee, Sparkles, SlidersHorizontal, Check, Server, Zap, ShieldCheck, Minus, ChevronDown } from 'lucide-react';

interface InputFormProps {
  mode: 'reality-check' | 'app-build';
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
  techStack?: string;
  targetPlatform?: string;
  targetScale?: string;
}

const APP_BUILD_PRESETS: PlanPreset[] = [
  {
    title: "Indic AI Voice App",
    badge: "AI & Mobile",
    projectName: "BolBharat: Indic Language Voice Coach",
    plan: "Real-time speech-to-speech AI language coach supporting Hindi, Tamil, Telugu, and English. Low-latency conversational audio streaming with localized feedback and ₹199/month UPI autopay subscription.",
    techStack: "React Native / Expo, FastAPI, Gemini 3 Flash WebSockets, Supabase PostgreSQL (Mumbai ap-south-1), Razorpay UPI",
    targetPlatform: "Android & iOS Mobile App (India)",
    targetScale: "Launch MVP at 1,000 DAU, scale to 25K Indian subscribers",
    constraints: "15 hours/week solo dev, 60-day Google Play Store launch window",
    resources: "₹80,000 budget for Gemini inference tokens, Google Play Developer account, and managed Supabase tier",
    evidence: "Duolingo and Speak have shown huge Indian demand; 70% of Indian mobile users prefer voice interfaces over typing."
  },
  {
    title: "GST e-Invoice SaaS",
    badge: "B2B SaaS",
    projectName: "TaxSetu: Automated GST & e-Invoice Engine",
    plan: "Multi-tenant B2B SaaS for Indian MSMEs that automatically reconciles purchase orders with GSTR-2B government portal data and flags ITC discrepancies via WhatsApp alerts.",
    techStack: "Next.js 15, Tailwind, PostgreSQL / Drizzle ORM, AWS Mumbai (ap-south-1), Cashfree Payments, WhatsApp Cloud API",
    targetPlatform: "Web Desktop Application & WhatsApp Integration",
    targetScale: "100 Indian business accounts processing 15,000 invoices/month",
    constraints: "20 hours/week, 8 weeks to closed pilot in Pune & Bengaluru",
    resources: "₹1,20,000 working capital, senior TypeScript/React developer, basic GST API knowledge",
    evidence: "3 chartered accountants and 2 local logistics companies agreed to paid pilot at ₹1,999/month if audit time drops from 6 hours to 15 minutes."
  },
  {
    title: "Kirana Quick-Commerce",
    badge: "Hyperlocal",
    projectName: "VyaparDukaan: Local Store Delivery App",
    plan: "Hyperlocal grocery ordering app for neighbourhood Kirana stores with instant UPI QR checkouts, real-time inventory sync, and 30-minute delivery dispatch.",
    techStack: "Flutter, Node.js / Express, Redis, Google Cloud Mumbai, PhonePe / Paytm UPI QR Integration",
    targetPlatform: "Android Mobile App (PWA & APK)",
    targetScale: "50 local stores with 2,500 active weekly buyers",
    constraints: "Full-time 4-week sprint",
    resources: "₹50,000 budget, intermediate Flutter knowledge, strong backend familiarity",
    evidence: "Surveyed 20 local merchants in residential society; 14 want a zero-commission digital catalog alternative to Swiggy/Zepto."
  },
  {
    title: "Dev TDS & Invoicing",
    badge: "Utility",
    projectName: "RupeeDesk: Local-First Invoicing for Indian Freelancers",
    plan: "Ultra-fast desktop billing and tax invoice generator with automatic GST calculation, TDS 194J tracking, and one-click PDF export with UPI payment links.",
    techStack: "Tauri 2.0, Rust, React, SQLite local database, Razorpay Payment Links API",
    targetPlatform: "macOS, Windows 11, Linux Desktop",
    targetScale: "5,000 Indian freelance developers with zero server infrastructure",
    constraints: "Weekends only, 10 hours/week",
    resources: "₹25,000 budget, intermediate Rust & React expertise",
    evidence: "Indian developer Reddit & Twitter communities show high frustration with complex US-centric billing tools that lack GST/TDS support."
  }
];

const REALITY_PRESETS: PlanPreset[] = [
  {
    title: "Solo Micro-SaaS",
    badge: "Micro-SaaS",
    projectName: "Indian Creator Invoicing Widget",
    plan: "Build and launch a lightweight customer invoice and UPI payment widget for Indian Notion and Webflow creators. Reach ₹1,00,000 MRR within 90 days by cold messaging 200 Indian agencies.",
    constraints: "2 hours per day on weekday evenings, full-time day job",
    resources: "₹30,000 budget, intermediate TypeScript/React, 200 Twitter followers",
    evidence: "5 active Indian agency owners expressed willing to pay ₹799/month for instant UPI payment collection."
  },
  {
    title: "Mobile Fitness App",
    badge: "Consumer",
    projectName: "DesiFit: Indian Diet & Calorie Scanner",
    plan: "Develop an AI-powered food photo calorie tracker trained on Indian cuisine (roti, dal, paneer, biryani). Launch on Google Play with ₹299/quarter subscription.",
    constraints: "15 hours per week, launching initially on Android in India",
    resources: "₹60,000 savings for API tokens and Google Play Developer license, Flutter skills",
    evidence: "Existing US apps fail completely at recognizing Indian mixed curries and home-cooked meals."
  },
  {
    title: "WhatsApp Agency",
    badge: "Service",
    projectName: "KisanChat: WhatsApp Automation Studio",
    plan: "Transition from freelance coder to boutique automation agency setting up official WhatsApp Business API bots for Indian D2C brands. Sign 3 retainers at ₹35,000/month.",
    constraints: "30 hours/week, working solo before hiring first remote intern",
    resources: "₹40,000 working capital, strong portfolio of automated webhook workflows",
    evidence: "2 existing retail clients requested WhatsApp catalog bots to reduce customer support call load."
  },
  {
    title: "D2C Brand Launch",
    badge: "Physical",
    projectName: "Filter Coffee Pods D2C",
    plan: "Manufacture and sell biodegradable single-serve South Indian filter coffee decoction pods directly via Shopify India and Shiprocket. Reach 200 orders in first 45 days.",
    constraints: "Weekends only, 10 hours/week, reliance on Chikmagalur supplier delivery",
    resources: "₹1,50,000 inventory capital, basic Shopify & Instagram marketing setup",
    evidence: "Taste-tested sample batch with 40 Bangalore IT professionals with 85% reorder intent."
  }
];

export const InputForm: React.FC<InputFormProps> = ({ mode, onSubmit, isLoading, initialValues }) => {
  const [projectName, setProjectName] = useState(initialValues?.projectName || '');
  const [plan, setPlan] = useState(initialValues?.plan || '');
  const [constraints, setConstraints] = useState(initialValues?.constraints || '');
  const [resources, setResources] = useState(initialValues?.resources || '');
  const [evidence, setEvidence] = useState(initialValues?.evidence || '');
  
  // App Build specific fields
  const [techStack, setTechStack] = useState(initialValues?.techStack || '');
  const [targetPlatform, setTargetPlatform] = useState(initialValues?.targetPlatform || '');
  const [targetScale, setTargetScale] = useState(initialValues?.targetScale || '');

  const [isPresetsMinimized, setIsPresetsMinimized] = useState(false);
  const [activePresetIndex, setActivePresetIndex] = useState<number | null>(null);

  const presets = mode === 'app-build' ? APP_BUILD_PRESETS : REALITY_PRESETS;

  useEffect(() => {
    if (initialValues) {
      setProjectName(initialValues.projectName || '');
      setPlan(initialValues.plan || '');
      setConstraints(initialValues.constraints || '');
      setResources(initialValues.resources || '');
      setEvidence(initialValues.evidence || '');
      setTechStack(initialValues.techStack || '');
      setTargetPlatform(initialValues.targetPlatform || '');
      setTargetScale(initialValues.targetScale || '');
    }
  }, [initialValues]);

  const handleApplyPreset = (preset: PlanPreset, idx: number) => {
    setProjectName(preset.projectName);
    setPlan(preset.plan);
    setConstraints(preset.constraints);
    setResources(preset.resources);
    setEvidence(preset.evidence);
    setTechStack(preset.techStack || '');
    setTargetPlatform(preset.targetPlatform || '');
    setTargetScale(preset.targetScale || '');
    setActivePresetIndex(idx);
  };

  const handleClear = () => {
    setProjectName('');
    setPlan('');
    setConstraints('');
    setResources('');
    setEvidence('');
    setTechStack('');
    setTargetPlatform('');
    setTargetScale('');
    setActivePresetIndex(null);
  };

  const triggerSubmit = () => {
    if (!plan.trim() || isLoading) return;
    onSubmit({
      mode,
      plan: plan.trim(),
      constraints: constraints.trim(),
      resources: resources.trim(),
      evidence: evidence.trim(),
      techStack: techStack.trim() || undefined,
      targetPlatform: targetPlatform.trim() || undefined,
      targetScale: targetScale.trim() || undefined,
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

  const isFormValid = plan.trim().length >= 10;

  return (
    <div className="w-full max-w-6xl mx-auto" onKeyDown={handleKeyDown}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        
        {/* Minimized Presets Tab Bar */}
        {isPresetsMinimized && (
          <div className="lg:col-span-12">
            <div className="glass-panel rounded-xl px-3.5 py-2 shadow-xs border border-slate-300 flex items-center justify-between bg-white/95 transition-all">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-3.5 h-3.5 text-blue-600" />
                <span className="text-xs font-bold text-slate-900">
                  {mode === 'app-build' ? "1-Click Archetypes (₹)" : "Scenario Presets (₹)"}
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 font-mono">
                  Tab minimized
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsPresetsMinimized(false)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-all shadow-2xs cursor-pointer"
                title="Expand tab"
              >
                <ChevronDown className="w-3.5 h-3.5 text-blue-600" />
                <span>Expand Tab ({presets.length})</span>
              </button>
            </div>
          </div>
        )}

        {/* LEFT SIDEBAR: Clean, Compact Presets */}
        {!isPresetsMinimized && (
          <div className="lg:col-span-4">
            <div className="glass-panel rounded-2xl p-4 shadow-glass space-y-2.5">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-blue-600" />
                  <span className="text-xs font-bold text-slate-900">
                    {mode === 'app-build' ? "1-Click Archetypes (₹)" : "Scenario Presets (₹)"}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  {(plan || projectName) && (
                    <button
                      type="button"
                      onClick={handleClear}
                      className="text-[10px] text-slate-500 hover:text-red-600 font-semibold flex items-center gap-1 transition-colors px-1.5 py-0.5 rounded border border-slate-200 bg-white/70 hover:bg-red-50 cursor-pointer"
                      title="Clear form inputs"
                    >
                      <RotateCcw className="w-2.5 h-2.5" />
                      <span>Clear</span>
                    </button>
                  )}
                  {/* Minimize Button to Close This Tab */}
                  <button
                    type="button"
                    onClick={() => setIsPresetsMinimized(true)}
                    className="text-slate-500 hover:text-slate-800 hover:bg-slate-100 p-1 rounded-md transition-colors flex items-center justify-center border border-slate-200 bg-white/80 hover:border-slate-300 cursor-pointer"
                    title="Minimize tab"
                    aria-label="Minimize tab"
                  >
                    <Minus className="w-3 h-3 text-slate-600" />
                  </button>
                </div>
              </div>

              <div className="text-[11px] text-slate-500 leading-tight">
                Pre-load tested Indian architectures & budgets:
              </div>

              {/* Compact Vertical Stack of Presets */}
              <div className="flex flex-col gap-1.5">
                {presets.map((preset, idx) => {
                  const isSelected = activePresetIndex === idx;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleApplyPreset(preset, idx)}
                      className={`w-full p-2.5 rounded-xl text-left border transition-all flex flex-col gap-0.5 shadow-2xs group cursor-pointer ${
                        isSelected
                          ? 'bg-blue-50/95 border-blue-600 text-blue-950 ring-1 ring-blue-600'
                          : 'bg-white hover:bg-slate-50/80 border-slate-300 text-slate-800 hover:border-blue-400'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-mono font-bold uppercase tracking-wider ${
                          isSelected ? 'text-blue-700' : 'text-blue-600'
                        }`}>
                          {preset.badge}
                        </span>
                        {isSelected ? (
                          <span className="w-3.5 h-3.5 rounded-full bg-blue-600 text-white flex items-center justify-center">
                            <Check className="w-2 h-2" />
                          </span>
                        ) : (
                          <span className="text-[10px] font-medium text-slate-400 group-hover:text-blue-600">
                            Apply
                          </span>
                        )}
                      </div>
                      <span className="text-xs font-bold text-slate-900 block truncate">
                        {preset.title}
                      </span>
                      <span className="text-[11px] text-slate-500 truncate block">
                        {preset.projectName}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Quick 1-line Ecosystem Footnote */}
              <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[10px] font-mono text-slate-500">
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  <span>ap-south-1 Mumbai</span>
                </span>
                <span>UPI & Razorpay Ready</span>
              </div>
            </div>
          </div>
        )}

        {/* RIGHT MAIN PANEL: Compact Primary Input Form Card */}
        <div className={isPresetsMinimized ? "lg:col-span-12" : "lg:col-span-8"}>
          <div className="glass-panel rounded-2xl p-4 sm:p-5 shadow-glass">
            <form onSubmit={handleSubmit} className="space-y-3.5">
              
              {/* Project Name */}
              <div className="space-y-1">
                <label htmlFor="projectName" className="block text-xs font-bold text-slate-800">
                  {mode === 'app-build' ? "App Name / Working Title" : "Project Name"} <span className="text-slate-400 font-normal">(optional)</span>
                </label>
                <input
                  type="text"
                  id="projectName"
                  className="w-full glass-input rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-900 placeholder-slate-400 outline-none"
                  placeholder={mode === 'app-build' ? "e.g. BolBharat Voice, TaxSetu B2B, VyaparDukaan..." : "e.g. AI Fitness Coach, Solo Micro-SaaS..."}
                  value={projectName}
                  onChange={(e) => {
                    setProjectName(e.target.value);
                    setActivePresetIndex(null);
                  }}
                />
              </div>

              {/* Mode-Specific Architecture Fields (App Build Mode) */}
              {mode === 'app-build' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-slate-800 flex items-center gap-1.5">
                      <Code2 className="w-3.5 h-3.5 text-blue-600" />
                      <span>Proposed Tech Stack & APIs</span>
                    </label>
                    <input
                      type="text"
                      className="w-full glass-input bg-white rounded-lg px-2.5 py-1.5 text-xs text-slate-900 placeholder-slate-400 outline-none"
                      placeholder="e.g. Next.js 15, Supabase (Mumbai), Gemini 3 Flash, Razorpay"
                      value={techStack}
                      onChange={(e) => setTechStack(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-slate-800 flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-blue-600" />
                      <span>Target Platform & MVP Scale</span>
                    </label>
                    <input
                      type="text"
                      className="w-full glass-input bg-white rounded-lg px-2.5 py-1.5 text-xs text-slate-900 placeholder-slate-400 outline-none"
                      placeholder="e.g. Android Mobile APK & Web / 1K MVP to 25K Indian Users"
                      value={targetPlatform}
                      onChange={(e) => setTargetPlatform(e.target.value)}
                    />
                  </div>
                </div>
              )}

              {/* Core Plan / Specification */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label htmlFor="plan" className="block text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    {mode === 'app-build' ? "App Concept & Core User Loops" : "Plan Description"} <span className="text-red-500">*</span>
                    {plan.trim().length >= 10 && (
                      <CheckCircle2 className="w-3 h-3 text-blue-600 inline" />
                    )}
                  </label>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {plan.length} chars
                  </span>
                </div>
                <textarea
                  id="plan"
                  required
                  rows={3}
                  className="w-full glass-input rounded-xl p-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 outline-none resize-none leading-relaxed"
                  placeholder={
                    mode === 'app-build'
                      ? "Describe what the app does, primary user loop, Indian customer segment, core features, and launch target..."
                      : "Be specific. E.g., 'I want to build a SaaS app in 2 months and acquire 100 Indian customers paying via UPI...'"
                  }
                  value={plan}
                  onChange={(e) => {
                    setPlan(e.target.value);
                    setActivePresetIndex(null);
                  }}
                />
              </div>

              {/* Time & Resources Grid (in INR ₹) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="space-y-1">
                  <label htmlFor="constraints" className="block text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-blue-600" />
                    <span>{mode === 'app-build' ? "Development Hours & Deadlines" : "Time Constraints"}</span>
                  </label>
                  <input
                    type="text"
                    id="constraints"
                    className="w-full glass-input rounded-xl px-3 py-1.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 outline-none"
                    placeholder={mode === 'app-build' ? "e.g. 15 hrs/week solo, 60 days to launch" : "e.g. 2 hours/day, full-time job"}
                    value={constraints}
                    onChange={(e) => setConstraints(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="resources" className="block text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <IndianRupee className="w-3.5 h-3.5 text-blue-600" />
                    <span>{mode === 'app-build' ? "Budget (₹ INR) & Skills" : "Budget & Skills"}</span>
                  </label>
                  <input
                    type="text"
                    id="resources"
                    className="w-full glass-input rounded-xl px-3 py-1.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 outline-none"
                    placeholder={mode === 'app-build' ? "e.g. ₹60,000 cloud budget, intermediate React" : "e.g. ₹30,000 budget, React dev"}
                    value={resources}
                    onChange={(e) => setResources(e.target.value)}
                  />
                </div>
              </div>

              {/* Supporting Evidence */}
              <div className="space-y-1">
                <label htmlFor="evidence" className="block text-xs font-bold text-slate-800">
                  {mode === 'app-build' ? "Market Validation or Traction" : "Supporting Validation & Data"}{" "}
                  <span className="text-slate-400 font-normal">(optional)</span>
                </label>
                <textarea
                  id="evidence"
                  rows={1}
                  className="w-full glass-input rounded-xl px-3 py-1.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 outline-none resize-none"
                  placeholder={
                    mode === 'app-build'
                      ? "e.g. 50 waitlist signups, interviewed 10 local business owners, tested Razorpay sandbox API..."
                      : "e.g. Pre-orders, competitor pricing in INR, customer survey notes..."
                  }
                  value={evidence}
                  onChange={(e) => setEvidence(e.target.value)}
                />
              </div>

              {/* Primary Action Button */}
              <div className="pt-1">
                <button
                  type="submit"
                  disabled={isLoading || !isFormValid}
                  className={`w-full py-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-sm ${
                    isLoading || !isFormValid
                      ? 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300'
                      : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white shadow-md shadow-blue-500/20 hover:shadow-blue-500/30 active:scale-[0.99] cursor-pointer'
                  }`}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Simulating Architecture & Feasibility in ₹ INR...</span>
                    </>
                  ) : (
                    <>
                      <PlayCircle className="w-4 h-4 text-white" />
                      <span>
                        {mode === 'app-build' ? "Run App Architecture & Feasibility Audit (₹ INR)" : "Audit Plan Reality (₹ INR)"}
                      </span>
                      <div className="hidden sm:flex items-center gap-0.5 px-1.5 py-0.5 bg-blue-700/60 rounded font-mono ml-1 text-[10px] text-blue-100 border border-blue-400/30">
                        <span>⌘</span>
                        <CornerDownLeft className="w-2.5 h-2.5" />
                      </div>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* BOTTOM HORIZONTAL PANEL: 4 Feasibility Pillars Audited */}
        <div className="lg:col-span-12">
          <div className="glass-panel rounded-2xl p-3.5 shadow-glass">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2.5 mb-2.5 border-b border-slate-200 gap-1">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono font-bold text-blue-600 uppercase tracking-wider">
                  04 Audit Dimensions
                </span>
                <span className="text-slate-300">/</span>
                <span className="text-xs font-bold text-slate-900">
                  Calibrated for Indian Engineering & Cloud Realities
                </span>
              </div>
              <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500">
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>ap-south-1 Mumbai</span>
                </span>
                <span aria-hidden="true">·</span>
                <span>UPI 2.0 / AutoPay Churn</span>
              </div>
            </div>

            {/* Precision 4-Pillar Grid with Hairline Dividers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Pillar 1 */}
              <div className="flex items-start gap-2.5 p-1.5 rounded-lg hover:bg-slate-50/70 transition-colors">
                <div className="w-7 h-7 rounded-lg bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                  <Layers className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono text-slate-400">01</span>
                    <span className="text-xs font-bold text-slate-900 truncate">Tech Stack Architecture</span>
                  </div>
                  <span className="text-[11px] text-slate-500 block leading-tight mt-0.5">
                    Monolith vs microservices, ORM complexity & cold-start latency.
                  </span>
                </div>
              </div>

              {/* Pillar 2 */}
              <div className="flex items-start gap-2.5 p-1.5 rounded-lg hover:bg-slate-50/70 transition-colors">
                <div className="w-7 h-7 rounded-lg bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                  <Clock className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono text-slate-400">02</span>
                    <span className="text-xs font-bold text-slate-900 truncate">Engineering Bandwidth</span>
                  </div>
                  <span className="text-[11px] text-slate-500 block leading-tight mt-0.5">
                    Realistic dev hours/week vs MVP delivery milestone.
                  </span>
                </div>
              </div>

              {/* Pillar 3 */}
              <div className="flex items-start gap-2.5 p-1.5 rounded-lg hover:bg-red-50/40 transition-colors">
                <div className="w-7 h-7 rounded-lg bg-red-50 border border-red-200 text-red-600 flex items-center justify-center shrink-0 mt-0.5">
                  <ShieldAlert className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono text-red-400">03</span>
                    <span className="text-xs font-bold text-red-950 truncate">Fatal Traps & Gateways</span>
                  </div>
                  <span className="text-[11px] text-red-700 block leading-tight mt-0.5">
                    RBI mandate churn, Razorpay KYC & App Store 20-tester rules.
                  </span>
                </div>
              </div>

              {/* Pillar 4 */}
              <div className="flex items-start gap-2.5 p-1.5 rounded-lg hover:bg-slate-50/70 transition-colors">
                <div className="w-7 h-7 rounded-lg bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                  <IndianRupee className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono text-slate-400">04</span>
                    <span className="text-xs font-bold text-slate-900 truncate">Cloud Runway (₹ INR)</span>
                  </div>
                  <span className="text-[11px] text-slate-500 block leading-tight mt-0.5">
                    Mumbai (ap-south-1) VM, DB & AI inference monthly burn.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
