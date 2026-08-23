import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Wallet, 
  ShieldCheck, 
  Zap, 
  ArrowRight, 
  Gift, 
  CheckCircle2,
  Users,
  BadgePercent
} from 'lucide-react';

interface SplashScreenProps {
  onComplete?: () => void;
  autoProgress?: boolean;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ 
  onComplete, 
  autoProgress = true 
}) => {
  const [progress, setProgress] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const loadingSteps = [
    { title: "Securing Engine", desc: "Setting up 256-bit encryption & anti-fraud security" },
    { title: "Syncing Daily Rewards", desc: "Fetching daily bonus tasks & streak multipliers" },
    { title: "Connecting Gateways", desc: "UPI, Instant Bank & Recharge withdrawal systems ready" },
    { title: "Welcome to EarnX", desc: "Start earning real cash & rewards every day!" }
  ];

  useEffect(() => {
    if (!autoProgress) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          if (onComplete) {
            setTimeout(() => {
              onComplete();
            }, 600);
          }
          return 100;
        }
        const next = prev + 1.2;
        
        if (next >= 75) setCurrentStepIndex(3);
        else if (next >= 50) setCurrentStepIndex(2);
        else if (next >= 25) setCurrentStepIndex(1);
        else setCurrentStepIndex(0);

        return next > 100 ? 100 : next;
      });
    }, 35);

    return () => clearInterval(interval);
  }, [autoProgress, onComplete]);

  return (
    <div id="earn-splash-container" className="w-full h-full min-h-screen flex items-center justify-center p-3 sm:p-5 relative">
      {/* Background Soft Floating Spheres */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-400/15 rounded-full blur-3xl pointer-events-none" />

      {/* Floating 3D Glass Card Container */}
      <motion.div
        id="earn-splash-card"
        initial={{ opacity: 0, y: 15, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="w-full max-w-[440px] h-[calc(100vh-24px)] max-h-[850px] rounded-[36px] p-6 sm:p-8 glass-card shadow-[0_25px_60px_-15px_rgba(75,99,255,0.22)] text-slate-800 text-center relative overflow-hidden border border-white/80 flex flex-col justify-between"
      >
        {/* Soft Ambient Glows */}
        <div className="absolute -top-12 -right-12 w-52 h-52 bg-gradient-to-bl from-[#4B63FF]/20 to-transparent rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-52 h-52 bg-gradient-to-tr from-[#3549EC]/15 to-transparent rounded-full blur-2xl pointer-events-none" />

        {/* TOP SECTION: Emblem, Brand Title & Perks */}
        <div className="relative z-10 flex flex-col items-center my-auto">
          
          {/* Center Brand Emblem */}
          <div className="relative mb-5">
            <motion.div
              animate={{
                scale: [1, 1.12, 1],
                opacity: [0.35, 0.6, 0.35],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute -inset-3.5 rounded-3xl bg-gradient-to-tr from-[#4B63FF] to-cyan-400 blur-xl"
            />

            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-primary-gradient p-1 shadow-[0_20px_45px_rgba(75,99,255,0.35)] flex items-center justify-center"
            >
              <div className="w-full h-full rounded-[22px] bg-gradient-to-br from-[#4B63FF] via-[#3D56F5] to-[#3549EC] flex flex-col items-center justify-center p-2 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
                
                <motion.div
                  animate={{
                    rotate: [0, 5, -5, 0],
                    y: [0, -3, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="relative z-10"
                >
                  <Wallet className="w-12 h-12 sm:w-14 sm:h-14 text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)]" />
                </motion.div>

                {/* Floating Sparkle Pin */}
                <div className="absolute bottom-2 right-2 bg-amber-400 text-slate-900 rounded-full p-1 shadow-md">
                  <Sparkles className="w-3.5 h-3.5 fill-slate-900" />
                </div>
              </div>
            </motion.div>
          </div>

          {/* App Title & Tagline */}
          <div className="space-y-1 mb-4">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 font-outfit">
              Earn<span className="text-gradient">X</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium tracking-wide">
              Play Games • Complete Tasks • Instant Real Cash
            </p>
          </div>

          {/* Quick Perks Grid (5 Perks) */}
          <div className="grid grid-cols-2 gap-2 sm:gap-2.5 w-full">
            {/* 1. Instant UPI */}
            <div className="p-2.5 rounded-2xl bg-white/75 border border-slate-200/60 shadow-xs flex items-center gap-2 text-left">
              <div className="p-1.5 rounded-xl bg-amber-500/10 text-amber-500 shrink-0">
                <Zap className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <div className="text-[11px] font-bold text-slate-800 truncate">Instant UPI</div>
                <div className="text-[9.5px] text-slate-400 truncate">Direct wallet withdrawal</div>
              </div>
            </div>

            {/* 2. Daily Bonus */}
            <div className="p-2.5 rounded-2xl bg-white/75 border border-slate-200/60 shadow-xs flex items-center gap-2 text-left">
              <div className="p-1.5 rounded-xl bg-emerald-500/10 text-emerald-600 shrink-0">
                <Gift className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <div className="text-[11px] font-bold text-slate-800 truncate">Daily Bonus</div>
                <div className="text-[9.5px] text-slate-400 truncate">Up to ₹50 Cash</div>
              </div>
            </div>

            {/* 3. Spin & Win */}
            <div className="p-2.5 rounded-2xl bg-white/75 border border-slate-200/60 shadow-xs flex items-center gap-2 text-left">
              <div className="p-1.5 rounded-xl bg-purple-500/10 text-purple-600 shrink-0">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <div className="text-[11px] font-bold text-slate-800 truncate">Spin & Win</div>
                <div className="text-[9.5px] text-slate-400 truncate">Instant real cash</div>
              </div>
            </div>

            {/* 4. Zero Fee */}
            <div className="p-2.5 rounded-2xl bg-white/75 border border-slate-200/60 shadow-xs flex items-center gap-2 text-left">
              <div className="p-1.5 rounded-xl bg-blue-500/10 text-blue-600 shrink-0">
                <BadgePercent className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <div className="text-[11px] font-bold text-slate-800 truncate">0% Fees</div>
                <div className="text-[9.5px] text-slate-400 truncate">100% Free cashouts</div>
              </div>
            </div>

            {/* 5. Refer & Earn (Spans 2 columns) */}
            <div className="col-span-2 p-2.5 rounded-2xl bg-gradient-to-r from-rose-50/80 via-white/80 to-amber-50/80 border border-rose-200/60 shadow-xs flex items-center justify-between gap-2 text-left">
              <div className="flex items-center gap-2 min-w-0">
                <div className="p-1.5 rounded-xl bg-rose-500/10 text-rose-600 shrink-0">
                  <Users className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <div className="text-[11px] font-bold text-slate-800 truncate">Refer & Earn Big</div>
                  <div className="text-[9.5px] text-slate-400 truncate">Earn ₹50 cash per friend invite</div>
                </div>
              </div>
              <span className="text-[9px] font-black uppercase tracking-wider bg-rose-500 text-white px-2 py-0.5 rounded-full shrink-0">
                Hot
              </span>
            </div>
          </div>

        </div>

        {/* BOTTOM SECTION: Step Card, Progress Bar & CTA */}
        <div className="relative z-10 w-full space-y-3 pt-2">
          
          {/* Dynamic Status Pill */}
          <div className="min-h-[46px] p-2.5 rounded-2xl bg-white/80 border border-slate-200/60 shadow-xs flex items-center gap-3 text-left">
            <div className="w-7 h-7 rounded-xl bg-[#4B63FF]/10 text-[#4B63FF] flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4 text-[#3549EC]" />
            </div>
            <div className="overflow-hidden flex-1">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStepIndex}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-0.5"
                >
                  <div className="text-xs font-extrabold text-slate-800 truncate">
                    {loadingSteps[currentStepIndex].title}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">
                    {loadingSteps[currentStepIndex].desc}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Linear Progress Bar */}
          <div className="space-y-1.5">
            <div className="h-2 w-full bg-slate-200/70 rounded-full overflow-hidden p-0.5 shadow-inner">
              <motion.div
                className="h-full bg-primary-gradient rounded-full"
                style={{ width: `${progress}%` }}
                transition={{ ease: "linear" }}
              />
            </div>
            
            <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 px-1">
              <span>SYSTEM READINESS</span>
              <span className="text-[#3549EC] font-mono">{Math.round(progress)}%</span>
            </div>
          </div>

          {/* Action CTA Button */}
          <motion.button
            id="splash-get-started-btn"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              if (onComplete) {
                onComplete();
              }
            }}
            className="w-full py-3.5 rounded-2xl bg-primary-gradient hover:opacity-95 text-white font-bold text-xs sm:text-sm tracking-wider uppercase shadow-lg shadow-[#4B63FF]/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <span>GET STARTED</span>
            <ArrowRight className="w-4 h-4" />
          </motion.button>

          {/* Security Note */}
          <div className="flex items-center justify-center gap-1 text-[10px] sm:text-xs text-slate-400 font-medium pt-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>100% Secure & Verified Cash Withdrawals</span>
          </div>

        </div>
      </motion.div>
    </div>
  );
};
