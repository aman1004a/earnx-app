import React, { useState } from 'react';
import { 
  Image as ImageIcon, 
  Plus, 
  Trash2, 
  Eye, 
  ExternalLink, 
  Layers, 
  Sparkles,
  MousePointerClick,
  Sliders,
  ArrowUp,
  ArrowDown,
  Edit2,
  Check,
  Zap,
  Gift,
  Users,
  Flame,
  Link,
  LifeBuoy
} from 'lucide-react';
import { AppBanner } from '../../utils/adminStorage';
import { useAdminTheme } from './AdminThemeContext';

interface AdminBannersTabProps {
  banners: AppBanner[];
  onUpdateBanners: (banners: AppBanner[]) => void;
  showToast: (msg: string) => void;
}

const STOCK_BANNER_PRESETS = [
  {
    name: '🎁 Spin & Win Jackpot',
    url: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=800&q=80',
    title: 'Spin & Win Cash Jackpot',
    subtitle: 'Win up to ₹500 directly to your UPI ID every day!',
    tag: '👑 Daily Jackpot',
    buttonText: 'Play Spin & Win',
    targetType: 'spin' as const,
    gradient: 'from-[#4B63FF] via-indigo-600 to-[#3549EC]'
  },
  {
    name: '⚡ UPI Instant Cashout',
    url: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=800&q=80',
    title: 'Instant UPI Cashout (0% Fee)',
    subtitle: 'Transfer wallet cash to PhonePe, GPay or Paytm in 60s',
    tag: '⚡ 60s Transfer',
    buttonText: 'Withdraw Cash',
    targetType: 'task' as const,
    gradient: 'from-amber-500 via-orange-500 to-rose-600'
  },
  {
    name: '👥 Refer & Earn ₹20',
    url: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=800&q=80',
    title: 'Invite Friends & Earn ₹20',
    subtitle: '+ 10% Lifetime passive commission on every task they finish',
    tag: '💰 Unlimited Cash',
    buttonText: 'Invite Friends',
    targetType: 'referral' as const,
    gradient: 'from-emerald-500 via-teal-600 to-emerald-700'
  },
  {
    name: '🔥 Gaming & Offerwall',
    url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
    title: 'CPALead High Reward Offerwall',
    subtitle: 'Download top trending games & apps to earn ₹50 - ₹250 per task',
    tag: '🚀 Top Offers',
    buttonText: 'Explore Offerwall',
    targetType: 'offerwall' as const,
    gradient: 'from-purple-600 via-fuchsia-600 to-indigo-700'
  },
  {
    name: '🎉 Mystery Scratch Cards',
    url: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=800&q=80',
    title: 'Daily Scratch & Win Bonus',
    subtitle: 'Unlock 3 free scratch cards daily for surprise wallet credits',
    tag: '✨ Free Scratch',
    buttonText: 'Scratch Now',
    targetType: 'scratch' as const,
    gradient: 'from-pink-500 via-rose-500 to-amber-500'
  }
];

