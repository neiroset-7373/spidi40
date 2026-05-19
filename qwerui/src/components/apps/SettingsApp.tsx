import { useState, useCallback } from 'react';
import { useFont } from '../../contexts/FontContext';

function ToggleSwitch({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!on)}
      className={`relative w-12 h-7 rounded-full transition-all duration-300 ${on ? 'bg-purple-600' : 'bg-gray-600'}`}
    >
      <div
        className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow-lg transition-all duration-300 ${on ? 'left-6' : 'left-1'}`}
      />
    </button>
  );
}

export default function SettingsApp() {
  const { fontSize, setFontSize } = useFont();
  const [activeSection, setActiveSection] = useState('general');
  const [showFontModal, setShowFontModal] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [resetProgress, setResetProgress] = useState(0);
  const [resetComplete, setResetComplete] = useState(false);

  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('spidi_settings');
    return saved ? JSON.parse(saved) : {
      wifi: true,
      bluetooth: false,
      airplaneMode: false,
      autoBrightness: true,
      darkMode: false,
      notifications: true,
      sound: true,
      vibrate: true,
      pinLock: true,
      fingerprint: true,
      faceUnlock: false,
    };
  });

  const saveSettings = useCallback((newSettings: Record<string, boolean>) => {
    setSettings(newSettings);
    localStorage.setItem('spidi_settings', JSON.stringify(newSettings));
  }, []);

  const handleReset = () => {
    setShowResetConfirm(true);
    setResetProgress(0);
    setResetComplete(false);
    const start = Date.now();
    const interval = setInterval(() => {
      const passed = Date.now() - start;
      const pct = Math.min(100, (passed / 10000) * 100);
      setResetProgress(pct);
      if (passed >= 10000) {
        clearInterval(interval);
        setResetComplete(true);
        setTimeout(() => {
          localStorage.clear();
          window.location.reload();
        }, 1000);
      }
    }, 200);
  };

  const sections = [
    { id: 'general', label: 'Основные', icon: '⚙️' },
    { id: 'display', label: 'Экран', icon: '📱' },
    { id: 'sound', label: 'Звук', icon: '🔊' },
    { id: 'security', label: 'Безопасность', icon: '🔒' },
    { id: 'about', label: 'О телефоне', icon: 'ℹ️' },
  ];

  const generalSettings = [
    { key: 'wifi', label: 'Wi-Fi', icon: '📶', value: settings.wifi ? 'SpidiFi_Free' : 'Выкл' },
    { key: 'bluetooth', label: 'Bluetooth', icon: '🔵', value: settings.bluetooth ? 'Вкл' : 'Выкл' },
    { key: 'airplaneMode', label: 'Авиарежим', icon: '✈️', toggle: true },
    { key: 'notifications', label: 'Уведомления', icon: '🔔', toggle: true },
  ];

  const displaySettings = [
    { key: 'autoBrightness', label: 'Автояркость', icon: '☀️', toggle: true },
    { label: 'Размер шрифта', icon: '📝', action: 'fontSize' },
    { key: 'darkMode', label: 'Ночной режим', icon: '🌙', toggle: true },
  ];

  const soundSettings = [
    { key: 'sound', label: 'Звук', icon: '🔊', toggle: true },
    { key: 'vibrate', label: 'Вибрация', icon: '📳', toggle: true },
  ];

  const securitySettings = [
    { key: 'pinLock', label: 'PIN-код', icon: '🔐', value: '4 цифры' },
    { key: 'fingerprint', label: 'Отпечаток', icon: '👆', toggle: true },
    { key: 'faceUnlock', label: 'Распознавание лица', icon: '😎', toggle: true },
  ];

  return (
    <div className="h-full flex flex-col bg-[#0f0f1a]">
      {/* Header */}
      <div className="flex-shrink-0 px-4 pt-12 pb-4" style={{ background: 'linear-gradient(180deg, rgba(102,126,234,0.15), rgba(102,126,234,0.05))' }}>
        <h1 className="text-2xl font-bold text-white text-center">Настройки</h1>
      </div>

      {/* Profile Card */}
      <div className="flex-shrink-0 mx-4 mb-4 p-4 rounded-2xl flex items-center gap-4"
        style={{ background: 'linear-gradient(135deg, rgba(102,126,234,0.25), rgba(118,75,162,0.25))', border: '1px solid rgba(102,126,234,0.3)' }}>
        <div className="w-14 h-14 rounded-full flex items-center justify-center text-2xl"
          style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }}>👤</div>
        <div className="flex-1">
          <div className="text-white font-semibold">Spidi User</div>
          <div className="text-white/50 text-xs">spidi@spidios.ru</div>
        </div>
        <div className="text-purple-400 text-xs px-2 py-1 rounded-full bg-purple-600/30">Premium</div>
      </div>

      {/* Section Tabs */}
      <div className="flex-shrink-0 px-4 mb-3">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {sections.map(section => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                activeSection === section.id
                  ? 'bg-purple-600 text-white'
                  : 'bg-white/5 text-white/60 hover:bg-white/10'
              }`}
            >
              <span>{section.icon}</span>
              <span className="text-sm font-medium">{section.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Settings List */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <div className="space-y-3">
          {activeSection === 'general' && generalSettings.map(item => (
            <div key={item.key} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xl" style={{ background: 'rgba(102,126,234,0.2)' }}>{item.icon}</div>
              <div className="flex-1">
                <div className="text-white font-medium">{item.label}</div>
                {item.toggle ? null : <div className="text-white/40 text-xs">{item.value}</div>}
              </div>
              {item.toggle ? (
                <ToggleSwitch on={settings[item.key]} onChange={v => saveSettings({ ...settings, [item.key]: v })} />
              ) : (
                <div className="text-purple-400">›</div>
              )}
            </div>
          ))}

          {activeSection === 'display' && displaySettings.map(item => (
            <div key={item.key || item.label} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xl" style={{ background: 'rgba(118,75,162,0.2)' }}>{item.icon}</div>
              <div className="flex-1">
                <div className="text-white font-medium">{item.label}</div>
                {item.key && !item.toggle ? <div className="text-white/40 text-xs">{fontSize}</div> : null}
              </div>
              {item.action === 'fontSize' ? (
                <button onClick={() => setShowFontModal(true)} className="text-purple-400">›</button>
              ) : item.toggle ? (
                <ToggleSwitch on={settings[item.key]} onChange={v => saveSettings({ ...settings, [item.key]: v })} />
              ) : null}
            </div>
          ))}

          {activeSection === 'sound' && soundSettings.map(item => (
            <div key={item.key} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xl" style={{ background: 'rgba(245,87,108,0.2)' }}>{item.icon}</div>
              <div className="flex-1">
                <div className="text-white font-medium">{item.label}</div>
              </div>
              <ToggleSwitch on={settings[item.key]} onChange={v => saveSettings({ ...settings, [item.key]: v })} />
            </div>
          ))}

          {activeSection === 'security' && securitySettings.map(item => (
            <div key={item.key} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xl" style={{ background: 'rgba(56,239,125,0.2)' }}>{item.icon}</div>
              <div className="flex-1">
                <div className="text-white font-medium">{item.label}</div>
                {item.value ? <div className="text-white/40 text-xs">{item.value}</div> : null}
              </div>
              {item.toggle ? (
                <ToggleSwitch on={settings[item.key]} onChange={v => saveSettings({ ...settings, [item.key]: v })} />
              ) : (
                <div className="text-purple-400">›</div>
              )}
            </div>
          ))}

          {activeSection === 'about' && (
            <>
              <div className="p-4 rounded-xl text-center" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="text-4xl mb-2">📱</div>
                <div className="text-white font-semibold text-lg">SpidiPhone 1</div>
                <div className="text-white/50 text-sm mt-1">Spidios • Android 16</div>
                <div className="text-white/30 text-xs mt-2">Версия 16.0.1</div>
              </div>
              <button
                onClick={() => setShowResetConfirm(true)}
                className="w-full p-4 rounded-xl flex items-center gap-3 transition-all hover:opacity-80"
                style={{ background: 'linear-gradient(135deg, rgba(239,68,68,0.2), rgba(220,38,38,0.2))', border: '1px solid rgba(239,68,68,0.3)' }}
              >
                <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xl">⚠️</div>
                <div className="flex-1 text-left">
                  <div className="text-red-400 font-semibold">Сброс настроек</div>
                  <div className="text-white/40 text-xs">Все данные будут удалены</div>
                </div>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Font Size Modal */}
      {showFontModal && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowFontModal(false)}>
          <div className="relative w-full bg-[#1a1a2e] rounded-t-3xl p-6 pb-8" onClick={e => e.stopPropagation()}>
            <div className="w-12 h-1 bg-white/20 rounded-full mx-auto mb-4" />
            <h3 className="text-white text-lg font-semibold mb-4 text-center">Размер шрифта</h3>
            <div className="space-y-2">
              {(['Маленький', 'Средний', 'Крупный', 'Очень крупный'] as const).map(size => (
                <button
                  key={size}
                  onClick={() => { setFontSize(size); setShowFontModal(false); }}
                  className={`w-full px-4 py-3 rounded-xl text-left transition-all ${fontSize === size ? 'bg-purple-600 text-white' : 'bg-white/5 text-white/70 hover:bg-white/10'}`}
                  style={{ fontSize: size === 'Маленький' ? '12px' : size === 'Средний' ? '14px' : size === 'Крупный' ? '18px' : '22px' }}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Reset Confirm Modal */}
      {showResetConfirm && !resetComplete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => !resetProgress && setShowResetConfirm(false)}>
          <div className="relative w-[280px] bg-[#1a1a2e] rounded-3xl p-6" onClick={e => e.stopPropagation()}>
            <div className="text-center">
              <div className="text-4xl mb-3">⚠️</div>
              <h3 className="text-white text-lg font-semibold mb-2">Сброс настроек?</h3>
              <p className="text-white/50 text-sm mb-4">Все данные будут удалены безвозвратно</p>
              {!resetProgress ? (
                <div className="flex gap-2">
                  <button onClick={() => setShowResetConfirm(false)} className="flex-1 py-3 bg-white/10 rounded-xl text-white font-medium">Отмена</button>
                  <button onClick={handleReset} className="flex-1 py-3 bg-red-600 rounded-xl text-white font-medium">Сбросить</button>
                </div>
              ) : (
                <div>
                  <div className="relative h-3 bg-white/10 rounded-full overflow-hidden mb-2">
                    <div className="h-full bg-gradient-to-r from-red-600 to-orange-600 transition-all" style={{ width: `${resetProgress}%` }} />
                  </div>
                  <div className="text-white/40 text-xs text-center">{Math.round(resetProgress)}%</div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Reset Complete */}
      {resetComplete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="relative w-[280px] bg-[#1a1a2e] rounded-3xl p-6 text-center">
            <div className="text-4xl mb-3">✨</div>
            <h3 className="text-white text-lg font-semibold">Сброс завершен!</h3>
          </div>
        </div>
      )}
    </div>
  );
}
