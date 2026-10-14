import { hydrateStart } from "@tanstack/react-start/client";
import { RouterProvider } from "@tanstack/react-router";
import ReactDOM from "react-dom/client";
import { getRouter } from "./router";

const router = getRouter();

if (typeof window !== "undefined") {
  const rootElement = document.getElementById("root");
  if (rootElement) {
    if (!rootElement.innerHTML || rootElement.innerHTML.trim().length === 0) {
      ReactDOM.createRoot(rootElement).render(<RouterProvider router={router} />);
    } else {
      try {
        hydrateStart();
      } catch (err) {
        console.warn("SSR Hydration warning, falling back to client render:", err);
        ReactDOM.createRoot(rootElement).render(<RouterProvider router={router} />);
      }
    }
  } else {
    try {
      hydrateStart();
    } catch {
      // Fallback
    }
  }
}
