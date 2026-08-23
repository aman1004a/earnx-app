import React, { useState } from 'react';
import { Calendar, CheckCircle2, Sparkles, Flame, Play } from 'lucide-react';
import { motion } from 'motion/react';
import { triggerWinConfetti } from './confettiHelper';
import { RewardedAdPlayer } from './RewardedAdPlayer';

interface DailyCheckInProps {
  onEarn: (amount: number, reason: string) => void;
  showToast: (msg: string) => void;
}

export const DailyCheckInSection: React.FC<DailyCheckInProps> = ({ onEarn, showToast }) => {
  const [claimedDays, setClaimedDays] = useState<number[]>([1, 2]);
  const [currentDay] = useState<number>(3);
  const [isClaiming, setIsClaiming] = useState(false);
  const [showAutoCheckInAd, setShowAutoCheckInAd] = useState(false);

  const streakDays = [
    { day: 1, reward: 2, label: 'Day 1' },
    { day: 2, reward: 3, label: 'Day 2' },
    { day: 3, reward: 5, label: 'Day 3', isToday: true },
    { day: 4, reward: 7, label: 'Day 4' },
    { day: 5, reward: 10, label: 'Day 5' },
    { day: 6, reward: 15, label: 'Day 6' },
    { day: 7, reward: 30, label: 'Day 7', isMega: true }
  ];

  const todayObj = streakDays.find(d => d.day === currentDay);
  const todayReward = todayObj ? todayObj.reward : 5;

  const handleClaimToday = () => {
    if (claimedDays.includes(currentDay)) {
      showToast('⚠️ Today\'s daily check-in already claimed! Next reward unlocks tomorrow.');
      return;
    }
    setIsClaiming(true);
    // Open video ad immediately to claim check-in reward
    setTimeout(() => {
      setShowAutoCheckInAd(true);
    }, 200);
  };

  const handleAutoAdEarned = (amount?: number) => {
    if (!claimedDays.includes(currentDay)) {
      setClaimedDays(prev => [...prev, currentDay]);
    }
    setIsClaiming(false);
    const finalAmount = amount || todayReward;
    onEarn(finalAmount, `Day ${currentDay} Daily Check-In`);
    triggerWinConfetti();
    showToast(`🎉 Claimed +₹${finalAmount} from Daily Check-In! Streak: ${currentDay} Days 🔥`);
  };

  const isTodayClaimed = claimedDays.includes(currentDay);

  return (
    <>
      <div className="p-4 rounded-3xl bg-white/90 border border-slate-200/80 shadow-xs space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">7-Day Check-In Streak</h4>
                <span className="flex items-center gap-0.5 text-[10px] font-black text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded-md">
                  <Flame className="w-3 h-3 fill-orange-500 text-orange-500" />
                  {claimedDays.length}D Streak
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium">Claim progressive cash rewards every day</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Standard Claim Button */}
            <button
              onClick={handleClaimToday}
              disabled={isTodayClaimed || isClaiming}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1 ${
                isTodayClaimed
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-sm shadow-orange-500/20'
              }`}
            >
              {isTodayClaimed ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Claimed</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Claim ₹{todayReward}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* 7-Days Horizontal Ribbon */}
        <div className="grid grid-cols-7 gap-1.5 pt-1">
          {streakDays.map((item) => {
            const isClaimed = claimedDays.includes(item.day);
            const isCurrent = item.day === currentDay;

            return (
              <motion.div
                key={item.day}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  if (isCurrent && !isClaimed) {
                    handleClaimToday();
                  }
                }}
                className={`flex flex-col items-center justify-between p-1.5 py-2 rounded-2xl border transition-all text-center relative ${
                  isClaimed
                    ? 'bg-emerald-50/80 border-emerald-200 text-emerald-800'
                    : isCurrent
                    ? 'bg-amber-50 border-amber-400 shadow-xs shadow-amber-300/30 text-amber-900 ring-2 ring-amber-400/30 cursor-pointer animate-pulse'
                    : item.isMega
                    ? 'bg-gradient-to-b from-indigo-50 to-purple-50 border-indigo-200 text-indigo-900'
                    : 'bg-slate-50/80 border-slate-200/60 text-slate-400'
                }`}
              >
                {item.isMega && (
                  <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 text-[7px] font-black uppercase bg-indigo-600 text-white px-1 rounded-full whitespace-nowrap">
                    Mega
                  </span>
                )}
                <span className="text-[9px] font-bold">D{item.day}</span>
                <div className="my-0.5">
                  {isClaimed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <span className={`text-[11px] font-black ${isCurrent ? 'text-amber-700 font-mono' : item.isMega ? 'text-indigo-700 font-mono' : 'text-slate-600 font-mono'}`}>
                      ₹{item.reward}
                    </span>
                  )}
                </div>
                <span className="text-[8px] font-semibold opacity-70">
                  {isClaimed ? 'Done' : isCurrent ? 'Today' : 'Lock'}
                </span>
              </motion.div>
            );
          })}
        </div>

        {/* In-Section Sponsored Native Banner Ad */}
        <div className="p-2 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
          <div className="flex items-center gap-2 text-left">
            <span className="text-[8px] font-black uppercase bg-slate-200 text-slate-600 px-1 py-0.5 rounded">AD</span>
            <span className="text-[10px] font-bold text-slate-700">Flipkart Mega Sale: Up to 80% Off Deals</span>
          </div>
          <span className="text-[10px] font-black text-indigo-600">Shop Now →</span>
        </div>
      </div>

      {/* Rewarded Ad Player for Daily Check-In Claim Automatic Ad */}
      <RewardedAdPlayer
        isOpen={showAutoCheckInAd}
        onClose={() => {
          setShowAutoCheckInAd(false);
          setIsClaiming(false);
        }}
        onRewardEarned={handleAutoAdEarned}
        adTitle="Daily Check-In Cash Video Ad"
        rewardText={`Day ${currentDay} Check-In +₹${todayReward}`}
        bonusAmount={todayReward}
      />
    </>
  );
};
