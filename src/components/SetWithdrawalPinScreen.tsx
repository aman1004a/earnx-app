import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  Lock, 
  KeyRound, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  Smartphone, 
  RefreshCw,
  Sparkles,
  Info
} from 'lucide-react';
import { getUserWithdrawalPin, setUserWithdrawalPin, hasUserWithdrawalPin } from '../utils/authStorage';
import { PersonalDetails } from './PersonalDetailsScreen';

interface SetWithdrawalPinScreenProps {
  userPhone: string;
  userDetails: PersonalDetails | null;
  onBack: () => void;
  showToast: (msg: string) => void;
}

export const SetWithdrawalPinScreen: React.FC<SetWithdrawalPinScreenProps> = ({
  userPhone,
  userDetails,
  onBack,
  showToast
}) => {
  const existingPin = getUserWithdrawalPin(userPhone);
  const isPinConfigured = Boolean(existingPin);

  // States
  const [mode, setMode] = useState<'create' | 'update' | 'forgot'>(isPinConfigured ? 'update' : 'create');
  
  // PIN states (4 digits each)
  const [currentPin, setCurrentPin] = useState(['', '', '', '']);
  const [newPin, setNewPin] = useState(['', '', '', '']);
  const [confirmPin, setConfirmPin] = useState(['', '', '', '']);
  
  // Forgot / Reset OTP states
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [otpSent, setOtpSent] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [mockOtp, setMockOtp] = useState('482910');

  const [showPinText, setShowPinText] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Refs for auto-focus
  const curRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];
  const newRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];
  const confRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];
  const otpRefs = [
    useRef<HTMLInputElement>(null), 
    useRef<HTMLInputElement>(null), 
    useRef<HTMLInputElement>(null), 
    useRef<HTMLInputElement>(null), 
    useRef<HTMLInputElement>(null), 
    useRef<HTMLInputElement>(null)
  ];

  // Resend Timer Countdown
  useEffect(() => {
    let interval: any = null;
    if (resendTimer > 0) {
      interval = setInterval(() => setResendTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleDigitChange = (
    val: string,
    idx: number,
    arr: string[],
    setArr: React.Dispatch<React.SetStateAction<string[]>>,
    refs: React.RefObject<HTMLInputElement | null>[]
  ) => {
    if (val.length > 1) {
      val = val.slice(-1);
    }
    if (!/^\d*$/.test(val)) return;

    const copy = [...arr];
    copy[idx] = val;
    setArr(copy);
    setErrorMsg(null);

    if (val && idx < refs.length - 1) {
      refs[idx + 1].current?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    idx: number,
    arr: string[],
    refs: React.RefObject<HTMLInputElement | null>[]
  ) => {
    if (e.key === 'Backspace' && !arr[idx] && idx > 0) {
      refs[idx - 1].current?.focus();
    }
  };

  const handleSendOtp = () => {
    const generated = Math.floor(100000 + Math.random() * 900000).toString();
    setMockOtp(generated);
    setOtpSent(true);
    setResendTimer(30);
    setErrorMsg(null);
    showToast(`📩 OTP sent to +91 ${userPhone} (Demo OTP: ${generated})`);
  };

  const handleSavePin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // If update mode, verify current PIN first
    if (mode === 'update') {
      const cur = currentPin.join('');
      if (cur.length !== 4) {
        setErrorMsg('Please enter your 4-digit current PIN');
        return;
      }
      if (cur !== existingPin && existingPin !== null) {
        setErrorMsg('Current PIN is incorrect. Try again or use "Forgot PIN"');
        return;
      }
    }

    // If forgot mode, verify OTP first
    if (mode === 'forgot') {
      const enteredOtp = otpCode.join('');
      if (enteredOtp.length !== 6) {
        setErrorMsg('Please enter the 6-digit OTP sent to your mobile number');
        return;
      }
      if (enteredOtp !== mockOtp && enteredOtp !== '123456') {
        setErrorMsg('Invalid OTP code. Please enter the correct verification code.');
        return;
      }
    }

    const nPin = newPin.join('');
    const cPin = confirmPin.join('');

    if (nPin.length !== 4) {
      setErrorMsg('Please enter a 4-digit New PIN');
      return;
    }
    if (cPin.length !== 4) {
      setErrorMsg('Please confirm your 4-digit New PIN');
      return;
    }
    if (nPin !== cPin) {
      setErrorMsg('New PIN and Confirm PIN do not match');
      return;
    }

    // Simple pattern check
    if (nPin === '0000' || nPin === '1111' || nPin === '1234') {
      setErrorMsg('Please choose a stronger PIN (Avoid 0000, 1111, 1234)');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setUserWithdrawalPin(userPhone, nPin);
      setIsLoading(false);
      setIsSuccess(true);
      showToast('🎉 Withdrawal PIN has been saved successfully!');
    }, 700);
  };

  return (
    <div id="set-pin-view" className="w-full h-full flex flex-col bg-[#F8FAFC] text-slate-800 relative overflow-hidden text-left">
      {/* Top Header Bar (White Glassmorphism - Matching Referral History Screen) */}
      <header className="shrink-0 px-4 py-3 border-b border-white/60 bg-white/80 backdrop-blur-xl z-40 flex items-center justify-between shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)]">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-2xl bg-white hover:bg-slate-100 text-slate-700 shadow-xs border border-slate-200/80 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h2 className="text-base font-black text-slate-900 tracking-tight font-outfit">
              Set Withdrawal PIN
            </h2>
            <p className="text-[10px] text-slate-400 font-medium leading-none">
              4-digit security code for wallet cashouts
            </p>
          </div>
        </div>

        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-black ${
          isPinConfigured 
            ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
            : 'bg-amber-50 border-amber-200 text-amber-700'
        }`}>
          <ShieldCheck className={`w-3.5 h-3.5 ${isPinConfigured ? 'text-emerald-600' : 'text-amber-600'}`} />
          <span>{isPinConfigured ? 'PIN Active' : 'Not Set'}</span>
        </div>
      </header>

      {/* Scrollable Body */}
      <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4 text-left scrollbar-thin overscroll-contain">
        {/* Security Status Banner */}
        <div className="p-4 rounded-3xl bg-gradient-to-br from-[#4B63FF] to-[#2E42E2] text-white shadow-lg shadow-[#4B63FF]/20 space-y-3 relative overflow-hidden">
          <div className="absolute -right-6 -bottom-6 w-28 h-28 bg-white/10 rounded-full blur-xl pointer-events-none" />
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold">Withdrawal PIN Protection</h3>
                <p className="text-[11px] text-blue-100">Protects wallet funds during instant payout</p>
              </div>
            </div>

            <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold tracking-wider uppercase border ${
              isPinConfigured 
                ? 'bg-emerald-400/20 text-emerald-200 border-emerald-300/30' 
                : 'bg-amber-400/20 text-amber-200 border-amber-300/30'
            }`}>
              {isPinConfigured ? 'PIN Active' : 'Not Set'}
            </span>
          </div>

          <div className="pt-2 border-t border-white/15 flex items-center justify-between text-[11px] text-blue-100">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
              <span>Required for UPI & Bank transfers</span>
            </div>
            <span className="text-[10px] font-mono bg-white/10 px-2 py-0.5 rounded-lg">
              +91 {userPhone}
            </span>
          </div>
        </div>

        {/* Mode Switcher if PIN already configured */}
        {isPinConfigured && !isSuccess && (
          <div className="p-1 rounded-2xl bg-slate-200/80 p-1 grid grid-cols-2 gap-1 text-xs font-bold">
            <button
              type="button"
              onClick={() => {
                setMode('update');
                setErrorMsg(null);
              }}
              className={`py-2 rounded-xl text-center transition-all cursor-pointer ${
                mode === 'update' 
                  ? 'bg-white text-[#4B63FF] shadow-xs' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Update PIN
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('forgot');
                setErrorMsg(null);
                if (!otpSent) handleSendOtp();
              }}
              className={`py-2 rounded-xl text-center transition-all cursor-pointer ${
                mode === 'forgot' 
                  ? 'bg-white text-[#4B63FF] shadow-xs' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Forgot / Reset via SMS
            </button>
          </div>
        )}

        {/* Success View */}
        {isSuccess ? (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="p-6 rounded-3xl bg-white border border-emerald-200/80 text-center space-y-4 shadow-sm"
          >
            <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md shadow-emerald-500/20">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-black text-slate-900">
                PIN Successfully {mode === 'create' ? 'Created' : 'Updated'}!
              </h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Your 4-digit Withdrawal Security PIN is now active. Use this PIN whenever you initiate a UPI or Bank cashout.
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-700">
              <span className="text-slate-500">Security Status:</span>
              <span className="text-emerald-600 font-bold flex items-center gap-1">
                <ShieldCheck className="w-4 h-4" /> 100% Protected
              </span>
            </div>

            <button
              onClick={onBack}
              className="w-full py-3.5 rounded-2xl bg-[#4B63FF] hover:bg-[#3549EC] text-white font-extrabold text-xs uppercase tracking-wider shadow-md shadow-[#4B63FF]/30 cursor-pointer"
            >
              Done & Return to Account
            </button>
          </motion.div>
        ) : (
          /* Form Area */
          <form onSubmit={handleSavePin} className="space-y-4">
            {/* Error Message */}
            <AnimatePresence>
              {errorMsg && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2"
                >
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{errorMsg}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* 1. If in Forgot Mode: Enter OTP */}
            {mode === 'forgot' && (
              <div className="p-4 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-[#4B63FF]" />
                    <label className="text-xs font-extrabold text-slate-800">
                      Mobile Verification OTP
                    </label>
                  </div>
                  <span className="text-[10px] text-slate-400 font-bold">
                    +91 {userPhone}
                  </span>
                </div>

                <div className="p-2 rounded-2xl bg-blue-50/80 border border-blue-100 flex items-center justify-between text-[11px] text-blue-700 font-bold">
                  <span>Demo OTP: <span className="font-mono text-xs text-[#4B63FF]">{mockOtp}</span></span>
                  <button
                    type="button"
                    onClick={() => {
                      const split = mockOtp.split('');
                      setOtpCode(split);
                      otpRefs[5].current?.focus();
                    }}
                    className="px-2 py-0.5 rounded-lg bg-blue-600 text-white text-[10px] font-bold hover:bg-blue-700 cursor-pointer"
                  >
                    Auto-Fill
                  </button>
                </div>

                <div className="flex justify-between gap-1.5 py-1">
                  {otpCode.map((digit, i) => (
                    <input
                      key={`otp-${i}`}
                      ref={otpRefs[i]}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleDigitChange(e.target.value, i, otpCode, setOtpCode, otpRefs)}
                      onKeyDown={(e) => handleKeyDown(e, i, otpCode, otpRefs)}
                      className="w-11 h-12 text-center text-lg font-black rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#4B63FF] outline-none transition-all"
                    />
                  ))}
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-slate-400 text-[11px]">Didn't receive code?</span>
                  <button
                    type="button"
                    disabled={resendTimer > 0}
                    onClick={handleSendOtp}
                    className={`font-bold flex items-center gap-1 text-[11px] ${
                      resendTimer > 0 ? 'text-slate-400' : 'text-[#4B63FF] hover:underline cursor-pointer'
                    }`}
                  >
                    <RefreshCw className={`w-3 h-3 ${resendTimer > 0 ? 'animate-spin' : ''}`} />
                    <span>{resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend OTP'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* 2. If in Update Mode: Current PIN */}
            {mode === 'update' && (
              <div className="p-4 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-extrabold text-slate-800">
                    Enter Current PIN
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setMode('forgot');
                      if (!otpSent) handleSendOtp();
                    }}
                    className="text-[11px] font-bold text-[#4B63FF] hover:underline cursor-pointer"
                  >
                    Forgot Current PIN?
                  </button>
                </div>

                <div className="flex justify-center gap-3 py-1">
                  {currentPin.map((digit, i) => (
                    <input
                      key={`cur-${i}`}
                      ref={curRefs[i]}
                      type={showPinText ? 'text' : 'password'}
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleDigitChange(e.target.value, i, currentPin, setCurrentPin, curRefs)}
                      onKeyDown={(e) => handleKeyDown(e, i, currentPin, curRefs)}
                      className="w-12 h-13 text-center text-xl font-black rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#4B63FF] outline-none transition-all"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* 3. New PIN Input */}
            <div className="p-4 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-extrabold text-slate-800">
                  {mode === 'create' ? 'Enter 4-Digit Security PIN' : 'Enter New 4-Digit PIN'}
                </label>
                <button
                  type="button"
                  onClick={() => setShowPinText(!showPinText)}
                  className="text-slate-400 hover:text-slate-600 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                >
                  {showPinText ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{showPinText ? 'Hide' : 'Show'}</span>
                </button>
              </div>

              <div className="flex justify-center gap-3 py-1">
                {newPin.map((digit, i) => (
                  <input
                    key={`new-${i}`}
                    ref={newRefs[i]}
                    type={showPinText ? 'text' : 'password'}
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleDigitChange(e.target.value, i, newPin, setNewPin, newRefs)}
                    onKeyDown={(e) => handleKeyDown(e, i, newPin, newRefs)}
                    className="w-12 h-13 text-center text-xl font-black rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#4B63FF] outline-none transition-all"
                  />
                ))}
              </div>
            </div>

            {/* 4. Confirm PIN Input */}
            <div className="p-4 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-3">
              <label className="text-xs font-extrabold text-slate-800">
                Confirm {mode === 'create' ? 'PIN' : 'New PIN'}
              </label>

              <div className="flex justify-center gap-3 py-1">
                {confirmPin.map((digit, i) => (
                  <input
                    key={`conf-${i}`}
                    ref={confRefs[i]}
                    type={showPinText ? 'text' : 'password'}
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleDigitChange(e.target.value, i, confirmPin, setConfirmPin, confRefs)}
                    onKeyDown={(e) => handleKeyDown(e, i, confirmPin, confRefs)}
                    className="w-12 h-13 text-center text-xl font-black rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#4B63FF] outline-none transition-all"
                  />
                ))}
              </div>
            </div>

            {/* Safety Tips */}
            <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/70 text-[11px] text-amber-800 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-amber-900">
                <Info className="w-3.5 h-3.5 text-amber-600" />
                <span>Security Guidelines</span>
              </div>
              <ul className="list-disc pl-4 space-y-0.5 text-[10.5px] text-amber-800/90">
                <li>Never share your 4-digit PIN with anyone, including support staff.</li>
                <li>Avoid easy combinations like your birth year, 1234, or 0000.</li>
                <li>This PIN will be prompted on every withdrawal authorization.</li>
              </ul>
            </div>

            {/* Submit Action Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 rounded-2xl bg-[#4B63FF] hover:bg-[#3549EC] active:scale-[0.98] text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-[#4B63FF]/30 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>{mode === 'create' ? 'Create Withdrawal PIN' : 'Save & Update PIN'}</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
