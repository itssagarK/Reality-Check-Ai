import React, { useState } from 'react';
import { RealityCheckResponse, UserInput, SavedAudit } from '../types';
import { ScoreEvolutionChart } from './ScoreEvolutionChart';
import { AlertTriangle, CheckCircle2, XCircle, Gauge, Copy, Check, Sparkles } from 'lucide-react';

interface ScoreCardProps {
  data: RealityCheckResponse;
  currentAudit?: { id?: string; projectId?: string; userInput: UserInput; result: RealityCheckResponse } | null;
  history?: SavedAudit[];
  onSelectAudit?: (audit: SavedAudit) => void;
  onOpenVariationModal?: (baseInput: UserInput) => void;
}

export const ScoreCard: React.FC<ScoreCardProps> = ({
  data,
  currentAudit,
  history = [],
  onSelectAudit,
  onOpenVariationModal
}) => {
  const [copied, setCopied] = useState(false);

  const getScoreTheme = (score: number) => {
    if (score >= 75) {
      return {
        cardBg: 'bg-emerald-50/80 border-emerald-200 text-emerald-950',
        scoreText: 'text-emerald-700',
        badge: 'bg-emerald-100 text-emerald-800 border-emerald-300',
        label: 'Feasible',
        iconColor: 'text-emerald-600'
      };
    }
    if (score >= 40) {
      return {
        cardBg: 'bg-amber-50/80 border-amber-200 text-amber-950',
        scoreText: 'text-amber-700',
        badge: 'bg-amber-100 text-amber-800 border-amber-300',
        label: 'Risky',
        iconColor: 'text-amber-600'
      };
    }
    return {
      cardBg: 'bg-rose-50/80 border-rose-200 text-rose-950',
      scoreText: 'text-rose-700',
      badge: 'bg-rose-100 text-rose-800 border-rose-300',
      label: 'Impossible / Unrealistic',
      iconColor: 'text-rose-600'
    };
  };

  const theme = getScoreTheme(data.reality_score);

  const handleCopySummary = () => {
    const textToCopy = `Reality Score: ${data.reality_score}/100 (${theme.label})\nConfidence: ${data.confidence_level}\n\nDiagnosis: ${data.summary}\n\nStop Signal: ${data.stop_signal}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const activeAuditData = currentAudit || {
    result: data,
    userInput: {
      plan: data.summary,
      constraints: '',
      resources: ''
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      
      {/* Main Reality Score Card */}
      <div className={`col-span-1 rounded-2xl border p-7 flex flex-col items-center justify-center text-center shadow-sm relative overflow-hidden ${theme.cardBg}`}>
        <div className="p-2.5 rounded-full bg-white/70 shadow-xs mb-3">
          <Gauge className={`w-7 h-7 ${theme.iconColor}`} />
        </div>
        
        <div className={`text-7xl font-black mb-1 tracking-tighter ${theme.scoreText} tabular-nums`}>
          {data.reality_score}
        </div>
        
        <div className="text-xs font-bold uppercase tracking-[0.2em] text-slate-600 mb-3">
          Reality Score
        </div>
        
        <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${theme.badge}`}>
          <span>{theme.label}</span>
        </div>
      </div>

      {/* Failure Diagnosis Card */}
      <div className="col-span-1 md:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between shadow-sm">
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="w-2 h-5 bg-indigo-600 rounded-full"></span>
              Failure Diagnosis
            </h3>
            
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200">
                Confidence: <strong className={data.confidence_level === 'High' ? 'text-emerald-700' : 'text-amber-700'}>{data.confidence_level}</strong>
              </span>

              <button
                type="button"
                onClick={handleCopySummary}
                className="text-xs font-semibold text-slate-600 hover:text-indigo-600 bg-slate-100 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1"
                title="Copy summary"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>
          
          <p className="text-slate-700 leading-relaxed text-sm border-l-3 border-indigo-500 pl-4 py-1 font-normal bg-indigo-50/30 rounded-r-lg">
            "{data.summary}"
          </p>
        </div>
        
        <div className="mt-5 pt-4 border-t border-slate-100">
          <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2.5">
            Key Assumptions Made
          </h4>
          <div className="flex flex-wrap gap-2">
            {data.assumptions_used.map((assumption, idx) => (
              <span
                key={idx}
                className="text-xs bg-slate-50 text-slate-700 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors"
              >
                {assumption}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Reality Score Evolution (Line Chart) */}
      <ScoreEvolutionChart
        currentAudit={activeAuditData}
        history={history}
        onSelectAudit={onSelectAudit}
        onOpenVariationModal={onOpenVariationModal}
      />

      {/* Stop Signal Banner */}
      <div className="col-span-1 md:col-span-3 bg-rose-50/80 border border-rose-200 rounded-2xl p-5 flex flex-col sm:flex-row items-start gap-4 shadow-sm">
        <div className="bg-rose-100 p-2.5 rounded-xl border border-rose-200 shrink-0 text-rose-600">
          <XCircle className="w-6 h-6" />
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h4 className="text-rose-900 font-bold text-xs uppercase tracking-wider">
              Critical Stop Signal
            </h4>
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
          </div>
          <p className="text-rose-950 text-sm leading-relaxed font-medium">
            {data.stop_signal}
          </p>
        </div>
      </div>

    </div>
  );
};
