import React, { useState, useEffect, useRef } from 'react';
import { RealityCheckResponse, UserInput, SavedAudit } from '../types';
import { ScoreEvolutionChart } from './ScoreEvolutionChart';
import confetti from 'canvas-confetti';
import { AlertTriangle, CheckCircle2, XCircle, Gauge, Copy, Check, Sparkles, Zap, Flame, FileDown, GitFork, ArrowUpRight } from 'lucide-react';

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
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [copiedFull, setCopiedFull] = useState(false);
  const [displayScore, setDisplayScore] = useState(0);
  const [cardTilt, setCardTilt] = useState({ x: 0, y: 0 });
  const meterRef = useRef<HTMLDivElement>(null);

  // Animated numerical counter effect
  useEffect(() => {
    let start = 0;
    const end = data.reality_score;
    const duration = 1000;
    const stepTime = Math.max(16, Math.floor(duration / (end || 1)));

    const timer = setInterval(() => {
      start += 1;
      if (start >= end) {
        setDisplayScore(end);
        clearInterval(timer);
        // Trigger celebratory confetti if score is high
        if (end >= 75) {
          try {
            confetti({
              particleCount: 50,
              spread: 60,
              origin: { y: 0.6 }
            });
          } catch (e) {
            // Ignore if blocked
          }
        }
      } else {
        setDisplayScore(start);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [data.reality_score]);

  // 3D Mouse Parallax Tilt
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!meterRef.current) return;
    const rect = meterRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setCardTilt({
      x: -(y / (rect.height / 2)) * 10,
      y: (x / (rect.width / 2)) * 10
    });
  };

  const handleMouseLeave = () => {
    setCardTilt({ x: 0, y: 0 });
  };

  const getScoreTheme = (score: number) => {
    if (score >= 75) {
      return {
        cardBg: 'bg-emerald-50 text-emerald-950 border-slate-900 shadow-[6px_6px_0px_#064e3b]',
        scoreText: 'text-emerald-700',
        badge: 'bg-emerald-400 text-slate-950 border-2 border-slate-900 shadow-[2px_2px_0px_#064e3b]',
        label: 'Feasible Plan',
        ledColor: 'bg-emerald-500 shadow-[0_0_12px_#10b981]',
        iconColor: 'text-emerald-700',
        recommendation: 'Scope and timeline are well-matched. Follow the realistic execution roadmap milestones.'
      };
    }
    if (score >= 40) {
      return {
        cardBg: 'bg-amber-50 text-amber-950 border-slate-900 shadow-[6px_6px_0px_#78350f]',
        scoreText: 'text-amber-700',
        badge: 'bg-amber-400 text-slate-950 border-2 border-slate-900 shadow-[2px_2px_0px_#78350f]',
        label: 'Risky / Bottlenecks',
        ledColor: 'bg-amber-500 shadow-[0_0_12px_#f59e0b]',
        iconColor: 'text-amber-700',
        recommendation: 'Tight execution margins. Test a plan variation with +60 days buffer or reduced scope to achieve a feasible score.'
      };
    }
    return {
      cardBg: 'bg-rose-50 text-rose-950 border-slate-900 shadow-[6px_6px_0px_#881337]',
      scoreText: 'text-rose-700',
      badge: 'bg-rose-400 text-white border-2 border-slate-900 shadow-[2px_2px_0px_#881337]',
      label: 'Impossible / Math Deficit',
      ledColor: 'bg-rose-500 shadow-[0_0_12px_#f43f5e]',
      iconColor: 'text-rose-700',
      recommendation: 'Severe math deficit. Current approach will lead to burnout. Review alternative paths or the critical stop signal.'
    };
  };

  const theme = getScoreTheme(data.reality_score);

  const handleCopySummary = () => {
    const textToCopy = `Reality Score: ${data.reality_score}/100 (${theme.label})\nConfidence: ${data.confidence_level}\n\nDiagnosis: ${data.summary}\n\nStop Signal: ${data.stop_signal}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  const handleCopyFullMarkdown = () => {
    const projTitle = currentAudit?.userInput.projectName || 'Project Feasibility Audit';
    const plan = currentAudit?.userInput.plan || data.summary;
    const assumptions = data.assumptions_used.map(a => `- ${a}`).join('\n');
    const risks = data.risks.map(r => `- **${r.description}** (Probability: ${r.probability}, Impact: ${r.impact})`).join('\n');
    const phases = data.realistic_plan.map(p => `### ${p.phase_name} (${p.duration})\n` + p.actions.map(a => `- ${a}`).join('\n')).join('\n\n');

    const markdown = `# Reality Check AI: ${projTitle}

**Reality Score**: ${data.reality_score} / 100 (${theme.label})
**Confidence Level**: ${data.confidence_level}

---

## 🎯 The Plan Audited
${plan}

## 🔍 Failure Diagnosis
> ${data.summary}

## 🛑 Critical Stop Signal
> **${data.stop_signal}**

## 📌 Key Assumptions
${assumptions}

## ⚠️ Identified Failure Risks
${risks}

## 🗺️ Calibrated Execution Roadmap
${phases}

---
*Generated by Reality Check AI — Evidence-grounded feasibility engine.*`;

    navigator.clipboard.writeText(markdown);
    setCopiedFull(true);
    setTimeout(() => setCopiedFull(false), 2000);
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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pop-in">
      
      {/* 3D Tactile Physical Score Meter Card */}
      <div
        ref={meterRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `perspective(1000px) rotateX(${cardTilt.x}deg) rotateY(${cardTilt.y}deg)`,
          transition: 'transform 0.15s ease-out'
        }}
        className={`col-span-1 rounded-2xl border-3 p-6 sm:p-7 flex flex-col items-center justify-between text-center relative overflow-hidden select-none neo-3d-card ${theme.cardBg}`}
      >
        {/* Physical 3D Screws in Corners */}
        <div className="absolute top-2.5 left-2.5 w-2.5 h-2.5 rounded-full border border-slate-400 bg-slate-300 shadow-inner" />
        <div className="absolute top-2.5 right-2.5 w-2.5 h-2.5 rounded-full border border-slate-400 bg-slate-300 shadow-inner" />
        <div className="absolute bottom-2.5 left-2.5 w-2.5 h-2.5 rounded-full border border-slate-400 bg-slate-300 shadow-inner" />
        <div className="absolute bottom-2.5 right-2.5 w-2.5 h-2.5 rounded-full border border-slate-400 bg-slate-300 shadow-inner" />

        {/* Top Physical Status LED */}
        <div className="flex items-center gap-2 mb-2">
          <div className={`w-3.5 h-3.5 rounded-full border-2 border-slate-900 ${theme.ledColor} animate-pulse`} />
          <span className="text-[11px] font-black uppercase tracking-widest text-slate-800">
            Reality Dial
          </span>
        </div>

        {/* Embossed Circular Gauge Display */}
        <div className="relative my-2 w-36 h-36 rounded-full border-4 border-slate-900 bg-white flex flex-col items-center justify-center shadow-[inset_0_4px_8px_rgba(0,0,0,0.15),0_6px_0px_#0f172a] transform hover:scale-105 transition-transform duration-200">
          <div className={`text-6xl font-black tracking-tighter ${theme.scoreText} tabular-nums`}>
            {displayScore}
          </div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
            / 100 PTS
          </span>
        </div>

        {/* Bottom Physical 3D Badge */}
        <div className="w-full space-y-2 mt-2">
          <div className={`inline-flex items-center px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider ${theme.badge}`}>
            <span>{theme.label}</span>
          </div>
          <p className="text-[11px] text-slate-700 font-medium leading-tight px-1">
            {theme.recommendation}
          </p>
        </div>
      </div>

      {/* Failure Diagnosis Card with 3D Depth */}
      <div className="col-span-1 md:col-span-2 bg-white rounded-2xl border-3 border-slate-900 p-6 sm:p-7 flex flex-col justify-between shadow-[6px_6px_0px_#0f172a] relative">
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <span className="w-3 h-5 bg-indigo-600 rounded-xs border border-slate-900 shadow-[1px_1px_0px_#0f172a]" />
              Failure Diagnosis
            </h3>
            
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-slate-800 font-bold px-2.5 py-1 rounded-lg bg-slate-100 border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a]">
                Confidence: <strong className={data.confidence_level === 'High' ? 'text-emerald-700' : 'text-amber-700'}>{data.confidence_level}</strong>
              </span>

              <button
                type="button"
                onClick={handleCopySummary}
                className="neo-3d-btn px-2.5 py-1 bg-white hover:bg-slate-50 text-xs font-black text-slate-900 rounded-lg flex items-center gap-1.5"
                title="Copy diagnosis summary"
              >
                {copiedSummary ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-600" />
                    <span>Summary</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleCopyFullMarkdown}
                className="neo-3d-btn px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-xs font-black text-indigo-950 rounded-lg flex items-center gap-1.5"
                title="Copy entire audit as Markdown (Notion, Slack, GitHub)"
              >
                {copiedFull ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">Markdown Copied!</span>
                  </>
                ) : (
                  <>
                    <FileDown className="w-3.5 h-3.5 text-indigo-700" />
                    <span>Copy Full Markdown</span>
                  </>
                )}
              </button>
            </div>
          </div>
          
          <div className="relative bg-slate-50 border-2 border-slate-900 p-4 sm:p-5 rounded-xl shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)]">
            <p className="text-slate-800 leading-relaxed text-sm sm:text-base font-medium">
              "{data.summary}"
            </p>
          </div>
        </div>
        
        <div className="mt-5 pt-4 border-t-2 border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h4 className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2">
              Key Assumptions Made
            </h4>
            <div className="flex flex-wrap gap-2">
              {data.assumptions_used.map((assumption, idx) => (
                <span
                  key={idx}
                  className="text-xs bg-white text-slate-900 font-bold px-3 py-1 rounded-lg border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a]"
                >
                  {assumption}
                </span>
              ))}
            </div>
          </div>

          {onOpenVariationModal && currentAudit?.userInput && (
            <button
              type="button"
              onClick={() => onOpenVariationModal(currentAudit.userInput)}
              className="neo-3d-btn-primary shrink-0 px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 self-start sm:self-center"
            >
              <GitFork className="w-4 h-4" />
              <span>Test Variation</span>
              <ArrowUpRight className="w-3.5 h-3.5 opacity-70" />
            </button>
          )}
        </div>
      </div>

      {/* Reality Score Evolution (Line Chart) */}
      <ScoreEvolutionChart
        currentAudit={activeAuditData}
        history={history}
        onSelectAudit={onSelectAudit}
        onOpenVariationModal={onOpenVariationModal}
      />

      {/* Critical Stop Signal Banner - Industrial 3D Warning Plaque */}
      <div className="col-span-1 md:col-span-3 bg-rose-50 border-3 border-rose-950 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-start gap-4 shadow-[6px_6px_0px_#881337] relative overflow-hidden">
        <div className="p-3 bg-rose-500 border-2 border-rose-950 rounded-xl text-white shadow-[2px_2px_0px_#881337] shrink-0 animate-bounce">
          <XCircle className="w-7 h-7" />
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <h4 className="text-rose-950 font-black text-sm uppercase tracking-widest">
              Critical Stop Signal
            </h4>
            <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping" />
          </div>
          <p className="text-rose-950 text-sm sm:text-base leading-relaxed font-bold">
            {data.stop_signal}
          </p>
        </div>
      </div>

    </div>
  );
};
