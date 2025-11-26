import { Layers } from "lucide-react";

export default function PlaceholderPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
            <Layers className="w-12 h-12 text-primary" />
          </div>
        </div>
        <h2 className="text-2xl font-bold">Скоро буде...</h2>
        <p className="text-muted-foreground">
          Ця функція знаходиться в розробці
        </p>
      </div>
    </div>
  );
}
