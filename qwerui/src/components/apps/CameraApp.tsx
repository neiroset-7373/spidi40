import { useState, useRef, useEffect } from 'react';
import { addGalleryImage } from '../../utils/gallery';

type CameraMode = 'фото' | 'видео';

export default function CameraApp() {
  const [mode, setMode] = useState<CameraMode>('фото');
  const [flash, setFlash] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [shutter, setShutter] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastPhoto, setLastPhoto] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const zoomLevels = [1, 2, 5];

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            facingMode: 'user',
            width: { ideal: 1920 },
            height: { ideal: 1080 }
          } 
        });
        setStream(stream);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error('Camera error:', err);
        setError('Камера недоступна. Проверьте разрешения.');
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const takePhoto = () => {
    if (!canvasRef.current || !videoRef.current) return;
    
    setShutter(true);
    setTimeout(() => setShutter(false), 150);

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
    
    const video = videoRef.current;
    canvasRef.current.width = video.videoWidth || 1920;
    canvasRef.current.height = video.videoHeight || 1080;
    
    ctx.drawImage(video, 0, 0, canvasRef.current.width, canvasRef.current.height);
    const photoDataUrl = canvasRef.current.toDataURL('image/jpeg', 0.9);
    setLastPhoto(photoDataUrl);
    
    // Сохраняем в галерею
    try {
      addGalleryImage(photoDataUrl);
      console.log('Photo saved to gallery');
    } catch (e) {
      console.error('Failed to save to gallery:', e);
    }
  };

  const downloadPhoto = () => {
    if (!lastPhoto) return;
    const a = document.createElement('a');
    a.href = lastPhoto;
    a.download = `photo-${Date.now()}.jpg`;
    a.click();
  };

  return (
    <div className="h-full flex flex-col w-full" style={{ background: '#000' }}>
      {/* Viewfinder */}
      <div className="flex-1 relative overflow-hidden w-full">
        {/* Shutter flash */}
        <div className="absolute inset-0 z-30 pointer-events-none transition-opacity duration-100"
          style={{ background: '#fff', opacity: shutter ? 0.8 : 0 }} />

        {/* Video stream */}
        {stream && videoRef.current && (
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            style={{
              width: '100%', 
              height: '100%', 
              objectFit: 'cover',
              transform: 'scaleX(-1)'
            }}
          />
        )}

        {/* Error overlay */}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-black text-white p-4 text-center z-40">
            <div>
              <div className="text-red-500 text-xl mb-2">⚠️ Ошибка</div>
              <div className="text-sm">{error}</div>
            </div>
          </div>
        )}

        {/* Grid lines */}
        <div className="absolute inset-0 pointer-events-none z-10" style={{ opacity: 0.15 }}>
          <div className="absolute inset-0 grid grid-cols-3 grid-rows-3">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="border border-white/30" />
            ))}
          </div>
        </div>

        {/* Top controls */}
        <div className="absolute top-4 left-0 right-0 flex justify-between items-center px-4 z-20">
          <button onClick={() => setFlash(!flash)}
            className="w-10 h-10 rounded-full flex items-center justify-center text-sm transition-all active:scale-90"
            style={{ background: flash ? 'rgba(255,220,0,0.3)' : 'rgba(0,0,0,0.5)', backdropFilter: 'blur(10px)' }}>
            ⚡
          </button>

          <div className="px-3 py-1 rounded-full text-white text-xs font-medium"
            style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(10px)' }}>
            {zoom}x
          </div>

          <div className="w-10 h-10" />
        </div>

        {/* Zoom controls */}
        <div className="absolute bottom-20 left-0 right-0 flex justify-center gap-2 z-20">
          {zoomLevels.map(z => (
            <button key={z} onClick={() => setZoom(z)}
              className="px-3 py-1.5 rounded-full text-sm font-medium transition-all active:scale-90"
              style={{
                background: zoom === z ? 'rgba(255,220,0,0.9)' : 'rgba(0,0,0,0.6)',
                color: zoom === z ? '#000' : '#fff',
                backdropFilter: 'blur(10px)',
              }}>
              {z}×
            </button>
          ))}
        </div>
      </div>

      {/* Mode selector */}
      <div className="flex justify-center gap-4 py-3 flex-shrink-0"
        style={{ background: '#111' }}>
        {['фото', 'видео'].map(m => (
          <button key={m} onClick={() => setMode(m as CameraMode)}
            className="px-4 py-1.5 text-sm font-medium rounded-full transition-all"
            style={{
              color: mode === m ? '#fff' : 'rgba(255,255,255,0.35)',
              background: mode === m ? 'rgba(255,255,255,0.12)' : 'transparent',
            }}>
            {m.charAt(0).toUpperCase() + m.slice(1)}
          </button>
        ))}
      </div>

      {/* Camera controls */}
      <div className="flex items-center justify-between px-6 py-4 flex-shrink-0"
        style={{ background: '#000' }}>

        {/* Last photo thumbnail */}
        <button
          onClick={downloadPhoto}
          disabled={!lastPhoto}
          className="w-12 h-12 rounded-xl overflow-hidden relative border-2 transition-all"
          style={{
            borderColor: lastPhoto ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)',
          }}>
          {lastPhoto ? (
            <img src={lastPhoto} alt="Last" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs">
              📷
            </div>
          )}
        </button>

        {/* Shutter */}
        <button
          onClick={takePhoto}
          disabled={!stream}
          className="transition-all active:scale-90"
          style={{ outline: 'none' }}>
          <div className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.15)', border: '3px solid rgba(255,255,255,0.4)' }}>
            <div className="w-12 h-12 rounded-full"
              style={{ background: '#fff' }} />
          </div>
        </button>

        {/* Gallery shortcut */}
        <button
          onClick={() => window.location.href = '#gallery'}
          className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-all active:scale-90"
          style={{ background: 'rgba(255,255,255,0.1)', border: '2px solid rgba(255,255,255,0.1)' }}>
          🖼️
        </button>
      </div>

      {/* Hidden canvas for photo capture */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}