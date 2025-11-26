import { Card } from "@/components/ui/card";
import { Info } from "lucide-react";

export default function SettingsPage() {

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

      </div>
    </div>
  );
}
