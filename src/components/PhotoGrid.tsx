import { Photo } from "@/lib/db";
import { Checkbox } from "@/components/ui/checkbox";

interface PhotoGridProps {
  photos: Photo[];
  selectedPhotos: Set<string>;
  onPhotoSelect: (photoId: string) => void;
  onPhotoClick: (photo: Photo) => void;
  groupBy?: 'day' | 'month' | 'year';
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

function groupPhotos(photos: Photo[], groupBy?: 'day' | 'month' | 'year') {
  if (!groupBy) return { ungrouped: photos };

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

export function PhotoGrid({ 
  photos, 
  selectedPhotos, 
  onPhotoSelect, 
  onPhotoClick,
  groupBy 
}: PhotoGridProps) {
  const groups = groupPhotos(photos, groupBy);

  return (
    <div className="space-y-6">
      {Object.entries(groups).map(([groupKey, groupPhotos]) => (
        <div key={groupKey}>
          {groupBy && groupKey !== 'ungrouped' && (
            <h3 className="text-lg font-semibold mb-3 text-muted-foreground">
              {formatDate(groupPhotos[0].timestamp, groupBy)}
            </h3>
          )}
          <div className="grid grid-cols-3 gap-2">
            {groupPhotos.map((photo) => (
              <div 
                key={photo.id} 
                className="relative aspect-square group overflow-hidden rounded-lg"
              >
                <img
                  src={photo.uri}
                  alt=""
                  className="w-full h-full object-cover cursor-pointer transition-transform duration-200 group-hover:scale-110"
                  onClick={() => onPhotoClick(photo)}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Checkbox
                    checked={selectedPhotos.has(photo.id)}
                    onCheckedChange={() => onPhotoSelect(photo.id)}
                    className="bg-background/90 backdrop-blur-sm border-2"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
