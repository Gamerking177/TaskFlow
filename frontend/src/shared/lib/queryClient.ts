import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2, // 2 minutes stale time
      refetchOnWindowFocus: false, // Prevent re-fetching when shifting browser focus
      retry: 1, // Retry failed queries once before throwing
    },
  },
});

export default queryClient;
