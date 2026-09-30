import React, { useState } from 'react';
import { InputForm } from './components/InputForm';
import { ScoreCard } from './components/ScoreCard';
import { RiskAnalysis } from './components/RiskAnalysis';
import { PlanTimeline } from './components/PlanTimeline';
import { DecisionAnalysis } from './components/DecisionAnalysis';
import { AuditParameters } from './components/AuditParameters';
import { HistorySidebar } from './components/HistorySidebar';
import { PlanVariationModal } from './components/PlanVariationModal';
import { Hero3DScene } from './components/Hero3DScene';
import { auditPlan } from './services/geminiService';
import { RealityCheckResponse, UserInput, SavedAudit, AlternativePath } from './types';
import { getProjectId, getProjectIterations } from './utils/projectUtils';
import { Activity, Github, Sparkles, History, GitFork, PlusCircle, CheckCircle, ShieldCheck, ArrowRight, Zap, RefreshCw, BarChart2 } from 'lucide-react';

const App: React.FC = () => {
  const [result, setResult] = useState<RealityCheckResponse | null>(null);
  const [userInput, setUserInput] = useState<UserInput | null>(null);
  const [currentAuditId, setCurrentAuditId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<'audit' | 'decision'>('audit');
  const [history, setHistory] = useState<SavedAudit[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isVariationModalOpen, setIsVariationModalOpen] = useState(false);
  const [variationBaseInput, setVariationBaseInput] = useState<UserInput | null>(null);

  React.useEffect(() => {
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
    setIsHistoryOpen(false);
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
      const data = await auditPlan(input.plan, input.constraints, input.resources, input.evidence);
      setResult(data);
      saveToHistory(input, data);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred while auditing your plan.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVariationSubmit = async (variationInput: UserInput) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await auditPlan(
        variationInput.plan,
        variationInput.constraints,
        variationInput.resources,
        variationInput.evidence
      );
      setResult(data);
      setUserInput(variationInput);
      saveToHistory(variationInput, data);
      setIsVariationModalOpen(false);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred while auditing your plan variation.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartVariation = (baseInput: UserInput) => {
    setVariationBaseInput(baseInput);
    setIsVariationModalOpen(true);
  };

  const handleTestAlternative = (alt: AlternativePath) => {
    if (!userInput) return;
    const variationInput: UserInput = {
      ...userInput,
      plan: `${userInput.plan}\n\n[Alternative Path Applied: ${alt.name}]\n${alt.reasoning}`,
      constraints: userInput.constraints
        ? `${userInput.constraints}; ${alt.trade_offs}`
        : alt.trade_offs,
      variationLabel: `Alt: ${alt.name.slice(0, 20)}`
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
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-600 selection:text-white">
      
      {/* 3D Tactile Top Header */}
      <header className="border-b-3 border-slate-900 bg-white sticky top-0 z-40 shadow-[0_4px_0px_#0f172a]">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={handleReset}>
            <div className="bg-indigo-600 border-2 border-slate-900 p-2 rounded-xl text-white shadow-[2px_2px_0px_#0f172a] group-hover:-translate-y-0.5 group-active:translate-y-0.5 transition-all">
              <Activity className="w-5 h-5" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black tracking-tight text-slate-950">
                Reality Check
              </span>
              <span className="text-xs font-black px-2 py-0.5 rounded-md bg-indigo-100 text-slate-950 border-2 border-slate-900 shadow-[1px_1px_0px_#0f172a]">
                3D AI
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsHistoryOpen(true)}
              className="neo-3d-btn flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white text-slate-900 text-xs font-black"
            >
              <History className="w-4 h-4 text-indigo-600" />
              <span>Audits</span>
              {history.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-indigo-600 text-white text-[11px] font-black border border-slate-900">
                  {history.length}
                </span>
              )}
            </button>

            <a
              href="https://github.com/itssagarK/Reality-check-2.git"
              target="_blank"
              rel="noopener noreferrer"
              className="neo-3d-btn p-2 rounded-xl bg-white text-slate-900 flex items-center justify-center"
              title="GitHub Repository"
            >
              <Github className="w-5 h-5" />
            </a>
          </div>
        </div>
      </header>

      <HistorySidebar 
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelect={handleSelectAudit}
        onClear={handleClearHistory}
        onDelete={handleDeleteHistoryItem}
      />

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

      <main className="max-w-[1400px] mx-auto px-4 md:px-6 py-6 sm:py-8">
        {!result ? (
          <div className="flex flex-col items-center justify-center">
            
            {/* Integrated Balanced Hero Banner */}
            <div className="w-full max-w-3xl mb-6 bg-white rounded-2xl border-3 border-slate-900 p-6 sm:p-7 shadow-[6px_6px_0px_#0f172a] flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex-1 space-y-2.5 text-center sm:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-indigo-100 border-2 border-slate-900 text-slate-950 text-xs font-black shadow-[2px_2px_0px_#0f172a]">
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                  Evidence-Grounded Feasibility Engine
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight leading-tight">
                  Stress-test your plan against real-world friction.
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed max-w-md">
                  Optimism bias kills ambitious projects. Input your timeline, budget, and scope to calculate your Reality Score, spot failure points, and iterate toward feasibility.
                </p>
              </div>

              {/* Compact Interactive 3D Reality Core */}
              <div className="w-44 h-36 shrink-0 bg-slate-50 border-2 border-slate-900 rounded-xl shadow-[3px_3px_0px_#0f172a] overflow-hidden relative group">
                <Hero3DScene isLoading={isLoading} score={null} className="h-full w-full" />
              </div>
            </div>
            
            <InputForm onSubmit={handleAudit} isLoading={isLoading} initialValues={userInput} />

            {error && (
              <div className="mt-6 w-full max-w-2xl p-4 bg-rose-100 border-3 border-slate-900 rounded-2xl text-rose-950 text-sm font-black text-center shadow-[6px_6px_0px_#881337] animate-pop-in">
                {error}
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            
            {/* Left Column: Context, 3D Core Mini & Navigation */}
            <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-4">
              
              {/* 3D Segmented Rocker Switch Mode Selector */}
              <div className="bg-slate-200 border-3 border-slate-900 p-1.5 rounded-2xl flex items-center shadow-[4px_4px_0px_#0f172a]">
                <button 
                  onClick={() => setMode('audit')}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 ${
                    mode === 'audit' 
                      ? 'bg-indigo-600 text-white border-2 border-slate-900 shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]' 
                      : 'text-slate-800 hover:text-slate-950 font-bold'
                  }`}
                >
                  <Activity className="w-4 h-4" />
                  Audit Report
                </button>
                <button 
                  onClick={() => setMode('decision')}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 ${
                    mode === 'decision' 
                      ? 'bg-indigo-600 text-white border-2 border-slate-900 shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]' 
                      : 'text-slate-800 hover:text-slate-950 font-bold'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  Decision Paths
                </button>
              </div>

              {/* Compact 3D Status Core in sidebar */}
              <div className="bg-white rounded-2xl border-3 border-slate-900 p-2 shadow-[5px_5px_0px_#0f172a] overflow-hidden flex items-center justify-between">
                <div className="h-[120px] w-full">
                  <Hero3DScene isLoading={isLoading} score={result.reality_score} className="h-full w-full" />
                </div>
              </div>

              {userInput && <AuditParameters input={userInput} />}
              
              {/* Variation & Reset 3D Actions */}
              <div className="space-y-2.5 pt-1">
                {userInput && (
                  <button
                    type="button"
                    onClick={() => handleStartVariation(userInput)}
                    className="w-full py-3.5 rounded-xl neo-3d-btn-primary font-black text-xs flex items-center justify-center gap-2 shadow-[4px_4px_0px_#1e1b4b]"
                  >
                    <GitFork className="w-4 h-4" />
                    Test Plan Variation (Iteration)
                  </button>
                )}

                <button 
                  onClick={handleReset}
                  className="neo-3d-btn w-full py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-900 font-black text-xs flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Audit Another Project
                </button>
              </div>
            </div>

            {/* Right Column: Detailed 3D Results */}
            <div className="lg:col-span-8 space-y-6">
              {mode === 'audit' ? (
                <>
                  <ScoreCard 
                    data={result} 
                    currentAudit={activeCurrentAudit}
                    history={history}
                    onSelectAudit={handleSelectAudit}
                    onOpenVariationModal={handleStartVariation}
                  />
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    <RiskAnalysis risks={result.risks} />
                    <PlanTimeline phases={result.realistic_plan} />
                  </div>
                </>
              ) : (
                result.decision_path_analysis && (
                  <DecisionAnalysis 
                    analysis={result.decision_path_analysis}
                    onTestAlternativeAsVariation={handleTestAlternative}
                  />
                )
              )}
            </div>
            
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
