import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Clock, 
  ShieldCheck, 
  CheckCircle2, 
  Smartphone, 
  CheckSquare, 
  CreditCard, 
  Trophy, 
  Play,
  AlertCircle,
  ExternalLink,
  Zap,
  Users,
  Sparkles
} from 'lucide-react';
import { TaskItem } from './taskData';
import { triggerWinConfetti } from '../rewards/confettiHelper';

interface TaskDetailModalProps {
  task: TaskItem | null;
  isOpen: boolean;
  onClose: () => void;
  onComplete: (taskId: string, reward: number, taskTitle: string) => void;
  showToast: (msg: string) => void;
}

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
  task,
  isOpen,
  onClose,
  onComplete,
  showToast
}) => {
  const [taskState, setTaskState] = useState<'idle' | 'in_progress' | 'verifying' | 'completed'>('idle');
  const [progressPercent, setProgressPercent] = useState(0);

  if (!isOpen || !task) return null;

  const renderIcon = (name?: string) => {
    switch (name) {
      case 'Smartphone': return <Smartphone className="w-5 h-5" />;
      case 'CheckSquare': return <CheckSquare className="w-5 h-5" />;
      case 'CreditCard': return <CreditCard className="w-5 h-5" />;
      case 'Trophy': return <Trophy className="w-5 h-5" />;
      case 'Play': return <Play className="w-5 h-5" />;
      default: return <Sparkles className="w-5 h-5" />;
    }
  };

  const handleStartTask = () => {
    if (task.isCompleted || taskState === 'completed') {
      showToast('⚠️ This task has already been completed!');
      return;
    }

    setTaskState('in_progress');
    setProgressPercent(20);

    // Simulate task progression
    setTimeout(() => {
      setProgressPercent(60);
      setTaskState('verifying');
    }, 1500);

    setTimeout(() => {
      setProgressPercent(100);
      setTaskState('completed');
      onComplete(task.id, task.reward, task.title);
      triggerWinConfetti();
      showToast(`🎉 Task Completed! +₹${task.reward} added to your wallet.`);
    }, 3000);
  };

  const isDone = task.isCompleted || taskState === 'completed';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 25 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 25 }}
          className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 flex flex-col max-h-[90vh] overflow-hidden relative"
        >
          {/* Header Bar */}
          <div className="p-4 bg-slate-900 text-white flex items-center justify-between relative overflow-hidden shrink-0">
            {/* Background Glow */}
            <div className="absolute -right-8 -top-8 w-28 h-28 bg-[#4B63FF]/30 rounded-full blur-xl pointer-events-none" />
            
            <div className="flex items-center gap-2.5 relative z-10">
              <div className={`p-2.5 rounded-2xl bg-gradient-to-br ${task.themeColor || 'from-indigo-500 to-purple-600'} text-white shadow-sm`}>
                {renderIcon(task.iconName)}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-black uppercase tracking-wider bg-white/15 px-2 py-0.5 rounded-md text-slate-200">
                    {task.category}
                  </span>
                  <span className="text-[10px] font-extrabold text-amber-300">
                    {task.badge}
                  </span>
                </div>
                <h3 className="text-sm font-black text-white line-clamp-1 mt-0.5 font-outfit">
                  {task.title}
                </h3>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-all cursor-pointer relative z-10"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Scrollable Content Body */}
          <div className="p-4 overflow-y-auto space-y-4 text-left flex-1">
            {/* Payout Hero Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 via-teal-50/50 to-emerald-100/60 border border-emerald-200/80 shadow-xs flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800">
                  Guaranteed Reward
                </span>
                <div className="text-2xl font-black font-outfit text-emerald-950 font-mono flex items-baseline gap-1">
                  ₹{task.reward}.00
                  <span className="text-xs font-bold text-emerald-700">INR CASH</span>
                </div>
              </div>

              <div className="text-right space-y-1">
                <span className="inline-flex items-center gap-1 text-[10px] font-extrabold bg-emerald-600 text-white px-2 py-0.5 rounded-full shadow-xs">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Instant Credit
                </span>
                <p className="text-[10px] text-emerald-800/80 font-medium">0% Withdrawal Fee</p>
              </div>
            </div>

            {/* Meta Tags Row */}
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-200/70">
                <div className="flex items-center justify-center gap-1 text-slate-400 mb-0.5">
                  <Clock className="w-3 h-3 text-[#4B63FF]" />
                  <span className="text-[9px] font-bold uppercase">Est. Time</span>
                </div>
                <div className="text-xs font-extrabold text-slate-800">{task.timeRequired || '2 mins'}</div>
              </div>

              <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-200/70">
                <div className="flex items-center justify-center gap-1 text-slate-400 mb-0.5">
                  <Zap className="w-3 h-3 text-amber-500" />
                  <span className="text-[9px] font-bold uppercase">Difficulty</span>
                </div>
                <div className="text-xs font-extrabold text-slate-800">{task.difficulty || 'Easy'}</div>
              </div>

              <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-200/70">
                <div className="flex items-center justify-center gap-1 text-slate-400 mb-0.5">
                  <Users className="w-3 h-3 text-emerald-500" />
                  <span className="text-[9px] font-bold uppercase">Status</span>
                </div>
                <div className="text-xs font-extrabold text-slate-800">
                  {isDone ? 'Completed' : 'Available'}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-700">
                Task Overview
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed font-medium bg-slate-50/70 p-3 rounded-2xl border border-slate-200/60">
                {task.description}
              </p>
            </div>

            {/* Step-by-Step Instructions */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-700">
                  Step-By-Step Instructions
                </h4>
                <span className="text-[10px] font-bold text-slate-400">{task.steps?.length || 0} Simple Steps</span>
              </div>

              <div className="space-y-2">
                {task.steps?.map((step, idx) => (
                  <div 
                    key={idx}
                    className="flex items-start gap-2.5 p-2.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs"
                  >
                    <div className="w-6 h-6 rounded-full bg-[#4B63FF]/10 text-[#3549EC] font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </div>
                    <div className="text-xs text-slate-700 font-medium leading-tight pt-1">
                      {step}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Important Terms & Rules */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                <span>Important Rules & Verification</span>
              </h4>
              <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200/70 space-y-1">
                {(task.rules || ['Follow instructions carefully', 'One submission per user']).map((rule, idx) => (
                  <div key={idx} className="flex items-start gap-1.5 text-[11px] text-amber-900 font-medium leading-tight">
                    <span className="text-amber-600 font-bold">•</span>
                    <span>{rule}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Progression simulation state if active */}
            {taskState !== 'idle' && (
              <div className="p-3 rounded-2xl bg-slate-900 text-white space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span>
                    {taskState === 'in_progress' && 'Connecting to sponsor task tracking...'}
                    {taskState === 'verifying' && 'Verifying task completion proof...'}
                    {taskState === 'completed' && 'Task Verified & Wallet Credited! 🎉'}
                  </span>
                  <span>{progressPercent}%</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <motion.div 
                    className="bg-emerald-500 h-full"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Bottom Action Footer */}
          <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center gap-3 shrink-0">
            {isDone ? (
              <div className="w-full py-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Task Completed (+₹{task.reward} Claimed)</span>
              </div>
            ) : (
              <button
                onClick={handleStartTask}
                disabled={taskState !== 'idle'}
                className={`w-full py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer ${
                  taskState !== 'idle'
                    ? 'bg-slate-300 text-slate-600 cursor-wait'
                    : 'bg-primary-gradient text-white shadow-[#4B63FF]/25 hover:opacity-95'
                }`}
              >
                {taskState === 'idle' ? (
                  <>
                    <ExternalLink className="w-4 h-4" />
                    <span>Start Task & Earn ₹{task.reward} Cash</span>
                  </>
                ) : (
                  <span>Processing Verification ({progressPercent}%)...</span>
                )}
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
