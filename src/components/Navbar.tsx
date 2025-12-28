import { Settings } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import WindowControls from "./WindowControls";

function Navbar() {
  const navigate = useNavigate();
  return (
    <nav
      data-tauri-drag-region
      className="w-full h-8 flex items-center justify-between border-b bg-background sticky top-0 z-50 select-none pl-2"
    >
      <div className="flex items-center justify-center pointer-events-none gap-1">
        <span className="text-sm font-semibold tracking-tight">Maestro.</span>
      </div>

      <div className="flex items-center">
        <Settings
          size={"14"}
          className="mr-2 cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => navigate({ to: "/settings", replace: false })}
        />
        <div className="h-2.5 w-px bg-white/10 self-center mx-2"></div>
        <WindowControls />
      </div>
    </nav>
  );
}

export default Navbar;
