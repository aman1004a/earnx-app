export interface TaskItem {
  id: string;
  title: string;
  category: string;
  reward: number;
  rewardInr?: number;
  timeRequired?: string;
  difficulty?: 'Instant' | 'Easy' | 'Medium';
  completionCount?: string;
  badge?: string;
  iconName?: string;
  themeColor?: string;
  description: string;
  taskUrl?: string;
  actionUrl?: string;
  steps: string[];
  rules: string[];
  isCompleted?: boolean;
  active?: boolean;
  isActive?: boolean;
  isHot?: boolean;
}

export const INITIAL_TASKS: TaskItem[] = [
  {
    id: 'task-1',
    title: 'Install PhonePe & Register UPI',
    category: 'App Install',
    reward: 25,
    timeRequired: '3 Mins',
    difficulty: 'Instant',
    completionCount: '18.4k Completed',
    badge: '🔥 Hot Reward',
    iconName: 'Smartphone',
    themeColor: 'from-indigo-500 to-purple-600',
    description: 'Download the official PhonePe app, register with your phone number and link any bank account for instant ₹25 cash reward.',
    taskUrl: 'https://play.google.com/store/apps/details?id=com.phonepe.app',
    steps: [
      'Click "Start Task & Install" button below',
      'Download & install the app from Google Play Store',
      'Open the app and complete SMS OTP verification',
      'Keep the app open for at least 60 seconds',
      'Return to EarnX to claim your instant ₹25 reward'
    ],
    rules: [
      'Offer valid only for new PhonePe device installations',
      'Must use the tracking link provided by EarnX',
      'Do not use VPN or proxy during task completion'
    ],
    active: true
  },
  {
    id: 'task-2',
    title: 'Complete 2-Min Consumer Opinion Survey',
    category: 'Quick Survey',
    reward: 15,
    timeRequired: '2 Mins',
    difficulty: 'Easy',
    completionCount: '12.9k Completed',
    badge: '⚡ Quick Cash',
    iconName: 'CheckSquare',
    themeColor: 'from-emerald-500 to-teal-600',
    description: 'Answer 5 simple questions about your shopping preferences and daily digital payment habits to get ₹15 cash immediately.',
    taskUrl: 'https://surveys.earnx.in/consumer-opinion-2026',
    steps: [
      'Click "Start Survey Now"',
      'Answer all 5 multiple choice questions honestly',
      'Submit the feedback form',
      'Instant ₹15 will be added directly to your wallet'
    ],
    rules: [
      'All answers must be complete and genuine',
      'Only one submission allowed per user profile per day'
    ],
    active: true
  },
  {
    id: 'task-3',
    title: 'Angel One Demat Account Sign Up',
    category: 'Fintech Offer',
    reward: 75,
    timeRequired: '5 Mins',
    difficulty: 'Medium',
    completionCount: '6.8k Completed',
    badge: '💎 Mega Reward',
    iconName: 'CreditCard',
    themeColor: 'from-blue-600 to-cyan-600',
    description: 'Open a 100% free Demat account with Angel One with zero annual maintenance fees for year 1 and get ₹75 instant real cash bonus.',
    taskUrl: 'https://angel-one.onelink.me/fMo5/earnx_special',
    steps: [
      'Click "Start Task & Open Account"',
      'Enter basic KYC and verify Aadhaar OTP',
      'Complete free registration',
      'Instant ₹75 cash credit in EarnX wallet within 5 minutes'
    ],
    rules: [
      'Must be 18+ years old with valid Aadhaar & PAN',
      'Free zero-brokerage plan valid'
    ],
    active: true
  },
  {
    id: 'task-4',
    title: 'Play Daily Brain Math Quiz (Score 80%+)',
    category: 'Brain Puzzle',
    reward: 8,
    timeRequired: '1 Min',
    difficulty: 'Easy',
    completionCount: '24.1k Completed',
    badge: '🧠 Daily Bonus',
    iconName: 'Trophy',
    themeColor: 'from-amber-500 to-orange-600',
    description: 'Solve 5 quick mental math addition/subtraction questions in 60 seconds. Score 4 out of 5 right to earn ₹8 cash.',
    taskUrl: 'https://earnx.in/games/math-quiz',
    steps: [
      'Tap "Start Math Quiz"',
      'Solve 5 easy arithmetic questions',
      'Score at least 80% marks',
      'Claim your ₹8 cash prize'
    ],
    rules: [
      'Quiz resets every 24 hours',
      'No negative marking'
    ],
    active: true
  },
  {
    id: 'task-5',
    title: 'Watch 30s High Reward Sponsor Ad',
    category: 'Video Zone',
    reward: 5,
    timeRequired: '30 Secs',
    difficulty: 'Instant',
    completionCount: '45.2k Completed',
    badge: '🎬 Instant',
    iconName: 'Play',
    themeColor: 'from-rose-500 to-pink-600',
    description: 'Watch a verified 30-second sponsored video advertisement without skipping and claim instant ₹5 reward.',
    taskUrl: 'https://earnx.in/video/sponsor-ad-stream',
    steps: [
      'Click "Watch Video Ad"',
      'Let the 30-second video stream until completion',
      'Tap "Claim Reward" at the end of video'
    ],
    rules: [
      'Do not close or minimize video while playing',
      'Limit 5 videos per day'
    ],
    active: true
  },
  {
    id: 'task-6',
    title: 'Rate EarnX 5 Stars on Google Play',
    category: 'Community',
    reward: 20,
    timeRequired: '1 Min',
    difficulty: 'Easy',
    completionCount: '31.5k Completed',
    badge: '⭐ Special',
    iconName: 'Sparkles',
    themeColor: 'from-amber-400 to-yellow-500',
    description: 'Write a genuine 5-star review on the Play Store helping our community grow and unlock ₹20 instant cash.',
    taskUrl: 'https://play.google.com/store/apps/details?id=com.earnx.rewards.app',
    steps: [
      'Tap "Rate on Play Store"',
      'Give 5 stars & leave a positive comment',
      'Submit the review',
      'Return to EarnX to claim ₹20 bonus'
    ],
    rules: [
      'Must submit a real rating',
      'Bonus credited only once per user'
    ],
    active: true
  }
];
