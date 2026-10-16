import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 3, // 3 minutes fresh
        gcTime: 1000 * 60 * 5, // 5 minutes max memory garbage collection (frees memory automatically)
        refetchOnWindowFocus: false, // Prevents sudden lag spikes on tab switching
        retry: 1, // Fast failure retry
      },
    },
  });

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 1000 * 30,
  });

  return router;
};
