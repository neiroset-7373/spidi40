import { useState } from 'react';

interface SettingItem {
  label: string;
  value?: string;
  toggle?: boolean;
  defaultOn?: boolean;
  gradient: string;
}

const sections: { title: string; items: SettingItem[] }[] = [
  {
    title: 'Устройство',
    items: [
      { label: 'О телефоне', value: 'Spidiphone 1 · Android 16', gradient: 'linear-gradient(135deg, #667eea, #764ba2)' },
      { label: 'Аккумулятор', value: '80%', gradient: 'linear-gradient(135deg, #11998e, #38ef7d)' },
      { label: 'Хранилище', value: '64 ГБ / 128 ГБ', gradient: 'linear-gradient(135deg, #4facfe, #00f2fe)' },
    ],
  },
  {
    title: 'Подключения',
    items: [
      { label: 'Wi-Fi', toggle: true, defaultOn: true, gradient: 'linear-gradient(135deg, #4facfe, #00f2fe)' },
      { label: 'Bluetooth', toggle: true, defaultOn: false, gradient: 'linear-gradient(135deg, #667eea, #764ba2)' },
      { label: 'Авиарежим', toggle: true, defaultOn: false, gradient: 'linear-gradient(135deg, #a8a8a8, #5a5a5a)' },
      { label: 'VPN', toggle: true, defaultOn: false, gradient: 'linear-gradient(135deg, #f093fb, #f5576c)' },
    ],
  },
  {
    title: 'Отображение',
    items: [
      { label: 'Авторяркость', toggle: true, defaultOn: true, gradient: 'linear-gradient(135deg, #f7971e, #ffd200)' },
      { label: 'Тема оформления', value: 'Spidi Purple', gradient: 'linear-gradient(135deg, #c471f5, #fa71cd)' },
      { label: 'Размер шрифта', value: 'Средний', gradient: 'linear-gradient(135deg, #a8a8a8, #5a5a5a)' },
    ],
  },
  {
    title: 'Безопасность',
    items: [
      { label: 'Блокировка экрана', value: 'PIN', gradient: 'linear-gradient(135deg, #11998e, #38ef7d)' },
      { label: 'Отпечаток пальца', toggle: true, defaultOn: true, gradient: 'linear-gradient(135deg, #f093fb, #f5576c)' },
      { label: 'Распознавание лица', toggle: true, defaultOn: false, gradient: 'linear-gradient(135deg, #4facfe, #00f2fe)' },
    ],
  },
  {
    title: 'Приложения',
    items: [
      { label: 'Уведомления', value: '3 приложения', gradient: 'linear-gradient(135deg, #fa709a, #fee140)' },
      { label: 'Разрешения', value: 'Управление', gradient: 'linear-gradient(135deg, #667eea, #764ba2)' },
      { label: 'Обновления', value: 'Актуально', gradient: 'linear-gradient(135deg, #11998e, #38ef7d)' },
    ],
  },
];

function ToggleSwitch({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <div
      onClick={() => onChange(!on)}
      className="relative cursor-pointer transition-all"
      style={{
        width: '48px',
        height: '28px',
        borderRadius: '14px',
        background: on ? 'linear-gradient(135deg, #667eea, #764ba2)' : 'rgba(255,255,255,0.15)',
        transition: 'background 0.3s ease',
      }}>
      <div
        className="absolute top-1"
        style={{
          width: '20px',
          height: '20px',
          borderRadius: '50%',
          background: '#fff',
          left: on ? '24px' : '4px',
          transition: 'left 0.3s cubic-bezier(0.34,1.56,0.64,1)',
          boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
        }} />
    </div>
  );
}

export default function SettingsApp() {
  const [toggles, setToggles] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    sections.forEach(s => s.items.forEach(item => {
      if (item.toggle) initial[item.label] = item.defaultOn ?? false;
    }));
    return initial;
  });

  const [brightness, setBrightness] = useState(70);
  const [volume, setVolume] = useState(60);

  return (
    <div className="h-full overflow-y-auto" style={{ background: '#0f0f1a' }}>
      {/* Profile card */}
      <div className="mx-4 mt-3 mb-4 p-4 rounded-3xl flex items-center gap-4"
        style={{ background: 'linear-gradient(135deg, rgba(102,126,234,0.2), rgba(118,75,162,0.2))', border: '1px solid rgba(102,126,234,0.3)' }}>
        <div className="w-16 h-16 rounded-full"
          style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }} />
        <div>
          <div className="text-white font-bold text-lg">Spidi User</div>
          <div className="text-white/50 text-sm">spidi@spidios.ru</div>
          <div className="text-purple-400 text-xs mt-0.5">Spidios Premium</div>
        </div>
        <div className="ml-auto text-white/30">›</div>
      </div>

      {/* Quick toggles */}
      <div className="mx-4 mb-4 p-4 rounded-3xl"
        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>

        {/* Brightness */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-white/60 text-sm flex items-center gap-2">Яркость</span>
            <span className="text-white/40 text-xs">{brightness}%</span>
          </div>
          <div className="relative h-2 rounded-full overflow-hidden cursor-pointer"
            style={{ background: 'rgba(255,255,255,0.1)' }}
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const pct = Math.round(((e.clientX - rect.left) / rect.width) * 100);
              setBrightness(Math.max(5, Math.min(100, pct)));
            }}>
            <div className="h-full rounded-full transition-all"
              style={{ width: `${brightness}%`, background: 'linear-gradient(90deg, #667eea, #764ba2)' }} />
          </div>
        </div>

        {/* Volume */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-white/60 text-sm flex items-center gap-2">Громкость</span>
            <span className="text-white/40 text-xs">{volume}%</span>
          </div>
          <div className="relative h-2 rounded-full overflow-hidden cursor-pointer"
            style={{ background: 'rgba(255,255,255,0.1)' }}
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const pct = Math.round(((e.clientX - rect.left) / rect.width) * 100);
              setVolume(Math.max(0, Math.min(100, pct)));
            }}>
            <div className="h-full rounded-full transition-all"
              style={{ width: `${volume}%`, background: 'linear-gradient(90deg, #11998e, #38ef7d)' }} />
          </div>
        </div>
      </div>

      {/* Settings sections */}
      {sections.map(section => (
        <div key={section.title} className="mx-4 mb-3">
          <div className="text-white/40 text-xs uppercase tracking-widest mb-2 px-1">
            {section.title}
          </div>
          <div className="rounded-3xl overflow-hidden"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
            {section.items.map((item, idx) => (
              <div key={item.label}
                className="flex items-center gap-3 px-4 py-3.5 transition-all active:bg-white/5"
                style={{ borderBottom: idx < section.items.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                <div className="w-9 h-9 rounded-xl flex-shrink-0"
                  style={{ background: item.gradient }} />
                <span className="text-white flex-1">{item.label}</span>
                {item.toggle ? (
                  <ToggleSwitch
                    on={toggles[item.label]}
                    onChange={v => setToggles(prev => ({ ...prev, [item.label]: v }))}
                  />
                ) : (
                  <div className="flex items-center gap-1.5">
                    <span className="text-white/35 text-sm">{item.value}</span>
                    <span className="text-white/20">›</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Version info */}
      <div className="text-center py-6 pb-8">
        <div className="text-white/20 text-xs">Spidios • Android 16 • Spidiphone 1</div>
        <div className="text-white/15 text-xs mt-0.5">Версия 16.0.1 (Spidi Build)</div>
      </div>
    </div>
  );
}
