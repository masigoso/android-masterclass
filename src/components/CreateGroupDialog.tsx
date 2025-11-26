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

interface CreateGroupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (groupName: string) => void;
}

export function CreateGroupDialog({ open, onOpenChange, onConfirm }: CreateGroupDialogProps) {
  const [groupName, setGroupName] = useState("");

  const handleConfirm = () => {
    if (groupName.trim()) {
      onConfirm(groupName.trim());
      setGroupName("");
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Створити нову групу</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="groupName">Назва групи</Label>
            <Input
              id="groupName"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Введіть назву групи"
              onKeyDown={(e) => e.key === 'Enter' && handleConfirm()}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Скасувати
          </Button>
          <Button onClick={handleConfirm} disabled={!groupName.trim()}>
            Створити
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
