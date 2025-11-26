import { Album } from "@/lib/db";
import { Card } from "@/components/ui/card";
import { Folder } from "lucide-react";

interface AlbumCardProps {
  album: Album;
  onClick: () => void;
  onDragStart: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
}

export function AlbumCard({ album, onClick, onDragStart, onDragOver, onDrop }: AlbumCardProps) {
  return (
    <Card
      className="relative overflow-hidden cursor-pointer transition-all hover:scale-[1.02] hover:shadow-lg group"
      onClick={onClick}
      draggable
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <div className="aspect-square bg-secondary/50 flex items-center justify-center relative overflow-hidden">
        {album.coverPhotoUri ? (
          <>
            <img
              src={album.coverPhotoUri}
              alt={album.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          </>
        ) : (
          <Folder className="w-16 h-16 text-primary/80" />
        )}
      </div>
      <div className="p-3 bg-card/95 backdrop-blur-sm">
        <h3 className="font-semibold text-sm truncate">{album.name}</h3>
        <p className="text-xs text-muted-foreground">{album.photoCount} фото</p>
      </div>
    </Card>
  );
}
