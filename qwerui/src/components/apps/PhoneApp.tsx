import { useState, useRef, useEffect } from 'react';

const contacts = [
  { name: 'Spidi', phone: '+7 (999) 123-45-67', color: '#667eea', online: true },
  { name: 'Мама', phone: '+7 (912) 345-67-89', color: '#f093fb', online: false },
  { name: 'Бро', phone: '+7 (900) 111-22-33', color: '#11998e', online: true },
  { name: 'Работа', phone: '+7 (495) 000-00-00', color: '#a8a8a8', online: false },
  { name: 'Доставка', phone: '+7 (800) 555-55-55', color: '#fa709a', online: false },
];

type Tab = 'dial' | 'contacts' | 'recent';

export default function PhoneApp() {
  const [tab, setTab] = useState<Tab>('dial');
  const [dialValue, setDialValue] = useState('');
  const [calling, setCalling] = useState<string | null>(null);
  const [callTime, setCallTime] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleDial = (v: string) => {
    if (dialValue.length < 16) setDialValue(prev => prev + v);
  };
  const handleBackspace = () => setDialValue(prev => prev.slice(0, -1));

  const startCall = (name: string) => {
    setCalling(name);
    setCallTime(0);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setCallTime(s => s + 1), 1000);
  };
  const endCall = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setCalling(null);
    setCallTime(0);
  };

  const formatTime = (s: number) => `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;

  if (calling) {
    const contact = contacts.find(c=>c.name===calling);
    return (
      <div className="h-full flex flex-col items-center justify-between py-10 px-6"
        style={{ background: 'linear-gradient(180deg, #0d2137 0%, #0f0f1a 100%)' }}>
        <div className="flex flex-col items-center gap-4 mt-8">
          <div className="w-24 h-24 rounded-full"
            style={{ background: contact?.color || '#667eea' }} />
          <div className="text-center">
            <div className="text-white text-2xl font-semibold">{calling}</div>
            <div className="text-green-400 text-sm mt-1 font-mono">{formatTime(callTime)}</div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 w-full">
          {[
            { label: 'Без звука' },
            { label: 'Клавиши' },
            { label: 'Громк.' },
            { label: 'Добавить' },
            { label: 'Видео' },
            { label: 'Пауза' },
          ].map(b => (
            <button key={b.label}
              className="flex flex-col items-center gap-1.5 py-3 rounded-2xl transition-all active:scale-90"
              style={{ background: 'rgba(255,255,255,0.08)' }}>
              <span className="text-white/60 text-xs">{b.label}</span>
            </button>
          ))}
        </div>

        <button onClick={endCall}
          className="w-16 h-16 rounded-full flex items-center justify-center text-2xl shadow-lg transition-all active:scale-90"
          style={{ background: 'linear-gradient(135deg, #ff4757, #c0392b)', boxShadow: '0 8px 24px rgba(255,71,87,0.5)' }}>
          ✕
        </button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col" style={{ background: '#0f0f1a' }}>
      {/* Tabs */}
      <div className="flex mx-4 mt-3 mb-1 rounded-2xl overflow-hidden"
        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
        {(['dial', 'contacts', 'recent'] as Tab[]).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className="flex-1 py-2.5 text-sm font-medium transition-all rounded-xl"
            style={{
              color: tab === t ? '#fff' : 'rgba(255,255,255,0.4)',
              background: tab === t ? 'rgba(255,255,255,0.12)' : 'transparent',
            }}>
            {t === 'dial' ? 'Набор' : t === 'contacts' ? 'Контакты' : 'Недавние'}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto">
        {tab === 'dial' && (
          <div className="flex flex-col items-center px-6 pt-4">
            <div className="text-white text-3xl font-light tracking-widest mb-6 min-h-10 font-mono">
              {dialValue || <span className="text-white/30">Введите номер</span>}
            </div>
            <div className="grid grid-cols-3 gap-3 w-full mb-4">
              {['1','2','3','4','5','6','7','8','9','*','0','#'].map(k => (
                <button key={k} onClick={() => handleDial(k)}
                  className="flex flex-col items-center justify-center h-14 rounded-2xl text-white text-xl font-medium transition-all active:scale-90"
                  style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.05)' }}>
                  {k}
                  <span className="text-[8px] text-white/30 mt-0.5 tracking-widest">
                    {{'2':'АБВ','3':'ГДЕ','4':'ЖЗИ','5':'КЛМ','6':'НОП','7':'РСТ','8':'УФХ','9':'ЦЧШ','0':'+'}[k]}
                  </span>
                </button>
              ))}
            </div>
            <div className="flex items-center justify-center gap-6 w-full">
              <div className="w-12" />
              <button onClick={() => dialValue && startCall(dialValue)}
                className="w-16 h-16 rounded-full flex items-center justify-center text-2xl shadow-lg transition-all active:scale-90"
                style={{ background: 'linear-gradient(135deg, #11998e, #38ef7d)', boxShadow: '0 8px 24px rgba(56,239,125,0.4)' }}>
                📞
              </button>
              <button onClick={handleBackspace}
                className="w-12 h-12 rounded-full flex items-center justify-center text-lg transition-all active:scale-90"
                style={{ background: 'rgba(255,255,255,0.08)' }}>
                ⌫
              </button>
            </div>
          </div>
        )}

        {tab === 'contacts' && (
          <div className="px-4 py-2 space-y-1">
            {contacts.map(c => (
              <button key={c.name} onClick={() => startCall(c.name)}
                className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all active:scale-[0.98]"
                style={{ background: 'rgba(255,255,255,0.05)' }}>
                <div className="relative w-12 h-12 rounded-full flex-shrink-0"
                  style={{ background: c.color }}>
                  {c.online && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-gray-900"
                      style={{ background: '#38ef7d' }} />
                  )}
                </div>
                <div className="flex-1 text-left">
                  <div className="text-white font-medium">{c.name}</div>
                  <div className="text-white/40 text-sm">{c.phone}</div>
                </div>
              </button>
            ))}
          </div>
        )}

        {tab === 'recent' && (
          <div className="px-4 py-2 space-y-1">
            {[
              { name: 'Spidi', type: 'входящий', time: '14:32', missed: false },
              { name: 'Бро', type: 'исходящий', time: 'вчера', missed: false },
              { name: 'Мама', type: 'пропущенный', time: 'вчера', missed: true },
              { name: 'Доставка', type: 'входящий', time: 'пн', missed: false },
            ].map((r, i) => {
              const contact = contacts.find(c=>c.name===r.name);
              return (
                <button key={i} onClick={() => startCall(r.name)}
                  className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all active:scale-[0.98]"
                  style={{ background: 'rgba(255,255,255,0.05)' }}>
                  <div className="w-12 h-12 rounded-full flex-shrink-0"
                    style={{ background: contact?.color || (r.missed ? 'rgba(255,71,87,0.4)' : 'rgba(255,255,255,0.1)') }} />
                  <div className="flex-1 text-left">
                    <div className={`font-medium ${r.missed ? 'text-red-400' : 'text-white'}`}>{r.name}</div>
                    <div className="text-white/40 text-sm">{r.type}</div>
                  </div>
                  <span className="text-white/30 text-xs">{r.time}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
