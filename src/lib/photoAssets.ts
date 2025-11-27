// Import all generated photos
import carpathians1 from '@/assets/photos/carpathians-1.jpg';
import carpathians2 from '@/assets/photos/carpathians-2.jpg';
import lviv1 from '@/assets/photos/lviv-1.jpg';
import lviv2 from '@/assets/photos/lviv-2.jpg';
import odesa1 from '@/assets/photos/odesa-1.jpg';
import birthday1 from '@/assets/photos/birthday-1.jpg';
import newyear1 from '@/assets/photos/newyear-1.jpg';
import wedding1 from '@/assets/photos/wedding-1.jpg';
import conference1 from '@/assets/photos/conference-1.jpg';
import office1 from '@/assets/photos/office-1.jpg';
import photography1 from '@/assets/photos/photography-1.jpg';
import cooking1 from '@/assets/photos/cooking-1.jpg';

// Map album IDs to their photo arrays
export const albumPhotos: Record<string, string[]> = {
  'album-1': [carpathians1, carpathians2], // Карпати
  'album-2': [lviv1, lviv2], // Львів
  'album-3': [odesa1], // Одеса
  'album-4': [birthday1], // День народження
  'album-5': [newyear1], // Новий рік
  'album-6': [wedding1], // Весілля
  'album-7': [conference1], // Конференція 2024
  'album-8': [office1], // Офіс
  'album-9': [photography1], // Фотографія
  'album-10': [cooking1], // Кулінарія
};

// Get a photo for an album and index
export function getPhotoForAlbum(albumId: string, index: number): string {
  const photos = albumPhotos[albumId];
  if (!photos || photos.length === 0) {
    return `https://picsum.photos/seed/${albumId}-${index}/800/600`;
  }
  // Cycle through available photos
  return photos[index % photos.length];
}
