import { useState, useEffect } from "react";
import { Photo, Album } from "@/lib/db";
import { getAllPhotos, getAlbums } from "@/lib/storage";
import { SimplePhotoGrid } from "@/components/SimplePhotoGrid";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { Filter, Calendar } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type GroupingMode = 'day' | 'month' | 'year';

export default function PhotosPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [selectedAlbumIds, setSelectedAlbumIds] = useState<string[]>([]);
  const [grouping, setGrouping] = useState<GroupingMode>('day');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [allPhotos, allAlbums] = await Promise.all([
      getAllPhotos(),
      getAlbums()
    ]);
    setPhotos(allPhotos);
    setAlbums(allAlbums);
    setSelectedAlbumIds(allAlbums.map(a => a.id));
  };

  const toggleAlbum = (albumId: string) => {
    setSelectedAlbumIds(prev =>
      prev.includes(albumId)
        ? prev.filter(id => id !== albumId)
        : [...prev, albumId]
    );
  };

  const toggleAll = () => {
    if (selectedAlbumIds.length === albums.length) {
      setSelectedAlbumIds([]);
    } else {
      setSelectedAlbumIds(albums.map(a => a.id));
    }
  };

  const filteredPhotos = photos.filter(photo =>
    selectedAlbumIds.includes(photo.albumId)
  );

  return (
    <div className="min-h-screen">
      <div className="sticky top-0 z-10 bg-card/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between p-4">
          <div>
            <h1 className="text-2xl font-bold">Фото</h1>
            <p className="text-sm text-muted-foreground">
              {filteredPhotos.length} фотографій
            </p>
          </div>
          <div className="flex gap-2">
            <Select value={grouping} onValueChange={(value) => setGrouping(value as GroupingMode)}>
              <SelectTrigger className="w-[120px]">
                <Calendar className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">По днях</SelectItem>
                <SelectItem value="month">По місяцях</SelectItem>
                <SelectItem value="year">По роках</SelectItem>
              </SelectContent>
            </Select>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Filter className="w-4 h-4" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Фільтр по альбомах</SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="all"
                      checked={selectedAlbumIds.length === albums.length}
                      onCheckedChange={toggleAll}
                    />
                    <label htmlFor="all" className="font-medium">
                      Всі альбоми
                    </label>
                  </div>
                  <div className="h-px bg-border" />
                  {albums.map(album => (
                    <div key={album.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={album.id}
                        checked={selectedAlbumIds.includes(album.id)}
                        onCheckedChange={() => toggleAlbum(album.id)}
                      />
                      <label htmlFor={album.id} className="text-sm">
                        {album.name} ({album.photoCount})
                      </label>
                    </div>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      <div className="p-4">
        <SimplePhotoGrid photos={filteredPhotos} grouping={grouping} />
      </div>
    </div>
  );
}
