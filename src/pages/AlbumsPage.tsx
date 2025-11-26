import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Album } from "@/lib/db";
import { getAlbums, createAlbum, updateAlbum } from "@/lib/storage";
import { AlbumCard } from "@/components/AlbumCard";
import { CreateGroupDialog } from "@/components/CreateGroupDialog";
import { Button } from "@/components/ui/button";
import { Plus, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AlbumsPage() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [currentParentId, setCurrentParentId] = useState<string | undefined>();
  const [draggedAlbumId, setDraggedAlbumId] = useState<string | null>(null);
  const [dropTargetId, setDropTargetId] = useState<string | null>(null);
  const [showGroupDialog, setShowGroupDialog] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    loadAlbums();
  }, [currentParentId]);

  async function loadAlbums() {
    const loadedAlbums = await getAlbums(currentParentId);
    setAlbums(loadedAlbums);
  }

  async function handleCreateAlbum() {
    const albumName = prompt("Назва альбому:");
    if (albumName) {
      await createAlbum({ name: albumName, parentId: currentParentId });
      loadAlbums();
      toast({ title: "Альбом створено" });
    }
  }

  function handleDragStart(albumId: string) {
    return (e: React.DragEvent) => {
      setDraggedAlbumId(albumId);
      e.dataTransfer.effectAllowed = "move";
    };
  }

  function handleDragOver(albumId: string) {
    return (e: React.DragEvent) => {
      e.preventDefault();
      if (draggedAlbumId && draggedAlbumId !== albumId) {
        setDropTargetId(albumId);
      }
    };
  }

  function handleDrop(targetAlbumId: string) {
    return (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      
      if (draggedAlbumId && draggedAlbumId !== targetAlbumId) {
        setDropTargetId(targetAlbumId);
        setShowGroupDialog(true);
      }
      
      setDraggedAlbumId(null);
    };
  }

  async function handleCreateGroup(groupName: string) {
    if (draggedAlbumId && dropTargetId) {
      const newGroup = await createAlbum({ 
        name: groupName, 
        parentId: currentParentId 
      });

      const draggedAlbum = albums.find(a => a.id === draggedAlbumId);
      const targetAlbum = albums.find(a => a.id === dropTargetId);

      if (draggedAlbum && targetAlbum) {
        draggedAlbum.parentId = newGroup.id;
        targetAlbum.parentId = newGroup.id;
        
        await updateAlbum(draggedAlbum);
        await updateAlbum(targetAlbum);
        
        loadAlbums();
        toast({ title: `Група "${groupName}" створена` });
      }
    }
    setDropTargetId(null);
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            {currentParentId && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setCurrentParentId(undefined)}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
            )}
            <h1 className="text-2xl font-bold">Альбоми</h1>
          </div>
          <Button onClick={handleCreateAlbum}>
            <Plus className="w-5 h-5 mr-2" />
            Новий альбом
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {albums.map((album) => (
            <AlbumCard
              key={album.id}
              album={album}
              onClick={() => navigate(`/album/${album.id}`)}
              onDragStart={handleDragStart(album.id)}
              onDragOver={handleDragOver(album.id)}
              onDrop={handleDrop(album.id)}
            />
          ))}
        </div>

        <CreateGroupDialog
          open={showGroupDialog}
          onOpenChange={setShowGroupDialog}
          onConfirm={handleCreateGroup}
        />
      </div>
    </div>
  );
}
