import { TaskItem, INITIAL_TASKS } from '../components/tasks/taskData';
import { WithdrawalTransaction } from '../components/WithdrawalScreen';
import { PersonalDetails } from '../components/PersonalDetailsScreen';
import { getRegisteredUsers } from './authStorage';
import { OfferwallPartner, OfferItem, OFFERWALL_PARTNERS } from '../components/offerwall/offerwallData';

export interface AdminUserRecord {
  phone: string;
  fullName: string;
  email: string;
  gender: string;
  dob: string;
  walletBalance: number;
  totalEarned: number;
  totalWithdrawn: number;
  status: 'active' | 'suspended' | 'flagged';
  joinedDate: string;
  tasksCompleted: number;
  referralCode: string;
  referredBy?: string;
  referralCount: number;
}

export interface CouponRecord {
  id?: string;
  code: string;
  rewardAmount?: number;
  amount?: number;
  minEarnedRequired?: number;
  maxUses: number;
  usedCount: number;
  status?: 'active' | 'expired' | 'disabled';
  isActive?: boolean;
  expiryDate: string;
  createdDate?: string;
  createdAt?: string;
  description?: string;
}

export interface AppGlobalConfig {
  appName: string;
  adminPin?: string;
  supportWhatsapp?: string;
  telegramChannel?: string;
  spinWheelValues?: number[];
  dailyCheckInBonus?: number;
  scratchCardMin?: number;
  scratchCardMax?: number;
  referralBonus?: number;
  referralCommissionPercent?: number;
  minWithdrawalInr?: number;
  upiEnabled?: boolean;
  bankTransferEnabled?: boolean;
  maintenanceMessage?: string;
  minWithdrawalUpi: number;
  minWithdrawalBank: number;
  minWithdrawalRecharge: number;
  minWithdrawalQr?: number;
  maxDailyWithdrawal: number;
  maintenanceMode: boolean;
  allowNewRegistrations: boolean;
  referralBonusInviter: number;
  referralBonusInvitee: number;
  spinWheelCost: number;
  dailyStreakBaseReward: number;
  supportTelegram: string;
  supportEmail: string;
  supportWhatsApp?: string;
  isWhatsAppSupportEnabled?: boolean;
  marqueeText?: string;
  isMarqueeEnabled?: boolean;
}

export interface FraudUserRecord {
  id: string;
  userId?: string;
  userName?: string;
  userPhone: string;
  ipAddress: string;
  deviceId: string;
  duplicateAccountsCount?: number;
  vpnDetected?: boolean;
  riskScore: number;
  severity?: 'high' | 'medium' | 'low';
  reason?: string;
  detectedAt?: string;
  status: 'clean' | 'flagged' | 'banned' | 'blocked' | 'pardoned';
  detectedReasons: string[];
  lastActivity?: string;
  isWithdrawalLocked?: boolean;
  deviceModel?: string;
  osVersion?: string;
  isRooted?: boolean;
  isp?: string;
  city?: string;
  country?: string;
  linkedAccounts?: { phone: string; name: string; balance: number; status: string }[];
  frozenBalance?: number;
  category?: 'clone' | 'vpn' | 'bot' | 'referral' | 'emulator' | 'proof_tamper';
  flaggedTimestamp?: string;
}

export interface BroadcastNotification {
  id: string;
  title: string;
  message: string;
  type: string;
  targetAudience?: 'all' | 'new_users' | 'active_today' | string;
  target?: string;
  badge?: string;
  actionUrl?: string;
  isActive?: boolean;
  createdAt?: string;
  date?: string;
  sentAt?: string;
  status?: string;
  readCount?: number;
  reachCount?: number;
  viewsCount?: number;
}

export interface TaskProofSubmission {
  id: string;
  taskId: string;
  taskTitle: string;
  userId: string;
  userName: string;
  userPhone: string;
  rewardAmount: number;
  screenshotUrl: string;
  userNote?: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewedAt?: string;
  rejectReason?: string;
}

export interface AppBanner {
  id: string;
  title: string;
  subtitle: string;
  tag: string;
  imageUrl?: string;
  gradient: string;
  buttonText?: string;
  targetType: 'task' | 'offerwall' | 'spin' | 'scratch' | 'referral' | 'support' | 'external';
  targetValue?: string;
  isActive: boolean;
  order: number;
  clicks: number;
}

export interface SupportTicket {
  id: string;
  userId?: string;
  userName?: string;
  userPhone: string;
  subject: string;
  category?: 'withdrawal' | 'task_credit' | 'referral' | 'account' | 'general' | string;
  status: 'open' | 'in_progress' | 'resolved';
  priority?: 'low' | 'medium' | 'high';
  createdAt?: string;
  date?: string;
  messages?: {
    id: string;
    sender: 'user' | 'support';
    text: string;
    timestamp: string;
  }[];
  adminReply?: string;
  message?: string;
  repliedAt?: string;
}

