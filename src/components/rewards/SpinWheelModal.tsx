import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, Trophy, RotateCw, CheckCircle2, Play } from 'lucide-react';
import { triggerWinConfetti } from './confettiHelper';
import { RewardedAdPlayer } from './RewardedAdPlayer';

interface SpinWheelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEarn: (amount: number, reason: string) => void;
  showToast: (msg: string) => void;
}

const SEGMENTS = [
  { label: '₹5', amount: 5, color: '#4B63FF', textColor: '#FFFFFF' },
  { label: '₹10', amount: 10, color: '#10B981', textColor: '#FFFFFF' },
  { label: '₹2', amount: 2, color: '#F59E0B', textColor: '#FFFFFF' },
  { label: '₹25', amount: 25, color: '#8B5CF6', textColor: '#FFFFFF' },
  { label: '₹1', amount: 1, color: '#06B6D4', textColor: '#FFFFFF' },
  { label: '₹15', amount: 15, color: '#EC4899', textColor: '#FFFFFF' },
  { label: '₹50', amount: 50, color: '#F97316', textColor: '#FFFFFF' },
  { label: '₹3', amount: 3, color: '#3B82F6', textColor: '#FFFFFF' },
];

export const SpinWheelModal: React.FC<SpinWheelModalProps> = ({
  isOpen,
  onClose,
  onEarn,
  showToast
}) => {
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinsLeft, setSpinsLeft] = useState(3);
  const [wonPrize, setWonPrize] = useState<number | null>(null);
  const [pendingPrize, setPendingPrize] = useState<number | null>(null);

  // Rewarded Ad state
  const [showAdForExtraSpin, setShowAdForExtraSpin] = useState(false);
  const [showAutoInterstitialAd, setShowAutoInterstitialAd] = useState(false);

  if (!isOpen) return null;

  const handleSpin = () => {
    if (isSpinning) return;
    if (spinsLeft <= 0) {
      showToast('⚠️ No spins left today! Watch a sponsored video ad to get +1 extra spin.');
      return;
    }

    setIsSpinning(true);
    setWonPrize(null);

    // Pick winning index with realistic probability
    const winningIndex = Math.floor(Math.random() * SEGMENTS.length);
    const segmentAngle = 360 / SEGMENTS.length;
    
    // To land on winningIndex, pointer is at top
    const targetOffset = 360 - (winningIndex * segmentAngle + segmentAngle / 2);
    const extraRounds = 5 * 360; // 5 full revolutions
    const newRotation = rotation + extraRounds + (targetOffset - (rotation % 360) + 360) % 360;

    setRotation(newRotation);

    setTimeout(() => {
      setIsSpinning(false);
      const prize = SEGMENTS[winningIndex].amount;
      setWonPrize(prize);
      setPendingPrize(prize);
      setSpinsLeft(prev => Math.max(0, prev - 1));

      // Open sponsor video ad automatically so user watches and claims the prize
      setTimeout(() => {
        setShowAutoInterstitialAd(true);
      }, 500);
    }, 4000);
  };

  const handleExtraSpinAdEarned = () => {
    setSpinsLeft(prev => prev + 1);
    showToast('🎬 Video Ad Verified! +1 Bonus Free Spin Unlocked!');
  };

  const handleAutoAdEarned = (amount?: number) => {
    const claimAmount = pendingPrize || amount || (wonPrize !== null ? wonPrize : 5);
    onEarn(claimAmount, 'Lucky Spin Wheel Prize');
    triggerWinConfetti();
    showToast(`🎉 JACKPOT! +₹${claimAmount} Cash added to wallet!`);
    setPendingPrize(null);
  };

  return (
    <>
      <AnimatePresence>
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl border border-slate-100 flex flex-col items-center text-center relative overflow-hidden"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              disabled={isSpinning}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-all cursor-pointer z-10"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header */}
            <div className="space-y-1 mb-2">
              <span className="text-[10px] font-black uppercase tracking-widest bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-600" />
                LUCKY WHEEL OF CASH
              </span>
              <h3 className="text-xl font-black text-slate-900 font-outfit">Spin & Win Real Money</h3>
              <p className="text-xs text-slate-500 font-medium">
                Free Spins Left: <span className="font-extrabold text-[#3549EC] font-mono">{spinsLeft}</span>
              </p>
            </div>

            {/* Wheel Graphic */}
            <div className="relative w-56 h-56 my-1 flex items-center justify-center">
              {/* Pointer Marker at the top */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 z-20 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[18px] border-t-red-600 drop-shadow-md" />
              
              {/* Spinning Circle */}
              <div
                className="w-52 h-52 rounded-full border-4 border-amber-400 shadow-xl overflow-hidden relative"
                style={{
                  transform: `rotate(${rotation}deg)`,
                  transition: isSpinning ? 'transform 4s cubic-bezier(0.15, 0.9, 0.2, 1)' : 'none',
                }}
              >
                <svg viewBox="0 0 200 200" className="w-full h-full">
                  {SEGMENTS.map((seg, idx) => {
                    const angle = 360 / SEGMENTS.length;
                    const startAngle = idx * angle;
                    const endAngle = startAngle + angle;
                    
                    // Convert polar to cartesian
                    const x1 = 100 + 100 * Math.cos((Math.PI * (startAngle - 90)) / 180);
                    const y1 = 100 + 100 * Math.sin((Math.PI * (startAngle - 90)) / 180);
                    const x2 = 100 + 100 * Math.cos((Math.PI * (endAngle - 90)) / 180);
                    const y2 = 100 + 100 * Math.sin((Math.PI * (endAngle - 90)) / 180);
                    
                    const pathData = `M 100 100 L ${x1} ${y1} A 100 100 0 0 1 ${x2} ${y2} Z`;
                    const textAngle = startAngle + angle / 2;
                    const textRad = (Math.PI * (textAngle - 90)) / 180;
                    const textX = 100 + 62 * Math.cos(textRad);
                    const textY = 100 + 62 * Math.sin(textRad);

                    return (
                      <g key={idx}>
                        <path d={pathData} fill={seg.color} stroke="#FFFFFF" strokeWidth="1.5" />
                        <text
                          x={textX}
                          y={textY}
                          fill={seg.textColor}
                          fontSize="13"
                          fontWeight="900"
                          fontFamily="sans-serif"
                          textAnchor="middle"
                          dominantBaseline="central"
                          transform={`rotate(${textAngle}, ${textX}, ${textY})`}
                        >
                          {seg.label}
                        </text>
                      </g>
                    );
                  })}
                </svg>
                {/* Inner Center Hub */}
                <div className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-white border-4 border-amber-400 shadow-md flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-amber-500" />
                </div>
              </div>
            </div>

            {/* Won Prize Notification */}
            {wonPrize !== null && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="my-1.5 p-2.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 w-full flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <div className="text-left text-xs font-bold">
                  You won <span className="text-emerald-700 font-extrabold text-sm">+₹{wonPrize}</span> cash added to wallet!
                </div>
              </motion.div>
            )}

            {/* Action Spin Button */}
            {spinsLeft > 0 ? (
              <button
                onClick={handleSpin}
                disabled={isSpinning}
                className={`w-full mt-1.5 py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  isSpinning
                    ? 'bg-slate-300 text-slate-600 cursor-wait'
                    : 'bg-gradient-to-r from-amber-500 via-orange-500 to-[#4B63FF] text-white shadow-lg shadow-orange-500/20 hover:opacity-95'
                }`}
              >
                <RotateCw className={`w-4 h-4 ${isSpinning ? 'animate-spin' : ''}`} />
                <span>
                  {isSpinning
                    ? 'Spinning Wheel...'
                    : `SPIN NOW (${spinsLeft} Free Left)`}
                </span>
              </button>
            ) : (
              /* Rewarded Ad to get more spins */
              <button
                id="btn-spin-get-extra-ad"
                onClick={() => setShowAdForExtraSpin(true)}
                className="w-full mt-1.5 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-[#3549EC] to-purple-600 hover:opacity-95 text-white text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 cursor-pointer transition-all"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Watch Short Ad (+1 Free Spin) 🎬</span>
              </button>
            )}

            {/* In-Modal Sponsored Native Banner Ad */}
            <div className="w-full mt-2.5 p-2 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
              <div className="flex items-center gap-2 text-left">
                <span className="text-[8px] font-black uppercase bg-slate-200 text-slate-600 px-1 py-0.5 rounded">AD</span>
                <span className="text-[10px] font-bold text-slate-700">WinZO Games: Win ₹10 Lakhs</span>
              </div>
              <span className="text-[10px] font-black text-indigo-600">Install & Play →</span>
            </div>
          </motion.div>
        </div>
      </AnimatePresence>

      {/* Rewarded Ad Player for +1 Extra Spin */}
      <RewardedAdPlayer
        isOpen={showAdForExtraSpin}
        onClose={() => setShowAdForExtraSpin(false)}
        onRewardEarned={handleExtraSpinAdEarned}
        adTitle="Lucky Spin Sponsor Ad"
        rewardText="+1 Free Spin"
        bonusAmount={1}
      />

      {/* Automatic Sponsor Video Ad on Spin Result */}
      <RewardedAdPlayer
        isOpen={showAutoInterstitialAd}
        onClose={() => {
          setShowAutoInterstitialAd(false);
          // If closed without claiming, claim fallback
          if (pendingPrize !== null) {
            handleAutoAdEarned(pendingPrize);
          }
        }}
        onRewardEarned={handleAutoAdEarned}
        adTitle="Lucky Spin Cash Video Ad"
        rewardText={`Spin Win: ₹${pendingPrize || wonPrize || 5}`}
        bonusAmount={pendingPrize || wonPrize || 5}
      />
    </>
  );
};
