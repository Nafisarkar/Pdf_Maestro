import { Button } from "./ui/button";

function WelcomeScreen({ onSelect }: { onSelect: () => void }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center max-w-lg mx-auto text-center select-none">
      <div className="group flex flex-col items-center">
        <div className="mt-6 space-y-1.5">
          <h1 className="text-sm font-bold   text-foreground/80">Maestro.</h1>
          <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60">
            Minimal Pdf Viewer
          </p>
        </div>
      </div>

      <div className="flex flex-col mt-8 gap-4 ">
        <Button
          onClick={onSelect}
          variant="default"
          className="h-8 px-10 text-[10px] uppercase tracking-widest font-bold rounded-none border border-transparent hover:border-border/50 transition-all duration-300 cursor-pointer"
        >
          Open Pdf
        </Button>
        <Button
          onClick={onSelect}
          variant="secondary"
          className="h-8 px-10 text-[10px] uppercase tracking-widest font-bold rounded-none border border-transparent hover:border-border/50 transition-all duration-300 cursor-pointer"
        >
          Create Pdf
        </Button>
      </div>
    </div>
  );
}

export default WelcomeScreen;