export interface OfferwallConversion {
  id: string;
  partnerId?: string;
  partnerName?: string;
  offerwallName?: string;
  offerId?: string;
  offerTitle?: string;
  campaignName?: string;
  userId?: string;
  userName?: string;
  userPhone: string;
  subId?: string;
  rewardAmount?: number;
  payoutAmount?: number;
  payoutInr?: number;
  status: 'credited' | 'pending' | 'reversed';
  timestamp?: string;
  date?: string;
  txHash?: string;
}

const ADMIN_USERS_KEY = 'earnx_admin_users_db_v1';
const ADMIN_WITHDRAWALS_KEY = 'earnx_admin_withdrawals_v1';
const ADMIN_TASKS_KEY = 'earnx_admin_tasks_v1';
const ADMIN_COUPONS_KEY = 'earnx_admin_coupons_v1';
const ADMIN_CONFIG_KEY = 'earnx_admin_config_v1';
const ADMIN_AUTH_KEY = 'earnx_admin_auth_session_v1';
const STORAGE_KEY_OFFERWALLS = 'earnx_admin_offerwalls_v1';
const STORAGE_KEY_OFFERWALL_CONVERSIONS = 'earnx_admin_offerwall_conversions_v1';

export const DEFAULT_APP_CONFIG: AppGlobalConfig = {
  appName: 'EarnX Rewards',
  minWithdrawalUpi: 50,
  minWithdrawalBank: 100,
  minWithdrawalRecharge: 20,
  maxDailyWithdrawal: 5000,
  maintenanceMode: false,
  allowNewRegistrations: true,
  referralBonusInviter: 20,
  referralBonusInvitee: 10,
  spinWheelCost: 0,
  dailyStreakBaseReward: 5,
  supportTelegram: '@EarnXSupportOfficial',
  supportEmail: 'earnxofficials@gmail.com',
  supportWhatsApp: '+919876543210',
  isWhatsAppSupportEnabled: true
};

export const DEFAULT_ADMIN_USERS: Record<string, AdminUserRecord> = {
  '9876543210': {
    phone: '9876543210',
    fullName: 'Rahul Sharma',
    email: 'rahul@example.com',
    gender: 'male',
    dob: '2000-05-15',
    walletBalance: 125,
    totalEarned: 475,
    totalWithdrawn: 350,
    status: 'active',
    joinedDate: '10 Aug 2026',
    tasksCompleted: 14,
    referralCode: 'EARNX50',
    referralCount: 6
  },
  '9123456780': {
    phone: '9123456780',
    fullName: 'Priya Patel',
    email: 'priya.p@gmail.com',
    gender: 'female',
    dob: '2001-08-22',
    walletBalance: 240,
    totalEarned: 890,
    totalWithdrawn: 650,
    status: 'active',
    joinedDate: '14 Aug 2026',
    tasksCompleted: 26,
    referralCode: 'PRIYA100',
    referredBy: 'EARNX50',
    referralCount: 12
  },
  '9898989898': {
    phone: '9898989898',
    fullName: 'Amit Kumar Verma',
    email: 'amit.verma@outlook.com',
    gender: 'male',
    dob: '1998-11-03',
    walletBalance: 45,
    totalEarned: 320,
    totalWithdrawn: 275,
    status: 'active',
    joinedDate: '16 Aug 2026',
    tasksCompleted: 9,
    referralCode: 'AMIT99',
    referredBy: 'EARNX50',
    referralCount: 2
  },
  '9012345678': {
    phone: '9012345678',
    fullName: 'Vikramaditya Singh',
    email: 'vikram.singh@gmail.com',
    gender: 'male',
    dob: '1996-03-12',
    walletBalance: 510,
    totalEarned: 1540,
    totalWithdrawn: 1030,
    status: 'active',
    joinedDate: '05 Aug 2026',
    tasksCompleted: 42,
    referralCode: 'VIKRAM01',
    referralCount: 28
  },
  '9765432109': {
    phone: '9765432109',
    fullName: 'Sneha Roy',
    email: 'sneha.roy99@yahoo.com',
    gender: 'female',
    dob: '2002-09-18',
    walletBalance: 15,
    totalEarned: 95,
    totalWithdrawn: 80,
    status: 'flagged',
    joinedDate: '18 Aug 2026',
    tasksCompleted: 3,
    referralCode: 'SNEHA88',
    referralCount: 0
  }
};

