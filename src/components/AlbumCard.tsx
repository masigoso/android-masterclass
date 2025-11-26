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
      className="relative overflow-hidden cursor-pointer transition-all hover:scale-105 hover:shadow-glow"
      onClick={onClick}
      draggable
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <div className="aspect-square bg-secondary/50 flex items-center justify-center">
        {album.coverPhotoUri ? (
          <img
            src={album.coverPhotoUri}
            alt={album.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <Folder className="w-16 h-16 text-primary" />
        )}
      </div>
      <div className="p-3">
        <h3 className="font-semibold text-sm truncate">{album.name}</h3>
        <p className="text-xs text-muted-foreground">{album.photoCount} фото</p>
      </div>
    </Card>
  );
}
