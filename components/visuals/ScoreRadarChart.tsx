import React, { useState } from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Tooltip
} from 'recharts';
import { ScoreBreakdown, ProblemSolutionDetail } from '../../types';
import { PieChart as PieIcon, Compass, ChevronDown, ChevronUp, ArrowRight, AlertTriangle, Sparkles, CheckCircle2 } from 'lucide-react';
import { formatINR } from '../../utils/currencyUtils';

interface ScoreRadarChartProps {
  breakdown: ScoreBreakdown;
  onSelectProblemSolution?: (item: ProblemSolutionDetail) => void;
  problemSolutions?: ProblemSolutionDetail[];
}

// Classic Blue & Red harmonious palette
const SLICE_COLORS: Record<string, string> = {
  Technology: '#2563eb', // classic blue
  Budget: '#1d4ed8',     // deep blue
  Timeline: '#dc2626',   // classic red
  Skills: '#3b82f6',     // bright blue
  Market: '#b91c1c',     // dark red
  'Risk Safety': '#475569' // slate
};

export const ScoreRadarChart: React.FC<ScoreRadarChartProps> = ({
  breakdown,
  onSelectProblemSolution,
  problemSolutions = []
}) => {
  const [chartMode, setChartMode] = useState<'pie' | 'radar'>('pie');
  const [activeSliceIndex, setActiveSliceIndex] = useState<number | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const data = [
    { factor: 'Technology', score: breakdown.technology, fullMark: 100, desc: 'Technical complexity and stack maturity in Indian ecosystem.' },
    { factor: 'Budget', score: breakdown.budget, fullMark: 100, desc: 'Runway vs cloud infrastructure and local SaaS costs in ₹ INR.' },
    { factor: 'Timeline', score: breakdown.time, fullMark: 100, desc: 'Delivery realism against real-world Indian sprint cycle times.' },
    { factor: 'Skills', score: breakdown.skills, fullMark: 100, desc: 'Builder competency across required backend & payment domains.' },
    { factor: 'Market', score: breakdown.market, fullMark: 100, desc: 'Pre-validated Indian customer demand and willingness to pay.' },
    { factor: 'Risk Safety', score: breakdown.risk, fullMark: 100, desc: 'Low failure density, legal/UPI compliance, and safety margin.' },
  ];

  const weakest = data.reduce((min, d) => (d.score < min.score ? d : min), data[0]);

  const handleDimensionClick = (factorName: string, score: number, index?: number) => {
    if (index !== undefined) {
      setActiveSliceIndex(index);
    }

    if (onSelectProblemSolution) {
      // Find matching item in problemSolutions or create a rich fallback in INR
      const factorKeyMap: Record<string, string> = {
        Technology: 'technology',
        Budget: 'budget',
        Timeline: 'time',
        Skills: 'skills',
        Market: 'market',
        'Risk Safety': 'risk'
      };

      const matched = problemSolutions.find(
        (ps) => ps.factorKey === factorKeyMap[factorName] || ps.sectorName.toLowerCase().includes(factorName.toLowerCase())
      );

      if (matched) {
        onSelectProblemSolution(matched);
      } else {
        const fallbackItem: ProblemSolutionDetail = {
          id: `ps-${factorName.toLowerCase()}`,
          sectorName: `${factorName} Feasibility`,
          factorKey: factorKeyMap[factorName] || 'technology',
          severity: score < 40 ? 'Critical' : score < 70 ? 'High' : 'Medium',
          percentage: score,
          problem: `Feasibility rating of ${score}/100 in ${factorName} indicates severe delivery friction under current constraints.`,
          rootCause: `Over-allocation of scope and dependencies without adequate validation in the Indian market.`,
          solution: `De-scope non-critical dependencies; adopt lean monolithic architecture with pre-built UI components and managed database.`,
          financialImpactInr: `Saves an estimated ₹40,000 to ₹75,000 in development runway and cuts 4 weeks of engineering lag.`,
          actionableDeScopeStep: `Freeze MVP requirements strictly to 1 core user workflow and 1 primary payment method.`
        };
        onSelectProblemSolution(fallbackItem);
      }
    }
  };

  const CustomPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="bg-slate-900/95 backdrop-blur-md text-white p-3 rounded-2xl shadow-xl text-xs max-w-xs border border-slate-700">
          <div className="flex items-center justify-between gap-3 mb-1">
            <span className="font-bold text-slate-100">{item.factor}</span>
            <span className="font-mono font-bold text-blue-400">{item.score} / 100</span>
          </div>
          <p className="text-slate-300 leading-snug text-[11px] mb-1.5">{item.desc}</p>
          <div className="text-[11px] text-blue-300 font-semibold flex items-center gap-1">
            <span>👉 Click to view Problem & Solution</span>
          </div>
        </div>
      );
    }
    return null;
  };

  const CustomRadarTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="bg-slate-900/95 backdrop-blur-md text-white p-2.5 rounded-xl shadow-lg text-xs max-w-xs border border-slate-700">
          <div className="flex items-center justify-between gap-3 mb-1">
            <span className="font-bold text-slate-100">{item.factor}</span>
            <span className="font-mono font-bold text-blue-400">{item.score} / 100</span>
          </div>
          <p className="text-slate-300 leading-snug text-[11px]">{item.desc}</p>
          <div className="text-[10px] text-blue-300 font-medium mt-1">
            Click to view Problem & Solution
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-panel rounded-3xl p-6 shadow-glass flex flex-col justify-between">
      
      {/* Header */}
      <div>
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
              <PieIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-serif font-bold text-slate-900">
                Feasibility Breakdown & Diagnostic
              </h3>
              <p className="text-xs text-slate-500">
                Click any slice to view its diagnosed Problem & Solution
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* View Switcher: Pie Chart vs Radar Chart */}
            <div className="p-1 rounded-xl bg-slate-100 border border-slate-200 flex items-center text-xs shadow-xs">
              <button
                type="button"
                onClick={() => setChartMode('pie')}
                className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all flex items-center gap-1 ${
                  chartMode === 'pie'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="View as Pie Chart"
              >
                <PieIcon className="w-3 h-3" />
                <span>Pie Chart</span>
              </button>
              <button
                type="button"
                onClick={() => setChartMode('radar')}
                className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all flex items-center gap-1 ${
                  chartMode === 'radar'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="View as Radar Chart"
              >
                <Compass className="w-3 h-3" />
                <span>Radar</span>
              </button>
            </div>

            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-xs text-slate-500 hover:text-slate-900 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
            >
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* 1-Line Takeaway in Classic Blue & Red with Click-to-Inspect Action */}
        <div
          onClick={() => handleDimensionClick(weakest.factor, weakest.score)}
          className="my-2.5 px-3.5 py-2.5 rounded-2xl bg-red-50/80 border border-red-200 text-xs text-slate-700 flex items-center justify-between gap-2 cursor-pointer hover:bg-red-100/70 transition-colors group shadow-xs"
        >
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
            <div>
              <strong className="text-red-700 font-bold">Primary Bottleneck: </strong>
              <span className="font-semibold text-slate-800">{weakest.factor} ({weakest.score}/100)</span> — Click to view problem diagnosis & solution.
            </div>
          </div>
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-700 bg-white/90 px-2.5 py-1 rounded-xl border border-red-200 shrink-0 group-hover:bg-red-600 group-hover:text-white transition-all shadow-xs">
            <span>Fix Solution</span>
            <ArrowRight className="w-3 h-3" />
          </span>
        </div>
      </div>

      {/* Main Chart Area: Pie Chart (Proper Visualisation) or Radar Chart */}
      <div className="w-full my-2">
        {chartMode === 'pie' ? (
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
            {/* Interactive Pie Chart */}
            <div className="sm:col-span-6 h-56 relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip content={<CustomPieTooltip />} />
                  <Pie
                    data={data}
                    dataKey="score"
                    nameKey="factor"
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    cursor="pointer"
                    onClick={(entry, index) => handleDimensionClick(entry.factor, entry.score, index)}
                  >
                    {data.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={SLICE_COLORS[entry.factor] || '#2563eb'}
                        stroke={activeSliceIndex === index ? '#1d4ed8' : '#ffffff'}
                        strokeWidth={activeSliceIndex === index ? 3 : 1}
                        className="transition-transform duration-300 hover:scale-105"
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>

              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                <span className="text-base font-bold font-serif text-slate-900 leading-none">
                  {Math.round(data.reduce((a, b) => a + b.score, 0) / 6)}
                </span>
                <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400 mt-1">
                  Average / 100
                </span>
              </div>
            </div>

            {/* Clickable Legend with Direct Problem & Solution Redirect */}
            <div className="sm:col-span-6 space-y-1.5 text-xs">
              {data.map((item, idx) => {
                const color = SLICE_COLORS[item.factor] || '#2563eb';
                const isSelected = activeSliceIndex === idx;
                return (
                  <div
                    key={idx}
                    onClick={() => handleDimensionClick(item.factor, item.score, idx)}
                    className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2 group ${
                      isSelected
                        ? 'bg-blue-50/95 border-blue-600 shadow-xs ring-1 ring-blue-500'
                        : 'bg-white hover:bg-slate-50 border-slate-300 hover:border-blue-400 shadow-2xs'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0 group-hover:scale-125 transition-transform"
                        style={{ backgroundColor: color }}
                      />
                      <span className="font-semibold text-slate-800 text-[11px] group-hover:text-blue-700 truncate">
                        {item.factor}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 font-mono text-[11px]">
                      <span className={`font-bold px-1.5 py-0.2 rounded text-[10px] ${
                        item.score >= 70 ? 'bg-blue-50 text-blue-700' : item.score >= 40 ? 'bg-amber-50 text-amber-800' : 'bg-red-50 text-red-700 font-black'
                      }`}>
                        {item.score}%
                      </span>
                      <ArrowRight className="w-3 h-3 text-slate-300 group-hover:text-blue-600 transition-colors" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* Radar Chart View */
          <div className="w-full h-60 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="72%" data={data}>
                <PolarGrid stroke="#cbd5e1" strokeDasharray="3 3" />
                <PolarAngleAxis
                  dataKey="factor"
                  tick={{ fill: '#334155', fontSize: 11, fontWeight: 600 }}
                />
                <PolarRadiusAxis
                  angle={30}
                  domain={[0, 100]}
                  tick={{ fill: '#64748b', fontSize: 9 }}
                  stroke="#cbd5e1"
                />
                <Tooltip content={<CustomRadarTooltip />} />
                <Radar
                  name="Feasibility"
                  dataKey="score"
                  stroke="#2563eb"
                  fill="#3b82f6"
                  fillOpacity={0.25}
                  strokeWidth={2.5}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Interactive Guidance Banner */}
      <div className="p-2.5 rounded-2xl bg-gradient-to-r from-blue-50/80 to-slate-50 border border-blue-100 flex items-center justify-between text-xs my-1">
        <div className="flex items-center gap-2 text-slate-700 text-[11px]">
          <Sparkles className="w-3.5 h-3.5 text-blue-600 shrink-0" />
          <span>Click any pie slice to inspect the <strong>Problem & Solution</strong></span>
        </div>
        <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider hidden sm:inline">
          Interactive
        </span>
      </div>

      {/* Expandable Details Grid */}
      {isExpanded && (
        <div className="pt-3 border-t border-slate-200 grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs animate-fade-in">
          {data.map((item, idx) => (
            <div
              key={idx}
              onClick={() => handleDimensionClick(item.factor, item.score, idx)}
              className="p-2.5 rounded-xl bg-white/70 border border-slate-200/80 hover:border-blue-300 cursor-pointer"
            >
              <div className="flex justify-between items-center mb-0.5">
                <span className="font-bold text-slate-700">{item.factor}</span>
                <span className={`font-mono font-bold ${
                  item.score >= 70 ? 'text-blue-600' : item.score >= 40 ? 'text-amber-600' : 'text-red-600'
                }`}>
                  {item.score}%
                </span>
              </div>
              <p className="text-[10px] text-slate-500 leading-snug line-clamp-2">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      )}

      <div className="text-[10px] text-slate-400 pt-2 border-t border-slate-100 flex justify-between">
        <span>Evaluated on 6 engineering vectors</span>
        <span className="font-mono font-bold text-slate-700">Mean: {Math.round(data.reduce((a, b) => a + b.score, 0) / 6)}%</span>
      </div>

    </div>
  );
};
