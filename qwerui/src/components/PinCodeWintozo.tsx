import { useState, useEffect } from 'react';

interface PinCodeProps {
  onSuccess: () => void;
  onCancel?: () => void;
  title?: string;
  subtitle?: string;
}

export default function PinCodeWintozo({ onSuccess, onCancel, title = 'Введите PIN', subtitle }: PinCodeProps) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [shaking, setShaking] = useState(false);

  const handleNumber = (num: string) => {
    if (pin.length < 4) {
      setPin(pin + num);
    }
  };

  const handleDelete = () => {
    setPin(pin.slice(0, -1));
  };

  const handleSubmit = () => {
    const savedPin = localStorage.getItem('spidiphone_pin');
    if (!savedPin || pin === savedPin) {
      onSuccess();
    } else {
      setError(true);
      setShaking(true);
      setPin('');
      setTimeout(() => {
        setError(false);
        setShaking(false);
      }, 500);
    }
  };

  // Auto-submit when 4 digits entered
  useEffect(() => {
    if (pin.length === 4) {
      const timer = setTimeout(() => {
        handleSubmit();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [pin]);

  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/95 backdrop-blur-xl">
      {/* Background gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #667eea, transparent)', filter: 'blur(80px)' }} />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #764ba2, transparent)', filter: 'blur(80px)' }} />
      </div>

      {/* Content */}
      <div className={`relative z-10 flex flex-col items-center transition-transform ${shaking ? 'animate-shake' : ''}`}>
        {/* Title */}
        <h2 className="text-white text-2xl font-semibold mb-2">{title}</h2>
        {subtitle && <p className="text-white/50 text-sm mb-8">{subtitle}</p>}

        {/* PIN dots */}
        <div className={`flex gap-4 mb-8 ${error ? 'text-red-400' : ''}`}>
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`w-4 h-4 rounded-full transition-all duration-200 ${
                i < pin.length
                  ? 'bg-white scale-110 shadow-lg shadow-white/30'
                  : 'bg-white/20 scale-100'
              }`}
            />
          ))}
        </div>

        {/* Numpad */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              onClick={() => handleNumber(num.toString())}
              className="w-18 h-18 rounded-full text-white text-2xl font-light transition-all active:scale-85 active:bg-white/25 hover:bg-white/15"
              style={{ background: 'rgba(255,255,255,0.1)' }}
            >
              {num}
            </button>
          ))}
          <button
            onClick={handleDelete}
            className="w-18 h-18 rounded-full text-white/70 text-xl transition-all active:scale-85 active:bg-white/20 hover:bg-white/10 flex items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.08)' }}
          >
            ⌫
          </button>
          <button
            onClick={() => handleNumber('0')}
            className="w-18 h-18 rounded-full text-white text-2xl font-light transition-all active:scale-85 active:bg-white/25 hover:bg-white/15"
            style={{ background: 'rgba(255,255,255,0.1)' }}
          >
            0
          </button>
          <button
            onClick={handleSubmit}
            disabled={pin.length !== 4}
            className={`w-18 h-18 rounded-full text-xl transition-all flex items-center justify-center ${
              pin.length === 4
                ? 'text-white active:scale-85 active:bg-green-500/30 hover:bg-green-500/20'
                : 'text-white/30 cursor-not-allowed'
            }`}
            style={{ background: pin.length === 4 ? 'rgba(34,197,94,0.3)' : 'rgba(255,255,255,0.08)' }}
          >
            ✓
          </button>
        </div>

        {/* Cancel button */}
        {onCancel && (
          <button
            onClick={onCancel}
            className="text-white/40 text-sm hover:text-white/70 transition-colors mt-2"
          >
            Отмена
          </button>
        )}

        {/* Error message */}
        {error && (
          <div className="text-red-400 text-sm mt-4 animate-pulse">
            Неверный PIN. Попробуйте снова.
          </div>
        )}
      </div>

      {/* Biometric hint */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-center">
        <div className="text-white/30 text-xs mb-2">Или используйте отпечаток</div>
        <div className="w-12 h-14 rounded-2xl mx-auto border-2 border-white/20 flex items-center justify-center">
          <div className="w-6 h-8 rounded-full border border-white/30" />
        </div>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
}
