import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Settings, 
  Users, 
  DollarSign, 
  Layers, 
  HelpCircle, 
  ShieldCheck, 
  Check, 
  Plus, 
  Trash2, 
  Save, 
  MessageSquare,
  Sparkles,
  RotateCcw
} from 'lucide-react';
import { 
  getAppConfig, 
  saveAppConfig, 
  getAdminOfferwalls, 
  saveAdminOfferwalls, 
  getAdminTickets, 
  saveAdminTickets,
  AppGlobalConfig,
  SupportTicket
} from '../utils/adminStorage';
import { OfferwallPartner } from './offerwall/offerwallData';

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  showToast: (msg: string) => void;
}

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({
  isOpen,
  onClose,
  showToast
}) => {
  const [activeTab, setActiveTab] = useState<'rewards' | 'support' | 'offerwalls' | 'tickets' | 'security'>('rewards');

  // Config State
  const [config, setConfig] = useState<AppGlobalConfig>(() => getAppConfig());
  const [offerwalls, setOfferwalls] = useState<OfferwallPartner[]>(() => getAdminOfferwalls());
  const [tickets, setTickets] = useState<SupportTicket[]>(() => getAdminTickets());

  // Ticket Response State
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [adminReplyText, setAdminReplyText] = useState('');

  if (!isOpen) return null;

  const handleSaveConfig = () => {
    saveAppConfig(config);
    showToast('✅ Admin configuration saved successfully!');
  };

  const handleSaveOfferwalls = () => {
    saveAdminOfferwalls(offerwalls);
    showToast('✅ Offerwalls updated successfully!');
  };

  const handleToggleOfferwall = (id: string) => {
    const updated = offerwalls.map(o => o.id === id ? { ...o, isActive: !o.isActive } : o);
    setOfferwalls(updated);
    saveAdminOfferwalls(updated);
    showToast('Offerwall status updated!');
  };

  const handleUpdateTicketStatus = (ticketId: string, newStatus: SupportTicket['status']) => {
    const updated = tickets.map(t => t.id === ticketId ? { ...t, status: newStatus } : t);
    setTickets(updated);
    saveAdminTickets(updated);
    showToast(`Ticket status changed to ${newStatus}`);
  };

  const handleSendAdminReply = (ticketId: string) => {
    if (!adminReplyText.trim()) return;

    const newMsg = {
      id: `msg-${Date.now()}`,
      sender: 'admin' as const,
      text: adminReplyText.trim(),
      timestamp: 'Just now'
    };

    const updated = tickets.map(t => {
      if (t.id === ticketId) {
        return {
          ...t,
          status: 'resolved' as const,
          messages: [...t.messages, newMsg]
        };
      }
      return t;
    });

    setTickets(updated);
    saveAdminTickets(updated);
    setAdminReplyText('');
    showToast('✅ Reply sent and ticket marked as Resolved!');
  };

  const handleResetToDefaults = () => {
    if (window.confirm('Reset all rewards and settings to initial system defaults?')) {
      localStorage.removeItem('earnx_admin_config');
      localStorage.removeItem('earnx_admin_offerwalls');
      localStorage.removeItem('earnx_admin_tickets');
      setConfig(getAppConfig());
      setOfferwalls(getAdminOfferwalls());
      setTickets(getAdminTickets());
      showToast('🔄 Settings reset to defaults!');
    }
  };

  const selectedTicket = tickets.find(t => t.id === selectedTicketId);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col h-[90vh] max-h-[750px] overflow-hidden text-left"
        >
          {/* Header */}
          <div className="p-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                <Settings className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-black tracking-tight font-outfit">EarnX Master Admin Suite</h3>
                  <span className="text-[9px] font-black uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.5 rounded">
                    SuperAdmin
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">Live controls for reward rates, offerwalls, support & withdrawal rules</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Admin Navigation Tabs */}
          <div className="px-4 py-2 bg-slate-100/90 border-b border-slate-200/80 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
            {[
              { id: 'rewards', label: 'Reward Rates', icon: DollarSign },
              { id: 'support', label: 'Support & Help Desk', icon: HelpCircle },
              { id: 'offerwalls', label: 'Offerwall Networks', icon: Layers },
              { id: 'tickets', label: `Tickets (${tickets.filter(t => t.status === 'open').length} Open)`, icon: MessageSquare },
              { id: 'security', label: 'Security & Anti-Fraud', icon: ShieldCheck }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeTab === tab.id
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-200'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Scrollable Content Body */}
          <div className="p-4 flex-1 overflow-y-auto space-y-4">
            {/* ================= TAB 1: REWARD RATES ================= */}
            {activeTab === 'rewards' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black uppercase text-slate-500 tracking-wider">
                    Core Reward Multipliers & Payout Caps
                  </h4>
                  <button
                    onClick={handleSaveConfig}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Changes</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {/* Signup Bonus */}
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                    <label className="font-bold text-slate-700 block">New User Welcome Bonus (INR ₹)</label>
                    <input
                      type="number"
                      value={config.signupBonus}
                      onChange={(e) => setConfig({ ...config, signupBonus: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 font-bold text-slate-900"
                    />
                    <span className="text-[10px] text-slate-400">Credited on mobile verification</span>
                  </div>

                  {/* Daily Check-in Base */}
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                    <label className="font-bold text-slate-700 block">Daily Check-in Base Reward (INR ₹)</label>
                    <input
                      type="number"
                      value={config.dailyCheckInBase}
                      onChange={(e) => setConfig({ ...config, dailyCheckInBase: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 font-bold text-slate-900"
                    />
                    <span className="text-[10px] text-slate-400">Multiplies up to 7-day streak</span>
                  </div>

                  {/* Spin Wheel Max Win */}
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                    <label className="font-bold text-slate-700 block">Spin Wheel Max Win Cap (INR ₹)</label>
                    <input
                      type="number"
                      value={config.spinWheelMaxWin}
                      onChange={(e) => setConfig({ ...config, spinWheelMaxWin: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 font-bold text-slate-900"
                    />
                    <span className="text-[10px] text-slate-400">Default: ₹50 max win slot</span>
                  </div>

                  {/* Scratch Card Max Win */}
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                    <label className="font-bold text-slate-700 block">Scratch Card Max Win (INR ₹)</label>
                    <input
                      type="number"
                      value={config.scratchCardMaxWin}
                      onChange={(e) => setConfig({ ...config, scratchCardMaxWin: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 font-bold text-slate-900"
                    />
                    <span className="text-[10px] text-slate-400">Randomized reward cap</span>
                  </div>

                  {/* Video Ad Reward */}
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                    <label className="font-bold text-slate-700 block">Rewarded Video Ad Payout (INR ₹)</label>
                    <input
                      type="number"
                      value={config.watchAdReward}
                      onChange={(e) => setConfig({ ...config, watchAdReward: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 font-bold text-slate-900"
                    />
                    <span className="text-[10px] text-slate-400">Per 15s verified video ad</span>
                  </div>

                  {/* Daily Ad Cap */}
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                    <label className="font-bold text-slate-700 block">Daily Watch Ads Limit (Count)</label>
                    <input
                      type="number"
                      value={config.dailyAdLimit}
                      onChange={(e) => setConfig({ ...config, dailyAdLimit: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 font-bold text-slate-900"
                    />
                    <span className="text-[10px] text-slate-400">Ads allowed per user daily</span>
                  </div>

                  {/* Referrer Bonus */}
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                    <label className="font-bold text-slate-700 block">Referral Bonus for Inviter (INR ₹)</label>
                    <input
                      type="number"
                      value={config.referralBonusInviter}
                      onChange={(e) => setConfig({ ...config, referralBonusInviter: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 font-bold text-slate-900"
                    />
                    <span className="text-[10px] text-slate-400">Paid to friend who shared code</span>
                  </div>

                  {/* Invitee Bonus */}
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                    <label className="font-bold text-slate-700 block">Referral Bonus for Invitee (INR ₹)</label>
                    <input
                      type="number"
                      value={config.referralBonusInvitee}
                      onChange={(e) => setConfig({ ...config, referralBonusInvitee: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 font-bold text-slate-900"
                    />
                    <span className="text-[10px] text-slate-400">Paid to new joining user</span>
                  </div>
                </div>
              </div>
            )}

            {/* ================= TAB 2: SUPPORT SETTINGS ================= */}
            {activeTab === 'support' && (
              <div className="space-y-4 text-xs">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black uppercase text-slate-500 tracking-wider">
                    Customer Support Channels & Contact Info
                  </h4>
                  <button
                    onClick={handleSaveConfig}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Support Channels</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {/* WhatsApp Support */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="font-bold text-slate-800 flex items-center gap-1.5">
                        <span>💬 WhatsApp Support Mobile Number</span>
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={config.isWhatsAppSupportEnabled}
                          onChange={(e) => setConfig({ ...config, isWhatsAppSupportEnabled: e.target.checked })}
                          className="w-4 h-4 rounded text-blue-600 accent-blue-600"
                        />
                        <span className="text-[11px] font-bold text-slate-600">Active</span>
                      </label>
                    </div>
                    <input
                      type="text"
                      value={config.supportWhatsApp}
                      onChange={(e) => setConfig({ ...config, supportWhatsApp: e.target.value })}
                      placeholder="+91 9876543210"
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 font-bold text-slate-900"
                    />
                    <p className="text-[10px] text-slate-400">Users will be redirected to this WhatsApp chat for 1-on-1 human help.</p>
                  </div>

                  {/* Telegram Channel */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <label className="font-bold text-slate-800 block">📢 Telegram Support Username / Channel</label>
                    <input
                      type="text"
                      value={config.supportTelegram}
                      onChange={(e) => setConfig({ ...config, supportTelegram: e.target.value })}
                      placeholder="@EarnXSupportOfficial"
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 font-bold text-slate-900"
                    />
                  </div>

                  {/* Support Email */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <label className="font-bold text-slate-800 block">✉️ Official Support Email Address</label>
                    <input
                      type="email"
                      value={config.supportEmail}
                      onChange={(e) => setConfig({ ...config, supportEmail: e.target.value })}
                      placeholder="earnxofficials@gmail.com"
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 font-bold text-slate-900"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ================= TAB 3: OFFERWALLS ================= */}
            {activeTab === 'offerwalls' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-black uppercase text-slate-500 tracking-wider">
                      Partner Offerwall Integrations
                    </h4>
                    <p className="text-[11px] text-slate-400">Toggle live offerwall partner networks and manage multipliers</p>
                  </div>
                  <button
                    onClick={handleSaveOfferwalls}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Offerwalls</span>
                  </button>
                </div>

                <div className="space-y-2.5">
                  {offerwalls.map(partner => (
                    <div
                      key={partner.id}
                      className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-slate-900 text-white font-black text-xs flex items-center justify-center">
                          {partner.name[0]}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h5 className="text-xs font-black text-slate-900">{partner.name}</h5>
                            <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-blue-100 text-blue-700">
                              {partner.multiplier}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-500">{partner.tagline} • {partner.offers.length} active offers</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggleOfferwall(partner.id)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-black cursor-pointer transition-all ${
                            partner.isActive !== false
                              ? 'bg-emerald-100 text-emerald-700 border border-emerald-300'
                              : 'bg-slate-200 text-slate-500'
                          }`}
                        >
                          {partner.isActive !== false ? 'Active' : 'Disabled'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ================= TAB 4: SUPPORT TICKETS ================= */}
            {activeTab === 'tickets' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black uppercase text-slate-500 tracking-wider">
                    Customer Support Inquiries ({tickets.length})
                  </h4>
                  <span className="text-[10px] font-bold text-slate-400">
                    Live syncing from users
                  </span>
                </div>

                {selectedTicket ? (
                  /* Admin Chat Reply View */
                  <div className="p-4 rounded-3xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedTicketId(null)}
                          className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
                        >
                          ← Back to Tickets
                        </button>
                        <span className="font-mono text-[10px] bg-slate-200 px-1.5 py-0.5 rounded">
                          {selectedTicket.id}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <select
                          value={selectedTicket.status}
                          onChange={(e) => handleUpdateTicketStatus(selectedTicket.id, e.target.value as any)}
                          className="text-xs font-bold px-2 py-1 rounded-lg border border-slate-200 bg-white"
                        >
                          <option value="open">Open</option>
                          <option value="in_progress">In Progress</option>
                          <option value="resolved">Resolved</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xs font-extrabold text-slate-900">{selectedTicket.subject}</h4>
                      <p className="text-[10px] text-slate-500">From: {selectedTicket.userName} ({selectedTicket.userPhone})</p>
                    </div>

                    <div className="space-y-2 max-h-56 overflow-y-auto p-2 bg-white rounded-2xl border border-slate-200">
                      {selectedTicket.messages.map(msg => (
                        <div key={msg.id} className={`p-2 rounded-xl text-xs ${
                          msg.sender === 'user' ? 'bg-blue-50 text-blue-950' : 'bg-emerald-50 text-emerald-950 font-medium'
                        }`}>
                          <span className="text-[9px] font-bold uppercase block text-slate-400">
                            {msg.sender === 'user' ? 'User' : 'Support Desk'} • {msg.timestamp}
                          </span>
                          {msg.text}
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={adminReplyText}
                        onChange={(e) => setAdminReplyText(e.target.value)}
                        placeholder="Write resolution reply to user..."
                        className="flex-1 px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-800"
                      />
                      <button
                        onClick={() => handleSendAdminReply(selectedTicket.id)}
                        className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold cursor-pointer"
                      >
                        Reply & Resolve
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {tickets.map(ticket => (
                      <div
                        key={ticket.id}
                        onClick={() => setSelectedTicketId(ticket.id)}
                        className="p-3 rounded-2xl bg-white border border-slate-200 hover:border-slate-400 transition-all cursor-pointer flex items-center justify-between"
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono font-bold bg-slate-100 px-1.5 py-0.5 rounded text-slate-700">
                              {ticket.id}
                            </span>
                            <h5 className="text-xs font-black text-slate-900">{ticket.subject}</h5>
                          </div>
                          <p className="text-[10px] text-slate-500">{ticket.userName} • {ticket.userPhone} • {ticket.createdAt}</p>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase ${
                            ticket.status === 'open' 
                              ? 'bg-rose-100 text-rose-700' 
                              : ticket.status === 'in_progress'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-emerald-100 text-emerald-700'
                          }`}>
                            {ticket.status.replace('_', ' ')}
                          </span>
                          <span className="text-xs text-slate-400">→</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ================= TAB 5: SECURITY & FRAUD ================= */}
            {activeTab === 'security' && (
              <div className="space-y-4 text-xs">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black uppercase text-slate-500 tracking-wider">
                    Anti-Fraud Engine & Withdrawal Guard
                  </h4>
                  <button
                    onClick={handleSaveConfig}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Security Rules</span>
                  </button>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="font-bold text-slate-800">Auto Anti-Fraud Inspection</h5>
                      <p className="text-[10px] text-slate-400">Flags multi-accounting, fake OTPs, and rapid bot scripts</p>
                    </div>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={config.antiFraudEnabled}
                        onChange={(e) => setConfig({ ...config, antiFraudEnabled: e.target.checked })}
                        className="w-4 h-4 rounded text-blue-600 accent-blue-600"
                      />
                      <span className="font-bold text-slate-700">Enforced</span>
                    </label>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-200/80 pt-3">
                    <div>
                      <h5 className="font-bold text-slate-800">Minimum Instant Withdrawal Cap (INR ₹)</h5>
                      <p className="text-[10px] text-slate-400">Lower boundary before user can trigger UPI transfer</p>
                    </div>
                    <input
                      type="number"
                      value={config.minWithdrawalInr}
                      onChange={(e) => setConfig({ ...config, minWithdrawalInr: Number(e.target.value) })}
                      className="w-24 px-3 py-1.5 rounded-xl bg-white border border-slate-200 font-bold text-right text-slate-900"
                    />
                  </div>
                </div>

                {/* Reset system */}
                <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-between">
                  <div>
                    <h5 className="font-bold text-rose-900">Reset Factory Defaults</h5>
                    <p className="text-[10px] text-rose-600">Reverts all reward rates, support channels and offerwalls</p>
                  </div>
                  <button
                    onClick={handleResetToDefaults}
                    className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Footer Bar */}
          <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs font-bold shrink-0">
            <span className="text-slate-400 text-[11px]">EarnX Cloud Storage v2.4 • Active</span>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 cursor-pointer"
            >
              Close Console
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
