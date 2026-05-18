import { useState, useCallback } from 'react';

interface SettingItem {
  label: string;
  value?: string;
  toggle?: boolean;
  defaultOn?: boolean;
  gradient: string;
}

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

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="absolute inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative w-full bg-[#1a1a2e] rounded-t-3xl p-6 pb-10" style={{ animation: 'slideUp 0.3s ease' }}>
        <div className="w-12 h-1 bg-white/20 rounded-full mx-auto mb-4" />
        <h3 className="text-white text-lg font-semibold mb-4 text-center">{title}</h3>
        {children}
      </div>
    </div>
  );
}

export default function SettingsApp() {
  const [toggles, setToggles] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {
      'Wi-Fi': true,
      'Bluetooth': false,
      'Авиарежим': false,
      'VPN': false,
      'Автояркость': true,
      'Отпечаток пальца': true,
      'Распознавание лица': false,
    };
    return initial;
  });

  const [brightness, setBrightness] = useState(70);
  const [volume, setVolume] = useState(60);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [fontSize, setFontSize] = useState('Средний');
  const [updateProgress, setUpdateProgress] = useState(0);
  const [updateComplete, setUpdateComplete] = useState(false);
  const [resetConfirm, setResetConfirm] = useState(false);
  const [resetProgress, setResetProgress] = useState(0);
  const [connectedWifi, setConnectedWifi] = useState('SpidiFi_Free');

  const wifiNetworks = [
    { name: 'SpidiFi_Free', signal: 4 },
    { name: 'Wintozo_Guest', signal: 3 },
    { name: 'Android_Hotspot', signal: 5 },
    { name: 'Cafe_Coffee', signal: 2 },
  ];

  const startUpdateCheck = useCallback(() => {
    setActiveModal('update');
    setUpdateProgress(0);
    setUpdateComplete(false);
    const start = Date.now();
    const interval = setInterval(() => {
      const passed = Date.now() - start;
      const pct = Math.min(100, (passed / 13000) * 100);
      setUpdateProgress(pct);
      if (passed >= 13000) {
        clearInterval(interval);
        setUpdateComplete(true);
      }
    }, 200);
  }, []);

  const confirmReset = useCallback(() => {
    setResetConfirm(true);
    setResetProgress(0);
    const start = Date.now();
    const interval = setInterval(() => {
      const passed = Date.now() - start;
      const pct = Math.min(100, (passed / 5000) * 100);
      setResetProgress(pct);
      if (passed >= 5000) {
        clearInterval(interval);
        localStorage.clear();
        window.location.reload();
      }
    }, 200);
  }, []);

  const handleItemClick = (label: string) => {
    if (label === 'Размер шрифта') setActiveModal('fontSize');
    if (label === 'Проверка обновлений') startUpdateCheck();
    if (label === 'Wi-Fi') setActiveModal('wifi');
    if (label === 'Сброс настроек') { setResetConfirm(false); setActiveModal('reset'); }
  };

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
        { label: 'Wi-Fi', value: toggles['Wi-Fi'] ? connectedWifi : 'Выключен', gradient: 'linear-gradient(135deg, #4facfe, #00f2fe)' },
        { label: 'Bluetooth', toggle: true, defaultOn: false, gradient: 'linear-gradient(135deg, #667eea, #764ba2)' },
        { label: 'Авиарежим', toggle: true, defaultOn: false, gradient: 'linear-gradient(135deg, #a8a8a8, #5a5a5a)' },
        { label: 'VPN', toggle: true, defaultOn: false, gradient: 'linear-gradient(135deg, #f093fb, #f5576c)' },
      ],
    },
    {
      title: 'Отображение',
      items: [
        { label: 'Автояркость', toggle: true, defaultOn: true, gradient: 'linear-gradient(135deg, #f7971e, #ffd200)' },
        { label: 'Тема оформления', value: 'Spidi Purple', gradient: 'linear-gradient(135deg, #c471f5, #fa71cd)' },
        { label: 'Размер шрифта', value: fontSize, gradient: 'linear-gradient(135deg, #a8a8a8, #5a5a5a)' },
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
        { label: 'Проверка обновлений', value: updateComplete ? 'Актуально' : 'Проверить', gradient: 'linear-gradient(135deg, #11998e, #38ef7d)' },
      ],
    },
    {
      title: 'Система',
      items: [
        { label: 'Сброс настроек', value: '⚠️', gradient: 'linear-gradient(135deg, #ef4444, #dc2626)' },
      ],
    },
  ];

  return (
    <div className="h-full overflow-y-auto relative" style={{ background: '#0f0f1a' }}>
      <style>{`@keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }`}</style>

      {/* Profile */}
      <div className="mx-4 mt-3 mb-4 p-4 rounded-3xl flex items-center gap-4"
        style={{ background: 'linear-gradient(135deg, rgba(102,126,234,0.2), rgba(118,75,162,0.2))', border: '1px solid rgba(102,126,234,0.3)' }}>
        <div className="w-16 h-16 rounded-full" style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }} />
        <div>
          <div className="text-white font-bold text-lg">Spidi User</div>
          <div className="text-white/50 text-sm">spidi@spidios.ru</div>
          <div className="text-purple-400 text-xs mt-0.5">Spidios Premium</div>
        </div>
      </div>

      {/* Brightness & Volume */}
      <div className="mx-4 mb-4 p-4 rounded-3xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-white/60 text-sm">☀️ Яркость</span>
            <span className="text-white/40 text-xs">{brightness}%</span>
          </div>
          <div className="relative h-2 rounded-full overflow-hidden cursor-pointer" style={{ background: 'rgba(255,255,255,0.1)' }}
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              setBrightness(Math.max(5, Math.min(100, Math.round(((e.clientX - rect.left) / rect.width) * 100))));
            }}>
            <div className="h-full rounded-full transition-all" style={{ width: `${brightness}%`, background: 'linear-gradient(90deg, #f7971e, #ffd200)' }} />
          </div>
        </div>
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-white/60 text-sm">🔊 Громкость</span>
            <span className="text-white/40 text-xs">{volume}%</span>
          </div>
          <div className="relative h-2 rounded-full overflow-hidden cursor-pointer" style={{ background: 'rgba(255,255,255,0.1)' }}
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              setVolume(Math.max(0, Math.min(100, Math.round(((e.clientX - rect.left) / rect.width) * 100))));
            }}>
            <div className="h-full rounded-full transition-all" style={{ width: `${volume}%`, background: 'linear-gradient(90deg, #11998e, #38ef7d)' }} />
          </div>
        </div>
      </div>

      {/* Sections */}
      {sections.map(section => (
        <div key={section.title} className="mx-4 mb-3">
          <div className="text-white/40 text-xs uppercase tracking-widest mb-2 px-1">{section.title}</div>
          <div className="rounded-3xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
            {section.items.map((item, idx) => (
              <div key={item.label}
                onClick={() => handleItemClick(item.label)}
                className="flex items-center gap-3 px-4 py-3.5 transition-all active:bg-white/5 cursor-pointer"
                style={{ borderBottom: idx < section.items.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                <div className="w-9 h-9 rounded-xl flex-shrink-0" style={{ background: item.gradient }} />
                <span className="text-white flex-1">{item.label}</span>
                {item.toggle ? (
                  <ToggleSwitch on={toggles[item.label]} onChange={v => setToggles(prev => ({ ...prev, [item.label]: v }))} />
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

      {/* Version */}
      <div className="text-center py-6 pb-8">
        <div className="text-white/20 text-xs">Spidios • Android 16 • Spidiphone 1</div>
        <div className="text-white/15 text-xs mt-0.5">Версия 16.0.1 (Spidi Build)</div>
      </div>

      {/* Modal: Font Size */}
      {activeModal === 'fontSize' && (
        <Modal title="Размер шрифта" onClose={() => setActiveModal(null)}>
          <div className="space-y-2">
            {['Маленький', 'Средний', 'Крупный', 'Очень крупный'].map((size) => (
              <button key={size} onClick={() => { setFontSize(size); setActiveModal(null); }}
                className={`w-full px-4 py-3 rounded-xl text-left transition-all ${fontSize === size ? 'bg-purple-600 text-white' : 'bg-white/5 text-white/70 hover:bg-white/10'}`}
                style={{ fontSize: size === 'Маленький' ? '12px' : size === 'Средний' ? '14px' : size === 'Крупный' ? '18px' : '22px' }}>
                {size}
              </button>
            ))}
          </div>
        </Modal>
      )}

      {/* Modal: Updates */}
      {activeModal === 'update' && (
        <Modal title="Проверка обновлений" onClose={() => updateComplete && setActiveModal(null)}>
          {!updateComplete ? (
            <>
              <div className="text-center mb-4">
                <div className="text-4xl mb-2">🔄</div>
                <div className="text-white/60 text-sm">Проверка доступных обновлений...</div>
              </div>
              <div className="relative h-3 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-purple-600 to-pink-600 transition-all" style={{ width: `${updateProgress}%` }} />
              </div>
              <div className="text-center mt-2 text-white/40 text-xs">{Math.round(updateProgress)}%</div>
            </>
          ) : (
            <>
              <div className="text-center mb-4">
                <div className="text-4xl mb-2">✅</div>
                <div className="text-white text-sm font-semibold">Обновлений не найдено</div>
                <div className="text-white/50 text-xs mt-1">Установлена последняя версия</div>
              </div>
              <button onClick={() => setActiveModal(null)} className="w-full py-3 bg-purple-600 rounded-xl text-white">ОК</button>
            </>
          )}
        </Modal>
      )}

      {/* Modal: Wi-Fi */}
      {activeModal === 'wifi' && (
        <Modal title="Wi-Fi сети" onClose={() => setActiveModal(null)}>
          <div className="mb-4 flex items-center justify-between">
            <span className="text-white/60 text-sm">Доступные сети</span>
            <ToggleSwitch on={toggles['Wi-Fi']} onChange={v => setToggles(prev => ({ ...prev, 'Wi-Fi': v }))} />
          </div>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {wifiNetworks.map((network) => (
              <button key={network.name} onClick={() => setConnectedWifi(network.name)}
                className={`w-full px-4 py-3 rounded-xl flex items-center justify-between transition-all ${connectedWifi === network.name ? 'bg-purple-600 text-white' : 'bg-white/5 text-white/70 hover:bg-white/10'}`}>
                <div className="flex items-center gap-3">
                  <div className="flex items-end gap-[2px] h-4">
                    {[2,4,6,8].map((h,i) => (
                      <div key={i} className="w-[2px] rounded-[1px]" style={{ height: `${h}px`, background: i < network.signal ? 'currentColor' : 'rgba(255,255,255,0.2)' }} />
                    ))}
                  </div>
                  <span className="font-medium">{network.name}</span>
                </div>
                {connectedWifi === network.name && <span>✓</span>}
              </button>
            ))}
          </div>
        </Modal>
      )}

      {/* Modal: Reset */}
      {activeModal === 'reset' && (
        <Modal title="Сброс настроек" onClose={() => !resetProgress && setActiveModal(null)}>
          {!resetConfirm ? (
            <>
              <div className="text-center mb-4">
                <div className="text-4xl mb-2">⚠️</div>
                <div className="text-white text-sm font-semibold">Вы уверены?</div>
                <div className="text-white/50 text-xs mt-1">Все данные будут удалены безвозвратно</div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setActiveModal(null)} className="flex-1 py-3 bg-white/10 rounded-xl text-white">Отмена</button>
                <button onClick={confirmReset} className="flex-1 py-3 bg-red-600 rounded-xl text-white">Сбросить</button>
              </div>
            </>
          ) : (
            <>
              <div className="text-center mb-4">
                <div className="text-4xl mb-2">🔄</div>
                <div className="text-white/60 text-sm">Сброс настроек...</div>
              </div>
              <div className="relative h-3 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-red-600 to-orange-600 transition-all" style={{ width: `${resetProgress}%` }} />
              </div>
              <div className="text-center mt-2 text-white/40 text-xs">{Math.round(resetProgress)}%</div>
            </>
          )}
        </Modal>
      )}
    </div>
  );
}
