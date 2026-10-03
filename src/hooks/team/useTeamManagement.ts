import { useDeleteTeamMutation, useRegenerateInviteCodeMutation, useUpdateTeamMutation } from './mutations/useTeamMutations'
import type { TeamRequest } from '@/types/team'

export function useTeamManagement(teamId: string) {
  const { mutate: update, isPending: isUpdating } = useUpdateTeamMutation(teamId)
  const { mutate: regenerate, isPending: isRegenerating } = useRegenerateInviteCodeMutation(teamId)
  const { mutate: remove, isPending: isDeleting } = useDeleteTeamMutation(teamId)

  return {
    isUpdating,
    isRegenerating,
    isDeleting,
    updateTeam: (request: TeamRequest) => update(request),
    regenerateInviteCode: () => regenerate(),
    deleteTeam: (onDeleted?: () => void) => remove(undefined, { onSuccess: onDeleted }),
  }
}
