import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  CheckSquare, 
  Tag, 
  Gift, 
  Settings, 
  ArrowLeft, 
  Bell, 
  ShieldCheck, 
  LogOut, 
  ExternalLink,
  ChevronRight,
  Sparkles,
  Smartphone,
  Menu,
  X,
  Search,
  ShieldAlert, 
  Radio, 
  CheckCircle, 
  Image as ImageIcon, 
  LifeBuoy, 
  BarChart3,
  Sun,
  Moon,
  Flame,
  Tv
} from 'lucide-react';
import { 
  getAdminUsers, 
  saveAdminUsers,
  getAdminWithdrawals, 
  saveAdminWithdrawals,
  getAdminTasks, 
  saveAdminTasks,
  getAdminCoupons, 
  saveAdminCoupons,
  getAppConfig, 
  saveAppConfig,
  DEFAULT_ADMIN_USERS,
  DEFAULT_WITHDRAWAL_REQUESTS,
  DEFAULT_COUPONS,
  DEFAULT_APP_CONFIG,
  isAdminAuthenticated, 
  setAdminAuthenticated,
  getAdminFraudRecords,
  saveAdminFraudRecords,
  getAdminBroadcasts,
  saveAdminBroadcasts,
  getAdminTaskProofs,
  saveAdminTaskProofs,
  getAdminBanners,
  saveAdminBanners,
  getAdminTickets,
  saveAdminTickets,
  getAdminOfferwalls,
  saveAdminOfferwalls,
  getAdminOfferwallConversions,
  saveAdminOfferwallConversions,
  DEFAULT_ADMIN_OFFERWALLS,
  DEFAULT_OFFERWALL_CONVERSIONS
} from '../../utils/adminStorage';
import { INITIAL_TASKS } from '../tasks/taskData';
import { AdminOverviewTab } from './AdminOverviewTab';
import { AdminWithdrawalsTab } from './AdminWithdrawalsTab';
import { AdminUsersTab } from './AdminUsersTab';
import { AdminTasksTab } from './AdminTasksTab';
import { AdminCouponsTab } from './AdminCouponsTab';
import { AdminRewardsTab } from './AdminRewardsTab';
import { AdminSettingsTab } from './AdminSettingsTab';
import { AdminFraudTab } from './AdminFraudTab';
import { AdminBroadcastTab } from './AdminBroadcastTab';
import { AdminBannersTab } from './AdminBannersTab';
import { AdminSupportTab } from './AdminSupportTab';
import { AdminRevenueTab } from './AdminRevenueTab';
import { AdminOfferwallsTab } from './AdminOfferwallsTab';
import { AdsManagementTab } from './AdsManagementTab';
import { AdminLoginScreen } from './AdminLoginScreen';
import { AdminThemeProvider, useAdminTheme } from './AdminThemeContext';

interface AdminPortalProps {
  onSwitchToUserApp: () => void;
}

