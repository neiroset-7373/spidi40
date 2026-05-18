import { useState, useEffect } from 'react';

interface OOBEProps {
  onComplete: (pin: string | null) => void;
}

export default function OOBE({ onComplete }: OOBEProps) {
  const [step, setStep] = useState(1);
  const [pin, setPin] = useState('');
  const [progress, setProgress] = useState(0);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; delay: number }>>([]);

  // Generate particles
  useEffect(() => {
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 5,
    }));
    setParticles(newParticles);
  }, []);

  const isPinValid = pin.length === 0 || pin.length === 4;
  const goInstall = () => {
    if (isPinValid) setStep(2);
  };

  useEffect(() => {
    if (step !== 2) return;
    const start = Date.now();
    const interval = setInterval(() => {
      const passed = Date.now() - start;
      setProgress(Math.min(100, (passed / 10000) * 100));
      if (passed >= 10000) {
        clearInterval(interval);
        setStep(3);
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
          <h1 className="text-3xl font-bold text-white mb-2">Добро пожаловать</h1>
          <p className="text-white/50 text-sm">Настройте ваш SpidiPhone</p>
        </div>

        {/* Step 1: PIN */}
        {step === 1 && (
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10">
            <div className="text-center mb-6">
              <h2 className="text-white text-lg font-semibold mb-2">Защита устройства</h2>
              <p className="text-white/50 text-xs">Установите PIN-код для разблокировки (можно пропустить)</p>
            </div>

            <div className="flex justify-center gap-3 mb-6">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    i < pin.length
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 scale-110'
                      : 'bg-white/10'
                  }`}
                />
              ))}
            </div>

            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
              placeholder="••••"
              maxLength={4}
              className="w-full px-4 py-4 bg-white/5 text-white text-center text-3xl tracking-[0.5em] rounded-2xl border border-white/10 focus:border-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all mb-4"
            />

            <button
              onClick={goInstall}
              disabled={!isPinValid}
              className={`w-full py-4 rounded-2xl font-semibold transition-all ${
                isPinValid
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg hover:shadow-purple-500/30 active:scale-95'
                  : 'bg-white/5 text-white/30 cursor-not-allowed'
              }`}
            >
              Продолжить
            </button>

            <p className="text-center text-white/30 text-xs mt-4">
              Нажмите "Продолжить" без PIN для пропуска
            </p>
          </div>
        )}

        {/* Step 2: Installation */}
        {step === 2 && (
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10 text-center">
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
                style={{
                  background: 'linear-gradient(135deg, rgba(102,126,234,0.3), rgba(118,75,162,0.3))',
                }}>
                <span className="text-3xl">⚙️</span>
              </div>
              <h2 className="text-white text-lg font-semibold mb-2">Установка приложений</h2>
              <p className="text-white/50 text-xs">Пожалуйста, подождите...</p>
            </div>

            {/* Progress bar */}
            <div className="relative h-2 bg-white/10 rounded-full overflow-hidden mb-4">
              <div
                className="h-full bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-300 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Loading dots */}
            <div className="flex justify-center gap-2">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>

            {/* Progress percentage */}
            <div className="text-white/40 text-xs mt-4">{Math.round(progress)}%</div>
          </div>
        )}

        {/* Step 3: Complete */}
        {step === 3 && (
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
              <p className="text-white/50 text-sm">Ваш SpidiPhone настроен и готов к использованию</p>
            </div>

            <button
              onClick={finish}
              className="w-full py-4 rounded-2xl font-semibold bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:shadow-lg hover:shadow-green-500/30 active:scale-95 transition-all"
            >
              Начать использование
            </button>
          </div>
        )}

        {/* Progress indicators */}
        <div className="flex justify-center gap-2 mt-6">
          {[1, 2, 3].map((i) => (
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

