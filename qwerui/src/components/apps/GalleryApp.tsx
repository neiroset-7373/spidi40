import { useState, useEffect } from 'react';
import '../../styles/GalleryApp.css';

export default function GalleryApp() {
  const [photos, setPhotos] = useState<string[]>(() => {
    const saved = localStorage.getItem('spidi_photos');
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  const handleDeletePhoto = (photo: string) => {
    const newPhotos = photos.filter(p => p !== photo);
    setPhotos(newPhotos);
    localStorage.setItem('spidi_photos', JSON.stringify(newPhotos));
    setSelectedPhoto(null);
  };

  const handleClearAll = () => {
    setPhotos([]);
    localStorage.removeItem('spidi_photos');
    setSelectedPhoto(null);
  };

  if (selectedPhoto) {
    return (
      <div className="gallery-app">
        <div className="photo-viewer">
          <img src={selectedPhoto} alt="Фото" className="full-photo" />
        </div>
        <div className="photo-actions">
          <button className="action-btn" onClick={() => setSelectedPhoto(null)}>← Назад</button>
          <button className="action-btn delete" onClick={() => handleDeletePhoto(selectedPhoto)}>🗑️ Удалить</button>
        </div>
      </div>
    );
  }

  return (
    <div className="gallery-app">
      <div className="gallery-header">
        <span className="gallery-title">Галерея</span>
        {photos.length > 0 && (
          <button className="clear-all" onClick={handleClearAll}>🗑️</button>
        )}
      </div>
      <div className="gallery-content">
        {photos.length === 0 ? (
          <div className="empty-gallery">
            <span className="empty-icon">🖼️</span>
            <span className="empty-text">Нет фотографий</span>
            <span className="empty-subtext">Сделайте снимок с помощью камеры</span>
          </div>
        ) : (
          <div className="photo-grid">
            {photos.map((photo, index) => (
              <div
                key={index}
                className="photo-item"
                onClick={() => setSelectedPhoto(photo)}
              >
                <img src={photo} alt={`Фото ${index + 1}`} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
