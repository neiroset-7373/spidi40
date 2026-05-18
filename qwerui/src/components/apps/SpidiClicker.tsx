import {} from 'react';

export default function SpidiClicker() {
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

