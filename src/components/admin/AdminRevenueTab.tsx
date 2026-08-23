import React, { useState } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Tv, 
  Award, 
  Download, 
  Calendar,
  Layers,
  ArrowUpRight,
  PieChart,
  BarChart3,
  Percent
} from 'lucide-react';
import { useAdminTheme } from './AdminThemeContext';

export const AdminRevenueTab: React.FC = () => {
  const { isDark } = useAdminTheme();
  const [timeframe, setTimeframe] = useState<'today' | 'week' | 'month' | 'lifetime'>('week');

  // Realistic revenue figures based on Indian Reward App CPMs & Offerwalls
  const totalRevenue = 148520;
  const totalUserPayouts = 64200;
  const netProfit = totalRevenue - totalUserPayouts;
  const profitMargin = ((netProfit / totalRevenue) * 100).toFixed(1);

  const revenueBreakdown = [
    { source: 'Unity & AdMob Video Ads (Rewarded)', amount: 62400, percent: 42, color: 'from-blue-500 to-indigo-600' },
    { source: 'Offerwalls (Pollfish, CPALead, Tapjoy)', amount: 48900, percent: 33, color: 'from-purple-500 to-pink-600' },
    { source: 'Direct App Install Sponsors (EarnX Tasks)', amount: 26800, percent: 18, color: 'from-emerald-500 to-teal-600' },
    { source: 'Interstitial & Native Banner Impressions', amount: 10420, percent: 7, color: 'from-amber-500 to-orange-600' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={`p-5 rounded-3xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
        isDark ? 'bg-[#1E293B] border-slate-800' : 'bg-white border-slate-200/90'
      }`}>
        <div>
          <h3 className={`text-base font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Financial Performance & Net Profit Yield
          </h3>
          <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Audited breakdown of Ad CPM revenue, offerwall gross yield, user cashback disbursements & app profit margin
          </p>
        </div>
        <div className="flex items-center gap-1.5 self-start sm:self-auto">
          {(['today', 'week', 'month', 'lifetime'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTimeframe(t)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black capitalize transition-all cursor-pointer ${
                timeframe === t
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : isDark ? 'bg-slate-800 text-slate-400 hover:text-white' : 'bg-slate-100 text-slate-600'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Primary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Gross Revenue */}
        <div className={`p-5 rounded-3xl border ${
          isDark ? 'bg-[#1E293B] border-slate-800' : 'bg-white border-slate-200/90 shadow-xs'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-slate-400 uppercase tracking-wider">Gross Ad Revenue</span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-indigo-400 font-mono">
              ₹ {totalRevenue.toLocaleString('en-IN')}
            </span>
          </div>
          <span className="text-[11px] text-emerald-500 font-bold mt-1.5 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> +24.8% from last period
          </span>
        </div>

        {/* Total User Disbursements */}
        <div className={`p-5 rounded-3xl border ${
          isDark ? 'bg-[#1E293B] border-slate-800' : 'bg-white border-slate-200/90 shadow-xs'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-slate-400 uppercase tracking-wider">Disbursed Cashback</span>
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400">
              <ArrowUpRight className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-rose-400 font-mono">
              ₹ {totalUserPayouts.toLocaleString('en-IN')}
            </span>
          </div>
          <span className="text-[11px] text-slate-400 font-medium mt-1.5 block">
            43.2% of gross yield paid to users
          </span>
        </div>

        {/* Net Profit */}
        <div className={`p-5 rounded-3xl border ${
          isDark ? 'bg-[#1E293B] border-slate-800' : 'bg-white border-slate-200/90 shadow-xs'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-slate-400 uppercase tracking-wider">Net Realized Profit</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-emerald-500 font-mono">
              ₹ {netProfit.toLocaleString('en-IN')}
            </span>
          </div>
          <span className="text-[11px] text-emerald-500 font-bold mt-1.5 block">
            Retained after all UPI payouts
          </span>
        </div>

        {/* Profit Margin */}
        <div className={`p-5 rounded-3xl border ${
          isDark ? 'bg-[#1E293B] border-slate-800' : 'bg-white border-slate-200/90 shadow-xs'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-slate-400 uppercase tracking-wider">Profit Margin</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
              <Percent className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className={`text-2xl font-black font-mono ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {profitMargin}%
            </span>
          </div>
          <span className="text-[11px] text-purple-400 font-bold mt-1.5 block">
            Healthy unit economics
          </span>
        </div>
      </div>

      {/* Revenue Stream Breakdown */}
      <div className={`p-6 rounded-3xl border space-y-5 ${
        isDark ? 'bg-[#1E293B] border-slate-800' : 'bg-white border-slate-200/90 shadow-xs'
      }`}>
        <h4 className={`text-sm font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
          Revenue Distribution by Source Channel
        </h4>

        <div className="space-y-4">
          {revenueBreakdown.map((stream, idx) => (
            <div key={idx} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>{stream.source}</span>
                <span className="font-mono text-emerald-500">₹ {stream.amount.toLocaleString('en-IN')} ({stream.percent}%)</span>
              </div>
              <div className={`w-full h-3 rounded-full overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
                <div 
                  className={`h-full rounded-full bg-gradient-to-r ${stream.color}`} 
                  style={{ width: `${stream.percent}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
