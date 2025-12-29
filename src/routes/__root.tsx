import { Outlet, createRootRoute } from "@tanstack/react-router";
import Navbar from "@/components/Navbar";
import { useAtomValue } from "jotai";
import { userSettingsAtom } from "@/lib/atoms";
import { useEffect } from "react";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  const userSavedSettings = useAtomValue(userSettingsAtom);

  useEffect(() => {
    if (userSavedSettings.darkmode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [userSavedSettings.darkmode]);

  // desable devtools in production
  document.addEventListener("contextmenu", (e) => {
    e.preventDefault();
  });

  return (
    <div className="w-full h-screen flex flex-col bg-muted/50 dark:bg-muted/30 overflow-hidden font-sans antialiased min-w-100">
      <Navbar />
      <Outlet />
    </div>
  );
}
