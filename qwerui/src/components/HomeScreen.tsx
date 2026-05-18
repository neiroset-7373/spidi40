import { useState, useEffect } from 'react';
import { AppName } from '../App';

interface HomeScreenProps {
  onOpenApp: (app: AppName) => void;
}

const apps: { id: AppName; label: string; gradient: string }[] = [
  { id: 'phone', label: 'Звонилка', gradient: 'linear-gradient(135deg, #11998e, #38ef7d)' },
  { id: 'messages', label: 'Сообщения', gradient: 'linear-gradient(135deg, #667eea, #764ba2)' },
  { id: 'camera', label: 'Камера', gradient: 'linear-gradient(135deg, #f093fb, #f5576c)' },
  { id: 'gallery', label: 'Галерея', gradient: 'linear-gradient(135deg, #4facfe, #00f2fe)' },
  { id: 'clicker', label: 'Spidi Clicker', gradient: 'linear-gradient(135deg, #fa709a, #fee140)' },
  { id: 'deepseek', label: 'DeepSeek', gradient: 'linear-gradient(135deg, #1a73e8, #4285f4)' },
  { id: 'music', label: 'Музыка', gradient: 'linear-gradient(135deg, #7c3aed, #2563eb)' },
  { id: 'settings', label: 'Настройки', gradient: 'linear-gradient(135deg, #a8a8a8, #5a5a5a)' },
];

const dockApps = ['phone', 'messages', 'clicker', 'settings'];

export default function HomeScreen({ onOpenApp }: HomeScreenProps) {
  const [time, setTime] = useState(new Date());
  const [pressedApp, setPressedApp] = useState<AppName>(null);
  const [showNotifBar, setShowNotifBar] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const mainApps = apps.filter(a => !dockApps.includes(a.id!));
  const dock = apps.filter(a => dockApps.includes(a.id!));

  const handleAppPress = (id: AppName) => {
    setPressedApp(id);
    setTimeout(() => {
      setPressedApp(null);
      onOpenApp(id);
    }, 120);
  };

  return (
    <div className="relative w-full h-full select-none overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #0a0520 0%, #150a30 50%, #1a0a40 100%)',
      }}>

      {/* Dark overlay */}
      <div className="absolute inset-0" style={{ background: 'rgba(0,0,20,0.2)' }} />

      {/* Status bar */}
      <div className="relative z-20 flex justify-between items-center px-8 pt-14 pb-2 text-white text-sm font-medium">
        <span style={{ fontVariantNumeric: 'tabular-nums' }}>
          {time.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
        </span>
        <div className="flex items-center gap-1.5">
          <div className="flex items-end gap-[2px] h-4">
            {[3,5,7,9].map((h,i) => (
              <div key={i} className="w-[3px] rounded-[1px]"
                style={{ height: `${h}px`, background: '#fff' }} />
            ))}
          </div>
          <svg width="16" height="12" viewBox="0 0 24 18" fill="none">
            <path d="M12 14.5a2 2 0 110 4 2 2 0 010-4z" fill="white"/>
            <path d="M7 10.5C8.7 8.8 10.2 8 12 8s3.3.8 5 2.5" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none"/>
            <path d="M3 6.5C6.1 3.3 8.9 2 12 2s5.9 1.! 3 9 4.5" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none"/>
          </svg>
          {/* Battery */}
          <img
            src="/system_icons/battery.jpg"
            alt="Battery"
            className="w-6 h-3 object-cover rounded-[3px]"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        </div>
      </div>

      {/* Notification pull tab */}
      <div className="absolute top-0 left-0 right-0 z-30"
        onMouseEnter={() => setShowNotifBar(true)}
        onMouseLeave={() => setShowNotifBar(false)}>
        <div className="h-14" />
        <div
          className="absolute top-0 left-0 right-0 overflow-hidden transition-all duration-500"
          style={{
            maxHeight: showNotifBar ? '200px' : '0px',
            backdropFilter: 'blur(30px)',
            background: 'rgba(20,10,40,0.85)',
          }}>
          <div className="px-6 pt-16 pb-4">
            <div className="text-white/50 text-xs uppercase tracking-widest mb-3">Уведомления</div>
            <div className="space-y-2">
              <div className="flex items-center gap-3 py-2">
                <div className="w-8 h-8 rounded-xl"
                  style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }} />
                <div>
                  <div className="text-white text-sm font-medium">Сообщения · сейчас</div>
                  <div className="text-white/60 text-xs">Spidi: Привет!</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Widget - Date */}
      <div className="relative z-10 mx-5 mt-4">
        <div className="rounded-3xl px-5 py-4"
          style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.15)' }}>
          <div className="flex justify-between items-center">
            <div>
              <div className="text-white/60 text-xs uppercase tracking-widest">Spidios • Android 16</div>
              <div className="text-white text-2xl font-light mt-0.5 capitalize">
                {time.toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* App grid */}
      <div className="relative z-10 px-6 mt-6 grid grid-cols-4 gap-4">
        {mainApps.map((app) => (
          <AppIcon
            key={app.id}
            app={app}
            pressed={pressedApp === app.id}
            onPress={() => handleAppPress(app.id)}
          />
        ))}
      </div>



      {/* Dock */}
      <div className="absolute bottom-8 left-5 right-5 z-20">
        <div className="rounded-3xl px-4 py-3 flex justify-around items-center"
          style={{
            background: 'rgba(255,255,255,0.15)',
            backdropFilter: 'blur(30px)',
            border: '1px solid rgba(255,255,255,0.2)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          }}>
          {dock.map(app => (
            <AppIcon
              key={app.id}
              app={app}
              pressed={pressedApp === app.id}
              onPress={() => handleAppPress(app.id)}
              size="sm"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

interface AppIconProps {
  app: { id: AppName; label: string; gradient: string };
  pressed: boolean;
  onPress: () => void;
  size?: 'sm' | 'md';
}

function AppIcon({ app, pressed, onPress, size = 'md' }: AppIconProps) {
  const iconSize = size === 'sm' ? 'w-14 h-14' : 'w-16 h-16';
  const textSize = size === 'sm' ? 'text-[9px]' : 'text-[10px]';

  return (
    <div
      className="flex flex-col items-center gap-1.5 cursor-pointer"
      onClick={onPress}
      style={{
        transform: pressed ? 'scale(0.88)' : 'scale(1)',
        transition: 'transform 0.12s cubic-bezier(0.34,1.56,0.64,1)',
      }}>
      <img
        src={`/system_icons/${app.id === 'phone' ? 'zvonki.png' :
              app.id === 'messages' ? 'messenges.png' :
              app.id === 'clicker' ? 'spidi_clicker_icon_for_apps.png' :
              app.id === 'camera' ? 'camera.webp' :
              app.id === 'gallery' ? 'gallery.jpg' :
              app.id === 'music' ? 'music_app.jpg' :
              app.id === 'deepseek' ? '../other_applications/logo chat.deepseek.com.png' :
              app.id === 'settings' ? 'settings.webp' : ''}`}
        alt={app.label}
        className={`${iconSize} rounded-2xl shadow-lg object-cover`}
        onError={(e) => {
          (e.target as HTMLImageElement).style.background = app.gradient;
          (e.target as HTMLImageElement).style.opacity = '0.8';
        }}
      />
      <span className={`text-white ${textSize} font-medium text-center drop-shadow`}
        style={{ textShadow: '0 1px 4px rgba(0,0,0,0.9)' }}>
        {app.label}
      </span>
    </div>
  );
}
