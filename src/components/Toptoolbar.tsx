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
    <div className="absolute top-0 w-full h-8 px- flex items-center justify-start border-b border-border bg-background z-50 select-none">
      <div className="flex items-center gap-0">
        {tools.map((tool) => (
          <Tooltip key={tool.id}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => setActiveTool(tool.id)}
                className={cn(
                  "h-8 w-8 rounded-none transition-colors",
                  activeTool === tool.id
                    ? "bg-accent text-foreground"
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

        <div className="w-px h-4 bg-border mx-1" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              className="h-8 w-8 rounded-none"
            >
              <div
                className="w-4 h-4 rounded-full border border-border"
                style={{
                  backgroundColor: `rgb(${highlightColor.r * 255}, ${
                    highlightColor.g * 255
                  }, ${highlightColor.b * 255})`,
                }}
              />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {colors.map((c) => (
              <DropdownMenuItem
                key={c.name}
                onClick={() => setHighlightColor(c.value)}
              >
                <div className={`w-4 h-4 rounded-full mr-2 ${c.css}`} />
                {c.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="w-px h-4 bg-border mx-1" />

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => pdfPath && savePdf(pdfPath)}
              className="h-8 w-8 rounded-none text-muted-foreground hover:text-foreground hover:bg-accent/50"
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
