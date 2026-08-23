import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bell, 
  Home as HomeIcon, 
  CheckSquare, 
  Gift, 
  Users, 
  User as UserIcon, 
  Zap, 
  Flame, 
  ChevronRight, 
  Share2,
  ArrowRight, 
  Copy, 
  LogOut, 
  HelpCircle, 
  X, 
  RotateCw, 
  Wallet, 
  ShieldCheck, 
  Send,
  UserCheck,
  TrendingUp,
  Clock,
  Sparkles,
  Volume2,
  VolumeX,
  Vibrate,
  Smartphone,
  MessageCircle,
  Phone,
  KeyRound,
  Lock,
  FileText,
  Receipt,
  Trophy
} from 'lucide-react';
import { soundHaptics } from '../utils/soundHaptics';
import { PersonalDetails } from './PersonalDetailsScreen';
import { ReferralHistoryScreen } from './ReferralHistoryScreen';
import { WithdrawalScreen } from './WithdrawalScreen';
import { CustomerSupportScreen } from './CustomerSupportScreen';
import { SetWithdrawalPinScreen } from './SetWithdrawalPinScreen';
import { TermsAndPrivacyScreen } from './TermsAndPrivacyScreen';
import { PassbookHistoryScreen } from './PassbookHistoryScreen';
import { LeaderboardScreen } from './LeaderboardScreen';
import { RewardCenter } from './rewards/RewardCenter';
import { TaskCenterSection } from './tasks/TaskCenterSection';
import { OfferwallSection } from './offerwall/OfferwallSection';
import { getAppConfig, getAdminBanners, saveAdminBanners, AppBanner } from '../utils/adminStorage';
import { hasUserWithdrawalPin } from '../utils/authStorage';

interface MainHomeScreenProps {
  userPhone: string;
  userDetails: PersonalDetails | null;
  onLogout: () => void;
  onPreviewSplash?: () => void;
  onOpenAdmin?: () => void;
}

