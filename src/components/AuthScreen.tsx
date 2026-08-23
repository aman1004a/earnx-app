import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Phone, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles, 
  KeyRound, 
  CheckCircle2, 
  RotateCcw,
  Gift,
  MessageSquareCode
} from 'lucide-react';
import { PersonalDetails } from './PersonalDetailsScreen';
import { findUserByPhone, setActiveSession } from '../utils/authStorage';

interface AuthScreenProps {
  onBackToSplash: () => void;
  onAuthSuccess?: (phone: string, existingUser: PersonalDetails | null) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ 
  onAuthSuccess 
}) => {
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(true);
  const [otp, setOtp] = useState(['', '', '', '']);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [existingUser, setExistingUser] = useState<PersonalDetails | null>(null);

  const otpInputsRef = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer for OTP resend
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 'otp' && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  // Handle phone input change
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
    setPhone(value);
    if (errorMessage) setErrorMessage('');
  };

  // Handle submit phone to send OTP
  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number');
      return;
    }
    if (!agreedToTerms) {
      setErrorMessage('Please accept the Terms & Privacy Policy to proceed');
      return;
    }
    setErrorMessage('');
    setStep('otp');
    setTimer(30);
    setCanResend(false);
    setOtp(['', '', '', '']);
  };

  // Handle OTP digit changes
  const handleOtpChange = (index: number, value: string) => {
    const cleanVal = value.replace(/\D/g, '');
    if (errorMessage) setErrorMessage('');

    if (cleanVal.length > 1) {
      // Handle paste
      const pasted = cleanVal.slice(0, 4).split('');
      const newOtp = [...otp];
      pasted.forEach((char, idx) => {
        if (index + idx < 4) newOtp[index + idx] = char;
      });
      setOtp(newOtp);
      const nextIdx = Math.min(index + pasted.length, 3);
      otpInputsRef.current[nextIdx]?.focus();
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = cleanVal;
    setOtp(newOtp);

    // Auto advance focus
    if (cleanVal && index < 3) {
      otpInputsRef.current[index + 1]?.focus();
    }
  };

  // Handle OTP Backspace key
  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    }
  };

  // Auto fill demo OTP
  const handleFillDemoOtp = () => {
    const demo = ['1', '2', '3', '4'];
    setOtp(demo);
    setErrorMessage('');
    otpInputsRef.current[3]?.focus();
  };

  // Handle Resend OTP
  const handleResendOtp = () => {
    if (!canResend) return;
    setTimer(30);
    setCanResend(false);
    setOtp(['', '', '', '']);
    setErrorMessage('');
    otpInputsRef.current[0]?.focus();
  };

  // Handle Verify OTP
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const enteredOtp = otp.join('');
    if (enteredOtp.length < 4) {
      setErrorMessage('Please enter complete 4-digit OTP code');
      return;
    }

    setIsVerifying(true);
    setErrorMessage('');

    // Check if account already exists with this phone number
    const existing = findUserByPhone(phone);
    setExistingUser(existing);

    setTimeout(() => {
      setIsVerifying(false);
      setIsSuccess(true);
      
      if (existing) {
        setActiveSession(phone);
      }

      if (onAuthSuccess) {
        setTimeout(() => {
          onAuthSuccess(phone, existing);
        }, 1600);
      }
    }, 1000);
  };

  return (
    <div id="earn-auth-container" className="w-full h-full min-h-screen flex items-center justify-center p-3 sm:p-5 relative">
      {/* Background Soft Floating Spheres */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-400/15 rounded-full blur-3xl pointer-events-none" />

      {/* Floating 3D Glass Card Container */}
      <motion.div
        id="earn-auth-card"
        initial={{ opacity: 0, y: 15, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="w-full max-w-[440px] h-[calc(100vh-24px)] max-h-[850px] rounded-[36px] p-6 sm:p-8 glass-card shadow-[0_25px_60px_-15px_rgba(75,99,255,0.22)] text-slate-800 text-center relative overflow-hidden border border-white/80 flex flex-col justify-between"
      >
        {/* Soft Ambient Glows */}
        <div className="absolute -top-12 -right-12 w-52 h-52 bg-gradient-to-bl from-[#4B63FF]/20 to-transparent rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-52 h-52 bg-gradient-to-tr from-[#3549EC]/15 to-transparent rounded-full blur-2xl pointer-events-none" />

        {/* TOP STATUS BAR */}
        <div className="flex items-center justify-end w-full relative z-20">
          <span className="text-[10px] font-extrabold tracking-wider text-[#3549EC] uppercase bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200/60 font-mono">
            {step === 'phone' ? 'STEP 1 OF 2' : 'STEP 2 OF 2'}
          </span>
        </div>

        {/* MIDDLE CONTENT: Step 1 (Phone) or Step 2 (OTP) */}
        <div className="relative z-10 flex flex-col items-center my-auto w-full">
          
          {/* Brand/Security Medallion */}
          <div className="relative mb-4">
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.3, 0.55, 0.3],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute -inset-3 rounded-3xl bg-gradient-to-tr from-[#4B63FF] to-cyan-400 blur-xl"
            />

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="relative w-20 h-20 sm:w-22 sm:h-22 rounded-3xl bg-primary-gradient p-1 shadow-[0_16px_35px_rgba(75,99,255,0.3)] flex items-center justify-center"
            >
              <div className="w-full h-full rounded-[22px] bg-gradient-to-br from-[#4B63FF] via-[#3D56F5] to-[#3549EC] flex flex-col items-center justify-center p-2 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
                
                <div className="relative z-10 text-white">
                  {step === 'phone' ? (
                    <Phone className="w-10 h-10 drop-shadow-md" />
                  ) : (
                    <MessageSquareCode className="w-10 h-10 drop-shadow-md" />
                  )}
                </div>

                <div className="absolute bottom-1.5 right-1.5 bg-amber-400 text-slate-900 rounded-full p-0.5 shadow-sm">
                  <Sparkles className="w-3 h-3 fill-slate-900" />
                </div>
              </div>
            </motion.div>
          </div>

          <AnimatePresence mode="wait">
            {step === 'phone' ? (
              /* STEP 1: MOBILE NUMBER FORM */
              <motion.div
                key="phone-step"
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 15 }}
                transition={{ duration: 0.25 }}
                className="w-full space-y-4"
              >
                {/* Title & Tagline */}
                <div className="space-y-1">
                  <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 font-outfit">
                    Login or Sign Up
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 font-medium">
                    Enter your mobile number to receive an instant OTP
                  </p>
                </div>

                {/* Instant Reward Banner */}
                <div className="p-2.5 rounded-2xl bg-gradient-to-r from-emerald-50 via-emerald-100/50 to-emerald-50 border border-emerald-200/80 flex items-center gap-2.5 text-left shadow-xs">
                  <div className="p-1.5 rounded-xl bg-emerald-600 text-white shrink-0 shadow-xs">
                    <Gift className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[11px] font-extrabold text-emerald-950">New User Welcome Bonus</div>
                    <div className="text-[10px] text-emerald-700 font-medium">Get ₹25 Cash instantly upon registration</div>
                  </div>
                </div>

                {/* Phone Form */}
                <form onSubmit={handleSendOtp} className="space-y-3.5 text-left pt-1">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5 px-0.5">
                      Mobile Number
                    </label>
                    
                    <div className="flex items-center gap-2">
                      {/* Country Code Pill */}
                      <div className="h-12 px-3 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-1.5 text-xs font-bold text-slate-800 shrink-0">
                        <span className="text-sm">🇮🇳</span>
                        <span>+91</span>
                      </div>

                      {/* Phone Input Box */}
                      <div className="relative flex-1">
                        <input
                          id="mobile-phone-input"
                          type="tel"
                          value={phone}
                          onChange={handlePhoneChange}
                          placeholder="98765 43210"
                          maxLength={10}
                          className="w-full h-12 px-3.5 rounded-2xl bg-white border border-slate-200/80 text-sm sm:text-base font-bold text-slate-900 tracking-wider placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#4B63FF] focus:border-transparent transition-all shadow-xs"
                        />
                        {phone && (
                          <button
                            type="button"
                            onClick={() => setPhone('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold p-1 cursor-pointer"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Error Notification */}
                  {errorMessage && (
                    <motion.div 
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-xs font-semibold text-rose-500 px-1"
                    >
                      {errorMessage}
                    </motion.div>
                  )}

                  {/* Terms & Conditions Checkbox */}
                  <label className="flex items-start gap-2.5 cursor-pointer pt-1 px-1">
                    <input
                      type="checkbox"
                      checked={agreedToTerms}
                      onChange={(e) => setAgreedToTerms(e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded border-slate-300 text-[#4B63FF] focus:ring-[#4B63FF] accent-[#4B63FF] cursor-pointer"
                    />
                    <span className="text-[10px] sm:text-[11px] text-slate-500 font-medium leading-tight">
                      I agree to the <span className="text-[#3549EC] font-semibold underline">Terms of Service</span> & <span className="text-[#3549EC] font-semibold underline">Privacy Policy</span>.
                    </span>
                  </label>

                  {/* Submit / Get OTP Button */}
                  <motion.button
                    id="auth-send-otp-btn"
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3.5 rounded-2xl bg-primary-gradient hover:opacity-95 text-white font-bold text-xs sm:text-sm tracking-wider uppercase shadow-lg shadow-[#4B63FF]/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <span>GET OTP</span>
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </form>
              </motion.div>
            ) : (
              /* STEP 2: OTP VERIFICATION FORM */
              <motion.div
                key="otp-step"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.25 }}
                className="w-full space-y-4"
              >
                {/* Title & Tagline */}
                <div className="space-y-1">
                  <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 font-outfit">
                    Verify Code
                  </h2>
                  <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500 font-medium">
                    <span>Sent 4-digit code to +91 {phone}</span>
                    <button 
                      onClick={() => {
                        setStep('phone');
                        setErrorMessage('');
                      }} 
                      className="text-[#3549EC] font-bold underline hover:text-[#293ECC] cursor-pointer"
                    >
                      Edit
                    </button>
                  </div>
                </div>

                {/* OTP Form */}
                <form onSubmit={handleVerifyOtp} className="space-y-4 pt-1">
                  <div>
                    {/* 4 Digit Boxes */}
                    <div className="flex items-center justify-center gap-3">
                      {otp.map((digit, idx) => (
                        <input
                          key={idx}
                          ref={(el) => { otpInputsRef.current[idx] = el; }}
                          type="tel"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpChange(idx, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                          className={`w-13 h-14 sm:w-14 sm:h-16 text-center text-xl sm:text-2xl font-black rounded-2xl bg-white border ${
                            digit ? 'border-[#4B63FF] text-[#3549EC] shadow-sm ring-2 ring-[#4B63FF]/15' : 'border-slate-200/80 text-slate-900 shadow-xs'
                          } focus:outline-none focus:ring-2 focus:ring-[#4B63FF] focus:border-transparent transition-all`}
                        />
                      ))}
                    </div>

                    {/* Quick Demo OTP Autofill Hint */}
                    <div className="mt-2.5 flex items-center justify-center">
                      <button
                        type="button"
                        onClick={handleFillDemoOtp}
                        className="text-[10px] font-bold text-slate-400 hover:text-[#3549EC] bg-slate-100/90 hover:bg-blue-50 px-2.5 py-1 rounded-full border border-slate-200/60 transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <KeyRound className="w-3 h-3 text-amber-500" />
                        <span>Autofill Demo OTP (1234)</span>
                      </button>
                    </div>
                  </div>

                  {/* Error Notification */}
                  {errorMessage && (
                    <motion.div 
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-xs font-semibold text-rose-500 text-center"
                    >
                      {errorMessage}
                    </motion.div>
                  )}

                  {/* Resend OTP Section */}
                  <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500 font-medium">
                    {canResend ? (
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        className="text-[#3549EC] font-bold flex items-center gap-1 hover:underline cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Resend OTP</span>
                      </button>
                    ) : (
                      <span>Resend OTP in <strong className="font-mono text-slate-800">00:{timer < 10 ? `0${timer}` : timer}</strong></span>
                    )}
                  </div>

                  {/* Verify & Continue Button */}
                  <motion.button
                    id="auth-verify-otp-btn"
                    type="submit"
                    disabled={isVerifying || isSuccess}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3.5 rounded-2xl bg-primary-gradient hover:opacity-95 text-white font-bold text-xs sm:text-sm tracking-wider uppercase shadow-lg shadow-[#4B63FF]/30 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-80"
                  >
                    {isVerifying ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>VERIFYING...</span>
                      </div>
                    ) : (
                      <>
                        <span>VERIFY & CONTINUE</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </motion.button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

        {/* BOTTOM SECTION: Security & Compliance Footer */}
        <div className="relative z-10 w-full pt-4">
          <div className="flex items-center justify-center gap-1.5 text-[10px] sm:text-xs text-slate-400 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>256-Bit Encrypted & Anti-Fraud Protected</span>
          </div>
        </div>

        {/* SUCCESS OVERLAY MODAL */}
        <AnimatePresence>
          {isSuccess && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute inset-0 bg-white/95 backdrop-blur-md z-50 flex flex-col items-center justify-center p-6 text-center space-y-4 rounded-[36px]"
            >
              <div className="w-18 h-18 rounded-3xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center p-3 shadow-inner">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 animate-bounce" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-extrabold text-slate-900 font-outfit">
                  {existingUser ? 'Welcome Back!' : 'Mobile Verified!'}
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  {existingUser ? (
                    <>
                      Logged in as <strong className="text-slate-800">{existingUser.fullName}</strong>. Opening your dashboard...
                    </>
                  ) : (
                    'New number detected. Taking you to profile setup...'
                  )}
                </p>
              </div>
              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-center gap-2 text-xs font-bold text-emerald-900">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>
                  {existingUser ? 'Account Synchronized' : '+₹25 Welcome Cash Activated'}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