const AdminPortalContent: React.FC<AdminPortalProps> = ({ onSwitchToUserApp }) => {
  const { theme, isDark, toggleTheme } = useAdminTheme();
  const [isAuthenticated, setIsAuthenticated] = useState(isAdminAuthenticated());
  const [activeTab, setActiveTab] = useState<
    'overview' | 'withdrawals' | 'users' | 'ads' | 'offerwalls' | 'tasks' | 'coupons' | 'rewards' | 'settings' | 'fraud' | 'broadcast' | 'task_proofs' | 'banners' | 'support' | 'revenue'
  >('overview');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // States
  const [users, setUsers] = useState(getAdminUsers());
  const [withdrawals, setWithdrawals] = useState(getAdminWithdrawals());
  const [tasks, setTasks] = useState(getAdminTasks());
  const [coupons, setCoupons] = useState(getAdminCoupons());
  const [config, setConfig] = useState(getAppConfig());
  const [fraudRecords, setFraudRecords] = useState(getAdminFraudRecords());
  const [broadcasts, setBroadcasts] = useState(getAdminBroadcasts());
  const [taskProofs, setTaskProofs] = useState(getAdminTaskProofs());
  const [banners, setBanners] = useState(getAdminBanners());
  const [tickets, setTickets] = useState(getAdminTickets());
  const [offerwalls, setOfferwalls] = useState(getAdminOfferwalls());
  const [offerwallConversions, setOfferwallConversions] = useState(getAdminOfferwallConversions());

  // Toast Helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Updaters
  const handleUpdateUsers = (newUsers: typeof users) => {
    setUsers(newUsers);
    saveAdminUsers(newUsers);
  };

  const handleUpdateWithdrawals = (newList: typeof withdrawals) => {
    setWithdrawals(newList);
    saveAdminWithdrawals(newList);
  };

  const handleUpdateTasks = (newTasks: typeof tasks) => {
    setTasks(newTasks);
    saveAdminTasks(newTasks);
  };

  const handleUpdateCoupons = (newCoupons: typeof coupons) => {
    setCoupons(newCoupons);
    saveAdminCoupons(newCoupons);
  };

  const handleUpdateConfig = (newConfig: typeof config) => {
    setConfig(newConfig);
    saveAppConfig(newConfig);
  };

  const handleUpdateFraudRecords = (records: typeof fraudRecords) => {
    setFraudRecords(records);
    saveAdminFraudRecords(records);
  };

  const handleUpdateBroadcasts = (list: typeof broadcasts) => {
    setBroadcasts(list);
    saveAdminBroadcasts(list);
  };

  const handleUpdateTaskProofs = (proofsList: typeof taskProofs) => {
    setTaskProofs(proofsList);
    saveAdminTaskProofs(proofsList);
  };

  const handleUpdateBanners = (bannersList: typeof banners) => {
    setBanners(bannersList);
    saveAdminBanners(bannersList);
  };

  const handleUpdateTickets = (ticketsList: typeof tickets) => {
    setTickets(ticketsList);
    saveAdminTickets(ticketsList);
  };

  const handleUpdateOfferwalls = (offerwallsList: typeof offerwalls) => {
    setOfferwalls(offerwallsList);
    saveAdminOfferwalls(offerwallsList);
  };

  const handleUpdateOfferwallConversions = (conversionsList: typeof offerwallConversions) => {
    setOfferwallConversions(conversionsList);
    saveAdminOfferwallConversions(conversionsList);
  };

  const handleResetAllData = () => {
    setUsers(DEFAULT_ADMIN_USERS);
    saveAdminUsers(DEFAULT_ADMIN_USERS);
    setWithdrawals(DEFAULT_WITHDRAWAL_REQUESTS);
    saveAdminWithdrawals(DEFAULT_WITHDRAWAL_REQUESTS);
    setTasks(INITIAL_TASKS);
    saveAdminTasks(INITIAL_TASKS);
    setCoupons(DEFAULT_COUPONS);
    saveAdminCoupons(DEFAULT_COUPONS);
    setConfig(DEFAULT_APP_CONFIG);
    saveAppConfig(DEFAULT_APP_CONFIG);
    setOfferwalls(DEFAULT_ADMIN_OFFERWALLS);
    saveAdminOfferwalls(DEFAULT_ADMIN_OFFERWALLS);
    setOfferwallConversions(DEFAULT_OFFERWALL_CONVERSIONS);
    saveAdminOfferwallConversions(DEFAULT_OFFERWALL_CONVERSIONS);
  };

  const handleLogoutAdmin = () => {
    setAdminAuthenticated(false);
    setIsAuthenticated(false);
  };

  // If Admin is not logged in, render the secure AdminLoginScreen
  if (!isAuthenticated) {
    return (
      <AdminLoginScreen 
        onLoginSuccess={() => {
          setIsAuthenticated(true);
          showToast('  Welcome back, Admin! Session authenticated.');
        }}
        onBackToUserApp={onSwitchToUserApp}
      />
    );
  }

  const pendingWithdrawalCount = withdrawals.filter(w => w.status === 'processing').length;
  const highRiskCount = fraudRecords.filter(f => f.riskScore >= 75).length;
  const pendingProofCount = taskProofs.filter(p => p.status === 'pending').length;
  const openTicketsCount = tickets.filter(t => t.status === 'open').length;

  const navItems = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    { 
      id: 'withdrawals', 
      label: 'Withdrawal Requests', 
      icon: CreditCard, 
      badge: pendingWithdrawalCount > 0 ? pendingWithdrawalCount : undefined,
      badgeColor: 'bg-amber-500 text-white'
    },
    { 
      id: 'fraud', 
      label: 'Anti-Fraud & Risk', 
      icon: ShieldAlert, 
      badge: highRiskCount > 0 ? `${highRiskCount} Risk` : undefined,
      badgeColor: 'bg-rose-500 text-white'
    },
    { 
      id: 'tasks', 
      label: 'Tasks & Proofs', 
      icon: CheckSquare, 
      badge: pendingProofCount > 0 ? `${pendingProofCount} Proofs` : `${tasks.length}`,
      badgeColor: pendingProofCount > 0 ? 'bg-amber-500 text-slate-950 font-bold' : undefined
    },
    { id: 'broadcast', label: 'Push & Notices', icon: Radio },
    { id: 'banners', label: 'Promotion Sliders', icon: ImageIcon, badge: banners.length },
    { 
      id: 'support', 
      label: 'Customer Support', 
      icon: LifeBuoy, 
      badge: openTicketsCount > 0 ? openTicketsCount : undefined,
      badgeColor: 'bg-sky-500 text-white'
    },
    { id: 'revenue', label: 'Revenue Analytics', icon: BarChart3 },
    { 
      id: 'ads', 
      label: 'Ads & Mediation', 
      icon: Tv, 
      badge: 'Active',
      badgeColor: 'bg-purple-600 text-white'
    },
    { 
      id: 'offerwalls', 
      label: 'Offerwall Networks', 
      icon: Flame, 
      badge: `${offerwalls.filter(o => o.isActive !== false).length} Live`,
      badgeColor: 'bg-rose-500 text-white'
    },
    { id: 'users', label: 'User Directory', icon: Users, badge: Object.keys(users).length },
    { id: 'coupons', label: 'Promo Coupons', icon: Tag, badge: coupons.length },
    { id: 'rewards', label: 'Reward Games', icon: Gift },
    { id: 'settings', label: 'App Settings', icon: Settings }
  ];

  return (
    <div className={`min-h-screen w-full flex flex-col md:flex-row font-sans transition-colors duration-200 ${
      isDark ? 'bg-[#0B0F19] text-slate-100 selection:bg-indigo-500 selection:text-white' : 'bg-[#F1F5F9] text-slate-900 selection:bg-indigo-100 selection:text-indigo-900'
    }`}>
      {/* Toast Notification */}
      {toastMessage && (
        <div className={`fixed top-5 right-5 z-50 px-4 py-3 rounded-2xl border shadow-2xl text-xs font-bold flex items-center gap-2 animate-in fade-in slide-in-from-top duration-300 ${
          isDark ? 'bg-slate-900 text-white border-slate-700' : 'bg-white text-slate-900 border-slate-200'
        }`}>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Sidebar Navigation */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 border-r flex flex-col justify-between transition-transform duration-300
        md:translate-x-0 md:static
        ${isDark ? 'bg-[#111827] border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'}
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Logo & Brand Header */}
        <div>
          <div className={`p-5 border-b flex items-center justify-between ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-indigo-500 to-primary flex items-center justify-center font-black text-white shadow-md text-base">
                X
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h1 className={`text-base font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>EarnX Portal</h1>
                  <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded-md border ${
                    isDark ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30' : 'bg-indigo-50 text-indigo-600 border-indigo-200'
                  }`}>
                    Admin
                  </span>
                </div>
                <p className={`text-[10px] font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Enterprise Management</p>
              </div>
            </div>
            {/* Mobile close button */}
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className={`p-1 rounded-lg md:hidden cursor-pointer ${isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-600'}`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`admin-nav-${item.id}`}
                  onClick={() => {
                    setActiveTab(item.id as any);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full px-3.5 py-2.5 rounded-2xl flex items-center justify-between text-xs font-bold transition-all cursor-pointer ${
                    isActive 
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' 
                      : isDark
                      ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : isDark ? 'text-slate-400' : 'text-slate-500'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                      item.badgeColor || (isActive ? 'bg-indigo-700 text-white' : isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-200 text-slate-700')
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer / Switch back to User App & Theme Switcher */}
        <div className={`p-4 border-t space-y-3 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
          {/* Quick Theme Toggle in Sidebar */}
          <button
            onClick={toggleTheme}
            className={`w-full py-2 px-3 rounded-2xl border text-xs font-bold flex items-center justify-between cursor-pointer transition-all ${
              isDark 
                ? 'bg-slate-800/80 border-slate-700 text-slate-200 hover:bg-slate-700' 
                : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <div className="flex items-center gap-2">
              {isDark ? <Moon className="w-3.5 h-3.5 text-indigo-400" /> : <Sun className="w-3.5 h-3.5 text-amber-500" />}
              <span>{isDark ? 'Dark Theme' : 'Light Theme'}</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 font-extrabold uppercase">
              Switch
            </span>
          </button>

          <button
            id="btn-switch-to-user-app"
            onClick={onSwitchToUserApp}
            className="w-full py-2.5 px-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <Smartphone className="w-4 h-4" />
            <span>Open User App</span>
          </button>

          <div className={`p-2.5 rounded-xl border flex items-center justify-between ${
            isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-indigo-500 text-white text-[10px] font-bold flex items-center justify-center">
                AD
              </div>
              <div className="text-left">
                <div className={`text-[11px] font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>Admin Root</div>
                <div className="text-[9px] text-emerald-500 font-mono">  Online</div>
              </div>
            </div>
            <button
              onClick={handleLogoutAdmin}
              title="Logout Admin"
              className={`p-1 rounded-md cursor-pointer ${isDark ? 'text-slate-400 hover:text-rose-400' : 'text-slate-500 hover:text-rose-600'}`}
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col min-w-0 min-h-screen transition-colors duration-200 ${
        isDark ? 'bg-[#0B0F19] text-slate-100' : 'bg-[#F1F5F9] text-slate-900'
      }`}>
        {/* Top Navbar */}
        <header className={`sticky top-0 z-30 backdrop-blur-md border-b px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4 transition-colors ${
          isDark ? 'bg-[#111827]/90 border-slate-800 text-white' : 'bg-white/90 border-slate-200 text-slate-900'
        }`}>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className={`p-2 rounded-xl md:hidden cursor-pointer ${
                isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-200' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <h2 className={`text-base font-black capitalize tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {activeTab === 'overview' ? 'Command Center Dashboard' : activeTab.replace('_', ' ')}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Theme Toggle Button in Header */}
            <button
              onClick={toggleTheme}
              id="admin-theme-toggle"
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-black cursor-pointer transition-all ${
                isDark 
                  ? 'bg-slate-800 border-slate-700 text-amber-400 hover:bg-slate-700' 
                  : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {isDark ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline">Light Mode</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-indigo-600" />
                  <span className="hidden sm:inline">Dark Mode</span>
                </>
              )}
            </button>

            <button
              onClick={onSwitchToUserApp}
              className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold cursor-pointer transition-all ${
                isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-200' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5 text-indigo-500" />
              <span>User App View</span>
            </button>

            <button
              onClick={handleLogoutAdmin}
              title="Sign Out of Admin"
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 text-xs font-black border border-rose-500/30 cursor-pointer transition-all"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        {/* Dynamic Content Container */}
        <main className="p-4 sm:p-6 lg:p-8 flex-1 max-w-7xl w-full mx-auto">
          {activeTab === 'overview' && (
            <AdminOverviewTab
              users={users}
              withdrawals={withdrawals}
              config={config}
              onNavigateTab={(tab) => setActiveTab(tab as any)}
            />
          )}

          {activeTab === 'withdrawals' && (
            <AdminWithdrawalsTab
              withdrawals={withdrawals}
              onUpdateWithdrawals={handleUpdateWithdrawals}
              showToast={showToast}
            />
          )}

          {activeTab === 'fraud' && (
            <AdminFraudTab
              fraudRecords={fraudRecords}
              onUpdateFraudRecords={handleUpdateFraudRecords}
              users={users}
              onUpdateUsers={handleUpdateUsers}
              showToast={showToast}
            />
          )}

          {(activeTab === 'tasks' || (activeTab as any) === 'task_proofs') && (
            <AdminTasksTab
              tasks={tasks}
              onUpdateTasks={handleUpdateTasks}
              proofs={taskProofs}
              onUpdateProofs={handleUpdateTaskProofs}
              users={users}
              onUpdateUsers={handleUpdateUsers}
              showToast={showToast}
            />
          )}

          {activeTab === 'broadcast' && (
            <AdminBroadcastTab
              broadcasts={broadcasts}
              onUpdateBroadcasts={handleUpdateBroadcasts}
              config={config}
              onUpdateConfig={handleUpdateConfig}
              showToast={showToast}
            />
          )}

          {activeTab === 'banners' && (
            <AdminBannersTab
              banners={banners}
              onUpdateBanners={handleUpdateBanners}
              showToast={showToast}
            />
          )}

          {activeTab === 'support' && (
            <AdminSupportTab
              tickets={tickets}
              onUpdateTickets={handleUpdateTickets}
              showToast={showToast}
            />
          )}

          {activeTab === 'revenue' && (
            <AdminRevenueTab
              users={users}
              withdrawals={withdrawals}
            />
          )}

          {activeTab === 'ads' && (
            <AdsManagementTab />
          )}

          {activeTab === 'offerwalls' && (
            <AdminOfferwallsTab
              offerwalls={offerwalls}
              onUpdateOfferwalls={handleUpdateOfferwalls}
              conversions={offerwallConversions}
              onUpdateConversions={handleUpdateOfferwallConversions}
              users={users}
              onUpdateUsers={handleUpdateUsers}
              showToast={showToast}
            />
          )}

          {activeTab === 'users' && (
            <AdminUsersTab
              users={users}
              onUpdateUsers={handleUpdateUsers}
              showToast={showToast}
            />
          )}

          {activeTab === 'coupons' && (
            <AdminCouponsTab
              coupons={coupons}
              onUpdateCoupons={handleUpdateCoupons}
              showToast={showToast}
            />
          )}

          {activeTab === 'rewards' && (
            <AdminRewardsTab
              config={config}
              onUpdateConfig={handleUpdateConfig}
              showToast={showToast}
            />
          )}

          {activeTab === 'settings' && (
            <AdminSettingsTab
              config={config}
              onUpdateConfig={handleUpdateConfig}
              showToast={showToast}
              onResetAllData={handleResetAllData}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export const AdminPortal: React.FC<AdminPortalProps> = (props) => {
  return (
    <AdminThemeProvider>
      <AdminPortalContent {...props} />
    </AdminThemeProvider>
  );
};
