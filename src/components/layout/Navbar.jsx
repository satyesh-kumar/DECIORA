import React, { useState, useEffect } from 'react';
import { 
  Radio, 
  Volume2, 
  VolumeX, 
  User, 
  LogOut, 
  Shield, 
  BarChart2, 
  Award, 
  Clock, 
  Compass, 
  ChevronDown,
  Layers,
  Menu,
  X
} from 'lucide-react';
import { sound } from '../../services/soundSystem';

export default function Navbar({ 
  user, 
  currentPage, 
  onNavigate, 
  onLogout, 
  onSwitchRole 
}) {
  const [isMuted, setIsMuted] = useState(sound.isMuted());
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showMobileNav, setShowMobileNav] = useState(false);

  useEffect(() => {
    return sound.subscribe((muted) => setIsMuted(muted));
  }, []);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Compass },
    { id: 'scenarios', label: 'Scenarios', icon: Layers },
    { id: 'leaderboard', label: 'Leaderboard', icon: Award },
    { id: 'history', label: 'History', icon: Clock },
    { id: 'instructor', label: 'Instructor Center', icon: BarChart2 }
  ];

  return (
    <nav className="sticky top-0 z-50 bg-[#07111F]/95 backdrop-blur-md border-b border-[var(--border-subtle)] font-mono text-xs">
      <div className="container-custom flex items-center justify-between h-14">
        
        {/* Left: Mobile Menu Toggle & Brand Logo */}
        <div className="flex items-center gap-2">
          {/* Mobile Hamburger Toggle Button */}
          <button
            onClick={() => setShowMobileNav(!showMobileNav)}
            className="md:hidden p-1.5 rounded-lg bg-[#12263A] text-white border border-[var(--border-subtle)] hover:bg-[#162E47]"
            title="Toggle Menu"
          >
            {showMobileNav ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>

          {/* Logo & Brand */}
          <div 
            onClick={() => {
              sound.playClick();
              setShowMobileNav(false);
              onNavigate('landing');
            }}
            className="flex items-center gap-2.5 cursor-pointer select-none group"
          >
            <div className="w-8 h-8 rounded-lg bg-[#0D1B2A] border border-[var(--border-accent)] flex items-center justify-center text-[var(--accent-cyan)] shadow-md shadow-[var(--accent-cyan)]/20 group-hover:border-[var(--accent-cyan)] transition-colors">
              <Radio className="w-4 h-4" />
            </div>
            <div>
              <div className="font-extrabold text-sm md:text-base tracking-wider text-white group-hover:text-[var(--accent-cyan)] transition-colors">
                DECIORA
              </div>
              <div className="text-[9px] text-[var(--text-muted)] -mt-1 tracking-widest hidden sm:block">
                PS26048 SIMULATOR
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Center Nav Items */}
        <div className="hidden md:flex items-center gap-1 bg-[#0D1B2A] p-1 rounded-xl border border-[var(--border-subtle)]">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  sound.playClick();
                  onNavigate(item.id);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                  isActive 
                    ? 'bg-[var(--accent-cyan)] text-[#07111F] font-bold shadow-sm' 
                    : 'text-[var(--text-secondary)] hover:text-white hover:bg-[#12263A]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right Tools: Audio Mute & User Profile Menu */}
        <div className="flex items-center gap-2">
          
          {/* Audio Squelch Mute Button */}
          <button
            onClick={() => sound.toggleMute()}
            className={`p-2 rounded-lg border transition-colors ${
              isMuted 
                ? 'bg-[#12263A] border-[var(--border-subtle)] text-[var(--text-muted)]' 
                : 'bg-[#12263A] border-[var(--accent-cyan)]/30 text-[var(--accent-cyan)] hover:bg-[var(--border-accent)]'
            }`}
            title={isMuted ? 'Tactical Audio Muted' : 'Tactical Audio Enabled'}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>

          {/* User Account / Role Quick Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="flex items-center gap-2 p-1.5 pl-2.5 rounded-lg bg-[#0D1B2A] hover:bg-[#12263A] border border-[var(--border-subtle)] hover:border-[var(--border-medium)] transition-all"
            >
              <div className="text-left hidden sm:block">
                <div className="font-bold text-white text-[11px] leading-tight">
                  {user?.name || 'Commander Alpha'}
                </div>
                <div className="text-[9px] text-[var(--text-muted)] uppercase">
                  {user?.role || 'commander'}
                </div>
              </div>
              <div className="w-6 h-6 rounded-full bg-[var(--accent-cyan)]/20 text-[var(--accent-cyan)] border border-[var(--accent-cyan)]/40 flex items-center justify-center font-bold text-[10px]">
                {user?.name?.[0] || 'C'}
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-[var(--text-muted)]" />
            </button>

            {/* Dropdown Menu */}
            {showRoleMenu && (
              <div className="absolute right-0 mt-2 w-56 rounded-xl bg-[#0D1B2A] border border-[var(--border-accent)] shadow-2xl p-2 z-50">
                <div className="px-2 py-1.5 border-b border-[var(--border-subtle)] text-[10px] text-[var(--text-muted)] uppercase">
                  Switch Active Role
                </div>
                <button
                  onClick={() => {
                    onSwitchRole('commander');
                    setShowRoleMenu(false);
                  }}
                  className="w-full text-left px-2 py-1.5 rounded hover:bg-[#12263A] text-white flex items-center justify-between text-xs transition-colors"
                >
                  <span>Commander Alpha</span>
                  {user?.role === 'commander' && <span className="text-[var(--accent-cyan)]">●</span>}
                </button>
                <button
                  onClick={() => {
                    onSwitchRole('instructor');
                    setShowRoleMenu(false);
                  }}
                  className="w-full text-left px-2 py-1.5 rounded hover:bg-[#12263A] text-white flex items-center justify-between text-xs transition-colors"
                >
                  <span>Instructor Vance</span>
                  {user?.role === 'instructor' && <span className="text-emerald-400">●</span>}
                </button>
                <button
                  onClick={() => {
                    onSwitchRole('admin');
                    setShowRoleMenu(false);
                  }}
                  className="w-full text-left px-2 py-1.5 rounded hover:bg-[#12263A] text-white flex items-center justify-between text-xs transition-colors"
                >
                  <span>System Admin</span>
                  {user?.role === 'admin' && <span className="text-purple-400">●</span>}
                </button>

                <div className="border-t border-[var(--border-subtle)] mt-1 pt-1">
                  <button
                    onClick={() => {
                      onLogout();
                      setShowRoleMenu(false);
                    }}
                    className="w-full text-left px-2 py-1.5 rounded hover:bg-red-500/20 text-red-300 flex items-center gap-1.5 text-xs transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Log Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Mobile Menu Dropdown Drawer */}
      {showMobileNav && (
        <div className="md:hidden border-t border-[var(--border-subtle)] bg-[#0D1B2A] px-4 py-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  sound.playClick();
                  setShowMobileNav(false);
                  onNavigate(item.id);
                }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-all ${
                  isActive 
                    ? 'bg-[var(--accent-cyan)] text-[#07111F] font-bold' 
                    : 'text-[var(--text-secondary)] hover:text-white hover:bg-[#12263A]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </nav>
  );
}
