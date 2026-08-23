import React from 'react';
import { 
  Users, 
  Wallet, 
  ArrowUpRight, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  ShieldAlert, 
  FileText, 
  Gift, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { AdminUserRecord, AppGlobalConfig } from '../../utils/adminStorage';
import { WithdrawalTransaction } from '../WithdrawalScreen';
import { useAdminTheme } from './AdminThemeContext';

interface AdminOverviewTabProps {
  users: Record<string, AdminUserRecord>;
  withdrawals: (WithdrawalTransaction & { userPhone: string; userName: string })[];
  config: AppGlobalConfig;
  onNavigateTab: (tab: string) => void;
}

export const AdminOverviewTab: React.FC<AdminOverviewTabProps> = ({
  users = {},
  withdrawals = [],
  config,
  onNavigateTab
}) => {
  const { isDark } = useAdminTheme();

  const userList: AdminUserRecord[] = Object.values(users || {});
  const totalUsersCount = userList.length;
  const activeUsersCount = userList.filter(u => u.status === 'active').length;
  const totalUserBalance = userList.reduce((acc, u) => acc + (u.walletBalance || 0), 0);
  const totalEarnedAcrossUsers = userList.reduce((acc, u) => acc + (u.totalEarned || 0), 0);

  const pendingWithdrawals = withdrawals.filter(w => w.status === 'processing');
  const pendingWithdrawalsSum = pendingWithdrawals.reduce((acc, w) => acc + w.amountInr, 0);

  const completedWithdrawals = withdrawals.filter(w => w.status === 'success');
  const completedWithdrawalsSum = completedWithdrawals.reduce((acc, w) => acc + w.amountInr, 0);

  const stats = [
    {
      id: 'stat-total-users',
      title: 'Total Registered Users',
      value: totalUsersCount.toLocaleString(),
      subtext: `+${activeUsersCount} Active this week`,
      icon: Users,
      color: 'text-indigo-500',
      bgColor: isDark ? 'bg-indigo-500/10' : 'bg-indigo-50',
      borderColor: isDark ? 'border-slate-800' : 'border-slate-200'
    },
    {
      id: 'stat-pending-withdrawals',
      title: 'Pending Withdrawal Requests',
      value: `₹ ${pendingWithdrawalsSum.toLocaleString()}`,
      subtext: `${pendingWithdrawals.length} requests awaiting action`,
      icon: Clock,
      color: 'text-amber-500',
      bgColor: isDark ? 'bg-amber-500/10' : 'bg-amber-50',
      borderColor: isDark ? 'border-slate-800' : 'border-slate-200',
      actionText: 'Review Now',
      actionTab: 'withdrawals'
    },
    {
      id: 'stat-total-paid',
      title: 'Total Cash Disbursed',
      value: `₹ ${completedWithdrawalsSum.toLocaleString()}`,
      subtext: `${completedWithdrawals.length} successful transactions`,
      icon: CheckCircle2,
      color: 'text-emerald-500',
      bgColor: isDark ? 'bg-emerald-500/10' : 'bg-emerald-50',
      borderColor: isDark ? 'border-slate-800' : 'border-slate-200'
    },
    {
      id: 'stat-user-liability',
      title: 'Total User Wallet Balance',
      value: `₹ ${totalUserBalance.toLocaleString()}`,
      subtext: `Total Earned: ₹ ${totalEarnedAcrossUsers.toLocaleString()}`,
      icon: Wallet,
      color: 'text-sky-500',
      bgColor: isDark ? 'bg-sky-500/10' : 'bg-sky-50',
      borderColor: isDark ? 'border-slate-800' : 'border-slate-200'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner Alert if Pending Withdrawals */}
      {pendingWithdrawals.length > 0 && (
        <div className={`p-4 rounded-3xl border flex items-center justify-between gap-4 ${
          isDark ? 'bg-amber-500/10 border-amber-500/30' : 'bg-amber-50 border-amber-200'
        }`}>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500 text-slate-950 shrink-0 shadow-xs">
              <Clock className="w-5 h-5 animate-spin" />
            </div>
            <div>
              <h4 className={`text-sm font-black ${isDark ? 'text-amber-300' : 'text-amber-950'}`}>
                Action Required: {pendingWithdrawals.length} Pending Withdrawal Requests (₹{pendingWithdrawalsSum})
              </h4>
              <p className={`text-xs font-medium ${isDark ? 'text-amber-400/80' : 'text-amber-800'}`}>
                Users are waiting for UPI & Bank transfers. Process withdrawals to maintain trust and ratings.
              </p>
            </div>
          </div>
          <button
            id="btn-overview-process-withdrawals"
            onClick={() => onNavigateTab('withdrawals')}
            className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 text-xs font-black shadow-md hover:bg-amber-400 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5"
          >
            <span>Process Withdrawals</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              id={item.id}
              className={`p-5 rounded-3xl border transition-all flex flex-col justify-between ${
                isDark 
                  ? 'bg-[#1E293B] border-slate-800 text-white shadow-xl' 
                  : 'bg-white border-slate-200/90 text-slate-900 shadow-xs hover:shadow-md'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  {item.title}
                </span>
                <div className={`p-2.5 rounded-2xl ${item.bgColor} ${item.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>

              <div className="space-y-1">
                <div className={`text-2xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {item.value}
                </div>
                <div className={`text-xs font-medium flex items-center justify-between ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  <span>{item.subtext}</span>
                  {item.actionTab && (
                    <button
                      onClick={() => onNavigateTab(item.actionTab!)}
                      className="text-xs font-black text-amber-500 hover:underline flex items-center cursor-pointer"
                    >
                      {item.actionText} →
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main 2-Column Section: Recent Payouts & Recent Registered Users */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Payout Requests */}
        <div className={`p-5 rounded-3xl border space-y-4 ${
          isDark ? 'bg-[#1E293B] border-slate-800 shadow-xl' : 'bg-white border-slate-200/90 shadow-xs'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`p-2 rounded-xl ${isDark ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-50 text-purple-600'}`}>
                <Wallet className="w-4 h-4" />
              </div>
              <div>
                <h4 className={`text-sm font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>Recent Withdrawal Requests</h4>
                <p className={`text-[11px] font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Live sync with user cashouts</p>
              </div>
            </div>
            <button
              id="btn-see-all-withdrawals"
              onClick={() => onNavigateTab('withdrawals')}
              className="text-xs font-bold text-indigo-500 hover:text-indigo-400 flex items-center gap-1 cursor-pointer"
            >
              <span>Manage All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className={`divide-y ${isDark ? 'divide-slate-800' : 'divide-slate-100'}`}>
            {withdrawals.slice(0, 4).map((w) => (
              <div key={w.id} className="py-3 flex items-center justify-between gap-3">
                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-black truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {w.userName || w.userPhone}
                    </span>
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${
                      w.status === 'processing' 
                        ? 'bg-amber-500/20 text-amber-400' 
                        : w.status === 'success' 
                        ? 'bg-emerald-500/20 text-emerald-400' 
                        : 'bg-rose-500/20 text-rose-400'
                    }`}>
                      {w.status.toUpperCase()}
                    </span>
                  </div>
                  <div className={`text-[11px] truncate ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    {w.details} • {w.date}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className={`text-sm font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    ₹  {w.amountInr}
                  </div>
                  <span className={`text-[10px] font-bold uppercase ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                    {w.method}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Active Users */}
        <div className={`p-5 rounded-3xl border space-y-4 ${
          isDark ? 'bg-[#1E293B] border-slate-800 shadow-xl' : 'bg-white border-slate-200/90 shadow-xs'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`p-2 rounded-xl ${isDark ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
                <Users className="w-4 h-4" />
              </div>
              <div>
                <h4 className={`text-sm font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>Top Active Earners</h4>
                <p className={`text-[11px] font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Ranked by total rewards completed</p>
              </div>
            </div>
            <button
              id="btn-see-all-users"
              onClick={() => onNavigateTab('users')}
              className="text-xs font-bold text-indigo-500 hover:text-indigo-400 flex items-center gap-1 cursor-pointer"
            >
              <span>View All Users</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className={`divide-y ${isDark ? 'divide-slate-800' : 'divide-slate-100'}`}>
            {userList.slice(0, 4).map((u, idx) => (
              <div key={u.phone} className="py-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-8 h-8 rounded-2xl font-black text-xs flex items-center justify-center shrink-0 ${
                    isDark ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-700'
                  }`}>
                    #{idx + 1}
                  </div>
                  <div className="min-w-0">
                    <div className={`text-xs font-black truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {u.fullName}
                    </div>
                    <div className={`text-[11px] truncate ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      +91 {u.phone} • {u.tasksCompleted} Tasks Done
                    </div>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-xs font-black text-emerald-500">
                    ₹  {u.walletBalance}
                  </div>
                  <div className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                    Total: ₹  {u.totalEarned}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Action Shortcuts Banner */}
      <div className={`p-6 rounded-3xl text-white shadow-lg space-y-4 ${
        isDark 
          ? 'bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800' 
          : 'bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-black uppercase tracking-wider text-amber-400">Admin Control Center</span>
            </div>
            <h3 className="text-base font-extrabold text-white">
              Instant Task & Promo Code Deployment
            </h3>
            <p className="text-xs text-slate-300">
              Create instant high-paying tasks, generate cash promo vouchers, or adjust referral bonus reward rates.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={() => onNavigateTab('ads')}
              className="px-4 py-2.5 rounded-xl bg-purple-600 text-white text-xs font-black hover:bg-purple-500 transition-all cursor-pointer shadow-md"
            >
              📺 Manage Video Ads
            </button>
            <button
              onClick={() => onNavigateTab('tasks')}
              className="px-4 py-2.5 rounded-xl bg-white text-slate-900 text-xs font-black hover:bg-slate-100 transition-all cursor-pointer shadow-md"
            >
              + Add New Task
            </button>
            <button
              onClick={() => onNavigateTab('coupons')}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-black hover:bg-indigo-500 transition-all cursor-pointer shadow-md"
            >
              + Create Coupon
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
