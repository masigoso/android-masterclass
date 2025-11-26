import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';

export interface GalleryPhoto {
  filepath: string;
  webviewPath?: string;
  timestamp: number;
}

export function usePhotoGallery() {
  async function pickPhotosFromGallery(): Promise<GalleryPhoto[]> {
    try {
      // Request photos from gallery
      const images = await Camera.pickImages({
        quality: 90,
      });

      const photos: GalleryPhoto[] = [];

      for (const image of images.photos) {
        // Read the file to get creation date and data
        const base64Data = image.webPath || image.path;
        
        if (base64Data) {
          photos.push({
            filepath: image.path || '',
            webviewPath: base64Data,
            timestamp: Date.now(), // Capacitor doesn't provide EXIF data directly
          });
        }
      }

      return photos;
    } catch (error) {
      console.error('Error picking photos:', error);
      return [];
    }
  }

  async function takePhoto(): Promise<GalleryPhoto | null> {
    try {
      const photo = await Camera.getPhoto({
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera,
        quality: 90,
      });

      return {
        filepath: photo.path || '',
        webviewPath: photo.webPath,
        timestamp: Date.now(),
      };
    } catch (error) {
      console.error('Error taking photo:', error);
      return null;
    }
  }

  return {
    pickPhotosFromGallery,
    takePhoto,
  };
}
