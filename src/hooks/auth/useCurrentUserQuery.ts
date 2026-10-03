import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/queries/queryKeys'
import { authService } from '@/services/authService'

export function useCurrentUserQuery() {
  return useQuery({ queryKey: queryKeys.auth.me, queryFn: authService.getCurrentUser })
}