export const DEFAULT_WITHDRAWAL_REQUESTS: (WithdrawalTransaction & { userPhone: string; userName: string })[] = [
  {
    id: 'TXN-998241',
    userPhone: '9123456780',
    userName: 'Priya Patel',
    amountInr: 200,
    method: 'upi',
    details: 'priyap@icici',
    status: 'processing',
    date: '20 Aug 2026',
    time: '08:15 PM',
    txHash: 'REQ/2026/998241'
  },
  {
    id: 'TXN-998102',
    userPhone: '9012345678',
    userName: 'Vikramaditya Singh',
    amountInr: 500,
    method: 'bank',
    details: 'SBI Bank (A/C: **** 8821 | IFSC: SBIN0001245)',
    status: 'processing',
    date: '20 Aug 2026',
    time: '07:42 PM',
    txHash: 'REQ/2026/998102'
  },
  {
    id: 'TXN-997930',
    userPhone: '9876543210',
    userName: 'Rahul Sharma',
    amountInr: 50,
    method: 'upi',
    details: 'rahul.sharma@okaxis',
    status: 'processing',
    date: '20 Aug 2026',
    time: '06:10 PM',
    txHash: 'REQ/2026/997930'
  },
  {
    id: 'TXN-984210',
    userPhone: '9876543210',
    userName: 'Rahul Sharma',
    amountInr: 100,
    method: 'upi',
    details: 'rahul.sharma@okaxis',
    status: 'success',
    date: '19 Aug 2026',
    time: '06:30 PM',
    txHash: 'UPI/2026/89410382'
  },
  {
    id: 'TXN-983192',
    userPhone: '9876543210',
    userName: 'Rahul Sharma',
    amountInr: 50,
    method: 'qr',
    details: 'PhonePe QR (Rahul Sharma)',
    status: 'success',
    date: '16 Aug 2026',
    time: '11:15 AM',
    txHash: 'QR/92841094'
  }
];

export const DEFAULT_COUPONS: CouponRecord[] = [
  {
    id: 'coup-1',
    code: 'EARNX50',
    rewardAmount: 50,
    minEarnedRequired: 0,
    maxUses: 500,
    usedCount: 241,
    status: 'active',
    expiryDate: '2026-12-31',
    createdDate: '2026-08-01'
  },
  {
    id: 'coup-2',
    code: 'BONUS100',
    rewardAmount: 100,
    minEarnedRequired: 50,
    maxUses: 200,
    usedCount: 184,
    status: 'active',
    expiryDate: '2026-09-30',
    createdDate: '2026-08-10'
  },
  {
    id: 'coup-3',
    code: 'SPECIAL25',
    rewardAmount: 25,
    minEarnedRequired: 0,
    maxUses: 1000,
    usedCount: 890,
    status: 'active',
    expiryDate: '2026-10-15',
    createdDate: '2026-08-15'
  }
];

export const getAdminUsers = (): Record<string, AdminUserRecord> => {
  try {
    const data = localStorage.getItem(ADMIN_USERS_KEY);
    if (!data) {
      localStorage.setItem(ADMIN_USERS_KEY, JSON.stringify(DEFAULT_ADMIN_USERS));
      return DEFAULT_ADMIN_USERS;
    }
    return JSON.parse(data);
  } catch {
    return DEFAULT_ADMIN_USERS;
  }
};

export const saveAdminUsers = (users: Record<string, AdminUserRecord>): void => {
  localStorage.setItem(ADMIN_USERS_KEY, JSON.stringify(users));
};

export const getAdminWithdrawals = (): (WithdrawalTransaction & { userPhone: string; userName: string })[] => {
  try {
    const data = localStorage.getItem(ADMIN_WITHDRAWALS_KEY);
    if (!data) {
      localStorage.setItem(ADMIN_WITHDRAWALS_KEY, JSON.stringify(DEFAULT_WITHDRAWAL_REQUESTS));
      return DEFAULT_WITHDRAWAL_REQUESTS;
    }
    return JSON.parse(data);
  } catch {
    return DEFAULT_WITHDRAWAL_REQUESTS;
  }
};

export const saveAdminWithdrawals = (list: (WithdrawalTransaction & { userPhone: string; userName: string })[]): void => {
  localStorage.setItem(ADMIN_WITHDRAWALS_KEY, JSON.stringify(list));
};

export const getAdminTasks = (): TaskItem[] => {
  try {
    const data = localStorage.getItem(ADMIN_TASKS_KEY);
    if (!data) {
      localStorage.setItem(ADMIN_TASKS_KEY, JSON.stringify(INITIAL_TASKS));
      return INITIAL_TASKS;
    }
    return JSON.parse(data);
  } catch {
    return INITIAL_TASKS;
  }
};

export const saveAdminTasks = (tasks: TaskItem[]): void => {
  localStorage.setItem(ADMIN_TASKS_KEY, JSON.stringify(tasks));
};

