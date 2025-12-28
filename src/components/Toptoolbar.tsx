import { useAtom } from "jotai";
import { toolAtom, Tool } from "../lib/atoms";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { Hand, Highlighter, MousePointer2, type Icon } from "lucide-react";
import { cn } from "@/lib/utils";

function Toptoolbar() {
  const [activeTool, setActiveTool] = useAtom(toolAtom);

  const tools: { id: Tool; icon: any; label: string }[] = [
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
      </div>
    </div>
  );
}

export default Toptoolbar;
