import React from 'react';
import { Loader2 } from 'lucide-react';

export const SkeletonReport: React.FC = () => {
  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fade-in">
      
      {/* Loading Banner */}
      <div className="glass-panel rounded-3xl p-6 text-center shadow-glass">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-2.5 border border-blue-200">
          <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" />
          <span>Simulating Real-World Execution Constraints...</span>
        </div>
        <h3 className="text-lg font-serif font-bold text-slate-900 mb-1">
          Evaluating Feasibility, Risk Distribution & Architecture
        </h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          Benchmarking delivery cycle times, cloud costs, skill requirements, and market bottlenecks.
        </p>
      </div>

      {/* Score Gauge Skeleton */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 shadow-glass">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-4 flex flex-col items-center justify-center">
            <div className="w-36 h-36 rounded-full animate-shimmer" />
          </div>
          <div className="md:col-span-8 space-y-3">
            <div className="w-28 h-3.5 rounded animate-shimmer" />
            <div className="w-full h-6 rounded animate-shimmer" />
            <div className="w-5/6 h-3.5 rounded animate-shimmer" />
            <div className="w-4/6 h-3.5 rounded animate-shimmer" />
          </div>
        </div>
      </div>

      {/* Grid Skeletons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel rounded-3xl p-6 h-72 space-y-4 shadow-glass">
          <div className="w-36 h-4 rounded animate-shimmer" />
          <div className="w-full h-48 rounded-xl animate-shimmer" />
        </div>

        <div className="glass-panel rounded-3xl p-6 h-72 space-y-4 shadow-glass">
          <div className="w-36 h-4 rounded animate-shimmer" />
          <div className="space-y-2.5 pt-2">
            <div className="w-full h-8 rounded-lg animate-shimmer" />
            <div className="w-full h-8 rounded-lg animate-shimmer" />
            <div className="w-full h-8 rounded-lg animate-shimmer" />
            <div className="w-full h-8 rounded-lg animate-shimmer" />
          </div>
        </div>
      </div>

    </div>
  );
};
