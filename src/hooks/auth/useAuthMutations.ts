import { TOAST_MESSAGES } from '@/constants/messages'
import { queryKeys } from '@/queries/queryKeys'
import { authService } from '@/services/authService'
import { useAppMutation } from '@/hooks/shared/useAppMutation'

export function useLoginMutation() {
  return useAppMutation({
    mutationFn: authService.login,
    invalidateKeys: () => [queryKeys.auth.me, queryKeys.team.all, queryKeys.vote.all],
    successMessage: TOAST_MESSAGES.LOGGED_IN,
  })
}

export function useLogoutMutation() {
  return useAppMutation({
    mutationFn: authService.logout,
    invalidateKeys: () => [queryKeys.auth.me, queryKeys.team.all, queryKeys.vote.all],
  })
}
