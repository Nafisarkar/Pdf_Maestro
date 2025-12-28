import { useAtom } from "jotai";
import { toolAtom, type Tool, highlightColorAtom } from "../lib/atoms";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Hand,
  Highlighter,
  MousePointer2,
  Save,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAtomValue } from "jotai";
import { pdfPathAtom } from "@/lib/atoms";
import { usePdfHighlights } from "@/hooks/usePdfHighlights";

function Toptoolbar() {
  const [activeTool, setActiveTool] = useAtom(toolAtom);
  const [highlightColor, setHighlightColor] = useAtom(highlightColorAtom);
  const pdfPath = useAtomValue(pdfPathAtom);
  const { savePdf } = usePdfHighlights();

  const colors = [
    { name: "Green", value: { r: 0, g: 1, b: 0 }, css: "bg-green-500" },
    { name: "Yellow", value: { r: 1, g: 1, b: 0 }, css: "bg-yellow-500" },
    { name: "Red", value: { r: 1, g: 0, b: 0 }, css: "bg-red-500" },
    { name: "Blue", value: { r: 0, g: 0, b: 1 }, css: "bg-blue-500" },
  ];

  const tools: { id: Tool; icon: LucideIcon; label: string }[] = [
    { id: "select", icon: MousePointer2, label: "Select" },
    { id: "pan", icon: Hand, label: "Pan" },
    { id: "highlighter", icon: Highlighter, label: "Highlighter" },
  ];

  return (
    <div className="fixed top-10 left-1/2 -translate-x-1/2 h-9 px-1.5 flex items-center gap-1 border border-border/40 bg-background/70 backdrop-blur-xl z-50 select-none rounded-xl shadow-2xl shadow-black/5 transition-all duration-300 hover:bg-background/90">
      <div className="flex items-center gap-0.5">
        {tools.map((tool) => (
          <Tooltip key={tool.id}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => setActiveTool(tool.id)}
                className={cn(
                  "h-7 w-7 rounded-lg transition-all duration-200",
                  activeTool === tool.id
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                )}
              >
                <tool.icon size={14} strokeWidth={2.5} />
              </Button>
            </TooltipTrigger>
            <TooltipContent
              side="bottom"
              className="text-[10px] uppercase tracking-widest font-bold"
            >
              {tool.label}
            </TooltipContent>
          </Tooltip>
        ))}

        <div className="w-px h-4 bg-border/60 mx-1" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              className="h-7 w-7 rounded-lg hover:bg-accent/50"
            >
              <div
                className="w-3.5 h-3.5 rounded-full border border-border/50 shadow-sm"
                style={{
                  backgroundColor: `rgb(${highlightColor.r * 255}, ${
                    highlightColor.g * 255
                  }, ${highlightColor.b * 255})`,
                }}
              />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center" className="min-w-[120px]">
            {colors.map((c) => (
              <DropdownMenuItem
                key={c.name}
                onClick={() => setHighlightColor(c.value)}
                className="flex items-center gap-2 text-[10px] uppercase tracking-wider font-bold"
              >
                <div className={`w-3 h-3 rounded-full ${c.css} shadow-sm`} />
                {c.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="w-px h-4 bg-border/60 mx-1" />

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => pdfPath && savePdf(pdfPath)}
              className="h-7 w-7 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors"
            >
              <Save size={14} strokeWidth={2.5} />
            </Button>
          </TooltipTrigger>
          <TooltipContent
            side="bottom"
            className="text-[10px] uppercase tracking-widest font-bold"
          >
            Save PDF
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}

export default Toptoolbar;
