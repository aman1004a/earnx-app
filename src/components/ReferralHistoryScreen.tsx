import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Users, 
  Wallet, 
  Clock, 
  CheckCircle2, 
  Search, 
  Share2, 
  Sparkles,
  Calendar
} from 'lucide-react';

export interface ReferralRecord {
  id: string;
  name: string;
  phoneMasked: string;
  date: string;
  time: string;
  rewardAmount: number;
  status: 'completed' | 'pending' | 'in_progress';
  tasksCompleted: number;
  totalTasksRequired: number;
}

interface ReferralHistoryScreenProps {
  onBack: () => void;
  onShareWhatsApp: () => void;
}

export const ReferralHistoryScreen: React.FC<ReferralHistoryScreenProps> = ({
  onBack,
  onShareWhatsApp
}) => {
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'pending'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Comprehensive mock data for referral history (₹50 per friend)
  const referralList: ReferralRecord[] = [
    {
      id: 'ref-1',
      name: 'Aman Sharma',
      phoneMasked: '+91 98721 *****',
      date: '20 Aug 2026',
      time: '04:15 PM',
      rewardAmount: 50,
      status: 'completed',
      tasksCompleted: 3,
      totalTasksRequired: 3
    },
    {
      id: 'ref-2',
      name: 'Priya Patel',
      phoneMasked: '+91 98112 *****',
      date: '19 Aug 2026',
      time: '02:30 PM',
      rewardAmount: 50,
      status: 'completed',
      tasksCompleted: 3,
      totalTasksRequired: 3
    },
    {
      id: 'ref-3',
      name: 'Rohan Gupta',
      phoneMasked: '+91 97234 *****',
      date: '19 Aug 2026',
      time: '11:45 AM',
      rewardAmount: 50,
      status: 'pending',
      tasksCompleted: 1,
      totalTasksRequired: 3
    },
    {
      id: 'ref-4',
      name: 'Neha Singh',
      phoneMasked: '+91 99345 *****',
      date: '18 Aug 2026',
      time: '07:20 PM',
      rewardAmount: 50,
      status: 'completed',
      tasksCompleted: 3,
      totalTasksRequired: 3
    },
    {
      id: 'ref-5',
      name: 'Vikram Joshi',
      phoneMasked: '+91 96541 *****',
      date: '18 Aug 2026',
      time: '01:10 PM',
      rewardAmount: 50,
      status: 'in_progress',
      tasksCompleted: 2,
      totalTasksRequired: 3
    },
    {
      id: 'ref-6',
      name: 'Anjali Verma',
      phoneMasked: '+91 94123 *****',
      date: '17 Aug 2026',
      time: '05:40 PM',
      rewardAmount: 50,
      status: 'completed',
      tasksCompleted: 3,
      totalTasksRequired: 3
    },
    {
      id: 'ref-7',
      name: 'Deepak Kumar',
      phoneMasked: '+91 91234 *****',
      date: '16 Aug 2026',
      time: '09:15 AM',
      rewardAmount: 50,
      status: 'pending',
      tasksCompleted: 0,
      totalTasksRequired: 3
    },
    {
      id: 'ref-8',
      name: 'Sneha Roy',
      phoneMasked: '+91 95678 *****',
      date: '15 Aug 2026',
      time: '03:50 PM',
      rewardAmount: 50,
      status: 'completed',
      tasksCompleted: 3,
      totalTasksRequired: 3
    }
  ];

  const filteredReferrals = referralList.filter((ref) => {
    const matchesFilter =
      filterStatus === 'all'
        ? true
        : filterStatus === 'completed'
        ? ref.status === 'completed'
        : ref.status === 'pending' || ref.status === 'in_progress';

    const matchesSearch =
      ref.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ref.phoneMasked.includes(searchQuery);

    return matchesFilter && matchesSearch;
  });

  const totalEarnedCash = referralList
    .filter((r) => r.status === 'completed')
    .reduce((acc, curr) => acc + curr.rewardAmount, 0);

  const completedCount = referralList.filter((r) => r.status === 'completed').length;
  const pendingCount = referralList.filter((r) => r.status !== 'completed').length;

  return (
    <div id="referral-history-view" className="w-full h-full flex flex-col bg-[#F8FAFC] text-slate-800 relative overflow-hidden text-left">
      {/* Top Header Bar (White Glassmorphism) */}
      <header className="shrink-0 px-4 py-3 border-b border-white/60 bg-white/80 backdrop-blur-xl z-40 flex items-center justify-between shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)]">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-2xl bg-white hover:bg-slate-100 text-slate-700 shadow-xs border border-slate-200/80 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h2 className="text-base font-black text-slate-900 tracking-tight font-outfit">
              Referral History
            </h2>
            <p className="text-[10px] text-slate-400 font-medium leading-none">
              Track invited friends & cash rewards
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-black">
          <Wallet className="w-3.5 h-3.5 text-emerald-600" />
          <span>+ ₹{totalEarnedCash}</span>
        </div>
      </header>

      {/* Scrollable History Body */}
      <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4 scrollbar-thin overscroll-contain">
        
        {/* Referral Summary Hero Card */}
        <div className="p-4 rounded-3xl bg-gradient-to-br from-indigo-600 via-[#4B63FF] to-[#3549EC] text-white shadow-md shadow-[#4B63FF]/20 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-100">
                Lifetime Referral Earnings
              </span>
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full text-white">
              Instant Cash Credited
            </span>
          </div>

          <div className="flex items-baseline justify-between pt-1">
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-black font-outfit">₹{totalEarnedCash}</span>
              <span className="text-sm font-bold text-emerald-300">INR</span>
            </div>
            <div className="text-right">
              <span className="text-xs font-extrabold text-blue-200 block">₹50 / Friend</span>
              <span className="text-[10px] text-blue-100 font-medium">Instant wallet credit</span>
            </div>
          </div>

          {/* Quick Counter Grid inside banner */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/20">
            <div className="p-2 rounded-2xl bg-white/10 flex items-center gap-2">
              <div className="p-1.5 rounded-xl bg-emerald-400/20 text-emerald-300">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="text-xs font-black block leading-none">{completedCount} Friends</span>
                <span className="text-[9.5px] text-blue-100 font-medium">Reward Claimed</span>
              </div>
            </div>

            <div className="p-2 rounded-2xl bg-white/10 flex items-center gap-2">
              <div className="p-1.5 rounded-xl bg-amber-400/20 text-amber-300">
                <Clock className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="text-xs font-black block leading-none">{pendingCount} Pending</span>
                <span className="text-[9.5px] text-blue-100 font-medium">Under Verification</span>
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar & Filter Tabs */}
        <div className="space-y-2.5">
          {/* Search Box */}
          <div className="flex items-center rounded-2xl border border-slate-200/90 bg-white px-3 py-2 shadow-xs focus-within:ring-2 focus-within:ring-[#4B63FF] transition-all">
            <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by friend name or number..."
              className="w-full text-xs font-medium text-slate-800 placeholder:text-slate-400 outline-none bg-transparent"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs text-slate-400 hover:text-slate-600 font-bold px-1 cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2">
            {[
              { id: 'all', label: `All (${referralList.length})` },
              { id: 'completed', label: `Completed (${completedCount})` },
              { id: 'pending', label: `Pending (${pendingCount})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterStatus(tab.id as 'all' | 'completed' | 'pending')}
                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                  filterStatus === tab.id
                    ? 'bg-[#4B63FF] text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* List of Referral Entries */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between px-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Referral Activity Log
            </span>
            <span className="text-[11px] font-semibold text-slate-400">
              Showing {filteredReferrals.length}
            </span>
          </div>

          {filteredReferrals.length === 0 ? (
            <div className="p-8 rounded-3xl bg-white border border-slate-200/80 text-center space-y-2 shadow-xs">
              <Users className="w-8 h-8 text-slate-300 mx-auto" />
              <h4 className="text-xs font-bold text-slate-700">No Referral Record Found</h4>
              <p className="text-[11px] text-slate-400">
                {searchQuery
                  ? "No user matching your search query."
                  : "Invite your friends now to start earning ₹50 cash per referral!"}
              </p>
            </div>
          ) : (
            filteredReferrals.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-2xl bg-white/90 border border-slate-200/80 shadow-xs hover:border-[#4B63FF]/30 transition-all flex items-center justify-between gap-3"
              >
                {/* Left: User Avatar & Info */}
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-extrabold text-sm ${
                    item.status === 'completed'
                      ? 'bg-emerald-50 text-emerald-600 border border-emerald-200/60'
                      : item.status === 'in_progress'
                      ? 'bg-blue-50 text-blue-600 border border-blue-200/60'
                      : 'bg-amber-50 text-amber-600 border border-amber-200/60'
                  }`}>
                    {item.name.charAt(0)}
                  </div>
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-extrabold text-slate-900">{item.name}</span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-mono">{item.phoneMasked}</p>
                    <div className="flex items-center gap-1.5 text-[9.5px] text-slate-400 pt-0.5">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      <span>{item.date} • {item.time}</span>
                    </div>
                  </div>
                </div>

                {/* Right: Reward & Status Tag */}
                <div className="text-right space-y-1 shrink-0">
                  <div className="flex items-center justify-end gap-1">
                    <span className="text-xs font-black text-emerald-600 font-outfit">
                      + ₹{item.rewardAmount}
                    </span>
                  </div>
                  {item.status === 'completed' ? (
                    <span className="inline-flex items-center gap-1 text-[9.5px] font-extrabold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-md">
                      <CheckCircle2 className="w-2.5 h-2.5" />
                      <span>Credited</span>
                    </span>
                  ) : item.status === 'in_progress' ? (
                    <span className="inline-flex items-center gap-1 text-[9.5px] font-extrabold bg-blue-100 text-[#3549EC] px-2 py-0.5 rounded-md">
                      <Clock className="w-2.5 h-2.5" />
                      <span>{item.tasksCompleted}/{item.totalTasksRequired} Tasks</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[9.5px] font-extrabold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-md">
                      <Clock className="w-2.5 h-2.5" />
                      <span>Pending KYC</span>
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Bottom Invite More Floating Button */}
        <div className="pt-2">
          <button
            onClick={onShareWhatsApp}
            className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
            <span>Invite More Friends (+ ₹50 each)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
