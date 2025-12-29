import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { open } from "@tauri-apps/plugin-shell";
import {
  Settings,
  Shield,
  EyeOff,
  LayoutTemplate,
  ChevronLeft,
  SprayCan,
  Paintbrush,
  Code2,
  Github,
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
        <header className="mb-8  border-border/40 ">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => navigate({ to: ".." })}
              className="p-1 hover:bg-muted/50 transition-colors border border-transparent hover:border-border/40"
              title="Back"
            >
              <ChevronLeft className="size-4" />
            </button>
            <h1 className="text-[11px] font-bold tracking-[0.2em] uppercase text-foreground flex items-center gap-3">
              <Settings className="size-4" />
              System Settings
            </h1>
          </div>
        </header>

        {/* theme toggle */}
        <div className="space-y-8 ">
          {/* Controls Section */}
          <section>
            <div className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground/70 mb-5 flex items-center gap-2 justify-start">
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
                    <p className="text-[10px] text-muted-foreground/80 mt-1">
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
            <h2 className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground/70 mb-5 flex items-center gap-2">
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
                      Hide Top Toolbar
                    </p>
                    <p className="text-[10px] text-muted-foreground/80 mt-1">
                      Enable a tools HUD.
                    </p>
                  </div>
                </div>
                <Toggle
                  active={userSettings.hidetoptoolbar}
                  onClick={() =>
                    setUserSettings((prev) => ({
                      ...prev,
                      hidetoptoolbar: !prev.hidetoptoolbar,
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
                    <p className="text-[10px] text-muted-foreground/80 mt-1">
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

        {/* Developer Card Section */}
        <div
          className="mt-12 pt-8 border-t border-border/40"
          onClick={() => open("https://github.com/Nafisarkar")}
        >
          <section>
            <h2 className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground/70 mb-5 flex items-center gap-2">
              <Code2 className="size-3" /> Developer Profile
            </h2>
            <div className="bg-muted/50 border border-border/60 p-6 rounded-sm">
              <div className="flex items-start gap-6">
                <div className="size-16 bg-primary/5 border border-primary/10 flex items-center justify-center rounded-sm shrink-0">
                  <img
                    src="https://avatars.githubusercontent.com/u/41770461?v=4"
                    alt="Developer Avatar"
                    className="size-14 rounded-sm"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">
                    Shaon An Nafi
                  </h3>
                  <p className="text-[10px] text-muted-foreground/80 mt-1 leading-relaxed">
                    Building minimalist tools for the modern web. If you find
                    this project useful, please support the development by
                    giving it a star on GitHub.
                  </p>
                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={() =>
                        open("https://github.com/Nafisarkar/Pdf_Maestro")
                      }
                      className="flex items-center gap-2 px-3 py-1.5 bg-background border border-border/40 hover:border-primary/40 transition-colors text-[9px] font-bold uppercase tracking-widest text-muted-foreground hover:text-primary"
                    >
                      <Github className="size-3" />
                      Star on GitHub
                    </button>
                  </div>
                </div>
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
