import React, { useState, useEffect } from 'react';
import { InputForm } from './components/InputForm';
import { OverallScoreGauge } from './components/visuals/OverallScoreGauge';
import { ScoreRadarChart } from './components/visuals/ScoreRadarChart';
import { RisksBarChart } from './components/visuals/RisksBarChart';
import { TechStackDiagram } from './components/visuals/TechStackDiagram';
import { ResourcesDonutChart } from './components/visuals/ResourcesDonutChart';
import { RoadmapGanttChart } from './components/visuals/RoadmapGanttChart';
import { SkillGapChart } from './components/visuals/SkillGapChart';
import { ScalabilityLineChart } from './components/visuals/ScalabilityLineChart';
import { AlternativesComparison } from './components/visuals/AlternativesComparison';
import { ExecutiveSummary } from './components/ExecutiveSummary';
import { ScoreEvolutionChart } from './components/ScoreEvolutionChart';
import { SkeletonReport } from './components/SkeletonReport';
import { HistorySidebar } from './components/HistorySidebar';
import { PlanVariationModal } from './components/PlanVariationModal';
import { ProblemSolutionModal } from './components/ProblemSolutionModal';
import { auditPlan } from './services/geminiService';
import { RealityCheckResponse, UserInput, SavedAudit, AlternativePath, ProblemSolutionDetail } from './types';
import { getProjectId, getProjectIterations } from './utils/projectUtils';
import {
  Compass,
  Github,
  History,
  FileCheck,
  Cpu,
  RefreshCw,
  Layers,
  ShieldAlert,
  Clock,
  Sparkles,
  IndianRupee
} from 'lucide-react';

