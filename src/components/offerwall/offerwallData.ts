export interface OfferwallPartner {
  id: string;
  name: string;
  tagline: string;
  multiplier: string;
  badge: string;
  gradient: string;
  iconColor: string;
  totalOffers: number;
  featuredReward: string;
  isActive?: boolean;
  apiKey?: string;
  secretKey?: string;
  postbackUrl?: string;
  userRevenuePercent?: number;
  sdkMode?: 'iframe' | 'api' | 'redirect';
  customWebUrl?: string;
  offers: OfferItem[];
}

export interface OfferItem {
  id: string;
  title: string;
  reward: number;
  category: 'Game' | 'App' | 'Survey' | 'Finance';
  payoutTime: string;
  description: string;
  instructions: string[];
  active?: boolean;
  trackingUrl?: string;
}

export const OFFERWALL_PARTNERS: OfferwallPartner[] = [
  {
    id: 'adgate',
    name: 'AdGate Rewards',
    tagline: 'High reward games & verified apps',
    multiplier: '2.5X Rewards',
    badge: '⭐ Top Rated',
    gradient: 'from-blue-600 via-indigo-600 to-[#3549EC]',
    iconColor: 'bg-blue-500',
    totalOffers: 18,
    featuredReward: 'Up to ₹250',
    offers: [
      {
        id: 'ad-1',
        title: 'Lord Mobile: Reach Castle Lvl 14',
        reward: 180,
        category: 'Game',
        payoutTime: 'Instant upon reaching lvl 14',
        description: 'Install Lord Mobile strategy game, build your castle and reach level 14 within 14 days.',
        instructions: ['Download via AdGate', 'Reach Castle Level 14', 'Reward automatically credited to wallet']
      },
      {
        id: 'ad-2',
        title: 'Cred: Credit Score Check & UPI',
        reward: 95,
        category: 'Finance',
        payoutTime: 'Within 10 mins',
        description: 'Install Cred app and check your free Experian/CRIF credit score report.',
        instructions: ['Install Cred via offer link', 'Enter phone and verify OTP', 'Check credit score to claim ₹95']
      },
      {
        id: 'ad-3',
        title: 'Swiggy: Place First Food Order',
        reward: 60,
        category: 'App',
        payoutTime: 'Instant on delivery',
        description: 'Download Swiggy and order food or instamart grocery worth min ₹99.',
        instructions: ['Download Swiggy', 'Place your first order', 'Earn ₹60 extra cashback']
      }
    ]
  },
  {
    id: 'ayet',
    name: 'AyeT Studios',
    tagline: 'Play casual games & earn per level',
    multiplier: '2X Booster',
    badge: '🔥 Popular',
    gradient: 'from-amber-500 via-orange-500 to-rose-600',
    iconColor: 'bg-orange-500',
    totalOffers: 24,
    featuredReward: 'Up to ₹320',
    offers: [
      {
        id: 'ay-1',
        title: 'Candy Crush Soda: Complete 50 Levels',
        reward: 120,
        category: 'Game',
        payoutTime: 'Instant per checkpoint',
        description: 'Enjoy delicious match-3 puzzle levels and earn continuous cash on milestone checkpoints.',
        instructions: ['Install Candy Crush Soda', 'Reach Level 50', 'Collect ₹120 Cash']
      },
      {
        id: 'ay-2',
        title: 'Tata Neu: UPI Registration',
        reward: 45,
        category: 'App',
        payoutTime: 'Instant',
        description: 'Register with Tata Neu super app and link your UPI ID.',
        instructions: ['Download Tata Neu', 'Create NeuPass profile', 'Link UPI and get ₹45']
      },
      {
        id: 'ay-3',
        title: 'Brain Test: Tricky Puzzles Lvl 20',
        reward: 35,
        category: 'Game',
        payoutTime: '5 mins',
        description: 'Solve 20 IQ riddles and brain teasers in Brain Test game.',
        instructions: ['Install game', 'Complete Level 20', 'Get ₹35 directly in wallet']
      }
    ]
  },
  {
    id: 'bitlabs',
    name: 'BitLabs Surveys',
    tagline: 'Instant paid consumer questionnaires',
    multiplier: 'Instant Pay',
    badge: '⚡ Fast Credit',
    gradient: 'from-emerald-600 via-teal-600 to-cyan-700',
    iconColor: 'bg-emerald-500',
    totalOffers: 12,
    featuredReward: 'Up to ₹150',
    offers: [
      {
        id: 'bl-1',
        title: 'Automotive & Travel Preferences',
        reward: 40,
        category: 'Survey',
        payoutTime: '5 Mins',
        description: 'Share your vehicle and holiday travel habits in this verified 5-minute study.',
        instructions: ['Click Start Survey', 'Answer all profiling questions', 'Submit to receive ₹40']
      },
      {
        id: 'bl-2',
        title: 'Digital OTT & Streaming Survey',
        reward: 30,
        category: 'Survey',
        payoutTime: '3 Mins',
        description: 'Quick 3-minute poll about Netflix, Prime Video and Hotstar watching habits.',
        instructions: ['Take survey', 'Complete all questions', 'Instant ₹30 credit']
      }
    ]
  },
  {
    id: 'torox',
    name: 'Torox Offerwall',
    tagline: 'Multi-stage app rewards & trials',
    multiplier: '3X Mega',
    badge: '💎 High Tier',
    gradient: 'from-purple-600 via-pink-600 to-indigo-600',
    iconColor: 'bg-purple-500',
    totalOffers: 15,
    featuredReward: 'Up to ₹500',
    offers: [
      {
        id: 'tx-1',
        title: 'Rise of Kingdoms: Level 17 City Hall',
        reward: 350,
        category: 'Game',
        payoutTime: 'Within 24h',
        description: 'Command civilization armies and upgrade your main City Hall to Level 17.',
        instructions: ['Install via Torox', 'Upgrade City Hall to Level 17', 'Earn mega ₹350 cash']
      },
      {
        id: 'tx-2',
        title: 'Kotak 811: Zero Balance Savings A/C',
        reward: 120,
        category: 'Finance',
        payoutTime: 'Instant on Video KYC',
        description: 'Open a 100% digital zero-balance Kotak 811 savings bank account from home.',
        instructions: ['Apply via Torox link', 'Complete digital KYC', 'Receive ₹120 Cash in wallet']
      }
    ]
  }
];
