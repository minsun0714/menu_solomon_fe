import { useAppMutation } from '@/hooks/shared/useAppMutation'
import { queryKeys } from '@/queries/queryKeys'
import { authService } from '@/services/authService'

export function useUpdateNicknameMutation() {
  return useAppMutation({
    mutationFn: (nickname: string) => authService.updateNickname(nickname),
    invalidateKeys: () => [
      queryKeys.auth.me,
      queryKeys.team.all,
      queryKeys.restaurant.all,
      queryKeys.review.all,
      queryKeys.vote.all,
      queryKeys.history.all,
    ],
  })
}
