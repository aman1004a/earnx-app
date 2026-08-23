import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, Trophy, CheckCircle2, RotateCw, Lock, Play } from 'lucide-react';
import { triggerWinConfetti } from './confettiHelper';
import { RewardedAdPlayer } from './RewardedAdPlayer';

interface ScratchCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEarn: (amount: number, reason: string) => void;
  showToast: (msg: string) => void;
}

interface CardItem {
  id: string;
  name: string;
  prize: number;
  unlocked: boolean;
  claimed: boolean;
  gradient: string;
  isAdLocked?: boolean;
}

export const ScratchCardModal: React.FC<ScratchCardModalProps> = ({
  isOpen,
  onClose,
  onEarn,
  showToast
}) => {
  const [cards, setCards] = useState<CardItem[]>([
    { id: 'c1', name: 'Silver Daily Card', prize: 12, unlocked: true, claimed: false, gradient: 'from-slate-700 to-slate-900' },
    { id: 'c2', name: 'Golden Jackpot Card', prize: 25, unlocked: true, claimed: false, gradient: 'from-amber-500 to-yellow-600' },
    { id: 'c3', name: 'Diamond VIP Card', prize: 35, unlocked: true, claimed: false, gradient: 'from-indigo-600 to-purple-800' },
    { id: 'c4', name: 'Mega Mystery Card', prize: 60, unlocked: false, claimed: false, gradient: 'from-emerald-600 to-teal-800', isAdLocked: true }
  ]);
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [scratchPercent, setScratchPercent] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawingRef = useRef(false);

  // Rewarded Ad state
  const [showAdForUnlockCard, setShowAdForUnlockCard] = useState(false);
  const [showAutoScratchAd, setShowAutoScratchAd] = useState(false);
  const [pendingScratchPrize, setPendingScratchPrize] = useState<number | null>(null);

  const currentCard = cards[activeCardIndex];

  // Initialize Canvas Foil
  const initCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    canvas.width = canvas.offsetWidth || 280;
    canvas.height = canvas.offsetHeight || 160;

    // Draw shimmering foil background
    const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    grad.addColorStop(0, '#C0C0C8');
    grad.addColorStop(0.5, '#E4E4E8');
    grad.addColorStop(1, '#A0A0A8');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Text on foil
    ctx.fillStyle = '#475569';
    ctx.font = 'bold 14px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('✨ RUB TO SCRATCH & WIN ✨', canvas.width / 2, canvas.height / 2 - 5);
    ctx.font = '11px sans-serif';
    ctx.fillStyle = '#64748B';
    ctx.fillText('Scratch with finger or mouse', canvas.width / 2, canvas.height / 2 + 18);

    setScratchPercent(0);
    setIsRevealed(false);
  };

  useEffect(() => {
    if (isOpen && currentCard.unlocked && !currentCard.claimed) {
      setTimeout(initCanvas, 100);
    }
  }, [isOpen, activeCardIndex, currentCard.unlocked]);

  const scratch = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas || isRevealed || currentCard.claimed || !currentCard.unlocked) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 18, 0, Math.PI * 2, false);
    ctx.fill();

    // Check scratch percent periodically
    calculatePercent(ctx, canvas);
  };

  const calculatePercent = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    try {
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imgData.data;
      let transparentPixels = 0;

      // Sample every 16th pixel for high performance
      for (let i = 3; i < pixels.length; i += 16) {
        if (pixels[i] === 0) {
          transparentPixels++;
        }
      }

      const totalSampled = pixels.length / 16;
      const pct = Math.round((transparentPixels / totalSampled) * 100);
      setScratchPercent(pct);

      if (pct > 40 && !isRevealed) {
        // Auto complete reveal
        setIsRevealed(true);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Mark card claimed locally & prepare reward
        setCards(prev => prev.map((c, idx) => idx === activeCardIndex ? { ...c, claimed: true } : c));
        setPendingScratchPrize(currentCard.prize);

        // Trigger automatic sponsor ad after result
        setTimeout(() => {
          setShowAutoScratchAd(true);
        }, 500);
      }
    } catch {
      // Ignore
    }
  };

  // Mouse & Touch events
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    isDrawingRef.current = true;
    scratch(e.clientX, e.clientY);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    scratch(e.clientX, e.clientY);
  };

  const handleMouseUp = () => {
    isDrawingRef.current = false;
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    isDrawingRef.current = true;
    if (e.touches[0]) {
      scratch(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    if (e.touches[0]) {
      scratch(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  const handleInstantReveal = () => {
    if (currentCard.claimed || isRevealed || !currentCard.unlocked) return;
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
    }
    setIsRevealed(true);
    setCards(prev => prev.map((c, idx) => idx === activeCardIndex ? { ...c, claimed: true } : c));
    setPendingScratchPrize(currentCard.prize);

    // Trigger automatic sponsor ad after instant reveal
    setTimeout(() => {
      setShowAutoScratchAd(true);
    }, 500);
  };

  const handleUnlockCardAdEarned = () => {
    setCards(prev => prev.map((c, idx) => idx === activeCardIndex ? { ...c, unlocked: true } : c));
    showToast('🎬 Video Ad Verified! Mega Mystery Scratch Card Unlocked!');
  };

  const handleAutoAdEarned = (amount?: number) => {
    const claimAmount = pendingScratchPrize || amount || currentCard.prize;
    onEarn(claimAmount, `${currentCard.name} Prize`);
    triggerWinConfetti();
    showToast(`🎉 Claimed +₹${claimAmount} Cash from ${currentCard.name}!`);
    setPendingScratchPrize(null);
  };

  if (!isOpen) return null;

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
              className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-all cursor-pointer z-10"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header */}
            <div className="space-y-1 mb-2">
              <span className="text-[10px] font-black uppercase tracking-widest bg-purple-100 text-purple-800 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-purple-600" />
                LUCKY SCRATCH & WIN
              </span>
              <h3 className="text-xl font-black text-slate-900 font-outfit">Scratch to Win Instant Cash</h3>
              <p className="text-xs text-slate-500 font-medium">Rub foil with finger or mouse to reveal prize</p>
            </div>

            {/* Card Selector Pills */}
            <div className="flex items-center gap-1 mb-2.5 w-full justify-center overflow-x-auto py-0.5">
              {cards.map((card, idx) => (
                <button
                  key={card.id}
                  onClick={() => setActiveCardIndex(idx)}
                  className={`px-2.5 py-1 rounded-xl text-[10px] font-extrabold transition-all cursor-pointer flex items-center gap-1 whitespace-nowrap ${
                    activeCardIndex === idx
                      ? 'bg-[#3549EC] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {card.claimed ? (
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  ) : !card.unlocked ? (
                    <Lock className="w-3 h-3 text-amber-500" />
                  ) : null}
                  <span>Card {idx + 1}</span>
                </button>
              ))}
            </div>

            {/* Scratch Card Area */}
            <div className="relative w-full h-44 rounded-2xl overflow-hidden shadow-md border-2 border-amber-300 flex items-center justify-center">
              {/* Underneath: The Prize */}
              <div className={`absolute inset-0 bg-gradient-to-br ${currentCard.gradient} text-white flex flex-col items-center justify-center p-4 space-y-1`}>
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mb-1">
                  <Trophy className="w-6 h-6 text-amber-300" />
                </div>
                <span className="text-[11px] font-bold text-amber-200 uppercase tracking-wider">{currentCard.name}</span>
                <div className="text-3xl font-black font-outfit text-amber-300 font-mono">
                  + ₹{currentCard.prize} <span className="text-sm text-white">CASH</span>
                </div>
                <span className="text-[10px] text-emerald-200 font-extrabold bg-emerald-900/60 px-2 py-0.5 rounded-full">
                  {currentCard.claimed || isRevealed ? '✅ Claimed to Wallet' : 'Ready to claim'}
                </span>
              </div>

              {/* Locked with Video Ad view */}
              {!currentCard.unlocked ? (
                <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-xs flex flex-col items-center justify-center p-4 text-white space-y-2 z-20">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="text-xs font-black font-outfit">Mega Mystery Card Locked</h5>
                    <p className="text-[10px] text-slate-300">Watch a sponsored video ad to unlock this +₹{currentCard.prize} card</p>
                  </div>
                  <button
                    id="btn-scratch-unlock-ad"
                    onClick={() => setShowAdForUnlockCard(true)}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-md cursor-pointer animate-pulse"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Watch Short Video Ad (Unlock)</span>
                  </button>
                </div>
              ) : (
                /* Canvas Overlay for Scratching */
                !currentCard.claimed && (
                  <canvas
                    ref={canvasRef}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleMouseUp}
                    className="absolute inset-0 w-full h-full cursor-crosshair touch-none z-10"
                  />
                )
              )}
            </div>

            {/* Progress / Status */}
            {currentCard.unlocked && (
              <div className="w-full mt-2 flex items-center justify-between text-xs text-slate-500 font-bold px-1">
                <span>
                  {currentCard.claimed
                    ? 'Card Claimed'
                    : `Scratched: ${scratchPercent}%`}
                </span>
                {!currentCard.claimed && (
                  <button
                    onClick={handleInstantReveal}
                    className="text-[#3549EC] hover:underline font-extrabold cursor-pointer text-xs"
                  >
                    Instant Reveal ⚡
                  </button>
                )}
              </div>
            )}

            {/* Bottom Switch button */}
            <div className="w-full mt-2 space-y-1.5">
              <button
                onClick={() => {
                  const next = (activeCardIndex + 1) % cards.length;
                  setActiveCardIndex(next);
                }}
                className="w-full py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>Next Scratch Card ({activeCardIndex + 1}/{cards.length})</span>
              </button>
            </div>

            {/* In-Modal Sponsored Native Banner Ad */}
            <div className="w-full mt-2 p-2 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
              <div className="flex items-center gap-2 text-left">
                <span className="text-[8px] font-black uppercase bg-slate-200 text-slate-600 px-1 py-0.5 rounded">AD</span>
                <span className="text-[10px] font-bold text-slate-700">Dream11: Create Team & Win ₹1 Cr</span>
              </div>
              <span className="text-[10px] font-black text-indigo-600">Play Now →</span>
            </div>
          </motion.div>
        </div>
      </AnimatePresence>

      {/* Rewarded Ad Player for Unlocking Mystery Card */}
      <RewardedAdPlayer
        isOpen={showAdForUnlockCard}
        onClose={() => setShowAdForUnlockCard(false)}
        onRewardEarned={handleUnlockCardAdEarned}
        adTitle="Scratch Card Unlock Ad"
        rewardText="Mystery Card Unlock"
        bonusAmount={currentCard.prize}
      />

      {/* Automatic Sponsor Video Ad on Scratch Result */}
      <RewardedAdPlayer
        isOpen={showAutoScratchAd}
        onClose={() => {
          setShowAutoScratchAd(false);
          if (pendingScratchPrize !== null) {
            handleAutoAdEarned(pendingScratchPrize);
          }
        }}
        onRewardEarned={handleAutoAdEarned}
        adTitle="Scratch Card Cash Video Ad"
        rewardText={`${currentCard.name} +₹${pendingScratchPrize || currentCard.prize}`}
        bonusAmount={pendingScratchPrize || currentCard.prize}
      />
    </>
  );
};
