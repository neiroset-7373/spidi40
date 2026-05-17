import { useState, useRef } from 'react';

interface Photo {
  id: string;
  url: string;
  file: File;
  date: string;
}

type GalleryView = 'grid' | 'albums' | 'detail';

export default function GalleryApp() {
  const [view, setView] = useState<GalleryView>('grid');
  const [selected, setSelected] = useState<Photo | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [tab, setTab] = useState<'grid' | 'albums'>('grid');
  const [liked, setLiked] = useState<Set<string>>(new Set());
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const validFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
    const newPhotos: Photo[] = validFiles.map(file => ({
      id: URL.createObjectURL(file), // используем URL как ID
      url: URL.createObjectURL(file),
      file,
      date: new Date().toLocaleDateString('ru-RU'),
    }));
    setPhotos(prev => [...newPhotos, ...prev]);
  };

  const openPhoto = (photo: Photo) => {
    setSelected(photo);
    setView('detail');
  };

  const closePhoto = () => {
    setSelected(null);
    setView('grid');
  };

  const toggleLike = (id: string) => {
    setLiked(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  if (view === 'detail' && selected) {
    return (
      <div className="h-full flex flex-col" style={{ background: '#000' }}>
        <div className="flex-1 flex items-center justify-center relative">
          {/* Photo detail */}
          <div className="w-full h-full flex items-center justify-center">
            <img src={selected.url} alt="Photo" className="max-w-full max-h-full object-contain" />
          </div>
        </div>

        {/* Bottom controls */}
        <div className="flex items-center justify-between px-8 py-4 flex-shrink-0"
          style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(20px)' }}>
          <button onClick={closePhoto}
            className="w-12 h-12 rounded-full flex items-center justify-center text-xl transition-all active:scale-90"
            style={{ background: 'rgba(255,255,255,0.1)' }}>
            ✕
          </button>
          <button onClick={() => toggleLike(selected.id)}
            className="w-12 h-12 rounded-full flex items-center justify-center text-xl transition-all active:scale-90"
            style={{ background: liked.has(selected.id) ? 'rgba(255,71,87,0.5)' : 'rgba(255,255,255,0.1)' }}>
            {liked.has(selected.id) ? '❤️' : '🤍'}
          </button>
          <button className="w-12 h-12 rounded-full flex items-center justify-center text-xl transition-all active:scale-90"
            style={{ background: 'rgba(255,255,255,0.1)' }} />
          <button
            onClick={() => {
              const a = document.createElement('a');
              a.href = selected.url;
              a.download = selected.file.name;
              a.click();
            }}
            className="w-12 h-12 rounded-full flex items-center justify-center text-xl transition-all active:scale-90"
            style={{ background: 'rgba(255,71,87,0.2)' }}>
            ↓
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col" style={{ background: '#0f0f1a' }}>
      {/* Tabs */}
      <div className="flex mx-4 mt-3 mb-3 rounded-2xl overflow-hidden flex-shrink-0"
        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
        {(['grid', 'albums'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className="flex-1 py-2.5 text-sm font-medium transition-all rounded-xl"
            style={{
              color: tab === t ? '#fff' : 'rgba(255,255,255,0.4)',
              background: tab === t ? 'rgba(255,255,255,0.12)' : 'transparent',
            }}>
            {t === 'grid' ? '⊞ Все фото' : '📁 Альбомы'}
          </button>
        ))}
      </div>

      {/* Add Photos Button */}
      <div className="mx-4 mb-4">
        <button
          onClick={triggerFileInput}
          className="w-full py-3 px-4 rounded-2xl font-medium flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
          style={{
            background: 'linear-gradient(135deg, #4facfe, #00f2fe)',
            color: '#fff',
          }}>
          ➕ Добавить фото
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      <div className="flex-1 overflow-y-auto px-4">
        {tab === 'grid' ? (
          <>
            {photos.length === 0 ? (
              <div className="text-center py-16 text-white/50">
                <div className="text-6xl mb-4">📸</div>
                <div className="text-lg">Нет фото</div>
                <div className="text-sm">Нажмите "Добавить фото"</div>
              </div>
            ) : (
              <div className="space-y-4 pb-4">
                {/* Group photos by date */}
                {['Сегодня', 'Вчера', 'На этой неделе', 'Ранее'].map(group => {
                  const today = new Date();
                  const yesterday = new Date(today);
                  yesterday.setDate(yesterday.getDate() - 1);
                  const thisWeek = new Date(today);
                  thisWeek.setDate(thisWeek.getDate() - 7);

                  const groupPhotos = photos.filter(photo => {
                    const photoDate = new Date(photo.date);
                    switch (group) {
                      case 'Сегодня':
                        return photoDate.toDateString() === today.toDateString();
                      case 'Вчера':
                        return photoDate.toDateString() === yesterday.toDateString();
                      case 'На этой неделе':
                        return photoDate >= thisWeek;
                      case 'Ранее':
                        return photoDate < thisWeek;
                      default:
                        return false;
                    }
                  });

                  if (groupPhotos.length === 0) return null;

                  return (
                    <div key={group} className="mb-4">
                      <div className="text-white/50 text-sm font-medium mb-2">{group}</div>
                      <div className="grid grid-cols-3 gap-1">
                        {groupPhotos.map(photo => (
                          <button key={photo.id} onClick={() => openPhoto(photo)}
                            className="aspect-square rounded-xl transition-all active:scale-95 overflow-hidden relative"
                            style={{
                              boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.1)',
                            }}>
                            <img src={photo.url} alt="Photo" className="w-full h-full object-cover" />
                            {liked.has(photo.id) && (
                              <div className="absolute top-1 right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs"
                                style={{ background: '#ff4757' }}>
                                ❤️
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        ) : (
          <div className="space-y-3 pb-4">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-4 text-white">
              <div className="font-bold text-lg">Все фото</div>
              <div className="text-blue-100">{photos.length} изображений</div>
            </div>
            <div className="bg-gradient-to-r from-green-500 to-teal-500 rounded-2xl p-4 text-white">
              <div className="font-bold text-lg">Избранное</div>
              <div className="text-green-100">{liked.size} отмечено</div>
            </div>
            <div className="bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl p-4 text-white">
              <div className="font-bold text-lg">Снимки экрана</div>
              <div className="text-red-100">Пока нет</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}