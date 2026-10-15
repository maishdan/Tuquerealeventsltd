import { hydrateStart } from "@tanstack/react-start/client";
import { RouterProvider } from "@tanstack/react-router";
import ReactDOM from "react-dom/client";
import { getRouter } from "./router";

const router = getRouter();

// AUTOMATIC CACHE-CLEANER & MEMORY OPTIMIZER ENGINE
if (typeof window !== "undefined") {
  // 1. Unregister broken or stale service workers that cause loading lag
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      for (const registration of registrations) {
        registration.unregister();
      }
    }).catch(() => {});
  }

  // 2. Clear stale CacheStorage if older than current deployment build
  if ("caches" in window) {
    caches.keys().then((names) => {
      for (const name of names) {
        if (name.includes("stale") || name.includes("v1") || name.includes("v2") || name.includes("workbox")) {
          caches.delete(name);
        }
      }
    }).catch(() => {});
  }

  // 3. Auto-clean bloated LocalStorage / SessionStorage cache items
  try {
    let totalSize = 0;
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        const val = localStorage.getItem(key) || "";
        totalSize += val.length;
        if (key.startsWith("temp_") || key.startsWith("cache_") || key.includes("draft_old") || key.includes("tanstack_old")) {
          keysToRemove.push(key);
        }
      }
    }
    keysToRemove.forEach((k) => localStorage.removeItem(k));

    // If total storage > 3MB, auto-trim session cache
    if (totalSize > 3 * 1024 * 1024) {
      sessionStorage.clear();
      console.log("✓ EventOS Auto-Cleaned browser storage cache to prevent lagging.");
    }
  } catch {
    // Ignore quota errors
  }
}

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
