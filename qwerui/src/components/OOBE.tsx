import { useState, useEffect } from 'react';

interface OOBEProps {
  onComplete: (pin: string | null) => void;
}

export default function OOBE({ onComplete }: OOBEProps) {
  const [step, setStep] = useState(1);
  const [pin, setPin] = useState('');
  const [progress, setProgress] = useState(0);

  /* ---------- Шаг 1 – ввод PIN ---------- */
  const isPinValid = pin.length === 0 || pin.length === 4;
  const goInstall = () => {
    if (isPinValid) setStep(2);
  };

  /* ---------- Шаг 2 – имитация установки (10 сек) ---------- */
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

  /* ---------- Шаг 3 – завершение ---------- */
  const finish = () => {
    onComplete(pin || null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-indigo-900 to-indigo-950">
      <div className="rounded-xl bg-white/10 backdrop-blur-2xl p-8 w-80 text-center">
        {/* ---------- STEP 1: PIN ---------- */}
        {step === 1 && (
          <>
            <h2 className="mb-4 font-semibold text-sm text-white">Введите PIN‑код (4 цифры). Можно пропустить.</h2>
            <input
              type="password"
              value={pin}
              onChange={e => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
              placeholder="____"
              maxLength={4}
              className="w-full px-2 py-3 bg-indigo-400/20 text-white rounded text-center text-2xl tracking-widest"
            />
            <button
              onClick={goInstall}
              disabled={!isPinValid}
              className={`mt-4 w-full py-2 rounded ${isPinValid ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-indigo-400/30 text-white/50 cursor-not-allowed'}`}
            >
              Далее
            </button>
          </>
        )}

        {/* ---------- STEP 2: Установка ---------- */}
        {step === 2 && (
          <>
            <h2 className="mb-4 font-semibold text-sm text-white">Установка стандартных приложений…</h2>
            <div className="bg-indigo-400/20 rounded-full h-2 w-full overflow-hidden">
              <div className="h-full bg-indigo-600 transition-all" style={{ width: `${progress}%` }} />
            </div>
          </>
        )}

        {/* ---------- STEP 3: Готово ---------- */}
        {step === 3 && (
          <>
            <h2 className="mb-4 font-semibold text-sm text-white">Готово! 🎉</h2>
            <button
              onClick={finish}
              className="w-full py-2 bg-indigo-600 rounded text-white hover:bg-indigo-700"
            >
              Начать
            </button>
          </>
        )}
      </div>
    </div>
  );
}

