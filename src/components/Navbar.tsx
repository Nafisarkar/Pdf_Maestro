import { FolderOpen, Settings } from "lucide-react";
import { Button } from "./ui/button";
import WindowControls from "./windowcontrols";

function Navbar({ onOpen }: { onOpen: () => void }) {
  return (
    <nav className="w-full h-8 flex items-center justify-between border-b border-border/50 bg-background sticky top-0 z-50 select-none overflow-hidden">
      {/* Drag Region */}
      <div data-tauri-drag-region className="absolute inset-0 z-0" />

      <div className="relative z-10 flex items-center gap-1 pl-4 pointer-events-none">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
          Pdf Maestro
        </span>
        <span className="text-muted-foreground/30 text-[8px]">v1.0.0</span>
      </div>

      <div className="relative z-10 flex items-center">
        <div className="flex items-center gap-1 pr-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onOpen}
            className="h-6 px-2 gap-1.5 text-[10px] uppercase tracking-wider font-medium"
          >
            <FolderOpen className="size-3" />
            <span>Open</span>
          </Button>
          <div className="h-3 w-px bg-border/60 mx-1" />
          <Button
            variant="ghost"
            size="icon"
            className="size-6 hover:text-foreground"
          >
            <Settings className="size-3" />
          </Button>
        </div>

        <div className="h-8 w-px bg-border/50" />
        <WindowControls />
      </div>
    </nav>
  );
}

export default Navbar;
