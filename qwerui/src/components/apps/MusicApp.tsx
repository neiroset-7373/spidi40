import { useState, useRef } from 'react';

export default function MusicApp() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string>('Выберите трек');
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('audio/')) {
      setSelectedFile(file);
      setSelectedFileName(file.name);
      if (audioRef.current) {
        audioRef.current.src = URL.createObjectURL(file);
        audioRef.current.load();
      }
    }
  };

  const togglePlay = () => {
    if (!selectedFile) return;
    if (isPlaying) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play().catch(e => console.error('Playback failed:', e));
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-purple-900 via-black to-black text-white p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <button className="text-white/60 text-2xl">‹</button>
        <span className="text-sm font-medium">Теперь играет</span>
        <button className="text-white/60 text-xl">…</button>
      </div>

      {/* File Input */}
      <div className="mb-6">
        <label className="flex items-center gap-3 px-4 py-3 bg-white/20 rounded-xl cursor-pointer hover:bg-white/30 transition-all">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center text-white font-bold">
            🎵
          </div>
          <div className="flex-1 text-left">
            <div className="font-medium text-white">{selectedFileName}</div>
            <div className="text-sm text-white/60">Нажмите, чтобы выбрать трек</div>
          </div>
          <div className="text-white/40">›</div>
        </label>
        <input
          type="file"
          accept="audio/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {/* Album Art */}
      <div className="flex-1 flex items-center justify-center mb-8">
        <div className="w-64 h-64 rounded-2xl overflow-hidden shadow-2xl"
          style={{
            background: 'linear-gradient(135deg, #7c3aed, #2563eb)',
            boxShadow: '0 20px 60px rgba(124, 58, 237, 0.4)'
          }}>
          <img src="/wintophone/spidiphone_icons/src/public/system_icons/music_app.jpg" alt="Album" className="w-full h-full object-cover" />
        </div>
      </div>

      {/* Song Info */}
      <div className="text-center mb-8">
        <h2 className="text-xl font-semibold mb-2">{selectedFileName}</h2>
        <p className="text-white/60">Музыкальное приложение Spidios</p>
      </div>

      {/* Progress */}
      <div className="mb-6">
        <div className="h-1 bg-white/20 rounded-full overflow-hidden mb-2">
          <div className="h-full bg-white rounded-full transition-all duration-100"
            style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }} />
        </div>
        <div className="flex justify-between text-xs text-white/40">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center items-center gap-8 mb-8">
        <button className="text-white/60 text-2xl">⏮</button>
        <button
          onClick={togglePlay}
          disabled={!selectedFile}
          className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center text-2xl hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPlaying ? '⏸' : '▶'}
        </button>
        <button className="text-white/60 text-2xl">⏭</button>
      </div>

      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
      />
    </div>
  );
}