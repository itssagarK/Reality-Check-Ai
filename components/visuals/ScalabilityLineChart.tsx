import React, { useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import { ScalabilityTier } from '../../types';
import { TrendingUp, ChevronDown, ChevronUp } from 'lucide-react';
import { formatINR } from '../../utils/currencyUtils';

interface ScalabilityLineChartProps {
  projections: ScalabilityTier[];
}

export const ScalabilityLineChart: React.FC<ScalabilityLineChartProps> = ({ projections }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const chartData = projections.map(p => ({
    tier: p.tier,
    cost: p.estimated_monthly_cost_inr ?? p.estimated_monthly_cost ?? 2000,
    performance: p.performance_rating,
    bottleneck: p.bottleneck
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900/95 backdrop-blur-md text-white p-3 rounded-2xl shadow-xl text-xs max-w-xs border border-slate-700">
          <span className="font-bold text-slate-100 block mb-1 text-xs">{data.tier} Users (India)</span>
          <div className="space-y-0.5 mb-1.5 font-mono text-[11px]">
            <div className="flex justify-between gap-4">
              <span className="text-slate-400">Est. Cloud Cost (Mumbai):</span>
              <span className="font-bold text-red-400">{formatINR(data.cost)}/mo</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-slate-400">Throughput Index:</span>
              <span className="font-bold text-blue-400">{data.performance}/100</span>
            </div>
          </div>
          <div className="pt-1.5 border-t border-slate-800 text-[10px] text-slate-300">
            <strong className="text-slate-400">Bottleneck:</strong> {data.bottleneck}
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
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-serif font-bold text-slate-900">
                Scalability & Infrastructure Unit Costs (₹ INR)
              </h3>
              <p className="text-xs text-slate-500">
                Projected Mumbai AWS/GCP cloud expense vs throughput to 100K users
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs text-slate-500 hover:text-slate-900 flex items-center gap-1 p-1 rounded-md transition-colors"
          >
            <span>{isExpanded ? "Hide" : "Bottlenecks"}</span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* 1-Line Takeaway in Indian Rupees */}
        <div className="my-2.5 px-3.5 py-2 rounded-xl bg-blue-50/60 border border-blue-200 text-xs text-slate-700">
          <strong className="text-blue-900 font-semibold">Scaling Cliff: </strong>
          Initial tier runs on ₹0-₹2,000/mo serverless tier; first sharp inflection appears at 10K active users.
        </div>
      </div>

      {/* Recharts Scalability Line Graph in Classic Red & Blue */}
      <div className="w-full h-56 my-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="tier" tick={{ fill: '#475569', fontSize: 11, fontWeight: 600 }} />
            <YAxis
              yAxisId="cost"
              orientation="left"
              stroke="#dc2626"
              tick={{ fill: '#dc2626', fontSize: 10 }}
              tickFormatter={(val) => `₹${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}`}
            />
            <YAxis yAxisId="perf" orientation="right" domain={[0, 100]} stroke="#2563eb" tick={{ fill: '#2563eb', fontSize: 10 }} />
            <Tooltip content={<CustomTooltip />} />
            <Line
              yAxisId="cost"
              type="monotone"
              dataKey="cost"
              stroke="#dc2626"
              strokeWidth={2.5}
              dot={{ r: 4, fill: '#dc2626' }}
              name="Monthly Cost (₹)"
            />
            <Line
              yAxisId="perf"
              type="monotone"
              dataKey="performance"
              stroke="#2563eb"
              strokeWidth={2.5}
              dot={{ r: 4, fill: '#2563eb' }}
              name="Throughput Rating"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Legend & Summary */}
      <div className="flex items-center justify-between text-[11px] pt-2 border-t border-slate-100">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600" />
            <span className="text-slate-700">Monthly Cloud Burn (₹/mo)</span>
          </div>
          <div className="flex items-center gap-1.5 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
            <span className="text-slate-700">Throughput Index</span>
          </div>
        </div>
        <span className="text-slate-400 font-mono text-[10px]">3 Scale Horizons</span>
      </div>

      {isExpanded && (
        <div className="mt-3 pt-3 border-t border-slate-100 space-y-2 text-xs animate-fade-in">
          {projections.map((p, i) => (
            <div key={i} className="flex justify-between items-center p-2 rounded-xl bg-white/70 border border-slate-200/80">
              <span className="font-bold text-slate-800">{p.tier} Users:</span>
              <span className="text-slate-600 truncate ml-2 max-w-xs">{p.bottleneck}</span>
              <span className="font-mono font-bold text-red-600 ml-auto shrink-0 pl-2">
                {formatINR(p.estimated_monthly_cost_inr ?? p.estimated_monthly_cost)}/mo
              </span>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
