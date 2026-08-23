import React, { useState } from 'react';
import {
  Tv,
  Play,
  ToggleLeft,
  ToggleRight,
  Plus,
  Trash2,
  CheckCircle2,
  DollarSign,
  BarChart3,
  Sparkles,
  Save
} from 'lucide-react';
import { useAdminTheme } from './AdminThemeContext';

export interface AdCampaign {
  id: string;
  title: string;
  subtitle: string;
  sponsorName: string;
  type: 'rewarded_video' | 'interstitial' | 'native_banner';
  placement: 'spin_wheel' | 'scratch_card' | 'daily_checkin' | 'watch_ads' | 'home_bottom' | 'withdraw_bottom';
  payoutPerImpression: number;
  rewardAmount: number;
  durationSec: number;
  status: 'active' | 'paused';
  impressions: number;
  clicks: number;
  revenueGenerated: number;
}

export const AdsManagementTab: React.FC = () => {
  const { isDark } = useAdminTheme();

  // Global triggers
  const [spinAdEnabled, setSpinAdEnabled] = useState(true);
  const [scratchAdEnabled, setScratchAdEnabled] = useState(true);
  const [checkinAdEnabled, setCheckinAdEnabled] = useState(true);
  const [bannerAdsEnabled, setBannerAdsEnabled] = useState(true);
  const [minAdDuration, setMinAdDuration] = useState(6);
  const [dailyAdLimit, setDailyAdLimit] = useState(15);

  // Active Ad Inventory
  const [campaigns, setCampaigns] = useState<AdCampaign[]>([
    {
      id: 'ad_1',
      title: 'WinZO Super Games - Real Cash',
      subtitle: 'Play 100+ Games & Win Real Cash Daily with Instant UPI',
      sponsorName: 'WinZO Games Inc',
      type: 'rewarded_video',
      placement: 'spin_wheel',
      payoutPerImpression: 0.75,
      rewardAmount: 5,
      durationSec: 6,
      status: 'active',
      impressions: 4820,
      clicks: 1140,
      revenueGenerated: 3615
    },
    {
      id: 'ad_2',
      title: 'Dream11 Mega Cricket League',
      subtitle: 'Make your dream cricket team & compete for ₹1 Crore mega contest',
      sponsorName: 'Dream Sports Ltd',
      type: 'rewarded_video',
      placement: 'scratch_card',
      payoutPerImpression: 0.90,
      rewardAmount: 8,
      durationSec: 6,
      status: 'active',
      impressions: 3950,
      clicks: 890,
      revenueGenerated: 3555
    },
    {
      id: 'ad_3',
      title: 'CoinDCX Crypto App',
      subtitle: 'Start investing in Bitcoin & Crypto with ₹100. Safe & FIU Compliant',
      sponsorName: 'CoinDCX India',
      type: 'rewarded_video',
      placement: 'daily_checkin',
      payoutPerImpression: 1.10,
      rewardAmount: 5,
      durationSec: 6,
      status: 'active',
      impressions: 5120,
      clicks: 1420,
      revenueGenerated: 5632
    },
    {
      id: 'ad_4',
      title: 'Flipkart Grand Mega Sale',
      subtitle: 'Up to 80% Off on Top Electronics, Smart TVs & Fashion',
      sponsorName: 'Flipkart Internet Pvt',
      type: 'native_banner',
      placement: 'home_bottom',
      payoutPerImpression: 0.35,
      rewardAmount: 0,
      durationSec: 0,
      status: 'active',
      impressions: 12400,
      clicks: 2180,
      revenueGenerated: 4340
    }
  ]);

  const [savedSuccess, setSavedSuccess] = useState(false);

  // Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSubtitle, setNewSubtitle] = useState('');
  const [newSponsor, setNewSponsor] = useState('');
  const [newPlacement, setNewPlacement] = useState<AdCampaign['placement']>('spin_wheel');
  const [newReward, setNewReward] = useState(5);
  const [newPayout, setNewPayout] = useState(0.8);
  const [newDuration, setNewDuration] = useState(6);

  const toggleCampaignStatus = (id: string) => {
    setCampaigns(prev =>
      prev.map(c => (c.id === id ? { ...c, status: c.status === 'active' ? 'paused' : 'active' } : c))
    );
  };

  const deleteCampaign = (id: string) => {
    setCampaigns(prev => prev.filter(c => c.id !== id));
  };

  const handleCreateCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newAd: AdCampaign = {
      id: `ad_${Date.now()}`,
      title: newTitle,
      subtitle: newSubtitle || 'Sponsored Advertisement Campaign',
      sponsorName: newSponsor || 'Direct Partner',
      type: newPlacement.includes('bottom') ? 'native_banner' : 'rewarded_video',
      placement: newPlacement,
      payoutPerImpression: Number(newPayout) || 0.5,
      rewardAmount: Number(newReward) || 0,
      durationSec: Number(newDuration) || 6,
      status: 'active',
      impressions: 0,
      clicks: 0,
      revenueGenerated: 0
    };

    setCampaigns(prev => [newAd, ...prev]);
    setShowAddModal(false);
    setNewTitle('');
    setNewSubtitle('');
    setNewSponsor('');
  };

  const handleSaveSettings = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  // Metrics
  const totalImpressions = campaigns.reduce((sum, c) => sum + c.impressions, 0);
  const totalClicks = campaigns.reduce((sum, c) => sum + c.clicks, 0);
  const totalAdRevenue = campaigns.reduce((sum, c) => sum + c.revenueGenerated, 0);
  const avgCTR = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(1) : '0';

  return (
    <div className="space-y-6">
      {/* Top Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className={`p-5 rounded-3xl border ${isDark ? 'bg-[#1E293B] border-slate-800' : 'bg-white border-slate-200'} shadow-sm`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Ad Revenue</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black font-mono text-emerald-600 mt-2">₹{totalAdRevenue.toLocaleString()}</p>
          <span className="text-[10px] text-slate-400 font-medium">+18.4% this week</span>
        </div>

        <div className={`p-5 rounded-3xl border ${isDark ? 'bg-[#1E293B] border-slate-800' : 'bg-white border-slate-200'} shadow-sm`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Impressions</span>
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
              <Tv className="w-4 h-4" />
            </div>
          </div>
          <p className={`text-2xl font-black font-mono mt-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>{totalImpressions.toLocaleString()}</p>
          <span className="text-[10px] text-blue-500 font-medium">99.2% Fill Rate</span>
        </div>

        <div className={`p-5 rounded-3xl border ${isDark ? 'bg-[#1E293B] border-slate-800' : 'bg-white border-slate-200'} shadow-sm`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Ad Clicks</span>
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center">
              <BarChart3 className="w-4 h-4" />
            </div>
          </div>
          <p className={`text-2xl font-black font-mono mt-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>{totalClicks.toLocaleString()}</p>
          <span className="text-[10px] text-purple-500 font-medium">{avgCTR}% Average CTR</span>
        </div>

        <div className={`p-5 rounded-3xl border ${isDark ? 'bg-[#1E293B] border-slate-800' : 'bg-white border-slate-200'} shadow-sm`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Ad Units</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black font-mono text-amber-600 mt-2">{campaigns.filter(c => c.status === 'active').length} / {campaigns.length}</p>
          <span className="text-[10px] text-amber-500 font-medium">All Placements Live</span>
        </div>
      </div>

      {/* Ad Trigger Switches & Rules Config */}
      <div className={`p-6 rounded-3xl border ${isDark ? 'bg-[#1E293B] border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-5`}>
        <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4 ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
          <div>
            <h3 className={`text-base font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>Video Ads Control & Trigger Rules</h3>
            <p className="text-xs text-slate-400">Configure auto-play video ads across Spin Wheel, Scratch Card & Check-In</p>
          </div>
          <button
            onClick={handleSaveSettings}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black flex items-center gap-1.5 cursor-pointer shadow-md self-start sm:self-auto transition-all"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Ad Settings</span>
          </button>
        </div>

        {savedSuccess && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 text-emerald-800 text-xs font-bold flex items-center gap-2 border border-emerald-200 animate-in fade-in duration-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Video Ad rules & trigger settings successfully updated across live app!</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Spin Wheel Trigger */}
          <div className={`p-4 rounded-2xl border ${isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-50 border-slate-200'} space-y-2.5`}>
            <div className="flex items-center justify-between">
              <span className={`text-xs font-black ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>🎡 Spin Wheel Ad</span>
              <button
                onClick={() => setSpinAdEnabled(!spinAdEnabled)}
                className={`cursor-pointer transition-all ${spinAdEnabled ? 'text-emerald-500' : 'text-slate-400'}`}
              >
                {spinAdEnabled ? <ToggleRight className="w-7 h-7" /> : <ToggleLeft className="w-7 h-7" />}
              </button>
            </div>
            <p className="text-[11px] text-slate-400 leading-snug">Plays video ad automatically on spin result before user claims reward.</p>
            <span className={`inline-block text-[9px] font-black uppercase px-2 py-0.5 rounded ${
              spinAdEnabled ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700 text-slate-400'
            }`}>
              {spinAdEnabled ? 'Trigger Active' : 'Disabled'}
            </span>
          </div>

          {/* Scratch Card Trigger */}
          <div className={`p-4 rounded-2xl border ${isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-50 border-slate-200'} space-y-2.5`}>
            <div className="flex items-center justify-between">
              <span className={`text-xs font-black ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>🎴 Scratch Card Ad</span>
              <button
                onClick={() => setScratchAdEnabled(!scratchAdEnabled)}
                className={`cursor-pointer transition-all ${scratchAdEnabled ? 'text-emerald-500' : 'text-slate-400'}`}
              >
                {scratchAdEnabled ? <ToggleRight className="w-7 h-7" /> : <ToggleLeft className="w-7 h-7" />}
              </button>
            </div>
            <p className="text-[11px] text-slate-400 leading-snug">Shows video ad after scratch completion to claim prize into wallet.</p>
            <span className={`inline-block text-[9px] font-black uppercase px-2 py-0.5 rounded ${
              scratchAdEnabled ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700 text-slate-400'
            }`}>
              {scratchAdEnabled ? 'Trigger Active' : 'Disabled'}
            </span>
          </div>

          {/* Daily Check-In Trigger */}
          <div className={`p-4 rounded-2xl border ${isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-50 border-slate-200'} space-y-2.5`}>
            <div className="flex items-center justify-between">
              <span className={`text-xs font-black ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>📅 Check-In Ad</span>
              <button
                onClick={() => setCheckinAdEnabled(!checkinAdEnabled)}
                className={`cursor-pointer transition-all ${checkinAdEnabled ? 'text-emerald-500' : 'text-slate-400'}`}
              >
                {checkinAdEnabled ? <ToggleRight className="w-7 h-7" /> : <ToggleLeft className="w-7 h-7" />}
              </button>
            </div>
            <p className="text-[11px] text-slate-400 leading-snug">Plays video ad immediately when user taps Claim Check-in button.</p>
            <span className={`inline-block text-[9px] font-black uppercase px-2 py-0.5 rounded ${
              checkinAdEnabled ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700 text-slate-400'
            }`}>
              {checkinAdEnabled ? 'Trigger Active' : 'Disabled'}
            </span>
          </div>

          {/* Native Banner Ads */}
          <div className={`p-4 rounded-2xl border ${isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-50 border-slate-200'} space-y-2.5`}>
            <div className="flex items-center justify-between">
              <span className={`text-xs font-black ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>📢 Banner Ads</span>
              <button
                onClick={() => setBannerAdsEnabled(!bannerAdsEnabled)}
                className={`cursor-pointer transition-all ${bannerAdsEnabled ? 'text-emerald-500' : 'text-slate-400'}`}
              >
                {bannerAdsEnabled ? <ToggleRight className="w-7 h-7" /> : <ToggleLeft className="w-7 h-7" />}
              </button>
            </div>
            <p className="text-[11px] text-slate-400 leading-snug">Displays native sponsored banners in Home & Withdrawal screens.</p>
            <span className={`inline-block text-[9px] font-black uppercase px-2 py-0.5 rounded ${
              bannerAdsEnabled ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700 text-slate-400'
            }`}>
              {bannerAdsEnabled ? 'Live' : 'Disabled'}
            </span>
          </div>
        </div>

        {/* Global Parameters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className={`flex items-center justify-between p-4 rounded-2xl border ${isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
            <div>
              <span className={`text-xs font-black ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>Mandatory Video Timer</span>
              <p className="text-[11px] text-slate-400">Seconds user must watch before Claim button activates</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="3"
                max="30"
                value={minAdDuration}
                onChange={e => setMinAdDuration(Number(e.target.value))}
                className={`w-16 px-2.5 py-1.5 text-center font-mono font-black text-xs rounded-xl border ${
                  isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
                }`}
              />
              <span className="text-xs font-bold text-slate-500">sec</span>
            </div>
          </div>

          <div className={`flex items-center justify-between p-4 rounded-2xl border ${isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
            <div>
              <span className={`text-xs font-black ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>Daily Ad Limit Per User</span>
              <p className="text-[11px] text-slate-400">Frequency cap to protect payout budget & CTR health</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="5"
                max="100"
                value={dailyAdLimit}
                onChange={e => setDailyAdLimit(Number(e.target.value))}
                className={`w-16 px-2.5 py-1.5 text-center font-mono font-black text-xs rounded-xl border ${
                  isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
                }`}
              />
              <span className="text-xs font-bold text-slate-500">ads/day</span>
            </div>
          </div>
        </div>
      </div>

      {/* Ad Campaigns Table */}
      <div className={`p-6 rounded-3xl border ${isDark ? 'bg-[#1E293B] border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className={`text-base font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>Live Sponsor Video Inventory</h3>
            <p className="text-xs text-slate-400">Manage high-paying direct advertisers, impression CPM & reward splits</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-black flex items-center gap-1.5 cursor-pointer shadow-md self-start sm:self-auto transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Add Sponsor Ad</span>
          </button>
        </div>

        {/* Inventory List */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className={`border-b text-[10px] uppercase font-black tracking-wider ${isDark ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-500'}`}>
                <th className="pb-3 px-3">Sponsor Campaign</th>
                <th className="pb-3 px-3">Placement</th>
                <th className="pb-3 px-3">Ad Type</th>
                <th className="pb-3 px-3">User Reward</th>
                <th className="pb-3 px-3">Ad CPM Payout</th>
                <th className="pb-3 px-3">Impressions</th>
                <th className="pb-3 px-3">Revenue</th>
                <th className="pb-3 px-3">Status</th>
                <th className="pb-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDark ? 'divide-slate-800' : 'divide-slate-100'}`}>
              {campaigns.map(ad => (
                <tr key={ad.id} className={`transition-colors ${isDark ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50'}`}>
                  <td className="py-3.5 px-3">
                    <div className={`font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{ad.title}</div>
                    <div className="text-[10px] text-slate-400">{ad.sponsorName} • {ad.durationSec > 0 ? `${ad.durationSec}s Video` : 'Banner'}</div>
                  </td>
                  <td className="py-3.5 px-3">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md capitalize ${
                      isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {ad.placement.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3.5 px-3">
                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${
                      ad.type === 'rewarded_video'
                        ? isDark ? 'bg-purple-500/20 text-purple-300' : 'bg-purple-100 text-purple-800'
                        : isDark ? 'bg-blue-500/20 text-blue-300' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {ad.type.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 font-mono font-black text-emerald-500">
                    {ad.rewardAmount > 0 ? `+₹${ad.rewardAmount}` : 'Banner (0)'}
                  </td>
                  <td className={`py-3.5 px-3 font-mono font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    ₹{ad.payoutPerImpression.toFixed(2)}
                  </td>
                  <td className={`py-3.5 px-3 font-mono ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    {ad.impressions.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-3 font-mono font-black text-emerald-500">
                    ₹{ad.revenueGenerated.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-3">
                    <button
                      onClick={() => toggleCampaignStatus(ad.id)}
                      className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full cursor-pointer transition-all ${
                        ad.status === 'active'
                          ? isDark ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-800'
                          : isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {ad.status}
                    </button>
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    <button
                      onClick={() => deleteCampaign(ad.id)}
                      className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/10 cursor-pointer transition-colors"
                      title="Delete Campaign"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mediation SDKs */}
      <div className={`p-6 rounded-3xl border ${isDark ? 'bg-[#1E293B] border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-3`}>
        <h3 className={`text-base font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>Connected Mediation SDKs</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className={`p-4 rounded-2xl border flex items-center justify-between ${isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
            <div>
              <h4 className={`text-xs font-black ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>Google AdMob</h4>
              <p className="text-[10px] text-slate-400">ca-app-pub-8921829182</p>
            </div>
            <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400">Live</span>
          </div>

          <div className={`p-4 rounded-2xl border flex items-center justify-between ${isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
            <div>
              <h4 className={`text-xs font-black ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>Unity Ads Mediation</h4>
              <p className="text-[10px] text-slate-400">App ID: unity_5482910</p>
            </div>
            <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400">Live</span>
          </div>

          <div className={`p-4 rounded-2xl border flex items-center justify-between ${isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
            <div>
              <h4 className={`text-xs font-black ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>AppLovin MAX</h4>
              <p className="text-[10px] text-slate-400">SDK: applovin_max_9921</p>
            </div>
            <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400">Live</span>
          </div>
        </div>
      </div>

      {/* Modal: Add New Campaign */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className={`w-full max-w-md p-6 rounded-3xl border shadow-2xl space-y-4 ${
            isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className={`flex items-center justify-between border-b pb-3 ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
              <h3 className="text-sm font-black">Publish New Sponsor Ad Campaign</h3>
              <button onClick={() => setShowAddModal(false)} className="text-xs font-bold text-slate-400 hover:text-slate-200 cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleCreateCampaign} className="space-y-3">
              <div>
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Ad Campaign Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Zupee Gold Ludo Cashback"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className={`w-full mt-1 p-2.5 rounded-xl border text-xs ${
                    isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Sponsor Brand / Company</label>
                <input
                  type="text"
                  placeholder="e.g. Zupee Technologies"
                  value={newSponsor}
                  onChange={e => setNewSponsor(e.target.value)}
                  className={`w-full mt-1 p-2.5 rounded-xl border text-xs ${
                    isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Ad Subtitle / Call to Action</label>
                <input
                  type="text"
                  placeholder="e.g. Play Ludo & Win Real Cash Instant UPI"
                  value={newSubtitle}
                  onChange={e => setNewSubtitle(e.target.value)}
                  className={`w-full mt-1 p-2.5 rounded-xl border text-xs ${
                    isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Placement Target</label>
                  <select
                    value={newPlacement}
                    onChange={e => setNewPlacement(e.target.value as any)}
                    className={`w-full mt-1 p-2.5 rounded-xl border text-xs font-bold ${
                      isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  >
                    <option value="spin_wheel">🎡 Lucky Spin Wheel</option>
                    <option value="scratch_card">🎴 Scratch Cards</option>
                    <option value="daily_checkin">📅 Daily Check-In</option>
                    <option value="watch_ads">🎬 Watch Ads Modal</option>
                    <option value="home_bottom">🏠 Home Screen Bottom</option>
                    <option value="withdraw_bottom">💳 Withdrawal Bottom</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">User Cash Reward (₹)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={newReward}
                    onChange={e => setNewReward(Number(e.target.value))}
                    className={`w-full mt-1 p-2.5 rounded-xl border text-xs font-mono font-bold ${
                      isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Impression Payout (₹)</label>
                  <input
                    type="number"
                    step="0.05"
                    value={newPayout}
                    onChange={e => setNewPayout(Number(e.target.value))}
                    className={`w-full mt-1 p-2.5 rounded-xl border text-xs font-mono font-bold ${
                      isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Video Duration (Sec)</label>
                  <input
                    type="number"
                    min="3"
                    max="30"
                    value={newDuration}
                    onChange={e => setNewDuration(Number(e.target.value))}
                    className={`w-full mt-1 p-2.5 rounded-xl border text-xs font-mono font-bold ${
                      isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-black cursor-pointer shadow-md"
                >
                  Publish Campaign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
