import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Photo, Event } from "@/lib/db";
import { getPhotosByAlbum, addPhoto, createEvent, getEventsByAlbum } from "@/lib/storage";
import { PhotoGrid } from "@/components/PhotoGrid";
import { CreateEventDialog } from "@/components/CreateEventDialog";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, MoreVertical, Calendar, Grid3X3, Camera as CameraIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { usePhotoGallery } from "@/hooks/usePhotoGallery";

export default function AlbumViewPage() {
  const { albumId } = useParams<{ albumId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { pickPhotosFromGallery, takePhoto } = usePhotoGallery();
  
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedPhotos, setSelectedPhotos] = useState<Set<string>>(new Set());
  const [showEventDialog, setShowEventDialog] = useState(false);
  const [groupBy, setGroupBy] = useState<'day' | 'month' | 'year' | undefined>();

  useEffect(() => {
    if (albumId) {
      loadPhotos();
      loadEvents();
    }
  }, [albumId]);

  async function loadPhotos() {
    if (albumId) {
      const loadedPhotos = await getPhotosByAlbum(albumId);
      setPhotos(loadedPhotos.sort((a, b) => b.timestamp - a.timestamp));
    }
  }

  async function loadEvents() {
    if (albumId) {
      const loadedEvents = await getEventsByAlbum(albumId);
      setEvents(loadedEvents);
    }
  }

  async function handleAddPhotosFromGallery() {
    if (!albumId) return;
    
    const galleryPhotos = await pickPhotosFromGallery();
    
    if (galleryPhotos.length === 0) return;

    for (const galleryPhoto of galleryPhotos) {
      await addPhoto({
        id: crypto.randomUUID(),
        uri: galleryPhoto.webviewPath || galleryPhoto.filepath,
        timestamp: galleryPhoto.timestamp,
        albumId,
      });
    }
    
    loadPhotos();
    toast({ title: `Додано ${galleryPhotos.length} фото` });
  }

  async function handleTakePhoto() {
    if (!albumId) return;
    
    const photo = await takePhoto();
    
    if (!photo) return;

    await addPhoto({
      id: crypto.randomUUID(),
      uri: photo.webviewPath || photo.filepath,
      timestamp: photo.timestamp,
      albumId,
    });
    
    loadPhotos();
    toast({ title: "Фото додано" });
  }

  function togglePhotoSelection(photoId: string) {
    const newSelected = new Set(selectedPhotos);
    if (newSelected.has(photoId)) {
      newSelected.delete(photoId);
    } else {
      newSelected.add(photoId);
    }
    setSelectedPhotos(newSelected);
  }

  async function handleCreateEvent(eventName: string) {
    if (!albumId || selectedPhotos.size === 0) return;

    const selectedPhotosList = photos.filter(p => selectedPhotos.has(p.id));
    const timestamps = selectedPhotosList.map(p => p.timestamp);
    
    await createEvent({
      name: eventName,
      albumId,
      photoIds: Array.from(selectedPhotos),
      startDate: Math.min(...timestamps),
      endDate: Math.max(...timestamps),
    });

    loadEvents();
    setSelectedPhotos(new Set());
    toast({ title: `Подія "${eventName}" створена` });
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 bg-background/95 backdrop-blur z-10 border-b border-border p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-bold">
              {selectedPhotos.size > 0 
                ? `Обрано: ${selectedPhotos.size}` 
                : "Альбом"}
            </h1>
          </div>
          
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Grid3X3 className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setGroupBy(undefined)}>
                  Всі фото
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setGroupBy('day')}>
                  По днях
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setGroupBy('month')}>
                  По місяцях
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setGroupBy('year')}>
                  По роках
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {selectedPhotos.size > 0 ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setShowEventDialog(true)}>
                    <Calendar className="w-4 h-4 mr-2" />
                    Створити подію
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button>
                    <Plus className="w-5 h-5 mr-2" />
                    Додати фото
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleAddPhotosFromGallery}>
                    <Plus className="w-4 h-4 mr-2" />
                    З галереї
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleTakePhoto}>
                    <CameraIcon className="w-4 h-4 mr-2" />
                    Зробити фото
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4">
        {events.length > 0 && (
          <div className="mb-6 space-y-3">
            {events.map((event) => (
              <div
                key={event.id}
                className="bg-card border border-border rounded-lg p-4"
              >
                <h3 className="font-semibold text-lg mb-1">{event.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {new Date(event.startDate).toLocaleDateString('uk-UA')} - {' '}
                  {new Date(event.endDate).toLocaleDateString('uk-UA')}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {event.photoIds.length} фото
                </p>
              </div>
            ))}
          </div>
        )}

        <PhotoGrid
          photos={photos}
          selectedPhotos={selectedPhotos}
          onPhotoSelect={togglePhotoSelection}
          onPhotoClick={() => {}}
          groupBy={groupBy}
        />
      </div>

      <CreateEventDialog
        open={showEventDialog}
        onOpenChange={setShowEventDialog}
        onConfirm={handleCreateEvent}
      />
    </div>
  );
}
