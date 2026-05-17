import { useEffect, useState } from 'react';

interface BootScreenProps {
  onComplete: () => void;
}

export default function BootScreen({ onComplete }: BootScreenProps) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
      setTimeout(onComplete, 500);
    }, 11000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      className="absolute inset-0 transition-opacity duration-500"
      style={{
        opacity: show ? 1 : 0,
        pointerEvents: show ? 'auto' : 'none',
      }}>
      <img
        src="/photo_pri_Zapuske.jpg"
        alt="SpidiPhone"
        className="w-full h-full object-cover"
      />
    </div>
  );
}