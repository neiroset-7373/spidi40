import { useState, useEffect } from 'react';

interface OOBEProps {
  onComplete: (pin: string | null) => void;
}

export default function OOBE({ onComplete }: OOBEProps) {
  const [step, setStep] = useState(1);
  const [pin, setPin] = useState('');
  const [progress, setProgress] = useState(0);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; delay: number }>>([]);
  const [selectedWifi, setSelectedWifi] = useState<string | null>(null);
  const [fontSize, setFontSize] = useState<'Маленький' | 'Средний' | 'Крупный'>('Средний');
  const [recommendingPin, setRecommendingPin] = useState(false);
  const [skipPin, setSkipPin] = useState(false);

  // Generate particles
  useEffect(() => {
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 5,
    }));
    setParticles(newParticles);
  }, []);

  const wifiNetworks = [
    { name: 'SpidiFi_Free', signal: 4 },
    { name: 'Wintozo_Guest', signal: 3 },
    { name: 'Android_Hotspot', signal: 5 },
    { name: 'Cafe_Coffee', signal: 2 },
  ];

  // Step 1: Wi-Fi selection
  const selectWifi = (name: string) => {
    setSelectedWifi(name);
  };

  const goToPinRecommendation = () => {
    if (selectedWifi) setStep(2);
  };

  // Step 2: PIN recommendation
  const goToFontSize = () => {
    setRecommendingPin(true);
    setTimeout(() => {
      setStep(3);
      setRecommendingPin(false);
    }, 1500);
  };

  // Step 3: Font size
  const goToAppInstall = () => {
    setStep(4);
  };

  // Step 4: App installation (5 seconds)
  useEffect(() => {
    if (step !== 4) return;
    const start = Date.now();
    const interval = setInterval(() => {
      const passed = Date.now() - start;
      setProgress(Math.min(100, (passed / 5000) * 100));
      if (passed >= 5000) {
        clearInterval(interval);
        setStep(5);
      }
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
      if (passed >= 13000) {
        clearInterval(interval);
        setStep(6);
      }
    }, 200);
    return () => clearInterval(interval);
  }, [step]);

  const finish = () => {
    onComplete(pin || null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
      }}>
      
      {/* Animated background particles */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute w-1 h-1 bg-white/30 rounded-full animate-pulse"
          style={{
            left: `${p.x}%`,
            top: `${(p.id * 15) % 100}%`,
            animationDelay: `${p.delay}s`,
            animationDuration: '3s',
          }}
        />
      ))}

      {/* Gradient orbs */}
      <div className="absolute top-0 left-0 w-96 h-96 rounded-full opacity-30"
        style={{
          background: 'radial-gradient(circle, rgba(102,126,234,0.4), transparent)',
          filter: 'blur(80px)',
          animation: 'float 8s ease-in-out infinite',
        }} />
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full opacity-30"
        style={{
          background: 'radial-gradient(circle, rgba(118,75,162,0.4), transparent)',
          filter: 'blur(80px)',
          animation: 'float 8s ease-in-out infinite reverse',
        }} />

      {/* Main content */}
      <div className="relative z-10 w-full max-w-sm px-6">
        {/* Logo / Icon */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl mb-4"
            style={{
              background: 'linear-gradient(135deg, rgba(102,126,234,0.3), rgba(118,75,162,0.3))',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.1)',
              boxShadow: '0 8px 32px rgba(102,126,234,0.3)',
            }}>
            <span className="text-5xl">🚀</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            {step === 1 && 'Подключение'}
            {step === 2 && 'Безопасность'}
            {step === 3 && 'Отображение'}
            {step === 4 && 'Установка'}
            {step === 5 && 'Обновление'}
            {step === 6 && 'Готово!'}
          </h1>
          <p className="text-white/50 text-sm">
            {step === 1 && 'Выберите сеть Wi-Fi'}
            {step === 2 && 'Защитите ваше устройство'}
            {step === 3 && 'Настройте размер шрифта'}
            {step === 4 && 'Стандартных приложений'}
            {step === 5 && 'Проверка системы'}
            {step === 6 && 'Ваш SpidiPhone настроен'}
          </p>
        </div>

        {/* Step 1: Wi-Fi */}
        {step === 1 && (
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10">
            <div className="space-y-2 mb-4">
              {wifiNetworks.map((network) => (
                <button
                  key={network.name}
                  onClick={() => selectWifi(network.name)}
                  className={`w-full px-4 py-3 rounded-xl flex items-center justify-between transition-all ${
                    selectedWifi === network.name
                      ? 'bg-purple-600 text-white'
                      : 'bg-white/5 text-white/70 hover:bg-white/10'
                  }`}>
                  <div className="flex items-center gap-3">
                    <div className="flex items-end gap-[2px] h-4">
                      {[2,4,6,8].map((h,i) => (
                        <div key={i} className="w-[2px] rounded-[1px]"
                          style={{ height: `${h}px`, background: i < network.signal ? 'currentColor' : 'rgba(255,255,255,0.2)' }} />
                      ))}
                    </div>
                    <span className="font-medium">{network.name}</span>
                  </div>
                  {selectedWifi === network.name && <span className="text-lg">✓</span>}
                </button>
              ))}
            </div>
            <button
              onClick={goToPinRecommendation}
              disabled={!selectedWifi}
              className={`w-full py-4 rounded-2xl font-semibold transition-all ${
                selectedWifi
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg hover:shadow-purple-500/30 active:scale-95'
                  : 'bg-white/5 text-white/30 cursor-not-allowed'
              }`}>
              Далее
            </button>
          </div>
        )}

        {/* Step 2: PIN Recommendation */}
        {step === 2 && (
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10 text-center">
            <div className="mb-6">
              <div className={`text-5xl mb-4 transition-transform ${recommendingPin ? 'animate-bounce' : ''}`}>🔐</div>
              <h2 className="text-white text-lg font-semibold mb-2">Рекомендуем установить PIN</h2>
              <p className="text-white/50 text-sm mb-4">Это защитит ваши данные от несанкционированного доступа</p>
            </div>
            <div className="space-y-3">
              <button
                onClick={() => setStep(3)}
                className="w-full py-4 rounded-2xl font-semibold bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg hover:shadow-purple-500/30 active:scale-95 transition-all">
                Установить PIN
              </button>
              <button
                onClick={() => { setSkipPin(true); setStep(3); }}
                className="w-full py-4 rounded-2xl font-semibold bg-white/5 text-white/70 hover:bg-white/10 transition-all">
                Пропустить
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Font Size */}
        {step === 3 && (
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10">
            <div className="text-center mb-6">
              <div className="text-4xl mb-2">📝</div>
              <h2 className="text-white text-lg font-semibold mb-2">Размер шрифта</h2>
              <p className="text-white/50 text-xs">Выберите удобный размер текста</p>
            </div>
            <div className="space-y-2 mb-6">
              {['Маленький', 'Средний', 'Крупный'].map((size) => (
                <button
                  key={size}
                  onClick={() => setFontSize(size as any)}
                  className={`w-full px-4 py-3 rounded-xl text-left transition-all ${
                    fontSize === size
                      ? 'bg-purple-600 text-white'
                      : 'bg-white/5 text-white/70 hover:bg-white/10'
                  }`}
                  style={{ fontSize: size === 'Маленький' ? '12px' : size === 'Средний' ? '14px' : '18px' }}>
                  {size}
                </button>
              ))}
            </div>
            <button
              onClick={goToAppInstall}
              className="w-full py-4 rounded-2xl font-semibold bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg hover:shadow-purple-500/30 active:scale-95 transition-all">
              Продолжить
            </button>
          </div>
        )}

        {/* Step 4: App Installation */}
        {step === 4 && (
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10 text-center">
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
                style={{
                  background: 'linear-gradient(135deg, rgba(102,126,234,0.3), rgba(118,75,162,0.3))',
                }}>
                <span className="text-3xl">⚙️</span>
              </div>
              <h2 className="text-white text-lg font-semibold mb-2">Установка приложений</h2>
              <p className="text-white/50 text-xs">Камера, Сообщения, Галерея, Музыка...</p>
            </div>
            <div className="relative h-3 bg-white/10 rounded-full overflow-hidden mb-4">
              <div className="h-full bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-300"
                style={{ width: `${progress}%` }} />
            </div>
            <div className="flex justify-center gap-2">
              {[0, 1, 2].map((i) => (
                <div key={i} className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }} />
              ))}
            </div>
            <div className="text-white/40 text-xs mt-4">{Math.round(progress)}%</div>
          </div>
        )}

        {/* Step 5: Update Check */}
        {step === 5 && (
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10 text-center">
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
                style={{
                  background: 'linear-gradient(135deg, rgba(34,197,94,0.3), rgba(16,185,129,0.3))',
                }}>
                <span className="text-3xl">🔄</span>
              </div>
              <h2 className="text-white text-lg font-semibold mb-2">Проверка обновлений</h2>
              <p className="text-white/50 text-xs">Загрузка последних патчей безопасности...</p>
            </div>
            <div className="relative h-3 bg-white/10 rounded-full overflow-hidden mb-4">
              <div className="h-full bg-gradient-to-r from-green-600 to-emerald-600 transition-all duration-300"
                style={{ width: `${progress}%` }} />
            </div>
            <div className="text-white/40 text-xs">{Math.round(progress)}%</div>
          </div>
        )}

        {/* Step 6: Complete */}
        {step === 6 && (
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10 text-center">
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-4"
                style={{
                  background: 'linear-gradient(135deg, rgba(34,197,94,0.3), rgba(16,185,129,0.3))',
                  animation: 'pulse 2s infinite',
                }}>
                <span className="text-4xl">🎉</span>
              </div>
              <h2 className="text-white text-xl font-bold mb-2">Всё готово!</h2>
              <p className="text-white/50 text-sm mb-4">
                {selectedWifi && `📶 ${selectedWifi}`}
                {!skipPin && ' 🔐 PIN установлен'}
                {` 📝 Шрифт: ${fontSize}`}
              </p>
              <div className="bg-white/5 rounded-xl p-3 text-xs text-white/60">
                Система обновлена • Приложения установлены
              </div>
            </div>
            <button
              onClick={finish}
              className="w-full py-4 rounded-2xl font-semibold bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:shadow-lg hover:shadow-green-500/30 active:scale-95 transition-all">
              Начать использование
            </button>
          </div>
        )}

        {/* Progress indicators */}
        <div className="flex justify-center gap-2 mt-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i === step
                  ? 'w-8 bg-gradient-to-r from-purple-500 to-pink-500'
                  : i < step
                  ? 'w-4 bg-purple-500/50'
                  : 'w-2 bg-white/10'
              }`}
            />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(20px, -20px); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.05); opacity: 0.8; }
        }
      `}</style>
    </div>
  );
}

