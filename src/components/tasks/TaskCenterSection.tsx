import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Smartphone, 
  CheckSquare, 
  CreditCard, 
  Trophy, 
  Play, 
  Sparkles, 
  Clock, 
  ChevronRight, 
  CheckCircle2 
} from 'lucide-react';
import { TaskItem, INITIAL_TASKS } from './taskData';
import { TaskDetailModal } from './TaskDetailModal';

interface TaskCenterSectionProps {
  onEarn: (amount: number, reason: string) => void;
  showToast: (msg: string) => void;
}

export const TaskCenterSection: React.FC<TaskCenterSectionProps> = ({
  onEarn,
  showToast
}) => {
  const [tasks, setTasks] = useState<TaskItem[]>(INITIAL_TASKS);
  const [selectedTask, setSelectedTask] = useState<TaskItem | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'App Install', 'Quick Survey', 'Fintech Offer', 'Brain Puzzle', 'Video Zone'];

  const filteredTasks = selectedCategory === 'All'
    ? tasks
    : tasks.filter(t => t.category === selectedCategory);

  const handleCompleteTask = (taskId: string, reward: number, taskTitle: string) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, isCompleted: true } : t));
    onEarn(reward, taskTitle);
  };

  const renderIcon = (name?: string) => {
    switch (name) {
      case 'Smartphone': return <Smartphone className="w-4 h-4" />;
      case 'CheckSquare': return <CheckSquare className="w-4 h-4" />;
      case 'CreditCard': return <CreditCard className="w-4 h-4" />;
      case 'Trophy': return <Trophy className="w-4 h-4" />;
      case 'Play': return <Play className="w-4 h-4" />;
      default: return <Sparkles className="w-4 h-4" />;
    }
  };

  const completedCount = tasks.filter(t => t.isCompleted).length;

  return (
    <div className="space-y-3.5">
      {/* Header Info */}
      <div className="p-4 rounded-3xl bg-gradient-to-br from-[#4B63FF] via-[#3549EC] to-indigo-700 text-white shadow-md shadow-[#4B63FF]/20 flex items-center justify-between text-left relative overflow-hidden">
        <div className="space-y-0.5 relative z-10">
          <span className="text-[10px] font-black uppercase tracking-widest bg-white/20 px-2 py-0.5 rounded-full inline-block">
            DAILY TASK CENTER
          </span>
          <h3 className="text-base font-black font-outfit">Complete Tasks, Earn Direct Cash</h3>
          <p className="text-xs text-white/90">
            {completedCount} of {tasks.length} tasks completed today
          </p>
        </div>
        <div className="text-right relative z-10 shrink-0">
          <span className="text-xs font-black text-amber-300 bg-black/20 px-2.5 py-1 rounded-xl block">
            ₹{tasks.reduce((sum, t) => sum + t.reward, 0)} Max Pool
          </span>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-left">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === cat
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white/80 text-slate-600 hover:bg-white border border-slate-200/70'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Tasks List */}
      <div className="space-y-2.5">
        {filteredTasks.map((task) => {
          return (
            <motion.div
              key={task.id}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => setSelectedTask(task)}
              className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between cursor-pointer shadow-xs ${
                task.isCompleted
                  ? 'bg-emerald-50/50 border-emerald-200/80 opacity-80'
                  : 'bg-white/90 border-slate-200/80 hover:border-[#4B63FF]/60 hover:shadow-sm'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className={`p-2.5 rounded-xl bg-gradient-to-br ${task.themeColor || 'from-indigo-500 to-purple-600'} text-white shrink-0 shadow-xs`}>
                  {renderIcon(task.iconName)}
                </div>
                <div className="min-w-0 flex-1 text-left space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-black uppercase text-[#4B63FF] bg-blue-50 px-1.5 py-0.5 rounded-md">
                      {task.category}
                    </span>
                    <span className="text-[10px] font-bold text-amber-600">
                      {task.badge}
                    </span>
                  </div>
                  <h4 className="text-xs font-extrabold text-slate-900 truncate">
                    {task.title}
                  </h4>
                  <div className="flex items-center gap-3 text-[10px] text-slate-400 font-medium">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {task.timeRequired || '2 Mins'}
                    </span>
                    <span>•</span>
                    <span>{task.completionCount || '10k+ Completed'}</span>
                  </div>
                </div>
              </div>

              {/* Action / Reward */}
              <div className="shrink-0 text-right ml-2">
                {task.isCompleted ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-emerald-700 bg-emerald-100 px-2 py-1 rounded-xl">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Done
                  </span>
                ) : (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedTask(task);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-primary-gradient text-white text-xs font-black shadow-xs hover:opacity-95 cursor-pointer flex items-center gap-1"
                  >
                    <span>+ ₹{task.reward}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Task Detail Modal */}
      <TaskDetailModal
        task={selectedTask}
        isOpen={Boolean(selectedTask)}
        onClose={() => setSelectedTask(null)}
        onComplete={handleCompleteTask}
        showToast={showToast}
      />
    </div>
  );
};
