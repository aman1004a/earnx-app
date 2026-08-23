import React, { useState } from 'react';
import { 
  Bell, 
  Send, 
  Sparkles, 
  Radio, 
  Eye, 
  Trash2, 
  Plus, 
  Layers, 
  Users, 
  CheckCircle2, 
  MessageSquare,
  Volume2
} from 'lucide-react';
import { BroadcastNotification, AppGlobalConfig } from '../../utils/adminStorage';

interface AdminBroadcastTabProps {
  broadcasts: BroadcastNotification[];
  onUpdateBroadcasts: (list: BroadcastNotification[]) => void;
  config: AppGlobalConfig;
  onUpdateConfig: (config: AppGlobalConfig) => void;
  showToast: (msg: string) => void;
}

export const AdminBroadcastTab: React.FC<AdminBroadcastTabProps> = ({
  broadcasts = [],
  onUpdateBroadcasts,
  config,
  onUpdateConfig,
  showToast
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [newType, setNewType] = useState<'push' | 'popup_dialog' | 'top_banner'>('push');
  const [newAudience, setNewAudience] = useState<'all' | 'new_users' | 'active_today'>('all');
  const [newBadge, setNewBadge] = useState('🔥 Hot Update');

  // Marquee settings state
  const [marqueeText, setMarqueeText] = useState(config.marqueeText || '₹25 Welcome Bonus live for new users! Spin wheel daily & withdraw instantly via UPI.');
  const [isMarqueeOn, setIsMarqueeOn] = useState(config.isMarqueeEnabled ?? true);

  const handleSaveMarquee = () => {
    onUpdateConfig({
      ...config,
      marqueeText,
      isMarqueeEnabled: isMarqueeOn,
    });
    showToast('📢 Live Marquee Ticker updated successfully!');
  };

  const handleCreateBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newMessage.trim()) {
      showToast('⚠️ Please enter both title and message.');
      return;
    }

    const newBroadcast: BroadcastNotification = {
      id: `BC-${Date.now().toString().slice(-4)}`,
      title: newTitle.trim(),
      message: newMessage.trim(),
      type: newType,
      targetAudience: newAudience,
      badge: newBadge.trim(),
      isActive: true,
      createdAt: 'Just now',
      viewsCount: 0,
    };

    onUpdateBroadcasts([newBroadcast, ...broadcasts]);
    showToast(`📢 Broadcast sent to ${newAudience.replace('_', ' ')}!`);
    setNewTitle('');
    setNewMessage('');
    setIsCreating(false);
  };

  const handleDeleteBroadcast = (id: string) => {
    onUpdateBroadcasts(broadcasts.filter(b => b.id !== id));
    showToast('🗑️ Broadcast deleted.');
  };

  const handleToggleActive = (id: string) => {
    const updated = broadcasts.map(b => (b.id === id ? { ...b, isActive: !b.isActive } : b));
    onUpdateBroadcasts(updated);
    showToast('Broadcast visibility updated.');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Bell className="w-6 h-6 text-indigo-400" />
            <span>Push Notifications & Notice Broadcast Center</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Publish real-time popups, system push alerts, and in-app running ticker notices.
          </p>
        </div>
        <button
          onClick={() => setIsCreating(!isCreating)}
          className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-500 to-[#4B63FF] text-white font-extrabold text-xs shadow-lg shadow-indigo-500/25 flex items-center gap-2 hover:opacity-95 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{isCreating ? 'Close Creator' : 'Create New Broadcast'}</span>
        </button>
      </div>

      {/* Live Marquee Ticker Controller */}
      <div className="p-5 rounded-3xl bg-[#1E293B] border border-slate-800 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Volume2 className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-black text-white">Live In-App Running Ticker (Marquee Notice)</h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400">Enabled:</span>
            <input
              type="checkbox"
              checked={isMarqueeOn}
              onChange={(e) => setIsMarqueeOn(e.target.checked)}
              className="w-5 h-5 accent-indigo-500 cursor-pointer"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <input
            type="text"
            value={marqueeText}
            onChange={(e) => setMarqueeText(e.target.value)}
            placeholder="Enter scrolling announcement text..."
            className="flex-1 w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:outline-hidden focus:border-indigo-500 font-medium"
          />
          <button
            onClick={handleSaveMarquee}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs cursor-pointer shadow-md"
          >
            Update Live Ticker
          </button>
        </div>

        {/* Live Preview of Ticker */}
        {isMarqueeOn && (
          <div className="overflow-hidden bg-slate-900/90 py-2 px-3 rounded-xl border border-slate-800">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 whitespace-nowrap">
              <span className="px-1.5 py-0.5 rounded-md bg-amber-500/20 text-[10px] font-black uppercase">Live Preview</span>
              <span className="animate-marquee inline-block">{marqueeText}</span>
            </div>
          </div>
        )}
      </div>

      {/* Broadcast Creation Form */}
      {isCreating && (
        <form onSubmit={handleCreateBroadcast} className="p-5 rounded-3xl bg-[#1E293B] border border-indigo-500/30 space-y-4 shadow-2xl animate-in fade-in zoom-in duration-200">
          <h3 className="text-sm font-black text-white flex items-center gap-2">
            <Send className="w-4 h-4 text-indigo-400" />
            <span>Compose Push Broadcast</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Campaign Title</label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. 🎁 Instant Sunday 2X Rewards Active!"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-hidden focus:border-indigo-500"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Tag / Badge</label>
              <input
                type="text"
                value={newBadge}
                onChange={(e) => setNewBadge(e.target.value)}
                placeholder="e.g. ⚡ Mega Offer"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-hidden focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">Broadcast Message Body</label>
            <textarea
              rows={3}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Enter full notice description shown to users..."
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-hidden focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Delivery Format</label>
              <select
                value={newType}
                onChange={(e) => setNewType(e.target.value as any)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-hidden"
              >
                <option value="push">🔔 System Notification Tray</option>
                <option value="popup_dialog">💬 In-App Modal Dialog</option>
                <option value="top_banner">📌 Top Floating Sticky Banner</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Target User Segment</label>
              <select
                value={newAudience}
                onChange={(e) => setNewAudience(e.target.value as any)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-hidden"
              >
                <option value="all">👥 All Registered Users (100%)</option>
                <option value="new_users">✨ New Users (Signed up in 48 hrs)</option>
                <option value="active_today">⚡ Active Today Only</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-lg cursor-pointer"
            >
              Send Broadcast Live
            </button>
          </div>
        </form>
      )}

      {/* Broadcasts History List */}
      <div className="space-y-3">
        <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
          Active Broadcast Campaigns ({broadcasts.length})
        </h3>
        <div className="grid grid-cols-1 gap-3">
          {broadcasts.map(bc => (
            <div
              key={bc.id}
              className={`p-4 rounded-2xl bg-[#1E293B] border transition-all ${
                bc.isActive ? 'border-slate-800 hover:border-indigo-500/50' : 'border-slate-800/40 opacity-60'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    {bc.badge && (
                      <span className="px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 text-[10px] font-black">
                        {bc.badge}
                      </span>
                    )}
                    <h4 className="text-sm font-black text-white">{bc.title}</h4>
                    <span className="text-[10px] text-slate-500 font-medium">({bc.createdAt})</span>
                  </div>
                  <p className="text-xs text-slate-300 max-w-2xl">{bc.message}</p>
                </div>
                <div className="flex items-center gap-2 pt-2 sm:pt-0">
                  <div className="flex items-center gap-1 text-[11px] font-bold text-slate-400 bg-slate-900/80 px-2.5 py-1 rounded-lg">
                    <Eye className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{bc.viewsCount.toLocaleString()} impressions</span>
                  </div>
                  <button
                    onClick={() => handleToggleActive(bc.id)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer ${
                      bc.isActive ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {bc.isActive ? 'Active' : 'Paused'}
                  </button>
                  <button
                    onClick={() => handleDeleteBroadcast(bc.id)}
                    className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 cursor-pointer"
                    title="Delete Broadcast"
                  >
                    <Trash2 className="w-4 h-4" />
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