export const getAdminCoupons = (): CouponRecord[] => {
  try {
    const data = localStorage.getItem(ADMIN_COUPONS_KEY);
    if (!data) {
      localStorage.setItem(ADMIN_COUPONS_KEY, JSON.stringify(DEFAULT_COUPONS));
      return DEFAULT_COUPONS;
    }
    return JSON.parse(data);
  } catch {
    return DEFAULT_COUPONS;
  }
};

export const saveAdminCoupons = (coupons: CouponRecord[]): void => {
  localStorage.setItem(ADMIN_COUPONS_KEY, JSON.stringify(coupons));
};

export const getAppConfig = (): AppGlobalConfig => {
  try {
    const data = localStorage.getItem(ADMIN_CONFIG_KEY);
    if (!data) {
      localStorage.setItem(ADMIN_CONFIG_KEY, JSON.stringify(DEFAULT_APP_CONFIG));
      return DEFAULT_APP_CONFIG;
    }
    return JSON.parse(data);
  } catch {
    return DEFAULT_APP_CONFIG;
  }
};

export const saveAppConfig = (config: AppGlobalConfig): void => {
  localStorage.setItem(ADMIN_CONFIG_KEY, JSON.stringify(config));
};

const STORAGE_KEY_FRAUD_RECORDS = 'earnx_fraud_records_v1';
const STORAGE_KEY_BROADCASTS = 'earnx_broadcasts_v1';
const STORAGE_KEY_TASK_PROOFS = 'earnx_task_proofs_v1';
const STORAGE_KEY_BANNERS = 'earnx_banners_v1';
const STORAGE_KEY_TICKETS = 'earnx_tickets_v1';

