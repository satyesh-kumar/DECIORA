// Global HUD theme controller for DECIORA (Cyan Navy <-> Night-Vision Green CRT)
import { sound } from './soundSystem';
import { toast } from './toast';

class ThemeManager {
  constructor() {
    this.isNVG = localStorage.getItem('deciora_hud_theme') === 'nvg';
    this.listeners = new Set();
    this.applyTheme(this.isNVG);
  }

  applyTheme(isNVG) {
    if (typeof document !== 'undefined') {
      if (isNVG) {
        document.documentElement.classList.add('theme-nvg');
      } else {
        document.documentElement.classList.remove('theme-nvg');
      }
    }
  }

  isNightVision() {
    return this.isNVG;
  }

  toggleNightVision() {
    this.isNVG = !this.isNVG;
    localStorage.setItem('deciora_hud_theme', this.isNVG ? 'nvg' : 'cyan');
    this.applyTheme(this.isNVG);
    sound.playClick();
    this.notify();

    if (this.isNVG) {
      toast.info('PHOSPHOR GREEN NIGHT-VISION ACTIVE', 'OPTICAL TELEMETRY');
    } else {
      toast.info('STANDARD CYAN TACTICAL HUD ACTIVE', 'OPTICAL TELEMETRY');
    }

    return this.isNVG;
  }

  subscribe(listener) {
    this.listeners.add(listener);
    listener(this.isNVG);
    return () => this.listeners.delete(listener);
  }

  notify() {
    this.listeners.forEach((fn) => fn(this.isNVG));
  }
}

export const themeManager = new ThemeManager();
