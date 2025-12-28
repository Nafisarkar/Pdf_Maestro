import { Outlet, createRootRoute } from "@tanstack/react-router";
import Navbar from "@/components/Navbar";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <div className="w-full h-screen flex flex-col bg-muted/30 overflow-hidden font-sans antialiased min-w-100">
      <Navbar />
      <Outlet />
    </div>
  );
}
