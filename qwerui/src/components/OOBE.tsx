import { useState, useEffect } from 'react';

interface OOBEProps {
  onComplete: (pin: string | null) => void;
}

export default function OOBE({ onComplete }: OOBEProps) {
  const [step, setStep] = useState(1);
  const [pin, setPin] = useState('');
  const [pinConfirm, setPinConfirm] = useState('');
  const [pinMode, setPinMode] = useState<'create' | 'confirm' | null>(null);
  const [pinError, setPinError] = useState('');
  const [progress, setProgress] = useState(0);
  const [selectedWifi, setSelectedWifi] = useState<string | null>(null);
  const [fontSize, setFontSize] = useState<'Маленький' | 'Средний' | 'Крупный'>('Средний');
  const [skipPin, setSkipPin] = useState(false);

  const wifiNetworks = [
    { name: 'SpidiFi_Free', signal: 4 },
    { name: 'Wintozo_Guest', signal: 3 },
    { name: 'Android_Hotspot', signal: 5 },
    { name: 'Cafe_Coffee', signal: 2 },
  ];

  // PIN keypad handlers
  const addPinDigit = (d: string) => {
    if (pinMode === 'create') {
      if (pin.length < 4) setPin(p => p + d);
    } else if (pinMode === 'confirm') {
      if (pinConfirm.length < 4) setPinConfirm(p => p + d);
    }
  };

  const backspacePin = () => {
    if (pinMode === 'create') setPin(p => p.slice(0, -1));
    else if (pinMode === 'confirm') setPinConfirm(p => p.slice(0, -1));
  };

  const submitPin = () => {
    if (pinMode === 'create') {
      if (pin.length === 4) {
        setPinMode('confirm');
        setPinError('');
      }
    } else if (pinMode === 'confirm') {
      if (pinConfirm === pin) {
        setPinMode(null);
        setStep(3);
        setPinError('');
      } else {
        setPinError('PIN не совпадает. Попробуйте снова.');
        setPinConfirm('');
      }
    }
  };

  useEffect(() => {
    if ((pinMode === 'create' && pin.length === 4) || (pinMode === 'confirm' && pinConfirm.length === 4)) {
      const t = setTimeout(submitPin, 300);
      return () => clearTimeout(t);
    }
  }, [pin, pinConfirm]);

  // Step 4: App installation (5 seconds)
  useEffect(() => {
    if (step !== 4) return;
    const start = Date.now();
    const interval = setInterval(() => {
      const passed = Date.now() - start;
      setProgress(Math.min(100, (passed / 5000) * 100));
      if (passed >= 5000) { clearInterval(interval); setStep(5); }
    }, 200);
    return () => clearInterval(interval);
  }, [step]);

  // Step 5: Update check (13 seconds)
  useEffect(() => {
    if (step !== 5) return;
    const start = Date.now();
    const interval = setInterval(() => {
      const passed = Date.now() - start;
      setProgress(Math.min(100, (passed / 13000) * 100));
      if (passed >= 13000) { clearInterval(interval); setStep(6); }
    }, 200);
    return () => clearInterval(interval);
  }, [step]);

  const finish = () => {
    localStorage.setItem('spidi_font_size', fontSize);
    onComplete(skipPin ? null : pin);
  };

  const renderPinDots = (value: string) => (
    <div className="flex justify-center gap-3 mb-4">
      {[0,1,2,3].map(i => (
        <div key={i} className="w-4 h-4 rounded-full border-2 border-white/40 flex items-center justify-center">
          {value.length > i && <div className="w-2 h-2 rounded-full bg-white" />}
        </div>
      ))}
    </div>
  );

  const renderKeypad = () => (
    <div className="grid grid-cols-3 gap-2 max-w-[240px] mx-auto">
      {['1','2','3','4','5','6','7','8','9','','0','⌫'].map((k, i) => (
        <button key={i}
          onClick={() => k === '⌫' ? backspacePin() : k && addPinDigit(k)}
          disabled={!k}
          className="w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-semibold text-white transition-all active:scale-90 active:bg-white/20 disabled:opacity-0"
          style={{ background: 'rgba(255,255,255,0.1)' }}>
          {k}
        </button>
      ))}
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden" style={{ background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)' }}>
      <div className="relative z-10 w-full max-w-sm px-6">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl mb-3" style={{ background: 'linear-gradient(135deg, rgba(102,126,234,0.3), rgba(118,75,162,0.3))', border: '1px solid rgba(255,255,255,0.1)' }}>
            <span className="text-4xl">🚀</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">
            {step === 1 && 'Подключение'}
            {step === 2 && (pinMode ? 'Введите PIN' : 'Безопасность')}
            {step === 3 && 'Отображение'}
            {step === 4 && 'Установка'}
            {step === 5 && 'Обновление'}
            {step === 6 && 'Готово!'}
          </h1>
          <p className="text-white/50 text-sm">
            {step === 1 && 'Выберите сеть Wi-Fi'}
            {step === 2 && (pinMode === 'create' ? 'Придумайте 4-значный PIN' : pinMode === 'confirm' ? 'Повторите PIN' : 'Защитите устройство')}
            {step === 3 && 'Выберите размер шрифта'}
            {step === 4 && 'Стандартных приложений'}
            {step === 5 && 'Проверка системы'}
            {step === 6 && 'Ваш SpidiPhone настроен'}
          </p>
        </div>

        {/* Step 1: Wi-Fi */}
        {step === 1 && (
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-5 border border-white/10">
            <div className="space-y-2 mb-4">
              {wifiNetworks.map(n => (
                <button key={n.name} onClick={() => setSelectedWifi(n.name)}
                  className={`w-full px-4 py-3 rounded-xl flex items-center justify-between transition-all ${selectedWifi === n.name ? 'bg-purple-600 text-white' : 'bg-white/5 text-white/70 hover:bg-white/10'}`}>
                  <div className="flex items-center gap-3">
                    <div className="flex items-end gap-[2px] h-4">
                      {[2,4,6,8].map((h,i) => <div key={i} className="w-[2px] rounded-[1px]" style={{ height: `${h}px`, background: i < n.signal ? 'currentColor' : 'rgba(255,255,255,0.2)' }} />)}
                    </div>
                    <span className="font-medium">{n.name}</span>
                  </div>
                  {selectedWifi === n.name && <span>✓</span>}
                </button>
              ))}
            </div>
            <button onClick={() => selectedWifi && setStep(2)} disabled={!selectedWifi}
              className={`w-full py-3 rounded-2xl font-semibold transition-all ${selectedWifi ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white active:scale-95' : 'bg-white/5 text-white/30 cursor-not-allowed'}`}>Далее</button>
          </div>
        )}

        {/* Step 2: PIN */}
        {step === 2 && (
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-5 border border-white/10">
            {!pinMode ? (
              <div className="text-center">
                <div className="text-5xl mb-4">🔐</div>
                <h2 className="text-white text-lg font-semibold mb-2">Установить PIN?</h2>
                <p className="text-white/50 text-sm mb-4">Защитите устройство от несанкционированного доступа</p>
                <div className="space-y-2">
                  <button onClick={() => { setPinMode('create'); setPin(''); setPinConfirm(''); setPinError(''); }}
                    className="w-full py-3 rounded-2xl font-semibold bg-gradient-to-r from-purple-600 to-pink-600 text-white active:scale-95 transition-all">Установить PIN</button>
                  <button onClick={() => { setSkipPin(true); setStep(3); }}
                    className="w-full py-3 rounded-2xl font-semibold bg-white/5 text-white/70 hover:bg-white/10 transition-all">Пропустить</button>
                </div>
              </div>
            ) : (
              <div>
                <div className="text-center mb-4">
                  <div className="text-3xl mb-2">{pinMode === 'create' ? '🔐' : '🔁'}</div>
                  <div className="text-white font-semibold">{pinMode === 'create' ? 'Придумайте PIN' : 'Повторите PIN'}</div>
                </div>
                {renderPinDots(pinMode === 'create' ? pin : pinConfirm)}
                {pinError && <div className="text-red-400 text-sm text-center mb-2">{pinError}</div>}
                {renderKeypad()}
                <button onClick={() => { setPinMode(null); setPin(''); setPinConfirm(''); setPinError(''); }}
                  className="w-full mt-4 py-2 text-white/50 text-sm hover:text-white transition-all">Отмена</button>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Font Size */}
        {step === 3 && (
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-5 border border-white/10">
            <div className="text-center mb-4">
              <div className="text-4xl mb-2">📝</div>
              <h2 className="text-white text-lg font-semibold">Размер шрифта</h2>
            </div>
            <div className="space-y-2 mb-4">
              {['Маленький', 'Средний', 'Крупный'].map(size => (
                <button key={size} onClick={() => setFontSize(size as any)}
                  className={`w-full px-4 py-3 rounded-xl text-left transition-all ${fontSize === size ? 'bg-purple-600 text-white' : 'bg-white/5 text-white/70 hover:bg-white/10'}`}
                  style={{ fontSize: size === 'Маленький' ? '12px' : size === 'Средний' ? '14px' : '18px' }}>{size}</button>
              ))}
            </div>
            <button onClick={() => setStep(4)}
              className="w-full py-3 rounded-2xl font-semibold bg-gradient-to-r from-purple-600 to-pink-600 text-white active:scale-95 transition-all">Продолжить</button>
          </div>
        )}

        {/* Step 4: App Install */}
        {step === 4 && (
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-5 border border-white/10 text-center">
            <div className="text-3xl mb-3">⚙️</div>
            <h2 className="text-white text-lg font-semibold mb-2">Установка приложений</h2>
            <div className="relative h-3 bg-white/10 rounded-full overflow-hidden mb-3">
              <div className="h-full bg-gradient-to-r from-purple-600 to-pink-600 transition-all" style={{ width: `${progress}%` }} />
            </div>
            <div className="text-white/40 text-xs">{Math.round(progress)}%</div>
          </div>
        )}

        {/* Step 5: Update Check */}
        {step === 5 && (
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-5 border border-white/10 text-center">
            <div className="text-3xl mb-3">🔄</div>
            <h2 className="text-white text-lg font-semibold mb-2">Проверка обновлений</h2>
            <div className="relative h-3 bg-white/10 rounded-full overflow-hidden mb-3">
              <div className="h-full bg-gradient-to-r from-green-600 to-emerald-600 transition-all" style={{ width: `${progress}%` }} />
            </div>
            <div className="text-white/40 text-xs">{Math.round(progress)}%</div>
          </div>
        )}

        {/* Step 6: Complete */}
        {step === 6 && (
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-5 border border-white/10 text-center">
            <div className="text-5xl mb-3">🎉</div>
            <h2 className="text-white text-xl font-bold mb-2">Всё готово!</h2>
            <p className="text-white/50 text-sm mb-4">{selectedWifi && `📶 ${selectedWifi}`}{!skipPin && pin && ' 🔐 PIN установлен'}{` 📝 ${fontSize}`}</p>
            <button onClick={finish}
              className="w-full py-3 rounded-2xl font-semibold bg-gradient-to-r from-green-600 to-emerald-600 text-white active:scale-95 transition-all">Начать использование</button>
          </div>
        )}

        <div className="flex justify-center gap-2 mt-4">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className={`h-1.5 rounded-full transition-all ${i === step ? 'w-8 bg-gradient-to-r from-purple-500 to-pink-500' : i < step ? 'w-4 bg-purple-500/50' : 'w-2 bg-white/10'}`} />
          ))}
        </div>
      </div>
    </div>
  );
}
