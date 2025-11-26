import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Trash2, Info } from "lucide-react";
import { getDB } from "@/lib/db";
import { useToast } from "@/hooks/use-toast";

export default function SettingsPage() {
  const [isClearing, setIsClearing] = useState(false);
  const { toast } = useToast();

  const clearAllData = async () => {
    setIsClearing(true);
    try {
      const db = await getDB();
      await db.clear('photos');
      await db.clear('albums');
      await db.clear('events');
      
      toast({
        title: "Дані очищено",
        description: "Всі альбоми, фотографії та події було видалено.",
      });
      
      window.location.reload();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Помилка",
        description: "Не вдалося очистити дані.",
      });
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Налаштування</h1>
          <p className="text-sm text-muted-foreground">
            Керування додатком та даними
          </p>
        </div>

        <Card className="p-4">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <h3 className="font-semibold mb-1">Про додаток</h3>
              <p className="text-sm text-muted-foreground">
                Галерея фотографій
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Версія 1.0.0
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-start gap-3">
            <Trash2 className="w-5 h-5 text-destructive mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold mb-1">Очистити всі дані</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Видалити всі альбоми, фотографії та події з пристрою
              </p>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" disabled={isClearing}>
                    {isClearing ? "Очищення..." : "Очистити дані"}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Ви впевнені?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Ця дія незворотна. Всі ваші альбоми, фотографії та події будуть видалені назавжди.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Скасувати</AlertDialogCancel>
                    <AlertDialogAction onClick={clearAllData} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                      Так, видалити все
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
