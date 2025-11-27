export interface GalleryPhoto {
  filepath: string;
  webviewPath?: string;
  timestamp: number;
}

export function usePhotoGallery() {
  async function pickPhotosFromGallery(): Promise<GalleryPhoto[]> {
    return new Promise((resolve) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.multiple = true;
      
      input.onchange = async (e) => {
        const files = (e.target as HTMLInputElement).files;
        if (!files) {
          resolve([]);
          return;
        }

        const photos: GalleryPhoto[] = [];

        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          
          try {
            const base64 = await fileToBase64(file);
            const timestamp = file.lastModified || Date.now();
            
            photos.push({
              filepath: file.name,
              webviewPath: base64,
              timestamp: timestamp,
            });
          } catch (error) {
            console.error('Error reading file:', error);
          }
        }

        resolve(photos);
      };

      input.oncancel = () => {
        resolve([]);
      };

      input.click();
    });
  }

  async function takePhoto(): Promise<GalleryPhoto | null> {
    return new Promise((resolve) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.capture = 'environment';
      
      input.onchange = async (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (!file) {
          resolve(null);
          return;
        }

        try {
          const base64 = await fileToBase64(file);
          
          resolve({
            filepath: file.name,
            webviewPath: base64,
            timestamp: Date.now(),
          });
        } catch (error) {
          console.error('Error reading file:', error);
          resolve(null);
        }
      };

      input.oncancel = () => {
        resolve(null);
      };

      input.click();
    });
  }

  function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  }

  return {
    pickPhotosFromGallery,
    takePhoto,
  };
}
