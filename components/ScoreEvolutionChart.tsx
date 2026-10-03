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
  Layers,
  PlusCircle,
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
  const projectTitle = getProjectTitle(currentAudit);

  const displayAudits: SavedAudit[] = viewMode === 'project'
    ? projectAudits
    : [...history].reverse();

  if (displayAudits.length === 0) {
    return null;
  }

  // Format data points for Recharts
  const chartData: ChartPoint[] = displayAudits.map((audit, idx) => {
    const isCurrent = audit.id === currentAudit.id;
    const date = new Date(audit.timestamp);
    const dateStr = date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    const timeStr = date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });

    const prevScore = idx > 0 ? displayAudits[idx - 1].result.reality_score : undefined;
    const currentScore = audit.result.reality_score;
    const delta = prevScore !== undefined ? currentScore - prevScore : undefined;

    const label = audit.variationLabel || (viewMode === 'project' ? `v${idx + 1}` : `#${idx + 1}`);

    const status: 'Feasible' | 'Risky' | 'Impossible' =
      currentScore >= 75 ? 'Feasible' : currentScore >= 40 ? 'Risky' : 'Impossible';

    return {
      index: idx + 1,
      iterationLabel: label,
      variationName: audit.userInput.projectName || `Iteration ${idx + 1}`,
      realityScore: currentScore,
      confidence: audit.result.confidence_level,
      status,
      dateStr,
      timeStr,
      planExcerpt: audit.userInput.plan.slice(0, 80) + (audit.userInput.plan.length > 80 ? '...' : ''),
      auditId: audit.id,
      isCurrent,
      delta,
      auditObj: audit
    };
  });

  const currentScore = currentAudit.result.reality_score;
  const baselineScore = chartData[0]?.realityScore ?? currentScore;
  const overallDelta = currentScore - baselineScore;
  const highestScore = Math.max(...chartData.map(d => d.realityScore));

  const CustomDot = (props: any) => {
    const { cx, cy, payload } = props;
    if (cx === undefined || cy === undefined) return null;

    const isCurrent = payload.isCurrent;
    const fillColor =
      payload.realityScore >= 75
        ? '#2563eb'
        : payload.realityScore >= 40
        ? '#d97706'
        : '#dc2626';

    return (
      <g>
        {isCurrent && (
          <circle
            cx={cx}
            cy={cy}
            r={10}
            fill={fillColor}
            fillOpacity={0.2}
            className="animate-ping"
          />
        )}
        <circle
          cx={cx}
          cy={cy}
          r={isCurrent ? 6 : 4.5}
          fill={isCurrent ? fillColor : '#ffffff'}
          stroke={fillColor}
          strokeWidth={isCurrent ? 3 : 2}
        />
      </g>
    );
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload || !payload.length) return null;
    const data: ChartPoint = payload[0].payload;

    const statusBadgeClass =
      data.status === 'Feasible'
        ? 'bg-blue-50 text-blue-700 border-blue-200'
        : data.status === 'Risky'
        ? 'bg-amber-50 text-amber-800 border-amber-200'
        : 'bg-red-50 text-red-700 border-red-200';

    return (
      <div className="bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-slate-200 max-w-xs text-xs animate-fade-in">
        <div className="flex items-center justify-between gap-2 mb-2 pb-1.5 border-b border-slate-100">
          <span className="font-bold text-slate-800">{data.iterationLabel}</span>
          {data.isCurrent && (
            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-blue-600 text-white uppercase tracking-wider">
              Active
            </span>
          )}
        </div>

        <div className="flex items-baseline justify-between mb-2">
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold tracking-tight text-slate-900 tabular-nums">
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
              <span className="text-blue-700 flex items-center gap-0.5">
                <TrendingUp className="w-3.5 h-3.5" /> +{data.delta} pts vs previous
              </span>
            ) : (
              <span className="text-red-700 flex items-center gap-0.5">
                <TrendingDown className="w-3.5 h-3.5" /> {data.delta} pts vs previous
              </span>
            )}
          </div>
        )}

        <div className="text-slate-600 text-[11px] leading-relaxed mb-2 bg-slate-50 p-2 rounded-xl border border-slate-200 italic">
          "{data.planExcerpt}"
        </div>

        <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
          <span>{data.dateStr} at {data.timeStr}</span>
          <span className="text-blue-600 font-bold hover:underline">Click to view</span>
        </div>
      </div>
    );
  };

  return (
    <div className="glass-panel rounded-3xl p-6 sm:p-8 shadow-glass relative overflow-hidden transition-all duration-300">
      
      {/* Top Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
              <TrendingUp className="w-4 h-4" />
            </span>
            <h3 className="text-base font-serif font-bold text-slate-900 tracking-tight flex items-center gap-2">
              Feasibility Score Trajectory
              <span className="text-xs font-normal text-slate-500 font-sans">
                ({viewMode === 'project' ? 'Project Iterations' : 'All Audits'})
              </span>
            </h3>
          </div>
          <p className="text-xs text-slate-500 flex items-center gap-1.5 font-medium">
            <span className="text-slate-800 font-bold truncate max-w-xs">{projectTitle}</span>
            <span className="text-slate-300">•</span>
            <span>{chartData.length} {chartData.length === 1 ? 'iteration' : 'iterations'} recorded</span>
          </p>
        </div>

        {/* Action Controls & View Switcher */}
        <div className="flex items-center gap-2 flex-wrap">
          {history.length > projectAudits.length && (
            <div className="bg-slate-100 p-1 rounded-xl border border-slate-200 flex items-center text-xs shadow-xs">
              <button
                type="button"
                onClick={() => setViewMode('project')}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  viewMode === 'project'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-700 hover:text-slate-950'
                }`}
              >
                Project ({projectAudits.length})
              </button>
              <button
                type="button"
                onClick={() => setViewMode('all')}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  viewMode === 'all'
                    ? 'bg-blue-600 text-white shadow-xs'
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
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-all shadow-sm shadow-blue-500/25"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Test De-scoped Iteration</span>
            </button>
          )}
        </div>
      </div>

      {/* Trajectory KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="bg-white/70 backdrop-blur-md p-3.5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">
            Current Score
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-serif font-bold text-slate-900 tabular-nums">{currentScore}</span>
            <span className="text-[11px] text-slate-400 font-medium">/ 100</span>
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-md p-3.5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">
            Baseline (v1)
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-serif font-bold text-slate-700 tabular-nums">{baselineScore}</span>
            <span className="text-[11px] text-slate-400 font-medium">initial</span>
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-md p-3.5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">
            Net Trajectory
          </div>
          <div className="flex items-center gap-1 text-sm font-bold">
            {overallDelta > 0 ? (
              <span className="text-blue-600 flex items-center gap-0.5 text-base font-serif">
                <TrendingUp className="w-4 h-4" /> +{overallDelta} pts
              </span>
            ) : overallDelta < 0 ? (
              <span className="text-red-600 flex items-center gap-0.5 text-base font-serif">
                <TrendingDown className="w-4 h-4" /> {overallDelta} pts
              </span>
            ) : (
              <span className="text-slate-500 flex items-center gap-0.5 text-base font-serif">
                <Minus className="w-4 h-4" /> Baseline
              </span>
            )}
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-md p-3.5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">
            Peak Feasibility
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-serif font-bold text-blue-600 tabular-nums">{highestScore}</span>
            <span className="text-[11px] text-slate-400 font-medium">max</span>
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
              stroke="#2563eb"
              strokeDasharray="4 4"
              strokeWidth={1.5}
              opacity={0.8}
              label={{
                value: 'Feasible (75+)',
                fill: '#2563eb',
                fontSize: 10,
                fontWeight: 600,
                position: 'insideTopRight'
              }}
            />
            <ReferenceLine
              y={40}
              stroke="#dc2626"
              strokeDasharray="4 4"
              strokeWidth={1.5}
              opacity={0.8}
              label={{
                value: 'Fatal Deficit (<40)',
                fill: '#dc2626',
                fontSize: 10,
                fontWeight: 600,
                position: 'insideTopRight'
              }}
            />

            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#2563eb', strokeWidth: 1, strokeDasharray: '4 4' }} />

            <Line
              type="monotone"
              dataKey="realityScore"
              stroke="#2563eb"
              strokeWidth={3}
              dot={<CustomDot />}
              activeDot={{
                r: 8,
                stroke: '#ffffff',
                strokeWidth: 2,
                fill: '#2563eb'
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
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
            <span className="font-semibold text-slate-700">Feasible (75-100)</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <span className="font-semibold text-slate-700">Risky (40-74)</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600"></span>
            <span className="font-semibold text-slate-700">Impossible (&lt;40)</span>
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
            <Layers className="w-3.5 h-3.5 text-blue-600" />
            Iteration History & Variations
          </span>
          {chartData.length > 1 && (
            <span className="text-[10px] text-slate-400">
              Click to switch active audit
            </span>
          )}
        </div>

        {chartData.length === 1 ? (
          <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5 text-slate-700 font-medium">
              <Info className="w-4 h-4 text-blue-600 shrink-0" />
              <span>
                <strong>Baseline audit recorded.</strong> Try testing a variation with modified timeline, budget, or scope to see your Reality Score improve!
              </span>
            </div>
            {onOpenVariationModal && (
              <button
                type="button"
                onClick={() => onOpenVariationModal(currentAudit.userInput)}
                className="shrink-0 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Create Iteration #2</span>
              </button>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2.5 overflow-x-auto pb-2 custom-scrollbar">
            {chartData.map((pt, idx) => {
              const isSelected = pt.isCurrent;
              const scoreBadgeColor =
                pt.realityScore >= 75
                  ? 'text-blue-800 bg-blue-100 border-blue-200'
                  : pt.realityScore >= 40
                  ? 'text-amber-800 bg-amber-100 border-amber-200'
                  : 'text-red-800 bg-red-100 border-red-200';

              return (
                <button
                  key={pt.auditId || idx}
                  type="button"
                  onClick={() => {
                    if (onSelectAudit && pt.auditObj) {
                      onSelectAudit(pt.auditObj);
                    }
                  }}
                  className={`group shrink-0 px-3 py-2 rounded-2xl text-xs font-medium border transition-all flex items-center gap-2 ${
                    isSelected
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-white' : 'bg-slate-300'}`} />
                  <span className="font-semibold">{pt.iterationLabel}</span>
                  <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold border font-mono ${scoreBadgeColor}`}>
                    {pt.realityScore}
                  </span>
                  {isSelected && (
                    <span className="text-[9px] uppercase tracking-wider text-blue-900 font-bold bg-white/80 px-1.5 py-0.5 rounded">
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
                className="shrink-0 px-3.5 py-2 rounded-2xl text-xs font-semibold border border-dashed border-slate-300 bg-transparent hover:border-blue-500 hover:text-blue-600 text-slate-600 transition-all flex items-center gap-1.5"
                title="Create another variation"
              >
                <PlusCircle className="w-3.5 h-3.5 text-blue-600" />
                <span>+ Variation</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
