import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Volume2, VolumeX, ShieldCheck, CheckCircle2, Sparkles, X, Trophy } from 'lucide-react';
import { triggerWinConfetti } from './confettiHelper';

export interface RewardedAdProps {
  isOpen: boolean;
  onClose: () => void;
  onRewardEarned: (bonusAmount?: number) => void;
  adTitle?: string;
  rewardText?: string;
  bonusAmount?: number;
  durationSeconds?: number;
}

interface AdSponsor {
  brand: string;
  tagline: string;
  category: string;
  gradient: string;
  badge: string;
}

const SPONSORS: AdSponsor[] = [
  {
    brand: 'WinZO Super Gaming',
    tagline: 'Play 100+ Real Money Games & Win Lakhs Daily',
    category: 'Casual & Esports Gaming',
    gradient: 'from-amber-600 via-orange-600 to-red-600',
    badge: 'Trending Game #1'
  },
  {
    brand: 'Dream11 Premier League',
    tagline: 'Make your dream cricket team & compete for ₹1 Crore',
    category: 'Fantasy Sports',
    gradient: 'from-rose-600 via-red-600 to-pink-700',
    badge: 'Official Sponsor'
  },
  {
    brand: 'Flipkart Big Savings Days',
    tagline: 'Up to 80% Off on Electronics, Fashion & Mobiles',
    category: 'Mega Online Shopping',
    gradient: 'from-blue-600 via-indigo-600 to-violet-700',
    badge: 'Verified Deal'
  },
  {
    brand: 'CoinDCX Crypto India',
    tagline: 'Start investing in Bitcoin & Crypto with just ₹100',
    category: 'Secure Financial Trading',
    gradient: 'from-emerald-600 via-teal-600 to-cyan-700',
    badge: '100% Safe & Regulated'
  }
];

export const RewardedAdPlayer: React.FC<RewardedAdProps> = ({
  isOpen,
  onClose,
  onRewardEarned,
  adTitle = 'Sponsored Video Ad',
  rewardText = 'Guaranteed Cash Reward',
  bonusAmount = 5,
  durationSeconds = 6
}) => {
  const [countdown, setCountdown] = useState(durationSeconds);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [sponsorIndex, setSponsorIndex] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setCountdown(durationSeconds);
      setIsCompleted(false);
      setSponsorIndex(Math.floor(Math.random() * SPONSORS.length));
    }
  }, [isOpen, durationSeconds]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isOpen && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    } else if (isOpen && countdown === 0 && !isCompleted) {
      setIsCompleted(true);
    }
    return () => clearTimeout(timer);
  }, [isOpen, countdown, isCompleted]);

  if (!isOpen) return null;

  const currentSponsor = SPONSORS[sponsorIndex] || SPONSORS[0];

  const handleClaim = () => {
    triggerWinConfetti();
    onRewardEarned(bonusAmount);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3.5 bg-slate-950/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 15 }}
          className="w-full max-w-sm bg-slate-900 border border-slate-700/80 rounded-3xl overflow-hidden shadow-2xl text-white flex flex-col relative"
        >
          {/* Top Info Bar */}
          <div className="p-3 bg-slate-950/80 flex items-center justify-between border-b border-slate-800 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-md">
                AD SPONSOR
              </span>
              <span className="text-slate-300 font-bold truncate max-w-[130px]">{adTitle}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="p-1 rounded-lg bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              </button>
              {/* Countdown / Close */}
              {isCompleted ? (
                <button
                  onClick={onClose}
                  className="p-1 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              ) : (
                <span className="text-[10px] font-mono font-black bg-slate-800 px-2 py-0.5 rounded-full text-amber-400">
                  {countdown}s remaining
                </span>
              )}
            </div>
          </div>

          {/* Video Player Display Container */}
          <div className="relative w-full h-64 bg-slate-950 flex flex-col justify-between p-4 overflow-hidden">
            {/* Animated Gradient Background */}
            <div className={`absolute inset-0 bg-gradient-to-br ${currentSponsor.gradient} opacity-25`} />

            {/* Top Sponsor Badge */}
            <div className="relative z-10 flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-300 bg-slate-900/80 px-2.5 py-1 rounded-full border border-slate-700/50">
                {currentSponsor.category}
              </span>
              <span className="text-[10px] font-black text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded-md border border-amber-500/40">
                {currentSponsor.badge}
              </span>
            </div>

            {/* Central High-Impact Branding Video Visual */}
            <div className="relative z-10 flex flex-col items-center justify-center text-center space-y-2.5 my-auto">
              <motion.div
                animate={{ scale: [1, 1.06, 1], rotate: [0, 1, -1, 0] }}
                transition={{ repeat: Infinity, duration: 2.2 }}
                className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-amber-400 via-orange-500 to-indigo-600 p-0.5 flex items-center justify-center shadow-xl"
              >
                <div className="w-full h-full bg-slate-900 rounded-[22px] flex items-center justify-center">
                  <Play className="w-7 h-7 text-amber-400 fill-amber-400 ml-1" />
                </div>
              </motion.div>
              <div>
                <h4 className="text-base font-black font-outfit text-white drop-shadow-sm">
                  {currentSponsor.brand}
                </h4>
                <p className="text-xs text-slate-300 max-w-[240px] mx-auto mt-0.5 leading-snug">
                  {currentSponsor.tagline}
                </p>
              </div>
            </div>

            {/* Bottom Progress Bar */}
            <div className="relative z-10 space-y-1.5">
              <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium">
                <span>{isCompleted ? 'Reward Unlocked!' : 'Viewing sponsored partner ad...'}</span>
                <span className="text-amber-400 font-bold">{rewardText}</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <motion.div
                  className="bg-gradient-to-r from-amber-400 to-emerald-400 h-full"
                  initial={{ width: '0%' }}
                  animate={{ width: isCompleted ? '100%' : `${((durationSeconds - countdown) / durationSeconds) * 100}%` }}
                  transition={{ ease: 'linear' }}
                />
              </div>
            </div>
          </div>

          {/* Reward Status & CTA Footer */}
          <div className="p-4 bg-slate-900 border-t border-slate-800 space-y-2.5 text-center">
            {isCompleted ? (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="space-y-2.5"
              >
                <div className="flex items-center justify-center gap-1.5 text-xs font-black text-emerald-400 bg-emerald-950/60 p-2 rounded-xl border border-emerald-500/30">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Video Ad Completed! Reward is ready.</span>
                </div>
                <button
                  id="btn-claim-ad-reward"
                  onClick={handleClaim}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer transition-all animate-pulse"
                >
                  <Trophy className="w-4 h-4 text-amber-300" />
                  <span>
                    {bonusAmount > 0
                      ? `Claim + ₹${bonusAmount} Reward Now`
                      : 'Claim Reward Now'}
                  </span>
                </button>
              </motion.div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-1 text-[11px] text-slate-400 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Do not close window until countdown finishes ({countdown}s)</span>
                </div>
                <button
                  disabled
                  className="w-full py-3 rounded-2xl bg-slate-800 text-slate-500 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-not-allowed"
                >
                  <span>Playing Sponsor Ad ({countdown}s)...</span>
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
