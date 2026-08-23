import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Gift, 
  RotateCw, 
  Sparkles, 
  Tv, 
  Tag, 
  Trophy, 
  ArrowRight, 
  Wallet, 
  CircleDollarSign 
} from 'lucide-react';
import { DailyCheckInSection } from './DailyCheckInSection';
import { SpinWheelModal } from './SpinWheelModal';
import { ScratchCardModal } from './ScratchCardModal';
import { WatchAdsModal } from './WatchAdsModal';
import { CouponCodeModal } from './CouponCodeModal';

interface RewardCenterProps {
  onEarn: (amount: number, reason: string) => void;
  onOpenWithdraw: () => void;
  showToast: (msg: string) => void;
}

export const RewardCenter: React.FC<RewardCenterProps> = ({
  onEarn,
  onOpenWithdraw,
  showToast
}) => {
  // Modal toggles
  const [showSpinModal, setShowSpinModal] = useState(false);
  const [showScratchModal, setShowScratchModal] = useState(false);
  const [showAdsModal, setShowAdsModal] = useState(false);
  const [showCouponModal, setShowCouponModal] = useState(false);

  return (
    <div className="space-y-4">
      {/* 1. Header Banner */}
      <div className="p-4 rounded-3xl bg-gradient-to-br from-amber-500 via-orange-500 to-[#4B63FF] text-white shadow-lg shadow-orange-500/20 text-left relative overflow-hidden">
        <div className="relative z-10 space-y-1">
          <span className="text-[10px] font-black uppercase tracking-widest bg-white/20 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            REWARD & EARN CENTER
          </span>
          <h3 className="text-lg font-black font-outfit">Exclusive Cash Rewards</h3>
          <p className="text-xs text-white/90">
            Spin the wheel, scratch lucky cards, watch ads & claim daily cash!
          </p>
        </div>
        <div className="absolute right-2 -bottom-2 opacity-20 pointer-events-none">
          <Gift className="w-24 h-24 text-white" />
        </div>
      </div>

      {/* 2. 7-Day Daily Check-In Streak */}
      <DailyCheckInSection onEarn={onEarn} showToast={showToast} />

      {/* 3. 4-Grid Reward Features (Spin, Scratch, Watch Ads, Coupon Code) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
            <CircleDollarSign className="w-4 h-4 text-[#4B63FF]" />
            <span>Instant Cash Games & Activities</span>
          </h4>
          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
            All Free
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {/* A. SPIN WHEEL */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowSpinModal(true)}
            id="reward-spin-btn"
            className="p-3.5 rounded-3xl bg-gradient-to-br from-indigo-50 via-white to-blue-50/70 border border-indigo-100/90 shadow-xs hover:border-indigo-300 text-left space-y-2 cursor-pointer transition-all relative overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#4B63FF] to-blue-400 text-white flex items-center justify-center shadow-sm">
                <RotateCw className="w-5 h-5" />
              </div>
              <span className="text-[9px] font-black uppercase bg-indigo-100 text-indigo-800 px-1.5 py-0.5 rounded-md">
                Up to ₹50
              </span>
            </div>
            <div>
              <div className="text-xs font-black text-slate-900 font-outfit">Lucky Spin Wheel</div>
              <div className="text-[10px] text-slate-500 font-medium">3 Free Spins Today</div>
            </div>
          </motion.button>

          {/* B. SCRATCH CARDS */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowScratchModal(true)}
            id="reward-scratch-btn"
            className="p-3.5 rounded-3xl bg-gradient-to-br from-amber-50 via-white to-orange-50/70 border border-amber-100/90 shadow-xs hover:border-amber-300 text-left space-y-2 cursor-pointer transition-all relative overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 text-white flex items-center justify-center shadow-sm">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="text-[9px] font-black uppercase bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded-md">
                3 Cards
              </span>
            </div>
            <div>
              <div className="text-xs font-black text-slate-900 font-outfit">Scratch Cards</div>
              <div className="text-[10px] text-slate-500 font-medium">Win up to ₹35 Cash</div>
            </div>
          </motion.button>

          {/* C. WATCH VIDEO ADS */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowAdsModal(true)}
            id="reward-watch-ads-btn"
            className="p-3.5 rounded-3xl bg-gradient-to-br from-emerald-50 via-white to-teal-50/70 border border-emerald-100/90 shadow-xs hover:border-emerald-300 text-left space-y-2 cursor-pointer transition-all relative overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 text-white flex items-center justify-center shadow-sm">
                <Tv className="w-5 h-5" />
              </div>
              <span className="text-[9px] font-black uppercase bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-md">
                +₹5 / Ad
              </span>
            </div>
            <div>
              <div className="text-xs font-black text-slate-900 font-outfit">Watch Video Ads</div>
              <div className="text-[10px] text-slate-500 font-medium">5 Short Ads Daily</div>
            </div>
          </motion.button>

          {/* D. COUPON CODE */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowCouponModal(true)}
            id="reward-coupon-btn"
            className="p-3.5 rounded-3xl bg-gradient-to-br from-pink-50 via-white to-purple-50/70 border border-pink-100/90 shadow-xs hover:border-pink-300 text-left space-y-2 cursor-pointer transition-all relative overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-pink-500 to-purple-600 text-white flex items-center justify-center shadow-sm">
                <Tag className="w-5 h-5" />
              </div>
              <span className="text-[9px] font-black uppercase bg-pink-100 text-pink-800 px-1.5 py-0.5 rounded-md">
                Promo Code
              </span>
            </div>
            <div>
              <div className="text-xs font-black text-slate-900 font-outfit">Redeem Coupon</div>
              <div className="text-[10px] text-slate-500 font-medium">Instant Cash Bonus</div>
            </div>
          </motion.button>
        </div>
      </div>

      {/* 4. Cash Milestones / Quests (Original) */}
      <div className="p-4 rounded-3xl bg-white/90 border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-emerald-600" />
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">Cash Level Milestones</h4>
          </div>
          <span className="text-[10px] font-bold text-emerald-600">Level 2 Active</span>
        </div>

        <div className="space-y-2">
          <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-slate-800">Complete 5 Tasks Today</div>
              <div className="text-[10px] text-slate-400">Progress: 4/5 tasks done</div>
            </div>
            <button
              onClick={() => onEarn(5, '5 Tasks Milestone')}
              className="px-3 py-1 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-xs hover:bg-emerald-500 cursor-pointer"
            >
              + ₹5 Cash
            </button>
          </div>

          <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-slate-800">Invite 3 Friends</div>
              <div className="text-[10px] text-slate-400">Progress: 12 invited (Completed)</div>
            </div>
            <button
              onClick={() => onEarn(20, 'Invite Milestone')}
              className="px-3 py-1 rounded-xl bg-primary-gradient text-white text-xs font-bold shadow-xs hover:opacity-95 cursor-pointer"
            >
              + ₹20 Cash
            </button>
          </div>
        </div>
      </div>

      {/* 5. Direct Withdraw CTA Banner */}
      <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-600 text-white shrink-0">
            <Wallet className="w-4 h-4" />
          </div>
          <div className="text-left">
            <div className="text-xs font-extrabold text-emerald-950">Ready to cash out?</div>
            <div className="text-[10px] text-emerald-700 font-medium">Instant transfer to your UPI / Bank (0% Fee)</div>
          </div>
        </div>
        <button
          onClick={onOpenWithdraw}
          className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-sm flex items-center gap-1 cursor-pointer"
        >
          <span>Withdraw</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Popups & Modals */}
      <SpinWheelModal
        isOpen={showSpinModal}
        onClose={() => setShowSpinModal(false)}
        onEarn={onEarn}
        showToast={showToast}
      />
      <ScratchCardModal
        isOpen={showScratchModal}
        onClose={() => setShowScratchModal(false)}
        onEarn={onEarn}
        showToast={showToast}
      />
      <WatchAdsModal
        isOpen={showAdsModal}
        onClose={() => setShowAdsModal(false)}
        onEarn={onEarn}
        showToast={showToast}
      />
      <CouponCodeModal
        isOpen={showCouponModal}
        onClose={() => setShowCouponModal(false)}
        onEarn={onEarn}
        showToast={showToast}
      />
    </div>
  );
};
