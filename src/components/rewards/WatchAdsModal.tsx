import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Play, Sparkles, CheckCircle2, Clock, Volume2, VolumeX, ShieldCheck, Trophy, Flame } from 'lucide-react';
import { triggerWinConfetti } from './confettiHelper';

interface WatchAdsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEarn: (amount: number, reason: string) => void;
  showToast: (msg: string) => void;
}

interface VideoSponsor {
  name: string;
  tagline: string;
  category: string;
  gradient: string;
  badge: string;
}

const SPONSORS: VideoSponsor[] = [
  {
    name: 'Dream11 Fantasy Sports',
    tagline: 'Join Mega Contest ₹1 Crore Daily. Use Code CRICKET to get ₹500 Bonus.',
    category: 'Official Sports Partner',
    gradient: 'from-rose-600 via-red-600 to-pink-700',
    badge: 'Sponsored Ad #1'
  },
  {
    name: 'WinZO Super Gaming',
    tagline: 'Play 100+ Games & Win Real Cash with Instant UPI Withdrawals.',
    category: 'Top Real Money Gaming',
    gradient: 'from-amber-600 via-orange-600 to-red-600',
    badge: 'Verified Sponsor'
  },
  {
    name: 'CoinDCX Crypto App',
    tagline: 'Buy Bitcoin & Ethereum from ₹100. Safe, Secure & FIU Compliant.',
    category: 'Investment & Finance',
    gradient: 'from-emerald-600 via-teal-600 to-cyan-700',
    badge: 'Finance Partner'
  },
  {
    name: 'Flipkart Super Deals',
    tagline: 'Electronics, Smartphones & Lifestyle Deals with Free Fast Delivery.',
    category: 'Mega Online Shopping',
    gradient: 'from-blue-600 via-indigo-600 to-violet-700',
    badge: 'Exclusive Deal'
  }
];

