import { ReactNode } from 'react';
import { AppName } from '../App';

interface AppShellProps {
  appName: AppName;
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
}

const appTitles: Record<NonNullable<AppName>, string> = {
  phone: 'Звонилка',
  settings: 'Настройки',
  messages: 'Сообщения',
  clicker: 'Spidi Clicker',
  camera: 'Камера',
  gallery: 'Галерея',
};

const appColors: Record<NonNullable<AppName>, string> = {
  phone: 'linear-gradient(135deg, #11998e, #38ef7d)',
  settings: 'linear-gradient(135deg, #a8a8a8, #5a5a5a)',
  messages: 'linear-gradient(135deg, #667eea, #764ba2)',
  clicker: 'linear-gradient(135deg, #fa709a, #fee140)',
  camera: 'linear-gradient(135deg, #f093fb, #f5576c)',
  gallery: 'linear-gradient(135deg, #4facfe, #00f2fe)',
};

export default function AppShell({ appName, visible, onClose, children }: AppShellProps) {
  if (!appName) return null;

  // SpidiClicker has its own full UI (iframe), no status bar needed
  const isClicker = appName === 'clicker';

  return (
    <div
      className="absolute inset-0 z-30 flex flex-col overflow-hidden"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0) scale(1)' : 'translateY(40px) scale(0.96)',
        transition: 'opacity 0.35s cubic-bezier(0.4,0,0.2,1), transform 0.35s cubic-bezier(0.34,1.2,0.64,1)',
        background: '#0f0f1a',
        borderRadius: visible ? '0px' : '30px',
      }}>

      {/* App Status Bar */}
      <div className="flex-shrink-0 flex items-center justify-between px-6 pt-12 pb-3"
        style={{ background: isClicker ? '#000' : 'rgba(15,15,26,0.98)' }}>
        <button
          onClick={onClose}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all active:scale-95"
          style={{
            background: 'rgba(255,255,255,0.1)',
            color: 'rgba(255,255,255,0.8)',
            border: '1px solid rgba(255,255,255,0.12)',
          }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
          Назад
        </button>

        <span className="text-white font-semibold text-base tracking-tight">
          {appTitles[appName]}
        </span>

        <div className="w-16 flex justify-end">
          <div className="w-2 h-2 rounded-full"
            style={{ background: appColors[appName] }} />
        </div>
      </div>

      {/* Divider */}
      <div className="h-px mx-4 flex-shrink-0"
        style={{ background: 'rgba(255,255,255,0.06)' }} />

      {/* App Content */}
      <div className="flex-1 overflow-hidden relative">
        {children}
      </div>

      {/* Home indicator */}
      <div className="flex-shrink-0 flex justify-center py-2">
        <div
          className="w-32 h-1 rounded-full cursor-pointer transition-all hover:w-36"
          style={{ background: 'rgba(255,255,255,0.25)' }}
          onClick={onClose}
        />
      </div>
    </div>
  );
}
