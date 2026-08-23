import React, { useState } from 'react';
import { 
  Settings, 
  ShieldAlert, 
  Save, 
  RotateCcw, 
  Lock, 
  HelpCircle, 
  Send, 
  CheckCircle2,
  DollarSign
} from 'lucide-react';
import { 
  AppGlobalConfig, 
  DEFAULT_APP_CONFIG, 
  DEFAULT_ADMIN_USERS, 
  DEFAULT_WITHDRAWAL_REQUESTS, 
  DEFAULT_COUPONS,
  saveAdminUsers,
  saveAdminWithdrawals,
  saveAdminCoupons,
  saveAppConfig
} from '../../utils/adminStorage';
import { INITIAL_TASKS } from '../tasks/taskData';
import { useAdminTheme } from './AdminThemeContext';

interface AdminSettingsTabProps {
  config: AppGlobalConfig;
  onUpdateConfig: (config: AppGlobalConfig) => void;
  showToast: (msg: string) => void;
  onResetAllData?: () => void;
}

export const AdminSettingsTab: React.FC<AdminSettingsTabProps> = ({
  config,
  onUpdateConfig,
  showToast,
  onResetAllData
}) => {
  const { isDark } = useAdminTheme();
  const [formData, setFormData] = useState({ ...config });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateConfig(formData);
    showToast('  Global App Settings saved successfully!');
  };

  const handleReset = () => {
    if (confirm('  Are you sure you want to reset all mock databases to default? This will clear custom tasks and reset balances.')) {
      if (onResetAllData) {
        onResetAllData();
      } else {
        saveAdminUsers(DEFAULT_ADMIN_USERS);
        saveAdminWithdrawals(DEFAULT_WITHDRAWAL_REQUESTS);
        saveAdminCoupons(DEFAULT_COUPONS);
        saveAppConfig(DEFAULT_APP_CONFIG);
      }
      showToast('  Demo Database successfully restored to factory defaults!');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className={`text-lg font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>App Security & System Configuration</h2>
        <p className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          Control withdrawal thresholds, maintenance toggles, and official support handles
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Withdrawal Limits */}
          <div className={`p-5 rounded-3xl border space-y-4 ${
            isDark ? 'bg-[#1E293B] border-slate-800 text-white shadow-xl' : 'bg-white border-slate-200/90 text-slate-900 shadow-xs'
          }`}>
            <div className="flex items-center gap-2">
              <div className={`p-2 rounded-xl ${isDark ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
                <DollarSign className="w-5 h-5" />
              </div>
              <div>
                <h3 className={`text-sm font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>Minimum Cashout Thresholds</h3>
                <p className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>Minimum balance required for withdrawal</p>
              </div>
            </div>

            <div className="space-y-3 text-xs text-left">
              <div className="space-y-1">
                <label className={`font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Min UPI Withdrawal (₹):</label>
                <input
                  type="number"
                  min={10}
                  value={formData.minWithdrawalUpi}
                  onChange={(e) => setFormData({ ...formData, minWithdrawalUpi: Number(e.target.value) })}
                  className={`w-full px-3.5 py-2.5 rounded-xl border font-bold focus:outline-hidden focus:border-indigo-500 ${
                    isDark 
                      ? 'bg-slate-900 border-slate-700 text-white' 
                      : 'bg-slate-50 border-slate-200 text-slate-800'
                  }`}
                />
              </div>

              <div className="space-y-1">
                <label className={`font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Min Bank IMPS Transfer (₹):</label>
                <input
                  type="number"
                  min={10}
                  value={formData.minWithdrawalBank}
                  onChange={(e) => setFormData({ ...formData, minWithdrawalBank: Number(e.target.value) })}
                  className={`w-full px-3.5 py-2.5 rounded-xl border font-bold focus:outline-hidden focus:border-indigo-500 ${
                    isDark 
                      ? 'bg-slate-900 border-slate-700 text-white' 
                      : 'bg-slate-50 border-slate-200 text-slate-800'
                  }`}
                />
              </div>

              <div className="space-y-1">
                <label className={`font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Min QR Code Withdrawal (₹):</label>
                <input
                  type="number"
                  min={10}
                  value={formData.minWithdrawalRecharge}
                  onChange={(e) => setFormData({ ...formData, minWithdrawalRecharge: Number(e.target.value) })}
                  className={`w-full px-3.5 py-2.5 rounded-xl border font-bold focus:outline-hidden focus:border-indigo-500 ${
                    isDark 
                      ? 'bg-slate-900 border-slate-700 text-white' 
                      : 'bg-slate-50 border-slate-200 text-slate-800'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* System & Support Controls */}
          <div className={`p-5 rounded-3xl border space-y-4 ${
            isDark ? 'bg-[#1E293B] border-slate-800 text-white shadow-xl' : 'bg-white border-slate-200/90 text-slate-900 shadow-xs'
          }`}>
            <div className="flex items-center gap-2">
              <div className={`p-2 rounded-xl ${isDark ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-50 text-purple-600'}`}>
                <Settings className="w-5 h-5" />
              </div>
              <div>
                <h3 className={`text-sm font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>Support & System Status</h3>
                <p className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>Emergency toggles and contacts</p>
              </div>
            </div>

            <div className="space-y-3 text-xs text-left">
              <div className="space-y-1">
                <label className={`font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Official Telegram Channel / Bot:</label>
                <input
                  type="text"
                  value={formData.supportTelegram}
                  onChange={(e) => setFormData({ ...formData, supportTelegram: e.target.value })}
                  className={`w-full px-3.5 py-2.5 rounded-xl border focus:outline-hidden focus:border-indigo-500 ${
                    isDark 
                      ? 'bg-slate-900 border-slate-700 text-white placeholder-slate-500' 
                      : 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400'
                  }`}
                />
              </div>

              <div className="space-y-1">
                <label className={`font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>WhatsApp Support Number:</label>
                <input
                  type="text"
                  placeholder="+919876543210"
                  value={formData.supportWhatsApp || ''}
                  onChange={(e) => setFormData({ ...formData, supportWhatsApp: e.target.value })}
                  className={`w-full px-3.5 py-2.5 rounded-xl border focus:outline-hidden focus:border-indigo-500 ${
                    isDark 
                      ? 'bg-slate-900 border-slate-700 text-white placeholder-slate-500' 
                      : 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400'
                  }`}
                />
              </div>

              <div className="space-y-1">
                <label className={`font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Support Email:</label>
                <input
                  type="email"
                  value={formData.supportEmail}
                  onChange={(e) => setFormData({ ...formData, supportEmail: e.target.value })}
                  className={`w-full px-3.5 py-2.5 rounded-xl border focus:outline-hidden focus:border-indigo-500 ${
                    isDark 
                      ? 'bg-slate-900 border-slate-700 text-white placeholder-slate-500' 
                      : 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400'
                  }`}
                />
              </div>

              {/* WhatsApp Floating Button Toggle */}
              <div className={`pt-2 flex items-center justify-between p-3.5 rounded-2xl border ${
                isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <div>
                  <div className={`font-extrabold flex items-center gap-1.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
                    <span>Floating WhatsApp Button in User App</span>
                  </div>
                  <div className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Show 1-click floating WhatsApp help widget on all screens
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={formData.isWhatsAppSupportEnabled ?? true}
                  onChange={(e) => setFormData({ ...formData, isWhatsAppSupportEnabled: e.target.checked })}
                  className="w-5 h-5 accent-emerald-500 text-emerald-600 rounded-md cursor-pointer"
                />
              </div>

              {/* Maintenance Toggle */}
              <div className={`pt-2 flex items-center justify-between p-3.5 rounded-2xl border ${
                isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <div>
                  <div className={`font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>Maintenance Mode</div>
                  <div className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>Temporarily pause app logins & cashouts</div>
                </div>
                <input
                  type="checkbox"
                  checked={formData.maintenanceMode}
                  onChange={(e) => setFormData({ ...formData, maintenanceMode: e.target.checked })}
                  className="w-5 h-5 text-indigo-600 rounded-md cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <button
            type="button"
            onClick={handleReset}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold border cursor-pointer flex items-center gap-1.5 transition-all ${
              isDark 
                ? 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border-rose-500/30' 
                : 'bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-200'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo DB to Default</span>
          </button>
          
          <button
            type="submit"
            className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black shadow-md cursor-pointer flex items-center gap-2 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Save Configuration</span>
          </button>
        </div>
      </form>
    </div>
  );
};
