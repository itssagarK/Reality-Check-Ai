import React, { useState, useEffect } from 'react';
import { RealityCheckResponse, UserInput } from '../../types';
import { CheckCircle2, AlertTriangle, XCircle, Copy, Check, Printer, GitFork } from 'lucide-react';
import confetti from 'canvas-confetti';

interface OverallScoreGaugeProps {
  result: RealityCheckResponse;
  userInput: UserInput;
  onOpenVariationModal?: () => void;
}

export const OverallScoreGauge: React.FC<OverallScoreGaugeProps> = ({
  result,
  userInput,
  onOpenVariationModal
}) => {
  const [displayScore, setDisplayScore] = useState(0);
  const [copiedSummary, setCopiedSummary] = useState(false);

  const score = result.reality_score;

  // Animated numerical counter effect
  useEffect(() => {
    let current = 0;
    const duration = 1000;
    const stepTime = Math.max(16, Math.floor(duration / (score || 1)));

    const timer = setInterval(() => {
      current += 1;
      if (current >= score) {
        setDisplayScore(score);
        clearInterval(timer);
        if (score >= 75) {
          try {
            confetti({
              particleCount: 35,
              spread: 50,
              origin: { y: 0.6 }
            });
          } catch (e) {
            // Ignore if canvas blocked
          }
        }
      } else {
        setDisplayScore(current);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [score]);

  // Classic Blue & Red Status Configuration
  const isFeasible = score >= 75;
  const isRisky = score >= 40 && score < 75;

  const statusConfig = isFeasible
    ? {
        stroke: '#2563eb', // classic blue
        text: 'text-blue-700',
        badge: 'bg-blue-50/90 text-blue-700 border-blue-200/80',
        label: 'Feasible to Build',
        icon: CheckCircle2,
      }
    : isRisky
    ? {
        stroke: '#ea580c', // amber-orange
        text: 'text-amber-700',
        badge: 'bg-amber-50/90 text-amber-700 border-amber-200/80',
        label: 'High Friction / Bottlenecks',
        icon: AlertTriangle,
      }
    : {
        stroke: '#dc2626', // classic red
        text: 'text-red-700',
        badge: 'bg-red-50/90 text-red-700 border-red-200/80',
        label: 'Unfeasible / Math Deficit',
        icon: XCircle,
      };

  const circumference = 2 * Math.PI * 52;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const handleCopySummary = () => {
    const text = `Reality Check AI Audit: ${userInput.projectName || "App Feasibility Evaluation"}\nScore: ${score}/100 (${statusConfig.label})\nVerdict: ${result.verdict || result.summary}\nCritical Stop Trigger: ${result.stop_signal}`;
    navigator.clipboard.writeText(text);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const StatusIcon = statusConfig.icon;

  return (
    <div className="glass-panel rounded-3xl p-6 sm:p-8 shadow-glass relative">
      
      {/* Top Action Ribbon */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-slate-200/70">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600">
              Feasibility Assessment
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            {userInput.projectName || "App Feasibility & Architecture"}
          </h2>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap no-print">
          <button
            onClick={handleCopySummary}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white/80 backdrop-blur-md text-xs font-semibold text-slate-700 hover:text-blue-700 hover:border-blue-300 transition-colors shadow-xs"
            title="Copy audit summary to clipboard"
          >
            {copiedSummary ? <Check className="w-3.5 h-3.5 text-blue-600" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
            <span>{copiedSummary ? "Copied" : "Copy Summary"}</span>
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white/80 backdrop-blur-md text-xs font-semibold text-slate-700 hover:text-blue-700 hover:border-blue-300 transition-colors shadow-xs"
            title="Print or export as PDF"
          >
            <Printer className="w-3.5 h-3.5 text-slate-400" />
            <span>Download PDF</span>
          </button>

          {onOpenVariationModal && (
            <button
              onClick={onOpenVariationModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-all shadow-sm shadow-blue-500/25"
            >
              <GitFork className="w-3.5 h-3.5 text-white" />
              <span>Test De-scoped Variation</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Gauge + Verdict Section */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        
        {/* Glassmorphic Circular Gauge */}
        <div className="md:col-span-4 flex flex-col items-center justify-center">
          <div className="relative w-40 h-40 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 120 120">
              {/* Background Track Circle */}
              <circle
                cx="60"
                cy="60"
                r="52"
                className="stroke-slate-200/80"
                strokeWidth="8"
                fill="none"
              />
              {/* Animated Progress Gauge */}
              <circle
                cx="60"
                cy="60"
                r="52"
                stroke={statusConfig.stroke}
                strokeWidth="8"
                strokeLinecap="round"
                fill="none"
                style={{
                  strokeDasharray: circumference,
                  strokeDashoffset: strokeDashoffset,
                  transition: 'stroke-dashoffset 1.2s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
              />
            </svg>

            {/* Score Number Display */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className={`text-4xl font-serif font-bold tracking-tight ${statusConfig.text} tabular-nums leading-none`}>
                {displayScore}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-1">
                / 100 Score
              </span>
            </div>
          </div>

          <div className={`mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${statusConfig.badge} shadow-xs`}>
            <StatusIcon className="w-3.5 h-3.5" />
            <span>{statusConfig.label}</span>
          </div>
        </div>

        {/* Verdict & Takeaway */}
        <div className="md:col-span-8 space-y-4">
          <div className="space-y-1.5">
            <span className="text-xs text-slate-500 block">
              Confidence Level: <strong className="text-slate-900 font-semibold">{result.confidence_level}</strong>
            </span>
            <p className="text-lg sm:text-xl font-serif font-bold text-slate-900 leading-snug">
              "{result.verdict || result.summary}"
            </p>
          </div>

          <p className="text-sm text-slate-600 leading-relaxed font-normal">
            {result.summary}
          </p>

          {/* Key Assumptions Made */}
          <div className="pt-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Grounding Assumptions:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {result.assumptions_used.slice(0, 3).map((assump, i) => (
                <span
                  key={i}
                  className="text-xs px-2.5 py-1 rounded-xl bg-slate-100/90 text-slate-700 border border-slate-200/80"
                >
                  {assump}
                </span>
              ))}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
