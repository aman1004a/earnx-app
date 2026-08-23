import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  Trophy, 
  Medal, 
  Crown, 
  Sparkles, 
  Flame, 
  TrendingUp, 
  Award, 
  Users, 
  Coins, 
  ShieldCheck, 
  Info, 
  ChevronRight,
  Clock,
  Zap,
  Star
} from 'lucide-react';
import { PersonalDetails } from './PersonalDetailsScreen';

interface LeaderboardScreenProps {
  userPhone: string;
  userDetails: PersonalDetails | null;
  userBalance: number;
  onBack: () => void;
  showToast: (msg: string) => void;
}

interface EarnerRecord {
  rank: number;
  name: string;
  phoneMasked: string;
  city: string;
  earnings: number;
  tasksDone: number;
  prizeAmount?: number;
  avatarColor: string;
  isCurrentUser?: boolean;
}

export const LeaderboardScreen: React.FC<LeaderboardScreenProps> = ({
  userPhone,
  userDetails,
  userBalance,
  onBack,
  showToast
}) => {
  const [timeframe, setTimeframe] = useState<'weekly' | 'daily' | 'alltime'>('weekly');

  const topEarnersList: EarnerRecord[] = [
    {
      rank: 1,
      name: 'Vikas Sharma',
      phoneMasked: '98***1029',
      city: 'Jaipur, RJ',
      earnings: 4850,
      tasksDone: 64,
      prizeAmount: 2500,
      avatarColor: 'from-amber-400 to-amber-600'
    },
    {
      rank: 2,
      name: 'Pooja Verma',
      phoneMasked: '87***9481',
      city: 'Pune, MH',
      earnings: 3920,
      tasksDone: 52,
      prizeAmount: 1500,
      avatarColor: 'from-slate-300 to-slate-500'
    },
    {
      rank: 3,
      name: 'Aman Deep Singh',
      phoneMasked: '70***6102',
      city: 'Chandigarh, PB',
      earnings: 3410,
      tasksDone: 47,
      prizeAmount: 1000,
      avatarColor: 'from-amber-600 to-amber-800'
    },
    {
      rank: 4,
      name: 'Rohan Deshmukh',
      phoneMasked: '91***4019',
      city: 'Nagpur, MH',
      earnings: 2850,
      tasksDone: 39,
      prizeAmount: 500,
      avatarColor: 'from-blue-400 to-indigo-600'
    },
    {
      rank: 5,
      name: 'Sanya Gupta',
      phoneMasked: '93***8821',
      city: 'Delhi, NCR',
      earnings: 2490,
      tasksDone: 34,
      prizeAmount: 500,
      avatarColor: 'from-emerald-400 to-teal-600'
    },
    {
      rank: 6,
      name: 'Karthik Raja',
      phoneMasked: '99***3301',
      city: 'Bengaluru, KA',
      earnings: 2180,
      tasksDone: 29,
      prizeAmount: 300,
      avatarColor: 'from-purple-400 to-pink-600'
    },
    {
      rank: 7,
      name: 'Manish Kumar',
      phoneMasked: '81***7742',
      city: 'Patna, BR',
      earnings: 1940,
      tasksDone: 26,
      prizeAmount: 300,
      avatarColor: 'from-orange-400 to-red-500'
    },
    {
      rank: 8,
      name: 'Anjali Chauhan',
      phoneMasked: '95***1184',
      city: 'Lucknow, UP',
      earnings: 1780,
      tasksDone: 24,
      prizeAmount: 200,
      avatarColor: 'from-rose-400 to-pink-600'
    },
    {
      rank: 9,
      name: 'Harsh Vardhan',
      phoneMasked: '79***5590',
      city: 'Indore, MP',
      earnings: 1620,
      tasksDone: 22,
      prizeAmount: 200,
      avatarColor: 'from-cyan-400 to-blue-600'
    },
    {
      rank: 10,
      name: 'Deepak Patel',
      phoneMasked: '94***2271',
      city: 'Surat, GJ',
      earnings: 1450,
      tasksDone: 19,
      prizeAmount: 100,
      avatarColor: 'from-lime-400 to-emerald-600'
    },
    {
      rank: 11,
      name: 'Sneha Roy',
      phoneMasked: '83***6619',
      city: 'Kolkata, WB',
      earnings: 1280,
      tasksDone: 17,
      avatarColor: 'from-fuchsia-400 to-purple-600'
    },
    {
      rank: 12,
      name: 'Mohd. Faisal',
      phoneMasked: '96***8810',
      city: 'Hyderabad, TS',
      earnings: 1150,
      tasksDone: 15,
      avatarColor: 'from-indigo-400 to-blue-600'
    }
  ];

  // Current user custom standing
  const currentUserRank: EarnerRecord = {
    rank: 14,
    name: userDetails?.fullName || 'Rahul Sharma (You)',
    phoneMasked: `${userPhone.slice(0, 2)}***${userPhone.slice(-4)}`,
    city: 'Your City',
    earnings: Math.max(userBalance * 3, 780),
    tasksDone: 12,
    avatarColor: 'from-[#4B63FF] to-[#2E42E2]',
    isCurrentUser: true
  };

  const rank1 = topEarnersList[0];
  const rank2 = topEarnersList[1];
  const rank3 = topEarnersList[2];

  return (
    <div id="leaderboard-view" className="w-full h-full flex flex-col bg-[#F8FAFC] text-slate-800 relative overflow-hidden text-left">
      {/* Top Header Bar (Matching Referral History Style) */}
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
              Top Earners & Leaderboard
            </h2>
            <p className="text-[10px] text-slate-400 font-medium leading-none">
              Weekly ₹10,000 contest & earner rankings
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border bg-amber-50 border-amber-200 text-amber-800 text-xs font-black">
          <Trophy className="w-3.5 h-3.5 text-amber-600" />
          <span>₹10,000 Pool</span>
        </div>
      </header>

      {/* Timeframe Filter Tabs */}
      <div className="shrink-0 px-4 pt-3 pb-1 bg-white/60 border-b border-slate-200/60">
        <div className="grid grid-cols-3 gap-1.5 text-xs font-bold">
          <button
            onClick={() => setTimeframe('weekly')}
            className={`py-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 ${
              timeframe === 'weekly'
                ? 'bg-[#4B63FF] text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/60'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-amber-300" />
            <span>This Week</span>
          </button>
          <button
            onClick={() => setTimeframe('daily')}
            className={`py-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 ${
              timeframe === 'daily'
                ? 'bg-[#4B63FF] text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/60'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Today</span>
          </button>
          <button
            onClick={() => setTimeframe('alltime')}
            className={`py-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 ${
              timeframe === 'alltime'
                ? 'bg-[#4B63FF] text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/60'
            }`}
          >
            <Star className="w-3.5 h-3.5" />
            <span>All-Time</span>
          </button>
        </div>
      </div>

      {/* Scrollable Body */}
      <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4 text-left scrollbar-thin overscroll-contain">
        
        {/* Contest Info Banner */}
        <div className="p-4 rounded-3xl bg-gradient-to-br from-[#1E293B] via-[#0F172A] to-[#1E1B4B] text-white shadow-lg space-y-3 relative overflow-hidden">
          <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-amber-500/10 rounded-full blur-xl pointer-events-none" />
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-amber-400/20 border border-amber-400/30 flex items-center justify-center text-amber-300">
                <Crown className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10.5px] font-bold text-amber-300 uppercase tracking-wider block">
                  Mega Weekly League
                </span>
                <h3 className="text-sm font-extrabold text-white">
                  Top 10 Earners Win Direct Cash
                </h3>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-slate-400 block font-medium">Ends In</span>
              <span className="text-xs font-mono font-black text-amber-400 bg-white/10 px-2 py-0.5 rounded-lg">
                2d 14h 22m
              </span>
            </div>
          </div>

          <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-300">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Prizes credited straight to UPI/Wallet</span>
            </div>
            <button 
              onClick={() => showToast('🏆 Complete tasks & offerwalls to climb the leaderboard rank!')}
              className="text-amber-300 hover:underline font-bold cursor-pointer"
            >
              How it works?
            </button>
          </div>
        </div>

        {/* TOP 3 PODIUM DISPLAY */}
        <div className="p-4 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
          <div className="text-center space-y-0.5">
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
              Podium Champions
            </h4>
            <p className="text-[10.5px] text-slate-400">Leading earners of this weekly season</p>
          </div>

          <div className="grid grid-cols-3 gap-2 items-end pt-2">
            
            {/* Rank 2 (Silver) */}
            <div className="text-center space-y-2">
              <div className="relative inline-block">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-200 to-slate-400 p-0.5 mx-auto shadow-sm">
                  <div className="w-full h-full rounded-[14px] bg-slate-800 text-white flex items-center justify-center font-black text-sm">
                    {rank2.name.split(' ').map(n => n[0]).join('')}
                  </div>
                </div>
                <div className="absolute -bottom-2 -right-1 w-6 h-6 rounded-full bg-slate-300 text-slate-800 border-2 border-white flex items-center justify-center text-[10px] font-black shadow-xs">
                  2
                </div>
              </div>

              <div className="space-y-0.5">
                <h5 className="text-[11px] font-extrabold text-slate-800 truncate px-1">{rank2.name}</h5>
                <span className="text-[10px] text-slate-400 block">{rank2.city}</span>
                <span className="text-xs font-black text-[#4B63FF] block font-outfit">₹{rank2.earnings}</span>
                <span className="text-[9.5px] font-extrabold text-amber-700 bg-amber-100 px-1.5 py-0.2 rounded-full inline-block">
                  Prize: ₹{rank2.prizeAmount}
                </span>
              </div>
            </div>

            {/* Rank 1 (Gold / Crown Champion) */}
            <div className="text-center space-y-2 -translate-y-2">
              <div className="relative inline-block">
                <Crown className="w-6 h-6 text-amber-500 absolute -top-4 left-1/2 -translate-x-1/2 animate-bounce" />
                <div className="w-18 h-18 rounded-3xl bg-gradient-to-br from-amber-300 via-amber-400 to-amber-600 p-1 mx-auto shadow-lg shadow-amber-500/20">
                  <div className="w-full h-full rounded-[20px] bg-slate-900 text-white flex items-center justify-center font-black text-base">
                    {rank1.name.split(' ').map(n => n[0]).join('')}
                  </div>
                </div>
                <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-amber-400 text-amber-950 border-2 border-white flex items-center justify-center text-[10px] font-black shadow-xs whitespace-nowrap">
                  👑 #1
                </div>
              </div>

              <div className="space-y-0.5 pt-1">
                <h5 className="text-xs font-black text-slate-900 truncate px-1">{rank1.name}</h5>
                <span className="text-[10.5px] text-slate-400 block">{rank1.city}</span>
                <span className="text-sm font-black text-[#4B63FF] block font-outfit">₹{rank1.earnings}</span>
                <span className="text-[10px] font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full inline-block">
                  Win ₹{rank1.prizeAmount}
                </span>
              </div>
            </div>

            {/* Rank 3 (Bronze) */}
            <div className="text-center space-y-2">
              <div className="relative inline-block">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-600 to-amber-800 p-0.5 mx-auto shadow-sm">
                  <div className="w-full h-full rounded-[14px] bg-slate-800 text-white flex items-center justify-center font-black text-sm">
                    {rank3.name.split(' ').map(n => n[0]).join('')}
                  </div>
                </div>
                <div className="absolute -bottom-2 -right-1 w-6 h-6 rounded-full bg-amber-700 text-white border-2 border-white flex items-center justify-center text-[10px] font-black shadow-xs">
                  3
                </div>
              </div>

              <div className="space-y-0.5">
                <h5 className="text-[11px] font-extrabold text-slate-800 truncate px-1">{rank3.name}</h5>
                <span className="text-[10px] text-slate-400 block">{rank3.city}</span>
                <span className="text-xs font-black text-[#4B63FF] block font-outfit">₹{rank3.earnings}</span>
                <span className="text-[9.5px] font-extrabold text-amber-700 bg-amber-100 px-1.5 py-0.2 rounded-full inline-block">
                  Prize: ₹{rank3.prizeAmount}
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* Current User Standing Card */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/80 shadow-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#4B63FF] text-white flex items-center justify-center font-black text-xs shrink-0 shadow-xs">
              #{currentUserRank.rank}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h5 className="text-xs font-black text-slate-900">Your Current Rank</h5>
                <span className="text-[9.5px] font-extrabold bg-[#4B63FF] text-white px-1.5 py-0.2 rounded-md">
                  You
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                {currentUserRank.tasksDone} tasks done • Earned ₹{currentUserRank.earnings}
              </p>
            </div>
          </div>

          <button
            onClick={() => showToast('⚡ Complete more tasks from Task Center to reach Top 10!')}
            className="px-3 py-1.5 rounded-xl bg-[#4B63FF] hover:bg-[#3549EC] text-white text-[11px] font-extrabold shadow-xs cursor-pointer active:scale-95 transition-all"
          >
            Boost Rank
          </button>
        </div>

        {/* Ranks 4 to 12 List */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
              Top Ranked Earners
            </span>
            <span className="text-[10.5px] text-slate-400 font-semibold">
              Ranks 4 - 12
            </span>
          </div>

          <div className="space-y-2">
            {topEarnersList.slice(3).map((earner) => (
              <div
                key={earner.rank}
                className="p-3 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 font-black text-xs flex items-center justify-center shrink-0">
                    {earner.rank}
                  </div>

                  <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${earner.avatarColor} text-white flex items-center justify-center text-xs font-black shrink-0`}>
                    {earner.name.split(' ').map(n => n[0]).join('')}
                  </div>

                  <div className="min-w-0">
                    <h5 className="text-xs font-extrabold text-slate-900 truncate">
                      {earner.name}
                    </h5>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 font-medium">
                      <span>{earner.city}</span>
                      <span>•</span>
                      <span>{earner.tasksDone} tasks</span>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs font-black text-slate-900 font-outfit block">
                    ₹{earner.earnings}
                  </span>
                  {earner.prizeAmount ? (
                    <span className="text-[9.5px] font-extrabold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded-full">
                      Prize: ₹{earner.prizeAmount}
                    </span>
                  ) : (
                    <span className="text-[9.5px] font-semibold text-slate-400">
                      Tier 2
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contest Rules Footer */}
        <div className="p-4 rounded-3xl bg-slate-100/80 border border-slate-200/80 space-y-2 text-[11px] text-slate-600">
          <div className="flex items-center gap-1.5 font-bold text-slate-800">
            <Info className="w-4 h-4 text-[#4B63FF]" />
            <span>Leaderboard Rules & Anti-Cheat</span>
          </div>
          <p className="text-slate-500 text-[10.5px]">
            Rankings are updated in real-time based on approved task earnings, offerwall surveys, and active referrals. Duplicate accounts or bot clicks will be automatically disqualified.
          </p>
        </div>

      </div>
    </div>
  );
};
