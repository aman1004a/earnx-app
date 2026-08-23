import React, { useState } from 'react';
import { 
  Headphones, 
  Search, 
  MessageSquare, 
  CheckCircle2, 
  Clock, 
  Send, 
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { SupportTicket } from '../../utils/adminStorage';
import { useAdminTheme } from './AdminThemeContext';

interface AdminSupportTabProps {
  tickets: SupportTicket[];
  onUpdateTickets: (tickets: SupportTicket[]) => void;
  showToast: (msg: string) => void;
}

export const AdminSupportTab: React.FC<AdminSupportTabProps> = ({
  tickets = [],
  onUpdateTickets,
  showToast
}) => {
  const { isDark } = useAdminTheme();
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // KPI Calculations
  const openList = tickets.filter(t => t.status === 'open');
  const openCount = openList.length;
  const resolvedList = tickets.filter(t => t.status === 'resolved');
  const resolvedCount = resolvedList.length;
  const totalCount = tickets.length;
  const resolutionRate = totalCount > 0 ? Math.round((resolvedCount / totalCount) * 100) : 100;

  const filtered = tickets.filter(t => 
    (t.userPhone && t.userPhone.includes(searchQuery)) ||
    (t.subject && t.subject.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (t.category && t.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleSendReply = (markResolved: boolean = false) => {
    if (!selectedTicket || !replyMessage.trim()) return;

    const updated = tickets.map(t => {
      if (t.id === selectedTicket.id) {
        return {
          ...t,
          adminReply: replyMessage.trim(),
          status: (markResolved ? 'resolved' : 'open') as SupportTicket['status'],
          repliedAt: 'Just now'
        };
      }
      return t;
    });

    onUpdateTickets(updated);
    showToast(markResolved ? '  Ticket resolved & reply sent to user.' : '  Reply sent to user.');
    setReplyMessage('');
    setSelectedTicket(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Summary KPI Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Card 1: Open Tickets */}
        <div className={`p-4 rounded-3xl border transition-all ${
          isDark ? 'bg-[#1E293B] border-slate-800' : 'bg-white border-slate-200/90 shadow-xs'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Open Tickets</span>
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
              openCount > 0 ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-500/10 text-slate-400'
            }`}>
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className={`text-2xl font-black ${openCount > 0 ? 'text-amber-400' : isDark ? 'text-white' : 'text-slate-900'}`}>
              {openCount}
            </span>
            <span className="text-xs text-slate-400 font-bold">Unresolved</span>
          </div>
          <span className={`text-[10px] font-bold mt-1 block ${openCount > 0 ? 'text-amber-400 animate-pulse' : 'text-slate-400'}`}>
            {openCount > 0 ? '  Needs reply & investigation' : 'Zero pending queries'}
          </span>
        </div>

        {/* Card 2: Resolved Tickets */}
        <div className={`p-4 rounded-3xl border transition-all ${
          isDark ? 'bg-[#1E293B] border-slate-800' : 'bg-white border-slate-200/90 shadow-xs'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Resolved Tickets</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-500">
              {resolvedCount}
            </span>
            <span className="text-xs text-slate-400 font-bold">Closed</span>
          </div>
          <span className="text-[10px] text-emerald-500 font-medium mt-1 block">Successfully answered & solved</span>
        </div>

        {/* Card 3: Total Inquiries */}
        <div className={`p-4 rounded-3xl border transition-all ${
          isDark ? 'bg-[#1E293B] border-slate-800' : 'bg-white border-slate-200/90 shadow-xs'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Total Inquiries</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <Headphones className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {totalCount}
            </span>
            <span className="text-xs text-slate-400 font-bold">Tickets</span>
          </div>
          <span className="text-[10px] text-indigo-400 font-medium mt-1 block">All user queries & issues</span>
        </div>

        {/* Card 4: Resolution Rate */}
        <div className={`p-4 rounded-3xl border transition-all ${
          isDark ? 'bg-[#1E293B] border-slate-800' : 'bg-white border-slate-200/90 shadow-xs'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Resolution Rate</span>
            <div className="w-8 h-8 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className={`text-2xl font-black ${resolutionRate >= 80 ? 'text-emerald-500' : 'text-amber-400'}`}>
              {resolutionRate}%
            </span>
            <span className="text-xs text-slate-400 font-bold">Solved</span>
          </div>
          <span className="text-[10px] text-sky-400 font-medium mt-1 block">Avg. response turnaround &lt; 15m</span>
        </div>
      </div>

      {/* Header */}
      <div className={`p-5 rounded-3xl border space-y-4 ${
        isDark ? 'bg-[#1E293B] border-slate-800' : 'bg-white border-slate-200/90'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className={`text-base font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Help Desk & Ticket Management
            </h3>
            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Respond to user inquiries, payment queries, task verification issues and dispute resolutions
            </p>
          </div>
          <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 self-start sm:self-auto">
            {openCount} Open Support Tickets
          </span>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
          <input
            id="input-admin-search-support"
            type="text"
            placeholder="Search tickets by user phone or issue description..."
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

      {/* Tickets List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((ticket) => (
          <div
            key={ticket.id}
            className={`p-5 rounded-3xl border transition-all flex flex-col justify-between space-y-4 ${
              isDark ? 'bg-[#1E293B] border-slate-800' : 'bg-white border-slate-200/90 shadow-xs'
            }`}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${
                    isDark ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-50 text-indigo-700'
                  }`}>
                    {ticket.category}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                    ticket.status === 'open' 
                      ? 'bg-amber-500/20 text-amber-400' 
                      : 'bg-emerald-500/20 text-emerald-400'
                  }`}>
                    {ticket.status.toUpperCase()}
                  </span>
                </div>
                <span className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                  {ticket.createdAt}
                </span>
              </div>

              <div>
                <h4 className={`text-sm font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {ticket.subject}
                </h4>
                <div className={`text-[11px] font-mono mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  From: +91 {ticket.userPhone} ({ticket.userName})
                </div>
              </div>

              <p className={`text-xs p-3 rounded-2xl ${
                isDark ? 'bg-slate-900/80 text-slate-300' : 'bg-slate-50 text-slate-700'
              }`}>
                "{ticket.messages?.[0]?.text || ticket.subject}"
              </p>

              {(ticket as any).adminReply && (
                <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 space-y-1 text-xs">
                  <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block">
                    Admin Answer:
                  </span>
                  <p className={isDark ? 'text-slate-200' : 'text-slate-800'}>{(ticket as any).adminReply}</p>
                </div>
              )}
            </div>

            <div className="pt-2 flex items-center justify-end">
              <button
                id={`btn-reply-ticket-${ticket.id}`}
                onClick={() => setSelectedTicket(ticket)}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-primary hover:opacity-95 text-white text-xs font-black cursor-pointer shadow-md flex items-center gap-1.5"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>{(ticket as any).adminReply ? 'Update Reply' : 'Reply & Resolve'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Reply Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className={`w-full max-w-lg p-6 rounded-3xl border shadow-2xl space-y-4 ${
            isDark ? 'bg-[#1E293B] border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex items-center justify-between">
              <h3 className="font-black text-sm">Reply to User Ticket</h3>
              <button
                onClick={() => setSelectedTicket(null)}
                className="text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className={`p-3.5 rounded-2xl ${isDark ? 'bg-slate-900' : 'bg-slate-50'} space-y-1`}>
              <div className="text-xs font-black">{selectedTicket.subject}</div>
              <div className="text-[11px] text-slate-400">User: {selectedTicket.userName} (+91 {selectedTicket.userPhone})</div>
              <p className="text-xs text-slate-300 italic pt-1">"{selectedTicket.messages?.[0]?.text || selectedTicket.subject}"</p>
            </div>

            <div className="space-y-1 text-left">
              <label className="text-xs font-bold text-slate-400">Your Official Resolution / Reply Message</label>
              <textarea
                rows={4}
                required
                placeholder="Type your response to the user here..."
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                className={`w-full p-3 rounded-2xl text-xs border focus:outline-hidden ${
                  isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}
              />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => handleSendReply(false)}
                className={`py-3 rounded-2xl border font-black text-xs cursor-pointer ${
                  isDark ? 'border-slate-700 text-slate-200 hover:bg-slate-800' : 'border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                Send Reply (Keep Open)
              </button>
              <button
                id="btn-confirm-send-reply-resolve"
                onClick={() => handleSendReply(true)}
                className="py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-md cursor-pointer flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Send & Mark Resolved</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