export const DEFAULT_FRAUD_RECORDS: FraudUserRecord[] = [
  {
    id: 'FRD-101',
    userId: 'u-9941',
    userName: 'Ramesh FakeCloner',
    userPhone: '+91 91234 56789',
    ipAddress: '103.21.244.12',
    deviceId: 'DEV-SM-A515F-89B2',
    deviceModel: 'Samsung Galaxy A51',
    osVersion: 'Android 11 (Dual Space Mod)',
    isRooted: true,
    isp: 'M247 Ltd (NordVPN Datacenter)',
    city: 'Frankfurt / Proxy Relay',
    country: 'IN (Masked)',
    duplicateAccountsCount: 5,
    vpnDetected: true,
    riskScore: 92,
    severity: 'high',
    status: 'flagged',
    category: 'clone',
    frozenBalance: 420,
    flaggedTimestamp: '21 Aug 2026, 05:42 PM',
    detectedReasons: [
      '5 accounts on same Device ID (Hardware Hash match)',
      'NordVPN proxy IP detected (Port 1194)',
      'Rapid referral claim in 2 mins across 5 dummy SIMs',
      'DualSpace App Cloner signature detected'
    ],
    linkedAccounts: [
      { phone: '+91 91234 56789', name: 'Ramesh FakeCloner', balance: 420, status: 'flagged' },
      { phone: '+91 91234 56780', name: 'Ramesh Clone 1', balance: 180, status: 'flagged' },
      { phone: '+91 91234 56781', name: 'Ramesh Clone 2', balance: 150, status: 'flagged' },
      { phone: '+91 91234 56782', name: 'Ramesh Clone 3', balance: 90, status: 'flagged' },
      { phone: '+91 91234 56783', name: 'Ramesh Clone 4', balance: 60, status: 'flagged' }
    ],
    lastActivity: '12 mins ago',
    isWithdrawalLocked: true,
  },
  {
    id: 'FRD-102',
    userId: 'u-8812',
    userName: 'Vikram Botnet',
    userPhone: '+91 98888 77777',
    ipAddress: '45.14.71.9',
    deviceId: 'DEV-REDMI-NOTE10-A1',
    deviceModel: 'Redmi Note 10 Pro',
    osVersion: 'Android 12 (Magisk Root)',
    isRooted: true,
    isp: 'DigitalOcean Cloud Proxy',
    city: 'Bengaluru DC',
    country: 'IN',
    duplicateAccountsCount: 3,
    vpnDetected: true,
    riskScore: 78,
    severity: 'high',
    status: 'flagged',
    category: 'bot',
    frozenBalance: 650,
    flaggedTimestamp: '21 Aug 2026, 04:30 PM',
    detectedReasons: [
      'Automated tap macro script (<180ms reaction time on Lucky Spin)',
      'Multiple OTP requests with virtual 2ndLine VoIP numbers',
      'Accessibility service auto-clicker detected (ClickAssistant v4.1)'
    ],
    linkedAccounts: [
      { phone: '+91 98888 77777', name: 'Vikram Botnet', balance: 650, status: 'flagged' },
      { phone: '+91 98888 77778', name: 'Vikram Alt 1', balance: 210, status: 'flagged' }
    ],
    lastActivity: '1 hour ago',
    isWithdrawalLocked: true,
  },
  {
    id: 'FRD-103',
    userId: 'u-7731',
    userName: 'Pooja Sharma',
    userPhone: '+91 94444 33333',
    ipAddress: '157.34.192.81',
    deviceId: 'DEV-ONEPLUS-9R-C2',
    deviceModel: 'OnePlus 9R 5G',
    osVersion: 'Android 14 (Stock OxygenOS)',
    isRooted: false,
    isp: 'Reliance Jio Infocomm Ltd (Mobile LTE/5G)',
    city: 'Mumbai, MH',
    country: 'IN',
    duplicateAccountsCount: 1,
    vpnDetected: false,
    riskScore: 15,
    severity: 'low',
    status: 'clean',
    category: 'clone',
    frozenBalance: 0,
    flaggedTimestamp: '21 Aug 2026, 05:50 PM',
    detectedReasons: [
      'Verified Jio 5G consumer ASN (AS55836)',
      'Organic human play time & standard gyroscope motion verified',
      'Valid UPI ID linked with matching KYC name'
    ],
    linkedAccounts: [
      { phone: '+91 94444 33333', name: 'Pooja Sharma', balance: 340, status: 'clean' }
    ],
    lastActivity: '4 mins ago',
    isWithdrawalLocked: false,
  },
  {
    id: 'FRD-104',
    userId: 'u-6619',
    userName: 'Akash Spammer',
    userPhone: '+91 97777 11111',
    ipAddress: '185.220.101.5',
    deviceId: 'DEV-EMULATOR-NOX-00',
    deviceModel: 'NoxPlayer Virtual Tablet',
    osVersion: 'Android 9.0 (x86_64 Emulator)',
    isRooted: true,
    isp: 'Tor Exit Relay Node (Luxembourg)',
    city: 'Anonymous Proxy',
    country: 'LU',
    duplicateAccountsCount: 9,
    vpnDetected: true,
    riskScore: 99,
    severity: 'high',
    status: 'banned',
    category: 'emulator',
    frozenBalance: 1250,
    flaggedTimestamp: '20 Aug 2026, 11:20 PM',
    detectedReasons: [
      'Nox Android PC Virtualization & fake IMEI generator detected',
      'Tor Exit Node IP with high anonymity packet headers',
      'Tampered APK signature / Frida hook memory injection attempt'
    ],
    linkedAccounts: [
      { phone: '+91 97777 11111', name: 'Akash Spammer', balance: 1250, status: 'banned' },
      { phone: '+91 97777 11112', name: 'Akash Bot 1', balance: 400, status: 'banned' },
      { phone: '+91 97777 11113', name: 'Akash Bot 2', balance: 350, status: 'banned' }
    ],
    lastActivity: 'Yesterday',
    isWithdrawalLocked: true,
  },
  {
    id: 'FRD-105',
    userId: 'u-5542',
    userName: 'Suraj FakeProof',
    userPhone: '+91 96543 21890',
    ipAddress: '117.201.44.18',
    deviceId: 'DEV-VIVO-V20-99F1',
    deviceModel: 'Vivo V20 2021',
    osVersion: 'Android 11 (Funtouch OS)',
    isRooted: false,
    isp: 'Bharti Airtel Broadband',
    city: 'Delhi, DL',
    country: 'IN',
    duplicateAccountsCount: 2,
    vpnDetected: false,
    riskScore: 68,
    severity: 'medium',
    status: 'flagged',
    category: 'proof_tamper',
    frozenBalance: 290,
    flaggedTimestamp: '21 Aug 2026, 02:15 PM',
    detectedReasons: [
      'Uploaded duplicate recycled task screenshot (MD5 Hash collision with 4 other tasks)',
      'EXIF metadata timestamp does not match task start time',
      'Image edited in PixelLab before uploading'
    ],
    linkedAccounts: [
      { phone: '+91 96543 21890', name: 'Suraj FakeProof', balance: 290, status: 'flagged' }
    ],
    lastActivity: '3 hours ago',
    isWithdrawalLocked: true,
  }
];

