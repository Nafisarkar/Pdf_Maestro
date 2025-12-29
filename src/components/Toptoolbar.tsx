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
  Highlighter,
  MousePointer2,
  Save,
  Eraser,
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
  const { highlights, savePdf } = usePdfHighlights();

  const colors = [
    { name: "Green", value: { r: 0, g: 1, b: 0 }, css: "bg-green-500" },
    { name: "Yellow", value: { r: 1, g: 1, b: 0 }, css: "bg-yellow-500" },
    { name: "Red", value: { r: 1, g: 0, b: 0 }, css: "bg-red-600" },
    { name: "Blue", value: { r: 0, g: 0, b: 1 }, css: "bg-blue-700" },
  ];

  const tools: { id: Tool; icon: LucideIcon; label: string }[] = [
    { id: "select", icon: MousePointer2, label: "Select" },
    { id: "highlighter", icon: Highlighter, label: "Highlighter" },
    { id: "eraser", icon: Eraser, label: "Eraser" },
  ];

  return (
    <div className="fixed flex h-9 w-full bg-secondary/80 backdrop-blur-md border-b border-border/40 items-start justify-start select-none z-10 shadow-sm">
      <div className="flex h-fit items-center gap-1 px-1.5 py-1 pointer-events-auto w-full">
        {tools.map((tool) => (
          <Tooltip key={tool.id}>
            <TooltipTrigger asChild>
              <Button
                variant="secondary"
                size="icon-sm"
                onClick={() => setActiveTool(tool.id)}
                className={cn(
                  "h-7 w-7 rounded-full transition-all duration-200",
                  activeTool === tool.id
                    ? "bg-primary/40 text-primary-foreground shadow-md scale-105"
                    : "text-muted-foreground hover:text-foreground hover:bg-background/40"
                )}
              >
                <tool.icon size={14} strokeWidth={2} />
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

        <div className="w-px h-3 bg-border/30 mx-1" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              className="h-7 w-7 rounded-full hover:bg-background/40"
            >
              <div
                className="w-3 h-3 rounded-full border border-border/50 shadow-sm"
                style={{
                  backgroundColor: `rgb(${highlightColor.r * 255}, ${
                    highlightColor.g * 255
                  }, ${highlightColor.b * 255})`,
                }}
              />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="center"
            className="min-w-30 p-1 ml-19 mt-2"
          >
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

        {highlights.length > 0 && (
          <>
            <div className="w-px h-3 bg-border/30 mx-1" />
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => pdfPath && savePdf(pdfPath)}
                  className="h-7 w-7 rounded-full text-primary hover:text-primary hover:bg-primary/10 transition-colors animate-in fade-in zoom-in duration-300"
                >
                  <Save size={14} strokeWidth={2} />
                </Button>
              </TooltipTrigger>
              <TooltipContent
                side="bottom"
                className="text-[10px] uppercase tracking-widest font-bold"
              >
                Save PDF
              </TooltipContent>
            </Tooltip>
          </>
        )}
      </div>
    </div>
  );
}

export default Toptoolbar;
