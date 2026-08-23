import React, { useState } from 'react';
import { 
  Wallet, 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ArrowUpRight, 
  Building, 
  Smartphone, 
  CreditCard,
  QrCode,
  Copy,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  DollarSign,
  AlertTriangle
} from 'lucide-react';
import { WithdrawalTransaction } from '../WithdrawalScreen';
import { useAdminTheme } from './AdminThemeContext';

interface AdminWithdrawalsTabProps {
  withdrawals: (WithdrawalTransaction & { userPhone: string; userName: string })[];
  onUpdateStatus?: (id: string, newStatus: 'success' | 'failed' | 'processing', note?: string) => void;
  onUpdateWithdrawals?: (list: (WithdrawalTransaction & { userPhone: string; userName: string })[]) => void;
  showToast?: (msg: string) => void;
}

export const AdminWithdrawalsTab: React.FC<AdminWithdrawalsTabProps> = ({
  withdrawals = [],
  onUpdateStatus,
  onUpdateWithdrawals,
  showToast
}) => {
  const { isDark } = useAdminTheme();
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTx, setSelectedTx] = useState<(WithdrawalTransaction & { userPhone: string; userName: string }) | null>(null);
  const [customNote, setCustomNote] = useState('');
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // KPI Calculations
  const pendingList = withdrawals.filter(w => w.status === 'processing');
  const pendingCount = pendingList.length;
  const pendingAmount = pendingList.reduce((acc, w) => acc + (w.amountInr || 0), 0);

  const successList = withdrawals.filter(w => w.status === 'success');
  const successCount = successList.length;
  const successAmount = successList.reduce((acc, w) => acc + (w.amountInr || 0), 0);

  const failedList = withdrawals.filter(w => w.status === 'failed');
  const failedCount = failedList.length;
  const failedAmount = failedList.reduce((acc, w) => acc + (w.amountInr || 0), 0);

  const totalWithdrawalVolume = withdrawals.reduce((acc, w) => acc + (w.amountInr || 0), 0);

  const filtered = withdrawals.filter((w) => {
    const matchesSearch = 
      (w.userName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (w.userPhone && w.userPhone.includes(searchQuery)) ||
      (w.details && w.details.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (w.id && w.id.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStatus = filterStatus === 'all' || w.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleOpenDetail = (tx: (WithdrawalTransaction & { userPhone: string; userName: string })) => {
    setSelectedTx(tx);
    setCustomNote(`UTR / Reference: TXN-${Math.floor(10000000 + Math.random() * 90000000)}`);
    setIsDetailModalOpen(true);
  };

  const handleAction = (status: 'success' | 'failed') => {
    if (!selectedTx) return;
    if (onUpdateStatus) {
      onUpdateStatus(selectedTx.id, status, customNote);
    } else if (onUpdateWithdrawals) {
      const updated = withdrawals.map(w => w.id === selectedTx.id ? { ...w, status } : w);
      onUpdateWithdrawals(updated);
    }
    if (showToast) {
      showToast(status === 'success' ? '✅ Withdrawal approved and marked paid.' : '❌ Withdrawal request rejected.');
    }
    setIsDetailModalOpen(false);
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'upi': return <Smartphone className="w-4 h-4 text-indigo-400" />;
      case 'bank': return <Building className="w-4 h-4 text-emerald-400" />;
      case 'qr': return <QrCode className="w-4 h-4 text-purple-400" />;
      default: return <CreditCard className="w-4 h-4 text-amber-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Card 1: Total Withdrawal */}
        <div className={`p-4 rounded-3xl border transition-all ${
          isDark ? 'bg-[#1E293B] border-slate-800' : 'bg-white border-slate-200/90 shadow-xs'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Total Withdrawal</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'} font-mono`}>
              ₹ {totalWithdrawalVolume.toLocaleString('en-IN')}
            </span>
            <span className="text-xs text-slate-400 font-bold font-mono">({withdrawals.length} req)</span>
          </div>
          <span className="text-[10px] text-indigo-400 font-medium mt-1 block">Total lifetime withdrawal volume</span>
        </div>

        {/* Card 2: Pending Withdrawal */}
        <div className={`p-4 rounded-3xl border transition-all ${
          isDark ? 'bg-[#1E293B] border-slate-800' : 'bg-white border-slate-200/90 shadow-xs'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Pending Withdrawal</span>
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
              pendingCount > 0 ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-500/10 text-slate-400'
            }`}>
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className={`text-2xl font-black ${pendingCount > 0 ? 'text-amber-400' : isDark ? 'text-white' : 'text-slate-900'}`}>
              ₹ {pendingAmount.toLocaleString('en-IN')}
            </span>
            <span className="text-xs text-slate-400 font-bold font-mono">({pendingCount} req)</span>
          </div>
          <span className={`text-[10px] font-bold mt-1 block ${pendingCount > 0 ? 'text-amber-400 animate-pulse' : 'text-slate-400'}`}>
            {pendingCount > 0 ? '⚡ Action Required (Awaiting Transfer)' : 'All withdrawals processed'}
          </span>
        </div>

        {/* Card 3: Approve Withdrawal */}
        <div className={`p-4 rounded-3xl border transition-all ${
          isDark ? 'bg-[#1E293B] border-slate-800' : 'bg-white border-slate-200/90 shadow-xs'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Approve Withdrawal</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-500 font-mono">
              ₹ {successAmount.toLocaleString('en-IN')}
            </span>
            <span className="text-xs text-slate-400 font-bold font-mono">({successCount} paid)</span>
          </div>
          <span className="text-[10px] text-emerald-500 font-medium mt-1 block">● 100% Verified UPI/Bank settlements</span>
        </div>

        {/* Card 4: Reject Withdrawal */}
        <div className={`p-4 rounded-3xl border transition-all ${
          isDark ? 'bg-[#1E293B] border-slate-800' : 'bg-white border-slate-200/90 shadow-xs'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Reject Withdrawal</span>
            <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'} font-mono`}>
              ₹ {failedAmount.toLocaleString('en-IN')}
            </span>
            <span className="text-xs text-slate-400 font-bold font-mono">({failedCount} rejected)</span>
          </div>
          <span className="text-[10px] text-rose-400 font-medium mt-1 block">Blocked or invalid credentials</span>
        </div>
      </div>

      {/* Header & Controls */}
      <div className={`p-5 rounded-3xl border space-y-4 ${
        isDark ? 'bg-[#1E293B] border-slate-800' : 'bg-white border-slate-200/90'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className={`text-base font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Withdrawals & Cashout Processing
            </h3>
            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Review withdrawal requests, approve UPI/Bank transfers, or reject fraudulent cashouts
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              {pendingCount} Pending Withdrawals
            </span>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
            <input
              id="input-admin-search-withdrawals"
              type="text"
              placeholder="Search by transaction ID, user name, UPI ID, or account number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-10 pr-4 py-2.5 rounded-2xl text-xs font-medium border focus:outline-hidden transition-all ${
                isDark 
                  ? 'bg-slate-900 border-slate-700 text-white placeholder-slate-500 focus:border-indigo-500' 
                  : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-indigo-500'
              }`}
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className={`w-4 h-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
            <select
              id="select-admin-withdrawal-status"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className={`px-3 py-2.5 rounded-2xl text-xs font-bold border focus:outline-hidden cursor-pointer ${
                isDark 
                  ? 'bg-slate-900 border-slate-700 text-white' 
                  : 'bg-slate-50 border-slate-200 text-slate-800'
              }`}
            >
              <option value="all">All Statuses</option>
              <option value="processing">Pending / Processing</option>
              <option value="success">Approved & Success</option>
              <option value="failed">Rejected / Failed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Withdrawals Table */}
      <div className={`rounded-3xl border overflow-hidden shadow-xs ${
        isDark ? 'bg-[#1E293B] border-slate-800' : 'bg-white border-slate-200/90'
      }`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className={`border-b uppercase tracking-wider font-extrabold text-[10px] ${
              isDark ? 'bg-slate-900/80 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-500'
            }`}>
              <tr>
                <th className="py-3.5 px-4">Tx ID & Date</th>
                <th className="py-3.5 px-4">User</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Withdrawal Method & Details</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDark ? 'divide-slate-800' : 'divide-slate-100'}`}>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No withdrawal requests found.
                  </td>
                </tr>
              ) : (
                filtered.map((w) => (
                  <tr key={w.id} className={`transition-colors ${isDark ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50/80'}`}>
                    {/* Tx ID & Date */}
                    <td className="py-3.5 px-4">
                      <div className="font-mono text-xs font-bold text-indigo-400">
                        {w.id}
                      </div>
                      <div className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        {w.date}
                      </div>
                    </td>

                    {/* User */}
                    <td className="py-3.5 px-4">
                      <div className={`font-black text-xs ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {w.userName || 'User'}
                      </div>
                      <div className={`text-[11px] font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        +91 {w.userPhone}
                      </div>
                    </td>

                    {/* Amount */}
                    <td className="py-3.5 px-4">
                      <div className="text-sm font-black text-emerald-500 font-mono">
                        ₹ {w.amountInr}
                      </div>
                      <div className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                        0% Fee
                      </div>
                    </td>

                    {/* Method Details */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        {getMethodIcon(w.method)}
                        <span className={`font-black text-xs uppercase ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                          {w.method}
                        </span>
                      </div>
                      <div className={`text-[11px] font-mono truncate max-w-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        {w.details}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1 text-[10px] font-extrabold px-2.5 py-1 rounded-full ${
                        w.status === 'success'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : w.status === 'failed'
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}>
                        {w.status === 'success' && <CheckCircle2 className="w-3 h-3" />}
                        {w.status === 'failed' && <XCircle className="w-3 h-3" />}
                        {w.status === 'processing' && <Clock className="w-3 h-3 animate-spin" />}
                        <span className="capitalize">{w.status}</span>
                      </span>
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-4 text-right">
                      {w.status === 'processing' ? (
                        <button
                          id={`btn-review-withdrawal-${w.id}`}
                          onClick={() => handleOpenDetail(w)}
                          className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-primary hover:opacity-95 text-white text-xs font-black shadow-md cursor-pointer transition-all"
                        >
                          Review & Pay
                        </button>
                      ) : (
                        <button
                          onClick={() => handleOpenDetail(w)}
                          className={`text-xs font-bold hover:underline cursor-pointer ${
                            isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'
                          }`}
                        >
                          View Receipt
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review / Process Withdrawal Modal */}
      {isDetailModalOpen && selectedTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className={`w-full max-w-md p-6 rounded-3xl border shadow-2xl space-y-5 ${
            isDark ? 'bg-[#1E293B] border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
                  <Wallet className="w-5 h-5" />
                </div>
                <h3 className="font-black text-sm">Withdrawal Approval Details</h3>
              </div>
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Withdrawal Summary Box */}
            <div className={`p-4 rounded-2xl ${isDark ? 'bg-slate-900' : 'bg-slate-50'} space-y-3`}>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Withdrawal Amount</span>
                <span className="text-xl font-black text-emerald-500 font-mono">₹ {selectedTx.amountInr}.00</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Beneficiary User</span>
                <span className="text-xs font-bold">{selectedTx.userName} (+91 {selectedTx.userPhone})</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Transfer Method</span>
                <span className="text-xs font-black uppercase text-indigo-400">{selectedTx.method}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Target Address</span>
                <span className="text-xs font-mono font-bold">{selectedTx.details}</span>
              </div>
              {selectedTx.qrImageUrl && (
                <div className="space-y-1.5 pt-1 border-t border-slate-200/40 dark:border-slate-700/50">
                  <span className="text-xs text-slate-400 block">Uploaded QR Code Screenshot:</span>
                  <div className="w-36 h-36 mx-auto rounded-2xl bg-white p-2 border border-slate-200 shadow-sm flex items-center justify-center">
                    <img src={selectedTx.qrImageUrl} alt="QR Code" className="w-full h-full object-contain" />
                  </div>
                  <p className="text-[10px] text-center text-slate-400">Scan with any UPI app to pay</p>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Transaction ID</span>
                <span className="text-xs font-mono text-slate-400">{selectedTx.id}</span>
              </div>
            </div>

            {/* Reference / UTR Note */}
            <div className="space-y-2 text-left">
              <label className="text-xs font-bold text-slate-400">Bank Transfer / UPI UTR Reference Note</label>
              <input
                id="input-admin-utr-note"
                type="text"
                value={customNote}
                onChange={(e) => setCustomNote(e.target.value)}
                placeholder="e.g. UPI Ref: 394829103948 or Cheque No."
                className={`w-full px-4 py-2.5 rounded-2xl text-xs font-mono border focus:outline-hidden ${
                  isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}
              />
            </div>

            {/* Actions: Approve vs Reject */}
            {selectedTx.status === 'processing' ? (
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  id="btn-admin-approve-withdrawal"
                  onClick={() => handleAction('success')}
                  className="py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Approve & Mark Paid</span>
                </button>
                <button
                  id="btn-admin-reject-withdrawal"
                  onClick={() => handleAction('failed')}
                  className="py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-black flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Reject Withdrawal</span>
                </button>
              </div>
            ) : (
              <div className="text-center py-2">
                <span className="text-xs font-bold text-slate-400">
                  This transaction is marked as <span className="font-extrabold uppercase text-white">{selectedTx.status}</span>.
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