export const DEFAULT_BROADCASTS: BroadcastNotification[] = [
  {
    id: 'BC-01',
    title: '  Instant UPI Withdrawals Active!',
    message: 'All pending bank & UPI withdrawals have been processed successfully. Min withdrawal is  50 with 0% fee.',
    type: 'push',
    targetAudience: 'all',
    badge: '  Payment Update',
    isActive: true,
    createdAt: '2 hours ago',
    viewsCount: 4120,
  },
  {
    id: 'BC-02',
    title: '  2X Sunday Mega Bonus Extravaganza',
    message: 'Complete 2 app install tasks today and unlock a mystery scratch card worth up to  100 cash bonus!',
    type: 'popup_dialog',
    targetAudience: 'all',
    badge: '  Mega Event',
    isActive: true,
    createdAt: 'Today 9:00 AM',
    viewsCount: 6890,
  },
  {
    id: 'BC-03',
    title: '  New Angel One Task Added (+ 75)',
    message: 'Highest rewarding finance task is now live! Complete KYC and receive  75 instant direct wallet cash.',
    type: 'top_banner',
    targetAudience: 'new_users',
    badge: '  High Reward',
    isActive: true,
    createdAt: 'Yesterday',
    viewsCount: 2310,
  }
];

export const DEFAULT_TASK_PROOFS: TaskProofSubmission[] = [
  {
    id: 'PRF-801',
    taskId: 'task-3',
    taskTitle: 'Angel One - Free Demat Account KYC',
    userId: 'u-101',
    userName: 'Rahul Sharma',
    userPhone: '+91 98765 43210',
    rewardAmount: 75,
    screenshotUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=600&q=80',
    userNote: 'Completed full e-KYC and Demat opened with client ID: ANGEL9821. Please verify and approve.',
    submittedAt: '15 mins ago',
    status: 'pending',
  },
  {
    id: 'PRF-802',
    taskId: 'task-1',
    taskTitle: 'PhonePe - Register & Link Bank',
    userId: 'u-102',
    userName: 'Priya Patel',
    userPhone: '+91 91234 56780',
    rewardAmount: 25,
    screenshotUrl: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=600&q=80',
    userNote: 'Installed and linked SBI UPI account. First test transaction done.',
    submittedAt: '35 mins ago',
    status: 'pending',
  },
  {
    id: 'PRF-803',
    taskId: 'task-2',
    taskTitle: 'Zomato - First Food Order',
    userId: 'u-103',
    userName: 'Amit Kumar Verma',
    userPhone: '+91 98989 89898',
    rewardAmount: 50,
    screenshotUrl: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=600&q=80',
    userNote: 'Delivered order #ZM-9842. Cash on delivery invoice attached.',
    submittedAt: '2 hours ago',
    status: 'approved',
    reviewedAt: '1 hour ago'
  }
];

export const DEFAULT_BANNERS: AppBanner[] = [
  {
    id: 'BAN-01',
    title: 'Spin & Win Cash Jackpot',
    subtitle: 'Win up to  500 directly to your UPI ID every day!',
    tag: '  Daily Jackpot',
    imageUrl: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=800&q=80',
    gradient: 'from-[#4B63FF] via-indigo-600 to-[#3549EC]',
    buttonText: 'Play Spin & Win',
    targetType: 'spin',
    isActive: true,
    order: 1,
    clicks: 4320
  },
  {
    id: 'BAN-02',
    title: 'Instant UPI Cashout (0% Fee)',
    subtitle: 'Transfer your wallet cash to PhonePe, GPay or Paytm in 60s',
    tag: '  60s Transfer',
    imageUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=800&q=80',
    gradient: 'from-amber-500 via-orange-500 to-rose-600',
    buttonText: 'Withdraw Cash',
    targetType: 'task',
    isActive: true,
    order: 2,
    clicks: 3890
  },
  {
    id: 'BAN-03',
    title: 'Invite Friends & Earn  20',
    subtitle: '+ 10% Lifetime passive commission on every task they finish',
    tag: '  Unlimited Cash',
    imageUrl: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=800&q=80',
    gradient: 'from-emerald-500 via-teal-600 to-emerald-700',
    buttonText: 'Invite Friends',
    targetType: 'referral',
    isActive: true,
    order: 3,
    clicks: 2940
  },
  {
    id: 'BAN-04',
    title: 'CPALead High Reward Offerwall',
    subtitle: 'Download top trending games & apps to earn  50 -  250 per task',
    tag: '  Top Offers',
    imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
    gradient: 'from-purple-600 via-fuchsia-600 to-indigo-700',
    buttonText: 'Explore Offerwall',
    targetType: 'offerwall',
    isActive: true,
    order: 4,
    clicks: 1850
  }
];

