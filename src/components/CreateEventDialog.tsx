import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface CreateEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (eventName: string) => void;
}

export function CreateEventDialog({ open, onOpenChange, onConfirm }: CreateEventDialogProps) {
  const [eventName, setEventName] = useState("");

  const handleConfirm = () => {
    if (eventName.trim()) {
      onConfirm(eventName.trim());
      setEventName("");
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Створити подію</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="eventName">Назва події</Label>
            <Input
              id="eventName"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              placeholder="Введіть назву події"
              onKeyDown={(e) => e.key === 'Enter' && handleConfirm()}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Скасувати
          </Button>
          <Button onClick={handleConfirm} disabled={!eventName.trim()}>
            Створити
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
