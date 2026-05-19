import { useRef, useState, useEffect } from 'react';

export default function CameraApp() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [flash, setFlash] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, [facingMode]);

  const startCamera = async () => {
    try {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      setError(null);

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });

      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error('Ошибка доступа к камере:', err);
      setError('Камера недоступна. Разрешите доступ в настройках.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const switchCamera = () => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  };

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      setFlash(true);
      setTimeout(() => setFlash(false), 150);

      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      if (context) {
        canvas.width = video.videoWidth || 1280;
        canvas.height = video.videoHeight || 720;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        const photoData = canvas.toDataURL('image/png');
        
        const savedPhotos = localStorage.getItem('spidi_photos');
        const photos = savedPhotos ? JSON.parse(savedPhotos) : [];
        photos.push(photoData);
        localStorage.setItem('spidi_photos', JSON.stringify(photos));

        const link = document.createElement('a');
        link.download = `photo-${Date.now()}.png`;
        link.href = photoData;
        link.click();
      }
    }
  };

  return (
    <div className="h-full flex flex-col bg-black relative">
      <div className="flex-1 relative overflow-hidden">
        {/* Video stream */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="absolute inset-0 w-full h-full object-cover"
          style={{ transform: facingMode === 'user' ? 'scaleX(-1)' : 'none' }}
        />

        {/* Flash effect */}
        {flash && (
          <div className="absolute inset-0 bg-white animate-flash pointer-events-none" />
        )}

        {/* Error overlay */}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-10">
            <div className="text-center text-white p-4">
              <div className="text-4xl mb-2">⚠️</div>
              <div className="text-sm">{error}</div>
              <button onClick={startCamera} className="mt-3 px-4 py-2 bg-white/20 rounded-lg text-sm">
                Повторить
              </button>
            </div>
          </div>
        )}

        {/* Grid overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <div className="w-full h-full grid grid-cols-3 grid-rows-3">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="border border-white/30" />
            ))}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-around py-4 px-8 bg-black">
        <button onClick={() => window.location.href = '#gallery'}
          className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-xl">
          🖼️
        </button>

        <button onClick={takePhoto}
          className="w-16 h-16 rounded-full border-4 border-white flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-white" />
        </button>

        <button onClick={switchCamera}
          className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-xl">
          🔄
        </button>
      </div>

      <canvas ref={canvasRef} style={{ display: 'none' }} />

      <style>{`
        @keyframes flash { 0%, 100% { opacity: 0; } 50% { opacity: 0.7; } }
        .animate-flash { animation: flash 0.15s ease-out; }
      `}</style>
    </div>
  );
}
