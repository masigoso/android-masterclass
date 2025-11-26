import { Photo } from "@/lib/db";

interface SimplePhotoGridProps {
  photos: Photo[];
  grouping: 'day' | 'month' | 'year';
}

function formatDate(timestamp: number, groupBy: string) {
  const date = new Date(timestamp);
  const options: Intl.DateTimeFormatOptions = {
    day: groupBy === 'day' ? 'numeric' : undefined,
    month: groupBy === 'day' || groupBy === 'month' ? 'long' : undefined,
    year: 'numeric',
  };
  return date.toLocaleDateString('uk-UA', options);
}

function groupPhotos(photos: Photo[], groupBy: 'day' | 'month' | 'year') {
  const groups: Record<string, Photo[]> = {};
  
  photos.forEach(photo => {
    const date = new Date(photo.timestamp);
    let key: string;
    
    if (groupBy === 'day') {
      key = date.toLocaleDateString('uk-UA');
    } else if (groupBy === 'month') {
      key = `${date.getFullYear()}-${date.getMonth()}`;
    } else {
      key = date.getFullYear().toString();
    }
    
    if (!groups[key]) groups[key] = [];
    groups[key].push(photo);
  });
  
  return groups;
}

export function SimplePhotoGrid({ photos, grouping }: SimplePhotoGridProps) {
  const groups = groupPhotos(photos, grouping);

  return (
    <div className="space-y-6">
      {Object.entries(groups).map(([groupKey, groupPhotos]) => (
        <div key={groupKey}>
          <h3 className="text-lg font-semibold mb-3 text-muted-foreground">
            {formatDate(groupPhotos[0].timestamp, grouping)}
          </h3>
          <div className="grid grid-cols-3 gap-2">
            {groupPhotos.map((photo) => (
              <div 
                key={photo.id} 
                className="relative aspect-square group overflow-hidden rounded-lg"
              >
                <img
                  src={photo.uri}
                  alt=""
                  className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
