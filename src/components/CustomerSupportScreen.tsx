import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  MessageSquare, 
  Send, 
  ChevronDown, 
  ChevronUp, 
  Mail, 
  ExternalLink,
  Plus,
  LifeBuoy,
  MessageCircle,
  HelpCircle
} from 'lucide-react';
import { 
  getAdminTickets, 
  saveAdminTickets, 
  getAppConfig, 
  SupportTicket 
} from '../utils/adminStorage';
import { PersonalDetails } from './PersonalDetailsScreen';

interface CustomerSupportScreenProps {
  userPhone: string;
  userDetails: PersonalDetails | null;
  onClose: () => void;
  showToast: (msg: string) => void;
}

export const CustomerSupportScreen: React.FC<CustomerSupportScreenProps> = ({
  userPhone,
  userDetails,
  onClose,
  showToast
}) => {
  const appConfig = getAppConfig();
  const [tickets, setTickets] = useState<SupportTicket[]>(() => getAdminTickets());
  const [activeTab, setActiveTab] = useState<'channels' | 'tickets' | 'faq'>('channels');

  // New Ticket State
  const [showNewTicketModal, setShowNewTicketModal] = useState(false);
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState<SupportTicket['category']>('withdrawal');
  const [message, setMessage] = useState('');

  // Selected Ticket for Chat
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  // FAQ Accordion State
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // User Tickets (filtered for current user or demo fallback)
  const userTickets = tickets.filter(
    t => t.userPhone.includes(userPhone) || t.userId === `u-${userPhone.slice(-4)}` || t.userName.toLowerCase() === (userDetails?.fullName || 'rahul sharma').toLowerCase()
  );

  const selectedTicket = tickets.find(t => t.id === selectedTicketId);

  // WhatsApp click handler
  const handleOpenWhatsApp = () => {
    const rawNumber = appConfig.supportWhatsApp || '+919876543210';
    const cleanNumber = rawNumber.replace(/[^0-9]/g, '');
    const text = encodeURIComponent(
      `Hello EarnX Support Team! 👋\nI need assistance regarding my EarnX account.\n📱 Registered Mobile: +91 ${userPhone}\n👤 Name: ${userDetails?.fullName || 'User'}\n\nPlease help me.`
    );
    window.open(`https://wa.me/${cleanNumber}?text=${text}`, '_blank');
  };

  // Telegram click handler
  const handleOpenTelegram = () => {
    const tgHandle = (appConfig.supportTelegram || '@EarnXSupportOfficial').replace('@', '');
    window.open(`https://t.me/${tgHandle}`, '_blank');
  };

  // Email click handler
  const handleOpenEmail = () => {
    const email = appConfig.supportEmail || 'earnxofficials@gmail.com';
    const sub = encodeURIComponent(`EarnX Support Request - ${userPhone}`);
    window.open(`mailto:${email}?subject=${sub}`, '_blank');
  };

  // Create Ticket
  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) {
      showToast('⚠️ Please enter subject and describe your issue.');
      return;
    }

    const newTicket: SupportTicket = {
      id: `TCK-${Math.floor(100 + Math.random() * 900)}`,
      userId: `u-${userPhone.slice(-4)}`,
      userName: userDetails?.fullName || 'Rahul Sharma',
      userPhone: `+91 ${userPhone}`,
      subject: subject.trim(),
      category,
      status: 'open',
      priority: 'high',
      createdAt: 'Just now',
      messages: [
        {
          id: `msg-${Date.now()}`,
          sender: 'user',
          text: message.trim(),
          timestamp: 'Just now'
        }
      ]
    };

    const updated = [newTicket, ...tickets];
    setTickets(updated);
    saveAdminTickets(updated);
    showToast('🎉 Support ticket created! Our team will respond shortly.');
    setSubject('');
    setMessage('');
    setShowNewTicketModal(false);
    setActiveTab('tickets');
    setSelectedTicketId(newTicket.id);
  };

  // Reply to selected ticket
  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedTicket) return;

    const newMsg = {
      id: `msg-${Date.now()}`,
      sender: 'user' as const,
      text: replyText.trim(),
      timestamp: 'Just now'
    };

    const updated = tickets.map(t => {
      if (t.id === selectedTicket.id) {
        return {
          ...t,
          status: 'open' as const,
          messages: [...t.messages, newMsg]
        };
      }
      return t;
    });

    setTickets(updated);
    saveAdminTickets(updated);
    setReplyText('');
    showToast('💬 Message sent to support team.');
  };

  const faqs = [
    {
      q: "When will my UPI or Bank withdrawal be processed?",
      a: "Withdrawals are automated and typically reach your UPI account within 60 seconds. During peak hours or banking maintenance, it may take up to 2-4 hours."
    },
    {
      q: "My task reward is not credited, what should I do?",
      a: "Please ensure you followed all task instructions (e.g. app registration, OTP verification). If you submitted a screenshot proof, our verification team approves proofs within 30 minutes."
    },
    {
      q: "How does the Refer & Earn bonus work?",
      a: `When a friend downloads EarnX with your code and verifies their number, you receive ₹${appConfig.referralBonusInviter || 20} bonus cash, and your friend gets ₹${appConfig.referralBonusInvitee || 10} signup cash instantly.`
    },
    {
      q: "Is there any fee or charge on cashout?",
      a: "No! EarnX charges 0% transaction fee on all UPI, IMPS Bank transfers, and mobile recharges."
    },
    {
      q: "Can I use multiple accounts on the same phone?",
      a: "No. EarnX has strict automated anti-fraud security. Creating multiple accounts or using VPNs will trigger automated withdrawal locks."
    }
  ];

  return (
    <div className="w-full h-full flex flex-col bg-[#F8FAFC] text-slate-800 overflow-hidden relative">
      {/* Top Header */}
      <div className="shrink-0 bg-white border-b border-slate-200/80 px-4 py-3.5 flex items-center justify-between shadow-xs z-20">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-base font-black text-slate-900 leading-none">Customer Support</h1>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[11px] font-bold text-emerald-600">24x7 Help Desk Online</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => setShowNewTicketModal(true)}
          className="px-3.5 py-2 rounded-xl bg-[#4B63FF] hover:bg-[#3549EC] text-white text-xs font-black flex items-center gap-1.5 shadow-md shadow-[#4B63FF]/20 cursor-pointer transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Query</span>
        </button>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="shrink-0 bg-white border-b border-slate-200/80 px-4 py-2 flex items-center gap-2">
        <button
          onClick={() => setActiveTab('channels')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'channels' 
              ? 'bg-blue-50 text-[#3549EC] font-black' 
              : 'text-slate-500 hover:bg-slate-50'
          }`}
        >
          Direct Help
        </button>
        <button
          onClick={() => setActiveTab('tickets')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer relative ${
            activeTab === 'tickets' 
              ? 'bg-blue-50 text-[#3549EC] font-black' 
              : 'text-slate-500 hover:bg-slate-50'
          }`}
        >
          <span>My Tickets</span>
          {userTickets.length > 0 && (
            <span className="ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] font-black bg-blue-600 text-white">
              {userTickets.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('faq')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'faq' 
              ? 'bg-blue-50 text-[#3549EC] font-black' 
              : 'text-slate-500 hover:bg-slate-50'
          }`}
        >
          FAQ
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* ================= TAB 1: DIRECT CHANNELS ================= */}
        {activeTab === 'channels' && (
          <div className="space-y-4">
            {/* WhatsApp Priority Card */}
            {(appConfig.isWhatsAppSupportEnabled ?? true) && (
              <motion.div 
                whileHover={{ scale: 1.01 }}
                onClick={handleOpenWhatsApp}
                className="p-4 rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/20 cursor-pointer relative overflow-hidden"
              >
                <div className="absolute right-0 top-0 translate-x-3 -translate-y-3 opacity-20">
                  <MessageCircle className="w-32 h-32" />
                </div>
                <div className="relative z-10 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-[10px] font-black uppercase tracking-wider">
                      ⚡ Fastest Response (1-2 Mins)
                    </span>
                    <ExternalLink className="w-4 h-4 opacity-80" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black leading-tight">Chat on WhatsApp</h3>
                    <p className="text-xs text-emerald-100 mt-0.5">
                      Direct 1-on-1 human support for withdrawals, bonuses & queries
                    </p>
                  </div>
                  <div className="pt-1">
                    <button className="px-4 py-2 rounded-xl bg-white text-emerald-700 font-extrabold text-xs shadow-md flex items-center gap-2">
                      <MessageCircle className="w-4 h-4 text-emerald-600" />
                      <span>Start WhatsApp Chat</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Telegram & Email Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Telegram Card */}
              <div 
                onClick={handleOpenTelegram}
                className="p-4 rounded-3xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition-all cursor-pointer space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-2xl bg-sky-50 text-sky-500 group-hover:bg-sky-500 group-hover:text-white transition-colors">
                    <Send className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold text-sky-600 bg-sky-50 px-2 py-0.5 rounded-md">
                    Telegram Bot
                  </span>
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-slate-900">Official Telegram Channel</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">Daily promo codes, giveaways & payment proofs</p>
                </div>
                <div className="text-xs font-bold text-sky-600 pt-1 flex items-center gap-1">
                  <span>{appConfig.supportTelegram || '@EarnXSupportOfficial'}</span>
                  <ExternalLink className="w-3 h-3" />
                </div>
              </div>

              {/* Email Card */}
              <div 
                onClick={handleOpenEmail}
                className="p-4 rounded-3xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition-all cursor-pointer space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-2xl bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    <Mail className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                    Email Desk
                  </span>
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-slate-900">Email Customer Service</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">Account recovery, partnership & business inquiries</p>
                </div>
                <div className="text-xs font-bold text-indigo-600 pt-1 flex items-center gap-1">
                  <span className="truncate">{appConfig.supportEmail || 'earnxofficials@gmail.com'}</span>
                  <ExternalLink className="w-3 h-3 shrink-0" />
                </div>
              </div>
            </div>

            {/* Quick Raise Ticket CTA */}
            <div className="p-4 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-50 text-amber-500">
                  <LifeBuoy className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-slate-900">Need specific help with a transaction?</h4>
                  <p className="text-[11px] text-slate-500">Raise an in-app ticket with subject and details</p>
                </div>
              </div>
              <button
                onClick={() => setShowNewTicketModal(true)}
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-black flex items-center justify-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4 text-amber-400" />
                <span>Create In-App Support Ticket</span>
              </button>
            </div>
          </div>
        )}

        {/* ================= TAB 2: MY TICKETS & CHAT ================= */}
        {activeTab === 'tickets' && (
          <div className="space-y-4">
            {selectedTicket ? (
              /* Chat Thread View */
              <div className="rounded-3xl bg-white border border-slate-200/90 shadow-sm flex flex-col h-[520px] overflow-hidden">
                {/* Chat Header */}
                <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedTicketId(null)}
                      className="p-1 rounded-lg hover:bg-slate-200 text-slate-600 cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-mono font-bold bg-slate-200 px-1.5 py-0.2 rounded text-slate-700">
                          {selectedTicket.id}
                        </span>
                        <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase ${
                          selectedTicket.status === 'open' 
                            ? 'bg-rose-100 text-rose-700' 
                            : selectedTicket.status === 'in_progress'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-emerald-100 text-emerald-700'
                        }`}>
                          {selectedTicket.status.replace('_', ' ')}
                        </span>
                      </div>
                      <h4 className="text-xs font-extrabold text-slate-900 line-clamp-1">{selectedTicket.subject}</h4>
                    </div>
                  </div>
                </div>

                {/* Messages List */}
                <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/50">
                  {selectedTicket.messages.map(msg => (
                    <div 
                      key={msg.id} 
                      className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                    >
                      <div className="flex items-center gap-1 text-[10px] text-slate-400 mb-0.5 px-1">
                        <span className="font-bold">{msg.sender === 'user' ? 'You' : '🛡️ EarnX Support Desk'}</span>
                        <span>•</span>
                        <span>{msg.timestamp}</span>
                      </div>
                      <div
                        className={`max-w-[85%] p-3 rounded-2xl text-xs font-medium leading-relaxed ${
                          msg.sender === 'user'
                            ? 'bg-[#4B63FF] text-white rounded-tr-none shadow-xs'
                            : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none shadow-xs'
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Reply Form */}
                <form onSubmit={handleSendReply} className="p-2.5 bg-white border-t border-slate-200 flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Type your message..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="flex-1 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-hidden focus:border-indigo-500"
                  />
                  <button
                    type="submit"
                    className="p-2.5 rounded-xl bg-[#4B63FF] hover:bg-[#3549EC] text-white cursor-pointer shadow-sm transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            ) : (
              /* Ticket List */
              <div className="space-y-3">
                {userTickets.length === 0 ? (
                  <div className="p-8 text-center bg-white rounded-3xl border border-slate-200/90 shadow-xs space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#4B63FF] mx-auto flex items-center justify-center">
                      <MessageSquare className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-sm font-extrabold text-slate-900">No support tickets yet</h4>
                      <p className="text-xs text-slate-500 mt-1">Have an issue? Click "New Query" above to start a ticket.</p>
                    </div>
                    <button
                      onClick={() => setShowNewTicketModal(true)}
                      className="px-4 py-2 rounded-xl bg-[#4B63FF] text-white font-bold text-xs shadow-md inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Create First Ticket</span>
                    </button>
                  </div>
                ) : (
                  userTickets.map(ticket => (
                    <div
                      key={ticket.id}
                      onClick={() => setSelectedTicketId(ticket.id)}
                      className="p-4 rounded-3xl bg-white border border-slate-200/90 shadow-xs hover:border-[#4B63FF]/50 transition-all cursor-pointer space-y-2 text-left"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                            {ticket.id}
                          </span>
                          <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase ${
                            ticket.status === 'open' 
                              ? 'bg-rose-100 text-rose-700' 
                              : ticket.status === 'in_progress'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-emerald-100 text-emerald-700'
                          }`}>
                            {ticket.status.replace('_', ' ')}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-medium">{ticket.createdAt}</span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{ticket.subject}</h4>
                      <p className="text-[11px] text-slate-500 line-clamp-1">
                        {ticket.messages[ticket.messages.length - 1]?.text}
                      </p>
                      <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[11px] text-[#4B63FF] font-bold">
                        <span>{ticket.messages.length} messages</span>
                        <span>Open Chat →</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 3: FAQ ================= */}
        {activeTab === 'faq' && (
          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div 
                  key={index}
                  className="rounded-2xl bg-white border border-slate-200/90 shadow-xs overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="w-full p-4 flex items-center justify-between text-left cursor-pointer hover:bg-slate-50/60 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <HelpCircle className="w-4 h-4 text-[#4B63FF] shrink-0" />
                      <span className="text-xs font-bold text-slate-800">{faq.q}</span>
                    </div>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/40">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* CREATE TICKET MODAL */}
      <AnimatePresence>
        {showNewTicketModal && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md bg-white rounded-3xl p-5 shadow-2xl space-y-4 border border-slate-200 text-left"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-blue-50 text-[#4B63FF]">
                    <LifeBuoy className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900">Create Support Ticket</h3>
                    <p className="text-[11px] text-slate-400">Our support staff usually replies in under 15 mins</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowNewTicketModal(false)}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateTicket} className="space-y-3 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Issue Category:</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as SupportTicket['category'])}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 font-medium text-slate-800 focus:outline-hidden focus:border-indigo-500"
                  >
                    <option value="withdrawal">💳 UPI / Bank Withdrawal Issue</option>
                    <option value="task_credit">🎁 Task Bonus / Coin Credit</option>
                    <option value="referral">👥 Referral & Invite Bonus</option>
                    <option value="account">🔒 Account & Security</option>
                    <option value="general">❓ Other General Question</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Subject / Title:</label>
                  <input
                    type="text"
                    placeholder="e.g. ₹100 UPI transfer pending for 20 mins"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Describe Your Problem:</label>
                  <textarea
                    rows={4}
                    placeholder="Please include transaction ID or app task name so we can verify and resolve quickly..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:border-indigo-500"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowNewTicketModal(false)}
                    className="px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-[#4B63FF] hover:bg-[#3549EC] text-white font-black shadow-md shadow-[#4B63FF]/20 cursor-pointer"
                  >
                    Submit Ticket
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
