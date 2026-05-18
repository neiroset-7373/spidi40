import { useState, useRef, useEffect } from 'react';
import '../../styles/MusicApp.css';

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
    <div className="music-app">
      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*"
        multiple
        style={{ display: 'none' }}
        onChange={handleFileSelect}
      />

      <div className="music-content">
        {tracks.length === 0 ? (
          <div className="empty-music">
            <span className="empty-icon">🎵</span>
            <span className="empty-text">Нет треков</span>
            <span className="empty-subtext">Нажмите + чтобы добавить музыку</span>
          </div>
        ) : (
          <div className="track-list">
            {tracks.map((track) => (
              <div
                key={track.id}
                className={`track-item ${currentTrack?.id === track.id ? 'active' : ''}`}
                onClick={() => playTrack(track)}
              >
                <div className="track-play">
                  {currentTrack?.id === track.id && isPlaying ? '⏸' : '▶'}
                </div>
                <div className="track-info">
                  <span className="track-name">{track.name}</span>
                  <span className="track-artist">{track.artist}</span>
                </div>
                <button
                  className="track-delete"
                  onClick={(e) => { e.stopPropagation(); deleteTrack(track.id); }}
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {currentTrack && (
        <div className="music-player">
          <div className="player-info">
            <span className="player-name">{currentTrack.name}</span>
            <span className="player-artist">{currentTrack.artist}</span>
          </div>
          <div className="player-progress">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>
          <div className="player-controls">
            <button className="player-btn" onClick={() => setVolume(v => Math.max(0, v - 0.1))}>🔉</button>
            <button className="player-btn play-btn" onClick={() => currentTrack && playTrack(currentTrack)}>
              {isPlaying ? '⏸' : '▶'}
            </button>
            <button className="player-btn" onClick={() => setVolume(v => Math.min(1, v + 0.1))}>🔊</button>
          </div>
        </div>
      )}

      <button className="add-music-btn" onClick={() => fileInputRef.current?.click()}>+</button>

      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
      />
    </div>
  );
}
