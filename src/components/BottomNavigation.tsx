import { NavLink } from "react-router-dom";
import { Image, FolderOpen, Layers, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

export function BottomNavigation() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-sm border-t border-border z-50">
      <div className="flex items-center justify-around h-16 max-w-screen-xl mx-auto px-2">
        <NavLink
          to="/"
          className={({ isActive }) =>
            cn(
              "flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-lg transition-colors min-w-[4rem]",
              isActive
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            )
          }
        >
          {({ isActive }) => (
            <>
              <Image className={cn("w-6 h-6", isActive && "fill-primary/20")} />
              <span className="text-xs font-medium">Фото</span>
            </>
          )}
        </NavLink>

        <NavLink
          to="/albums"
          className={({ isActive }) =>
            cn(
              "flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-lg transition-colors min-w-[4rem]",
              isActive
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            )
          }
        >
          {({ isActive }) => (
            <>
              <FolderOpen className={cn("w-6 h-6", isActive && "fill-primary/20")} />
              <span className="text-xs font-medium">Альбоми</span>
            </>
          )}
        </NavLink>

        <NavLink
          to="/placeholder"
          className={({ isActive }) =>
            cn(
              "flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-lg transition-colors min-w-[4rem]",
              isActive
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            )
          }
        >
          {({ isActive }) => (
            <>
              <Layers className={cn("w-6 h-6", isActive && "fill-primary/20")} />
              <span className="text-xs font-medium">Скоро</span>
            </>
          )}
        </NavLink>

        <NavLink
          to="/settings"
          className={({ isActive }) =>
            cn(
              "flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-lg transition-colors min-w-[4rem]",
              isActive
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            )
          }
        >
          {({ isActive }) => (
            <>
              <Settings className={cn("w-6 h-6", isActive && "fill-primary/20")} />
              <span className="text-xs font-medium">Налаштування</span>
            </>
          )}
        </NavLink>
      </div>
    </nav>
  );
}
