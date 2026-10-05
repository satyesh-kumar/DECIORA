// Lightweight tactical notification manager for DECIORA
import { sound } from './soundSystem';

class ToastManager {
  constructor() {
    this.toasts = [];
    this.listeners = new Set();
    this.counter = 0;
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    this.listeners.forEach((listener) => listener([...this.toasts]));
  }

  add(toast) {
    const id = ++this.counter;
    const item = {
      id,
      title: toast.title || 'SYSTEM NOTICE',
      message: toast.message || '',
      type: toast.type || 'info', // 'info' | 'success' | 'warning' | 'error'
      duration: toast.duration || 4500,
      timestamp: new Date().toLocaleTimeString()
    };

    this.toasts = [item, ...this.toasts.slice(0, 4)]; // Max 5 toasts
    this.notify();

    // Play tactile sound
    if (item.type === 'error' || item.type === 'warning') {
      sound.playWarning();
    } else {
      sound.playClick();
    }

    if (item.duration > 0) {
      setTimeout(() => {
        this.remove(id);
      }, item.duration);
    }

    return id;
  }

  remove(id) {
    this.toasts = this.toasts.filter((t) => t.id !== id);
    this.notify();
  }

  clear() {
    this.toasts = [];
    this.notify();
  }

  info(message, title = 'TELEMETRY UPDATE') {
    return this.add({ message, title, type: 'info' });
  }

  success(message, title = 'DIRECTIVE CONFIRMED') {
    return this.add({ message, title, type: 'success' });
  }

  warning(message, title = 'SIGNAL DEGRADATION') {
    return this.add({ message, title, type: 'warning' });
  }

  error(message, title = 'COMMUNICATION FAILURE') {
    return this.add({ message, title, type: 'error' });
  }
}

export const toast = new ToastManager();
