import { useRef, useState, useEffect } from 'react';
import '../../styles/Camera.css';

export default function CameraApp() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, [facingMode]);

  const startCamera = async () => {
    try {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }

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
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
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
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0);

        const photoData = canvas.toDataURL('image/png');
        
        // Сохраняем в галерею
        const savedPhotos = localStorage.getItem('spidi_photos');
        const photos = savedPhotos ? JSON.parse(savedPhotos) : [];
        photos.push(photoData);
        localStorage.setItem('spidi_photos', JSON.stringify(photos));

        // Скачиваем файл
        const link = document.createElement('a');
        link.download = `photo-${Date.now()}.png`;
        link.href = photoData;
        link.click();
      }
    }
  };

  return (
    <div className="camera-app">
      <div className="camera-viewfinder">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="camera-video"
        />
        <canvas ref={canvasRef} style={{ display: 'none' }} />
        {flash && <div className="camera-flash" />}
      </div>

      <div className="camera-controls">
        <button className="camera-button gallery-btn" onClick={() => window.location.href = '#gallery'}>
          <span>🖼️</span>
        </button>
        <button className="camera-button shutter-btn" onClick={takePhoto}>
          <div className="shutter-inner" />
        </button>
        <button className="camera-button switch-btn" onClick={switchCamera}>
          <span>🔄</span>
        </button>
      </div>

      <div className="camera-header">
        <span className="camera-mode">Фото</span>
      </div>
    </div>
  );
}
