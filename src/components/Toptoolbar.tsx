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
    { id: "highlighter", icon: Highlighter, label: "Highlighter" },
  ];

  return (
    <div className="fixed flex h-9 w-full bg-secondary/30 backdrop-blur-sm  items-start justify-start   select-none z-10 ">
      <div className="flex h-fit items-center gap-1 px-1.5 py-1 pointer-events-auto w-full">
        {tools.map((tool) => (
          <Tooltip key={tool.id}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => setActiveTool(tool.id)}
                className={cn(
                  "h-7 w-7 rounded-full transition-all duration-200",
                  activeTool === tool.id
                    ? "bg-background text-foreground shadow-sm border border-border/50"
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

        <div className="w-px h-3 bg-border/30 mx-1" />

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => pdfPath && savePdf(pdfPath)}
              className="h-7 w-7 rounded-full text-muted-foreground hover:text-foreground hover:bg-background/40 transition-colors"
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
      </div>
    </div>
  );
}

export default Toptoolbar;
