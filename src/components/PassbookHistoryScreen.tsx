import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  Wallet, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Filter, 
  Search, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Calendar, 
  Receipt, 
  Copy, 
  Share2, 
  Sparkles, 
  ShieldCheck, 
  Coins, 
  Zap, 
  Users, 
  Download,
  Building2,
  Smartphone,
  Gift
} from 'lucide-react';
import { PassbookEntry, getUserPassbook } from '../utils/passbookStorage';

interface PassbookHistoryScreenProps {
  userPhone: string;
  balance: number;
  onBack: () => void;
  showToast: (msg: string) => void;
}

export const PassbookHistoryScreen: React.FC<PassbookHistoryScreenProps> = ({
  userPhone,
  balance,
  onBack,
  showToast
}) => {
  const [passbookList] = useState<PassbookEntry[]>(() => getUserPassbook(userPhone, balance));
  const [filterType, setFilterType] = useState<'all' | 'credit' | 'debit' | 'withdrawal'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReceipt, setSelectedReceipt] = useState<PassbookEntry | null>(null);

  // Calculations
  const totalCredits = passbookList
    .filter(item => item.type === 'credit' && item.status === 'completed')
    .reduce((sum, item) => sum + item.amount, 0);

  const totalDebits = passbookList
    .filter(item => item.type === 'debit' && item.status === 'completed')
    .reduce((sum, item) => sum + item.amount, 0);

  // Filtered List
  const filteredList = passbookList.filter(item => {
    if (filterType === 'credit' && item.type !== 'credit') return false;
    if (filterType === 'debit' && item.type !== 'debit') return false;
    if (filterType === 'withdrawal' && item.category !== 'withdrawal') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchRef = item.refId.toLowerCase().includes(q);
      const matchCat = item.category.toLowerCase().includes(q);
      return matchTitle || matchRef || matchCat;
    }
    return true;
  });

  const getCategoryIcon = (category: PassbookEntry['category']) => {
    switch (category) {
      case 'daily_checkin':
        return <Calendar className="w-4 h-4 text-amber-500" />;
      case 'task':
        return <Zap className="w-4 h-4 text-[#4B63FF]" />;
      case 'referral':
        return <Users className="w-4 h-4 text-emerald-500" />;
      case 'withdrawal':
        return <Building2 className="w-4 h-4 text-rose-500" />;
      case 'offerwall':
        return <Smartphone className="w-4 h-4 text-purple-500" />;
      case 'bonus':
        return <Gift className="w-4 h-4 text-indigo-500" />;
      default:
        return <Coins className="w-4 h-4 text-amber-500" />;
    }
  };

  const copyRefId = (text: string) => {
    navigator.clipboard?.writeText(text);
    showToast(`📋 Copied Ref ID: ${text}`);
  };

  return (
    <div id="passbook-history-view" className="w-full h-full flex flex-col bg-[#F8FAFC] text-slate-800 relative overflow-hidden text-left">
      {/* Top Header Bar (Matching Referral History & PIN Screen Style) */}
      <header className="shrink-0 px-4 py-3 border-b border-white/60 bg-white/80 backdrop-blur-xl z-40 flex items-center justify-between shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)]">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-2xl bg-white hover:bg-slate-100 text-slate-700 shadow-xs border border-slate-200/80 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h2 className="text-base font-black text-slate-900 tracking-tight font-outfit">
              Wallet Passbook & Ledger
            </h2>
            <p className="text-[10px] text-slate-400 font-medium leading-none">
              Official transaction history & statement
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border bg-emerald-50 border-emerald-200 text-emerald-700 text-xs font-black">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Verified Ledger</span>
        </div>
      </header>

      {/* Scrollable Body */}
      <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4 text-left scrollbar-thin overscroll-contain">
        {/* Passbook Summary Master Card */}
        <div className="p-4 rounded-3xl bg-gradient-to-br from-[#4B63FF] via-[#3B54F5] to-[#2E42E2] text-white shadow-lg shadow-[#4B63FF]/20 space-y-3 relative overflow-hidden">
          <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                <Receipt className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-blue-100 uppercase tracking-wider block">
                  Current Wallet Balance
                </span>
                <div className="text-2xl font-black font-outfit tracking-tight flex items-baseline gap-1">
                  <span>₹{balance.toFixed(2)}</span>
                  <span className="text-xs text-blue-200 font-medium">({balance * 10} Coins)</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => showToast('📑 Statement copied & saved to clipboard!')}
              className="px-2.5 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/20 text-xs font-bold flex items-center gap-1 cursor-pointer transition-all active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Statement</span>
            </button>
          </div>

          {/* Credits vs Debits Summary */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/15">
            <div className="p-2.5 rounded-2xl bg-white/10 backdrop-blur-xs flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-xl bg-emerald-400/20 text-emerald-300 flex items-center justify-center shrink-0">
                <ArrowDownLeft className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] text-blue-100 block font-medium">Total Earned</span>
                <span className="text-sm font-extrabold text-emerald-300 font-outfit">+₹{totalCredits.toFixed(2)}</span>
              </div>
            </div>

            <div className="p-2.5 rounded-2xl bg-white/10 backdrop-blur-xs flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-xl bg-rose-400/20 text-rose-200 flex items-center justify-center shrink-0">
                <ArrowUpRight className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] text-blue-100 block font-medium">Total Withdrawn</span>
                <span className="text-sm font-extrabold text-rose-200 font-outfit">-₹{totalDebits.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Search & Filter Controls */}
        <div className="space-y-2.5">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by task, ref ID, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-slate-200/80 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#4B63FF] shadow-xs"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex gap-1.5 overflow-x-auto scrollbar-none pb-1">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                filterType === 'all'
                  ? 'bg-[#4B63FF] text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/60'
              }`}
            >
              All ({passbookList.length})
            </button>
            <button
              onClick={() => setFilterType('credit')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1 ${
                filterType === 'credit'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white text-emerald-700 hover:bg-emerald-50 border border-slate-200/60'
              }`}
            >
              <ArrowDownLeft className="w-3.5 h-3.5" />
              <span>Inflows (Credits)</span>
            </button>
            <button
              onClick={() => setFilterType('debit')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1 ${
                filterType === 'debit'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-white text-rose-700 hover:bg-rose-50 border border-slate-200/60'
              }`}
            >
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>Outflows (Debits)</span>
            </button>
            <button
              onClick={() => setFilterType('withdrawal')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1 ${
                filterType === 'withdrawal'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white text-indigo-700 hover:bg-indigo-50 border border-slate-200/60'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Cashouts</span>
            </button>
          </div>
        </div>

        {/* Transactions List */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
              Transaction History
            </span>
            <span className="text-[11px] text-slate-400 font-semibold">
              Showing {filteredList.length} items
            </span>
          </div>

          {filteredList.length === 0 ? (
            <div className="p-8 rounded-3xl bg-white border border-slate-200/80 text-center space-y-2 shadow-xs">
              <Receipt className="w-10 h-10 text-slate-300 mx-auto" />
              <h4 className="text-sm font-black text-slate-700">No Transactions Found</h4>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                No ledger entries match your current search or filter criteria.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredList.map((item) => {
                const isCredit = item.type === 'credit';
                return (
                  <motion.div
                    key={item.id}
                    layout
                    onClick={() => setSelectedReceipt(item)}
                    className="p-3.5 rounded-2xl bg-white border border-slate-200/80 hover:border-[#4B63FF]/50 shadow-xs hover:shadow-sm transition-all flex items-center justify-between gap-3 cursor-pointer group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Icon */}
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        isCredit 
                          ? 'bg-emerald-50 border border-emerald-200/60 text-emerald-600' 
                          : 'bg-rose-50 border border-rose-200/60 text-rose-600'
                      }`}>
                        {getCategoryIcon(item.category)}
                      </div>

                      {/* Details */}
                      <div className="min-w-0">
                        <h4 className="text-xs font-black text-slate-900 truncate group-hover:text-[#4B63FF] transition-colors">
                          {item.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] text-slate-400 font-medium">
                            {item.date} • {item.time}
                          </span>
                          <span className="text-[9.5px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.2 rounded">
                            {item.refId.slice(0, 14)}...
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Amount & Status */}
                    <div className="text-right shrink-0">
                      <span className={`text-sm font-black font-outfit block ${
                        isCredit ? 'text-emerald-600' : 'text-slate-800'
                      }`}>
                        {isCredit ? '+' : '-'}₹{item.amount.toFixed(2)}
                      </span>
                      <div className="flex items-center justify-end gap-1 mt-0.5">
                        <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5">
                          <CheckCircle2 className="w-2.5 h-2.5" />
                          Success
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Digital Receipt Modal */}
      <AnimatePresence>
        {selectedReceipt && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-4"
            onClick={() => setSelectedReceipt(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm bg-white rounded-3xl p-5 space-y-4 shadow-2xl text-left border border-slate-200"
            >
              {/* Receipt Top Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#4B63FF] flex items-center justify-center">
                    <Receipt className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-black text-slate-900 uppercase">Transaction Receipt</h3>
                    <p className="text-[10px] text-slate-400">EarnX Official Ledger Audit</p>
                  </div>
                </div>

                <div className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10.5px] font-extrabold border border-emerald-200 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>Success</span>
                </div>
              </div>

              {/* Amount Badge */}
              <div className="text-center py-2 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  {selectedReceipt.type === 'credit' ? 'Credited to Wallet' : 'Debited from Wallet'}
                </span>
                <span className={`text-2xl font-black font-outfit ${
                  selectedReceipt.type === 'credit' ? 'text-emerald-600' : 'text-slate-900'
                }`}>
                  {selectedReceipt.type === 'credit' ? '+' : '-'}₹{selectedReceipt.amount.toFixed(2)}
                </span>
                <span className="text-xs text-slate-500 font-semibold block mt-0.5">
                  {selectedReceipt.title}
                </span>
              </div>

              {/* Details Key-Value List */}
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-400">Reference ID:</span>
                  <div className="flex items-center gap-1">
                    <span className="font-mono font-bold text-slate-800 text-[11px]">{selectedReceipt.refId}</span>
                    <button 
                      onClick={() => copyRefId(selectedReceipt.refId)}
                      className="p-1 hover:bg-slate-100 rounded text-slate-500 cursor-pointer"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-400">Date & Time:</span>
                  <span className="font-bold text-slate-800">{selectedReceipt.date} • {selectedReceipt.time}</span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-400">Category:</span>
                  <span className="font-bold text-[#4B63FF] capitalize">{selectedReceipt.category.replace('_', ' ')}</span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-400">Closing Balance:</span>
                  <span className="font-extrabold text-slate-800">₹{selectedReceipt.balanceAfter.toFixed(2)}</span>
                </div>

                {selectedReceipt.subtitle && (
                  <div className="p-2.5 rounded-xl bg-blue-50/60 border border-blue-100/80 text-[11px] text-blue-900">
                    <span className="font-bold block">Transaction Note:</span>
                    <span>{selectedReceipt.subtitle}</span>
                  </div>
                )}
              </div>

              {/* Close Action */}
              <button
                onClick={() => setSelectedReceipt(null)}
                className="w-full py-3 rounded-2xl bg-[#4B63FF] text-white font-extrabold text-xs uppercase tracking-wider hover:bg-[#3549EC] transition-all cursor-pointer shadow-md shadow-[#4B63FF]/30"
              >
                Close Receipt
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
