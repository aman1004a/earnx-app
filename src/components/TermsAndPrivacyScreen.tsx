import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  FileText, 
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  AlertTriangle, 
  Scale, 
  HelpCircle,
  ExternalLink,
  Shield,
  Eye,
  Server,
  UserCheck,
  Ban
} from 'lucide-react';

interface TermsAndPrivacyScreenProps {
  onBack: () => void;
}

type TabType = 'all' | 'terms' | 'privacy' | 'fairplay';

export const TermsAndPrivacyScreen: React.FC<TermsAndPrivacyScreenProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<TabType>('all');

  return (
    <div id="terms-privacy-view" className="w-full h-full flex flex-col bg-[#F8FAFC] text-slate-800 relative overflow-hidden text-left">
      {/* Top Header Bar (Matching Referral & PIN screens) */}
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
              Terms & Privacy Policy
            </h2>
            <p className="text-[10px] text-slate-400 font-medium leading-none">
              Legal policies, privacy guidelines & fair play
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border bg-emerald-50 border-emerald-200 text-emerald-700 text-xs font-black">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Compliant</span>
        </div>
      </header>

      {/* Tabs Filter */}
      <div className="shrink-0 px-4 pt-3 pb-1 bg-white/60 border-b border-slate-200/60">
        <div className="flex gap-1.5 overflow-x-auto scrollbar-none pb-2 text-xs font-bold">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'all'
                ? 'bg-[#4B63FF] text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/60'
            }`}
          >
            All Policies
          </button>
          <button
            onClick={() => setActiveTab('terms')}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'terms'
                ? 'bg-[#4B63FF] text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/60'
            }`}
          >
            Terms of Service
          </button>
          <button
            onClick={() => setActiveTab('privacy')}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'privacy'
                ? 'bg-[#4B63FF] text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/60'
            }`}
          >
            Privacy Policy
          </button>
          <button
            onClick={() => setActiveTab('fairplay')}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'fairplay'
                ? 'bg-[#4B63FF] text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/60'
            }`}
          >
            Fair Play & Anti-Fraud
          </button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4 text-left scrollbar-thin overscroll-contain">
        
        {/* Banner */}
        <div className="p-4 rounded-3xl bg-gradient-to-br from-[#4B63FF] to-[#2E42E2] text-white shadow-lg shadow-[#4B63FF]/20 space-y-2 relative overflow-hidden">
          <div className="absolute -right-6 -bottom-6 w-28 h-28 bg-white/10 rounded-full blur-xl pointer-events-none" />
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold">User Trust & Safety Agreement</h3>
              <p className="text-[10.5px] text-blue-100">Last updated: August 2026 • Version 2.4</p>
            </div>
          </div>
          <p className="text-[11.5px] text-blue-50/90 leading-relaxed pt-1">
            EarnX is committed to providing a transparent, fair, and secure reward platform. By using this application, you agree to comply with the rules and guidelines detailed below.
          </p>
        </div>

        {/* 1. Terms of Service */}
        {(activeTab === 'all' || activeTab === 'terms') && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-3"
          >
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
              <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#4B63FF] flex items-center justify-center">
                <FileText className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                1. Terms of Service
              </h3>
            </div>

            <div className="space-y-2.5 text-xs text-slate-600 leading-relaxed">
              <div>
                <h4 className="font-bold text-slate-800 text-[11.5px]">1.1 User Eligibility & Registration</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Users must be at least 18 years old or possess parental consent to participate. Registration requires a valid Indian mobile number (+91) capable of receiving SMS OTP authentication.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 text-[11.5px]">1.2 Reward Coin Conversion & Payouts</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Earned points/coins can be redeemed for real currency via Indian payment rails (UPI, Bank IMPS, or QR code). Minimum threshold is ₹20. All withdrawals undergo automated risk checks before processing.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 text-[11.5px]">1.3 Task Completion & Offer Rules</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Coin rewards are credited only upon genuine task fulfillment verified by third-party ad partners (OfferToro, AdGem, BitLabs, etc.). Incomplete or spoofed task claims will be rejected automatically.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* 2. Privacy Policy */}
        {(activeTab === 'all' || activeTab === 'privacy') && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-3"
          >
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
              <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Shield className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                2. Privacy Policy & Data Security
              </h3>
            </div>

            <div className="space-y-2.5 text-xs text-slate-600 leading-relaxed">
              <div>
                <h4 className="font-bold text-slate-800 text-[11.5px]">2.1 Information We Collect</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  We collect account identifiers (mobile phone, name, email), transaction identifiers (UPI VPA/Account details for payouts), and anonymous device metadata for anti-fraud detection.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 text-[11.5px]">2.2 How We Use Your Data</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Your information is strictly utilized to process payouts, calculate referral bonuses, prevent fraud, and deliver 24x7 customer support. We never sell personal data to unauthorized third parties.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 text-[11.5px]">2.3 256-Bit Financial Encryption</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  All sensitive payment handles and Security PINs are encrypted using industry-standard TLS 1.3 and SHA-256 protocols. Your 4-digit PIN is stored in a salted hash format.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* 3. Fair Play & Anti-Fraud */}
        {(activeTab === 'all' || activeTab === 'fairplay') && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-3"
          >
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
              <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
                <Ban className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                3. Fair Play & Zero-Tolerance Violations
              </h3>
            </div>

            <div className="space-y-2 text-xs text-slate-600 leading-relaxed">
              <p className="text-[11px] text-slate-500">
                To maintain a fair economy for honest earners, the following behaviors result in immediate account termination and forfeiture of coin balances:
              </p>

              <div className="space-y-1.5 pt-1">
                <div className="p-2.5 rounded-2xl bg-rose-50/60 border border-rose-100/80 flex items-start gap-2 text-[11px] text-rose-900">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                  <span><strong>VPN & Proxy Networks:</strong> Use of VPNs, Tor, or masked IP connections during task completion is strictly banned.</span>
                </div>

                <div className="p-2.5 rounded-2xl bg-rose-50/60 border border-rose-100/80 flex items-start gap-2 text-[11px] text-rose-900">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                  <span><strong>Multiple Accounts on Single Device:</strong> Only 1 account per physical smartphone is permitted. Multiple cloned instances are flagged.</span>
                </div>

                <div className="p-2.5 rounded-2xl bg-rose-50/60 border border-rose-100/80 flex items-start gap-2 text-[11px] text-rose-900">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                  <span><strong>Automated Bots & Emulators:</strong> Using macro tools, auto-clickers, or virtual Android emulators triggers instant system ban.</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Support & Grievance Card */}
        <div className="p-4 rounded-3xl bg-slate-100/80 border border-slate-200/80 space-y-2 text-center">
          <h4 className="text-xs font-black text-slate-800">Questions or Grievances?</h4>
          <p className="text-[11px] text-slate-500">
            For privacy inquiries, account data deletion, or grievance redressal, contact our compliance team:
          </p>
          <div className="pt-1 flex flex-wrap justify-center gap-2">
            <span className="text-[10.5px] font-bold bg-white px-2.5 py-1 rounded-xl border border-slate-200 text-slate-700">
              support@earnx.club
            </span>
            <span className="text-[10.5px] font-bold bg-white px-2.5 py-1 rounded-xl border border-slate-200 text-[#4B63FF]">
              Grievance Officer: New Delhi, India
            </span>
          </div>
        </div>

        {/* Back Button */}
        <button
          onClick={onBack}
          className="w-full py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 font-extrabold text-xs uppercase tracking-wider shadow-xs border border-slate-200/80 transition-colors cursor-pointer"
        >
          Close & Return to Account
        </button>

      </div>
    </div>
  );
};
