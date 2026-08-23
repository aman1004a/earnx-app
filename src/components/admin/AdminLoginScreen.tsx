import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Smartphone,
  AlertCircle
} from 'lucide-react';
import { setAdminAuthenticated } from '../../utils/adminStorage';

interface AdminLoginScreenProps {
  onLoginSuccess: () => void;
  onBackToUserApp: () => void;
}

export const AdminLoginScreen: React.FC<AdminLoginScreenProps> = ({
  onLoginSuccess,
  onBackToUserApp
}) => {
  const [username, setUsername] = useState('admin@earnx.com');
  const [password, setPassword] = useState('earnx@admin2026');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    setTimeout(() => {
      // Valid Credentials Check (Demo credentials provided)
      const isValidUser = (username.trim().toLowerCase() === 'admin@earnx.com' || username.trim().toLowerCase() === 'admin');
      const isValidPass = (password === 'earnx@admin2026' || password === 'admin123');

      if (isValidUser && isValidPass) {
        setAdminAuthenticated(true);
        setIsLoading(false);
        onLoginSuccess();
      } else {
        setIsLoading(false);
        setErrorMsg('Invalid Admin username or security key. Please check credentials.');
      }
    }, 600);
  };

  const handleQuickFillDemo = () => {
    setUsername('admin@earnx.com');
    setPassword('earnx@admin2026');
    setErrorMsg(null);
  };

  return (
    <div className="min-h-screen w-full bg-[#0B1120] text-slate-100 flex flex-col justify-between items-center p-4 sm:p-6 relative overflow-hidden font-sans">
      {/* Subtle Background Glow Elements */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar with back to user app button */}
      <div className="w-full max-w-md flex items-center justify-between z-10 pt-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-[#4B63FF] flex items-center justify-center font-black text-white shadow-md text-sm">
            X
          </div>
          <span className="font-black text-sm tracking-tight text-white">EarnX Portal</span>
        </div>
        <button
          id="btn-login-back-to-app"
          onClick={onBackToUserApp}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 text-xs font-bold border border-slate-700/80 transition-all cursor-pointer"
        >
          <Smartphone className="w-3.5 h-3.5 text-indigo-400" />
          <span>User App</span>
        </button>
      </div>

      {/* Login Card Container */}
      <div className="w-full max-w-md my-auto py-8 z-10">
        <div className="p-6 sm:p-8 rounded-3xl bg-[#1E293B]/90 backdrop-blur-xl border border-slate-700/80 shadow-2xl space-y-6">
          
          {/* Header Title */}
          <div className="text-center space-y-2">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-inner">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white tracking-tight">Admin Authentication</h2>
              <p className="text-xs text-slate-400 font-medium">Secure sign-in for platform owner & operations</p>
            </div>
          </div>

          {/* Error Alert */}
          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-2 text-rose-300 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Sign In Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            {/* Username / Admin Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                <span>Admin Username / Email</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="input-admin-username"
                  type="text"
                  required
                  placeholder="admin@earnx.com"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-900/80 border border-slate-700 font-medium text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-indigo-500 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                <span>Security Master PIN / Password</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="input-admin-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 rounded-2xl bg-slate-900/80 border border-slate-700 font-mono text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-indigo-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1 text-slate-400 hover:text-slate-200 absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              id="btn-submit-admin-login"
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-[#4B63FF] hover:opacity-95 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>Sign In To Command Center</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials Box */}
          <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                Default Master Credentials
              </span>
              <button
                type="button"
                onClick={handleQuickFillDemo}
                className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 underline cursor-pointer"
              >
                Auto-fill
              </button>
            </div>
            <div className="text-[11px] font-mono text-slate-300 space-y-0.5">
              <div>User: <span className="text-white font-bold">admin@earnx.com</span></div>
              <div>Pass: <span className="text-white font-bold">earnx@admin2026</span></div>
            </div>
          </div>

        </div>
      </div>

      {/* Footer copyright */}
      <div className="text-center text-[10px] text-slate-500 z-10 pb-2">
        EarnX Secure Admin Authentication • 256-bit Encrypted Session
      </div>
    </div>
  );
};
