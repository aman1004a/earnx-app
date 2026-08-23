import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Tag, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { triggerWinConfetti } from './confettiHelper';

interface CouponCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEarn: (amount: number, reason: string) => void;
  showToast: (msg: string) => void;
}

interface PromoCodeDef {
  code: string;
  reward: number;
  description: string;
  badge: string;
}

const AVAILABLE_CODES: PromoCodeDef[] = [
  { code: 'WELCOME50', reward: 50, description: 'New User Welcome Bonus Cash', badge: 'Special' },
  { code: 'EARNX25', reward: 25, description: 'Exclusive App Launch Reward', badge: 'Popular' },
  { code: 'LUCKY100', reward: 100, description: 'Mega Jackpot Promo Code', badge: 'Jackpot' },
  { code: 'BONUS15', reward: 15, description: 'Daily Community Extra Cash', badge: 'Daily' },
];

export const CouponCodeModal: React.FC<CouponCodeModalProps> = ({
  isOpen,
  onClose,
  onEarn,
  showToast
}) => {
  const [inputCode, setInputCode] = useState('');
  const [redeemedCodes, setRedeemedCodes] = useState<string[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successCode, setSuccessCode] = useState<{ code: string; reward: number } | null>(null);

  if (!isOpen) return null;

  const handleApply = (codeToApply?: string) => {
    const target = (codeToApply || inputCode).trim().toUpperCase();
    setErrorMsg(null);
    setSuccessCode(null);

    if (!target) {
      setErrorMsg('Please enter a coupon code');
      return;
    }

    if (redeemedCodes.includes(target)) {
      setErrorMsg(`Coupon code "${target}" has already been redeemed.`);
      return;
    }

    const match = AVAILABLE_CODES.find(c => c.code.toUpperCase() === target);
    if (!match) {
      setErrorMsg(`Invalid code "${target}". Try WELCOME50 or EARNX25.`);
      return;
    }

    // Success
    setRedeemedCodes(prev => [...prev, target]);
    setSuccessCode({ code: target, reward: match.reward });
    setInputCode('');
    onEarn(match.reward, `Coupon Code (${target})`);
    triggerWinConfetti();
    showToast(`🎉 Coupon applied! +₹${match.reward} Cash added to wallet.`);
  };

  const handleQuickApply = (code: string) => {
    setInputCode(code);
    handleApply(code);
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
            className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-all cursor-pointer z-10"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header */}
          <div className="space-y-1 mb-3">
            <span className="text-[10px] font-black uppercase tracking-widest bg-pink-100 text-pink-800 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
              <Tag className="w-3 h-3 text-pink-600" />
              PROMO & COUPON CODES
            </span>
            <h3 className="text-xl font-black text-slate-900 font-outfit">Redeem Coupon Code</h3>
            <p className="text-xs text-slate-500 font-medium">Enter promo code to claim instant cash bonus</p>
          </div>

          {/* Input Box */}
          <div className="w-full space-y-2 my-2">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="e.g. WELCOME50"
                  value={inputCode}
                  onChange={(e) => {
                    setInputCode(e.target.value.toUpperCase());
                    setErrorMsg(null);
                  }}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-extrabold uppercase tracking-wider text-slate-900 placeholder:text-slate-400 placeholder:normal-case focus:outline-none focus:border-[#4B63FF] focus:ring-2 focus:ring-[#4B63FF]/20"
                />
              </div>
              <button
                onClick={() => handleApply()}
                className="px-5 py-3 rounded-2xl bg-primary-gradient hover:opacity-95 text-white text-xs font-black uppercase tracking-wider shadow-md shadow-[#4B63FF]/25 cursor-pointer shrink-0"
              >
                Apply
              </button>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="flex items-center gap-1.5 text-xs text-rose-600 font-bold bg-rose-50 p-2 rounded-xl border border-rose-200">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span className="text-left text-[11px]">{errorMsg}</span>
              </div>
            )}

            {/* Success Box */}
            {successCode && (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex items-center gap-2 text-xs text-emerald-800 font-bold bg-emerald-50 p-2.5 rounded-xl border border-emerald-200 text-left"
              >
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <div className="font-extrabold text-xs">Code {successCode.code} Redeemed!</div>
                  <div className="text-[11px] text-emerald-700 font-medium">+₹{successCode.reward} Cash added to your wallet balance.</div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Available Hot Coupons List */}
          <div className="w-full mt-2 text-left space-y-2">
            <div className="flex items-center justify-between text-[11px] font-extrabold text-slate-600 px-1">
              <span>🔥 Available Active Coupons</span>
              <span className="text-slate-400 font-medium">Tap to apply</span>
            </div>

            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-0.5">
              {AVAILABLE_CODES.map((item) => {
                const isUsed = redeemedCodes.includes(item.code);
                return (
                  <div
                    key={item.code}
                    className={`p-2.5 rounded-2xl border flex items-center justify-between transition-all ${
                      isUsed
                        ? 'bg-slate-50 border-slate-200 opacity-60'
                        : 'bg-white border-slate-200/80 hover:border-[#4B63FF] shadow-xs'
                    }`}
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-black font-mono text-slate-900">{item.code}</span>
                        <span className="text-[9px] font-extrabold bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded-md">
                          +₹{item.reward}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400">{item.description}</p>
                    </div>

                    <button
                      onClick={() => handleQuickApply(item.code)}
                      disabled={isUsed}
                      className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider cursor-pointer flex items-center gap-1 ${
                        isUsed
                          ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                          : 'bg-[#4B63FF]/10 text-[#3549EC] hover:bg-[#4B63FF] hover:text-white transition-all'
                      }`}
                    >
                      {isUsed ? (
                        'Used'
                      ) : (
                        <>
                          <span>Apply</span>
                          <ArrowRight className="w-3 h-3" />
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