export const DEFAULT_TICKETS: SupportTicket[] = [
  {
    id: 'TCK-501',
    userId: 'u-101',
    userName: 'Rahul Sharma',
    userPhone: '+91 98765 43210',
    subject: 'UPI Withdrawal Status Query',
    category: 'withdrawal',
    status: 'open',
    priority: 'high',
    createdAt: '25 mins ago',
    messages: [
      {
        id: 'msg-1',
        sender: 'user',
        text: 'Hello admin, I requested  50 UPI transfer 30 mins ago. Please check when it will be credited to rahul.sharma@okaxis.',
        timestamp: '25 mins ago'
      }
    ]
  },
  {
    id: 'TCK-502',
    userId: 'u-102',
    userName: 'Priya Patel',
    userPhone: '+91 91234 56780',
    subject: 'Task bonus not credited for video ad',
    category: 'task_credit',
    status: 'in_progress',
    priority: 'medium',
    createdAt: '2 hours ago',
    messages: [
      {
        id: 'msg-1',
        sender: 'user',
        text: 'I watched the 30s sponsor video but did not receive  5 in my balance.',
        timestamp: '2 hours ago'
      },
      {
        id: 'msg-2',
        sender: 'support',
        text: 'Hi Priya, we have verified your video watch session.  5 bonus has been manually credited to your wallet!',
        timestamp: '1 hour ago'
      }
    ]
  },
  {
    id: 'TCK-503',
    userId: 'u-103',
    userName: 'Amit Kumar Verma',
    userPhone: '+91 98989 89898',
    subject: 'How do I redeem promo code?',
    category: 'general',
    status: 'resolved',
    priority: 'low',
    createdAt: 'Yesterday',
    messages: [
      {
        id: 'msg-1',
        sender: 'user',
        text: 'Where is the option to enter EARNX50 promo code?',
        timestamp: 'Yesterday'
      },
      {
        id: 'msg-2',
        sender: 'support',
        text: 'Hi Amit, go to the Promo Coupon section or click Redeem Code to get instant cash bonus!',
        timestamp: 'Yesterday'
      }
    ]
  }
];

export const getAdminFraudRecords = (): FraudUserRecord[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY_FRAUD_RECORDS);
    return data ? JSON.parse(data) : DEFAULT_FRAUD_RECORDS;
  } catch {
    return DEFAULT_FRAUD_RECORDS;
  }
};

export const saveAdminFraudRecords = (records: FraudUserRecord[]): void => {
  localStorage.setItem(STORAGE_KEY_FRAUD_RECORDS, JSON.stringify(records));
};

export const getAdminBroadcasts = (): BroadcastNotification[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY_BROADCASTS);
    return data ? JSON.parse(data) : DEFAULT_BROADCASTS;
  } catch {
    return DEFAULT_BROADCASTS;
  }
};

export const saveAdminBroadcasts = (broadcasts: BroadcastNotification[]): void => {
  localStorage.setItem(STORAGE_KEY_BROADCASTS, JSON.stringify(broadcasts));
};

export const getAdminTaskProofs = (): TaskProofSubmission[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY_TASK_PROOFS);
    return data ? JSON.parse(data) : DEFAULT_TASK_PROOFS;
  } catch {
    return DEFAULT_TASK_PROOFS;
  }
};

export const saveAdminTaskProofs = (proofs: TaskProofSubmission[]): void => {
  localStorage.setItem(STORAGE_KEY_TASK_PROOFS, JSON.stringify(proofs));
};

export const getAdminBanners = (): AppBanner[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY_BANNERS);
    return data ? JSON.parse(data) : DEFAULT_BANNERS;
  } catch {
    return DEFAULT_BANNERS;
  }
};

export const saveAdminBanners = (banners: AppBanner[]): void => {
  localStorage.setItem(STORAGE_KEY_BANNERS, JSON.stringify(banners));
};

export const DEFAULT_ADMIN_OFFERWALLS: OfferwallPartner[] = OFFERWALL_PARTNERS.map(partner => ({
  ...partner,
  isActive: true,
  apiKey: partner.id === 'adgate' ? 'adg_live_8910x99' : partner.id === 'ayet' ? 'ayet_sec_4412k' : partner.id === 'bitlabs' ? 'bl_api_99017x' : 'trx_pub_77210z',
  secretKey: 'postback_sec_' + partner.id + '_2026',
  postbackUrl: `https://earnx.app/api/postback/${partner.id}?user_id={sub1}&reward={amount}&tx_id={trans_id}&sig={signature}`,
  userRevenuePercent: 75,
  sdkMode: 'iframe',
  offers: partner.offers.map(o => ({ ...o, active: true }))
}));

