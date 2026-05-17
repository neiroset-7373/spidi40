import { useState, useEffect } from 'react';

interface LockScreenProps {
  onUnlock: () => void;
}

export default function LockScreen({ onUnlock }: LockScreenProps) {
  const [time, setTime] = useState(new Date());
  const [swiping, setSwiping] = useState(false);
  const [swipeY, setSwipeY] = useState(0);
  const [startY, setStartY] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const formatTime = (d: Date) =>
    d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit', hour12: false });

  const formatDate = (d: Date) =>
    d.toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' });

  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    const y = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    setStartY(y);
    setSwiping(true);
  };

  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!swiping) return;
    const y = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    const delta = startY - y;
    if (delta > 0) setSwipeY(Math.min(delta, 200));
  };

  const handleTouchEnd = () => {
    if (swipeY > 80) {
      onUnlock();
    } else {
      setSwipeY(0);
    }
    setSwiping(false);
  };

  return (
    <div
      className="relative w-full h-full flex flex-col items-center select-none overflow-hidden"
      onMouseDown={handleTouchStart}
      onMouseMove={handleTouchMove}
      onMouseUp={handleTouchEnd}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{
        background: 'linear-gradient(180deg, #0a0520 0%, #150a30 50%, #1a0a40 100%)',
        transform: `translateY(-${swipeY * 0.3}px)`,
        transition: swiping ? 'none' : 'transform 0.4s cubic-bezier(0.34,1.56,0.64,1)',
      }}>

      {/* Overlay */}
      <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.2)' }} />

      {/* Status bar */}
      <div className="relative z-10 w-full flex justify-between items-center px-8 pt-14 pb-2 text-white text-sm font-medium">
        <span style={{ fontVariantNumeric: 'tabular-nums' }}>{formatTime(time)}</span>
        <div className="flex items-center gap-1.5">
          {/* Signal */}
          <div className="flex items-end gap-[2px] h-4">
            {[3,5,7,9].map((h,i) => (
              <div key={i} className="w-[3px] rounded-[1px]"
                style={{ height: `${h}px`, background: i < 3 ? '#fff' : 'rgba(255,255,255,0.4)' }} />
            ))}
          </div>
          {/* WiFi */}
          <svg width="16" height="12" viewBox="0 0 24 18" fill="none">
            <path d="M12 14.5a2 2 0 110 4 2 2 0 010-4z" fill="white"/>
            <path d="M7 10.5C8.7 8.8 10.2 8 12 8s3.3.8 5 2.5" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none"/>
            <path d="M3 6.5C6.1 3.3 8.9 2 12 2s5.9 1.3 9 4.5" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none"/>
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

      {/* Time */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center -mt-16">
        <div className="text-white font-thin tracking-tight mb-2"
          style={{ fontSize: '88px', lineHeight: 1, textShadow: '0 4px 30px rgba(0,0,0,0.5)' }}>
          {formatTime(time)}
        </div>
        <div className="text-white/80 text-lg font-light capitalize tracking-wide"
          style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
          {formatDate(time)}
        </div>

        {/* Notification cards */}
        <div className="mt-8 w-72 space-y-2">
          <div className="rounded-2xl px-4 py-3 flex items-center gap-3"
            style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.2)' }}>
            <div className="w-8 h-8 rounded-xl flex items-center justify-center text-lg"
              style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }} />
            <div className="flex-1 min-w-0">
              <div className="text-white text-xs font-medium">Сообщения</div>
              <div className="text-white/70 text-xs truncate">Spidi: Привет, как дела?</div>
            </div>
            <div className="text-white/50 text-xs">сейчас</div>
          </div>
        </div>
      </div>

      {/* Swipe hint */}
      <div className="relative z-10 pb-10 flex flex-col items-center gap-3"
        style={{
          opacity: Math.max(0, 1 - swipeY / 60),
          transform: `translateY(-${swipeY * 0.5}px)`,
          transition: swiping ? 'none' : 'all 0.4s ease',
        }}>
        <div className="w-8 h-1 rounded-full bg-white/50" />
        <p className="text-white/60 text-sm font-light tracking-widest">ПОТЯНИТЕ ВВЕРХ</p>
      </div>
    </div>
  );
}
