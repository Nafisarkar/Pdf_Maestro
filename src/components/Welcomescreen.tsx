import Silk from "./Silk";
import { MousePointer2 } from "lucide-react";
import { Button } from "./ui/button";
import { useAtomValue } from "jotai";
import { userSettingsAtom } from "@/lib/atoms";

function WelcomeScreen({ onSelect }: { onSelect: () => void }) {
  const userSavedSettings = useAtomValue(userSettingsAtom);

  return (
    <div className="flex-1 w-full h-full flex items-center justify-center relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Silk
          speed={5.5}
          scale={0.9}
          color="#7B7481"
          noiseIntensity={1.5}
          rotation={0}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/20 to-background/80" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center max-w-md w-full px-6 text-center">
        <div className="mb-12 flex flex-col items-center">
          <h1 className="text-3xl font-bold tracking-tighter mb-2 bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70">
            Maestro.
          </h1>
          <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/80 font-bold">
            Minimalist PDF Experience
          </p>
        </div>

        <div className="group relative">
          <Button
            onClick={onSelect}
            variant="secondary"
            className="h-10 w-10 rounded-full border-border/40 bg-background/20 backdrop-blur-sm hover:bg-background/40 hover:border-primary/30 transition-all duration-500 group"
          >
            <MousePointer2 className="w-4 h-4  text-muted-foreground group-hover:text-primary transition-colors" />
          </Button>
        </div>
      </div>

      {/* Version Number */}
      <div className="absolute bottom-2 right-4 z-20">
        <span
          className={`text-[9px] font-mono  uppercase tracking-widest ${!userSavedSettings.darkmode ? "text-muted-foreground/80" : "text-muted-foreground/50"}`}
        >
          v0.1.0
        </span>
      </div>
    </div>
  );
}

export default WelcomeScreen;
