import { getDB, Album, Photo, Event } from './db';

export async function initializeMockData() {
  const db = await getDB();
  
  // Check if data already exists
  const existingAlbums = await db.getAll('albums');
  if (existingAlbums.length > 0) {
    console.log('Mock data already exists');
    return;
  }

  console.log('Initializing mock data...');

  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;
  
  // Create main groups (parent albums)
  const groups: Album[] = [
    {
      id: 'group-1',
      name: 'Відпустка 2024',
      createdAt: now - 90 * dayMs,
      photoCount: 0,
    },
    {
      id: 'group-2',
      name: 'Сімейні фото',
      createdAt: now - 180 * dayMs,
      photoCount: 0,
    },
    {
      id: 'group-3',
      name: 'Робота',
      createdAt: now - 365 * dayMs,
      photoCount: 0,
    },
    {
      id: 'group-4',
      name: 'Хобі та подорожі',
      createdAt: now - 120 * dayMs,
      photoCount: 0,
    },
  ];

  // Create sub-albums in groups
  const albums: Album[] = [
    // Group 1 albums
    {
      id: 'album-1',
      name: 'Карпати',
      parentId: 'group-1',
      createdAt: now - 85 * dayMs,
      photoCount: 0,
    },
    {
      id: 'album-2',
      name: 'Львів',
      parentId: 'group-1',
      createdAt: now - 80 * dayMs,
      photoCount: 0,
    },
    {
      id: 'album-3',
      name: 'Одеса',
      parentId: 'group-1',
      createdAt: now - 70 * dayMs,
      photoCount: 0,
    },
    
    // Group 2 albums
    {
      id: 'album-4',
      name: 'День народження',
      parentId: 'group-2',
      createdAt: now - 150 * dayMs,
      photoCount: 0,
    },
    {
      id: 'album-5',
      name: 'Новий рік',
      parentId: 'group-2',
      createdAt: now - 30 * dayMs,
      photoCount: 0,
    },
    {
      id: 'album-6',
      name: 'Весілля',
      parentId: 'group-2',
      createdAt: now - 200 * dayMs,
      photoCount: 0,
    },
    
    // Group 3 albums
    {
      id: 'album-7',
      name: 'Конференція 2024',
      parentId: 'group-3',
      createdAt: now - 300 * dayMs,
      photoCount: 0,
    },
    {
      id: 'album-8',
      name: 'Офіс',
      parentId: 'group-3',
      createdAt: now - 250 * dayMs,
      photoCount: 0,
    },
    
    // Group 4 albums
    {
      id: 'album-9',
      name: 'Фотографія',
      parentId: 'group-4',
      createdAt: now - 100 * dayMs,
      photoCount: 0,
    },
    {
      id: 'album-10',
      name: 'Кулінарія',
      parentId: 'group-4',
      createdAt: now - 60 * dayMs,
      photoCount: 0,
    },
  ];

  // Save groups and albums
  for (const group of groups) {
    await db.add('albums', group);
  }
  for (const album of albums) {
    await db.add('albums', album);
  }

  // Generate photos for each album
  const photosPerAlbum = [25, 30, 35, 20, 40, 28, 15, 18, 32, 22];
  
  for (let i = 0; i < albums.length; i++) {
    const album = albums[i];
    const photoCount = photosPerAlbum[i];
    const albumStartDate = album.createdAt;
    
    for (let j = 0; j < photoCount; j++) {
      const photo: Photo = {
        id: `photo-${album.id}-${j}`,
        uri: `https://picsum.photos/seed/${album.id}-${j}/800/600`,
        timestamp: albumStartDate + j * dayMs * 0.5, // Photos spread over time
        albumId: album.id,
      };
      
      await db.add('photos', photo);
      
      // Update album photo count and cover
      album.photoCount++;
      if (j === 0) {
        album.coverPhotoUri = photo.uri;
      }
    }
    
    await db.put('albums', album);
  }

  // Create some events
  const events: Event[] = [
    {
      id: 'event-1',
      name: 'Схід на Говерлу',
      albumId: 'album-1',
      photoIds: ['photo-album-1-0', 'photo-album-1-1', 'photo-album-1-2', 'photo-album-1-3'],
      startDate: albums[0].createdAt,
      endDate: albums[0].createdAt + 2 * dayMs,
    },
    {
      id: 'event-2',
      name: 'Старе місто',
      albumId: 'album-2',
      photoIds: ['photo-album-2-0', 'photo-album-2-1', 'photo-album-2-2'],
      startDate: albums[1].createdAt,
      endDate: albums[1].createdAt + dayMs,
    },
    {
      id: 'event-3',
      name: 'Святкування',
      albumId: 'album-4',
      photoIds: ['photo-album-4-0', 'photo-album-4-1', 'photo-album-4-2', 'photo-album-4-3', 'photo-album-4-4'],
      startDate: albums[3].createdAt,
      endDate: albums[3].createdAt + dayMs,
    },
  ];

  for (const event of events) {
    await db.add('events', event);
    
    // Update photos with event IDs
    for (const photoId of event.photoIds) {
      const photo = await db.get('photos', photoId);
      if (photo) {
        photo.eventId = event.id;
        await db.put('photos', photo);
      }
    }
  }

  console.log('Mock data initialized successfully!');
  console.log(`Created ${groups.length} groups, ${albums.length} albums, and multiple photos with events`);
}
