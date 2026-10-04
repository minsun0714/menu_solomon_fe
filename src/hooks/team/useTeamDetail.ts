import { useLeaveTeamMutation, useTransferAdminAndLeaveMutation, useTransferAdminMutation } from './mutations/useTeamMutations'
import { useTeamDetailQuery } from './queries/useTeamDetailQuery'
import { useTeamInviteQuery } from './queries/useTeamInviteQuery'
import { useTeamPermissions } from './useTeamPermissions'

export function useTeamDetail(teamId: string) {
  const { data: team, isLoading: isTeamLoading, isError } = useTeamDetailQuery(teamId)
  const permissions = useTeamPermissions(teamId)
  const { data: invite } = useTeamInviteQuery(teamId, permissions.isMember)
  const { mutate: leave, isPending: isLeaving } = useLeaveTeamMutation(teamId)
  const { mutate: transfer, isPending: isTransferring } = useTransferAdminMutation(teamId)
  const { mutate: transferAndLeave, isPending: isTransferLeaving } = useTransferAdminAndLeaveMutation(teamId)

  const leaveTeam = (onLeft?: () => void) => leave(undefined, { onSuccess: onLeft })
  const transferAdmin = (memberId: string) => transfer(memberId)
  const transferAdminAndLeave = (memberId: string, onLeft?: () => void) =>
    transferAndLeave(memberId, { onSuccess: onLeft })

  return {
    team,
    inviteLink: invite?.inviteUrl,
    ...permissions,
    isLoading: isTeamLoading || permissions.isLoading,
    isError,
    isLeaving: isLeaving || isTransferLeaving,
    isTransferring,
    leaveTeam,
    transferAdmin,
    transferAdminAndLeave,
  }
}
