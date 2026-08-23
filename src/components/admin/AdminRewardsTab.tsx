import React, { useState } from 'react';
import { 
  Gift, 
  RotateCw, 
  Sparkles, 
  Layers, 
  Save, 
  CheckCircle2, 
  Smartphone, 
  Edit3, 
  Plus, 
  Trash2,
  Percent,
  Sliders,
  DollarSign
} from 'lucide-react';
import { AppGlobalConfig } from '../../utils/adminStorage';
import { useAdminTheme } from './AdminThemeContext';

interface AdminRewardsTabProps {
  config: AppGlobalConfig;
  onUpdateConfig: (config: AppGlobalConfig) => void;
  showToast: (msg: string) => void;
}

export const AdminRewardsTab: React.FC<AdminRewardsTabProps> = ({
  config,
  onUpdateConfig,
  showToast
}) => {
  const { isDark } = useAdminTheme();

  // Scratch Card Prizes Configuration
  const [scratchPrizes, setScratchPrizes] = useState<number[]>(
    config.scratchCardRewards || [5, 10, 15, 20, 25, 50, 100]
  );
  const [newPrize, setNewPrize] = useState('');

  // Daily Checkin Streak Rewards
  const [checkinStreak, setCheckinStreak] = useState<number[]>(
    config.dailyCheckinRewards || [2, 5, 8, 12, 15, 20, 50]
  );

  // Spin Wheel Probabilities
  const [spinValues, setSpinValues] = useState<number[]>([1, 2, 5, 10, 20, 50]);

  const handleAddScratchPrize = () => {
    const val = parseInt(newPrize);
    if (!isNaN(val) && val > 0 && !scratchPrizes.includes(val)) {
      const updated = [...scratchPrizes, val].sort((a, b) => a - b);
      setScratchPrizes(updated);
      setNewPrize('');
      onUpdateConfig({
        ...config,
        scratchCardRewards: updated
      });
      showToast(`Added ₹${val} to scratch card prize pool`);
    }
  };

  const handleRemoveScratchPrize = (val: number) => {
    if (scratchPrizes.length <= 3) {
      showToast('⚠️ Minimum 3 prize tiers required');
      return;
    }
    const updated = scratchPrizes.filter(p => p !== val);
    setScratchPrizes(updated);
    onUpdateConfig({
      ...config,
      scratchCardRewards: updated
    });
    showToast(`Removed ₹${val} prize tier`);
  };

  const handleUpdateCheckin = (dayIdx: number, val: number) => {
    const updated = [...checkinStreak];
    updated[dayIdx] = val;
    setCheckinStreak(updated);
    onUpdateConfig({
      ...config,
      dailyCheckinRewards: updated
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={`p-5 rounded-3xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
        isDark ? 'bg-[#1E293B] border-slate-800' : 'bg-white border-slate-200/90'
      }`}>
        <div>
          <h3 className={`text-base font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Game Engine & Reward Probability Algorithms
          </h3>
          <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Control winning distributions, jackpot caps, scratch card pools, and 7-day login streaks
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Scratch Card Mystery Prize Pool */}
        <div className={`p-5 rounded-3xl border space-y-4 ${
          isDark ? 'bg-[#1E293B] border-slate-800' : 'bg-white border-slate-200/90 shadow-xs'
        }`}>
          <div className="flex items-center gap-2 text-indigo-400">
            <Sparkles className="w-5 h-5" />
            <h4 className={`text-sm font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Scratch Card Prize Distribution Pool
            </h4>
          </div>

          <p className="text-xs text-slate-400">
            Users will randomly reveal one of these amounts when scratching their daily cards:
          </p>

          {/* Current Pool Badges */}
          <div className="flex flex-wrap gap-2 pt-1">
            {scratchPrizes.map((prize) => (
              <span
                key={prize}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-mono font-black"
              >
                ₹ {prize}
                <button
                  onClick={() => handleRemoveScratchPrize(prize)}
                  className="text-slate-400 hover:text-rose-400 cursor-pointer ml-1"
                >
                  ✕
                </button>
              </span>
            ))}
          </div>

          {/* Add Tier */}
          <div className="flex items-center gap-2 pt-2">
            <input
              type="number"
              min="1"
              placeholder="Amount (₹)..."
              value={newPrize}
              onChange={(e) => setNewPrize(e.target.value)}
              className={`flex-1 px-3.5 py-2 rounded-2xl text-xs font-mono border focus:outline-hidden ${
                isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
              }`}
            />
            <button
              onClick={handleAddScratchPrize}
              className="px-4 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black cursor-pointer shadow-xs"
            >
              + Add Tier
            </button>
          </div>
        </div>

        {/* 7-Day Check-in Streak Config */}
        <div className={`p-5 rounded-3xl border space-y-4 ${
          isDark ? 'bg-[#1E293B] border-slate-800' : 'bg-white border-slate-200/90 shadow-xs'
        }`}>
          <div className="flex items-center gap-2 text-emerald-400">
            <Gift className="w-5 h-5" />
            <h4 className={`text-sm font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
              7-Day Daily Login Streak Ladder (₹ INR)
            </h4>
          </div>

          <p className="text-xs text-slate-400">
            Customize daily loyalty rewards for consistent app openers:
          </p>

          <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 pt-1">
            {checkinStreak.map((amt, idx) => (
              <div key={idx} className="space-y-1 text-center">
                <span className="text-[10px] font-bold text-slate-400 block">Day {idx + 1}</span>
                <input
                  type="number"
                  min="1"
                  value={amt}
                  onChange={(e) => handleUpdateCheckin(idx, Number(e.target.value))}
                  className={`w-full py-1.5 text-center text-xs font-mono font-black rounded-xl border ${
                    isDark ? 'bg-slate-900 border-slate-700 text-emerald-400' : 'bg-slate-50 border-slate-200 text-emerald-600'
                  }`}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
