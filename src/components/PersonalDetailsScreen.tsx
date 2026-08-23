import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, 
  Mail, 
  Calendar, 
  ArrowLeft, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  Check, 
  Tag 
} from 'lucide-react';
import { registerNewUser, PersonalDetails } from '../utils/authStorage';

export type { PersonalDetails };

interface PersonalDetailsScreenProps {
  phone?: string;
  onBackToAuth: () => void;
  onSubmitSuccess?: (details: PersonalDetails) => void;
}

export const PersonalDetailsScreen: React.FC<PersonalDetailsScreenProps> = ({
  phone = '9876543210',
  onBackToAuth,
  onSubmitSuccess
}) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | 'other'>('male');
  const [referralCode, setReferralCode] = useState('');
  const [referralApplied, setReferralApplied] = useState(false);
  const [referralError, setReferralError] = useState('');
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Apply referral code
  const handleApplyReferral = () => {
    if (!referralCode.trim()) {
      setReferralError('Please enter a referral code');
      return;
    }

    if (referralCode.trim().toUpperCase() === 'EARNX50' || referralCode.trim().length >= 4) {
      setReferralApplied(true);
      setReferralError('');
    } else {
      setReferralError('Invalid referral code');
    }
  };

  // Form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || fullName.trim().length < 3) {
      setFormError('Please enter your full name (at least 3 characters)');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email)) {
      setFormError('Please enter a valid email address');
      return;
    }
    if (!dob) {
      setFormError('Please select your date of birth');
      return;
    }

    setFormError('');
    setIsSubmitting(true);

    const newDetails: PersonalDetails = {
      fullName,
      email,
      dob,
      gender,
      referralCode: referralApplied ? referralCode : ''
    };

    // Save to persistent storage and set active session
    registerNewUser(phone, newDetails);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      if (onSubmitSuccess) {
        setTimeout(() => {
          onSubmitSuccess(newDetails);
        }, 1800);
      }
    }, 1000);
  };

  return (
    <div id="earn-details-container" className="w-full h-full min-h-screen flex items-center justify-center p-3 sm:p-5 relative">
      {/* Background Soft Floating Spheres */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-400/15 rounded-full blur-3xl pointer-events-none" />

      {/* Floating 3D Glass Card Container */}
      <motion.div
        id="earn-details-card"
        initial={{ opacity: 0, y: 15, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="w-full max-w-[440px] h-[calc(100vh-24px)] max-h-[850px] rounded-[36px] p-5 sm:p-7 glass-card shadow-[0_25px_60px_-15px_rgba(75,99,255,0.22)] text-slate-800 text-center relative overflow-hidden border border-white/80 flex flex-col justify-between"
      >
        {/* Soft Ambient Glows */}
        <div className="absolute -top-12 -right-12 w-52 h-52 bg-gradient-to-bl from-[#4B63FF]/20 to-transparent rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-52 h-52 bg-gradient-to-tr from-[#3549EC]/15 to-transparent rounded-full blur-2xl pointer-events-none" />

        {/* TOP NAVIGATION BAR */}
        <div className="flex items-center justify-between w-full relative z-20 shrink-0 mb-1">
          <button
            id="details-back-btn"
            onClick={onBackToAuth}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100/90 hover:bg-slate-200/90 px-3 py-1.5 rounded-full transition-all cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back</span>
          </button>
          <span className="text-[10px] font-extrabold tracking-wider text-[#3549EC] uppercase bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200/60 font-mono">
            FINAL STEP
          </span>
        </div>

        {/* SCROLLABLE FORM BODY */}
        <div className="relative z-10 flex-1 overflow-y-auto pr-1 my-2 text-left space-y-3.5 scrollbar-thin">
          {/* Header title & icon */}
          <div className="flex items-center gap-3 pt-1">
            <div className="w-12 h-12 rounded-2xl bg-primary-gradient p-0.5 shadow-md flex items-center justify-center shrink-0">
              <div className="w-full h-full rounded-[14px] bg-gradient-to-br from-[#4B63FF] to-[#3549EC] flex items-center justify-center text-white">
                <User className="w-6 h-6" />
              </div>
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 font-outfit">
                Personal Details
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-500 font-medium">
                Set up your profile to activate instant cash withdrawals
              </p>
            </div>
          </div>

          {/* Form starts */}
          <form id="personal-details-form" onSubmit={handleSubmit} className="space-y-3">
            {/* 1. Full Name */}
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1 px-0.5">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3.5 text-slate-400 pointer-events-none">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="details-name-input"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    if (formError) setFormError('');
                  }}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full h-11 pl-10 pr-3.5 rounded-2xl bg-white border border-slate-200/80 text-xs sm:text-sm font-bold text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#4B63FF] focus:border-transparent transition-all shadow-xs"
                />
              </div>
            </div>

            {/* 2. Email Address */}
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1 px-0.5">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3.5 text-slate-400 pointer-events-none">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="details-email-input"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (formError) setFormError('');
                  }}
                  placeholder="name@example.com"
                  className="w-full h-11 pl-10 pr-3.5 rounded-2xl bg-white border border-slate-200/80 text-xs sm:text-sm font-bold text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#4B63FF] focus:border-transparent transition-all shadow-xs"
                />
              </div>
            </div>

            {/* 3. Date of Birth (DOB) */}
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1 px-0.5">
                Date of Birth (DOB) <span className="text-rose-500">*</span>
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3.5 text-slate-400 pointer-events-none">
                  <Calendar className="w-4 h-4" />
                </div>
                <input
                  id="details-dob-input"
                  type="date"
                  required
                  value={dob}
                  max="2012-12-31"
                  min="1950-01-01"
                  onChange={(e) => {
                    setDob(e.target.value);
                    if (formError) setFormError('');
                  }}
                  className="w-full h-11 pl-10 pr-3.5 rounded-2xl bg-white border border-slate-200/80 text-xs sm:text-sm font-bold text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#4B63FF] focus:border-transparent transition-all shadow-xs"
                />
              </div>
            </div>

            {/* 4. Gender Selection */}
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1 px-0.5">
                Gender <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'male', label: 'Male', emoji: '👨' },
                  { id: 'female', label: 'Female', emoji: '👩' },
                  { id: 'other', label: 'Other', emoji: '✨' },
                ].map((item) => (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => setGender(item.id as 'male' | 'female' | 'other')}
                    className={`py-2 px-2.5 rounded-2xl text-xs font-extrabold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                      gender === item.id
                        ? 'bg-primary-gradient text-white border-transparent shadow-sm'
                        : 'bg-white text-slate-700 border-slate-200/80 hover:bg-slate-50'
                    }`}
                  >
                    <span>{item.emoji}</span>
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 5. Referral Code (Optional with bonus) */}
            <div>
              <div className="flex items-center justify-between mb-1 px-0.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Referral Code <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <span className="text-[9.5px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-md border border-emerald-200/60">
                  + ₹25 Bonus Cash
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <div className="absolute left-3.5 text-slate-400 pointer-events-none">
                    <Tag className="w-4 h-4" />
                  </div>
                  <input
                    id="details-referral-input"
                    type="text"
                    disabled={referralApplied}
                    value={referralCode}
                    onChange={(e) => {
                      setReferralCode(e.target.value.toUpperCase());
                      setReferralError('');
                    }}
                    placeholder="e.g. EARNX50"
                    className="w-full h-11 pl-10 pr-3.5 rounded-2xl bg-white border border-slate-200/80 text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#4B63FF] focus:border-transparent transition-all shadow-xs disabled:bg-emerald-50/50 disabled:text-emerald-700 disabled:border-emerald-200"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleApplyReferral}
                  disabled={referralApplied || !referralCode.trim()}
                  className={`h-11 px-3.5 rounded-2xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                    referralApplied
                      ? 'bg-emerald-500 text-white shadow-xs'
                      : 'bg-slate-900 hover:bg-slate-800 text-white disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed'
                  }`}
                >
                  {referralApplied ? <Check className="w-4 h-4" /> : 'Apply'}
                </button>
              </div>
              {referralApplied && (
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 mt-1 px-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Referral applied! ₹25 bonus cash unlocked.</span>
                </div>
              )}
              {referralError && (
                <div className="text-[10px] font-bold text-rose-500 mt-1 px-1">
                  {referralError}
                </div>
              )}
            </div>

            {/* Error banner */}
            {formError && (
              <div className="text-xs font-bold text-rose-500 bg-rose-50 p-2.5 rounded-xl border border-rose-200/80">
                {formError}
              </div>
            )}
          </form>
        </div>

        {/* BOTTOM ACTION SECTION */}
        <div className="relative z-10 w-full space-y-2.5 pt-2 shrink-0">
          <motion.button
            id="details-submit-btn"
            form="personal-details-form"
            type="submit"
            disabled={isSubmitting || isSuccess}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3.5 rounded-2xl bg-primary-gradient hover:opacity-95 text-white font-bold text-xs sm:text-sm tracking-wider uppercase shadow-lg shadow-[#4B63FF]/30 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-80"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>SAVING PROFILE...</span>
              </div>
            ) : (
              <>
                <span>COMPLETE REGISTRATION</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </motion.button>

          {/* Security Note */}
          <div className="flex items-center justify-center gap-1 text-[10px] sm:text-xs text-slate-400 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Your personal data is private & encrypted</span>
          </div>
        </div>

        {/* SUCCESS MODAL OVERLAY */}
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
                  Profile Completed!
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Welcome aboard, <strong className="text-slate-800">{fullName}</strong>. Your EarnX account is now 100% active!
                </p>
              </div>
              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-center gap-2 text-xs font-bold text-emerald-900">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>
                  {referralApplied ? '₹50 Total Welcome Cash Activated!' : '₹25 Total Welcome Cash Activated!'}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