const App: React.FC = () => {
  // Navigation section tab: 'app-build' (default primary for app building feasibility) or 'reality-check'
  const [activeSection, setActiveSection] = useState<'app-build' | 'reality-check'>('app-build');

  const [result, setResult] = useState<RealityCheckResponse | null>(null);
  const [userInput, setUserInput] = useState<UserInput | null>(null);
  const [currentAuditId, setCurrentAuditId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<SavedAudit[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isVariationModalOpen, setIsVariationModalOpen] = useState(false);
  const [variationBaseInput, setVariationBaseInput] = useState<UserInput | null>(null);

  // Problem & Solution Modal state triggered from chart clicks
  const [selectedProblemSolution, setSelectedProblemSolution] = useState<ProblemSolutionDetail | null>(null);
  const [isProblemSolutionModalOpen, setIsProblemSolutionModalOpen] = useState(false);

  // Load audit history
  useEffect(() => {
    const saved = localStorage.getItem('audit_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  const saveToHistory = (input: UserInput, res: RealityCheckResponse): string => {
    const pId = input.projectId || getProjectId({ userInput: input });
    const existingForProject = history.filter(h => getProjectId(h) === pId);
    const iterationNum = existingForProject.length + 1;
    const varLabel = input.variationLabel || `v${iterationNum}`;

    const newAuditId = Date.now().toString();
    const newAudit: SavedAudit = {
      id: newAuditId,
      timestamp: Date.now(),
      userInput: {
        ...input,
        projectId: pId,
        variationLabel: varLabel
      },
      result: res,
      projectId: pId,
      iteration: iterationNum,
      variationLabel: varLabel
    };

    setHistory(prev => {
      const updatedHistory = [newAudit, ...prev];
      localStorage.setItem('audit_history', JSON.stringify(updatedHistory));
      return updatedHistory;
    });

    setCurrentAuditId(newAuditId);
    return newAuditId;
  };

  const handleSelectAudit = (audit: SavedAudit) => {
    setUserInput(audit.userInput);
    setResult(audit.result);
    setCurrentAuditId(audit.id);
    if (audit.userInput.mode) {
      setActiveSection(audit.userInput.mode);
    }
    setIsHistoryOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem('audit_history');
  };

  const handleDeleteHistoryItem = (id: string) => {
    setHistory(prev => {
      const updatedHistory = prev.filter(item => item.id !== id);
      localStorage.setItem('audit_history', JSON.stringify(updatedHistory));
      return updatedHistory;
    });
  };

  const handleAudit = async (input: UserInput) => {
    setIsLoading(true);
    setError(null);
    setResult(null);
    setUserInput(input);
    try {
      const data = await auditPlan(input);
      setResult(data);
      saveToHistory(input, data);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred while auditing app feasibility in Indian Rupees.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVariationSubmit = async (variationInput: UserInput) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await auditPlan(variationInput);
      setResult(data);
      setUserInput(variationInput);
      saveToHistory(variationInput, data);
      setIsVariationModalOpen(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred while auditing plan variation.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartVariation = (baseInput?: UserInput) => {
    const inputToUse = baseInput || userInput;
    if (inputToUse) {
      setVariationBaseInput(inputToUse);
      setIsVariationModalOpen(true);
    }
  };

  const handleTestAlternative = (alt: AlternativePath) => {
    if (!userInput) return;
    const variationInput: UserInput = {
      ...userInput,
      plan: `${userInput.plan}\n\n[High-Feasibility Path: ${alt.name}]\n${alt.reasoning}`,
      constraints: userInput.constraints
        ? `${userInput.constraints}; ${alt.trade_offs}`
        : alt.trade_offs,
      variationLabel: `Alt: ${alt.name.slice(0, 20)}`
    };
    setVariationBaseInput(variationInput);
    setIsVariationModalOpen(true);
  };

  const handleOpenProblemSolution = (item: ProblemSolutionDetail) => {
    setSelectedProblemSolution(item);
    setIsProblemSolutionModalOpen(true);
  };

  const handleApplySolutionAsVariation = (solutionStep: string) => {
    if (!userInput) return;
    const variationInput: UserInput = {
      ...userInput,
      plan: `${userInput.plan}\n\n[Applied Solution from Diagnostic]\n${solutionStep}`,
      variationLabel: `Fix: ${selectedProblemSolution?.sectorName.slice(0, 15) || 'Optimized'}`
    };
    setVariationBaseInput(variationInput);
    setIsVariationModalOpen(true);
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
    setUserInput(null);
    setCurrentAuditId(null);
  };

  const activeCurrentAudit =
    result && userInput
      ? {
          id: currentAuditId || undefined,
          projectId: userInput.projectId || (currentAuditId ? getProjectId({ id: currentAuditId, userInput }) : undefined),
          userInput,
          result
        }
      : null;

  return (
    <div className="relative min-h-screen bg-[#f8fafc] text-slate-800 font-sans selection:bg-blue-100 selection:text-blue-900">
      
      {/* Ambient Glassmorphic Background Blur Lighting */}
      <div className="ambient-bg" aria-hidden="true">
        <div className="ambient-blue" />
        <div className="ambient-red" />
      </div>

      {/* Glassmorphic Top Navigation Header */}
      <header className="sticky top-0 z-40 bg-white/75 backdrop-blur-xl border-b border-slate-200/70 shadow-xs no-print transition-all">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          
          {/* Logo Branding */}
          <div className="flex items-center gap-3 cursor-pointer group" onClick={handleReset}>
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Compass className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-base font-serif font-bold text-slate-900 tracking-tight">
                  Reality Check India
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-blue-50 text-blue-700 font-bold border border-blue-200/80 flex items-center gap-0.5">
                  <IndianRupee className="w-2.5 h-2.5" />
                  <span>INR EDITION</span>
                </span>
              </div>
              <span className="text-[10px] text-slate-500 font-medium hidden sm:block">
                App Building Feasibility & Architecture in ₹ Indian Rupees
              </span>
            </div>
          </div>

          {/* Core Navigation Mode Switcher */}
          <nav className="hidden md:flex items-center p-1 rounded-2xl bg-slate-100/80 backdrop-blur-md border border-slate-200/80 shadow-inner">
            <button
              onClick={() => {
                setActiveSection('app-build');
                if (result) handleReset();
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeSection === 'app-build'
                  ? 'bg-white text-blue-700 shadow-sm border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Cpu className="w-3.5 h-3.5 text-blue-600" />
              <span>App Build Feasibility (₹)</span>
            </button>

            <button
              onClick={() => {
                setActiveSection('reality-check');
                if (result) handleReset();
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeSection === 'reality-check'
                  ? 'bg-white text-blue-700 shadow-sm border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileCheck className="w-3.5 h-3.5 text-slate-500" />
              <span>General Plan (₹)</span>
            </button>
          </nav>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2">
            
            {/* Audit History Drawer Button */}
            <button
              onClick={() => setIsHistoryOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200/80 bg-white/80 backdrop-blur-md text-slate-700 text-xs font-medium hover:bg-white hover:border-blue-300 transition-all shadow-xs"
            >
              <History className="w-3.5 h-3.5 text-blue-600" />
              <span className="hidden sm:inline">Archive</span>
              {history.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-blue-100 text-blue-800 text-[10px] font-mono font-bold">
                  {history.length}
                </span>
              )}
            </button>

            {/* GitHub Link */}
            <a
              href="https://github.com/itssagarK/Reality-check-2.git"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-white/80 transition-colors"
              title="GitHub Repository"
            >
              <Github className="w-4 h-4" />
            </a>
          </div>

        </div>

        {/* Mobile Mode Switcher */}
        <div className="md:hidden flex border-t border-slate-200/60 px-4 py-2 bg-white/90 backdrop-blur-md gap-2">
          <button
            onClick={() => {
              setActiveSection('app-build');
              if (result) handleReset();
            }}
            className={`flex-1 py-1.5 text-center text-xs font-semibold rounded-lg transition-colors ${
              activeSection === 'app-build'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 bg-slate-100'
            }`}
          >
            App Build (₹)
          </button>
          <button
            onClick={() => {
              setActiveSection('reality-check');
              if (result) handleReset();
            }}
            className={`flex-1 py-1.5 text-center text-xs font-semibold rounded-lg transition-colors ${
              activeSection === 'reality-check'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 bg-slate-100'
            }`}
          >
            General Plan (₹)
          </button>
        </div>
      </header>

      {/* History Drawer */}
      <HistorySidebar
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelect={handleSelectAudit}
        onClear={handleClearHistory}
        onDelete={handleDeleteHistoryItem}
      />

      {/* Variation Modal */}
      <PlanVariationModal
        isOpen={isVariationModalOpen}
        onClose={() => setIsVariationModalOpen(false)}
        baseInput={variationBaseInput}
        onSubmitVariation={handleVariationSubmit}
        isLoading={isLoading}
        iterationNumber={
          variationBaseInput
            ? getProjectIterations(
                {
                  id: currentAuditId || undefined,
                  projectId: variationBaseInput.projectId,
                  userInput: variationBaseInput
                },
                history
              ).length + 1
            : 2
        }
      />

      {/* Problem & Solution Inspector Modal (Triggered by clicking chart slices) */}
      <ProblemSolutionModal
        isOpen={isProblemSolutionModalOpen}
        onClose={() => setIsProblemSolutionModalOpen(false)}
        item={selectedProblemSolution}
        onApplySolution={handleApplySolutionAsVariation}
      />

      {/* Main Container */}
      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        
        {/* Loading State Skeleton */}
        {isLoading && <SkeletonReport />}

        {/* Input Form State */}
        {!result && !isLoading && (
          <div className="space-y-6">
            
            {/* Glassmorphic Hero Header */}
            <div className="max-w-3xl mx-auto text-center space-y-3 pt-2 sm:pt-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50/90 border border-blue-200/80 text-blue-700 text-xs font-semibold shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>Pre-Code Architecture & Feasibility Simulator (India Edition)</span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-slate-900 tracking-tight leading-snug">
                {activeSection === 'app-build'
                  ? "Audit Your Software App Feasibility in Indian Rupees (₹)"
                  : "Audit Your Ambitious Indian Venture Against Reality"}
              </h1>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
                {activeSection === 'app-build'
                  ? "Evaluate tech stack complexity, development hours, monthly cloud costs in Mumbai (ap-south-1), UPI checkout drop-offs, and fatal bottlenecks before writing code."
                  : "Optimism bias kills ambitious ventures. Input your scope, timeline, and Indian Rupee budget to test viability."}
              </p>
            </div>

            {/* Input Form Component with Vertical Side Column */}
            <InputForm
              mode={activeSection}
              onSubmit={handleAudit}
              isLoading={isLoading}
              initialValues={userInput}
            />

            {error && (
              <div className="max-w-3xl mx-auto p-4 bg-red-50/90 border border-red-200 rounded-2xl text-red-700 text-xs text-center shadow-glass-red">
                {error}
              </div>
            )}
          </div>
        )}

        {/* Results Visual Graphs Dashboard */}
        {result && userInput && !isLoading && (
          <div className="space-y-6 print-page animate-fade-in">
            
            {/* Top Navigation Ribbon (Results View) */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/70 no-print">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-900">
                  {userInput.mode === 'app-build' ? "App Feasibility & Architecture Audit Report (India)" : "Plan Reality Check Report (India)"}
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-xs text-slate-500 font-mono">
                  {new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold font-mono">
                  ₹ INR
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleReset}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white/80 backdrop-blur-md text-xs font-semibold text-slate-700 hover:text-blue-700 hover:border-blue-300 transition-all shadow-xs"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-blue-600" />
                  <span>Audit Another {userInput.mode === 'app-build' ? "App" : "Plan"}</span>
                </button>
              </div>
            </div>

            {/* 1. Overall Score Gauge with 1-line verdict */}
            <OverallScoreGauge
              result={result}
              userInput={userInput}
              onOpenVariationModal={() => handleStartVariation(userInput)}
            />

            {/* Executive 3 Key Takeaways & Critical Stop Signal */}
            <ExecutiveSummary result={result} userInput={userInput} />

            {/* Visual Graphs 2x2 Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* 2. Feasibility Breakdown Pie Chart & Radar with Click-to-Problem-and-Solution */}
              {result.score_breakdown && (
                <ScoreRadarChart
                  breakdown={result.score_breakdown}
                  onSelectProblemSolution={handleOpenProblemSolution}
                  problemSolutions={result.problem_solutions}
                />
              )}

              {/* 3. Risks Horizontal Bar Chart */}
              {result.risks && (
                <RisksBarChart risks={result.risks} />
              )}

              {/* 4. Technology & Software Stack Diagram */}
              {result.tech_stack && (
                <TechStackDiagram stack={result.tech_stack} />
              )}

              {/* 5. Capital & Resource Pie/Donut Chart with Click-to-Problem-and-Solution */}
              {result.cost_breakdown && result.stat_cards && (
                <ResourcesDonutChart
                  costs={result.cost_breakdown}
                  stats={result.stat_cards}
                  onSelectProblemSolution={handleOpenProblemSolution}
                />
              )}

              {/* 6. Roadmap Horizontal Gantt Timeline */}
              {result.realistic_plan && (
                <RoadmapGanttChart phases={result.realistic_plan} />
              )}

              {/* 7. Skill Gap Paired Progress Bars */}
              {result.skill_gaps && (
                <SkillGapChart skills={result.skill_gaps} />
              )}

              {/* 8. Scalability & Cloud Cost Line Curve in ₹ INR */}
              {result.scalability_projection && (
                <ScalabilityLineChart projections={result.scalability_projection} />
              )}

              {/* 9. High-Feasibility Alternatives Comparison */}
              <AlternativesComparison
                decisionAnalysis={result.decision_path_analysis}
                onSelectAlternativeAsVariation={handleTestAlternative}
              />

            </div>

            {/* Score Evolution Trajectory Line Chart */}
            {activeCurrentAudit && (
              <div className="pt-2">
                <ScoreEvolutionChart
                  currentAudit={activeCurrentAudit}
                  history={history}
                  onSelectAudit={handleSelectAudit}
                  onOpenVariationModal={handleStartVariation}
                />
              </div>
            )}

          </div>
        )}

      </main>

      {/* Clean Glassmorphic Minimal Footer */}
      <footer className="relative z-10 mt-20 border-t border-slate-200/70 bg-white/70 backdrop-blur-md py-7 text-xs text-slate-500 no-print transition-colors">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-slate-900">Reality Check India</span>
            <span className="text-blue-500 font-bold">·</span>
            <span>Evidence-based app architecture and feasibility auditor in Indian Rupees (₹)</span>
          </div>
          <div className="text-[11px] text-slate-400">
            Ground your software build in real-world Indian engineering constraints.
          </div>
        </div>
      </footer>

    </div>
  );
};

export default App;
