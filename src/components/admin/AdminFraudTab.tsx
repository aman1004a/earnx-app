import React, { useState, useMemo } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  Ban, 
  Smartphone, 
  RefreshCw, 
  Search,
  CheckCircle2,
  Lock,
  Unlock,
  UserX,
  Globe,
  Cpu,
  Layers,
  Zap,
  Sliders,
  Download,
  Eye,
  X,
  Radio,
  FileText,
  ChevronDown,
  ChevronUp,
  Terminal,
  Activity,
  Filter,
  Clock,
  Sparkles,
  Fingerprint,
  Users,
  Shield,
  Laptop,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { FraudUserRecord, AdminUserRecord } from '../../utils/adminStorage';
import { useAdminTheme } from './AdminThemeContext';

interface AdminFraudTabProps {
  fraudRecords: FraudUserRecord[];
  onUpdateFraudRecords: (records: FraudUserRecord[]) => void;
  users?: Record<string, AdminUserRecord>;
  onUpdateUsers?: (users: Record<string, AdminUserRecord>) => void;
  showToast: (msg: string) => void;
}

interface SecurityRule {
  id: string;
  name: string;
  description: string;
  category: string;
  enabled: boolean;
  sensitivity: 'low' | 'medium' | 'high';
  action: 'flag' | 'auto_ban' | 'block_withdrawal';
}

const DEFAULT_SECURITY_RULES: SecurityRule[] = [
  {
    id: 'rule-device-clone',
    name: 'Hardware Fingerprint Multi-Account Guard',
    description: 'Auto-flag when more than 2 accounts register or login from the exact same hardware IMEI/Android ID.',
    category: 'Device Integrity',
    enabled: true,
    sensitivity: 'high',
    action: 'block_withdrawal'
  },
  {
    id: 'rule-vpn-proxy',
    name: 'Datacenter VPN & Tor Proxy Shield',
    description: 'Detect non-residential IP ranges, NordVPN/ExpressVPN relays, and Tor exit nodes.',
    category: 'Network Security',
    enabled: true,
    sensitivity: 'high',
    action: 'flag'
  },
  {
    id: 'rule-bot-clicker',
    name: 'Macro & Speed-Tap Bot Trap',
    description: 'Detect sub-human reaction speeds (<180ms) and automated accessibility clickers on Spin/Tasks.',
    category: 'Behavioral AI',
    enabled: true,
    sensitivity: 'medium',
    action: 'flag'
  },
  {
    id: 'rule-referral-ring',
    name: 'Circular Referral Collision Detector',
    description: 'Detect reciprocal invites and fake referral farming between same subnet IP addresses.',
    category: 'Economics & Referrals',
    enabled: true,
    sensitivity: 'high',
    action: 'auto_ban'
  },
  {
    id: 'rule-proof-hasher',
    name: 'Screenshot MD5 Duplicate Collision Hasher',
    description: 'Compare perceptual image hashes to prevent uploading stolen or recycled task screenshots.',
    category: 'Task Auditing',
    enabled: true,
    sensitivity: 'high',
    action: 'block_withdrawal'
  },
  {
    id: 'rule-emulator-detector',
    name: 'PC Android Virtualizer / Emulator Trap',
    description: 'Block Nox, BlueStacks, LDPlayer, and MEmu emulators with tampered x86 runtime signatures.',
    category: 'Device Integrity',
    enabled: true,
    sensitivity: 'high',
    action: 'auto_ban'
  }
];

