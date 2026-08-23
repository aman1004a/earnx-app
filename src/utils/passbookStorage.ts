export interface PassbookEntry {
  id: string;
  title: string;
  category: 'task' | 'daily_checkin' | 'referral' | 'withdrawal' | 'offerwall' | 'bonus' | 'scratch_spin';
  type: 'credit' | 'debit';
  amount: number;
  date: string;
  time: string;
  timestamp: number;
  status: 'completed' | 'processing' | 'failed';
  refId: string;
  balanceAfter: number;
  subtitle?: string;
  paymentMethod?: string;
}

const PASSBOOK_KEY_PREFIX = 'earnx_passbook_v1_';

export const getInitialDefaultPassbook = (phone: string, currentBalance: number = 248): PassbookEntry[] => {
  const cleanPhone = phone.replace(/\D/g, '') || '9876543210';
  const now = Date.now();
  
  return [
    {
      id: `TXN-${cleanPhone.slice(-4)}-109`,
      title: 'Daily Streak Bonus (Day 3)',
      category: 'daily_checkin',
      type: 'credit',
      amount: 15,
      date: 'Today, 21 Aug 2026',
      time: '09:15 AM',
      timestamp: now - 1000 * 60 * 60 * 2,
      status: 'completed',
      refId: `EZ-CHK-${cleanPhone.slice(-4)}-7841`,
      balanceAfter: currentBalance,
      subtitle: 'Claimed 7-day reward streak bonus'
    },
    {
      id: `TXN-${cleanPhone.slice(-4)}-108`,
      title: 'Task: Angel One Demat Account',
      category: 'task',
      type: 'credit',
      amount: 120,
      date: 'Yesterday, 20 Aug 2026',
      time: '04:45 PM',
      timestamp: now - 1000 * 60 * 60 * 22,
      status: 'completed',
      refId: `EZ-TSK-ANGEL-${cleanPhone.slice(-4)}`,
      balanceAfter: currentBalance - 15,
      subtitle: 'App install & first KYC completion verified'
    },
    {
      id: `TXN-${cleanPhone.slice(-4)}-107`,
      title: 'Instant UPI Payout',
      category: 'withdrawal',
      type: 'debit',
      amount: 100,
      date: '19 Aug 2026',
      time: '02:30 PM',
      timestamp: now - 1000 * 60 * 60 * 48,
      status: 'completed',
      refId: `UPI-RR-948201840219`,
      balanceAfter: currentBalance - 135,
      subtitle: 'Transferred to UPI ID: user@okaxis',
      paymentMethod: 'UPI'
    },
    {
      id: `TXN-${cleanPhone.slice(-4)}-106`,
      title: 'Referral Bonus: Amit Patel',
      category: 'referral',
      type: 'credit',
      amount: 50,
      date: '18 Aug 2026',
      time: '07:10 PM',
      timestamp: now - 1000 * 60 * 60 * 72,
      status: 'completed',
      refId: `EZ-REF-AMIT-${cleanPhone.slice(-3)}`,
      balanceAfter: currentBalance - 35,
      subtitle: 'Friend registered with your referral link'
    },
    {
      id: `TXN-${cleanPhone.slice(-4)}-105`,
      title: 'BitLabs Market Survey',
      category: 'offerwall',
      type: 'credit',
      amount: 45,
      date: '17 Aug 2026',
      time: '11:20 AM',
      timestamp: now - 1000 * 60 * 60 * 96,
      status: 'completed',
      refId: `EZ-OFF-BITLABS-817`,
      balanceAfter: currentBalance - 85,
      subtitle: 'Completed 8 min consumer survey'
    },
    {
      id: `TXN-${cleanPhone.slice(-4)}-104`,
      title: 'Welcome Joining Bonus',
      category: 'bonus',
      type: 'credit',
      amount: 50,
      date: '16 Aug 2026',
      time: '10:00 AM',
      timestamp: now - 1000 * 60 * 60 * 120,
      status: 'completed',
      refId: `EZ-WLC-BONUS-${cleanPhone.slice(-4)}`,
      balanceAfter: 50,
      subtitle: 'Phone OTP verification successful'
    }
  ];
};

export const getUserPassbook = (phone: string, currentBalance: number = 248): PassbookEntry[] => {
  try {
    const cleanPhone = phone.replace(/\D/g, '') || '9876543210';
    const key = `${PASSBOOK_KEY_PREFIX}${cleanPhone}`;
    const data = localStorage.getItem(key);
    if (!data) {
      const defaults = getInitialDefaultPassbook(phone, currentBalance);
      localStorage.setItem(key, JSON.stringify(defaults));
      return defaults;
    }
    return JSON.parse(data);
  } catch {
    return getInitialDefaultPassbook(phone, currentBalance);
  }
};

export const addPassbookEntry = (
  phone: string, 
  entry: Omit<PassbookEntry, 'id' | 'timestamp' | 'date' | 'time'>
): PassbookEntry => {
  const cleanPhone = phone.replace(/\D/g, '') || '9876543210';
  const key = `${PASSBOOK_KEY_PREFIX}${cleanPhone}`;
  const currentList = getUserPassbook(phone, entry.balanceAfter);
  
  const now = new Date();
  const dateStr = 'Today, ' + now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });

  const newEntry: PassbookEntry = {
    ...entry,
    id: `TXN-${Date.now().toString().slice(-6)}`,
    date: dateStr,
    time: timeStr,
    timestamp: Date.now()
  };

  const updated = [newEntry, ...currentList];
  try {
    localStorage.setItem(key, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save passbook entry:', err);
  }

  return newEntry;
};