export const DEFAULT_OFFERWALL_CONVERSIONS: OfferwallConversion[] = [
  {
    id: 'PB-9901',
    partnerId: 'adgate',
    partnerName: 'AdGate Rewards',
    offerId: 'ad-1',
    offerTitle: 'Lord Mobile: Reach Castle Lvl 14',
    userId: '9123456780',
    userName: 'Priya Patel',
    userPhone: '9123456780',
    rewardAmount: 180,
    payoutAmount: 240,
    status: 'credited',
    timestamp: '15 mins ago',
    txHash: 'ADG/TX/8879102'
  },
  {
    id: 'PB-9902',
    partnerId: 'ayet',
    partnerName: 'AyeT Studios',
    offerId: 'ay-1',
    offerTitle: 'Candy Crush Soda: Complete 50 Levels',
    userId: '9012345678',
    userName: 'Vikramaditya Singh',
    userPhone: '9012345678',
    rewardAmount: 120,
    payoutAmount: 160,
    status: 'credited',
    timestamp: '1 hour ago',
    txHash: 'AYET/TX/5512093'
  },
  {
    id: 'PB-9903',
    partnerId: 'bitlabs',
    partnerName: 'BitLabs Surveys',
    offerId: 'bl-1',
    offerTitle: 'Automotive & Travel Preferences',
    userId: '9876543210',
    userName: 'Rahul Sharma',
    userPhone: '9876543210',
    rewardAmount: 40,
    payoutAmount: 55,
    status: 'credited',
    timestamp: '3 hours ago',
    txHash: 'BL/TX/1109482'
  },
  {
    id: 'PB-9904',
    partnerId: 'torox',
    partnerName: 'Torox Offerwall',
    offerId: 'tx-1',
    offerTitle: 'Rise of Kingdoms: Level 17 City Hall',
    userId: '9898989898',
    userName: 'Amit Kumar Verma',
    userPhone: '9898989898',
    rewardAmount: 350,
    payoutAmount: 460,
    status: 'credited',
    timestamp: 'Yesterday',
    txHash: 'TRX/TX/9931821'
  }
];

export const getAdminOfferwalls = (): OfferwallPartner[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY_OFFERWALLS);
    if (!data) {
      localStorage.setItem(STORAGE_KEY_OFFERWALLS, JSON.stringify(DEFAULT_ADMIN_OFFERWALLS));
      return DEFAULT_ADMIN_OFFERWALLS;
    }
    return JSON.parse(data);
  } catch {
    return DEFAULT_ADMIN_OFFERWALLS;
  }
};

export const saveAdminOfferwalls = (offerwalls: OfferwallPartner[]): void => {
  localStorage.setItem(STORAGE_KEY_OFFERWALLS, JSON.stringify(offerwalls));
};

export const getAdminOfferwallConversions = (): OfferwallConversion[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY_OFFERWALL_CONVERSIONS);
    return data ? JSON.parse(data) : DEFAULT_OFFERWALL_CONVERSIONS;
  } catch {
    return DEFAULT_OFFERWALL_CONVERSIONS;
  }
};

export const saveAdminOfferwallConversions = (conversions: OfferwallConversion[]): void => {
  localStorage.setItem(STORAGE_KEY_OFFERWALL_CONVERSIONS, JSON.stringify(conversions));
};

export const getAdminTickets = (): SupportTicket[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY_TICKETS);
    return data ? JSON.parse(data) : DEFAULT_TICKETS;
  } catch {
    return DEFAULT_TICKETS;
  }
};

export const saveAdminTickets = (tickets: SupportTicket[]): void => {
  localStorage.setItem(STORAGE_KEY_TICKETS, JSON.stringify(tickets));
};

export const isAdminAuthenticated = (): boolean => {
  try {
    return localStorage.getItem(ADMIN_AUTH_KEY) === 'true';
  } catch {
    return false;
  }
};

export const setAdminAuthenticated = (val: boolean): void => {
  if (val) {
    localStorage.setItem(ADMIN_AUTH_KEY, 'true');
  } else {
    localStorage.removeItem(ADMIN_AUTH_KEY);
  }
};

export const saveAdminConfig = saveAppConfig;
export const getAdminConfig = getAppConfig;

export const resetAdminStorageToFactoryDefaults = (): void => {
  try {
    localStorage.removeItem(ADMIN_USERS_KEY);
    localStorage.removeItem(ADMIN_WITHDRAWALS_KEY);
    localStorage.removeItem(ADMIN_TASKS_KEY);
    localStorage.removeItem(ADMIN_COUPONS_KEY);
    localStorage.removeItem(ADMIN_CONFIG_KEY);
    localStorage.removeItem(STORAGE_KEY_FRAUD_RECORDS);
    localStorage.removeItem(STORAGE_KEY_BROADCASTS);
    localStorage.removeItem(STORAGE_KEY_TASK_PROOFS);
    localStorage.removeItem(STORAGE_KEY_BANNERS);
    localStorage.removeItem(STORAGE_KEY_TICKETS);
    localStorage.removeItem(STORAGE_KEY_OFFERWALLS);
    localStorage.removeItem(STORAGE_KEY_OFFERWALL_CONVERSIONS);
  } catch (e) {
    console.error('Error resetting admin storage', e);
  }
};
