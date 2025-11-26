import { getDB, Photo, Album, Event } from './db';

export async function addPhoto(photo: Photo) {
  const db = await getDB();
  await db.add('photos', photo);
  
  // Update album photo count
  const album = await db.get('albums', photo.albumId);
  if (album) {
    album.photoCount++;
    if (!album.coverPhotoUri) {
      album.coverPhotoUri = photo.uri;
    }
    await db.put('albums', album);
  }
}

export async function getAllPhotos(): Promise<Photo[]> {
  const db = await getDB();
  const photos = await db.getAll('photos');
  return photos.sort((a, b) => b.timestamp - a.timestamp);
}

export async function getPhotosByAlbum(albumId: string): Promise<Photo[]> {
  const db = await getDB();
  return db.getAllFromIndex('photos', 'by-album', albumId);
}

export async function createAlbum(album: Omit<Album, 'id' | 'createdAt' | 'photoCount'>): Promise<Album> {
  const db = await getDB();
  const newAlbum: Album = {
    ...album,
    id: crypto.randomUUID(),
    createdAt: Date.now(),
    photoCount: 0,
  };
  await db.add('albums', newAlbum);
  return newAlbum;
}

export async function getAlbums(parentId?: string): Promise<Album[]> {
  const db = await getDB();
  if (parentId === undefined) {
    const allAlbums = await db.getAll('albums');
    return allAlbums.filter(a => !a.parentId);
  }
  return db.getAllFromIndex('albums', 'by-parent', parentId);
}

export async function updateAlbum(album: Album) {
  const db = await getDB();
  await db.put('albums', album);
}

export async function deleteAlbum(albumId: string) {
  const db = await getDB();
  await db.delete('albums', albumId);
  
  // Delete all photos in album
  const photos = await getPhotosByAlbum(albumId);
  for (const photo of photos) {
    await db.delete('photos', photo.id);
  }
  
  // Delete child albums
  const children = await getAlbums(albumId);
  for (const child of children) {
    await deleteAlbum(child.id);
  }
}

export async function createEvent(event: Omit<Event, 'id'>): Promise<Event> {
  const db = await getDB();
  const newEvent: Event = {
    ...event,
    id: crypto.randomUUID(),
  };
  await db.add('events', newEvent);
  return newEvent;
}

export async function getEventsByAlbum(albumId: string): Promise<Event[]> {
  const db = await getDB();
  return db.getAllFromIndex('events', 'by-album', albumId);
}

export async function updateEvent(event: Event) {
  const db = await getDB();
  await db.put('events', event);
}

export async function deleteEvent(eventId: string) {
  const db = await getDB();
  await db.delete('events', eventId);
}
