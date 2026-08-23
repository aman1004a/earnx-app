import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Flame, 
  Sparkles, 
  Gamepad2, 
  CheckSquare, 
  Trophy, 
  ArrowUpRight 
} from 'lucide-react';
import { OfferwallPartner } from './offerwallData';
import { OfferwallModal } from './OfferwallModal';
import { getAdminOfferwalls } from '../../utils/adminStorage';

interface OfferwallSectionProps {
  onEarn: (amount: number, reason: string) => void;
  showToast: (msg: string) => void;
}

export const OfferwallSection: React.FC<OfferwallSectionProps> = ({
  onEarn,
  showToast
}) => {
  const [partners, setPartners] = useState<OfferwallPartner[]>(() => {
    return getAdminOfferwalls().filter(p => p.isActive !== false);
  });
  const [selectedPartner, setSelectedPartner] = useState<OfferwallPartner | null>(null);

  useEffect(() => {
    const handleStorageChange = () => {
      setPartners(getAdminOfferwalls().filter(p => p.isActive !== false));
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const getPartnerIcon = (id: string) => {
    switch (id) {
      case 'adgate': return <Flame className="w-4 h-4 text-blue-400" />;
      case 'ayet': return <Gamepad2 className="w-4 h-4 text-amber-400" />;
      case 'bitlabs': return <CheckSquare className="w-4 h-4 text-emerald-400" />;
      case 'torox': return <Trophy className="w-4 h-4 text-purple-400" />;
      default: return <Sparkles className="w-4 h-4 text-indigo-400" />;
    }
  };

  if (partners.length === 0) return null;

  return (
    <div className="space-y-2.5 pt-1">
      {/* Header */}
      <div className="flex items-center justify-between text-left px-1">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1">
            <span>🔥 Partner Offerwalls</span>
          </h4>
        </div>
        <span className="text-[10px] font-bold text-slate-400">
          {partners.length} Networks Active
        </span>
      </div>

      {/* Offerwalls Grid */}
      <div className="grid grid-cols-2 gap-2.5">
        {partners.map((partner) => {
          return (
            <motion.div
              key={partner.id}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedPartner(partner)}
              className="p-3 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-[#4B63FF]/60 hover:shadow-md transition-all cursor-pointer text-left space-y-2 relative overflow-hidden group"
            >
              {/* Top Row: Partner Initial / Icon & Multiplier */}
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black text-xs shadow-xs group-hover:bg-[#3549EC] transition-colors">
                  {getPartnerIcon(partner.id)}
                </div>
                <span className="text-[9px] font-black uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200/60 px-1.5 py-0.5 rounded-md">
                  {partner.multiplier}
                </span>
              </div>

              {/* Title & Tagline */}
              <div>
                <div className="flex items-center justify-between">
                  <h5 className="text-xs font-black text-slate-900 font-outfit group-hover:text-[#3549EC] transition-colors truncate">
                    {partner.name}
                  </h5>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-[#3549EC] transition-colors shrink-0" />
                </div>
                <p className="text-[10px] text-slate-400 font-medium line-clamp-1">
                  {partner.tagline}
                </p>
              </div>

              {/* Bottom Strip: Offers count & Top Reward */}
              <div className="pt-1 border-t border-slate-100 flex items-center justify-between text-[9px] font-bold">
                <span className="text-slate-500 font-medium">
                  {partner.totalOffers} Live Offers
                </span>
                <span className="text-emerald-700 font-black font-mono">
                  {partner.featuredReward}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Offerwall Partner Modal */}
      <OfferwallModal
        partner={selectedPartner}
        isOpen={Boolean(selectedPartner)}
        onClose={() => setSelectedPartner(null)}
        onEarn={onEarn}
        showToast={showToast}
      />
    </div>
  );
};
