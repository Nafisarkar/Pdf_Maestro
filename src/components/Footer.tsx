import {
  Heart,
  Minus,
  Plus,
  Maximize,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "./ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { Input } from "./ui/input";
import { useEffect, useState } from "react";
import { open } from "@tauri-apps/plugin-shell";

function Footer({
  currentpage,
  totalpage,
  scale,
  onPageChange,
  onScaleChange,
}: {
  currentpage: number;
  totalpage: number;
  scale: number;
  onPageChange: (offset: number) => void;
  onScaleChange: (newScale: number | ((prev: number) => number)) => void;
}) {
  const [inputValue, setInputValue] = useState(currentpage.toString());

  useEffect(() => {
    setInputValue(currentpage.toString());
  }, [currentpage]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputBlur = () => {
    const val = parseInt(inputValue);
    if (!isNaN(val) && val >= 1 && val <= totalpage) {
      onPageChange(val - currentpage);
    } else {
      setInputValue(currentpage.toString());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleInputBlur();
    }
  };

  return (
    <footer className="w-full h-7 px-3 flex items-center justify-between border-t border-border/40 bg-background text-[10px] uppercase tracking-[0.15em] font-medium text-muted-foreground select-none">
      <div className="flex items-center gap-3">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                className="flex items-center gap-1.5 cursor-pointer hover:text-muted-foreground transition-colors"
                onClick={() => open("https://github.com/Nafisarkar")}
              >
                <Heart
                  size={13}
                  color="#f50076"
                  strokeWidth={2.0}
                  className="animate-pulse fill-pink-600 shadow drop-shadow-2xl"
                />
                <span className="text-muted-foreground/20 text-[8px]">
                  Shaon An Nafi
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent
              side="top"
              className="text-[10px] uppercase tracking-tight font-light "
            >
              Thanks for your support!
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {totalpage > 0 && (
        <div className="flex items-center  ml-auto">
          {/* Page Controls */}
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              className="size-5 hover:bg-muted/30 rounded-none"
              onClick={() => onPageChange(-1)}
              disabled={currentpage <= 1}
            >
              <ChevronLeft className="size-3 opacity-50" />
            </Button>

            <div className="flex items-center gap-0.5 px-2">
              <Input
                className="h-4 w-7 text-muted-foreground/80 p-0 text-center bg-transparent dark:bg-transparent border-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 font-medium "
                value={inputValue}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                onKeyDown={handleKeyDown}
              />
              <span className="text-muted-foreground/30 translate-y-[0.5px]">
                / {totalpage}
              </span>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="size-5 hover:bg-muted/30 rounded-none"
              onClick={() => onPageChange(1)}
              disabled={currentpage >= totalpage}
            >
              <ChevronRight className="size-3 opacity-50" />
            </Button>
          </div>

          <div className="h-2.5 w-px bg-border/60 mx-1" />

          {/* Zoom Controls */}
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              className="size-5 rounded-none hover:bg-muted/30"
              onClick={() => onScaleChange((s) => Math.max(0.5, s - 0.1))}
              disabled={scale <= 0.5}
            >
              <Minus className="size-3 opacity-50" />
            </Button>

            <span className="min-w-8 text-center text-muted-foreground/80 font-medium px-2">
              {Math.round(scale * 100)}%
            </span>

            <Button
              variant="ghost"
              size="icon"
              className="size-5 rounded-none hover:bg-muted/30"
              onClick={() => onScaleChange((s) => Math.min(2.5, s + 0.1))}
              disabled={scale >= 2.5}
            >
              <Plus className="size-3 opacity-50" />
            </Button>

            <div className="h-2 w-px bg-border/50 mx-0.5" />

            <Button
              variant="ghost"
              size="icon"
              className="size-5 rounded-none hover:bg-muted/30"
              onClick={() => onScaleChange(1.0)}
              title="Fit to Screen"
            >
              <Maximize className="size-3 opacity-50" />
            </Button>
          </div>
        </div>
      )}
    </footer>
  );
}

export default Footer;
