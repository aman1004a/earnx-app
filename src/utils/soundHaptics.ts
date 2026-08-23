// Web Audio API & Vibration API sound/haptics utility

class SoundHapticService {
  private audioCtx: AudioContext | null = null;
  private soundEnabled: boolean = true;
  private hapticsEnabled: boolean = true;

  constructor() {
    try {
      const savedSound = localStorage.getItem('earnx_sound_fx_enabled');
      const savedHaptic = localStorage.getItem('earnx_haptic_vibe_enabled');
      this.soundEnabled = savedSound !== null ? savedSound === 'true' : true;
      this.hapticsEnabled = savedHaptic !== null ? savedHaptic === 'true' : true;
    } catch {
      this.soundEnabled = true;
      this.hapticsEnabled = true;
    }
  }

  public isSoundEnabled(): boolean {
    return this.soundEnabled;
  }

  public isHapticsEnabled(): boolean {
    return this.hapticsEnabled;
  }

  public setSoundEnabled(enabled: boolean) {
    this.soundEnabled = enabled;
    try {
      localStorage.setItem('earnx_sound_fx_enabled', String(enabled));
    } catch (e) {
      console.error(e);
    }
  }

  public setHapticsEnabled(enabled: boolean) {
    this.hapticsEnabled = enabled;
    try {
      localStorage.setItem('earnx_haptic_vibe_enabled', String(enabled));
    } catch (e) {
      console.error(e);
    }
  }

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  // Trigger haptic vibration pattern
  public vibrate(pattern: number | number[] = 25) {
    if (!this.hapticsEnabled || typeof window === 'undefined') return;
    try {
      if (navigator && 'vibrate' in navigator && typeof navigator.vibrate === 'function') {
        navigator.vibrate(pattern);
      }
    } catch {
      // Ignore vibration error on unsupported platforms
    }
  }

  // Play a crisp, pleasant coin collect chime (e.g., when claiming coins/streak)
  public playCoinSound() {
    if (!this.soundEnabled) return;
    this.vibrate([20, 30, 25]);
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      
      // Note 1 (B5 ~ 987Hz)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(987.77, now);
      gain1.gain.setValueAtTime(0.18, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.18);

      // Note 2 (E6 ~ 1318Hz)
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(1318.51, now + 0.08);
      gain2.gain.setValueAtTime(0.22, now + 0.08);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.08);
      osc2.stop(now + 0.35);
    } catch {
      // Ignore audio synthesis errors
    }
  }

  // Play subtle tap/click feedback
  public playTapSound() {
    if (!this.soundEnabled) return;
    this.vibrate(15);
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(200, now + 0.05);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.05);
    } catch {
      // Ignore audio synthesis errors
    }
  }

  // Play success celebratory sound
  public playSuccessSound() {
    if (!this.soundEnabled) return;
    this.vibrate([30, 40, 50]);
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const freqs = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 arpeggio
      
      freqs.forEach((f, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now + i * 0.07);
        gain.gain.setValueAtTime(0.15, now + i * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.07 + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.07);
        osc.stop(now + i * 0.07 + 0.25);
      });
    } catch {
      // Ignore audio synthesis errors
    }
  }
}

export const soundHaptics = new SoundHapticService();
