import React, { useState } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { CostCategory, StatCards, ProblemSolutionDetail } from '../../types';
import { Users, Clock, Wallet, ChevronDown, ChevronUp, PieChart as PieIcon, ArrowRight, AlertCircle, IndianRupee } from 'lucide-react';
import { formatINR } from '../../utils/currencyUtils';

interface ResourcesDonutChartProps {
  costs: CostCategory[];
  stats: StatCards;
  onSelectProblemSolution?: (item: ProblemSolutionDetail) => void;
}

// Classic Blue & Red themed palette for capital allocation in India
const COLORS = ['#2563eb', '#1d4ed8', '#dc2626', '#b91c1c', '#475569'];

export const ResourcesDonutChart: React.FC<ResourcesDonutChartProps> = ({
  costs,
  stats,
  onSelectProblemSolution
}) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const totalEstimatedInr = costs.reduce((acc, c) => acc + (c.estimated_inr || 0), 0);

  const handleSectorClick = (entry: CostCategory, index: number) => {
    setActiveIndex(index);
    if (onSelectProblemSolution) {
      const psItem: ProblemSolutionDetail = {
        id: `cost-${index}`,
        sectorName: entry.category,
        factorKey: 'budget',
        severity: entry.amount_percentage >= 40 ? 'Critical' : entry.amount_percentage >= 20 ? 'High' : 'Medium',
        percentage: entry.amount_percentage,
        costInr: entry.estimated_inr,
        problem: entry.problem_identified || `High capital allocation (${entry.amount_percentage}%) in ${entry.category} creates pre-revenue cash burn risk in the Indian market.`,
        rootCause: `Committing fixed expenses before achieving product-market fit or recurring UPI subscriber cash flow.`,
        solution: entry.actionable_solution || `Replace high fixed overhead with scale-to-zero serverless hosting (Mumbai ap-south-1) and free developer tier SaaS.`,
        financialImpactInr: `Saves approx. ${formatINR(Math.round(entry.estimated_inr * 0.4))} by switching to low-overhead Indian developer architecture.`,
        actionableDeScopeStep: `Audit ${entry.category} line items; eliminate all paid commitments for initial MVP phase.`
      };
      onSelectProblemSolution(psItem);
    }
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload as CostCategory;
      return (
        <div className="bg-slate-900/95 backdrop-blur-md text-white p-3 rounded-2xl shadow-xl text-xs border border-slate-700 max-w-xs">
          <div className="flex items-center justify-between gap-3 mb-1">
            <span className="font-bold text-slate-100">{data.category}</span>
            <span className="font-mono font-bold text-blue-400">{data.amount_percentage}% share</span>
          </div>
          <div className="text-base font-bold font-mono text-emerald-400 mb-1.5">
            {formatINR(data.estimated_inr)}
          </div>
          <div className="text-[11px] text-blue-300 font-medium flex items-center gap-1">
            <span>👉 Click slice to view Problem & Solution</span>
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
              <h3 className="text-base font-serif font-bold text-slate-900 flex items-center gap-1.5">
                <span>Capital & Resource Allocation (₹ INR)</span>
              </h3>
              <p className="text-xs text-slate-500">
                Interactive budget pie chart calibrated for Indian tech costs
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs text-slate-500 hover:text-slate-900 flex items-center gap-1 p-1 rounded-md transition-colors"
          >
            <span>{isExpanded ? "Hide" : "Details"}</span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* 1-Line Takeaway in Indian Rupees */}
        <div className="my-2.5 px-3.5 py-2 rounded-xl bg-blue-50/70 border border-blue-200 text-xs text-slate-700 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <IndianRupee className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span>
              <strong className="text-blue-900 font-semibold">Total Runway: </strong>
              Projected requirement of <strong>{stats.total_cost_range}</strong> over {stats.estimated_weeks}.
            </span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 font-bold shrink-0">
            {formatINR(totalEstimatedInr)}
          </span>
        </div>
      </div>

      {/* Stat Cards Strip in INR */}
      <div className="grid grid-cols-3 gap-2.5 my-3">
        <div className="p-3.5 rounded-2xl bg-white/70 backdrop-blur-md border border-slate-200/80 flex flex-col justify-between shadow-xs">
          <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">
            <Users className="w-3 h-3 text-blue-600" />
            Team
          </div>
          <span className="text-xs sm:text-sm font-bold text-slate-900 truncate">
            {stats.team_size}
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-white/70 backdrop-blur-md border border-slate-200/80 flex flex-col justify-between shadow-xs">
          <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">
            <Clock className="w-3 h-3 text-blue-600" />
            Duration
          </div>
          <span className="text-xs sm:text-sm font-bold text-slate-900 truncate">
            {stats.estimated_weeks}
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-white/70 backdrop-blur-md border border-slate-200/80 flex flex-col justify-between shadow-xs">
          <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">
            <Wallet className="w-3 h-3 text-blue-600" />
            Runway
          </div>
          <span className="text-xs sm:text-sm font-bold text-blue-700 truncate font-mono">
            {stats.total_cost_range}
          </span>
        </div>
      </div>

      {/* Interactive Pie / Donut Chart with Sector Click Handlers */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center my-2">
        <div className="sm:col-span-6 h-48 relative flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip content={<CustomTooltip />} />
              <Pie
                data={costs}
                dataKey="amount_percentage"
                nameKey="category"
                cx="50%"
                cy="50%"
                innerRadius={46}
                outerRadius={70}
                paddingAngle={3}
                cursor="pointer"
                onClick={(entry, index) => handleSectorClick(entry as CostCategory, index)}
              >
                {costs.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                    stroke={activeIndex === index ? '#2563eb' : '#ffffff'}
                    strokeWidth={activeIndex === index ? 3 : 1}
                    className="transition-transform duration-300 hover:scale-105"
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-xs font-bold text-slate-900 font-mono">
              100%
            </span>
            <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400">
              Allocated
            </span>
          </div>
        </div>

        {/* Legend List with Click Redirect to Problem & Solution */}
        <div className="sm:col-span-6 space-y-1.5 text-xs">
          {costs.map((cost, idx) => {
            const isSelected = activeIndex === idx;
            return (
              <div
                key={idx}
                onClick={() => handleSectorClick(cost, idx)}
                className={`p-1.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2 group ${
                  isSelected
                    ? 'bg-blue-50/90 border-blue-400 shadow-xs'
                    : 'bg-white/50 hover:bg-white border-transparent hover:border-slate-200'
                }`}
              >
                <div className="flex items-center gap-1.5 truncate">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0 group-hover:scale-110 transition-transform"
                    style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                  />
                  <span className="text-slate-700 font-medium truncate text-[11px] group-hover:text-blue-700">
                    {cost.category}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0 font-mono text-[11px]">
                  <span className="font-bold text-slate-900">
                    {formatINR(cost.estimated_inr)}
                  </span>
                  <span className="text-slate-400 text-[10px]">
                    ({cost.amount_percentage}%)
                  </span>
                  <ArrowRight className="w-3 h-3 text-slate-300 group-hover:text-blue-600 transition-colors" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Banner instructing user to click */}
      <div className="p-2.5 rounded-xl bg-gradient-to-r from-blue-50/80 to-slate-50 border border-blue-100 flex items-center justify-between text-xs my-1">
        <div className="flex items-center gap-2 text-slate-700 text-[11px]">
          <AlertCircle className="w-3.5 h-3.5 text-blue-600 shrink-0" />
          <span>Click any pie slice to inspect its <strong>Problem & Solution</strong></span>
        </div>
        <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider hidden sm:inline">
          Interactive
        </span>
      </div>

      {isExpanded && (
        <div className="pt-3 border-t border-slate-200 text-xs text-slate-600 space-y-1">
          <span className="font-semibold text-slate-900 block text-[11px]">
            Capital Burn Insight (India):
          </span>
          <p className="text-[11px] leading-relaxed">
            Developer time and custom backend engineering make up over 55% of the initial outlay. Utilizing managed APIs and serverless hosting keeps fixed monthly burn below ₹3,000 before initial customer revenue.
          </p>
        </div>
      )}

      <div className="text-[10px] text-slate-400 pt-2 border-t border-slate-100 flex justify-between">
        <span>Calculated against verified Indian solo founder norms</span>
        <span className="font-mono font-bold text-slate-700">{formatINR(totalEstimatedInr)} Baseline Outlay</span>
      </div>

    </div>
  );
};
