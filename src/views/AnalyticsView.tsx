import React from 'react';
import { BarChart3, TrendingUp, ArrowUpRight } from 'lucide-react';
import { initialMetrics } from '../mockData';

export const AnalyticsView: React.FC = () => {
  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      <div className="bg-white border border-[#DEDFD8] rounded-3xl p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-[#111111]">Analytics & Insights</h2>
          <p className="text-xs text-[#737373]">Verified performance metrics across all connected creator channels.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {initialMetrics.map((m, idx) => (
          <div key={idx} className="bg-white border border-[#DEDFD8] rounded-2xl p-6 shadow-sm space-y-2">
            <span className="text-xs font-semibold text-[#737373] uppercase tracking-wider">{m.label}</span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black text-[#111111]">{m.value}</span>
              <span className="text-xs font-bold text-[#3B8D50] bg-[#3B8D50]/10 px-2 py-0.5 rounded-full">
                {m.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white border border-[#DEDFD8] rounded-3xl p-6 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-[#111111]">Audience Engagement Growth</h3>
        <div className="h-64 w-full flex items-end justify-between gap-3 px-4 pt-8 pb-2 border-b border-[#EEEEEA]">
          {[40, 65, 55, 80, 95, 110, 105, 130, 145, 160].map((v, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2">
              <div 
                className="w-full bg-[#050505] hover:bg-[#C8F34A] rounded-t-lg transition-all"
                style={{ height: `${v}px` }}
              />
              <span className="text-[10px] text-[#888888]">Day {i + 1}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
