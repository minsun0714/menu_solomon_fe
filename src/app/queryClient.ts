import { QueryClient } from '@tanstack/react-query'
import { QUERY_STALE_TIME_MS } from '@/constants/config'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: QUERY_STALE_TIME_MS,
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
})
