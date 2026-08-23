import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  Wallet, 
  Smartphone, 
  Building, 
  QrCode, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  XCircle,
  Clock,
  History, 
  ArrowRight,
  Info,
  Lock,
  RefreshCw,
  Upload,
  Image as ImageIcon,
  Trash2,
  Scan
} from 'lucide-react';
import { PersonalDetails } from './PersonalDetailsScreen';
import { getAdminWithdrawals, saveAdminWithdrawals } from '../utils/adminStorage';
import { getUserWithdrawalPin, setUserWithdrawalPin } from '../utils/authStorage';

export interface WithdrawalTransaction {
  id: string;
  amountInr: number;
  method: 'upi' | 'bank' | 'qr' | 'recharge';
  details: string;
  qrImageUrl?: string;
  status: 'success' | 'processing' | 'failed';
  date: string;
  time: string;
  txHash: string;
}

interface WithdrawalScreenProps {
  balance: number;
  userPhone: string;
  userDetails: PersonalDetails;
  onBack: () => void;
  onWithdrawalSuccess: (amountDeducted: number) => void;
}

export const WithdrawalScreen: React.FC<WithdrawalScreenProps> = ({
  balance,
  userPhone,
  userDetails,
  onBack,
  onWithdrawalSuccess
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'withdraw' | 'history'>('withdraw');
  const [selectedMethod, setSelectedMethod] = useState<'upi' | 'bank' | 'qr'>('upi');
  const [selectedAmount, setSelectedAmount] = useState<number>(50); // Default ₹50

  // Method Inputs
  const [upiId, setUpiId] = useState('');
  const [upiHolderName, setUpiHolderName] = useState(userDetails.fullName || '');
  const [bankAccNumber, setBankAccNumber] = useState('');
  const [confirmBankAcc, setConfirmBankAcc] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [accHolderName, setAccHolderName] = useState(userDetails.fullName || '');
  const [bankName, setBankName] = useState('State Bank of India');

  // QR Code Inputs
  const [qrImage, setQrImage] = useState<string | null>(null);
  const [qrHolderName, setQrHolderName] = useState(userDetails.fullName || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Multi-step: 1 = Form Details, 2 = Verification Summary / PIN Confirmation
  const [withdrawStep, setWithdrawStep] = useState<'form' | 'verify'>('form');
  const [securityPin, setSecurityPin] = useState(['', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [completedTx, setCompletedTx] = useState<WithdrawalTransaction | null>(null);

  // Past withdrawal history synced with Admin Storage
  const loadUserTransactions = (): WithdrawalTransaction[] => {
    const adminTxs = getAdminWithdrawals();
    const userTxs = adminTxs.filter(t => t.userPhone === userPhone);
    if (userTxs.length > 0) {
      return userTxs;
    }
    return adminTxs;
  };

  const [transactions, setTransactions] = useState<WithdrawalTransaction[]>(() => loadUserTransactions());

  // Real-time synchronization whenever admin updates status or localStorage changes
  useEffect(() => {
    const sync = () => {
      setTransactions(loadUserTransactions());
    };
    sync();
    window.addEventListener('storage', sync);
    window.addEventListener('focus', sync);
    const interval = setInterval(sync, 1500);
    return () => {
      window.removeEventListener('storage', sync);
      window.removeEventListener('focus', sync);
      clearInterval(interval);
    };
  }, [userPhone]);

  const redeemAmounts = [
    { inr: 20, label: 'Starter', hot: false },
    { inr: 50, label: 'Popular', hot: true },
    { inr: 100, label: 'Best Value', hot: false },
    { inr: 200, label: 'Pro Withdrawal', hot: false },
    { inr: 500, label: 'VIP Max', hot: false },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please upload a valid image file (PNG, JPG, JPEG)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg('Image size should be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setQrImage(event.target?.result as string);
      setErrorMsg(null);
    };
    reader.readAsDataURL(file);
  };

  const handleProceedToVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (balance < selectedAmount) {
      setErrorMsg(`Insufficient balance! Your wallet has ₹${balance.toFixed(2)}, but ₹${selectedAmount} is required.`);
      return;
    }

    if (selectedMethod === 'upi') {
      if (!upiHolderName.trim()) {
        setErrorMsg('Please enter Account Holder / Beneficiary Name');
        return;
      }
      if (!upiId.trim() || !upiId.includes('@')) {
        setErrorMsg('Please enter a valid UPI ID (e.g. mobile@paytm or name@okaxis)');
        return;
      }
    } else if (selectedMethod === 'bank') {
      if (!accHolderName.trim()) {
        setErrorMsg('Please enter Account Holder Name');
        return;
      }
      if (bankAccNumber.length < 9) {
        setErrorMsg('Please enter a valid Bank Account number');
        return;
      }
      if (bankAccNumber !== confirmBankAcc) {
        setErrorMsg('Account numbers do not match');
        return;
      }
      if (ifscCode.length < 11) {
        setErrorMsg('Please enter a valid 11-digit IFSC code (e.g. SBIN0001234)');
        return;
      }
    } else if (selectedMethod === 'qr') {
      if (!qrImage) {
        setErrorMsg('Please upload your UPI QR Code screenshot or photo');
        return;
      }
      if (!qrHolderName.trim()) {
        setErrorMsg('Please enter the name on your QR code');
        return;
      }
    }

    setWithdrawStep('verify');
  };

  const handlePinChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value.slice(-1);
    }
    if (!/^\d*$/.test(value)) return;

    const newPin = [...securityPin];
    newPin[index] = value;
    setSecurityPin(newPin);
    if (errorMsg) setErrorMsg(null);

    if (value && index < 3) {
      const nextInput = document.getElementById(`pin-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handlePinKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !securityPin[index] && index > 0) {
      const prevInput = document.getElementById(`pin-input-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleFinalVerificationSubmit = () => {
    const pin = securityPin.join('');
    if (pin.length !== 4) {
      setErrorMsg('Please enter your 4-digit security PIN to authorize the transaction');
      return;
    }

    const savedPin = getUserWithdrawalPin(userPhone);
    if (savedPin && pin !== savedPin) {
      setErrorMsg('Incorrect Security PIN. Please enter your valid 4-digit Withdrawal PIN (Set in Account).');
      return;
    }

    // If first time, register this PIN
    if (!savedPin) {
      setUserWithdrawalPin(userPhone, pin);
    }

    setIsLoading(true);
    setErrorMsg(null);

    setTimeout(() => {
      setIsLoading(false);
      const newTx: WithdrawalTransaction & { userPhone: string; userName: string } = {
        id: `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
        userPhone: userPhone,
        userName: userDetails?.fullName || 'User',
        amountInr: selectedAmount,
        method: selectedMethod,
        details: 
          selectedMethod === 'upi' 
            ? `${upiId} (${upiHolderName})` 
            : selectedMethod === 'bank' 
            ? `${bankName} (A/C: **** ${bankAccNumber.slice(-4)})` 
            : `UPI QR Code (${qrHolderName || 'User'})`,
        qrImageUrl: selectedMethod === 'qr' ? qrImage || undefined : undefined,
        status: 'processing', // Initially Pending Admin Approval!
        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        txHash: selectedMethod === 'qr' 
          ? `QR/${Math.floor(1000000000 + Math.random() * 9000000000)}`
          : selectedMethod === 'upi'
          ? `UPI/${Math.floor(1000000000 + Math.random() * 9000000000)}`
          : `IMPS/${Math.floor(1000000000 + Math.random() * 9000000000)}`
      };

      // Save to shared Admin storage
      const currentList = getAdminWithdrawals();
      saveAdminWithdrawals([newTx, ...currentList]);

      setTransactions([newTx, ...transactions]);
      setCompletedTx(newTx);
      setShowSuccessModal(true);
      onWithdrawalSuccess(selectedAmount);
      setWithdrawStep('form');
      setSecurityPin(['', '', '', '']);
    }, 1200);
  };

  return (
    <div id="withdrawal-screen-view" className="w-full h-full flex flex-col bg-[#F8FAFC] text-slate-800 relative overflow-hidden text-left">
      {/* Top Header */}
      <header className="shrink-0 px-4 py-3 border-b border-white/60 bg-white/85 backdrop-blur-xl z-40 flex items-center justify-between shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)]">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (withdrawStep === 'verify') {
                setWithdrawStep('form');
              } else {
                onBack();
              }
            }}
            className="p-2 rounded-2xl bg-white hover:bg-slate-100 text-slate-700 shadow-xs border border-slate-200/80 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h2 className="text-base font-black text-slate-900 tracking-tight font-outfit">
              {withdrawStep === 'verify' ? 'Confirm Withdrawal' : 'Instant Cash Withdrawal'}
            </h2>
            <p className="text-[10px] text-slate-400 font-medium leading-none">
              Instant 0% fee direct bank, UPI & QR transfers
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-black shadow-xs">
          <Wallet className="w-3.5 h-3.5 text-emerald-600" />
          <span>₹{balance.toFixed(2)}</span>
        </div>
      </header>

      {/* Sub Header Tabs (Withdraw Form vs History) */}
      {withdrawStep === 'form' && (
        <div className="shrink-0 px-4 pt-3 pb-1 flex items-center gap-2 border-b border-slate-200/60 bg-white/50">
          <button
            onClick={() => setActiveSubTab('withdraw')}
            className={`flex-1 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeSubTab === 'withdraw'
                ? 'bg-[#4B63FF] text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50'
            }`}
          >
            <Wallet className="w-3.5 h-3.5" />
            <span>Request Withdrawal</span>
          </button>

          <button
            onClick={() => setActiveSubTab('history')}
            className={`flex-1 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeSubTab === 'history'
                ? 'bg-[#4B63FF] text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Withdrawal History ({transactions.length})</span>
          </button>
        </div>
      )}

      {/* Scrollable Content Body */}
      <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4 scrollbar-thin overscroll-contain">
        {withdrawStep === 'verify' ? (
          /* STEP 2: TRANSACTION SUMMARY & SECURE VERIFICATION */
          <div className="space-y-4">
            {/* Summary Card */}
            <div className="p-4 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-3">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
                <div className="p-2 rounded-2xl bg-blue-50 text-[#4B63FF]">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 font-outfit">
                    Transaction Summary
                  </h3>
                  <p className="text-[10px] text-slate-400">Review your withdrawal details</p>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-100/80">
                  <span className="text-slate-500 font-medium">Withdrawal Method:</span>
                  <span className="font-extrabold uppercase text-slate-800 flex items-center gap-1">
                    {selectedMethod === 'upi' && <Smartphone className="w-3.5 h-3.5 text-[#4B63FF]" />}
                    {selectedMethod === 'bank' && <Building className="w-3.5 h-3.5 text-[#4B63FF]" />}
                    {selectedMethod === 'qr' && <QrCode className="w-3.5 h-3.5 text-[#4B63FF]" />}
                    {selectedMethod === 'qr' ? 'UPI QR Code' : selectedMethod}
                  </span>
                </div>

                <div className="flex justify-between py-1 border-b border-slate-100/80">
                  <span className="text-slate-500 font-medium">Destination:</span>
                  <span className="font-bold text-slate-900 font-mono truncate max-w-[180px]">
                    {selectedMethod === 'upi' && `${upiId} (${upiHolderName})`}
                    {selectedMethod === 'bank' && `${bankName} (**** ${bankAccNumber.slice(-4)})`}
                    {selectedMethod === 'qr' && `QR: ${qrHolderName}`}
                  </span>
                </div>

                {selectedMethod === 'qr' && qrImage && (
                  <div className="flex justify-between items-center py-1 border-b border-slate-100/80">
                    <span className="text-slate-500 font-medium">Attached QR:</span>
                    <div className="w-10 h-10 rounded-lg overflow-hidden border border-slate-200 bg-white shadow-2xs">
                      <img src={qrImage} alt="QR Code Preview" className="w-full h-full object-contain" />
                    </div>
                  </div>
                )}

                <div className="flex justify-between py-1 border-b border-slate-100/80">
                  <span className="text-slate-500 font-medium">Withdrawal Amount:</span>
                  <span className="font-black text-slate-900 flex items-center gap-0.5">
                    ₹{selectedAmount}.00 INR
                  </span>
                </div>

                <div className="flex justify-between py-1 border-b border-slate-100/80">
                  <span className="text-slate-500 font-medium">Withdrawal Processing Fee:</span>
                  <span className="font-extrabold text-emerald-600">₹0.00 (100% Free)</span>
                </div>

                <div className="flex justify-between items-baseline pt-2">
                  <span className="text-sm font-black text-slate-900">Total Net Withdrawal:</span>
                  <span className="text-2xl font-black text-[#4B63FF] font-outfit">
                    ₹{selectedAmount} INR
                  </span>
                </div>
              </div>
            </div>

            {/* Secure Verification PIN Step */}
            <div className="p-4 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-3">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-slate-700" />
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-700">
                  Enter 4-Digit Security PIN
                </h4>
              </div>
              <p className="text-[11px] text-slate-500">
                Authorize transfer from your secure EarnX wallet (Default Demo PIN: Any 4 digits).
              </p>

              <div className="grid grid-cols-4 gap-3 py-1">
                {securityPin.map((digit, index) => (
                  <input
                    key={index}
                    id={`pin-input-${index}`}
                    type="password"
                    maxLength={1}
                    value={digit}
                    autoFocus={index === 0}
                    onChange={(e) => handlePinChange(index, e.target.value)}
                    onKeyDown={(e) => handlePinKeyDown(index, e)}
                    className="w-full h-13 rounded-2xl text-center text-xl font-black bg-slate-50 border border-slate-200 shadow-xs focus:ring-2 focus:ring-[#4B63FF] focus:bg-white outline-none text-slate-900"
                  />
                ))}
              </div>

              {errorMsg && (
                <div className="flex items-center gap-2 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-bold">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <button
                type="button"
                onClick={handleFinalVerificationSubmit}
                disabled={isLoading || securityPin.join('').length !== 4}
                className="w-full py-4 rounded-2xl bg-primary-gradient disabled:opacity-50 text-white font-black text-xs sm:text-sm tracking-wider uppercase shadow-lg shadow-[#4B63FF]/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Authorizing & Transferring...</span>
                  </div>
                ) : (
                  <>
                    <span>CONFIRM TRANSFER OF ₹{selectedAmount}</span>
                    <CheckCircle2 className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        ) : activeSubTab === 'withdraw' ? (
          /* STEP 1: FORM SELECTION */
          <div className="space-y-4">
            {/* Wallet Cash Balance Banner */}
            <div className="p-4 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white shadow-md shadow-slate-900/20 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-xl bg-white/10">
                    <Wallet className="w-4 h-4 text-emerald-400" />
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300">
                    Available Cash Balance
                  </span>
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                  Real Cash Withdrawal
                </span>
              </div>

              <div className="flex items-baseline justify-between pt-1">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl font-black font-outfit text-white">
                    ₹{balance.toFixed(2)}
                  </span>
                  <span className="text-xs font-bold text-slate-400">INR</span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-black text-emerald-400 font-outfit block">100% Withdrawable</span>
                  <span className="text-[10px] text-slate-400 font-medium">Instant Transfer</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between text-[11px] text-slate-300">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Instant 24x7 IMPS, UPI & QR processing</span>
                </div>
                <span className="font-bold text-emerald-400">0% Fee</span>
              </div>
            </div>

            {/* Step 1: Select Payment Gateway */}
            <div className="p-4 rounded-3xl bg-white/90 border border-slate-200/80 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-500">
                  1. Select Transfer Gateway
                </h4>
                <span className="text-[10px] font-extrabold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                  Instant
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'upi', label: 'UPI / VPA', sub: 'GPay, Paytm, PhonePe', icon: Smartphone },
                  { id: 'bank', label: 'Bank Transfer', sub: 'IMPS Direct to A/C', icon: Building },
                  { id: 'qr', label: 'UPI QR Code', sub: 'Scan & Pay to QR', icon: QrCode }
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => {
                      setSelectedMethod(m.id as any);
                      setErrorMsg(null);
                    }}
                    className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer text-center ${
                      selectedMethod === m.id
                        ? 'border-[#4B63FF] bg-blue-50/70 text-[#3549EC] font-black shadow-xs ring-2 ring-[#4B63FF]/20'
                        : 'border-slate-200 bg-white text-slate-600 font-bold hover:bg-slate-50'
                    }`}
                  >
                    <m.icon className="w-5 h-5" />
                    <div>
                      <span className="text-[11px] font-black block leading-tight">{m.label}</span>
                      <span className="text-[9px] text-slate-400 block leading-none mt-0.5">{m.sub}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Select Amount */}
            <div className="p-4 rounded-3xl bg-white/90 border border-slate-200/80 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-500">
                  2. Choose Withdrawal Amount
                </h4>
                <span className="text-[10px] font-bold text-slate-400">
                  Min: ₹20
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {redeemAmounts.map((opt) => {
                  const isAvailable = balance >= opt.inr;
                  const isSelected = selectedAmount === opt.inr;

                  return (
                    <button
                      key={opt.inr}
                      type="button"
                      onClick={() => {
                        setSelectedAmount(opt.inr);
                        setErrorMsg(null);
                      }}
                      className={`p-3 rounded-2xl border text-center relative transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#4B63FF] bg-primary-gradient text-white font-black shadow-md shadow-[#4B63FF]/30'
                          : isAvailable
                          ? 'border-slate-200 bg-white text-slate-800 font-extrabold hover:bg-slate-50'
                          : 'border-slate-200/60 bg-slate-50/80 text-slate-400 font-medium'
                      }`}
                    >
                      {opt.hot && !isSelected && (
                        <span className="absolute -top-1.5 right-2 bg-orange-500 text-white text-[8px] font-black uppercase px-1.5 py-0.2 rounded-full">
                          HOT
                        </span>
                      )}
                      <span className="text-base font-black font-outfit block leading-tight">
                        ₹{opt.inr}
                      </span>
                      <span className={`text-[10px] block mt-0.5 font-medium ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>
                        {opt.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Withdrawal Destination Details Form */}
            <div className="p-4 rounded-3xl bg-white/90 border border-slate-200/80 shadow-xs space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-500">
                3. Withdrawal Destination Details
              </h4>

              <form onSubmit={handleProceedToVerify} className="space-y-3">
                {/* UPI Form */}
                {selectedMethod === 'upi' && (
                  <div className="space-y-2.5">
                    <div className="space-y-1">
                      <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-600">
                        Account Holder / Beneficiary Name
                      </label>
                      <input
                        type="text"
                        value={upiHolderName}
                        onChange={(e) => setUpiHolderName(e.target.value)}
                        placeholder="e.g. Rahul Sharma"
                        className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 bg-white text-xs font-bold text-slate-900 focus:ring-2 focus:ring-[#4B63FF] outline-none"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-600">
                        Enter UPI ID / VPA
                      </label>
                      <div className="flex items-center rounded-2xl border border-slate-200 bg-white px-3.5 py-2.5 shadow-xs focus-within:ring-2 focus-within:ring-[#4B63FF]">
                        <Smartphone className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
                        <input
                          type="text"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          placeholder="e.g. mobile@paytm or rahul@okaxis"
                          className="w-full text-xs sm:text-sm font-bold text-slate-900 placeholder:font-normal placeholder:text-slate-400 outline-none bg-transparent"
                          required
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10.5px] text-slate-400 pt-0.5">
                      <Info className="w-3.5 h-3.5 text-[#4B63FF]" />
                      <span>Supports PhonePe, Google Pay, Paytm, BHIM & all UPI apps</span>
                    </div>
                  </div>
                )}

                {/* Bank Account Form */}
                {selectedMethod === 'bank' && (
                  <div className="space-y-2.5">
                    <div className="space-y-1">
                      <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-600">
                        Account Holder Name
                      </label>
                      <input
                        type="text"
                        value={accHolderName}
                        onChange={(e) => setAccHolderName(e.target.value)}
                        placeholder="Full Name as on Bank Passbook"
                        className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 bg-white text-xs font-bold text-slate-900 focus:ring-2 focus:ring-[#4B63FF] outline-none"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-600">
                        Bank Name
                      </label>
                      <select
                        value={bankName}
                        onChange={(e) => setBankName(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 bg-white text-xs font-bold text-slate-900 focus:ring-2 focus:ring-[#4B63FF] outline-none"
                      >
                        <option value="State Bank of India">State Bank of India (SBI)</option>
                        <option value="HDFC Bank">HDFC Bank</option>
                        <option value="ICICI Bank">ICICI Bank</option>
                        <option value="Punjab National Bank">Punjab National Bank (PNB)</option>
                        <option value="Axis Bank">Axis Bank</option>
                        <option value="Bank of Baroda">Bank of Baroda</option>
                        <option value="Kotak Mahindra Bank">Kotak Mahindra Bank</option>
                        <option value="Paytm Payments Bank">Paytm Payments Bank</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-600">
                          Account Number
                        </label>
                        <input
                          type="text"
                          value={bankAccNumber}
                          onChange={(e) => setBankAccNumber(e.target.value.replace(/\D/g, ''))}
                          placeholder="e.g. 98765432101"
                          className="w-full px-3 py-2.5 rounded-2xl border border-slate-200 bg-white text-xs font-bold text-slate-900 focus:ring-2 focus:ring-[#4B63FF] outline-none font-mono"
                          required
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-600">
                          Confirm A/C No.
                        </label>
                        <input
                          type="text"
                          value={confirmBankAcc}
                          onChange={(e) => setConfirmBankAcc(e.target.value.replace(/\D/g, ''))}
                          placeholder="Re-enter A/C No."
                          className="w-full px-3 py-2.5 rounded-2xl border border-slate-200 bg-white text-xs font-bold text-slate-900 focus:ring-2 focus:ring-[#4B63FF] outline-none font-mono"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-600">
                        IFSC Code
                      </label>
                      <input
                        type="text"
                        value={ifscCode}
                        onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
                        placeholder="e.g. SBIN0001234"
                        maxLength={11}
                        className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 bg-white text-xs font-bold uppercase text-slate-900 focus:ring-2 focus:ring-[#4B63FF] outline-none font-mono"
                        required
                      />
                    </div>
                  </div>
                )}

                {/* UPI QR Code Form */}
                {selectedMethod === 'qr' && (
                  <div className="space-y-3">
                    {/* QR Code Image Upload Area */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-600">
                        Upload UPI QR Code Screenshot
                      </label>

                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />

                      {qrImage ? (
                        <div className="p-3 rounded-2xl border-2 border-indigo-500/30 bg-indigo-50/30 flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="w-14 h-14 rounded-xl bg-white border border-slate-200 p-1 flex items-center justify-center shrink-0 shadow-2xs">
                              <img src={qrImage} alt="Uploaded QR" className="w-full h-full object-contain rounded-lg" />
                            </div>
                            <div className="space-y-0.5">
                              <div className="flex items-center gap-1 text-xs font-black text-slate-900">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                <span>QR Code Attached</span>
                              </div>
                              <p className="text-[10px] text-slate-500">Ready for instant QR payout</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => fileInputRef.current?.click()}
                              className="px-2.5 py-1.5 rounded-xl bg-white border border-slate-200 text-[10px] font-bold text-slate-700 hover:bg-slate-50 cursor-pointer shadow-2xs"
                            >
                              Change
                            </button>
                            <button
                              type="button"
                              onClick={() => setQrImage(null)}
                              className="p-1.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 hover:bg-rose-100 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div
                          onClick={() => fileInputRef.current?.click()}
                          className="p-4 rounded-2xl border-2 border-dashed border-slate-300 hover:border-[#4B63FF] bg-slate-50/60 hover:bg-blue-50/30 transition-all flex flex-col items-center justify-center gap-2 cursor-pointer text-center"
                        >
                          <div className="w-10 h-10 rounded-2xl bg-white shadow-2xs border border-slate-200 flex items-center justify-center text-[#4B63FF]">
                            <Scan className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="text-xs font-black text-slate-800 block">
                              Click or Drag to Upload QR Code
                            </span>
                            <span className="text-[10px] text-slate-400 block mt-0.5">
                              PhonePe, GPay, Paytm, BharatPe screenshot (Max 5MB)
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* QR Beneficiary Name */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-600">
                        Beneficiary Name on QR Code
                      </label>
                      <input
                        type="text"
                        value={qrHolderName}
                        onChange={(e) => setQrHolderName(e.target.value)}
                        placeholder="e.g. Rahul Sharma / Kirana Store"
                        className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 bg-white text-xs font-bold text-slate-900 focus:ring-2 focus:ring-[#4B63FF] outline-none"
                        required
                      />
                    </div>

                    <div className="flex items-center gap-1.5 text-[10.5px] text-slate-400 pt-0.5">
                      <Info className="w-3.5 h-3.5 text-[#4B63FF] shrink-0" />
                      <span>Payout will be sent directly to your uploaded QR code</span>
                    </div>
                  </div>
                )}

                {errorMsg && (
                  <div className="flex items-center gap-2 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-bold">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* Next: Proceed to Verification Summary */}
                <button
                  type="submit"
                  disabled={balance < selectedAmount}
                  className="w-full py-4 rounded-2xl bg-primary-gradient disabled:opacity-50 text-white font-black text-xs sm:text-sm tracking-wider uppercase shadow-lg shadow-[#4B63FF]/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                >
                  <span>PROCEED TO VERIFICATION</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        ) : (
          /* SubTab 2: History Log */
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                All Withdrawal Transactions
              </span>
              <span className="text-[11px] font-semibold text-slate-400">
                {transactions.length} Total
              </span>
            </div>

            <div className="space-y-2.5">
              {transactions.map((tx) => (
                <div
                  key={tx.id}
                  onClick={() => {
                    setCompletedTx(tx);
                    setShowSuccessModal(true);
                  }}
                  className="p-3.5 rounded-2xl bg-white/95 border border-slate-200/80 shadow-xs hover:border-[#4B63FF]/30 transition-all flex items-center justify-between gap-3 cursor-pointer hover:shadow-sm active:scale-[0.99]"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold border ${
                      tx.status === 'processing'
                        ? 'bg-amber-50 text-amber-600 border-amber-200/60'
                        : tx.status === 'failed'
                        ? 'bg-rose-50 text-rose-600 border-rose-200/60'
                        : 'bg-emerald-50 text-emerald-600 border-emerald-200/60'
                    }`}>
                      {tx.method === 'upi' ? (
                        <Smartphone className="w-5 h-5" />
                      ) : tx.method === 'bank' ? (
                        <Building className="w-5 h-5" />
                      ) : (
                        <QrCode className="w-5 h-5" />
                      )}
                    </div>
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-black text-slate-900">
                          ₹{tx.amountInr} INR
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 font-medium truncate max-w-[150px]">
                        {tx.details}
                      </p>
                      <p className="text-[9px] text-slate-400 font-mono">
                        {tx.date} • {tx.time}
                      </p>
                    </div>
                  </div>

                  <div className="text-right space-y-1 shrink-0">
                    {tx.status === 'processing' ? (
                      <span className="inline-flex items-center gap-1 text-[9.5px] font-black bg-amber-100 text-amber-700 px-2 py-0.5 rounded-md border border-amber-200">
                        <Clock className="w-2.5 h-2.5 animate-spin" />
                        <span>Pending</span>
                      </span>
                    ) : tx.status === 'failed' ? (
                      <span className="inline-flex items-center gap-1 text-[9.5px] font-black bg-rose-100 text-rose-700 px-2 py-0.5 rounded-md border border-rose-200">
                        <XCircle className="w-2.5 h-2.5" />
                        <span>Failed / Rejected</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[9.5px] font-black bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-md border border-emerald-200">
                        <CheckCircle2 className="w-2.5 h-2.5" />
                        <span>Success (Paid)</span>
                      </span>
                    )}
                    <p className="text-[8.5px] text-slate-400 font-mono block">
                      {tx.id}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Detail / Status Modal Popup */}
      <AnimatePresence>
        {showSuccessModal && completedTx && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-[360px] rounded-3xl p-6 bg-white text-slate-800 text-center space-y-4 shadow-2xl border border-slate-100"
            >
              <div className={`w-16 h-16 rounded-3xl flex items-center justify-center mx-auto shadow-md ${
                completedTx.status === 'processing'
                  ? 'bg-amber-100 text-amber-600 shadow-amber-500/20'
                  : completedTx.status === 'failed'
                  ? 'bg-rose-100 text-rose-600 shadow-rose-500/20'
                  : 'bg-emerald-100 text-emerald-600 shadow-emerald-500/20'
              }`}>
                {completedTx.status === 'processing' ? (
                  <Clock className="w-9 h-9 animate-pulse" />
                ) : completedTx.status === 'failed' ? (
                  <XCircle className="w-9 h-9" />
                ) : (
                  <CheckCircle2 className="w-9 h-9" />
                )}
              </div>
              
              <div className="space-y-1">
                <h3 className="text-xl font-extrabold text-slate-900 font-outfit">
                  {completedTx.status === 'processing'
                    ? 'Request Submitted!'
                    : completedTx.status === 'failed'
                    ? 'Withdrawal Rejected'
                    : 'Withdrawal Successful!'}
                </h3>
                <p className="text-xs text-slate-500">
                  {completedTx.status === 'processing'
                    ? `₹${completedTx.amountInr} withdrawal request has been submitted successfully.`
                    : completedTx.status === 'failed'
                    ? `Your withdrawal request of ₹${completedTx.amountInr} was failed / rejected.`
                    : `₹${completedTx.amountInr} has been transferred and paid out to your account.`}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 text-left space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Transaction ID:</span>
                  <span className="font-mono font-bold text-slate-700">{completedTx.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Amount:</span>
                  <span className="font-bold text-slate-900">₹{completedTx.amountInr}.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Account:</span>
                  <span className="font-bold text-slate-700 truncate max-w-[160px]">{completedTx.details}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Current Status:</span>
                  <span className={`font-black px-2 py-0.5 rounded-md text-[11px] ${
                    completedTx.status === 'processing'
                      ? 'bg-amber-100 text-amber-700'
                      : completedTx.status === 'failed'
                      ? 'bg-rose-100 text-rose-700'
                      : 'bg-emerald-100 text-emerald-700'
                  }`}>
                    {completedTx.status === 'processing'
                      ? 'Pending ⏳'
                      : completedTx.status === 'failed'
                      ? 'Failed / Rejected ❌'
                      : 'Success ✨'}
                  </span>
                </div>
                {completedTx.txHash && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">Reference / UTR:</span>
                    <span className="font-mono text-[10px] text-slate-600 truncate max-w-[160px]">{completedTx.txHash}</span>
                  </div>
                )}
              </div>

              <button
                onClick={() => {
                  setShowSuccessModal(false);
                  setActiveSubTab('history');
                }}
                className="w-full py-3.5 rounded-2xl bg-[#4B63FF] hover:bg-[#3549EC] text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-[#4B63FF]/30 cursor-pointer"
              >
                View All Transactions
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