export const WatchAdsModal: React.FC<WatchAdsModalProps> = ({
  isOpen,
  onClose,
  onEarn,
  showToast
}) => {
  const [adsWatched, setAdsWatched] = useState(1);
  const totalDailyAds = 6;
  const rewardPerAd = 5;

  const [isPlaying, setIsPlaying] = useState(false);
  const [countdown, setCountdown] = useState(6);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [sponsorIndex, setSponsorIndex] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    } else if (isPlaying && countdown === 0) {
      setIsCompleted(true);
      setIsPlaying(false);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, countdown]);

  if (!isOpen) return null;

  const currentSponsor = SPONSORS[sponsorIndex % SPONSORS.length];

  const handleStartWatch = () => {
    if (adsWatched >= totalDailyAds) {
      showToast('⚠️ Daily Ad limit reached! Come back tomorrow for new rewarded ads.');
      return;
    }
    setSponsorIndex(prev => (prev + 1) % SPONSORS.length);
    setCountdown(6);
    setIsCompleted(false);
    setIsPlaying(true);
  };

  const handleClaimReward = () => {
    const nextWatched = adsWatched + 1;
    setAdsWatched(nextWatched);
    setIsCompleted(false);
    
    // Bonus for milestone (3rd ad gives bonus)
    const isMilestone = nextWatched === 3;
    const finalReward = isMilestone ? rewardPerAd + 5 : rewardPerAd;

    onEarn(finalReward, `Rewarded Video Ad #${nextWatched}${isMilestone ? ' (Streak Bonus +₹5)' : ''}`);
    triggerWinConfetti();
    showToast(
      isMilestone
        ? `🔥 3-AD STREAK BONUS! You earned +₹${finalReward} cash added to wallet!`
        : `🎉 Video Ad completed! +₹${finalReward} Cash added to wallet.`
    );
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl border border-slate-100 flex flex-col items-center text-center relative overflow-hidden"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            disabled={isPlaying}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-all cursor-pointer z-10"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header */}
          <div className="space-y-1 mb-2">
            <span className="text-[10px] font-black uppercase tracking-widest bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-emerald-600" />
              REWARDED VIDEO ADS NETWORK
            </span>
            <h3 className="text-xl font-black text-slate-900 font-outfit">Watch Ads & Earn Real Cash</h3>
            <div className="flex items-center justify-center gap-2 text-xs text-slate-500 font-medium">
              <span>Watched Today: <span className="font-extrabold text-emerald-600 font-mono">{adsWatched} / {totalDailyAds}</span></span>
              <span className="flex items-center gap-0.5 text-orange-600 font-bold bg-orange-50 px-1.5 py-0.5 rounded-md text-[10px]">
                <Flame className="w-3 h-3 fill-orange-500 text-orange-500" /> +₹{rewardPerAd}/Ad
              </span>
            </div>
          </div>

          {/* Ad Player Screen / Container */}
          <div className="w-full h-52 rounded-2xl bg-slate-950 text-white relative overflow-hidden shadow-inner flex flex-col items-center justify-between p-3.5 my-1.5 border border-slate-800">
            {/* Dynamic Sponsor Background Gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${currentSponsor.gradient} opacity-20`} />

            {isPlaying ? (
              // Active Playing Ad Animation
              <div className="w-full h-full flex flex-col justify-between items-center text-center relative z-10">
                <div className="w-full flex items-center justify-between text-slate-400 text-[10px] font-bold">
                  <div className="flex items-center gap-1 text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded-md border border-amber-500/30">
                    <Clock className="w-3 h-3 animate-spin" />
                    <span>Reward in {countdown}s</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setIsMuted(!isMuted)}
                      className="p-1 rounded bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
                    >
                      {isMuted ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                    </button>
                    <span className="text-[9px] uppercase bg-slate-800 px-1.5 py-0.5 rounded text-slate-300 font-black">
                      {currentSponsor.badge}
                    </span>
                  </div>
                </div>

                {/* Animated Simulated Video Graphic */}
                <div className="space-y-1.5 my-auto">
                  <motion.div
                    animate={{ scale: [1, 1.06, 1] }}
                    transition={{ repeat: Infinity, duration: 1.8 }}
                    className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 via-orange-500 to-[#4B63FF] p-0.5 mx-auto flex items-center justify-center shadow-lg"
                  >
                    <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center">
                      <Play className="w-5 h-5 text-amber-400 fill-amber-400 ml-0.5" />
                    </div>
                  </motion.div>
                  <div>
                    <div className="text-xs font-black text-white font-outfit">{currentSponsor.name}</div>
                    <div className="text-[10px] text-slate-300 max-w-[230px] mx-auto leading-tight">{currentSponsor.tagline}</div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <motion.div
                    className="bg-gradient-to-r from-amber-400 to-emerald-400 h-full"
                    initial={{ width: '0%' }}
                    animate={{ width: `${((6 - countdown) / 6) * 100}%` }}
                    transition={{ ease: 'linear' }}
                  />
                </div>
              </div>
            ) : isCompleted ? (
              // Completed state
              <div className="flex flex-col items-center justify-center space-y-2 relative z-10 my-auto">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div>
                  <div className="text-sm font-black text-white font-outfit">Video Ad Completed!</div>
                  <p className="text-[10px] text-slate-300">Reward is unlocked and ready to claim</p>
                </div>
              </div>
            ) : (
              // Idle Ready State
              <div className="flex flex-col items-center justify-center space-y-2 relative z-10 my-auto">
                <div className="w-12 h-12 rounded-2xl bg-white/10 text-white flex items-center justify-center border border-white/20 shadow-md">
                  <Play className="w-6 h-6 fill-white ml-0.5" />
                </div>
                <div>
                  <div className="text-sm font-black text-white font-outfit">Instant 6-Sec Sponsored Ad</div>
                  <div className="text-[10px] text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30 inline-block mt-1">
                    Guaranteed +₹{rewardPerAd} Direct Wallet Credit
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Verification Badge */}
          <div className="flex items-center gap-1 text-[10px] text-slate-400 font-medium my-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Official High-Payout Ad Network • Instant Payout</span>
          </div>

          {/* Action Button */}
          {isCompleted ? (
            <button
              id="btn-claim-video-ad"
              onClick={handleClaimReward}
              className="w-full mt-1.5 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-1.5 transition-all cursor-pointer animate-pulse"
            >
              <Trophy className="w-4 h-4 text-amber-300" />
              <span>
                Claim +₹{adsWatched + 1 === 3 ? rewardPerAd + 5 : rewardPerAd} Cash Bonus Now
              </span>
            </button>
          ) : (
            <button
              id="btn-start-video-ad"
              onClick={handleStartWatch}
              disabled={isPlaying || adsWatched >= totalDailyAds}
              className={`w-full mt-1.5 py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                isPlaying
                  ? 'bg-slate-200 text-slate-400 cursor-wait'
                  : adsWatched >= totalDailyAds
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-[#4B63FF] via-indigo-600 to-purple-600 hover:opacity-95 text-white shadow-lg shadow-[#4B63FF]/25'
              }`}
            >
              <Play className="w-4 h-4 fill-white" />
              <span>{adsWatched >= totalDailyAds ? 'Daily Limit Reached' : `Watch Video Ad (+₹${rewardPerAd} Cash)`}</span>
            </button>
          )}

          {/* In-Modal Sponsored Native Banner Ad */}
          <div className="w-full mt-2.5 p-2 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
            <div className="flex items-center gap-2 text-left">
              <span className="text-[8px] font-black uppercase bg-slate-200 text-slate-600 px-1 py-0.5 rounded">AD</span>
              <span className="text-[10px] font-bold text-slate-700">CoinDCX: Invest in Crypto with ₹100</span>
            </div>
            <span className="text-[10px] font-black text-indigo-600">Explore →</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
