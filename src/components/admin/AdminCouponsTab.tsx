import React, { useState } from 'react';
import { 
  Tag, 
  Plus, 
  Search, 
  Trash2, 
  CheckCircle2, 
  Users, 
  Sparkles,
  Copy,
  Clock
} from 'lucide-react';
import { CouponRecord } from '../../utils/adminStorage';
import { useAdminTheme } from './AdminThemeContext';

interface AdminCouponsTabProps {
  coupons: CouponRecord[];
  onUpdateCoupons: (coupons: CouponRecord[]) => void;
  showToast: (msg: string) => void;
}

export const AdminCouponsTab: React.FC<AdminCouponsTabProps> = ({
  coupons = [],
  onUpdateCoupons,
  showToast
}) => {
  const { isDark } = useAdminTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state
  const [code, setCode] = useState('');
  const [reward, setReward] = useState<number>(50);
  const [description, setDescription] = useState('');
  const [maxUses, setMaxUses] = useState<number>(500);

  const filtered = coupons.filter(c => 
    c.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || reward <= 0) return;

    const newCoupon: CouponRecord = {
      id: `coup-${Date.now().toString().slice(-4)}`,
      code: code.trim().toUpperCase(),
      rewardAmount: reward,
      minEarnedRequired: 0,
      maxUses,
      usedCount: 0,
      status: 'active',
      expiryDate: '2026-12-31',
      createdDate: '2026-08-21'
    };

    onUpdateCoupons([newCoupon, ...coupons]);
    showToast(`🎉 Coupon ${newCoupon.code} created successfully!`);
    setCode('');
    setDescription('');
    setIsModalOpen(false);
  };

  const handleDeleteCoupon = (idToDelete: string) => {
    onUpdateCoupons(coupons.filter(c => c.id !== idToDelete));
    showToast('🗑️ Coupon deleted.');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={`p-5 rounded-3xl border space-y-4 ${
        isDark ? 'bg-[#1E293B] border-slate-800' : 'bg-white border-slate-200/90'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className={`text-base font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Coupon Codes & Cash Vouchers
            </h3>
            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Issue promotional coupon codes for giveaways, social media campaigns & welcome rewards
            </p>
          </div>
          <button
            id="btn-open-create-coupon-modal"
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-pink-600 to-indigo-600 hover:opacity-95 text-white text-xs font-black shadow-md cursor-pointer transition-all self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Generate New Coupon</span>
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
          <input
            id="input-admin-search-coupons"
            type="text"
            placeholder="Search coupon codes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-10 pr-4 py-2.5 rounded-2xl text-xs font-medium border focus:outline-hidden transition-all ${
              isDark 
                ? 'bg-slate-900 border-slate-700 text-white placeholder-slate-500 focus:border-indigo-500' 
                : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-indigo-500'
            }`}
          />
        </div>
      </div>

      {/* Coupons List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((coupon) => (
          <div
            key={coupon.id}
            className={`p-5 rounded-3xl border transition-all flex flex-col justify-between space-y-3 ${
              isDark ? 'bg-[#1E293B] border-slate-800' : 'bg-white border-slate-200/90 shadow-xs'
            }`}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm font-black text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-xl border border-indigo-500/30">
                  {coupon.code}
                </span>
                <span className="text-base font-black text-emerald-500 font-mono">
                  + ₹ {coupon.rewardAmount}
                </span>
              </div>
              <p className={`text-xs font-medium line-clamp-2 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                Min Earned Required: ₹ {coupon.minEarnedRequired} • Valid till {coupon.expiryDate}
              </p>
            </div>

            <div className={`pt-3 border-t flex items-center justify-between text-xs ${
              isDark ? 'border-slate-800 text-slate-400' : 'border-slate-100 text-slate-500'
            }`}>
              <div className="text-[11px] font-bold">
                Used: <span className="text-indigo-400">{coupon.usedCount}</span> / {coupon.maxUses}
              </div>
              <button
                onClick={() => handleDeleteCoupon(coupon.id)}
                title="Delete Coupon"
                className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create Coupon Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className={`w-full max-w-md p-6 rounded-3xl border shadow-2xl space-y-4 ${
            isDark ? 'bg-[#1E293B] border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex items-center justify-between">
              <h3 className="font-black text-base">Generate Cash Promo Coupon</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3.5 text-left text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-400">Coupon Code</label>
                <input
                  id="input-create-coupon-code"
                  type="text"
                  required
                  placeholder="e.g. DIWALI100 or VIP50"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  className={`w-full px-3.5 py-2.5 rounded-2xl border font-mono font-black uppercase ${
                    isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-400">Reward Cash (₹)</label>
                  <input
                    id="input-create-coupon-reward"
                    type="number"
                    min="1"
                    required
                    value={reward}
                    onChange={(e) => setReward(Number(e.target.value))}
                    className={`w-full px-3.5 py-2.5 rounded-2xl border font-bold font-mono ${
                      isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-400">Max Redemptions</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={maxUses}
                    onChange={(e) => setMaxUses(Number(e.target.value))}
                    className={`w-full px-3.5 py-2.5 rounded-2xl border font-bold font-mono ${
                      isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  id="btn-submit-create-coupon"
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-pink-600 to-indigo-600 hover:opacity-95 text-white font-black text-xs uppercase tracking-wider shadow-lg cursor-pointer"
                >
                  Create & Activate Promo Code (+ ₹{reward} INR)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
