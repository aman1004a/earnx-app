import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  ShieldAlert, 
  ShieldCheck, 
  Wallet, 
  UserPlus, 
  Edit3, 
  PlusCircle, 
  MinusCircle, 
  Ban, 
  CheckCircle2,
  Calendar,
  Share2,
  ListOrdered,
  TrendingUp,
  DollarSign
} from 'lucide-react';
import { AdminUserRecord } from '../../utils/adminStorage';
import { useAdminTheme } from './AdminThemeContext';

interface AdminUsersTabProps {
  users: Record<string, AdminUserRecord>;
  onUpdateUsers: (users: Record<string, AdminUserRecord>) => void;
  showToast: (msg: string) => void;
}

export const AdminUsersTab: React.FC<AdminUsersTabProps> = ({
  users = {},
  onUpdateUsers,
  showToast
}) => {
  const { isDark } = useAdminTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'flagged' | 'suspended'>('all');

  // Selected user for Balance Adjustment Modal
  const [selectedUser, setSelectedUser] = useState<AdminUserRecord | null>(null);
  const [adjustAmount, setAdjustAmount] = useState('');
  const [adjustType, setAdjustType] = useState<'add' | 'deduct'>('add');
  const [adjustReason, setAdjustReason] = useState('Admin manual adjustment');

  const userList: AdminUserRecord[] = Object.values(users || {});

  // KPI Calculations
  const totalUsersCount = userList.length;
  const activeUsersCount = userList.filter(u => u.status === 'active').length;
  const totalWalletLiability = userList.reduce((acc, u) => acc + (u.walletBalance || 0), 0);
  const totalLifetimeEarned = userList.reduce((acc, u) => acc + (u.totalEarned || 0), 0);
  const suspendedOrFlaggedCount = userList.filter(u => u.status === 'suspended' || u.status === 'flagged').length;

  const filteredUsers = userList.filter(u => {
    const matchesSearch = 
      (u.fullName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.phone && u.phone.includes(searchTerm)) ||
      (u.email && u.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (u.referralCode && u.referralCode.toLowerCase().includes(searchTerm.toLowerCase()));
      
    const matchesStatus = filterStatus === 'all' || u.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleToggleStatus = (phone: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
    const updated = {
      ...users,
      [phone]: {
        ...users[phone],
        status: newStatus as 'active' | 'suspended'
      }
    };
    onUpdateUsers(updated);
    showToast(`User status updated to ${newStatus.toUpperCase()}`);
  };

  const handleApplyBalanceAdjustment = () => {
    if (!selectedUser) return;
    const amt = parseFloat(adjustAmount);
    if (isNaN(amt) || amt <= 0) {
      showToast('⚠️ Please enter a valid positive number');
      return;
    }

    const currentBal = selectedUser.walletBalance || 0;
    const newBal = adjustType === 'add' ? currentBal + amt : Math.max(0, currentBal - amt);
    const newEarned = adjustType === 'add' ? (selectedUser.totalEarned || 0) + amt : (selectedUser.totalEarned || 0);

    const updated = {
      ...users,
      [selectedUser.phone]: {
        ...selectedUser,
        walletBalance: newBal,
        totalEarned: newEarned
      }
    };

    onUpdateUsers(updated);
    showToast(`💰 Wallet updated for ${selectedUser.fullName}: ₹${newBal} (Balance ${adjustType === 'add' ? '+' : '-'} ₹${amt})`);
    setSelectedUser(null);
    setAdjustAmount('');
  };

  return (
    <div className="space-y-6">
      {/* Top Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Card 1: Total Users */}
        <div className={`p-4 rounded-3xl border transition-all ${
          isDark ? 'bg-[#1E293B] border-slate-800' : 'bg-white border-slate-200/90 shadow-xs'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Total Userbase</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {totalUsersCount}
            </span>
            <span className="text-xs text-emerald-500 font-bold">({activeUsersCount} active)</span>
          </div>
          <span className="text-[10px] text-emerald-500 font-medium mt-1 block">● Registered members across app</span>
        </div>

        {/* Card 2: User Wallet Balances */}
        <div className={`p-4 rounded-3xl border transition-all ${
          isDark ? 'bg-[#1E293B] border-slate-800' : 'bg-white border-slate-200/90 shadow-xs'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Wallet Liabilities</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-500 font-mono">
              ₹ {totalWalletLiability.toLocaleString('en-IN')}
            </span>
            <span className="text-xs text-slate-400 font-bold">Held</span>
          </div>
          <span className="text-[10px] text-emerald-500 font-medium mt-1 block">Unclaimed balance in user wallets</span>
        </div>

        {/* Card 3: Total Rewards Earned */}
        <div className={`p-4 rounded-3xl border transition-all ${
          isDark ? 'bg-[#1E293B] border-slate-800' : 'bg-white border-slate-200/90 shadow-xs'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Lifetime Payouts</span>
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'} font-mono`}>
              ₹ {totalLifetimeEarned.toLocaleString('en-IN')}
            </span>
            <span className="text-xs text-slate-400 font-bold">Earned</span>
          </div>
          <span className="text-[10px] text-purple-400 font-medium mt-1 block">Total rewards distributed to users</span>
        </div>

        {/* Card 4: Flagged / Suspended */}
        <div className={`p-4 rounded-3xl border transition-all ${
          isDark ? 'bg-[#1E293B] border-slate-800' : 'bg-white border-slate-200/90 shadow-xs'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Flagged & Blocked</span>
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
              suspendedOrFlaggedCount > 0 ? 'bg-rose-500/20 text-rose-400' : 'bg-slate-500/10 text-slate-400'
            }`}>
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className={`text-2xl font-black ${suspendedOrFlaggedCount > 0 ? 'text-rose-400' : isDark ? 'text-white' : 'text-slate-900'}`}>
              {suspendedOrFlaggedCount}
            </span>
            <span className="text-xs text-slate-400 font-bold">Accounts</span>
          </div>
          <span className={`text-[10px] font-medium mt-1 block ${suspendedOrFlaggedCount > 0 ? 'text-rose-400' : 'text-slate-400'}`}>
            {suspendedOrFlaggedCount > 0 ? 'Restricted due to violations' : '0 accounts flagged'}
          </span>
        </div>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className={`text-lg font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>Registered Users Directory</h2>
          <p className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Manage user accounts, adjust wallet balances, review referrals, and manage permissions
          </p>
        </div>
        <div className={`text-xs font-extrabold px-3.5 py-1.5 rounded-xl border ${
          isDark ? 'bg-slate-800 text-slate-300 border-slate-700' : 'bg-slate-100 text-slate-700 border-slate-200'
        }`}>
          Total Users: {userList.length}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className={`p-4 rounded-3xl border flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 ${
        isDark ? 'bg-[#1E293B] border-slate-800 shadow-xl' : 'bg-white border-slate-200/90 shadow-xs'
      }`}>
        <div className="relative flex-1">
          <Search className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
          <input
            type="text"
            placeholder="Search by Name, Phone (+91), Email, or Referral Code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-xs font-semibold focus:outline-hidden focus:border-indigo-500 ${
              isDark 
                ? 'bg-slate-900 border-slate-700 text-white placeholder-slate-500' 
                : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
            }`}
          />
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-2 overflow-x-auto">
          {(['all', 'active', 'flagged', 'suspended'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-2 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer whitespace-nowrap ${
                filterStatus === status
                  ? isDark 
                    ? 'bg-indigo-600 text-white shadow-md' 
                    : 'bg-slate-900 text-white shadow-xs'
                  : isDark
                  ? 'bg-slate-900/60 text-slate-400 hover:bg-slate-800'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className={`rounded-3xl border overflow-hidden ${
        isDark ? 'bg-[#1E293B] border-slate-800 shadow-xl' : 'bg-white border-slate-200/90 shadow-xs'
      }`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className={`border-b text-[11px] font-black uppercase tracking-wider ${
                isDark ? 'bg-slate-900/60 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-500'
              }`}>
                <th className="py-3.5 px-4">User Details</th>
                <th className="py-3.5 px-4">Wallet Balance</th>
                <th className="py-3.5 px-4">Earned / Withdrawn</th>
                <th className="py-3.5 px-4">Tasks & Referrals</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className={`divide-y text-xs ${isDark ? 'divide-slate-800' : 'divide-slate-100'}`}>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className={`py-8 text-center font-medium ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                    No users found matching your search term.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u.phone} className={`transition-colors ${isDark ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50/50'}`}>
                    <td className="py-3.5 px-4">
                      <div className={`font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>{u.fullName}</div>
                      <div className={`text-[11px] font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>+91 {u.phone}</div>
                      <div className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>{u.email} • Joined {u.joinedDate}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="text-sm font-black text-emerald-500">
                        ₹ {u.walletBalance || 0}
                      </div>
                      <span className={`text-[10px] font-medium ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>Available</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className={`font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>Earned: ₹{u.totalEarned || 0}</div>
                      <div className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>Paid: ₹{u.totalWithdrawn || 0}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className={`font-semibold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{u.tasksCompleted || 0} Tasks Done</div>
                      <div className="text-[11px] text-indigo-500 font-medium">
                        Ref Code: <span className="font-mono font-bold">{u.referralCode}</span> ({u.referralCount || 0} refs)
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        u.status === 'active'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : u.status === 'flagged'
                          ? 'bg-amber-500/20 text-amber-400'
                          : 'bg-rose-500/20 text-rose-400'
                      }`}>
                        {u.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedUser(u)}
                          title="Adjust Balance"
                          className={`p-1.5 rounded-xl text-xs font-bold cursor-pointer flex items-center gap-1 ${
                            isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-200' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                          }`}
                        >
                          <Wallet className="w-3.5 h-3.5 text-indigo-500" />
                          <span>Balance</span>
                        </button>
                        <button
                          onClick={() => handleToggleStatus(u.phone, u.status)}
                          title={u.status === 'active' ? 'Suspend User' : 'Activate User'}
                          className={`p-1.5 rounded-xl text-xs font-bold cursor-pointer ${
                            u.status === 'active'
                              ? 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20'
                              : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20'
                          }`}
                        >
                          {u.status === 'active' ? 'Suspend' : 'Activate'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Adjust Wallet Balance Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className={`w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-4 border animate-in fade-in zoom-in duration-200 ${
            isDark ? 'bg-[#1E293B] border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`p-2 rounded-xl ${isDark ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-50 text-indigo-600'}`}>
                  <Wallet className="w-5 h-5" />
                </div>
                <div>
                  <h3 className={`text-base font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>Adjust Wallet Balance</h3>
                  <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{selectedUser.fullName} (+91 {selectedUser.phone})</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedUser(null)}
                className={`p-2 rounded-full cursor-pointer ${isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-400'}`}
              >
                ✕
              </button>
            </div>

            {/* Current Balance Display */}
            <div className={`p-3 rounded-2xl border flex items-center justify-between text-xs ${
              isDark ? 'bg-slate-900/80 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-600'
            }`}>
              <span className={`font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Current Available Balance:</span>
              <span className="text-sm font-black text-emerald-500">₹ {selectedUser.walletBalance || 0}</span>
            </div>

            {/* Action Type: Add or Deduct */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setAdjustType('add')}
                className={`py-2 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  adjustType === 'add'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : isDark
                    ? 'bg-slate-900 text-slate-400 hover:bg-slate-800'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <PlusCircle className="w-4 h-4" />
                <span>Add Cash (+)</span>
              </button>
              <button
                onClick={() => setAdjustType('deduct')}
                className={`py-2 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  adjustType === 'deduct'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : isDark
                    ? 'bg-slate-900 text-slate-400 hover:bg-slate-800'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <MinusCircle className="w-4 h-4" />
                <span>Deduct Cash (-)</span>
              </button>
            </div>

            {/* Amount Input */}
            <div className="space-y-1 text-left">
              <label className={`text-xs font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Amount (₹ INR):</label>
              <input
                type="number"
                placeholder="e.g. 50"
                value={adjustAmount}
                onChange={(e) => setAdjustAmount(e.target.value)}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-black focus:outline-hidden focus:border-indigo-500 ${
                  isDark 
                    ? 'bg-slate-900 border-slate-700 text-white placeholder-slate-500' 
                    : 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400'
                }`}
              />
            </div>

            {/* Reason */}
            <div className="space-y-1 text-left">
              <label className={`text-xs font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Reason / Note:</label>
              <input
                type="text"
                placeholder="e.g. Compensation bonus, referral correction"
                value={adjustReason}
                onChange={(e) => setAdjustReason(e.target.value)}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-hidden focus:border-indigo-500 ${
                  isDark 
                    ? 'bg-slate-900 border-slate-700 text-white placeholder-slate-500' 
                    : 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400'
                }`}
              />
            </div>

            {/* Submit */}
            <button
              onClick={handleApplyBalanceAdjustment}
              className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black shadow-md cursor-pointer transition-all"
            >
              Apply Balance Change
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
