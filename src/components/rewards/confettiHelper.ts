import confetti from 'canvas-confetti';

export const triggerWinConfetti = () => {
  try {
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#4B63FF', '#10B981', '#F59E0B', '#EC4899', '#8B5CF6']
    });
  } catch {
    // Fallback if canvas is unavailable
  }
};

export const triggerCoinConfetti = triggerWinConfetti;
