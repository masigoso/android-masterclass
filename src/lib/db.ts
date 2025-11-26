import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface Photo {
  id: string;
  uri: string;
  timestamp: number;
  albumId: string;
  eventId?: string;
}

interface Event {
  id: string;
  name: string;
  albumId: string;
  photoIds: string[];
  startDate: number;
  endDate: number;
}

interface Album {
  id: string;
  name: string;
  coverPhotoUri?: string;
  parentId?: string;
  createdAt: number;
  photoCount: number;
}

interface GalleryDB extends DBSchema {
  photos: {
    key: string;
    value: Photo;
    indexes: { 'by-album': string; 'by-timestamp': number };
  };
  albums: {
    key: string;
    value: Album;
    indexes: { 'by-parent': string };
  };
  events: {
    key: string;
    value: Event;
    indexes: { 'by-album': string };
  };
}

let dbInstance: IDBPDatabase<GalleryDB> | null = null;

export async function getDB() {
  if (dbInstance) return dbInstance;

  dbInstance = await openDB<GalleryDB>('gallery-db', 1, {
    upgrade(db) {
      const photoStore = db.createObjectStore('photos', { keyPath: 'id' });
      photoStore.createIndex('by-album', 'albumId');
      photoStore.createIndex('by-timestamp', 'timestamp');

      const albumStore = db.createObjectStore('albums', { keyPath: 'id' });
      albumStore.createIndex('by-parent', 'parentId');

      const eventStore = db.createObjectStore('events', { keyPath: 'id' });
      eventStore.createIndex('by-album', 'albumId');
    },
  });

  return dbInstance;
}

export type { Photo, Album, Event };
