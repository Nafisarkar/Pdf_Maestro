import { getCurrentWindow } from "@tauri-apps/api/window";

const appWindow = getCurrentWindow();

function WindowControls() {
  return (
    <div className="flex items-center h-8">
      <button
        onClick={() => appWindow.minimize()}
        className="group flex items-center justify-center w-11 h-8 transition-colors hover:bg-muted/80"
        title="Minimize"
      >
        <svg
          width="10"
          height="1"
          viewBox="0 0 10 1"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="stroke-muted-foreground group-hover:stroke-foreground transition-colors"
        >
          <path d="M0 0.5H10" strokeWidth="1" />
        </svg>
      </button>

      <button
        onClick={() => appWindow.toggleMaximize()}
        className="group flex items-center justify-center w-11 h-8 transition-colors hover:bg-muted/80"
        title="Maximize"
      >
        <svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="stroke-muted-foreground group-hover:stroke-foreground transition-colors"
        >
          <rect x="0.5" y="0.5" width="9" height="9" strokeWidth="1" />
        </svg>
      </button>

      <button
        onClick={() => appWindow.close()}
        className="group flex items-center justify-center w-11 h-8 transition-colors hover:bg-destructive hover:text-destructive-foreground"
        title="Close"
      >
        <svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="stroke-muted-foreground group-hover:stroke-white transition-colors"
        >
          <path d="M1 1L9 9M9 1L1 9" strokeWidth="1" />
        </svg>
      </button>
    </div>
  );
}

export default WindowControls;
