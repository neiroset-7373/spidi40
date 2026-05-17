import { useEffect } from 'react';

export default function SpidiClicker() {
  // При монтировании сразу переходим на внешний кликер
  useEffect(() => {
    window.location.href = 'https://clicker31.vercel.app/';
  }, []);

  return null;

  return (
    <div className="h-full w-full relative" style={{ background: '#000' }}>
      <iframe
        src="https://clicker31.vercel.app/"
        className="w-full h-full border-0"
        title="Spidi Clicker"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
      />
    </div>
  );
}
