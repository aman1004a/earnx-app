import { useState, useEffect } from 'react';
import { SplashScreen } from './components/SplashScreen';
import { AuthScreen } from './components/AuthScreen';
import { PersonalDetailsScreen, PersonalDetails } from './components/PersonalDetailsScreen';
import { MainHomeScreen } from './components/MainHomeScreen';
import { AdminPortal } from './components/admin/AdminPortal';
import { AnimatePresence, motion } from 'motion/react';
import { getLoggedInUserDetails, clearActiveSession } from './utils/authStorage';

export default function App() {
  const [currentPage, setCurrentPage] = useState<'splash' | 'auth' | 'details' | 'home' | 'admin'>('splash');
  const [userPhone, setUserPhone] = useState('9876543210');
  const [savedDetails, setSavedDetails] = useState<PersonalDetails | null>(null);

  // Initialize from existing active session if available
  useEffect(() => {
    const session = getLoggedInUserDetails();
    if (session) {
      setUserPhone(session.phone);
      setSavedDetails(session.details);
    }
  }, []);

  // Handle flow after Splash Screen finishes
  const handleSplashComplete = () => {
    const session = getLoggedInUserDetails();
    if (session) {
      // User is ALREADY logged in -> Redirect directly to Home page
      setUserPhone(session.phone);
      setSavedDetails(session.details);
      setCurrentPage('home');
    } else {
      // User is NOT logged in -> Redirect to Authentication page
      setCurrentPage('auth');
    }
  };

  // Handle Authentication completion
  const handleAuthSuccess = (phone: string, existingUser: PersonalDetails | null) => {
    setUserPhone(phone);
    if (existingUser) {
      // Number ALREADY has an account -> Direct Login to Home
      setSavedDetails(existingUser);
      setCurrentPage('home');
    } else {
      // Number does NOT have an account -> Go to Register (Personal Details)
      setSavedDetails(null);
      setCurrentPage('details');
    }
  };

  // Handle Logout
  const handleLogout = () => {
    clearActiveSession();
    setCurrentPage('auth');
  };

  // If in admin mode, show full page admin portal
  if (currentPage === 'admin') {
    return (
      <main className="min-h-screen w-full bg-[#0F172A] text-slate-100 overflow-x-hidden">
        <AdminPortal onSwitchToUserApp={() => setCurrentPage('home')} />
      </main>
    );
  }

  return (
    <main className="h-screen h-[100dvh] w-full bg-[#F1F5F9] text-slate-800 relative flex flex-col justify-center overflow-hidden">
      <AnimatePresence mode="wait">
        {currentPage === 'splash' && (
          <motion.div
            key="splash"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full flex flex-col items-center justify-center overflow-hidden"
          >
            <SplashScreen 
              autoProgress={true} 
              onComplete={handleSplashComplete} 
            />
          </motion.div>
        )}

        {currentPage === 'auth' && (
          <motion.div
            key="auth"
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full flex flex-col items-center justify-center overflow-hidden"
          >
            <AuthScreen 
              onBackToSplash={() => setCurrentPage('splash')} 
              onAuthSuccess={handleAuthSuccess} 
            />
          </motion.div>
        )}

        {currentPage === 'details' && (
          <motion.div
            key="details"
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full flex flex-col items-center justify-center overflow-hidden"
          >
            <PersonalDetailsScreen 
              phone={userPhone}
              onBackToAuth={() => setCurrentPage('auth')}
              onSubmitSuccess={(details) => {
                setSavedDetails(details);
                setCurrentPage('home');
              }}
            />
          </motion.div>
        )}

        {currentPage === 'home' && (
          <motion.div
            key="home"
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full flex flex-col items-center justify-center overflow-hidden"
          >
            <MainHomeScreen 
              userPhone={userPhone}
              userDetails={savedDetails}
              onLogout={handleLogout}
              onPreviewSplash={() => setCurrentPage('splash')}
              onOpenAdmin={() => setCurrentPage('admin')}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
