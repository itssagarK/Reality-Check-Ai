import React, { useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine
} from 'recharts';
import { SavedAudit, UserInput, RealityCheckResponse } from '../types';
import { getProjectId, getProjectTitle, getProjectIterations } from '../utils/projectUtils';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Sparkles,
  Layers,
  History,
  ArrowRight,
  PlusCircle,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Info
} from 'lucide-react';

interface ScoreEvolutionChartProps {
  currentAudit: { id?: string; projectId?: string; userInput: UserInput; result: RealityCheckResponse };
  history: SavedAudit[];
  onSelectAudit?: (audit: SavedAudit) => void;
  onOpenVariationModal?: (baseInput: UserInput) => void;
}

interface ChartPoint {
  index: number;
  iterationLabel: string;
  variationName: string;
  realityScore: number;
  confidence: string;
  status: 'Feasible' | 'Risky' | 'Impossible';
  dateStr: string;
  timeStr: string;
  planExcerpt: string;
  auditId: string;
  isCurrent: boolean;
  delta?: number;
  auditObj: SavedAudit;
}

export const ScoreEvolutionChart: React.FC<ScoreEvolutionChartProps> = ({
  currentAudit,
  history,
  onSelectAudit,
  onOpenVariationModal
}) => {
  const [viewMode, setViewMode] = useState<'project' | 'all'>('project');

  // Compute Project Iterations
  const projectAudits = getProjectIterations(currentAudit, history);

  // If current audit isn't in history yet, ensure it's included
  const currentId = currentAudit.id || 'current_active';
  const hasCurrentInProject = projectAudits.some((a) => a.id === currentAudit.id);

  let mergedProjectAudits = [...projectAudits];
  if (!hasCurrentInProject) {
    const tempAudit: SavedAudit = {
      id: currentId,
      timestamp: Date.now(),
      userInput: currentAudit.userInput,
      result: currentAudit.result,
      projectId: getProjectId(currentAudit),
      iteration: projectAudits.length + 1,
      variationLabel: currentAudit.userInput.variationLabel || `v${projectAudits.length + 1}`
    };
    mergedProjectAudits.push(tempAudit);
    mergedProjectAudits.sort((a, b) => a.timestamp - b.timestamp);
  }

  // Audits to display based on viewMode
  const activeAudits = viewMode === 'project' 
    ? mergedProjectAudits 
    : [...history].sort((a, b) => a.timestamp - b.timestamp);

  // Prepare Recharts dataset
  const chartData: ChartPoint[] = activeAudits.map((item, idx) => {
    const isCurrent = item.id === currentAudit.id || (item.id === currentId);
    const score = item.result.reality_score;
    const status: 'Feasible' | 'Risky' | 'Impossible' =
      score >= 75 ? 'Feasible' : score >= 40 ? 'Risky' : 'Impossible';
    
    const d = new Date(item.timestamp);
    const dateStr = d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    const timeStr = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const prevScore = idx > 0 ? activeAudits[idx - 1].result.reality_score : undefined;
    const delta = prevScore !== undefined ? score - prevScore : undefined;

    const label = item.variationLabel || item.userInput.variationLabel || `v${idx + 1}`;

    return {
      index: idx + 1,
      iterationLabel: label,
      variationName: item.userInput.variationLabel || `Iteration ${idx + 1}`,
      realityScore: score,
      confidence: item.result.confidence_level,
      status,
      dateStr,
      timeStr,
      planExcerpt: item.userInput.plan.slice(0, 75).trim() + (item.userInput.plan.length > 75 ? '...' : ''),
      auditId: item.id,
      isCurrent,
      delta,
      auditObj: item
    };
  });

  // Calculate high-level summary metrics
  const projectTitle = getProjectTitle(currentAudit);
  const baselineScore = chartData.length > 0 ? chartData[0].realityScore : currentAudit.result.reality_score;
  const currentScore = currentAudit.result.reality_score;
  const overallDelta = currentScore - baselineScore;
  const highestScore = chartData.reduce((max, pt) => Math.max(max, pt.realityScore), 0);

  // Custom Dot component for Recharts
  const CustomDot = (props: any) => {
    const { cx, cy, payload } = props;
    if (cx == null || cy == null || isNaN(cx) || isNaN(cy)) return null;

    const isCurrent = payload?.isCurrent;
    const score = payload?.realityScore ?? 0;
    const color = score >= 75 ? '#059669' : score >= 40 ? '#d97706' : '#e11d48';

    return (
      <g
        className="cursor-pointer transition-transform hover:scale-125"
        onClick={() => {
          if (payload?.auditObj && onSelectAudit) {
            onSelectAudit(payload.auditObj);
          }
        }}
      >
        {isCurrent && (
          <circle
            cx={cx}
            cy={cy}
            r={13}
            fill="none"
            stroke="#4f46e5"
            strokeWidth={2}
            strokeDasharray="4 2"
            opacity={0.7}
          />
        )}
        <circle
          cx={cx}
          cy={cy}
          r={isCurrent ? 7 : 5}
          fill={color}
          stroke="#ffffff"
          strokeWidth={2.5}
        />
      </g>
    );
  };

  // Custom Tooltip component for Recharts in Light Mode
  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload || !payload.length) return null;
    const data = payload[0].payload as ChartPoint;

    const statusBadgeClass =
      data.realityScore >= 75
        ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
        : data.realityScore >= 40
        ? 'bg-amber-100 text-amber-800 border-amber-300'
        : 'bg-rose-100 text-rose-800 border-rose-300';

    return (
      <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xl max-w-xs text-xs z-50">
        <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-slate-100">
          <div className="flex items-center gap-1.5 font-bold text-slate-900">
            <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
            <span>{data.variationName}</span>
          </div>
          {data.isCurrent && (
            <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
              Active
            </span>
          )}
        </div>

        <div className="flex items-baseline justify-between mb-2">
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black tracking-tight text-slate-900 tabular-nums">
              {data.realityScore}
            </span>
            <span className="text-slate-400 text-[11px]">/ 100</span>
          </div>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${statusBadgeClass}`}>
            {data.status}
          </span>
        </div>

        {data.delta !== undefined && data.delta !== 0 && (
          <div className="flex items-center gap-1 mb-2 font-medium">
            {data.delta > 0 ? (
              <span className="text-emerald-700 flex items-center gap-0.5">
                <TrendingUp className="w-3.5 h-3.5" /> +{data.delta} pts vs previous
              </span>
            ) : (
              <span className="text-rose-700 flex items-center gap-0.5">
                <TrendingDown className="w-3.5 h-3.5" /> {data.delta} pts vs previous
              </span>
            )}
          </div>
        )}

        <div className="text-slate-600 text-[11px] leading-relaxed mb-2 bg-slate-50 p-2 rounded-lg border border-slate-200 italic">
          "{data.planExcerpt}"
        </div>

        <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
          <span>{data.dateStr} at {data.timeStr}</span>
          <span className="text-indigo-600 font-bold hover:underline">Click to view</span>
        </div>
      </div>
    );
  };

  return (
    <div className="col-span-1 md:col-span-3 bg-white rounded-2xl border-3 border-slate-900 p-6 sm:p-7 shadow-[8px_8px_0px_#0f172a] relative overflow-hidden transition-all duration-300">
      
      {/* Top Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b-2 border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-indigo-600 text-white border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a]">
              <TrendingUp className="w-4 h-4" />
            </span>
            <h3 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
              Reality Score Evolution
              <span className="text-xs font-bold text-slate-500">
                ({viewMode === 'project' ? 'Project Iterations' : 'All Audits'})
              </span>
            </h3>
          </div>
          <p className="text-xs text-slate-500 flex items-center gap-1.5 font-medium">
            <span className="text-slate-900 font-bold truncate max-w-xs">{projectTitle}</span>
            <span className="text-slate-300">•</span>
            <span>{chartData.length} {chartData.length === 1 ? 'iteration' : 'iterations'} recorded</span>
          </p>
        </div>

        {/* Action Controls & View Switcher */}
        <div className="flex items-center gap-2 flex-wrap">
          {history.length > projectAudits.length && (
            <div className="bg-slate-100 p-1 rounded-xl border-2 border-slate-900 flex items-center text-xs shadow-[2px_2px_0px_#0f172a]">
              <button
                type="button"
                onClick={() => setViewMode('project')}
                className={`px-3 py-1 rounded-lg font-black transition-all ${
                  viewMode === 'project'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-700 hover:text-slate-950'
                }`}
              >
                Project ({projectAudits.length})
              </button>
              <button
                type="button"
                onClick={() => setViewMode('all')}
                className={`px-3 py-1 rounded-lg font-black transition-all ${
                  viewMode === 'all'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-700 hover:text-slate-950'
                }`}
              >
                All Audits ({history.length})
              </button>
            </div>
          )}

          {onOpenVariationModal && (
            <button
              type="button"
              onClick={() => onOpenVariationModal(currentAudit.userInput)}
              className="neo-3d-btn-primary px-3.5 py-1.5 rounded-xl font-black text-xs flex items-center gap-1.5"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              Test Plan Variation
            </button>
          )}
        </div>
      </div>

      {/* Trajectory KPI Strip with 3D Blocks */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="bg-slate-50 p-3.5 rounded-xl border-2 border-slate-900 shadow-[3px_3px_0px_#0f172a]">
          <div className="text-[10px] uppercase font-black text-slate-500 tracking-wider mb-1">
            Current Score
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-indigo-700 tabular-nums">{currentScore}</span>
            <span className="text-[11px] text-slate-500 font-bold">/ 100</span>
          </div>
        </div>

        <div className="bg-slate-50 p-3.5 rounded-xl border-2 border-slate-900 shadow-[3px_3px_0px_#0f172a]">
          <div className="text-[10px] uppercase font-black text-slate-500 tracking-wider mb-1">
            Baseline (v1)
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-slate-700 tabular-nums">{baselineScore}</span>
            <span className="text-[11px] text-slate-500 font-bold">initial</span>
          </div>
        </div>

        <div className="bg-slate-50 p-3.5 rounded-xl border-2 border-slate-900 shadow-[3px_3px_0px_#0f172a]">
          <div className="text-[10px] uppercase font-black text-slate-500 tracking-wider mb-1">
            Net Trajectory
          </div>
          <div className="flex items-center gap-1 text-sm font-black">
            {overallDelta > 0 ? (
              <span className="text-emerald-700 flex items-center gap-0.5 text-base">
                <TrendingUp className="w-4 h-4" /> +{overallDelta} pts
              </span>
            ) : overallDelta < 0 ? (
              <span className="text-rose-700 flex items-center gap-0.5 text-base">
                <TrendingDown className="w-4 h-4" /> {overallDelta} pts
              </span>
            ) : (
              <span className="text-slate-500 flex items-center gap-0.5 text-base">
                <Minus className="w-4 h-4" /> Baseline
              </span>
            )}
          </div>
        </div>

        <div className="bg-slate-50 p-3.5 rounded-xl border-2 border-slate-900 shadow-[3px_3px_0px_#0f172a]">
          <div className="text-[10px] uppercase font-black text-slate-500 tracking-wider mb-1">
            Peak Feasibility
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-emerald-700 tabular-nums">{highestScore}</span>
            <span className="text-[11px] text-slate-500 font-bold">max</span>
          </div>
        </div>
      </div>

      {/* Main Recharts Line Chart Container */}
      <div className="w-full h-64 min-w-0 relative">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 18, right: 30, left: -10, bottom: 8 }}
          >
            <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="iterationLabel"
              stroke="#94a3b8"
              tick={{ fill: '#475569', fontSize: 12, fontWeight: 600 }}
              axisLine={{ stroke: '#cbd5e1' }}
              tickLine={{ stroke: '#cbd5e1' }}
            />
            <YAxis
              domain={[0, 100]}
              ticks={[0, 25, 50, 75, 100]}
              stroke="#94a3b8"
              tick={{ fill: '#64748b', fontSize: 11 }}
              axisLine={{ stroke: '#cbd5e1' }}
              tickLine={{ stroke: '#cbd5e1' }}
            />

            {/* Threshold Reference Lines */}
            <ReferenceLine
              y={75}
              stroke="#059669"
              strokeDasharray="4 4"
              strokeWidth={1.5}
              opacity={0.7}
              label={{
                value: 'Feasible (75+)',
                fill: '#059669',
                fontSize: 10,
                fontWeight: 600,
                position: 'insideTopRight'
              }}
            />
            <ReferenceLine
              y={40}
              stroke="#d97706"
              strokeDasharray="4 4"
              strokeWidth={1.5}
              opacity={0.7}
              label={{
                value: 'Risky (40)',
                fill: '#d97706',
                fontSize: 10,
                fontWeight: 600,
                position: 'insideTopRight'
              }}
            />

            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#6366f1', strokeWidth: 1, strokeDasharray: '4 4' }} />

            <Line
              type="monotone"
              dataKey="realityScore"
              stroke="#4f46e5"
              strokeWidth={3.5}
              dot={<CustomDot />}
              activeDot={{
                r: 8,
                stroke: '#ffffff',
                strokeWidth: 2,
                fill: '#4f46e5'
              }}
              animationDuration={600}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Threshold Zone Legend */}
      <div className="flex items-center justify-between flex-wrap gap-2 text-[11px] text-slate-500 mt-2 px-1">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
            <span className="font-medium text-slate-700">Feasible (75-100)</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <span className="font-medium text-slate-700">Risky (40-74)</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-600"></span>
            <span className="font-medium text-slate-700">Impossible (&lt;40)</span>
          </span>
        </div>
        <span className="text-slate-400 text-[10px]">
          Click any point to review that iteration's full report
        </span>
      </div>

      {/* Iteration Interactive Switcher Pill Bar */}
      <div className="mt-5 pt-4 border-t border-slate-100">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-indigo-600" />
            Iteration History & Variations
          </span>
          {chartData.length > 1 && (
            <span className="text-[10px] text-slate-400">
              Click to switch active audit
            </span>
          )}
        </div>

        {chartData.length === 1 ? (
          <div className="p-4 rounded-xl bg-slate-50 border-2 border-slate-900 shadow-[3px_3px_0px_#0f172a] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5 text-slate-800 font-medium">
              <Info className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>
                <strong>Baseline audit recorded.</strong> Try testing a variation with modified timeline, budget, or scope to see your Reality Score improve!
              </span>
            </div>
            {onOpenVariationModal && (
              <button
                type="button"
                onClick={() => onOpenVariationModal(currentAudit.userInput)}
                className="neo-3d-btn shrink-0 px-3.5 py-1.5 rounded-lg bg-indigo-100 hover:bg-indigo-200 text-slate-900 border-2 border-slate-900 text-xs font-black flex items-center gap-1.5"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                Create Iteration #2
              </button>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2.5 overflow-x-auto pb-2 custom-scrollbar">
            {chartData.map((pt, idx) => {
              const isSelected = pt.isCurrent;
              const scoreBadgeColor =
                pt.realityScore >= 75
                  ? 'text-emerald-950 bg-emerald-300 border-slate-900'
                  : pt.realityScore >= 40
                  ? 'text-amber-950 bg-amber-300 border-slate-900'
                  : 'text-rose-950 bg-rose-300 border-slate-900';

              return (
                <button
                  key={pt.auditId || idx}
                  type="button"
                  onClick={() => {
                    if (onSelectAudit && pt.auditObj) {
                      onSelectAudit(pt.auditObj);
                    }
                  }}
                  className={`group shrink-0 px-3 py-2 rounded-xl text-xs font-black border-2 border-slate-900 transition-all flex items-center gap-2 ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] translate-y-0.5'
                      : 'bg-white text-slate-900 hover:bg-slate-50 shadow-[2px_2px_0px_#0f172a] hover:shadow-[3px_3px_0px_#0f172a] hover:-translate-y-0.5'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-white' : 'bg-slate-400'}`} />
                  <span>{pt.iterationLabel}</span>
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-black border ${scoreBadgeColor}`}>
                    {pt.realityScore}
                  </span>
                  {isSelected && (
                    <span className="text-[9px] uppercase tracking-wider text-slate-900 font-black bg-white px-1.5 py-0.5 rounded">
                      Active
                    </span>
                  )}
                </button>
              );
            })}

            {onOpenVariationModal && (
              <button
                type="button"
                onClick={() => onOpenVariationModal(currentAudit.userInput)}
                className="shrink-0 px-3.5 py-2 rounded-xl text-xs font-black border-2 border-dashed border-slate-400 bg-white hover:border-slate-900 hover:bg-indigo-50 text-slate-800 transition-all flex items-center gap-1.5 shadow-[2px_2px_0px_#cbd5e1] hover:shadow-[2px_2px_0px_#0f172a]"
                title="Create another variation"
              >
                <PlusCircle className="w-3.5 h-3.5 text-indigo-600" />
                <span>+ Variation</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
