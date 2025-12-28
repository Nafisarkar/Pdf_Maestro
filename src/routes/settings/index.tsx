import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  Settings,
  Shield,
  EyeOff,
  LayoutTemplate,
  ChevronLeft,
  SprayCan,
  Paintbrush,
} from "lucide-react";
import { useAtom } from "jotai";
import { userSettingsAtom } from "@/lib/atoms";

export const Route = createFileRoute("/settings/")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const [userSettings, setUserSettings] = useAtom(userSettingsAtom);

  return (
    <div className="flex-1 bg-muted/30 text-foreground p-5 font-sans antialiased overflow-auto">
      <main className="max-w-2xl mx-auto">
        <header className="mb-8 border-b border-border/40 pb-4">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => navigate({ to: ".." })}
              className="p-1 hover:bg-muted/50 transition-colors border border-transparent hover:border-border/40"
              title="Back"
            >
              <ChevronLeft className="size-4" />
            </button>
            <h1 className="text-[11px] font-bold tracking-[0.2em] uppercase text-foreground/80 flex items-center gap-3">
              <Settings className="size-4" />
              System Settings
            </h1>
          </div>
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground/60 mt-2">
            Configure core environment parameters.
          </p>
        </header>

        {/* theme toggle */}
        <div className="space-y-8 ">
          {/* Controls Section */}
          <section>
            <div className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground/40 mb-5 flex items-center gap-2 justify-start">
              <SprayCan className="size-3" />
              <h1>Themes Controls</h1>
            </div>

            <div className="space-y-6">
              {/* Floating Toolbar Toggle */}
              <div className="flex items-center justify-between">
                <div className="flex gap-4">
                  <div className="mt-0.5">
                    <Paintbrush className="size-4 text-primary/60" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider">
                      Dark Mode
                    </p>
                    <p className="text-[10px] text-muted-foreground/60 mt-1">
                      Batman likes you.
                    </p>
                  </div>
                </div>
                <Toggle
                  active={userSettings.darkmode}
                  onClick={() =>
                    setUserSettings((prev) => ({
                      ...prev,
                      darkmode: !prev.darkmode,
                    }))
                  }
                />
              </div>
            </div>
          </section>
        </div>

        <div className="space-y-8 mt-8">
          {/* Controls Section */}
          <section>
            <h2 className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground/40 mb-5 flex items-center gap-2">
              <Shield className="size-3" /> Interface Controls
            </h2>

            <div className="space-y-6">
              {/* Floating Toolbar Toggle */}
              <div className="flex items-center justify-between">
                <div className="flex gap-4">
                  <div className="mt-0.5">
                    <LayoutTemplate className="size-4 text-primary/60" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider">
                      Floating Toolbar
                    </p>
                    <p className="text-[10px] text-muted-foreground/60 mt-1">
                      Enable a quick-access persistent HUD.
                    </p>
                  </div>
                </div>
                <Toggle
                  active={userSettings.showfloatingtoolbar}
                  onClick={() =>
                    setUserSettings((prev) => ({
                      ...prev,
                      showfloatingtoolbar: !prev.showfloatingtoolbar,
                    }))
                  }
                />
              </div>

              {/* Hide Developer Name Toggle */}
              <div className="flex items-center justify-between">
                <div className="flex gap-4">
                  <div className="mt-0.5">
                    <EyeOff className="size-4 text-primary/60" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider">
                      Hide Developer Info
                    </p>
                    <p className="text-[10px] text-muted-foreground/60 mt-1">
                      Hide developer name from footer.
                    </p>
                  </div>
                </div>
                <Toggle
                  active={userSettings.hidedevinfo}
                  onClick={() =>
                    setUserSettings((prev) => ({
                      ...prev,
                      hidedevinfo: !prev.hidedevinfo,
                    }))
                  }
                />
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

// Helper Toggle Component
function Toggle({ active, onClick }: { active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`w-8 h-4 rounded-none transition-colors relative border ${
        active ? "bg-primary border-primary" : "bg-transparent border-border"
      }`}
    >
      <div
        className={`absolute top-0.5 w-2.5 h-2.5 rounded-none transition-all ${
          active
            ? "left-4.5 bg-primary-foreground"
            : "left-0.5 bg-muted-foreground/40"
        }`}
      />
    </button>
  );
}