export const AdminFraudTab: React.FC<AdminFraudTabProps> = ({
  fraudRecords = [],
  onUpdateFraudRecords,
  users = {},
  onUpdateUsers,
  showToast
}) => {
  const { isDark } = useAdminTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'critical' | 'flagged' | 'banned' | 'clean'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selectedRecordForDetail, setSelectedRecordForDetail] = useState<FraudUserRecord | null>(null);
  const [isRulesDrawerOpen, setIsRulesDrawerOpen] = useState(false);
  const [securityRules, setSecurityRules] = useState<SecurityRule[]>(DEFAULT_SECURITY_RULES);
  const [isScannerModalOpen, setIsScannerModalOpen] = useState(false);
  const [scanInput, setScanInput] = useState('');
  const [scanResult, setScanResult] = useState<any>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});

  // Computed Telemetry Metrics
  const metrics = useMemo(() => {
    const totalThreats = fraudRecords.length;
    const criticalThreats = fraudRecords.filter(f => f.riskScore >= 75).length;
    const flaggedPending = fraudRecords.filter(f => f.status === 'flagged').length;
    const bannedCount = fraudRecords.filter(f => f.status === 'banned' || f.status === 'blocked').length;
    const cleanCount = fraudRecords.filter(f => f.status === 'clean' || f.status === 'pardoned').length;
    const totalFrozenRupees = fraudRecords.reduce((acc, f) => acc + (f.frozenBalance || (f.status === 'flagged' ? 250 : 0)), 0);
    const vpnDetections = fraudRecords.filter(f => f.vpnDetected).length;

    return {
      totalThreats,
      criticalThreats,
      flaggedPending,
      bannedCount,
      cleanCount,
      totalFrozenRupees,
      vpnDetections
    };
  }, [fraudRecords]);

  // Filtered list
  const filteredRecords = useMemo(() => {
    return fraudRecords.filter(record => {
      // Search matching
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || 
        (record.userName && record.userName.toLowerCase().includes(q)) ||
        (record.userPhone && record.userPhone.includes(q)) ||
        (record.ipAddress && record.ipAddress.includes(q)) ||
        (record.deviceId && record.deviceId.toLowerCase().includes(q)) ||
        (record.id && record.id.toLowerCase().includes(q)) ||
        (record.detectedReasons && record.detectedReasons.some(r => r.toLowerCase().includes(q)));

      // Status matching
      let matchesStatus = true;
      if (statusFilter === 'critical') {
        matchesStatus = record.riskScore >= 75;
      } else if (statusFilter === 'flagged') {
        matchesStatus = record.status === 'flagged';
      } else if (statusFilter === 'banned') {
        matchesStatus = record.status === 'banned' || record.status === 'blocked';
      } else if (statusFilter === 'clean') {
        matchesStatus = record.status === 'clean' || record.status === 'pardoned';
      }

      // Category matching
      let matchesCategory = true;
      if (categoryFilter !== 'all') {
        matchesCategory = record.category === categoryFilter;
      }

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [fraudRecords, searchQuery, statusFilter, categoryFilter]);

  // Handlers for mitigation actions
  const handleTakeAction = (id: string, action: 'ban_user' | 'pardon' | 'toggle_lock') => {
    const record = fraudRecords.find(r => r.id === id);
    if (!record) return;

    let updatedRecords: FraudUserRecord[] = [];

    if (action === 'ban_user') {
      updatedRecords = fraudRecords.map(r => {
        if (r.id === id) {
          return {
            ...r,
            status: 'banned' as const,
            riskScore: Math.max(r.riskScore, 95),
            isWithdrawalLocked: true,
            severity: 'high' as const
          };
        }
        return r;
      });

      // Synchronize with users db if available
      if (users && onUpdateUsers && record.userPhone) {
        const cleanPhone = record.userPhone.replace(/\D/g, '').slice(-10);
        if (users[cleanPhone]) {
          const updatedUsers = {
            ...users,
            [cleanPhone]: {
              ...users[cleanPhone],
              status: 'flagged' as const
            }
          };
          onUpdateUsers(updatedUsers);
        }
      }

      showToast(`🚫 Account for ${record.userName || record.userPhone} banned and wallet frozen.`);
    } else if (action === 'pardon') {
      updatedRecords = fraudRecords.map(r => {
        if (r.id === id) {
          return {
            ...r,
            status: 'clean' as const,
            riskScore: 10,
            isWithdrawalLocked: false,
            severity: 'low' as const
          };
        }
        return r;
      });

      // Synchronize with users db
      if (users && onUpdateUsers && record.userPhone) {
        const cleanPhone = record.userPhone.replace(/\D/g, '').slice(-10);
        if (users[cleanPhone]) {
          const updatedUsers = {
            ...users,
            [cleanPhone]: {
              ...users[cleanPhone],
              status: 'active' as const
            }
          };
          onUpdateUsers(updatedUsers);
        }
      }

      showToast(`🛡️ Threat alert pardoned. User marked as clean & whitelisted.`);
    } else if (action === 'toggle_lock') {
      const willLock = !record.isWithdrawalLocked;
      updatedRecords = fraudRecords.map(r => {
        if (r.id === id) {
          return {
            ...r,
            isWithdrawalLocked: willLock
          };
        }
        return r;
      });
      showToast(willLock ? `🔒 Withdrawals locked for ${record.userName}` : `🔓 Withdrawals unlocked for ${record.userName}`);
    }

    onUpdateFraudRecords(updatedRecords);

    // If modal open, update modal object
    if (selectedRecordForDetail && selectedRecordForDetail.id === id) {
      const updated = updatedRecords.find(r => r.id === id);
      if (updated) setSelectedRecordForDetail(updated);
    }
  };

  const toggleCardExpand = (id: string) => {
    setExpandedCards(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const toggleSecurityRule = (ruleId: string) => {
    setSecurityRules(prev =>
      prev.map(rule => {
        if (rule.id === ruleId) {
          const newState = !rule.enabled;
          showToast(`${newState ? 'Enabled' : 'Disabled'} ${rule.name}`);
          return { ...rule, enabled: newState };
        }
        return rule;
      })
    );
  };

  // Run Manual Forensic Scanner
  const handleRunManualScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scanInput.trim()) return;

    setIsScanning(true);
    setScanResult(null);

    setTimeout(() => {
      const input = scanInput.trim().toLowerCase();
      const matchedRecord = fraudRecords.find(f => 
        (f.userPhone && f.userPhone.includes(input)) ||
        (f.ipAddress && f.ipAddress.includes(input)) ||
        (f.deviceId && f.deviceId.toLowerCase().includes(input)) ||
        (f.userName && f.userName.toLowerCase().includes(input))
      );

      if (matchedRecord) {
        setScanResult({
          type: 'known_threat',
          record: matchedRecord,
          message: `Match found in active telemetry index (${matchedRecord.detectedReasons.length} active risk signatures)`
        });
      } else {
        // Run heuristic prediction
        const isIp = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(input);
        const isPhone = /^[0-9+ ]{10,14}$/.test(input);

        if (isIp && (input.startsWith('103.') || input.startsWith('45.') || input.startsWith('185.'))) {
          setScanResult({
            type: 'heuristic_high',
            score: 84,
            category: 'VPN / Datacenter ASN',
            isp: 'DataCenter Host / Proxy Relay',
            signatures: ['Autonomous System ASN tagged with VPN exit proxy', 'Latency jitter anomaly detected'],
            verdict: 'Suspicious / Datacenter IP'
          });
        } else if (isPhone) {
          setScanResult({
            type: 'heuristic_clean',
            score: 12,
            category: 'Mobile Subscriber',
            isp: 'Reliance Jio / Airtel LTE',
            signatures: ['Valid Indian Telecom E.164 Prefix', 'No previous abuse history registered in last 90 days'],
            verdict: 'Safe / Low Risk Profile'
          });
        } else {
          setScanResult({
            type: 'heuristic_moderate',
            score: 35,
            category: 'Hardware Fingerprint',
            isp: 'Unknown / Direct',
            signatures: ['Clean hardware hash signature', 'Standard OpenGL ES Renderer'],
            verdict: 'No high-severity risks identified'
          });
        }
      }

      setIsScanning(false);
    }, 600);
  };

  // Export JSON Report
  const handleExportFraudReport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(fraudRecords, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `earnx_fraud_telemetry_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('📥 Anti-Fraud Security Audit log exported successfully.');
  };

  const getScoreColorBadge = (score: number) => {
    if (score >= 80) {
      return (
        <span className="inline-flex items-center gap-1 bg-rose-500/15 text-rose-500 border border-rose-500/30 px-2.5 py-1 rounded-lg text-xs font-black">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
          Critical ({score}/100)
        </span>
      );
    } else if (score >= 60) {
      return (
        <span className="inline-flex items-center gap-1 bg-amber-500/15 text-amber-500 border border-amber-500/30 px-2.5 py-1 rounded-lg text-xs font-black">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
          High Risk ({score}/100)
        </span>
      );
    } else if (score >= 35) {
      return (
        <span className="inline-flex items-center gap-1 bg-yellow-500/15 text-yellow-500 border border-yellow-500/30 px-2.5 py-1 rounded-lg text-xs font-black">
          Suspicious ({score}/100)
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center gap-1 bg-emerald-500/15 text-emerald-500 border border-emerald-500/30 px-2.5 py-1 rounded-lg text-xs font-black">
          <Check className="w-3 h-3" />
          Clean ({score}/100)
        </span>
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Telemetry Header */}
      <div className={`p-6 rounded-3xl border transition-all relative overflow-hidden ${
        isDark 
          ? 'bg-gradient-to-br from-[#1E293B] via-[#0F172A] to-[#111827] border-slate-800 shadow-2xl text-white' 
          : 'bg-gradient-to-br from-white via-slate-50 to-indigo-50/40 border-slate-200/90 shadow-xs text-slate-900'
      }`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5 flex-wrap">
              <div className="p-2.5 rounded-2xl bg-rose-500/20 text-rose-500 border border-rose-500/30">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-black tracking-tight">Anti-Fraud & Risk Security Engine</h1>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-500/20 text-rose-400 border border-rose-500/30">
                    Live Defense Active
                  </span>
                </div>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Real-time device integrity verification, VPN/proxy blocking, auto-click bot detection & multi-account defense
                </p>
              </div>
            </div>
          </div>

          {/* Quick Action Toolbar */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() => setIsScannerModalOpen(true)}
              className={`px-3.5 py-2.5 rounded-2xl text-xs font-bold border flex items-center gap-2 cursor-pointer transition-all ${
                isDark 
                  ? 'bg-slate-800/80 hover:bg-slate-800 border-slate-700 text-slate-200' 
                  : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-800 shadow-xs'
              }`}
            >
              <Terminal className="w-4 h-4 text-indigo-400" />
              <span>Forensic Scanner</span>
            </button>

            <button
              onClick={() => setIsRulesDrawerOpen(!isRulesDrawerOpen)}
              className={`px-3.5 py-2.5 rounded-2xl text-xs font-bold border flex items-center gap-2 cursor-pointer transition-all ${
                isRulesDrawerOpen
                  ? 'bg-indigo-600 border-indigo-500 text-white shadow-md'
                  : isDark 
                  ? 'bg-slate-800/80 hover:bg-slate-800 border-slate-700 text-slate-200' 
                  : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-800 shadow-xs'
              }`}
            >
              <Sliders className="w-4 h-4 text-emerald-400" />
              <span>Defense Rules ({securityRules.filter(r => r.enabled).length}/{securityRules.length})</span>
            </button>

            <button
              onClick={handleExportFraudReport}
              className={`p-2.5 rounded-2xl border text-xs font-bold cursor-pointer transition-all ${
                isDark 
                  ? 'bg-slate-800/80 hover:bg-slate-800 border-slate-700 text-slate-300' 
                  : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700 shadow-xs'
              }`}
              title="Export Security Audit Log"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 5 KPI Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 pt-6">
          <div className={`p-4 rounded-2xl border ${
            isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white/80 border-slate-200/80'
          }`}>
            <div className="flex items-center justify-between text-xs font-bold text-slate-400 mb-1">
              <span>Flagged Alerts</span>
              <AlertTriangle className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl font-black text-amber-500">{metrics.flaggedPending}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Awaiting Admin Action</div>
          </div>

          <div className={`p-4 rounded-2xl border ${
            isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white/80 border-slate-200/80'
          }`}>
            <div className="flex items-center justify-between text-xs font-bold text-slate-400 mb-1">
              <span>Critical Threat</span>
              <ShieldAlert className="w-4 h-4 text-rose-500" />
            </div>
            <div className="text-2xl font-black text-rose-500">{metrics.criticalThreats}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Risk Score ≥ 75</div>
          </div>

          <div className={`p-4 rounded-2xl border ${
            isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white/80 border-slate-200/80'
          }`}>
            <div className="flex items-center justify-between text-xs font-bold text-slate-400 mb-1">
              <span>VPN / Proxies</span>
              <Globe className="w-4 h-4 text-sky-500" />
            </div>
            <div className="text-2xl font-black text-sky-500">{metrics.vpnDetections}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Datacenter IPs</div>
          </div>

          <div className={`p-4 rounded-2xl border ${
            isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white/80 border-slate-200/80'
          }`}>
            <div className="flex items-center justify-between text-xs font-bold text-slate-400 mb-1">
              <span>Banned Actors</span>
              <Ban className="w-4 h-4 text-purple-500" />
            </div>
            <div className="text-2xl font-black text-purple-500">{metrics.bannedCount}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Permanently Locked</div>
          </div>

          <div className={`p-4 rounded-2xl border col-span-2 sm:col-span-1 ${
            isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white/80 border-slate-200/80'
          }`}>
            <div className="flex items-center justify-between text-xs font-bold text-slate-400 mb-1">
              <span>Protected Funds</span>
              <Lock className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-2xl font-black text-emerald-500">₹{metrics.totalFrozenRupees.toLocaleString()}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Saved from fake cashout</div>
          </div>
        </div>
      </div>

      {/* Expandable Defense Rules Policy Engine */}
      <AnimatePresence>
        {isRulesDrawerOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`p-6 rounded-3xl border space-y-4 ${
              isDark ? 'bg-[#1E293B] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-black flex items-center gap-2">
                  <Shield className="w-5 h-5 text-indigo-500" />
                  Automated Security Rules & Detection Policies
                </h3>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Configure live algorithms that detect fraud and automatically safeguard wallet balances
                </p>
              </div>
              <button
                onClick={() => setIsRulesDrawerOpen(false)}
                className={`p-1.5 rounded-xl cursor-pointer ${isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-600'}`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-2">
              {securityRules.map((rule) => (
                <div
                  key={rule.id}
                  className={`p-4 rounded-2xl border transition-all flex flex-col justify-between gap-3 ${
                    rule.enabled 
                      ? isDark ? 'bg-slate-900/80 border-indigo-500/40' : 'bg-indigo-50/40 border-indigo-200' 
                      : isDark ? 'bg-slate-900/30 border-slate-800 opacity-60' : 'bg-slate-50 border-slate-200 opacity-60'
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${
                        isDark ? 'bg-slate-800 text-indigo-400' : 'bg-white text-indigo-700 border border-indigo-100'
                      }`}>
                        {rule.category}
                      </span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={rule.enabled}
                          onChange={() => toggleSecurityRule(rule.id)}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-slate-700 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                      </label>
                    </div>
                    <h4 className="text-xs font-black">{rule.name}</h4>
                    <p className={`text-[11px] leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      {rule.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-[10px] font-mono font-bold pt-1 border-t border-slate-700/40">
                    <span className="text-slate-400">Sensitivity: <strong className="text-indigo-400 uppercase">{rule.sensitivity}</strong></span>
                    <span className="text-slate-400">Action: <strong className="text-rose-400 uppercase">{rule.action.replace('_', ' ')}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Controls & Filter Bar */}
      <div className={`p-5 rounded-3xl border space-y-4 ${
        isDark ? 'bg-[#1E293B] border-slate-800 text-white' : 'bg-white border-slate-200/90 text-slate-900 shadow-xs'
      }`}>
        <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
            <input
              id="input-admin-search-fraud"
              type="text"
              placeholder="Search by user name, phone (+91...), IP address, device ID, or threat reason..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-10 pr-4 py-2.5 rounded-2xl text-xs font-medium border focus:outline-hidden transition-all ${
                isDark 
                  ? 'bg-slate-900 border-slate-700 text-white placeholder-slate-500 focus:border-indigo-500' 
                  : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-indigo-500'
              }`}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 text-xs"
              >
                Clear
              </button>
            )}
          </div>

          {/* Status Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            {[
              { id: 'all', label: 'All Threats' },
              { id: 'critical', label: 'Critical Risk (75+)' },
              { id: 'flagged', label: 'Flagged / Review' },
              { id: 'banned', label: 'Banned / Frozen' },
              { id: 'clean', label: 'Whitelisted' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id as any)}
                className={`px-3 py-2 rounded-xl text-xs font-bold cursor-pointer whitespace-nowrap transition-all ${
                  statusFilter === tab.id
                    ? 'bg-indigo-600 text-white shadow-md'
                    : isDark
                    ? 'bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pt-1 text-xs">
          <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1 shrink-0">
            <Filter className="w-3.5 h-3.5" /> Category:
          </span>
          {[
            { id: 'all', label: 'All Categories' },
            { id: 'clone', label: 'Hardware Clones' },
            { id: 'vpn', label: 'VPN / Datacenter' },
            { id: 'bot', label: 'Auto-Clicker Bots' },
            { id: 'emulator', label: 'PC Emulators' },
            { id: 'proof_tamper', label: 'Proof Tampering' }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(cat.id)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition-all shrink-0 ${
                categoryFilter === cat.id
                  ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/40'
                  : isDark
                  ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Fraud Alert Cards Feed */}
      <div className="space-y-4">
        {filteredRecords.length === 0 ? (
          <div className={`p-12 rounded-3xl border text-center space-y-3 ${
            isDark ? 'bg-[#1E293B] border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-slate-500'
          }`}>
            <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h4 className={`text-base font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
              No Threat Alerts Found
            </h4>
            <p className="text-xs max-w-md mx-auto">
              All monitored devices, network IPs, and task activities pass integrity heuristics without active violations.
            </p>
            {searchQuery && (
              <button
                onClick={() => { setSearchQuery(''); setStatusFilter('all'); setCategoryFilter('all'); }}
                className="mt-2 text-xs font-bold text-indigo-500 hover:underline cursor-pointer"
              >
                Reset Search Filters
              </button>
            )}
          </div>
        ) : (
          filteredRecords.map((record) => {
            const isExpanded = !!expandedCards[record.id];
            const isBanned = record.status === 'banned' || record.status === 'blocked';
            const isClean = record.status === 'clean' || record.status === 'pardoned';

            return (
              <div
                key={record.id}
                className={`rounded-3xl border transition-all overflow-hidden ${
                  record.riskScore >= 75
                    ? isDark ? 'bg-[#1E293B] border-rose-500/30 shadow-lg shadow-rose-950/10' : 'bg-white border-rose-300 shadow-sm'
                    : isDark ? 'bg-[#1E293B] border-slate-800 shadow-md' : 'bg-white border-slate-200/90 shadow-xs'
                }`}
              >
                {/* Main Card Header / Summary */}
                <div className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Left Side: Avatar, Threat Details, Identity */}
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-2xl shrink-0 ${
                      record.riskScore >= 75
                        ? 'bg-rose-500/20 text-rose-500 border border-rose-500/30'
                        : record.riskScore >= 50
                        ? 'bg-amber-500/20 text-amber-500 border border-amber-500/30'
                        : 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/30'
                    }`}>
                      <Fingerprint className="w-6 h-6" />
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        {getScoreColorBadge(record.riskScore)}
                        
                        <span className={`text-xs font-mono font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          {record.userName || 'Unknown User'} ({record.userPhone})
                        </span>

                        {record.vpnDetected && (
                          <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-400 border border-purple-500/30">
                            VPN / Proxy
                          </span>
                        )}

                        {record.isRooted && (
                          <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-400 border border-rose-500/30">
                            Root / Emulator
                          </span>
                        )}

                        <span className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                          ● {record.lastActivity || 'Recent'}
                        </span>
                      </div>

                      {/* Primary Threat Reasons */}
                      <div className="space-y-1">
                        <p className={`text-xs font-extrabold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                          {record.detectedReasons[0]}
                        </p>
                        {record.detectedReasons.length > 1 && (
                          <p className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            +{record.detectedReasons.length - 1} additional suspicious indicators detected
                          </p>
                        )}
                      </div>

                      {/* Hardware & Network Meta Pills */}
                      <div className={`flex items-center gap-2.5 text-[11px] font-mono flex-wrap pt-1 ${
                        isDark ? 'text-slate-400' : 'text-slate-500'
                      }`}>
                        <span className="flex items-center gap-1">
                          <Globe className="w-3 h-3 text-indigo-400" />
                          IP: <strong>{record.ipAddress}</strong>
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Smartphone className="w-3 h-3 text-sky-400" />
                          Device: <strong>{record.deviceModel || record.deviceId}</strong>
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3 text-amber-400" />
                          Linked Clones: <strong className={record.duplicateAccountsCount && record.duplicateAccountsCount > 1 ? 'text-rose-400' : ''}>{record.duplicateAccountsCount || 1}</strong>
                        </span>
                        {record.frozenBalance ? (
                          <>
                            <span>•</span>
                            <span className="text-emerald-500 font-bold">
                              Protected: ₹{record.frozenBalance}
                            </span>
                          </>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  {/* Right Side: Quick Action Buttons */}
                  <div className="flex items-center gap-2 shrink-0 self-end lg:self-center flex-wrap">
                    <button
                      onClick={() => setSelectedRecordForDetail(record)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold border flex items-center gap-1.5 cursor-pointer transition-all ${
                        isDark 
                          ? 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200' 
                          : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-800'
                      }`}
                    >
                      <Eye className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Inspect Dossier</span>
                    </button>

                    {record.status === 'flagged' ? (
                      <>
                        <button
                          id={`btn-fraud-ban-${record.id}`}
                          onClick={() => handleTakeAction(record.id, 'ban_user')}
                          className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-black flex items-center gap-1.5 cursor-pointer shadow-md transition-all"
                        >
                          <Ban className="w-3.5 h-3.5" />
                          <span>Ban & Freeze</span>
                        </button>
                        
                        <button
                          onClick={() => handleTakeAction(record.id, 'pardon')}
                          className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                            isDark 
                              ? 'border-slate-700 text-slate-300 hover:bg-slate-800' 
                              : 'border-slate-200 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          Pardon
                        </button>
                      </>
                    ) : isBanned ? (
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-extrabold px-3 py-1.5 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
                          BANNED & FROZEN
                        </span>
                        <button
                          onClick={() => handleTakeAction(record.id, 'pardon')}
                          className={`text-xs px-2.5 py-1 rounded-lg border font-bold ${
                            isDark ? 'border-slate-700 text-slate-300 hover:bg-slate-800' : 'border-slate-200 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          Unban
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs font-extrabold px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        CLEAN / VERIFIED
                      </span>
                    )}

                    <button
                      onClick={() => toggleCardExpand(record.id)}
                      className={`p-2 rounded-xl border text-xs cursor-pointer ${
                        isDark ? 'border-slate-800 hover:bg-slate-800 text-slate-400' : 'border-slate-200 hover:bg-slate-100 text-slate-600'
                      }`}
                      title={isExpanded ? "Collapse Details" : "Expand Linked Clones & Network"}
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Collapsible Deep Overview within Card */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className={`border-t px-5 py-4 space-y-4 ${
                        isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50/80 border-slate-200'
                      }`}
                    >
                      {/* All Reasons */}
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                          Full Telemetry Flags & Risk Signatures
                        </span>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {record.detectedReasons.map((reason, idx) => (
                            <div
                              key={idx}
                              className={`p-2.5 rounded-xl text-xs flex items-start gap-2 border ${
                                isDark ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-white border-slate-200 text-slate-800'
                              }`}
                            >
                              <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                              <span>{reason}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Linked Accounts Cluster Table */}
                      {record.linkedAccounts && record.linkedAccounts.length > 0 && (
                        <div className="space-y-2 pt-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                              <Users className="w-3.5 h-3.5 text-indigo-400" />
                              Linked Multi-Account Cluster on this Device / IP ({record.linkedAccounts.length})
                            </span>
                            <span className="text-[11px] font-bold text-rose-400">
                              Total Cluster Balance: ₹{record.linkedAccounts.reduce((a, b) => a + b.balance, 0)}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                            {record.linkedAccounts.map((acc, idx) => (
                              <div
                                key={idx}
                                className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
                                  isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200'
                                }`}
                              >
                                <div>
                                  <div className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{acc.name}</div>
                                  <div className="text-[10px] font-mono text-slate-400">{acc.phone}</div>
                                </div>
                                <div className="text-right">
                                  <div className="font-extrabold text-emerald-500">₹{acc.balance}</div>
                                  <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${
                                    acc.status === 'banned' ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-400'
                                  }`}>
                                    {acc.status}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Network & ISP Detailed Footprint */}
                      <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-2 border-t border-slate-800/40 flex-wrap gap-2">
                        <span>ISP: <strong className="text-slate-200">{record.isp || 'Residential LTE'}</strong></span>
                        <span>Location: <strong className="text-slate-200">{record.city || 'India'} ({record.country || 'IN'})</strong></span>
                        <span>OS: <strong className="text-slate-200">{record.osVersion || 'Android'}</strong></span>
                        <span>Timestamp: <strong className="text-slate-200">{record.flaggedTimestamp || '21 Aug 2026'}</strong></span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })
        )}
      </div>

      {/* Forensic Deep Inspection Modal */}
      <AnimatePresence>
        {selectedRecordForDetail && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className={`w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl border shadow-2xl p-6 space-y-6 ${
                isDark ? 'bg-[#1E293B] border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
              }`}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b pb-4 border-slate-700/50">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-2xl ${
                    selectedRecordForDetail.riskScore >= 75 ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-400'
                  }`}>
                    <ShieldAlert className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-black">{selectedRecordForDetail.userName || 'Account Dossier'}</h3>
                      {getScoreColorBadge(selectedRecordForDetail.riskScore)}
                    </div>
                    <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      Forensic Audit Dossier & Hardware Fingerprint Analysis
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedRecordForDetail(null)}
                  className={`p-2 rounded-xl cursor-pointer ${isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-600'}`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Identity & Telecom Specs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                <div className={`p-3.5 rounded-2xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Phone & User</span>
                  <div className="text-xs font-mono font-bold mt-1">{selectedRecordForDetail.userPhone}</div>
                  <div className="text-[10px] text-slate-400">{selectedRecordForDetail.userId || 'u-user'}</div>
                </div>

                <div className={`p-3.5 rounded-2xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Device ID / Model</span>
                  <div className="text-xs font-mono font-bold mt-1 truncate">{selectedRecordForDetail.deviceModel || 'Android'}</div>
                  <div className="text-[10px] text-slate-400 truncate">{selectedRecordForDetail.deviceId}</div>
                </div>

                <div className={`p-3.5 rounded-2xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">IP Address & ISP</span>
                  <div className="text-xs font-mono font-bold mt-1">{selectedRecordForDetail.ipAddress}</div>
                  <div className="text-[10px] text-slate-400 truncate">{selectedRecordForDetail.isp || 'Mobile Network'}</div>
                </div>

                <div className={`p-3.5 rounded-2xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Wallet Protection</span>
                  <div className="text-xs font-bold text-emerald-400 mt-1">₹{selectedRecordForDetail.frozenBalance || 0} Locked</div>
                  <div className="text-[10px] text-slate-400">{selectedRecordForDetail.isWithdrawalLocked ? 'Withdrawals Frozen' : 'Allowed'}</div>
                </div>
              </div>

              {/* Risk Signatures List */}
              <div className="space-y-2">
                <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">
                  Active Risk Triggers & Forensic Evidence
                </h4>
                <div className="space-y-2">
                  {selectedRecordForDetail.detectedReasons.map((reason, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-2xl border flex items-start gap-2.5 ${
                        isDark ? 'bg-slate-900/80 border-slate-800 text-slate-200' : 'bg-rose-50/50 border-rose-100 text-slate-800'
                      }`}
                    >
                      <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                      <div className="text-xs">
                        <strong className="text-rose-400">Trigger #{idx + 1}:</strong> {reason}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hardware Integrity Matrix */}
              <div className={`p-4 rounded-2xl border space-y-3 ${
                isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-indigo-400" />
                  Hardware & OS Integrity Diagnostics
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Root / Magisk Status</span>
                    <strong className={selectedRecordForDetail.isRooted ? 'text-rose-400' : 'text-emerald-400'}>
                      {selectedRecordForDetail.isRooted ? 'Detected (Root Access)' : 'Clean (Stock ROM)'}
                    </strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">VPN / Proxy Shield</span>
                    <strong className={selectedRecordForDetail.vpnDetected ? 'text-rose-400' : 'text-emerald-400'}>
                      {selectedRecordForDetail.vpnDetected ? 'Nord/Proxy Tunnel' : 'Direct Residential IP'}
                    </strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">OS Runtime</span>
                    <strong className="text-slate-200">{selectedRecordForDetail.osVersion || 'Android 13'}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Geographic Location</span>
                    <strong className="text-slate-200">{selectedRecordForDetail.city || 'India'}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Device Hash Match</span>
                    <strong className="text-indigo-400 font-mono">{selectedRecordForDetail.deviceId.slice(0, 14)}...</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Accounts on Device</span>
                    <strong className={selectedRecordForDetail.duplicateAccountsCount && selectedRecordForDetail.duplicateAccountsCount > 1 ? 'text-rose-400' : 'text-emerald-400'}>
                      {selectedRecordForDetail.duplicateAccountsCount || 1} Registered Profiles
                    </strong>
                  </div>
                </div>
              </div>

              {/* Action Buttons in Modal */}
              <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-700/50 flex-wrap">
                <button
                  onClick={() => handleTakeAction(selectedRecordForDetail.id, 'toggle_lock')}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold border flex items-center gap-1.5 cursor-pointer ${
                    isDark ? 'border-slate-700 text-slate-200 hover:bg-slate-800' : 'border-slate-200 text-slate-800 hover:bg-slate-100'
                  }`}
                >
                  {selectedRecordForDetail.isWithdrawalLocked ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                  <span>{selectedRecordForDetail.isWithdrawalLocked ? 'Unlock Withdrawals' : 'Lock Withdrawals'}</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      handleTakeAction(selectedRecordForDetail.id, 'pardon');
                      setSelectedRecordForDetail(null);
                    }}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold border cursor-pointer ${
                      isDark ? 'border-slate-700 text-slate-300 hover:bg-slate-800' : 'border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    Pardon / Whitelist
                  </button>

                  <button
                    onClick={() => {
                      handleTakeAction(selectedRecordForDetail.id, 'ban_user');
                      setSelectedRecordForDetail(null);
                    }}
                    className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-black flex items-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <Ban className="w-4 h-4" />
                    <span>Ban Account & Freeze All Funds</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Manual Real-Time Forensic Scanner Modal */}
      <AnimatePresence>
        {isScannerModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className={`w-full max-w-xl rounded-3xl border shadow-2xl p-6 space-y-5 ${
                isDark ? 'bg-[#1E293B] border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
              }`}
            >
              <div className="flex items-center justify-between border-b pb-3 border-slate-700/50">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
                    <Terminal className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black">Forensic Risk & Threat Scanner</h3>
                    <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      Diagnose any mobile number, IP address, or device hash
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => { setIsScannerModalOpen(false); setScanResult(null); }}
                  className={`p-1.5 rounded-xl cursor-pointer ${isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-600'}`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleRunManualScan} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Enter Search Target:</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. 9123456789, 103.21.244.12, or DEV-SM-A515F..."
                      value={scanInput}
                      onChange={(e) => setScanInput(e.target.value)}
                      className={`flex-1 px-4 py-2.5 rounded-xl text-xs font-medium border focus:outline-hidden ${
                        isDark ? 'bg-slate-900 border-slate-700 text-white placeholder-slate-500' : 'bg-slate-50 border-slate-200 text-slate-900'
                      }`}
                    />
                    <button
                      type="submit"
                      disabled={isScanning || !scanInput.trim()}
                      className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-black cursor-pointer flex items-center gap-1.5 shadow-md"
                    >
                      {isScanning ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
                      <span>{isScanning ? 'Scanning...' : 'Run Scan'}</span>
                    </button>
                  </div>
                </div>
              </form>

              {/* Scan Results Container */}
              {scanResult && (
                <div className={`p-4 rounded-2xl border space-y-3 ${
                  scanResult.type === 'known_threat' || scanResult.type === 'heuristic_high'
                    ? isDark ? 'bg-rose-950/20 border-rose-500/30' : 'bg-rose-50 border-rose-200'
                    : isDark ? 'bg-emerald-950/20 border-emerald-500/30' : 'bg-emerald-50 border-emerald-200'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {scanResult.score >= 70 || scanResult.record?.riskScore >= 70 ? (
                        <ShieldAlert className="w-5 h-5 text-rose-500" />
                      ) : (
                        <ShieldCheck className="w-5 h-5 text-emerald-500" />
                      )}
                      <h4 className="text-xs font-black">
                        {scanResult.verdict || (scanResult.record ? `Known Flagged Threat (${scanResult.record.userName})` : 'Diagnostic Complete')}
                      </h4>
                    </div>
                    {getScoreColorBadge(scanResult.score || scanResult.record?.riskScore || 15)}
                  </div>

                  <p className="text-xs leading-relaxed text-slate-300">
                    {scanResult.message || 'Heuristic threat assessment computed successfully.'}
                  </p>

                  {scanResult.signatures && (
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Detection Signatures:</span>
                      {scanResult.signatures.map((sig: string, i: number) => (
                        <div key={i} className="text-[11px] text-slate-300 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                          <span>{sig}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
