export function getGalleryImages(): string[] {
  return JSON.parse(localStorage.getItem('gallery_images') ?? '[]');
}

export function addGalleryImage(img: string) {
  const imgs = getGalleryImages();
  imgs.push(img);
  localStorage.setItem('gallery_images', JSON.stringify(imgs));
}

export function clearGallery() {
  localStorage.removeItem('gallery_images');
}
