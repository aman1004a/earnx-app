import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Gamepad2, 
  Smartphone, 
  CheckSquare, 
  CreditCard, 
  Clock, 
  ShieldCheck, 
  ExternalLink,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { OfferwallPartner, OfferItem } from './offerwallData';
import { triggerWinConfetti } from '../rewards/confettiHelper';

interface OfferwallModalProps {
  partner: OfferwallPartner | null;
  isOpen: boolean;
  onClose: () => void;
  onEarn: (amount: number, reason: string) => void;
  showToast: (msg: string) => void;
}

export const OfferwallModal: React.FC<OfferwallModalProps> = ({
  partner,
  isOpen,
  onClose,
  onEarn,
  showToast
}) => {
  const [activeCategory, setActiveCategory] = useState<'All' | 'Game' | 'App' | 'Survey' | 'Finance'>('All');
  const [completingOfferId, setCompletingOfferId] = useState<string | null>(null);
  const [completedOfferIds, setCompletedOfferIds] = useState<string[]>([]);

  if (!isOpen || !partner) return null;

  const categories = ['All', 'Game', 'App', 'Survey', 'Finance'] as const;

  const filteredOffers = activeCategory === 'All'
    ? partner.offers
    : partner.offers.filter(o => o.category === activeCategory);

  const handleStartOffer = (offer: OfferItem) => {
    if (completedOfferIds.includes(offer.id)) {
      showToast('⚠️ This offer has already been completed!');
      return;
    }

    setCompletingOfferId(offer.id);
    showToast(`⏳ Opening ${offer.title} on ${partner.name}...`);

    setTimeout(() => {
      setCompletedOfferIds(prev => [...prev, offer.id]);
      setCompletingOfferId(null);
      onEarn(offer.reward, `${partner.name}: ${offer.title}`);
      triggerWinConfetti();
      showToast(`🎉 ₹${offer.reward} Credited from ${partner.name} Offerwall!`);
    }, 2500);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Game': return <Gamepad2 className="w-4 h-4 text-purple-500" />;
      case 'App': return <Smartphone className="w-4 h-4 text-blue-500" />;
      case 'Survey': return <CheckSquare className="w-4 h-4 text-emerald-500" />;
      case 'Finance': return <CreditCard className="w-4 h-4 text-amber-500" />;
      default: return <Sparkles className="w-4 h-4 text-indigo-500" />;
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 25 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 25 }}
          className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 flex flex-col max-h-[90vh] overflow-hidden relative"
        >
          {/* Offerwall Partner Header */}
          <div className={`p-4 bg-gradient-to-r ${partner.gradient} text-white relative overflow-hidden shrink-0`}>
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center font-black text-base border border-white/30">
                  {partner.name[0]}
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-sm font-black font-outfit">{partner.name}</h3>
                    <span className="text-[9px] font-black uppercase bg-white/25 px-1.5 py-0.5 rounded-md">
                      {partner.multiplier}
                    </span>
                  </div>
                  <p className="text-[11px] text-white/90 font-medium">{partner.tagline}</p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Offerwall Guarantee Strip */}
            <div className="mt-3 pt-2.5 border-t border-white/20 flex items-center justify-between text-[10px] font-extrabold text-white/90">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified High-Rate Rewards
              </span>
              <span className="bg-amber-400 text-slate-900 px-2 py-0.5 rounded-md font-black">
                {partner.featuredReward}
              </span>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="p-2.5 bg-slate-50 border-b border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-[#3549EC] text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200/70 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Offer Items List */}
          <div className="p-4 overflow-y-auto space-y-2.5 flex-1 text-left">
            {filteredOffers.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs">
                No offers found in this category.
              </div>
            ) : (
              filteredOffers.map((offer) => {
                const isCompleted = completedOfferIds.includes(offer.id);
                const isRunning = completingOfferId === offer.id;

                return (
                  <motion.div
                    key={offer.id}
                    whileHover={{ scale: 1.01 }}
                    className={`p-3.5 rounded-2xl border transition-all flex flex-col gap-2.5 ${
                      isCompleted
                        ? 'bg-emerald-50/50 border-emerald-200 opacity-75'
                        : 'bg-white border-slate-200/80 hover:border-[#4B63FF]/50 shadow-xs'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2.5">
                        <div className="p-2 rounded-xl bg-slate-100 shrink-0 mt-0.5">
                          {getCategoryIcon(offer.category)}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[9px] font-black uppercase tracking-wider text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded-md">
                              {offer.category}
                            </span>
                            <span className="text-[10px] text-slate-400 flex items-center gap-0.5 font-medium">
                              <Clock className="w-3 h-3" />
                              {offer.payoutTime}
                            </span>
                          </div>
                          <h4 className="text-xs font-extrabold text-slate-900 mt-1 leading-snug">
                            {offer.title}
                          </h4>
                        </div>
                      </div>

                      {/* Reward Badge */}
                      <div className="text-right shrink-0">
                        <div className="text-sm font-black font-outfit text-emerald-600 font-mono">
                          + ₹{offer.reward}
                        </div>
                        <span className="text-[9px] font-bold text-slate-400">Cash</span>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-500 leading-relaxed font-medium bg-slate-50 p-2 rounded-xl border border-slate-100">
                      {offer.description}
                    </p>

                    {/* Action Button */}
                    <div className="flex items-center justify-between pt-1">
                      <div className="text-[10px] text-slate-400 font-medium">
                        Instant tracking enabled
                      </div>
                      {isCompleted ? (
                        <span className="text-xs font-extrabold text-emerald-700 bg-emerald-100 px-3 py-1.5 rounded-xl flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Claimed + ₹{offer.reward}</span>
                        </span>
                      ) : (
                        <button
                          onClick={() => handleStartOffer(offer)}
                          disabled={isRunning}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
                            isRunning
                              ? 'bg-slate-200 text-slate-500 cursor-wait'
                              : 'bg-primary-gradient text-white shadow-xs hover:opacity-95'
                          }`}
                        >
                          {isRunning ? (
                            <span>Verifying...</span>
                          ) : (
                            <>
                              <span>Start Offer</span>
                              <ExternalLink className="w-3 h-3" />
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>

          {/* Footer Note */}
          <div className="p-3 bg-slate-50 border-t border-slate-100 text-center text-[10px] text-slate-400 font-medium shrink-0 flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Official partner network. Rewards transferred directly into INR wallet.</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
