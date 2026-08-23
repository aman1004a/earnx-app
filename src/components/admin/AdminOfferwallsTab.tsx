import React, { useState } from 'react';
import { 
  Flame, 
  Sparkles, 
  Gamepad2, 
  CheckSquare, 
  Trophy, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Power, 
  Key, 
  Radio, 
  ArrowUpRight, 
  ExternalLink, 
  Copy, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  DollarSign, 
  Sliders, 
  Layers, 
  Send,
  Zap,
  Globe,
  Settings2,
  RefreshCw,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { OfferwallPartner, OfferItem } from '../offerwall/offerwallData';
import { OfferwallConversion, AdminUserRecord } from '../../utils/adminStorage';
import { useAdminTheme } from './AdminThemeContext';

interface AdminOfferwallsTabProps {
  offerwalls: OfferwallPartner[];
  onUpdateOfferwalls: (offerwalls: OfferwallPartner[]) => void;
  conversions: OfferwallConversion[];
  onUpdateConversions: (conversions: OfferwallConversion[]) => void;
  users: Record<string, AdminUserRecord>;
  onUpdateUsers: (users: Record<string, AdminUserRecord>) => void;
  showToast: (msg: string) => void;
}

export const AdminOfferwallsTab: React.FC<AdminOfferwallsTabProps> = ({
  offerwalls = [],
  onUpdateOfferwalls,
  conversions = [],
  onUpdateConversions,
  users = {},
  onUpdateUsers,
  showToast
}) => {
  const { isDark } = useAdminTheme();
  const [activeSubTab, setActiveSubTab] = useState<'networks' | 'offers' | 'postbacks' | 'settings'>('networks');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPartnerId, setSelectedPartnerId] = useState<string>(offerwalls[0]?.id || 'adgate');

  // Modals
  const [isNetworkModalOpen, setIsNetworkModalOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState<OfferwallPartner | null>(null);
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<{ offer: OfferItem; partnerId: string } | null>(null);
  const [targetPartnerForNewOffer, setTargetPartnerForNewOffer] = useState<string>(offerwalls[0]?.id || 'adgate');

  // New Network Form State
  const [networkName, setNetworkName] = useState('');
  const [networkTagline, setNetworkTagline] = useState('');
  const [networkMultiplier, setNetworkMultiplier] = useState('2.0X Rewards');
  const [networkBadge, setNetworkBadge] = useState('  Hot');
  const [networkGradient, setNetworkGradient] = useState('from-blue-600 via-indigo-600 to-[#3549EC]');
  const [networkApiKey, setNetworkApiKey] = useState('');
  const [networkSecretKey, setNetworkSecretKey] = useState('');
  const [networkRevenueShare, setNetworkRevenueShare] = useState<number>(75);

  // New Offer Form State
  const [offerTitle, setOfferTitle] = useState('');
  const [offerReward, setOfferReward] = useState<number>(50);
  const [offerCategory, setOfferCategory] = useState<'Game' | 'App' | 'Survey' | 'Finance'>('App');
  const [offerPayoutTime, setOfferPayoutTime] = useState('Instant');
  const [offerDescription, setOfferDescription] = useState('');
  const [offerInstructionsText, setOfferInstructionsText] = useState('Download application\nComplete Level or KYC\nReward credited in 60s');

  // Postback Simulation Test State
  const userList: AdminUserRecord[] = Object.values(users || {});
  const [simUserPhone, setSimUserPhone] = useState(userList[0]?.phone || '9876543210');
  const [simPartnerId, setSimPartnerId] = useState(offerwalls[0]?.id || 'adgate');
  const [simRewardAmount, setSimRewardAmount] = useState<number>(100);

  // Stats
  const activeNetworksCount = offerwalls.filter(o => o.isActive !== false).length;
  const totalOffersCount = offerwalls.reduce((acc, p) => acc + (p.offers?.length || 0), 0);
  const totalUserPaidInr = conversions
    .filter(c => c.status === 'credited')
    .reduce((acc, c) => acc + (c.rewardAmount || c.payoutInr || 0), 0);
  const totalNetworkRevenueInr = conversions
    .filter(c => c.status === 'credited')
    .reduce((acc, c) => acc + (c.payoutAmount || c.payoutInr || 0), 0);

  const selectedPartner = offerwalls.find(p => p.id === selectedPartnerId) || offerwalls[0];

  // Handlers for Networks
  const handleToggleNetworkActive = (id: string, currentActive: boolean) => {
    const updated = offerwalls.map(p => 
      p.id === id ? { ...p, isActive: !currentActive } : p
    );
    onUpdateOfferwalls(updated);
    showToast(`Offerwall partner "${offerwalls.find(p => p.id === id)?.name}" ${!currentActive ? 'Enabled' : 'Disabled'}.`);
  };

  const handleOpenEditNetwork = (partner: OfferwallPartner) => {
    setEditingPartner(partner);
    setNetworkName(partner.name);
    setNetworkTagline(partner.tagline);
    setNetworkMultiplier(partner.multiplier);
    setNetworkBadge(partner.badge);
    setNetworkGradient(partner.gradient);
    setNetworkApiKey(partner.apiKey || '');
    setNetworkSecretKey(partner.secretKey || '');
    setNetworkRevenueShare(partner.userRevenuePercent || 75);
    setIsNetworkModalOpen(true);
  };

  const handleOpenCreateNetwork = () => {
    setEditingPartner(null);
    setNetworkName('');
    setNetworkTagline('High paying apps and instant reward tasks');
    setNetworkMultiplier('2.5X Rewards');
    setNetworkBadge('  Fast Pay');
    setNetworkGradient('from-purple-600 via-pink-600 to-indigo-600');
    setNetworkApiKey('api_key_' + Math.random().toString(36).substring(2, 8));
    setNetworkSecretKey('sec_' + Math.random().toString(36).substring(2, 10));
    setNetworkRevenueShare(75);
    setIsNetworkModalOpen(true);
  };

  const handleSaveNetworkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!networkName.trim()) return;

    if (editingPartner) {
      // Update existing
      const updated = offerwalls.map(p => {
        if (p.id === editingPartner.id) {
          return {
            ...p,
            name: networkName.trim(),
            tagline: networkTagline.trim(),
            multiplier: networkMultiplier.trim(),
            badge: networkBadge.trim(),
            gradient: networkGradient,
            apiKey: networkApiKey.trim(),
            secretKey: networkSecretKey.trim(),
            userRevenuePercent: Number(networkRevenueShare) || 75
          };
        }
        return p;
      });
      onUpdateOfferwalls(updated);
      showToast(`Updated Offerwall partner "${networkName}".`);
    } else {
      // Create new
      const newId = networkName.toLowerCase().replace(/[^a-z0-9]/g, '') + '_' + Date.now().toString().slice(-4);
      const newPartner: OfferwallPartner = {
        id: newId,
        name: networkName.trim(),
        tagline: networkTagline.trim(),
        multiplier: networkMultiplier.trim(),
        badge: networkBadge.trim(),
        gradient: networkGradient,
        iconColor: 'bg-indigo-500',
        totalOffers: 2,
        featuredReward: 'Up to  200',
        isActive: true,
        apiKey: networkApiKey.trim(),
        secretKey: networkSecretKey.trim(),
        postbackUrl: `https://earnx.app/api/postback/${newId}?user_id={sub1}&reward={amount}&tx_id={trans_id}`,
        userRevenuePercent: Number(networkRevenueShare) || 75,
        offers: [
          {
            id: `${newId}-1`,
            title: 'Sample High Reward Task',
            reward: 50,
            category: 'App',
            payoutTime: 'Instant',
            description: 'Sample offer initialized for this new network.',
            instructions: ['Click offer link', 'Complete action', 'Claim wallet cash'],
            active: true
          }
        ]
      };
      onUpdateOfferwalls([...offerwalls, newPartner]);
      showToast(`  New Offerwall network "${newPartner.name}" connected!`);
    }
    setIsNetworkModalOpen(false);
  };

  const handleDeleteNetwork = (id: string) => {
    if (offerwalls.length <= 1) {
      showToast('  At least one offerwall partner must remain active.');
      return;
    }
    const partner = offerwalls.find(p => p.id === id);
    const updated = offerwalls.filter(p => p.id !== id);
    onUpdateOfferwalls(updated);
    if (selectedPartnerId === id) {
      setSelectedPartnerId(updated[0]?.id || '');
    }
    showToast(`Removed offerwall partner "${partner?.name}".`);
  };

  // Handlers for Offers
  const handleOpenCreateOffer = (partnerId: string) => {
    setEditingOffer(null);
    setTargetPartnerForNewOffer(partnerId);
    setOfferTitle('');
    setOfferReward(45);
    setOfferCategory('App');
    setOfferPayoutTime('Instant');
    setOfferDescription('');
    setOfferInstructionsText('Download & install the app\nOpen and register mobile number\nClaim  45 instant cash');
    setIsOfferModalOpen(true);
  };

  const handleOpenEditOffer = (offer: OfferItem, partnerId: string) => {
    setEditingOffer({ offer, partnerId });
    setTargetPartnerForNewOffer(partnerId);
    setOfferTitle(offer.title);
    setOfferReward(offer.reward);
    setOfferCategory(offer.category);
    setOfferPayoutTime(offer.payoutTime);
    setOfferDescription(offer.description);
    setOfferInstructionsText(offer.instructions?.join('\n') || '');
    setIsOfferModalOpen(true);
  };

  const handleSaveOfferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!offerTitle.trim() || offerReward <= 0) return;

    const instructions = offerInstructionsText
      .split('\n')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    const updated = offerwalls.map(p => {
      if (p.id === targetPartnerForNewOffer) {
        let newOffers = [...(p.offers || [])];
        if (editingOffer) {
          newOffers = newOffers.map(o => 
            o.id === editingOffer.offer.id 
              ? {
                  ...o,
                  title: offerTitle.trim(),
                  reward: Number(offerReward),
                  category: offerCategory,
                  payoutTime: offerPayoutTime.trim(),
                  description: offerDescription.trim() || `Complete ${offerCategory} task to earn  ${offerReward}.`,
                  instructions: instructions.length > 0 ? instructions : ['Follow link', 'Complete goal']
                }
              : o
          );
        } else {
          const newOfferItem: OfferItem = {
            id: `off-${Date.now().toString().slice(-5)}`,
            title: offerTitle.trim(),
            reward: Number(offerReward),
            category: offerCategory,
            payoutTime: offerPayoutTime.trim(),
            description: offerDescription.trim() || `Complete ${offerCategory} task to earn  ${offerReward}.`,
            instructions: instructions.length > 0 ? instructions : ['Follow offer link', 'Complete task step'],
            active: true
          };
          newOffers = [newOfferItem, ...newOffers];
        }

        const maxReward = Math.max(...newOffers.map(o => o.reward), 0);
        return {
          ...p,
          offers: newOffers,
          totalOffers: newOffers.length,
          featuredReward: `Up to  ${maxReward}`
        };
      }
      return p;
    });

    onUpdateOfferwalls(updated);
    showToast(`Saved offer "${offerTitle}" in ${offerwalls.find(p => p.id === targetPartnerForNewOffer)?.name}.`);
    setIsOfferModalOpen(false);
  };

  const handleDeleteOffer = (partnerId: string, offerId: string) => {
    const updated = offerwalls.map(p => {
      if (p.id === partnerId) {
        const newOffers = (p.offers || []).filter(o => o.id !== offerId);
        const maxReward = newOffers.length > 0 ? Math.max(...newOffers.map(o => o.reward)) : 0;
        return {
          ...p,
          offers: newOffers,
          totalOffers: newOffers.length,
          featuredReward: `Up to  ${maxReward}`
        };
      }
      return p;
    });
    onUpdateOfferwalls(updated);
    showToast('Offer deleted from offerwall inventory.');
  };

  // Postback Simulation Webhook Trigger
  const handleSimulatePostback = (e: React.FormEvent) => {
    e.preventDefault();
    const safeUsers = users || {};
    const user = safeUsers[simUserPhone] || userList.find(u => u.phone === simUserPhone);
    const partner = offerwalls.find(p => p.id === simPartnerId) || offerwalls[0];

    if (!user) {
      showToast('  User not found. Select a valid registered phone number.');
      return;
    }

    const reward = Number(simRewardAmount) || 50;
    const grossPayout = Math.round(reward * 1.35); // simulated network payout (admin margin)

    // 1. Credit User Balance
    const userKey = Object.keys(safeUsers).find(k => k === user.phone || safeUsers[k]?.phone === user.phone) || user.phone;
    const updatedUser: AdminUserRecord = {
      ...user,
      walletBalance: (user.walletBalance || 0) + reward,
      totalEarned: (user.totalEarned || 0) + reward,
      tasksCompleted: (user.tasksCompleted || 0) + 1
    };

    onUpdateUsers({
      ...safeUsers,
      [userKey]: updatedUser
    });

    // 2. Add to Conversion Log
    const newConversion: OfferwallConversion = {
      id: `PB-${Date.now().toString().slice(-4)}`,
      partnerId: partner.id,
      partnerName: partner.name,
      offerId: `off-sim-${Math.floor(Math.random() * 899 + 100)}`,
      offerTitle: `${partner.name} Instant App Conversion`,
      userId: user.phone,
      userName: user.fullName,
      userPhone: user.phone,
      rewardAmount: reward,
      payoutAmount: grossPayout,
      status: 'credited',
      timestamp: 'Just now',
      txHash: `${partner.id.toUpperCase()}/PB/${Date.now().toString().slice(-7)}`
    };

    onUpdateConversions([newConversion, ...conversions]);
    showToast(`  Postback Webhook Executed! + ${reward} credited to ${user.fullName} (${user.phone}).`);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    showToast(`  Copied ${label} to clipboard!`);
  };

  return (
    <div className="space-y-6 text-left">
      {/* Top Metrics Banner */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className={`p-4 rounded-3xl border transition-all ${
          isDark ? 'bg-[#1E293B] border-slate-800' : 'bg-white border-slate-200/90 shadow-xs'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Active Networks</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {activeNetworksCount}
            </span>
            <span className="text-xs text-slate-400 font-bold">/ {offerwalls.length} Total</span>
          </div>
          <span className="text-[10px] text-emerald-500 font-bold mt-1 block">  Real-time synced with app</span>
        </div>

        <div className={`p-4 rounded-3xl border transition-all ${
          isDark ? 'bg-[#1E293B] border-slate-800' : 'bg-white border-slate-200/90 shadow-xs'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Live Offers</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {totalOffersCount}
            </span>
            <span className="text-xs text-slate-400 font-bold">Campaigns</span>
          </div>
          <span className="text-[10px] text-slate-400 font-medium mt-1 block">Games, Apps, Surveys, KYC</span>
        </div>

        <div className={`p-4 rounded-3xl border transition-all ${
          isDark ? 'bg-[#1E293B] border-slate-800' : 'bg-white border-slate-200/90 shadow-xs'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">User Payouts</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-black font-mono text-emerald-500">
              ₹  {totalUserPaidInr.toLocaleString('en-IN')}
            </span>
          </div>
          <span className="text-[10px] text-slate-400 font-medium mt-1 block">Directly credited to wallets</span>
        </div>

        <div className={`p-4 rounded-3xl border transition-all ${
          isDark ? 'bg-[#1E293B] border-slate-800' : 'bg-white border-slate-200/90 shadow-xs'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Gross Ad Revenue</span>
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-black font-mono text-purple-400">
              ₹  {totalNetworkRevenueInr.toLocaleString('en-IN')}
            </span>
          </div>
          <span className="text-[10px] text-emerald-500 font-bold mt-1 block">
            + ₹ {(totalNetworkRevenueInr - totalUserPaidInr).toLocaleString('en-IN')} Admin Net Profit
          </span>
        </div>
      </div>

      {/* Main Tab Controls & Actions */}
      <div className={`p-4 rounded-3xl border space-y-4 ${
        isDark ? 'bg-[#1E293B] border-slate-800' : 'bg-white border-slate-200/90'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className={`text-base font-black flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              <Flame className="w-5 h-5 text-rose-500" />
              <span>Offerwall & CPA Network Management</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Control AdGate, AyeT, BitLabs, Torox integrations, custom offers, and postback webhook payouts.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              id="btn-admin-create-offerwall-partner"
              onClick={handleOpenCreateNetwork}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-[#3549EC] hover:opacity-95 text-white text-xs font-black shadow-md cursor-pointer transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Connect New Partner</span>
            </button>
            <button
              onClick={() => handleOpenCreateOffer(selectedPartnerId)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black shadow-md cursor-pointer transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Custom Offer</span>
            </button>
          </div>
        </div>

        {/* Sub-Navigation Navigation Bar */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1">
          {[
            { id: 'networks', label: '1. Connected Networks', icon: Layers, count: offerwalls.length },
            { id: 'offers', label: '2. Offer Campaigns Inventory', icon: Sparkles, count: totalOffersCount },
            { id: 'postbacks', label: '3. Postback Webhooks & Tester', icon: Send, count: conversions.length },
            { id: 'settings', label: '4. Postback URL API Config', icon: Settings2 }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-black whitespace-nowrap transition-all cursor-pointer ${
                  isActive 
                    ? 'bg-gradient-to-r from-indigo-600 to-[#3549EC] text-white shadow-md' 
                    : isDark
                      ? 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                      : 'bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ----------------- SUBTAB 1: NETWORKS LIST ----------------- */}
      {activeSubTab === 'networks' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {offerwalls.map((partner) => {
            const isLive = partner.isActive !== false;
            return (
              <div
                key={partner.id}
                className={`p-5 rounded-3xl border transition-all flex flex-col justify-between space-y-4 relative overflow-hidden ${
                  isDark ? 'bg-[#1E293B] border-slate-800' : 'bg-white border-slate-200/90 shadow-xs'
                }`}
              >
                {/* Header Strip */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${partner.gradient} text-white flex items-center justify-center font-black text-lg shadow-md shrink-0`}>
                      {partner.name[0]}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className={`text-sm font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          {partner.name}
                        </h3>
                        <span className="text-[9px] font-black uppercase bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 px-2 py-0.5 rounded-md">
                          {partner.multiplier}
                        </span>
                      </div>
                      <p className={`text-xs mt-0.5 line-clamp-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        {partner.tagline}
                      </p>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md shrink-0 ${
                    isLive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                  }`}>
                    {isLive ? '  Live' : '  Paused'}
                  </span>
                </div>

                {/* Network Details & API Keys */}
                <div className={`p-3 rounded-2xl space-y-2 text-xs ${
                  isDark ? 'bg-slate-900/80 border border-slate-800' : 'bg-slate-50 border border-slate-200/80'
                }`}>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400 font-bold flex items-center gap-1">
                      <Key className="w-3 h-3 text-indigo-400" /> App/API Key:
                    </span>
                    <span className="font-mono text-slate-300 bg-black/20 px-2 py-0.5 rounded-md">
                      {partner.apiKey || 'Not configured'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400 font-bold flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-400" /> User RevShare:
                    </span>
                    <span className="font-mono font-bold text-emerald-400">
                      {partner.userRevenuePercent || 75}% to User / {100 - (partner.userRevenuePercent || 75)}% Admin
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-800/60">
                    <span className="text-slate-400 font-bold">Campaign Inventory:</span>
                    <span className="font-bold text-slate-300">
                      {partner.offers?.length || 0} Custom Offers ({partner.featuredReward})
                    </span>
                  </div>
                </div>

                {/* Bottom Action Controls */}
                <div className="flex items-center justify-between gap-2 pt-1">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleToggleNetworkActive(partner.id, isLive)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        isLive 
                          ? 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20' 
                          : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20'
                      }`}
                    >
                      {isLive ? 'Pause Network' : 'Activate Live'}
                    </button>
                    <button
                      onClick={() => {
                        setSelectedPartnerId(partner.id);
                        setActiveSubTab('offers');
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                        isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-200' : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                      }`}
                    >
                      Manage Offers ({partner.offers?.length || 0})
                    </button>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEditNetwork(partner)}
                      title="Edit Network Settings"
                      className={`p-2 rounded-xl border cursor-pointer transition-all ${
                        isDark ? 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300' : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
                      }`}
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteNetwork(partner.id)}
                      title="Remove Partner"
                      className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 cursor-pointer transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ----------------- SUBTAB 2: OFFERS INVENTORY ----------------- */}
      {activeSubTab === 'offers' && (
        <div className="space-y-4">
          {/* Partner Selector Pills */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            {offerwalls.map(p => (
              <button
                key={p.id}
                onClick={() => setSelectedPartnerId(p.id)}
                className={`px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap cursor-pointer transition-all flex items-center gap-1.5 ${
                  selectedPartnerId === p.id 
                    ? 'bg-[#3549EC] text-white shadow-md' 
                    : isDark ? 'bg-slate-800 text-slate-400 hover:text-white' : 'bg-white text-slate-600 border border-slate-200'
                }`}
              >
                <span>{p.name}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-black/20">
                  {p.offers?.length || 0}
                </span>
              </button>
            ))}
          </div>

          {/* Search and Add Offer */}
          <div className="flex items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={`Search offers in ${selectedPartner?.name || 'partner'}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 rounded-2xl text-xs border focus:outline-hidden ${
                  isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
                }`}
              />
            </div>
            <button
              onClick={() => handleOpenCreateOffer(selectedPartnerId)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black cursor-pointer shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Add Offer to {selectedPartner?.name}</span>
            </button>
          </div>

          {/* Offers List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {(selectedPartner?.offers || [])
              .filter(o => 
                o.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                o.category.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((offer) => (
                <div
                  key={offer.id}
                  className={`p-4 rounded-3xl border transition-all flex flex-col justify-between space-y-3 ${
                    isDark ? 'bg-[#1E293B] border-slate-800' : 'bg-white border-slate-200/90 shadow-xs'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${
                        offer.category === 'Game' ? 'bg-purple-500/20 text-purple-400' :
                        offer.category === 'Finance' ? 'bg-amber-500/20 text-amber-400' :
                        offer.category === 'Survey' ? 'bg-emerald-500/20 text-emerald-400' :
                        'bg-blue-500/20 text-blue-400'
                      }`}>
                        {offer.category}
                      </span>
                      <span className="text-sm font-black font-mono text-emerald-500">
                        + {offer.reward}
                      </span>
                    </div>

                    <h4 className={`text-xs font-black leading-snug ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {offer.title}
                    </h4>
                    <p className={`text-[11px] line-clamp-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      {offer.description}
                    </p>

                    <div className="flex items-center gap-1 text-[10px] text-slate-400">
                      <Clock className="w-3 h-3 text-slate-500" />
                      <span>{offer.payoutTime}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-2 border-t border-slate-800/70 flex items-center justify-between">
                    <span className="text-[10px] font-mono text-slate-500">{offer.id}</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenEditOffer(offer, selectedPartnerId)}
                        className={`p-1.5 rounded-lg border text-xs cursor-pointer ${
                          isDark ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteOffer(selectedPartnerId, offer.id)}
                        className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* ----------------- SUBTAB 3: POSTBACK TESTER & LOGS ----------------- */}
      {activeSubTab === 'postbacks' && (
        <div className="space-y-6">
          {/* Postback Webhook Simulator Card */}
          <div className={`p-5 rounded-3xl border space-y-4 ${
            isDark ? 'bg-[#1E293B] border-slate-800' : 'bg-white border-slate-200/90 shadow-xs'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Send className="w-5 h-5 text-indigo-400" />
                <h3 className={`text-sm font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Incoming Postback Webhook Simulation Tool
                </h3>
              </div>
              <span className="text-[10px] font-bold text-slate-400">
                Instantly credits user & tests postback parsing
              </span>
            </div>

            <form onSubmit={handleSimulatePostback} className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="text-[11px] font-bold text-slate-400 block mb-1">Target User</label>
                <select
                  value={simUserPhone}
                  onChange={(e) => setSimUserPhone(e.target.value)}
                  className={`w-full px-3 py-2 rounded-2xl border font-bold ${
                    isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                >
                  {userList.map((u) => (
                    <option key={u.phone} value={u.phone}>
                      {u.fullName} (+91 {u.phone})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-400 block mb-1">Offerwall Partner</label>
                <select
                  value={simPartnerId}
                  onChange={(e) => setSimPartnerId(e.target.value)}
                  className={`w-full px-3 py-2 rounded-2xl border font-bold ${
                    isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                >
                  {offerwalls.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-400 block mb-1">Reward Payout (₹)</label>
                <input
                  type="number"
                  min="5"
                  max="2000"
                  value={simRewardAmount}
                  onChange={(e) => setSimRewardAmount(Number(e.target.value))}
                  className={`w-full px-3 py-2 rounded-2xl border font-bold font-mono ${
                    isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                />
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-95 text-white font-black text-xs shadow-md cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Fire Postback Webhook</span>
                </button>
              </div>
            </form>
          </div>

          {/* Conversions Table */}
          <div className={`rounded-3xl border overflow-hidden ${
            isDark ? 'bg-[#1E293B] border-slate-800' : 'bg-white border-slate-200/90 shadow-xs'
          }`}>
            <div className={`p-4 border-b flex items-center justify-between ${
              isDark ? 'border-slate-800' : 'border-slate-200'
            }`}>
              <h4 className={`text-xs font-black uppercase tracking-wider ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                Live Postback Conversion History ({conversions.length})
              </h4>
              <span className="text-[11px] text-slate-400">Auto-recorded from all networks</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className={`text-[10px] font-black uppercase tracking-wider ${
                  isDark ? 'bg-slate-900/60 text-slate-400' : 'bg-slate-50 text-slate-500'
                }`}>
                  <tr>
                    <th className="p-3.5">Postback ID & Tx</th>
                    <th className="p-3.5">Network & Campaign</th>
                    <th className="p-3.5">User</th>
                    <th className="p-3.5">User Credit</th>
                    <th className="p-3.5">Network Payout</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/40">
                  {conversions.map((conv) => (
                    <tr key={conv.id} className={isDark ? 'hover:bg-slate-800/30' : 'hover:bg-slate-50'}>
                      <td className="p-3.5">
                        <span className="font-mono font-bold text-indigo-400 block">{conv.id}</span>
                        <span className="text-[10px] font-mono text-slate-500">{conv.txHash}</span>
                      </td>
                      <td className="p-3.5">
                        <span className={`font-black block ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          {conv.partnerName}
                        </span>
                        <span className="text-[11px] text-slate-400">{conv.offerTitle}</span>
                      </td>
                      <td className="p-3.5">
                        <span className="font-bold block text-slate-200">{conv.userName}</span>
                        <span className="text-[10px] font-mono text-slate-400">+91 {conv.userPhone}</span>
                      </td>
                      <td className="p-3.5 font-mono font-black text-emerald-500">
                        + {conv.rewardAmount}
                      </td>
                      <td className="p-3.5 font-mono font-bold text-slate-400">
                        ₹ {conv.payoutAmount}
                      </td>
                      <td className="p-3.5">
                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${
                          conv.status === 'credited' 
                            ? 'bg-emerald-500/20 text-emerald-400' 
                            : 'bg-amber-500/20 text-amber-400'
                        }`}>
                          {conv.status}
                        </span>
                      </td>
                      <td className="p-3.5 text-[11px] text-slate-400">
                        {conv.timestamp}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ----------------- SUBTAB 4: SETTINGS & POSTBACK URL CONFIG ----------------- */}
      {activeSubTab === 'settings' && (
        <div className="space-y-4">
          <div className={`p-5 rounded-3xl border space-y-4 ${
            isDark ? 'bg-[#1E293B] border-slate-800' : 'bg-white border-slate-200/90 shadow-xs'
          }`}>
            <h3 className={`text-sm font-black flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              <Globe className="w-4 h-4 text-indigo-400" />
              <span>Universal Postback URL & Integration Endpoints</span>
            </h3>
            <p className="text-xs text-slate-400">
              Provide these endpoints in your AdGate, AyeT, BitLabs, or Torox publisher dashboards to automatically receive server-to-server callbacks when users finish offers.
            </p>

            <div className="space-y-3 pt-2">
              {offerwalls.map(p => (
                <div key={p.id} className={`p-3 rounded-2xl border space-y-1.5 ${
                  isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-400">{p.name} Postback URL:</span>
                    <button
                      onClick={() => copyToClipboard(p.postbackUrl || `https://earnx.app/api/postback/${p.id}`, `${p.name} Postback URL`)}
                      className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white cursor-pointer"
                    >
                      <Copy className="w-3 h-3" />
                      <span>Copy URL</span>
                    </button>
                  </div>
                  <div className="p-2 rounded-xl bg-black/30 font-mono text-[11px] text-slate-300 break-all select-all">
                    {p.postbackUrl || `https://earnx.app/api/postback/${p.id}?user_id={sub1}&reward={amount}&tx_id={trans_id}&sig={signature}`}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ----------------- MODAL: CREATE / EDIT NETWORK ----------------- */}
      {isNetworkModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className={`w-full max-w-lg p-6 rounded-3xl border shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto ${
            isDark ? 'bg-[#1E293B] border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex items-center justify-between">
              <h3 className="font-black text-base">
                {editingPartner ? `Edit ${editingPartner.name} Configuration` : 'Connect New Offerwall Partner'}
              </h3>
              <button
                onClick={() => setIsNetworkModalOpen(false)}
                className="text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveNetworkSubmit} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-400">Partner / Network Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tapjoy Rewards, CPALead, Monlix"
                  value={networkName}
                  onChange={(e) => setNetworkName(e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-2xl border font-bold ${
                    isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-400">Tagline / Description</label>
                <input
                  type="text"
                  placeholder="e.g. High reward mobile games & verified app downloads"
                  value={networkTagline}
                  onChange={(e) => setNetworkTagline(e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-2xl border ${
                    isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-400">Multiplier Badge Label</label>
                  <input
                    type="text"
                    value={networkMultiplier}
                    onChange={(e) => setNetworkMultiplier(e.target.value)}
                    className={`w-full px-3 py-2 rounded-2xl border font-bold ${
                      isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-400">User Revenue Share (%)</label>
                  <input
                    type="number"
                    min="10"
                    max="95"
                    value={networkRevenueShare}
                    onChange={(e) => setNetworkRevenueShare(Number(e.target.value))}
                    className={`w-full px-3 py-2 rounded-2xl border font-bold font-mono ${
                      isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-400">Network API Key / App ID</label>
                <input
                  type="text"
                  value={networkApiKey}
                  onChange={(e) => setNetworkApiKey(e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-2xl border font-mono ${
                    isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-400">Secret Postback Verification Signature Key</label>
                <input
                  type="text"
                  value={networkSecretKey}
                  onChange={(e) => setNetworkSecretKey(e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-2xl border font-mono ${
                    isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-[#3549EC] hover:opacity-95 text-white font-black text-xs uppercase tracking-wider shadow-lg cursor-pointer"
                >
                  {editingPartner ? 'Save Network Settings' : 'Connect Offerwall Network'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ----------------- MODAL: CREATE / EDIT OFFER ----------------- */}
      {isOfferModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className={`w-full max-w-lg p-6 rounded-3xl border shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto ${
            isDark ? 'bg-[#1E293B] border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex items-center justify-between">
              <h3 className="font-black text-base">
                {editingOffer ? 'Edit Custom Offer' : `Add Offer to ${offerwalls.find(p => p.id === targetPartnerForNewOffer)?.name}`}
              </h3>
              <button
                onClick={() => setIsOfferModalOpen(false)}
                className="text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveOfferSubmit} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-400">Offer Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Candy Crush Soda: Complete 50 Levels"
                  value={offerTitle}
                  onChange={(e) => setOfferTitle(e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-2xl border font-bold ${
                    isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-400">Reward Cash (₹)</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={offerReward}
                    onChange={(e) => setOfferReward(Number(e.target.value))}
                    className={`w-full px-3 py-2 rounded-2xl border font-bold font-mono ${
                      isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-400">Category</label>
                  <select
                    value={offerCategory}
                    onChange={(e) => setOfferCategory(e.target.value as any)}
                    className={`w-full px-3 py-2 rounded-2xl border font-bold ${
                      isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  >
                    <option value="Game">Game</option>
                    <option value="App">App</option>
                    <option value="Survey">Survey</option>
                    <option value="Finance">Finance</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-400">Payout Time</label>
                  <input
                    type="text"
                    value={offerPayoutTime}
                    onChange={(e) => setOfferPayoutTime(e.target.value)}
                    className={`w-full px-3 py-2 rounded-2xl border font-bold ${
                      isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-400">Description</label>
                <textarea
                  rows={2}
                  placeholder="Task overview..."
                  value={offerDescription}
                  onChange={(e) => setOfferDescription(e.target.value)}
                  className={`w-full px-3.5 py-2 rounded-2xl border ${
                    isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-400">Step by step instructions (1 per line)</label>
                <textarea
                  rows={3}
                  value={offerInstructionsText}
                  onChange={(e) => setOfferInstructionsText(e.target.value)}
                  className={`w-full px-3.5 py-2 rounded-2xl border font-mono ${
                    isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-95 text-white font-black text-xs uppercase tracking-wider shadow-lg cursor-pointer"
                >
                  Save Offer to Campaign Inventory
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
