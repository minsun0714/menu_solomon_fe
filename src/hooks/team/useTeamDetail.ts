import { useLeaveTeamMutation, useTransferAdminMutation } from './mutations/useTeamMutations'
import { useTeamDetailQuery } from './queries/useTeamDetailQuery'
import { useTeamPermissions } from './useTeamPermissions'

export function useTeamDetail(teamId: string) {
  const { data: team, isLoading: isTeamLoading, isError } = useTeamDetailQuery(teamId)
  const permissions = useTeamPermissions(teamId)
  const { mutate: leave, isPending: isLeaving } = useLeaveTeamMutation(teamId)
  const { mutate: transfer, isPending: isTransferring } = useTransferAdminMutation(teamId)

  const leaveTeam = (onLeft?: () => void) => leave(undefined, { onSuccess: onLeft })
  const transferAdmin = (memberId: string) => transfer(memberId)

  return {
    team,
    ...permissions,
    isLoading: isTeamLoading || permissions.isLoading,
    isError,
    isLeaving,
    isTransferring,
    leaveTeam,
    transferAdmin,
  }
}
