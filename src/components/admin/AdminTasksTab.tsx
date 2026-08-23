import React, { useState } from 'react';
import { 
  CheckSquare, 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Clock, 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  Eye, 
  Sparkles, 
  Zap, 
  Filter, 
  FileText, 
  Layers, 
  ExternalLink, 
  AlertCircle, 
  DollarSign,
  TrendingUp,
  Image as ImageIcon
} from 'lucide-react';
import { TaskItem } from '../tasks/taskData';
import { TaskProofSubmission, AdminUserRecord } from '../../utils/adminStorage';
import { useAdminTheme } from './AdminThemeContext';

interface AdminTasksTabProps {
  tasks: TaskItem[];
  onUpdateTasks: (tasks: TaskItem[]) => void;
  proofs: TaskProofSubmission[];
  onUpdateProofs: (proofs: TaskProofSubmission[]) => void;
  users: Record<string, AdminUserRecord>;
  onUpdateUsers: (users: Record<string, AdminUserRecord>) => void;
  showToast: (msg: string) => void;
}

export const AdminTasksTab: React.FC<AdminTasksTabProps> = ({
  tasks = [],
  onUpdateTasks,
  proofs = [],
  onUpdateProofs,
  users = {},
  onUpdateUsers,
  showToast
}) => {
  const { isDark } = useAdminTheme();
  const [activeSubTab, setActiveSubTab] = useState<'tasks' | 'proofs'>('tasks');
  const [taskSearchQuery, setTaskSearchQuery] = useState('');
  const [taskCategoryFilter, setTaskCategoryFilter] = useState<string>('All');

  // Task Modal states
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskItem | null>(null);

  // New/Edit task form state
  const [title, setTitle] = useState('');
  const [reward, setReward] = useState<number>(30);
  const [category, setCategory] = useState<'App Install' | 'Quick Survey' | 'Fintech Offer' | 'Brain Puzzle' | 'Video Zone'>('App Install');
  const [timeRequired, setTimeRequired] = useState('2 mins');
  const [difficulty, setDifficulty] = useState<'Instant' | 'Easy' | 'Medium'>('Easy');
  const [badge, setBadge] = useState('🔥 HOT');
  const [description, setDescription] = useState('');
  const [stepsText, setStepsText] = useState('Download application\nComplete registration\nClaim reward in wallet');

  // Proofs Review States
  const [proofFilterStatus, setProofFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [proofSearchQuery, setProofSearchQuery] = useState('');
  const [selectedProof, setSelectedProof] = useState<TaskProofSubmission | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  // Calculations & Metrics
  const activeTasksCount = tasks.filter(t => t.active !== false).length;
  const pendingProofsCount = proofs.filter(p => p.status === 'pending').length;
  const approvedProofsCount = proofs.filter(p => p.status === 'approved').length;
  const totalProofDisbursed = proofs
    .filter(p => p.status === 'approved')
    .reduce((acc, p) => acc + (p.rewardAmount || 0), 0);

  // Filter Tasks
  const filteredTasks = tasks.filter(t => {
    const matchesSearch = (t.title || '').toLowerCase().includes(taskSearchQuery.toLowerCase()) ||
      (t.category || '').toLowerCase().includes(taskSearchQuery.toLowerCase());
    const matchesCategory = taskCategoryFilter === 'All' || t.category === taskCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Filter Proofs
  const filteredProofs = proofs.filter(p => {
    const matchesFilter = proofFilterStatus === 'all' || p.status === proofFilterStatus;
    const matchesSearch = 
      (p.taskTitle || '').toLowerCase().includes(proofSearchQuery.toLowerCase()) ||
      (p.userName || '').toLowerCase().includes(proofSearchQuery.toLowerCase()) ||
      (p.userPhone && p.userPhone.includes(proofSearchQuery)) ||
      (p.id && p.id.toLowerCase().includes(proofSearchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  // Task Actions
  const handleOpenCreateTask = () => {
    setEditingTask(null);
    setTitle('');
    setReward(35);
    setCategory('App Install');
    setTimeRequired('2 mins');
    setDifficulty('Easy');
    setBadge('🔥 HOT');
    setDescription('');
    setStepsText('Download application\nComplete registration with mobile OTP\nClaim reward in wallet instantly');
    setIsTaskModalOpen(true);
  };

  const handleOpenEditTask = (task: TaskItem) => {
    setEditingTask(task);
    setTitle(task.title);
    setReward(task.reward);
    setCategory(task.category as any || 'App Install');
    setTimeRequired(task.timeRequired || '2 mins');
    setDifficulty(task.difficulty as any || 'Easy');
    setBadge(task.badge || '🔥 HOT');
    setDescription(task.description);
    setStepsText(task.steps?.join('\n') || '');
    setIsTaskModalOpen(true);
  };

  const handleTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || reward <= 0) return;

    const steps = stepsText.split('\n').map(s => s.trim()).filter(s => s.length > 0);

    if (editingTask) {
      const updated = tasks.map(t => {
        if (t.id === editingTask.id) {
          return {
            ...t,
            title: title.trim(),
            reward: Number(reward),
            category,
            timeRequired,
            difficulty,
            badge,
            description: description.trim() || `Complete this ${category} to earn ₹${reward}.`,
            steps: steps.length > 0 ? steps : ['Follow task link', 'Complete verification', 'Earn wallet cash']
          };
        }
        return t;
      });
      onUpdateTasks(updated);
      showToast(`Updated task "${title}".`);
    } else {
      const newTask: TaskItem = {
        id: `TSK-${Date.now().toString().slice(-4)}`,
        title: title.trim(),
        reward: Number(reward),
        category,
        timeRequired,
        difficulty,
        completionCount: '0 Completed',
        badge,
        description: description.trim() || `Complete this high paying ${category} to earn ₹${reward} direct cash.`,
        steps: steps.length > 0 ? steps : ['Follow task link', 'Complete verification', 'Earn wallet cash'],
        rules: ['Single completion per user', 'Real phone number profile only', 'Auto verification active'],
        iconName: 'Sparkles',
        themeColor: 'from-[#4B63FF] to-[#3549EC]',
        active: true
      };
      onUpdateTasks([newTask, ...tasks]);
      showToast(`🚀 Task "${newTask.title}" published live!`);
    }
    setIsTaskModalOpen(false);
  };

  const handleToggleTaskActive = (id: string, active: boolean) => {
    const updated = tasks.map(t => (t.id === id ? { ...t, active } : t));
    onUpdateTasks(updated);
    showToast(`Task status set to ${active ? 'Live (Visible)' : 'Paused (Hidden)'}.`);
  };

  const handleDeleteTask = (id: string) => {
    const task = tasks.find(t => t.id === id);
    const updated = tasks.filter(t => t.id !== id);
    onUpdateTasks(updated);
    showToast(`Deleted task "${task?.title}".`);
  };

  // Proof Actions
  const handleApproveProof = (proof: TaskProofSubmission) => {
    // 1. Mark proof approved
    const updatedProofs = proofs.map(p => 
      p.id === proof.id 
        ? { ...p, status: 'approved' as const, reviewedAt: 'Just now' }
        : p
    );
    onUpdateProofs(updatedProofs);

    // 2. Credit the user balance
    const phoneDigits = proof.userPhone.replace(/\D/g, '').slice(-10);
    const safeUsers = users || {};
    const userKey = Object.keys(safeUsers).find(k => k.includes(phoneDigits) || safeUsers[k]?.phone === proof.userPhone) || proof.userPhone;
    const user = safeUsers[userKey];
    if (user) {
      const updatedUser: AdminUserRecord = {
        ...user,
        walletBalance: (user.walletBalance || 0) + proof.rewardAmount,
        totalEarned: (user.totalEarned || 0) + proof.rewardAmount,
        tasksCompleted: (user.tasksCompleted || 0) + 1,
      };
      onUpdateUsers({
        ...safeUsers,
        [userKey]: updatedUser,
      });
    }

    showToast(`✅ Approved proof! +₹${proof.rewardAmount} credited to ${proof.userName}.`);
    if (selectedProof?.id === proof.id) setSelectedProof(null);
  };

  const handleRejectProof = (proof: TaskProofSubmission) => {
    const reason = rejectionReason.trim() || 'Proof screenshot did not match task instructions.';
    const updatedProofs = proofs.map(p => 
      p.id === proof.id 
        ? { ...p, status: 'rejected' as const, rejectReason: reason, reviewedAt: 'Just now' }
        : p
    );
    onUpdateProofs(updatedProofs);
    showToast(`❌ Proof rejected for ${proof.userName}.`);
    setRejectionReason('');
    if (selectedProof?.id === proof.id) setSelectedProof(null);
  };

  return (
    <div className="space-y-6 text-left">
      {/* Top Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className={`p-4 rounded-3xl border transition-all ${
          isDark ? 'bg-[#1E293B] border-slate-800' : 'bg-white border-slate-200/90 shadow-xs'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Live Tasks</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <CheckSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {activeTasksCount}
            </span>
            <span className="text-xs text-slate-400 font-bold">/ {tasks.length} Total</span>
          </div>
          <span className="text-[10px] text-emerald-500 font-bold mt-1 block">● Instant user access</span>
        </div>

        <div className={`p-4 rounded-3xl border transition-all ${
          isDark ? 'bg-[#1E293B] border-slate-800' : 'bg-white border-slate-200/90 shadow-xs'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Pending Proofs</span>
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
              pendingProofsCount > 0 ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-500/10 text-slate-400'
            }`}>
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className={`text-2xl font-black ${pendingProofsCount > 0 ? 'text-amber-400' : isDark ? 'text-white' : 'text-slate-900'}`}>
              {pendingProofsCount}
            </span>
            <span className="text-xs text-slate-400 font-bold">Awaiting Review</span>
          </div>
          <span className={`text-[10px] font-bold mt-1 block ${pendingProofsCount > 0 ? 'text-amber-400 animate-pulse' : 'text-slate-400'}`}>
            {pendingProofsCount > 0 ? '⚡ Action Required' : 'All proofs caught up'}
          </span>
        </div>

        <div className={`p-4 rounded-3xl border transition-all ${
          isDark ? 'bg-[#1E293B] border-slate-800' : 'bg-white border-slate-200/90 shadow-xs'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Approved Proofs</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {approvedProofsCount}
            </span>
            <span className="text-xs text-slate-400 font-bold">Verified</span>
          </div>
          <span className="text-[10px] text-emerald-500 font-medium mt-1 block">Manual review approved</span>
        </div>

        <div className={`p-4 rounded-3xl border transition-all ${
          isDark ? 'bg-[#1E293B] border-slate-800' : 'bg-white border-slate-200/90 shadow-xs'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Proof Rewards Paid</span>
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-black font-mono text-emerald-500">
              ₹ {totalProofDisbursed.toLocaleString('en-IN')}
            </span>
          </div>
          <span className="text-[10px] text-slate-400 font-medium mt-1 block">Directly added to user wallets</span>
        </div>
      </div>

      {/* Main Header & Sub-Tab Navigation */}
      <div className={`p-4 rounded-3xl border space-y-4 ${
        isDark ? 'bg-[#1E293B] border-slate-800' : 'bg-white border-slate-200/90'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className={`text-base font-black flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              <CheckSquare className="w-5 h-5 text-indigo-500" />
              <span>Tasks, Offers & Proof Verification Hub</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Manage in-app tasks & offers and verify user screenshot proof submissions in one unified module.
            </p>
          </div>
          <button
            id="btn-admin-create-new-task"
            onClick={handleOpenCreateTask}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-[#3549EC] hover:opacity-95 text-white text-xs font-black shadow-md cursor-pointer transition-all self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Task</span>
          </button>
        </div>

        {/* Sub-Tab Navigation Bar */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1">
          <button
            id="btn-subtab-tasks-inventory"
            onClick={() => setActiveSubTab('tasks')}
            className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-black whitespace-nowrap transition-all cursor-pointer ${
              activeSubTab === 'tasks'
                ? 'bg-gradient-to-r from-indigo-600 to-[#3549EC] text-white shadow-md'
                : isDark 
                  ? 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800' 
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>1. Task Campaigns & Publisher</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${
              activeSubTab === 'tasks' ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
            }`}>
              {tasks.length}
            </span>
          </button>

          <button
            id="btn-subtab-task-proofs-review"
            onClick={() => setActiveSubTab('proofs')}
            className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-black whitespace-nowrap transition-all cursor-pointer ${
              activeSubTab === 'proofs'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
                : isDark 
                  ? 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800' 
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>2. Screenshot Proofs Review</span>
            {pendingProofsCount > 0 ? (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 font-black animate-pulse">
                {pendingProofsCount} Pending
              </span>
            ) : (
              <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                activeSubTab === 'proofs' ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
              }`}>
                {proofs.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* --------------------- SUBTAB 1: TASKS & OFFERS LIST --------------------- */}
      {/* ========================================================================= */}
      {activeSubTab === 'tasks' && (
        <div className="space-y-4">
          {/* Filter Bar & Search */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
              <input
                type="text"
                placeholder="Search tasks by title, category, or difficulty..."
                value={taskSearchQuery}
                onChange={(e) => setTaskSearchQuery(e.target.value)}
                className={`w-full pl-10 pr-4 py-2.5 rounded-2xl text-xs font-medium border focus:outline-hidden transition-all ${
                  isDark 
                    ? 'bg-slate-900 border-slate-800 text-white placeholder-slate-500 focus:border-indigo-500' 
                    : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-indigo-500'
                }`}
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
              {['All', 'App Install', 'Quick Survey', 'Fintech Offer', 'Brain Puzzle', 'Video Zone'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setTaskCategoryFilter(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition-all ${
                    taskCategoryFilter === cat
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : isDark ? 'bg-slate-800 text-slate-400 hover:text-white' : 'bg-white text-slate-600 border border-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Tasks Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTasks.map((task) => {
              const isLive = task.active !== false;
              return (
                <div
                  key={task.id}
                  className={`p-5 rounded-3xl border transition-all flex flex-col justify-between space-y-3.5 ${
                    isDark ? 'bg-[#1E293B] border-slate-800' : 'bg-white border-slate-200/90 shadow-xs'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${
                          isDark ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-50 text-indigo-700'
                        }`}>
                          {task.category}
                        </span>
                        <span className="text-[10px] font-bold text-amber-500">
                          {task.badge}
                        </span>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-base font-black text-emerald-500 font-mono">
                          +₹{task.reward}
                        </span>
                      </div>
                    </div>

                    <h4 className={`text-sm font-black leading-snug ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {task.title}
                    </h4>

                    <p className={`text-xs line-clamp-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      {task.description}
                    </p>

                    {/* Meta info */}
                    <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-500" />
                        {task.timeRequired}
                      </span>
                      <span>•</span>
                      <span>{task.difficulty}</span>
                      <span>•</span>
                      <span className="font-mono text-slate-500">{task.id}</span>
                    </div>
                  </div>

                  {/* Bottom Controls */}
                  <div className={`pt-3 border-t flex items-center justify-between text-xs ${
                    isDark ? 'border-slate-800' : 'border-slate-100'
                  }`}>
                    <button
                      onClick={() => handleToggleTaskActive(task.id, !isLive)}
                      className={`px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                        isLive 
                          ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30' 
                          : 'bg-rose-500/20 text-rose-400 hover:bg-rose-500/30'
                      }`}
                    >
                      {isLive ? 'Active (Live)' : 'Paused'}
                    </button>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenEditTask(task)}
                        title="Edit Task"
                        className={`p-2 rounded-xl border cursor-pointer transition-all ${
                          isDark ? 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300' : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
                        }`}
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        title="Delete Task"
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
        </div>
      )}

      {/* ========================================================================= */}
      {/* ------------------- SUBTAB 2: SCREENSHOT PROOFS REVIEW ------------------ */}
      {/* ========================================================================= */}
      {activeSubTab === 'proofs' && (
        <div className="space-y-4">
          {/* Status Filters & Search */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
              <input
                type="text"
                placeholder="Search proofs by task title, user name, or mobile number..."
                value={proofSearchQuery}
                onChange={(e) => setProofSearchQuery(e.target.value)}
                className={`w-full pl-10 pr-4 py-2.5 rounded-2xl text-xs font-medium border focus:outline-hidden transition-all ${
                  isDark 
                    ? 'bg-slate-900 border-slate-800 text-white placeholder-slate-500 focus:border-emerald-500' 
                    : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-emerald-500'
                }`}
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {(['all', 'pending', 'approved', 'rejected'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setProofFilterStatus(status)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-black capitalize transition-all cursor-pointer ${
                    proofFilterStatus === status 
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20' 
                      : isDark 
                        ? 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700' 
                        : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
                  }`}
                >
                  {status} {status === 'pending' && pendingProofsCount > 0 && `(${pendingProofsCount})`}
                </button>
              ))}
            </div>
          </div>

          {/* Proofs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProofs.map((proof) => (
              <div
                key={proof.id}
                className={`p-4 rounded-3xl border transition-all space-y-3.5 flex flex-col justify-between shadow-xs ${
                  isDark ? 'bg-[#1E293B]' : 'bg-white'
                } ${
                  proof.status === 'pending'
                    ? isDark ? 'border-amber-500/40' : 'border-amber-400 shadow-amber-500/10'
                    : proof.status === 'approved'
                    ? isDark ? 'border-emerald-500/30' : 'border-emerald-300'
                    : isDark ? 'border-rose-500/30' : 'border-rose-300'
                }`}
              >
                {/* Top: User info & reward */}
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-mono text-slate-400 block">{proof.id}</span>
                      <h4 className={`text-sm font-black leading-snug ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {proof.taskTitle}
                      </h4>
                    </div>
                    <span className="px-2.5 py-1 rounded-xl bg-emerald-500/20 text-emerald-500 text-xs font-black shrink-0 font-mono">
                      +₹{proof.rewardAmount}
                    </span>
                  </div>

                  {/* User details */}
                  <div className={`mt-2.5 flex items-center justify-between text-[11px] border-t pt-2 ${
                    isDark ? 'border-slate-800 text-slate-400' : 'border-slate-100 text-slate-500'
                  }`}>
                    <span className={`font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                      {proof.userName}
                    </span>
                    <span className="font-mono text-slate-400">+91 {proof.userPhone}</span>
                  </div>
                </div>

                {/* Proof Screenshot Thumbnail & Submission text */}
                <div className="space-y-2">
                  {proof.screenshotUrl ? (
                    <div 
                      onClick={() => setSelectedProof(proof)}
                      className="relative group rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 cursor-pointer h-32 flex items-center justify-center"
                    >
                      <img
                        src={proof.screenshotUrl}
                        alt="Proof screenshot"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-white text-xs font-bold">
                        <Eye className="w-4 h-4" />
                        <span>Inspect Screenshot</span>
                      </div>
                    </div>
                  ) : (
                    <div className="h-24 rounded-2xl bg-slate-800/40 flex items-center justify-center text-slate-500 text-xs gap-1.5">
                      <ImageIcon className="w-4 h-4" />
                      <span>No screenshot attached</span>
                    </div>
                  )}

                  {proof.userNote && (
                    <div className={`p-2.5 rounded-xl border text-[11px] line-clamp-2 ${
                      isDark ? 'bg-slate-900/90 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}>
                      <span className="font-bold text-slate-400 block text-[9px] uppercase">User Comment:</span>
                      {proof.userNote}
                    </div>
                  )}
                </div>

                {/* Bottom Actions based on status */}
                <div className={`pt-2 border-t flex items-center justify-between ${
                  isDark ? 'border-slate-800' : 'border-slate-100'
                }`}>
                  <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${
                    proof.status === 'pending'
                      ? 'bg-amber-500/20 text-amber-500'
                      : proof.status === 'approved'
                      ? 'bg-emerald-500/20 text-emerald-500'
                      : 'bg-rose-500/20 text-rose-500'
                  }`}>
                    {proof.status}
                  </span>

                  {proof.status === 'pending' ? (
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleRejectProof(proof)}
                        className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 text-xs font-bold border border-rose-500/30 cursor-pointer"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => handleApproveProof(proof)}
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black shadow-md cursor-pointer"
                      >
                        Approve & Pay
                      </button>
                    </div>
                  ) : (
                    <span className="text-[10px] text-slate-400">{proof.reviewedAt || proof.submittedAt}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* --------------------- MODAL: CREATE / EDIT TASK ------------------------- */}
      {/* ========================================================================= */}
      {isTaskModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className={`w-full max-w-lg p-6 rounded-3xl border shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto ${
            isDark ? 'bg-[#1E293B] border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex items-center justify-between">
              <h3 className="font-black text-base">
                {editingTask ? 'Edit Task Campaign' : 'Publish New EarnX Task'}
              </h3>
              <button
                onClick={() => setIsTaskModalOpen(false)}
                className="text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleTaskSubmit} className="space-y-3.5 text-left text-xs">
              {/* Task Title */}
              <div className="space-y-1">
                <label className="font-bold text-slate-400">Task Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Install Angel One Demat App & Complete KYC"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-2xl border font-bold ${
                    isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                />
              </div>

              {/* Reward & Category */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-400">Reward Cash (₹)</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={reward}
                    onChange={(e) => setReward(Number(e.target.value))}
                    className={`w-full px-3.5 py-2.5 rounded-2xl border font-bold font-mono ${
                      isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-400">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className={`w-full px-3.5 py-2.5 rounded-2xl border font-bold ${
                      isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  >
                    <option value="App Install">App Install</option>
                    <option value="Quick Survey">Quick Survey</option>
                    <option value="Fintech Offer">Fintech Offer</option>
                    <option value="Brain Puzzle">Brain Puzzle</option>
                    <option value="Video Zone">Video Zone</option>
                  </select>
                </div>
              </div>

              {/* Time & Difficulty */}
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-400">Est. Time</label>
                  <input
                    type="text"
                    value={timeRequired}
                    onChange={(e) => setTimeRequired(e.target.value)}
                    className={`w-full px-3 py-2.5 rounded-2xl border font-bold ${
                      isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-400">Difficulty</label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as any)}
                    className={`w-full px-3 py-2.5 rounded-2xl border font-bold ${
                      isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  >
                    <option value="Instant">Instant</option>
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-400">Badge Label</label>
                  <input
                    type="text"
                    value={badge}
                    onChange={(e) => setBadge(e.target.value)}
                    className={`w-full px-3 py-2.5 rounded-2xl border font-bold ${
                      isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="font-bold text-slate-400">Description</label>
                <textarea
                  rows={2}
                  placeholder="Task requirements and overview..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className={`w-full px-3.5 py-2 rounded-2xl border ${
                    isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                />
              </div>

              {/* Step by step */}
              <div className="space-y-1">
                <label className="font-bold text-slate-400">Step-by-step instructions (1 per line)</label>
                <textarea
                  rows={3}
                  value={stepsText}
                  onChange={(e) => setStepsText(e.target.value)}
                  className={`w-full px-3.5 py-2 rounded-2xl border font-mono ${
                    isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-[#3549EC] hover:opacity-95 text-white font-black text-xs uppercase tracking-wider shadow-lg cursor-pointer"
                >
                  {editingTask ? 'Save Task Changes' : `Publish Task To App (+ ₹${reward} INR)`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* -------------------- MODAL: INSPECT PROOF & APPROVE --------------------- */}
      {/* ========================================================================= */}
      {selectedProof && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className={`border rounded-3xl max-w-lg w-full p-5 space-y-4 shadow-2xl animate-in zoom-in-95 duration-200 ${
            isDark ? 'bg-[#1E293B] border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className={`flex items-center justify-between pb-2 border-b ${
              isDark ? 'border-slate-800' : 'border-slate-100'
            }`}>
              <div>
                <h3 className="text-base font-black">{selectedProof.taskTitle}</h3>
                <p className="text-xs text-slate-400">Submitted by {selectedProof.userName} (+91 {selectedProof.userPhone})</p>
              </div>
              <button
                onClick={() => setSelectedProof(null)}
                className={`p-1.5 rounded-xl cursor-pointer ${
                  isDark ? 'bg-slate-800 text-slate-400 hover:text-white' : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                }`}
              >
                ✕
              </button>
            </div>

            {/* Big Image */}
            {selectedProof.screenshotUrl && (
              <div className="rounded-2xl overflow-hidden border border-slate-800 max-h-80 bg-black flex items-center justify-center">
                <img
                  src={selectedProof.screenshotUrl}
                  alt="Proof Full"
                  className="w-full h-full object-contain max-h-80"
                />
              </div>
            )}

            {selectedProof.userNote && (
              <div className={`p-3 rounded-xl border text-xs ${
                isDark ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}>
                <span className="font-bold text-slate-400 text-[10px] uppercase block mb-1">User Comment:</span>
                {selectedProof.userNote}
              </div>
            )}

            {selectedProof.status === 'pending' && (
              <div className="space-y-3 pt-2">
                <input
                  type="text"
                  placeholder="Optional rejection reason if rejecting..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className={`w-full px-3 py-2.5 rounded-xl border text-xs ${
                    isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                />
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => handleRejectProof(selectedProof)}
                    className="px-4 py-2.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-500 text-xs font-bold cursor-pointer transition-all"
                  >
                    Reject Submission
                  </button>
                  <button
                    onClick={() => handleApproveProof(selectedProof)}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black cursor-pointer shadow-lg transition-all"
                  >
                    Approve & Credit ₹{selectedProof.rewardAmount}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
