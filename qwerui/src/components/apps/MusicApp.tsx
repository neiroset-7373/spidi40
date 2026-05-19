import { useState, useRef, useEffect } from 'react';

interface Track {
  id: string;
  name: string;
  artist: string;
  url: string;
}

export default function MusicApp() {
  const [tracks, setTracks] = useState<Track[]>(() => {
    const saved = localStorage.getItem('spidi_music');
    return saved ? JSON.parse(saved) : [];
  });
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      const url = URL.createObjectURL(file);
      const track: Track = {
        id: Date.now() + Math.random().toString(),
        name: file.name.replace(/\.[^/.]+$/, ''),
        artist: 'Локальный файл',
        url,
      };
      setTracks(prev => {
        const updated = [...prev, track];
        localStorage.setItem('spidi_music', JSON.stringify(updated));
        return updated;
      });
    });
  };

  const playTrack = (track: Track) => {
    if (currentTrack?.id === track.id) {
      if (isPlaying) {
        audioRef.current?.pause();
        setIsPlaying(false);
      } else {
        audioRef.current?.play();
        setIsPlaying(true);
      }
    } else {
      setCurrentTrack(track);
      setIsPlaying(true);
      setProgress(0);
    }
  };

  useEffect(() => {
    if (currentTrack && audioRef.current) {
      audioRef.current.src = currentTrack.url;
      audioRef.current.play().catch(() => {});
    }
  }, [currentTrack]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const pct = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(pct || 0);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setProgress(0);
  };

  const deleteTrack = (id: string) => {
    setTracks(prev => {
      const updated = prev.filter(t => t.id !== id);
      localStorage.setItem('spidi_music', JSON.stringify(updated));
      return updated;
    });
    if (currentTrack?.id === id) {
      setCurrentTrack(null);
      setIsPlaying(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-purple-900 via-black to-black text-white p-6">
      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*"
        multiple
        style={{ display: 'none' }}
        onChange={handleFileSelect}
      />

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <span className="text-sm font-medium text-white/80">Теперь играет</span>
        <button onClick={() => fileInputRef.current?.click()}
          className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-lg hover:bg-white/30 transition-all">+</button>
      </div>

      {/* Tracks */}
      <div className="flex-1 overflow-y-auto">
        {tracks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="text-6xl mb-4">🎵</div>
            <div className="text-xl font-semibold mb-2">Нет треков</div>
            <div className="text-white/50 text-sm">Нажмите + чтобы добавить музыку</div>
          </div>
        ) : (
          <div className="space-y-2">
            {tracks.map((track) => (
              <div
                key={track.id}
                onClick={() => playTrack(track)}
                className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${
                  currentTrack?.id === track.id ? 'bg-white/20' : 'bg-white/5 hover:bg-white/10'
                }`}
              >
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                  {currentTrack?.id === track.id && isPlaying ? '⏸' : '▶'}
                </div>
                <div className="flex-1">
                  <div className="font-medium">{track.name}</div>
                  <div className="text-xs text-white/50">{track.artist}</div>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); deleteTrack(track.id); }}
                  className="p-2 text-white/40 hover:text-white"
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Player */}
      {currentTrack && (
        <div className="mt-4 pt-4 border-t border-white/10">
          <div className="text-center mb-3">
            <div className="font-semibold">{currentTrack.name}</div>
            <div className="text-xs text-white/50">{currentTrack.artist}</div>
          </div>
          <div className="mb-3">
            <div className="h-1 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all"
                style={{ width: `${progress}%` }} />
            </div>
          </div>
          <div className="flex justify-center items-center gap-6">
            <button onClick={() => setVolume(v => Math.max(0, v - 0.1))} className="text-white/60 text-xl">🔉</button>
            <button
              onClick={() => currentTrack && playTrack(currentTrack)}
              className="w-14 h-14 rounded-full bg-white text-black flex items-center justify-center text-2xl hover:scale-105 transition-all"
            >
              {isPlaying ? '⏸' : '▶'}
            </button>
            <button onClick={() => setVolume(v => Math.min(1, v + 0.1))} className="text-white/60 text-xl">🔊</button>
          </div>
        </div>
      )}

      <audio ref={audioRef} onTimeUpdate={handleTimeUpdate} onEnded={handleEnded} />
    </div>
  );
}
