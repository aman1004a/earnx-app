export interface PersonalDetails {
  fullName: string;
  email: string;
  dob: string;
  gender: 'male' | 'female' | 'other';
  referralCode: string;
}

const USERS_DB_KEY = 'earnx_registered_users_v1';
const ACTIVE_SESSION_KEY = 'earnx_active_session_v1';
const ACTIVE_USER_PROFILE_KEY = 'earnx_current_user_profile_v1';

export interface UserProfile {
  phone: string;
  fullName: string;
  email: string;
  walletBalance: number;
  totalEarned: number;
  referralCode: string;
  isLoggedIn: boolean;
  joinedDate?: string;
}

// Initial default registered user
const DEFAULT_USERS: Record<string, PersonalDetails> = {
  '9876543210': {
    fullName: 'Rahul Sharma',
    email: 'rahul@example.com',
    dob: '2000-05-15',
    gender: 'male',
    referralCode: 'EARNX50'
  }
};

export const getRegisteredUsers = (): Record<string, PersonalDetails> => {
  try {
    const data = localStorage.getItem(USERS_DB_KEY);
    if (!data) {
      localStorage.setItem(USERS_DB_KEY, JSON.stringify(DEFAULT_USERS));
      return DEFAULT_USERS;
    }
    return JSON.parse(data);
  } catch {
    return DEFAULT_USERS;
  }
};

export const findUserByPhone = (phone: string): PersonalDetails | null => {
  const cleanPhone = phone.replace(/\D/g, '');
  const users = getRegisteredUsers();
  return users[cleanPhone] || null;
};

export const registerNewUser = (phone: string, details: PersonalDetails): void => {
  const cleanPhone = phone.replace(/\D/g, '');
  const users = getRegisteredUsers();
  users[cleanPhone] = details;
  localStorage.setItem(USERS_DB_KEY, JSON.stringify(users));
  setActiveSession(cleanPhone);
};

export const getActiveSessionPhone = (): string | null => {
  try {
    return localStorage.getItem(ACTIVE_SESSION_KEY);
  } catch {
    return null;
  }
};

export const setActiveSession = (phone: string): void => {
  const cleanPhone = phone.replace(/\D/g, '');
  localStorage.setItem(ACTIVE_SESSION_KEY, cleanPhone);
};

export const clearActiveSession = (): void => {
  localStorage.removeItem(ACTIVE_SESSION_KEY);
  localStorage.removeItem(ACTIVE_USER_PROFILE_KEY);
};

export const getStoredUser = (): UserProfile | null => {
  try {
    const data = localStorage.getItem(ACTIVE_USER_PROFILE_KEY);
    if (data) {
      return JSON.parse(data);
    }
    const activePhone = getActiveSessionPhone();
    if (activePhone) {
      const details = findUserByPhone(activePhone);
      if (details) {
        return {
          phone: activePhone,
          fullName: details.fullName,
          email: details.email,
          walletBalance: 125,
          totalEarned: 475,
          referralCode: details.referralCode || `EX${activePhone.slice(-4)}`,
          isLoggedIn: true,
          joinedDate: '10 Aug 2026'
        };
      }
    }
    return null;
  } catch {
    return null;
  }
};

export const saveUserSession = (userOrPhone: UserProfile | string, details?: PersonalDetails): void => {
  if (typeof userOrPhone === 'string') {
    const cleanPhone = userOrPhone.replace(/\D/g, '');
    setActiveSession(cleanPhone);
    if (details) {
      registerNewUser(cleanPhone, details);
      const profile: UserProfile = {
        phone: cleanPhone,
        fullName: details.fullName,
        email: details.email,
        walletBalance: 125,
        totalEarned: 475,
        referralCode: details.referralCode || `EX${cleanPhone.slice(-4)}`,
        isLoggedIn: true,
        joinedDate: '10 Aug 2026'
      };
      localStorage.setItem(ACTIVE_USER_PROFILE_KEY, JSON.stringify(profile));
    }
  } else {
    localStorage.setItem(ACTIVE_USER_PROFILE_KEY, JSON.stringify(userOrPhone));
    setActiveSession(userOrPhone.phone);
  }
};

export const updateUserBalance = (amountDiff: number): UserProfile => {
  const current = getStoredUser() || {
    phone: '9876543210',
    fullName: 'Rahul Sharma',
    email: 'rahul@example.com',
    walletBalance: 125,
    totalEarned: 475,
    referralCode: 'EARNX50',
    isLoggedIn: true
  };
  const newBalance = Math.max(0, current.walletBalance + amountDiff);
  const newTotal = amountDiff > 0 ? current.totalEarned + amountDiff : current.totalEarned;
  const updated: UserProfile = {
    ...current,
    walletBalance: newBalance,
    totalEarned: newTotal
  };
  saveUserSession(updated);
  return updated;
};

export const logoutUser = (): void => {
  clearActiveSession();
};

export const getLoggedInUserDetails = (): { phone: string; details: PersonalDetails } | null => {
  const activePhone = getActiveSessionPhone();
  if (!activePhone) return null;
  const user = findUserByPhone(activePhone);
  if (!user) return null;
  return { phone: activePhone, details: user };
};

const WITHDRAWAL_PINS_KEY = 'earnx_withdrawal_pins_v1';

export const getUserWithdrawalPin = (phone: string): string | null => {
  try {
    const cleanPhone = phone.replace(/\D/g, '');
    const data = localStorage.getItem(WITHDRAWAL_PINS_KEY);
    if (!data) return null;
    const pins: Record<string, string> = JSON.parse(data);
    return pins[cleanPhone] || null;
  } catch {
    return null;
  }
};

export const setUserWithdrawalPin = (phone: string, pin: string): void => {
  try {
    const cleanPhone = phone.replace(/\D/g, '');
    const data = localStorage.getItem(WITHDRAWAL_PINS_KEY);
    const pins: Record<string, string> = data ? JSON.parse(data) : {};
    pins[cleanPhone] = pin;
    localStorage.setItem(WITHDRAWAL_PINS_KEY, JSON.stringify(pins));
  } catch (err) {
    console.error('Failed to save withdrawal pin:', err);
  }
};

export const hasUserWithdrawalPin = (phone: string): boolean => {
  return getUserWithdrawalPin(phone) !== null;
};
