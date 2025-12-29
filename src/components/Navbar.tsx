import { Settings, FolderOpen } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import WindowControls from "./WindowControls";
import { usePdfViewer } from "@/hooks/usePdfViewer";

function Navbar() {
  const navigate = useNavigate();
  const { selectPdf } = usePdfViewer();
  return (
    <nav
      data-tauri-drag-region
      className="w-full h-8 flex items-center justify-between bg-background/80 backdrop-blur-xl sticky top-0 z-50 select-none pl-3"
    >
      <div className="flex items-center justify-center pointer-events-none gap-1">
        <span className="text-[13px] font-bold tracking-wider opacity-80">
          Maestro.
        </span>
      </div>

      <div className="flex items-center">
        <FolderOpen
          size={"13"}
          className="mr-3 text-muted-foreground/80 cursor-pointer hover:text-foreground transition-colors"
          onClick={selectPdf}
        />
        <Settings
          size={"13"}
          className="mr-3 text-muted-foreground/80 cursor-pointer hover:text-foreground transition-colors"
          onClick={() => navigate({ to: "/settings", replace: false })}
        />
        <div className="h-3 w-px bg-border/40 self-center mx-1"></div>
        <WindowControls />
      </div>
    </nav>
  );
}

export default Navbar;
