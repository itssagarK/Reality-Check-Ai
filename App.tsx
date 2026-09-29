import React, { useState } from 'react';
import { InputForm } from './components/InputForm';
import { ScoreCard } from './components/ScoreCard';
import { RiskAnalysis } from './components/RiskAnalysis';
import { PlanTimeline } from './components/PlanTimeline';
import { DecisionAnalysis } from './components/DecisionAnalysis';
import { AuditParameters } from './components/AuditParameters';
import { HistorySidebar } from './components/HistorySidebar';
import { PlanVariationModal } from './components/PlanVariationModal';
import { auditPlan } from './services/geminiService';
import { RealityCheckResponse, UserInput, SavedAudit, AlternativePath } from './types';
import { getProjectId, getProjectIterations } from './utils/projectUtils';
import { Activity, Github, Sparkles, History, GitFork, PlusCircle, CheckCircle, ShieldCheck, ArrowRight } from 'lucide-react';

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
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* Top Header */}
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur-md sticky top-0 z-40 shadow-xs">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5 cursor-pointer group" onClick={handleReset}>
            <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-xs group-hover:bg-indigo-700 transition-colors">
              <Activity className="w-5 h-5" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-extrabold tracking-tight text-slate-900">
                Reality Check
              </span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200">
                AI
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsHistoryOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all shadow-xs"
            >
              <History className="w-4 h-4 text-indigo-600" />
              <span>Audits</span>
              {history.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-indigo-100 text-indigo-800 text-[11px] font-bold">
                  {history.length}
                </span>
              )}
            </button>

            <a
              href="https://github.com/itssagarK/Reality-check-2.git"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
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

      <main className="max-w-[1400px] mx-auto px-4 md:px-6 py-8">
        {!result ? (
          <div className="flex flex-col items-center justify-center min-h-[75vh]">
            
            {/* Bold Hero Header */}
            <div className="text-center mb-8 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold mb-4">
                <ShieldCheck className="w-3.5 h-3.5" />
                Evidence-Grounded Feasibility Engine
              </div>
              <h1 className="text-4xl sm:text-5xl font-black text-slate-950 tracking-tight leading-tight mb-4">
                Stress-test your plan against real-world friction.
              </h1>
              <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
                Optimism bias kills ambitious projects. Input your timeline, budget, and scope to diagnose failure modes, calculate your Reality Score, and iterate toward feasibility.
              </p>
            </div>
            
            <InputForm onSubmit={handleAudit} isLoading={isLoading} initialValues={userInput} />

            {error && (
              <div className="mt-6 w-full max-w-2xl p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-sm font-medium text-center shadow-xs">
                {error}
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            
            {/* Left Column: Context & Navigation */}
            <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-4">
              
              {/* Segmented Mode Selector */}
              <div className="bg-slate-200/80 p-1 rounded-xl flex items-center">
                <button 
                  onClick={() => setMode('audit')}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    mode === 'audit' 
                      ? 'bg-white text-indigo-900 shadow-sm' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Activity className="w-3.5 h-3.5" />
                  Audit Report
                </button>
                <button 
                  onClick={() => setMode('decision')}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    mode === 'decision' 
                      ? 'bg-white text-indigo-900 shadow-sm' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Decision Paths
                </button>
              </div>

              {userInput && <AuditParameters input={userInput} />}
              
              {/* Variation & Reset Actions */}
              <div className="space-y-2 pt-1">
                {userInput && (
                  <button
                    type="button"
                    onClick={() => handleStartVariation(userInput)}
                    className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
                  >
                    <GitFork className="w-4 h-4" />
                    Test Plan Variation (Iteration)
                  </button>
                )}

                <button 
                  onClick={handleReset}
                  className="w-full py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold transition-all text-xs shadow-xs"
                >
                  Audit Another Project
                </button>
              </div>
            </div>

            {/* Right Column: Detailed Results */}
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