export const AdminBannersTab: React.FC<AdminBannersTabProps> = ({
  banners = [],
  onUpdateBanners,
  showToast
}) => {
  const { isDark } = useAdminTheme();
  const [isAdding, setIsAdding] = useState(false);
  const [editingBannerId, setEditingBannerId] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [tag, setTag] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [buttonText, setButtonText] = useState('Claim Now');
  const [targetType, setTargetType] = useState<AppBanner['targetType']>('spin');
  const [targetValue, setTargetValue] = useState('');
  const [gradient, setGradient] = useState('from-[#4B63FF] via-indigo-600 to-[#3549EC]');

  const gradientOptions = [
    { label: 'Royal Blue Indigo', val: 'from-[#4B63FF] via-indigo-600 to-[#3549EC]' },
    { label: 'Sunset Amber Rose', val: 'from-amber-500 via-orange-500 to-rose-600' },
    { label: 'Emerald Mint Gold', val: 'from-emerald-500 via-teal-600 to-emerald-700' },
    { label: 'Cyber Violet Neon', val: 'from-purple-600 via-fuchsia-600 to-indigo-700' },
    { label: 'Dark Midnight Gold', val: 'from-slate-900 via-indigo-950 to-slate-900' },
  ];

  const resetForm = () => {
    setTitle('');
    setSubtitle('');
    setTag('');
    setImageUrl('');
    setButtonText('Claim Now');
    setTargetType('spin');
    setTargetValue('');
    setGradient('from-[#4B63FF] via-indigo-600 to-[#3549EC]');
    setIsAdding(false);
    setEditingBannerId(null);
  };

  const handleApplyPreset = (preset: typeof STOCK_BANNER_PRESETS[0]) => {
    setTitle(preset.title);
    setSubtitle(preset.subtitle);
    setTag(preset.tag);
    setImageUrl(preset.url);
    setButtonText(preset.buttonText);
    setTargetType(preset.targetType);
    setGradient(preset.gradient);
  };

  const handleStartEdit = (banner: AppBanner) => {
    setEditingBannerId(banner.id);
    setTitle(banner.title);
    setSubtitle(banner.subtitle);
    setTag(banner.tag);
    setImageUrl(banner.imageUrl || '');
    setButtonText(banner.buttonText || 'Claim Now');
    setTargetType(banner.targetType);
    setTargetValue(banner.targetValue || '');
    setGradient(banner.gradient);
    setIsAdding(true);
  };

  const handleSaveBanner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !subtitle.trim()) {
      showToast('⚠️ Please enter both headline and subtitle.');
      return;
    }

    if (editingBannerId) {
      // Update existing
      const updated = banners.map(b => {
        if (b.id === editingBannerId) {
          return {
            ...b,
            title: title.trim(),
            subtitle: subtitle.trim(),
            tag: tag.trim() || '🎉 Promo',
            imageUrl: imageUrl.trim() || undefined,
            buttonText: buttonText.trim() || 'Claim Now',
            targetType,
            targetValue: targetValue.trim() || undefined,
            gradient
          };
        }
        return b;
      });
      onUpdateBanners(updated);
      showToast('✨ Promotion slider updated!');
    } else {
      // Create new
      const newBanner: AppBanner = {
        id: `BAN-${Date.now().toString().slice(-4)}`,
        title: title.trim(),
        subtitle: subtitle.trim(),
        tag: tag.trim() || '🔥 Hot Promo',
        imageUrl: imageUrl.trim() || undefined,
        buttonText: buttonText.trim() || 'Claim Now',
        gradient,
        targetType,
        targetValue: targetValue.trim() || undefined,
        isActive: true,
        order: banners.length + 1,
        clicks: 0,
      };
      onUpdateBanners([...banners, newBanner]);
      showToast('🚀 New Promotion Slider image published live!');
    }
    resetForm();
  };

  const handleToggleActive = (id: string) => {
    const updated = banners.map(b => (b.id === id ? { ...b, isActive: !b.isActive } : b));
    onUpdateBanners(updated);
    showToast('Banner status updated.');
  };

  const handleDelete = (id: string) => {
    onUpdateBanners(banners.filter(b => b.id !== id));
    showToast('🗑️ Banner deleted.');
  };

  const handleMoveOrder = (index: number, direction: 'up' | 'down') => {
    const newBanners = [...banners];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= newBanners.length) return;
    const temp = newBanners[index];
    newBanners[index] = newBanners[targetIdx];
    newBanners[targetIdx] = temp;
    onUpdateBanners(newBanners.map((b, i) => ({ ...b, order: i + 1 })));
    showToast('Slider display order updated.');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className={`text-xl font-black flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            <ImageIcon className="w-6 h-6 text-fuchsia-500" />
            <span>Promotion Sliders & In-App Banners Management</span>
          </h2>
          <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Add, edit, re-order and customize promotion slider images, action buttons & click targets shown on user home screen.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (isAdding) resetForm();
              else setIsAdding(true);
            }}
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white font-extrabold text-xs shadow-lg shadow-fuchsia-600/30 flex items-center gap-2 cursor-pointer hover:opacity-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>{isAdding ? 'Close Creator' : 'Add Promotion Slider'}</span>
          </button>
        </div>
      </div>

      {/* Add / Edit Banner Form */}
      {isAdding && (
        <form onSubmit={handleSaveBanner} className={`p-5 rounded-3xl border space-y-4 shadow-2xl animate-in fade-in zoom-in duration-200 ${
          isDark ? 'bg-[#1E293B] border-fuchsia-500/30' : 'bg-white border-fuchsia-200'
        }`}>
          <div className="flex items-center justify-between">
            <h3 className={`text-sm font-black flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              <Sparkles className="w-4 h-4 text-fuchsia-500" />
              <span>{editingBannerId ? 'Edit Promotion Slider' : 'Create Promotion Slider'}</span>
            </h3>
            {/* Quick Presets */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className={`text-[11px] font-bold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Quick Presets:</span>
              {STOCK_BANNER_PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleApplyPreset(preset)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold cursor-pointer transition-all border ${
                    isDark 
                      ? 'bg-slate-900 border-slate-700 text-slate-300 hover:text-white hover:border-fuchsia-500' 
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-fuchsia-50 hover:text-fuchsia-700 hover:border-fuchsia-300'
                  }`}
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className={`text-xs font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Slider Headline / Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Spin & Win ₹500 Cash"
                className={`w-full px-4 py-2.5 rounded-xl border text-xs focus:outline-hidden focus:border-fuchsia-500 ${
                  isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}
              />
            </div>
            <div className="space-y-1.5">
              <label className={`text-xs font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Highlight Badge Tag</label>
              <input
                type="text"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                placeholder="e.g. 🔥 Limited Time"
                className={`w-full px-4 py-2.5 rounded-xl border text-xs focus:outline-hidden focus:border-fuchsia-500 ${
                  isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className={`text-xs font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Subtitle Description</label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="e.g. Complete 2 easy tasks & unlock daily jackpot ticket"
              className={`w-full px-4 py-2.5 rounded-xl border text-xs focus:outline-hidden focus:border-fuchsia-500 ${
                isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
              }`}
            />
          </div>

          {/* Image URL & Button Label Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className={`text-xs font-bold flex items-center gap-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                <ImageIcon className="w-3.5 h-3.5 text-fuchsia-500" />
                <span>Slider Background Image URL (Optional)</span>
              </label>
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/photo-..."
                className={`w-full px-4 py-2.5 rounded-xl border text-xs focus:outline-hidden focus:border-fuchsia-500 ${
                  isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}
              />
            </div>
            <div className="space-y-1.5">
              <label className={`text-xs font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Action Button Text</label>
              <input
                type="text"
                value={buttonText}
                onChange={(e) => setButtonText(e.target.value)}
                placeholder="e.g. Play Spin, Claim Now, Invite Friends"
                className={`w-full px-4 py-2.5 rounded-xl border text-xs focus:outline-hidden focus:border-fuchsia-500 ${
                  isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className={`text-xs font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>On Click Navigation Target</label>
              <select
                value={targetType}
                onChange={(e) => setTargetType(e.target.value as any)}
                className={`w-full px-4 py-2.5 rounded-xl border text-xs focus:outline-hidden ${
                  isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}
              >
                <option value="spin">🎯 Lucky Spin & Win Wheel</option>
                <option value="scratch">🃏 Daily Scratch Cards</option>
                <option value="task">📋 Task Center & Withdrawals</option>
                <option value="offerwall">🔥 CPALead Offerwall</option>
                <option value="referral">👥 Refer & Earn Program</option>
                <option value="support">💬 WhatsApp / Customer Support</option>
                <option value="external">🌐 External Web Link</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className={`text-xs font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Fallback Gradient Color</label>
              <select
                value={gradient}
                onChange={(e) => setGradient(e.target.value)}
                className={`w-full px-4 py-2.5 rounded-xl border text-xs focus:outline-hidden ${
                  isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}
              >
                {gradientOptions.map(opt => (
                  <option key={opt.val} value={opt.val}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>

          {targetType === 'external' && (
            <div className="space-y-1.5">
              <label className={`text-xs font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>External URL Link</label>
              <input
                type="text"
                value={targetValue}
                onChange={(e) => setTargetValue(e.target.value)}
                placeholder="https://t.me/yourchannel or https://wa.me/..."
                className={`w-full px-4 py-2.5 rounded-xl border text-xs focus:outline-hidden focus:border-fuchsia-500 ${
                  isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}
              />
            </div>
          )}

          {/* Live Preview of Draft Slider */}
          <div className="pt-2">
            <span className={`text-[11px] font-bold block mb-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Live Slider Preview in User App:
            </span>
            <div className={`relative p-5 rounded-3xl overflow-hidden shadow-xl min-h-[160px] flex flex-col justify-between text-white ${
              !imageUrl ? `bg-gradient-to-r ${gradient}` : 'bg-slate-900'
            }`}>
              {imageUrl && (
                <img 
                  src={imageUrl} 
                  alt="Banner preview" 
                  className="absolute inset-0 w-full h-full object-cover"
                />
              )}
              {/* Gradient Dark Overlay for legibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/30 pointer-events-none" />
              
              <div className="flex items-start justify-between relative z-10">
                <span className="px-2.5 py-1 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black uppercase tracking-wider shadow-xs">
                  {tag || '🎉 Promo'}
                </span>
                <span className="text-[10px] font-mono bg-white/20 backdrop-blur-md px-2.5 py-0.5 rounded-md">
                  Action: {targetType}
                </span>
              </div>

              <div className="space-y-1 relative z-10 my-2">
                <h4 className="text-base sm:text-lg font-black tracking-tight leading-tight">
                  {title || 'Your Promo Title Here'}
                </h4>
                <p className="text-xs text-white/90 line-clamp-2">
                  {subtitle || 'Short description of what users will earn or unlock'}
                </p>
              </div>

              <div className="flex items-center justify-between relative z-10 pt-1">
                <button
                  type="button"
                  className="px-3.5 py-1.5 rounded-xl bg-white text-slate-900 text-xs font-black shadow-sm"
                >
                  {buttonText || 'Claim Now'} →
                </button>
                <span className="text-[10px] text-white/70 font-semibold">EarnX Promotion Carousel</span>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={resetForm}
              className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer ${
                isDark ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-fuchsia-600 to-pink-600 hover:opacity-95 text-white font-black text-xs shadow-lg cursor-pointer transition-all"
            >
              {editingBannerId ? 'Update Slider' : 'Publish Slider Live'}
            </button>
          </div>
        </form>
      )}

      {/* Existing Banners List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className={`text-xs font-bold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Active Sliders ({banners.length})
          </span>
          <span className={`text-[11px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            Sliders automatically rotate in the user app carousel every 4 seconds
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {banners.map((banner, index) => (
            <div
              key={banner.id}
              className={`p-4 rounded-3xl border space-y-3.5 shadow-md flex flex-col justify-between transition-all ${
                isDark ? 'bg-[#1E293B] border-slate-800' : 'bg-white border-slate-200'
              }`}
            >
              {/* Visual Banner Preview */}
              <div className={`relative p-4 rounded-2xl min-h-[140px] flex flex-col justify-between text-white overflow-hidden ${
                !banner.imageUrl ? `bg-gradient-to-r ${banner.gradient}` : 'bg-slate-900'
              }`}>
                {banner.imageUrl && (
                  <img 
                    src={banner.imageUrl} 
                    alt={banner.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/30 pointer-events-none" />
                
                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-1.5">
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black uppercase tracking-wider">
                      {banner.tag}
                    </span>
                    <span className="text-[10px] font-mono bg-black/40 px-2 py-0.5 rounded-md text-white">
                      #{banner.order || index + 1}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono uppercase bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-md">
                    {banner.targetType}
                  </span>
                </div>

                <div className="relative z-10 my-1">
                  <h3 className="text-sm font-black tracking-tight line-clamp-1">{banner.title}</h3>
                  <p className="text-[11px] opacity-90 line-clamp-1 mt-0.5">{banner.subtitle}</p>
                </div>

                <div className="flex items-center justify-between relative z-10 pt-1">
                  <span className="px-2.5 py-1 rounded-lg bg-white text-slate-900 text-[10px] font-black shadow-xs">
                    {banner.buttonText || 'Claim'} →
                  </span>
                  {banner.imageUrl ? (
                    <span className="text-[9px] text-emerald-300 font-bold flex items-center gap-1">
                      <ImageIcon className="w-3 h-3" /> Image Banner
                    </span>
                  ) : (
                    <span className="text-[9px] text-white/70">Gradient Banner</span>
                  )}
                </div>
              </div>

              {/* Banner Performance & Controls */}
              <div className="flex items-center justify-between pt-1">
                {/* Reorder and Click Stats */}
                <div className="flex items-center gap-2">
                  <div className={`flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-xl border ${
                    isDark ? 'bg-slate-900 text-slate-300 border-slate-800' : 'bg-slate-50 text-slate-700 border-slate-200'
                  }`}>
                    <MousePointerClick className="w-3 h-3 text-fuchsia-500" />
                    <span>{banner.clicks?.toLocaleString() || 0} Clicks</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleMoveOrder(index, 'up')}
                      disabled={index === 0}
                      title="Move Up"
                      className={`p-1.5 rounded-lg border cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed ${
                        isDark ? 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white' : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <ArrowUp className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => handleMoveOrder(index, 'down')}
                      disabled={index === banners.length - 1}
                      title="Move Down"
                      className={`p-1.5 rounded-lg border cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed ${
                        isDark ? 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white' : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <ArrowDown className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Edit, Status Toggle & Delete */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleStartEdit(banner)}
                    className={`p-1.5 rounded-xl border cursor-pointer ${
                      isDark ? 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white' : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                    }`}
                    title="Edit Slider"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleToggleActive(banner.id)}
                    className={`px-2.5 py-1 rounded-xl text-[11px] font-bold cursor-pointer transition-all ${
                      banner.isActive 
                        ? 'bg-emerald-500/20 text-emerald-500 dark:text-emerald-300 border border-emerald-500/30' 
                        : isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {banner.isActive ? 'Active' : 'Hidden'}
                  </button>

                  <button
                    onClick={() => handleDelete(banner.id)}
                    className="p-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 cursor-pointer transition-colors"
                    title="Delete Slider"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