export const MainHomeScreen: React.FC<MainHomeScreenProps> = ({
  userPhone,
  userDetails,
  onLogout,
  onPreviewSplash,
  onOpenAdmin
}) => {
  const [activeTab, setActiveTab] = useState<'home' | 'task' | 'reward' | 'refer' | 'account'>('home');
  // Direct Cash Balance in INR (₹)
  const [balance, setBalance] = useState(userDetails?.referralCode ? 50 : 25);
  const [claimedDailyStreak, setClaimedDailyStreak] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showReferralHistory, setShowReferralHistory] = useState(false);
  const [showWithdrawalPage, setShowWithdrawalPage] = useState(false);
  const [showPassbookPage, setShowPassbookPage] = useState(false);
  const [showLeaderboardPage, setShowLeaderboardPage] = useState(false);
  const [showSetPinPage, setShowSetPinPage] = useState(false);
  const [showSupportPage, setShowSupportPage] = useState(false);
  const [showTermsPage, setShowTermsPage] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Dynamic admin config and banners
  const appConfig = getAppConfig();
  const dynamicBanners = getAdminBanners().filter(b => b.isActive);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Promotion Slider Banners (fallback to defaults if dynamic empty)
  const promotionSlides: (AppBanner & { icon?: any })[] = dynamicBanners.length > 0 ? dynamicBanners.map((b) => ({
    ...b,
    icon: b.targetType === 'spin' ? Zap : b.targetType === 'referral' ? Users : b.targetType === 'scratch' ? Gift : Flame
  })) : [
    {
      id: 'BAN-01',
      tag: "🔥 DAILY JACKPOT",
      title: "Spin & Win Cash Jackpot",
      subtitle: "Win up to ₹500 directly to your UPI ID every day!",
      gradient: "from-[#4B63FF] via-[#3D56F5] to-[#2034C9]",
      imageUrl: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=800&q=80",
      buttonText: "Play Spin & Win",
      targetType: "spin",
      isActive: true,
      order: 1,
      clicks: 120,
      icon: Zap
    },
    {
      id: 'BAN-02',
      tag: "⚡ 60s TRANSFER",
      title: "Instant UPI Cashout (0% Fee)",
      subtitle: "Transfer wallet cash to PhonePe, GPay or Paytm in 60s",
      gradient: "from-amber-500 via-orange-500 to-rose-600",
      imageUrl: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=800&q=80",
      buttonText: "Withdraw Cash",
      targetType: "task",
      isActive: true,
      order: 2,
      clicks: 85,
      icon: Flame
    },
    {
      id: 'BAN-03',
      tag: "🎁 UNLIMITED CASH",
      title: "Invite Friends & Earn ₹20",
      subtitle: "+ 10% Lifetime passive commission on every task they finish",
      gradient: "from-emerald-500 via-teal-600 to-emerald-700",
      imageUrl: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=800&q=80",
      buttonText: "Invite Friends",
      targetType: "referral",
      isActive: true,
      order: 3,
      clicks: 210,
      icon: Users
    }
  ];

  const handleBannerAction = (banner: AppBanner) => {
    // Increment click count in storage
    const allBanners = getAdminBanners();
    const updated = allBanners.map(b => b.id === banner.id ? { ...b, clicks: (b.clicks || 0) + 1 } : b);
    saveAdminBanners(updated);

    // Route target
    switch (banner.targetType) {
      case 'spin':
      case 'scratch':
        setActiveTab('reward');
        break;
      case 'task':
      case 'offerwall':
        setActiveTab('task');
        break;
      case 'referral':
        setActiveTab('refer');
        break;
      case 'support':
        setShowSupportPage(true);
        break;
      case 'external':
        if (banner.targetValue) {
          window.open(banner.targetValue, '_blank');
        } else {
          showToast('Opening promotion...');
        }
        break;
      default:
        setActiveTab('reward');
    }
  };

  // Auto-slide carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % promotionSlides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [promotionSlides.length]);

  const handleClaimStreak = () => {
    if (claimedDailyStreak) return;
    setClaimedDailyStreak(true);
    setBalance((prev) => prev + 5);
    showToast('🎉 Daily Streak claimed! +₹5 Cash added to wallet.');
  };

  const handleTaskEarn = (amount: number, title: string) => {
    setBalance((prev) => prev + amount);
    showToast(`🎉 "${title}" completed! +₹${amount} Cash added.`);
  };

  const notifications = [
    { id: 1, title: 'Welcome Bonus Credited', desc: '₹25 signup cash added to your wallet.', time: 'Just now', unread: true },
    { id: 2, title: 'Instant UPI Withdrawal Active', desc: 'Min cashout is ₹20 with 0% fee.', time: '10m ago', unread: false },
    { id: 3, title: 'Day 1 Streak Ready', desc: 'Claim +₹5 daily check-in cash bonus.', time: '1h ago', unread: false },
  ];

  return (
    <div id="earn-main-container" className="w-full h-full max-h-[100dvh] bg-[#EDF2F7] flex justify-center text-slate-800 overflow-hidden relative">
      {/* Background ambient decorative blurs for glassmorphism refraction */}
      <div className="absolute -top-12 -left-12 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-12 w-64 h-64 bg-indigo-400/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 left-1/3 w-64 h-64 bg-amber-400/15 rounded-full blur-3xl pointer-events-none" />

      {/* Clean Full-Screen Mobile Shell */}
      <div 
        id="earn-main-shell"
        className="w-full max-w-md h-full max-h-[100dvh] bg-slate-50/70 backdrop-blur-md text-slate-800 relative flex flex-col shadow-2xl border-x border-white/60 overflow-hidden z-10"
      >
        {showReferralHistory ? (
          <ReferralHistoryScreen 
            onBack={() => setShowReferralHistory(false)} 
            onShareWhatsApp={() => {
              const text = encodeURIComponent("Hey! Join EarnX using my referral code and earn instant ₹50 cash rewards! Download now.");
              window.open(`https://wa.me/?text=${text}`, '_blank');
            }}
          />
        ) : showWithdrawalPage ? (
          <WithdrawalScreen 
            balance={balance}
            userPhone={userPhone}
            userDetails={userDetails || {
              fullName: 'EarnX User',
              email: '',
              dob: '',
              gender: 'male',
              referralCode: ''
            }}
            onBack={() => setShowWithdrawalPage(false)}
            onWithdrawalSuccess={(amountDeducted) => {
              setBalance(prev => prev - amountDeducted);
              showToast(`✅ ₹${amountDeducted} Withdrawal request approved & processed!`);
            }}
          />
        ) : showPassbookPage ? (
          <PassbookHistoryScreen 
            userPhone={userPhone}
            balance={balance}
            onBack={() => setShowPassbookPage(false)}
            showToast={showToast}
          />
        ) : showLeaderboardPage ? (
          <LeaderboardScreen 
            userPhone={userPhone}
            userDetails={userDetails}
            userBalance={balance}
            onBack={() => setShowLeaderboardPage(false)}
            showToast={showToast}
          />
        ) : showSetPinPage ? (
          <SetWithdrawalPinScreen 
            userPhone={userPhone}
            userDetails={userDetails}
            onBack={() => setShowSetPinPage(false)}
            showToast={showToast}
          />
        ) : showSupportPage ? (
          <CustomerSupportScreen 
            userPhone={userPhone}
            userDetails={userDetails}
            onClose={() => setShowSupportPage(false)}
            showToast={showToast}
          />
        ) : showTermsPage ? (
          <TermsAndPrivacyScreen 
            onBack={() => setShowTermsPage(false)}
          />
        ) : (
          <>
        {/* ========================================================================= */}
        {/* 1. TOP NAVIGATION BAR (WHITE GLASSMORPHISM) */}
        {/* ========================================================================= */}
        <header className="shrink-0 px-4 py-3 border-b border-white/60 bg-white/80 backdrop-blur-xl z-40 flex items-center justify-between shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)]">
          
          {/* LEFT: Logo + App Name */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-primary-gradient p-0.5 shadow-sm flex items-center justify-center">
              <div className="w-full h-full rounded-[10px] bg-gradient-to-br from-[#4B63FF] via-[#3D56F5] to-[#3549EC] flex items-center justify-center text-white">
                <Wallet className="w-4 h-4" />
              </div>
            </div>
            <div className="flex flex-col text-left">
              <h1 className="text-lg font-black tracking-tight text-slate-900 font-outfit leading-none">
                Earn<span className="text-gradient">X</span>
              </h1>
              <span className="text-[9px] font-bold text-slate-400 tracking-wider">CASH REWARDS</span>
            </div>
          </div>

          {/* RIGHT: Balance Pill + Notification Icon + Admin Portal */}
          <div className="flex items-center gap-2">
            {/* Admin Portal Quick Access */}
            {onOpenAdmin && (
              <button
                id="btn-quick-admin-portal"
                onClick={onOpenAdmin}
                title="Open Admin Portal"
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-indigo-50 hover:bg-indigo-100 border border-indigo-200/80 text-indigo-700 font-extrabold text-[11px] transition-all cursor-pointer shadow-xs"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                <span>Admin</span>
              </button>
            )}
            
            {/* Balance Pill */}
            <button 
              onClick={() => setShowWithdrawalPage(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 shadow-xs transition-all cursor-pointer backdrop-blur-sm text-emerald-800"
            >
              <Wallet className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-xs font-black text-slate-900">₹{balance.toFixed(2)}</span>
            </button>

            {/* Notification Bell */}
            <button
              id="notification-bell-btn"
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-full bg-slate-100/80 hover:bg-slate-200/80 text-slate-700 transition-colors cursor-pointer backdrop-blur-sm border border-white/60"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white animate-pulse" />
            </button>
          </div>
        </header>

        {/* TOAST ALERT */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-16 left-4 right-4 z-50 p-3 rounded-2xl bg-slate-900 text-white text-xs font-semibold shadow-xl flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{toastMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ========================================================================= */}
        {/* 2. TAB VIEWS BODY (SCROLLABLE AREA ONLY) */}
        {/* ========================================================================= */}
        <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4 text-left scrollbar-thin overscroll-contain">
          
          {/* ----------------- TAB: HOME ----------------- */}
          {activeTab === 'home' && (
            <div className="space-y-4">
              
              {/* LIVE MARQUEE ANNOUNCEMENT TICKER (Controlled from Admin Portal) */}
              {(appConfig.isMarqueeEnabled ?? true) && (
                <div className="overflow-hidden bg-amber-50/90 border border-amber-200/80 rounded-2xl py-2 px-3 shadow-xs">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-800 whitespace-nowrap">
                    <span className="px-1.5 py-0.5 rounded-md bg-amber-400 text-slate-950 font-black text-[9px] uppercase tracking-wider shrink-0 flex items-center gap-1">
                      <Volume2 className="w-3 h-3 animate-bounce" />
                      <span>Notice</span>
                    </span>
                    <span className="animate-marquee inline-block font-semibold">
                      {appConfig.marqueeText || '🔥 ₹25 Welcome Bonus credited! Complete tasks & withdraw directly via UPI & Bank.'}
                    </span>
                  </div>
                </div>
              )}

              {/* PROMOTION SLIDER (CAROUSEL WITH IMAGE SUPPORT) */}
              <div className="relative rounded-3xl overflow-hidden shadow-lg shadow-[#4B63FF]/15 group">
                <div className="w-full">
                  {promotionSlides.map((slide, idx) => {
                    if (idx !== currentSlide) return null;
                    const IconComponent = slide.icon || Zap;
                    return (
                      <motion.div
                        key={slide.id}
                        initial={{ opacity: 0, scale: 0.97 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.97 }}
                        transition={{ duration: 0.35 }}
                        className={`relative p-4 sm:p-5 rounded-3xl text-white overflow-hidden flex flex-col justify-between min-h-[168px] ${
                          !slide.imageUrl ? `bg-gradient-to-br ${slide.gradient || 'from-[#4B63FF] to-[#2034C9]'}` : 'bg-slate-900'
                        }`}
                      >
                        {/* Background Promo Image */}
                        {slide.imageUrl && (
                          <img 
                            src={slide.imageUrl} 
                            alt={slide.title}
                            referrerPolicy="no-referrer"
                            className="absolute inset-0 w-full h-full object-cover select-none"
                          />
                        )}
                        {/* High-Legibility Dark Contrast Gradients */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/30 pointer-events-none" />
                        <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />
                        
                        {/* Top: Tag + Action Icon */}
                        <div className="flex items-start justify-between relative z-10">
                          <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-xs bg-amber-400 text-slate-950">
                            {slide.tag || '🔥 PROMO'}
                          </span>
                          <div className="p-2 rounded-2xl bg-white/20 backdrop-blur-md border border-white/20">
                            <IconComponent className="w-4 h-4 text-white" />
                          </div>
                        </div>

                        {/* Middle: Title & Subtitle */}
                        <div className="space-y-1 relative z-10 my-2">
                          <h3 className="text-base sm:text-lg font-black tracking-tight leading-tight drop-shadow-md text-white">
                            {slide.title}
                          </h3>
                          <p className="text-[11px] text-white/90 font-medium line-clamp-2 max-w-[280px] drop-shadow-xs">
                            {slide.subtitle}
                          </p>
                        </div>

                        {/* Bottom: Action CTA Button + Dots Pagination */}
                        <div className="flex items-center justify-between relative z-10 pt-1">
                          <button
                            onClick={() => handleBannerAction(slide)}
                            className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-100 active:scale-95 text-slate-900 text-xs font-black shadow-md flex items-center gap-1.5 cursor-pointer transition-all"
                          >
                            <span>{slide.buttonText || 'Claim Now'}</span>
                            <ArrowRight className="w-3.5 h-3.5 text-[#3549EC]" />
                          </button>

                          {/* Dots indicator */}
                          <div className="flex items-center gap-1.5">
                            {promotionSlides.map((_, dotIdx) => (
                              <button
                                key={dotIdx}
                                onClick={() => setCurrentSlide(dotIdx)}
                                aria-label={`Go to slide ${dotIdx + 1}`}
                                className={`h-1.5 rounded-full transition-all cursor-pointer ${
                                  currentSlide === dotIdx ? 'w-5 bg-white' : 'w-1.5 bg-white/40 hover:bg-white/70'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* QUICK EARN SECTION */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Featured Games</h4>
                  <button 
                    onClick={() => setActiveTab('reward')}
                    className="text-[11px] font-bold text-[#4B63FF] hover:underline cursor-pointer"
                  >
                    View All
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  {/* Game 1: Lucky Spin */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setActiveTab('reward')}
                    className="p-3 rounded-2xl bg-white/80 border border-slate-200/60 shadow-xs cursor-pointer group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="p-2 rounded-xl bg-indigo-50 text-[#4B63FF]">
                        <RotateCw className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-extrabold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md">
                        +₹50 Max
                      </span>
                    </div>
                    <div className="text-xs font-black text-slate-800 group-hover:text-[#4B63FF] transition-colors">
                      Lucky Spin
                    </div>
                    <div className="text-[10px] text-slate-400">Spin & win instant cash</div>
                  </motion.div>

                  {/* Game 2: Scratch Card */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setActiveTab('reward')}
                    className="p-3 rounded-2xl bg-white/80 border border-slate-200/60 shadow-xs cursor-pointer group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="p-2 rounded-xl bg-amber-50 text-amber-500">
                        <Gift className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-extrabold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md">
                        +₹35 Max
                      </span>
                    </div>
                    <div className="text-xs font-black text-slate-800 group-hover:text-[#4B63FF] transition-colors">
                      Scratch Card
                    </div>
                    <div className="text-[10px] text-slate-400">Mystery cash box</div>
                  </motion.div>
                </div>
              </div>

              {/* PARTNER OFFERWALL SECTION PREVIEW */}
              <OfferwallSection onEarn={handleTaskEarn} showToast={showToast} />

              {/* QUICK WITHDRAW BANNER */}
              <div 
                onClick={() => setShowWithdrawalPage(true)}
                className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50/60 to-emerald-50 border border-emerald-200/80 shadow-xs flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-emerald-500 text-white shrink-0 shadow-xs">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-extrabold text-emerald-950">Instant UPI Transfer</div>
                    <div className="text-[10px] text-emerald-700/80 font-medium">Min withdrawal ₹20 (0% Fee)</div>
                  </div>
                </div>
                <div className="flex items-center text-emerald-700 text-xs font-bold gap-0.5">
                  <span>Withdraw</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>

            </div>
          )}

          {/* ----------------- TAB: TASK ----------------- */}
          {activeTab === 'task' && (
            <div className="space-y-4">
              <TaskCenterSection onEarn={handleTaskEarn} showToast={showToast} />
              <OfferwallSection onEarn={handleTaskEarn} showToast={showToast} />
            </div>
          )}

          {/* ----------------- TAB: REWARD (REWARD CENTER) ----------------- */}
          {activeTab === 'reward' && (
            <RewardCenter 
              onEarn={(amt, reason) => {
                setBalance(prev => prev + amt);
              }}
              onOpenWithdraw={() => setShowWithdrawalPage(true)}
              showToast={showToast}
            />
          )}

          {/* ----------------- TAB: REFERRAL ----------------- */}
          {activeTab === 'refer' && (
            <div className="space-y-3.5">
              {/* Hero Banner */}
              <div className="p-5 rounded-3xl bg-gradient-to-br from-rose-500 via-pink-600 to-indigo-600 text-white shadow-lg shadow-rose-500/20 text-center space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md mx-auto flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-black font-outfit">Refer & Earn ₹50 Cash</h3>
                <p className="text-xs text-white/80 max-w-xs mx-auto">
                  Invite friends to EarnX. Earn instant ₹50 cash for every friend who joins!
                </p>
              </div>

              {/* Referral Statistics Counters */}
              <div className="space-y-2">
                <div className="flex items-center justify-between px-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Referral Statistics
                  </span>
                  <button
                    onClick={() => setShowReferralHistory(true)}
                    className="text-xs font-bold text-[#4B63FF] hover:underline flex items-center gap-1 cursor-pointer bg-blue-50/80 px-2.5 py-1 rounded-xl border border-blue-200/60"
                  >
                    <span>View Full History →</span>
                  </button>
                </div>
                
                <div className="grid grid-cols-3 gap-2">
                  {/* Total Friends Invited */}
                  <div className="p-3 rounded-2xl bg-white/85 border border-slate-200/80 shadow-xs flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <div className="w-7 h-7 rounded-xl bg-blue-50 flex items-center justify-center text-[#4B63FF]">
                        <Users className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-[9px] font-extrabold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md font-mono">
                        Active
                      </span>
                    </div>
                    <div className="mt-2">
                      <span className="text-base font-black text-slate-900 font-outfit block">12</span>
                      <span className="text-[10px] font-bold text-slate-400 block leading-tight">Total Friends Invited</span>
                    </div>
                  </div>

                  {/* Total Referral Earnings */}
                  <div className="p-3 rounded-2xl bg-white/85 border border-slate-200/80 shadow-xs flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <div className="w-7 h-7 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                        <TrendingUp className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-[9px] font-extrabold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-md font-mono">
                        Earned
                      </span>
                    </div>
                    <div className="mt-2">
                      <span className="text-base font-black text-emerald-600 font-outfit block">₹600</span>
                      <span className="text-[10px] font-bold text-slate-400 block leading-tight">Total Cash Earned</span>
                    </div>
                  </div>

                  {/* Pending Conversions */}
                  <div className="p-3 rounded-2xl bg-white/85 border border-slate-200/80 shadow-xs flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <div className="w-7 h-7 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                        <Clock className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-[9px] font-extrabold text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded-md font-mono">
                        Tracking
                      </span>
                    </div>
                    <div className="mt-2">
                      <span className="text-base font-black text-slate-900 font-outfit block">3</span>
                      <span className="text-[10px] font-bold text-slate-400 block leading-tight">Pending Friends</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Referral Code Box */}
              <div className="p-4 rounded-3xl bg-white/85 border border-slate-200/80 shadow-xs space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Your Unique Referral Code
                </span>
                
                <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-dashed border-slate-300">
                  <span className="text-sm font-black text-slate-900 tracking-wider font-mono">
                    EARNX{userPhone.slice(-4) || '9999'}
                  </span>
                  <button
                    onClick={() => {
                      navigator.clipboard?.writeText(`EARNX${userPhone.slice(-4) || '9999'}`);
                      showToast('📋 Referral code copied to clipboard!');
                    }}
                    className="flex items-center gap-1 text-xs font-bold text-[#4B63FF] hover:underline cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </button>
                </div>

                <button
                  onClick={() => {
                    const text = encodeURIComponent(`Hey! Join EarnX using my referral code EARNX${userPhone.slice(-4) || '9999'} and get ₹50 free instant bonus cash!`);
                    window.open(`https://wa.me/?text=${text}`, '_blank');
                  }}
                  className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black uppercase tracking-wider shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Share on WhatsApp</span>
                </button>

                <button
                  onClick={() => setShowReferralHistory(true)}
                  className="w-full py-2.5 rounded-2xl bg-blue-50 hover:bg-blue-100 text-[#3549EC] text-xs font-extrabold flex items-center justify-center gap-2 border border-blue-200/80 cursor-pointer transition-colors"
                >
                  <Users className="w-4 h-4 text-[#4B63FF]" />
                  <span>View Referral History & Invited Friends (12)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* How It Works (3 Simple Steps) */}
              <div className="p-4 rounded-3xl bg-white/85 border border-slate-200/80 shadow-xs space-y-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#4B63FF]" />
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">
                    How It Works (3 Simple Steps)
                  </h4>
                </div>

                <div className="space-y-2.5 pt-1">
                  {/* Step 1 */}
                  <div className="flex items-start gap-3 p-2.5 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="w-7 h-7 rounded-xl bg-blue-100 text-[#3549EC] font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                      1
                    </div>
                    <div className="space-y-0.5 flex-1">
                      <div className="flex items-center gap-1.5">
                        <Send className="w-3 h-3 text-[#4B63FF]" />
                        <span className="text-xs font-extrabold text-slate-800">Share Code or Link</span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-snug">
                        Share your referral link/code with friends via WhatsApp or social apps.
                      </p>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="flex items-start gap-3 p-2.5 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="w-7 h-7 rounded-xl bg-blue-100 text-[#3549EC] font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                      2
                    </div>
                    <div className="space-y-0.5 flex-1">
                      <div className="flex items-center gap-1.5">
                        <UserCheck className="w-3 h-3 text-emerald-600" />
                        <span className="text-xs font-extrabold text-slate-800">Friend Installs & Verifies</span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-snug">
                        Friend installs the EarnX app and verifies their mobile number.
                      </p>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="flex items-start gap-3 p-2.5 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-700 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                      3
                    </div>
                    <div className="space-y-0.5 flex-1">
                      <div className="flex items-center gap-1.5">
                        <Gift className="w-3 h-3 text-emerald-600" />
                        <span className="text-xs font-extrabold text-slate-800">Instant Cash Credited</span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-snug">
                        Both get instant cash credited directly to your wallet!
                      </p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* ----------------- TAB: ACCOUNT ----------------- */}
          {activeTab === 'account' && (
            <div className="space-y-3">
              {/* Wallet Balance Card (Top Priority) */}
              <div className="p-4 rounded-3xl bg-gradient-to-br from-[#4B63FF] to-[#3549EC] text-white shadow-md shadow-[#4B63FF]/20 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-xl bg-white/15">
                      <Wallet className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-100">
                      Total Wallet Balance
                    </span>
                  </div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full text-white">
                    100% Real Cash
                  </span>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl font-black font-outfit">₹{balance.toFixed(2)}</span>
                    <span className="text-sm font-bold text-emerald-300">INR</span>
                  </div>
                  <div>
                    <button
                      id="account-withdraw-action-btn"
                      onClick={() => setShowWithdrawalPage(true)}
                      className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-[#3549EC] font-extrabold text-xs shadow-md shadow-black/10 flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Wallet className="w-3.5 h-3.5 text-[#3549EC]" />
                      <span>Withdraw</span>
                    </button>
                  </div>
                </div>
                <div className="pt-2 border-t border-white/20 flex items-center justify-between text-[11px] text-blue-100 font-medium">
                  <div className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                    <span>Instant UPI / Bank Withdrawal</span>
                  </div>
                  <span className="text-emerald-300 font-extrabold text-xs bg-white/10 px-2 py-0.5 rounded-lg border border-white/15">
                    0% Fee
                  </span>
                </div>
              </div>

              {/* Personal Details / User Card */}
              <div className="p-4 rounded-3xl bg-white/85 border border-slate-200/80 shadow-xs flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-primary-gradient p-0.5 shadow-sm flex items-center justify-center shrink-0">
                  <div className="w-full h-full rounded-[14px] bg-gradient-to-br from-[#4B63FF] to-[#3549EC] flex items-center justify-center text-white">
                    <UserIcon className="w-6 h-6" />
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-sm font-extrabold text-slate-900 truncate">
                    {userDetails?.fullName || 'Rahul Sharma'}
                  </h4>
                  <p className="text-xs text-slate-400 font-medium">+91 {userPhone}</p>
                  <p className="text-[11px] text-slate-400 truncate">{userDetails?.email || 'rahul@example.com'}</p>
                </div>
              </div>

              {/* Settings Menu */}
              <div className="p-2 rounded-3xl bg-white/85 border border-slate-200/80 shadow-xs space-y-1">
                <button 
                  id="btn-account-passbook"
                  onClick={() => setShowPassbookPage(true)}
                  className="w-full p-3 rounded-2xl hover:bg-slate-50 flex items-center justify-between text-xs font-bold text-slate-700 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <Receipt className="w-4 h-4 text-[#4B63FF]" />
                    <span>Wallet Passbook & Ledger</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-extrabold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200/60">
                      ₹{balance.toFixed(0)} Statement
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>
                </button>

                <button 
                  id="btn-account-leaderboard"
                  onClick={() => setShowLeaderboardPage(true)}
                  className="w-full p-3 rounded-2xl hover:bg-slate-50 flex items-center justify-between text-xs font-bold text-slate-700 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <Trophy className="w-4 h-4 text-amber-500" />
                    <span>Leaderboard & Top Earners</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-extrabold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/60 flex items-center gap-1">
                      <span>₹10,000 Pool 🏆</span>
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>
                </button>

                <button 
                  id="btn-account-set-pin"
                  onClick={() => setShowSetPinPage(true)}
                  className="w-full p-3 rounded-2xl hover:bg-slate-50 flex items-center justify-between text-xs font-bold text-slate-700 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <KeyRound className="w-4 h-4 text-[#4B63FF]" />
                    <span>Set Withdrawal PIN</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      hasUserWithdrawalPin(userPhone) 
                        ? 'text-emerald-700 bg-emerald-50 border border-emerald-200/60' 
                        : 'text-amber-700 bg-amber-50 border border-amber-200/60'
                    }`}>
                      {hasUserWithdrawalPin(userPhone) ? 'Active 🔒' : 'Set PIN ⚡'}
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>
                </button>

                <button 
                  onClick={() => setShowSupportPage(true)}
                  className="w-full p-3 rounded-2xl hover:bg-slate-50 flex items-center justify-between text-xs font-bold text-slate-700 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <HelpCircle className="w-4 h-4 text-amber-500" />
                    <span>Help & Customer Support</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">24x7 Live</span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>
                </button>

                <button 
                  id="btn-account-terms-privacy"
                  onClick={() => setShowTermsPage(true)}
                  className="w-full p-3 rounded-2xl hover:bg-slate-50 flex items-center justify-between text-xs font-bold text-slate-700 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <FileText className="w-4 h-4 text-indigo-500" />
                    <span>Terms & Privacy Policy</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">v2.4</span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>
                </button>
              </div>

              {/* Separate Standalone Logout Card */}
              <div className="p-2 rounded-3xl bg-white/85 border border-slate-200/80 shadow-xs">
                <button 
                  id="btn-account-logout"
                  onClick={onLogout}
                  className="w-full p-3.5 rounded-2xl hover:bg-rose-50/80 active:bg-rose-100 flex items-center justify-between text-xs font-bold text-rose-600 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-2xl bg-rose-50 border border-rose-200/60 flex items-center justify-center text-rose-600">
                      <LogOut className="w-4 h-4" />
                    </div>
                    <div className="text-left">
                      <span className="font-extrabold text-slate-900 block text-xs">Log Out</span>
                      <span className="text-[10.5px] text-slate-400 font-medium">Safely sign out from this account</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-rose-400" />
                </button>
              </div>

            </div>
          )}

        </div>

        {/* ========================================================================= */}
        {/* FLOATING WHATSAPP SUPPORT CIRCLE BUTTON (Controlled via Admin Settings) */}
        {/* ========================================================================= */}
        {(appConfig.isWhatsAppSupportEnabled ?? true) && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.94 }}
            className="absolute bottom-24 right-4 z-40"
          >
            <button
              onClick={() => {
                const rawNumber = appConfig.supportWhatsApp || '+919876543210';
                const cleanNumber = rawNumber.replace(/[^0-9]/g, '');
                const text = encodeURIComponent(
                  `Hello EarnX Support Team! 👋\nI need help with my EarnX account.\n📱 Mobile: +91 ${userPhone}\n👤 Name: ${userDetails?.fullName || 'User'}`
                );
                window.open(`https://wa.me/${cleanNumber}?text=${text}`, '_blank');
              }}
              title="Chat with Customer Support on WhatsApp"
              aria-label="WhatsApp Support"
              className="relative w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20ba59] active:bg-[#1caa51] text-white shadow-xl shadow-emerald-600/40 border-2 border-white flex items-center justify-center cursor-pointer transition-all group"
            >
              {/* WhatsApp App Icon Composition */}
              <div className="relative flex items-center justify-center">
                <MessageCircle className="w-8 h-8 fill-white text-white" />
                <Phone className="w-4 h-4 text-[#25D366] fill-[#25D366] absolute -rotate-12 translate-x-[-1px] translate-y-[-1px]" />
              </div>
              
              {/* Active Online Ping Indicator */}
              <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-300 border-2 border-white animate-ping" />
              <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-white shadow-xs" />
            </button>
          </motion.div>
        )}

        {/* ========================================================================= */}
        {/* 3. BOTTOM NAVIGATION BAR (WHITE GLASSMORPHISM) */}
        {/* ========================================================================= */}
        <nav className="shrink-0 w-full bg-white/80 backdrop-blur-xl border-t border-white/60 grid grid-cols-5 px-1 py-2 z-30 shadow-[0_-8px_25px_-5px_rgba(0,0,0,0.06)]">
          {[
            { id: 'home', label: 'Home', icon: HomeIcon },
            { id: 'task', label: 'Task', icon: CheckSquare },
            { id: 'reward', label: 'Reward', icon: Gift },
            { id: 'refer', label: 'Referral', icon: Users },
            { id: 'account', label: 'Account', icon: UserIcon },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`nav-${tab.id}-btn`}
                onClick={() => {
                  setActiveTab(tab.id as 'home' | 'task' | 'reward' | 'refer' | 'account');
                }}
                className={`flex flex-col items-center justify-center gap-1 py-1 px-0.5 w-full rounded-xl transition-all cursor-pointer ${
                  isActive ? 'text-[#3549EC]' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <div className={`p-1 rounded-lg transition-transform ${isActive ? 'bg-blue-50/90 scale-105 shadow-xs' : ''}`}>
                  <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                </div>
                <span className={`text-[11px] leading-none whitespace-nowrap text-center ${
                  isActive ? 'font-black tracking-tight' : 'font-semibold'
                }`}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </nav>

        {/* NOTIFICATIONS DRAWER / MODAL */}
        <AnimatePresence>
          {showNotifications && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-start justify-center p-3 pt-14"
            >
              <motion.div
                initial={{ y: -20, scale: 0.95 }}
                animate={{ y: 0, scale: 1 }}
                exit={{ y: -20, scale: 0.95 }}
                className="w-full max-w-sm rounded-[28px] bg-white p-4 shadow-2xl space-y-3 border border-slate-100 text-left"
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-[#4B63FF]" />
                    <h3 className="text-xs font-extrabold text-slate-900">Notifications</h3>
                  </div>
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="p-1 text-slate-400 hover:text-slate-600 rounded-full cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {notifications.map((n) => (
                    <div 
                      key={n.id}
                      className="p-2.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-0.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800">{n.title}</span>
                        <span className="text-[9px] text-slate-400">{n.time}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium">{n.desc}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
          </>
        )}
      </div>
    </div>
  );
};
