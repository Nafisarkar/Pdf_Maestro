import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { routeTree } from "./routeTree.gen";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { pdfjs } from "react-pdf";

// Ensure PDF.js worker loads correctly in production (Tauri)
const workerUrl = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
);
pdfjs.GlobalWorkerOptions.workerPort = new Worker(workerUrl, {
  type: "module",
});

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
