import { useState, useEffect } from 'react';
import LockScreen from './components/LockScreen';
import HomeScreen from './components/HomeScreen';
import AppShell from './components/AppShell';
import BootScreen from './components/BootScreen';
import OOBE from './components/OOBE';
import PhoneApp from './components/apps/PhoneApp';
import SettingsApp from './components/apps/SettingsApp';
import MessagesApp from './components/apps/MessagesApp';
import SpidiClicker from './components/apps/SpidiClicker';
import CameraApp from './components/apps/CameraApp';
import GalleryApp from './components/apps/GalleryApp';
import MusicApp from './components/apps/MusicApp';

export type AppName = 'phone' | 'settings' | 'messages' | 'clicker' | 'camera' | 'gallery' | 'music' | null;

export default function App() {
  const [locked, setLocked] = useState(true);
  const [activeApp, setActiveApp] = useState<AppName>(null);
  const [appVisible, setAppVisible] = useState(false);
  const [showHome, setShowHome] = useState(false);
  const [showOOBE, setShowOOBE] = useState(false);
  const [showBoot, setShowBoot] = useState(true);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  // Применяем тему к корневому элементу <html>
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  useEffect(() => {
    const oobeCompleted = localStorage.getItem('spidiphone_oobe_completed');
    if (oobeCompleted) {
      const savedTheme = localStorage.getItem('spidiphone_theme') || 'dark';
      setTheme(savedTheme as 'light' | 'dark');
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowBoot(false);
    }, 11000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!showBoot && !showOOBE && !locked && !activeApp) {
      setShowHome(true);
    }
  }, [showBoot, showOOBE, locked, activeApp]);

  const unlockPhone = () => {
    setLocked(false);
    const oobeCompleted = localStorage.getItem('spidiphone_oobe_completed');
    if (!oobeCompleted) {
      setShowOOBE(true);
    } else {
      setShowHome(true);
    }
  };

  const handleOOBEComplete = (pin: string | null, selectedTheme: 'light' | 'dark') => {
    setTheme(selectedTheme);
    if (pin) localStorage.setItem('spidiphone_pin', pin);
    localStorage.setItem('spidiphone_oobe_completed', 'true');
    localStorage.setItem('spidiphone_theme', selectedTheme);
    setShowOOBE(false);
    setShowHome(true);
  };

  const openApp = (app: AppName) => {
    setActiveApp(app);
    setTimeout(() => setAppVisible(true), 10);
  };

  const closeApp = () => {
    setAppVisible(false);
    setTimeout(() => setActiveApp(null), 350);
  };

  const renderApp = () => {
    switch (activeApp) {
      case 'phone': return <PhoneApp />;
      case 'settings': return <SettingsApp />;
      case 'messages': return <MessagesApp />;
      case 'clicker': return <SpidiClicker />;
      case 'camera': return <CameraApp />;
      case 'gallery': return <GalleryApp />;
      case 'music': return <MusicApp />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center overflow-hidden relative"
      style={{
        background: theme === 'light'
          ? 'radial-gradient(ellipse at 30% 40%, #f8f8f8 0%, #e0e0e0 50%, #d0d0d0 100%)'
          : 'radial-gradient(ellipse at 30% 40%, #1a0a2e 0%, #0a0510 50%, #050505 100%)'
      }}>

      {/* Background ambient orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute w-96 h-96 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #7c3aed, transparent)', top: '10%', left: '5%', filter: 'blur(60px)' }} />
        <div className="absolute w-64 h-64 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #2563eb, transparent)', bottom: '15%', right: '10%', filter: 'blur(50px)' }} />
        <div className="absolute w-48 h-48 rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle, #ec4899, transparent)', top: '60%', left: '15%', filter: 'blur(40px)' }} />
      </div>

      {/* Phone info label */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center pointer-events-none">
        <div className="text-white/20 text-xs tracking-[0.4em] font-light">SPIDIOS • ANDROID 16</div>
        <div className="text-white/10 text-xs tracking-[0.3em] mt-0.5">SPIDIPHONE 1</div>
      </div>

      {/* Phone Frame */}
      <div className="relative animate-float"
        style={{
          width: '390px',
          height: '844px',
          borderRadius: '54px',
          background: 'linear-gradient(160deg, #2e2e2e 0%, #1a1a1a 40%, #111 100%)',
          boxShadow: [
            '0 0 0 1px rgba(255,255,255,0.08)',
            '0 0 0 2px rgba(0,0,0,0.8)',
            '0 0 80px rgba(120,60,220,0.25)',
            '0 60px 120px rgba(0,0,0,0.9)',
            'inset 0 1px 0 rgba(255,255,255,0.12)',
            'inset 0 -1px 0 rgba(255,255,255,0.04)',
          ].join(', '),
        }}>

        {/* Camera highlight */}
        <div className="absolute top-0 left-0 right-0 h-24 rounded-t-[54px] pointer-events-none"
          style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.03), transparent)' }} />

        {/* Inner screen */}
        <div className="absolute inset-[3px] rounded-[51px] overflow-hidden"
          style={{ background: '#000' }}>

          {/* Dynamic Island */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-50"
            style={{
              width: '126px',
              height: '37px',
              background: '#000',
              borderRadius: '20px',
              boxShadow: '0 0 0 1px rgba(255,255,255,0.04), 0 2px 12px rgba(0,0,0,0.8)',
            }}>
            {/* Camera dot */}
            <div className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full"
              style={{ background: '#0d1117', border: '1.5px solid rgba(255,255,255,0.08)', boxShadow: 'inset 0 0 4px rgba(100,200,255,0.15)' }} />
          </div>

          {/* Boot Screen - 11 seconds on every launch */}
          {showBoot && (
            <BootScreen onComplete={() => setLocked(true)} />
          )}

          {/* Lock Screen - shown after boot */}
          <div
            className="absolute inset-0 transition-all duration-700"
            style={{
              opacity: (!showBoot && locked && !showOOBE) ? 1 : 0,
              transform: (!showBoot && locked && !showOOBE) ? 'scale(1)' : 'scale(1.06)',
              pointerEvents: (!showBoot && locked && !showOOBE) ? 'auto' : 'none',
              zIndex: (!showBoot && locked && !showOOBE) ? 40 : -1,
              transitionTimingFunction: 'cubic-bezier(0.4,0,0.2,1)',
            }}>
            <LockScreen onUnlock={unlockPhone} />
          </div>

          {/* Home Screen */}
          <div
            className="absolute inset-0 transition-all duration-500"
            style={{
              opacity: showHome ? 1 : 0,
              transform: showHome ? 'scale(1)' : 'scale(0.95)',
              zIndex: 10,
              transitionTimingFunction: 'cubic-bezier(0.34,1.2,0.64,1)',
            }}>
            <HomeScreen onOpenApp={openApp} />
          </div>

          {/* OOBE - shown after unlock if first run */}
          {showOOBE && (
            <div className="absolute inset-0 z-50">
              <OOBE onComplete={handleOOBEComplete} />
            </div>
          )}

          {/* App Layer */}
          {activeApp && (
            <AppShell
              appName={activeApp}
              visible={appVisible}
              onClose={closeApp}>
              {renderApp()}
            </AppShell>
          )}
        </div>

        {/* Physical buttons */}
        {/* Power */}
        <div className="absolute right-0 top-28 w-[3px] h-16 rounded-r-[2px]"
          style={{ background: 'linear-gradient(180deg, #3a3a3a, #2a2a2a)', boxShadow: '1px 0 3px rgba(0,0,0,0.5)' }} />
        {/* Volume up */}
        <div className="absolute left-0 top-24 w-[3px] h-10 rounded-l-[2px]"
          style={{ background: 'linear-gradient(180deg, #3a3a3a, #2a2a2a)', boxShadow: '-1px 0 3px rgba(0,0,0,0.5)' }} />
        {/* Volume down */}
        <div className="absolute left-0 top-36 w-[3px] h-14 rounded-l-[2px]"
          style={{ background: 'linear-gradient(180deg, #3a3a3a, #2a2a2a)', boxShadow: '-1px 0 3px rgba(0,0,0,0.5)' }} />
        {/* Silent switch */}
        <div className="absolute left-0 top-52 w-[3px] h-8 rounded-l-[2px]"
          style={{ background: 'linear-gradient(180deg, #3a3a3a, #2a2a2a)', boxShadow: '-1px 0 3px rgba(0,0,0,0.5)' }} />
      </div>
    </div>
  );
}
