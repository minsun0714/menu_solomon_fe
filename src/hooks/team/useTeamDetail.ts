import { useLeaveTeamMutation, useTransferAdminMutation } from './mutations/useTeamMutations'
import { buildInviteUrl } from '@/domain/teamRules'
import { useTeamDetailQuery } from './queries/useTeamDetailQuery'
import { useTeamInviteQuery } from './queries/useTeamInviteQuery'
import { useTeamPermissions } from './useTeamPermissions'

export function useTeamDetail(teamId: string) {
  const { data: team, isLoading: isTeamLoading, isError } = useTeamDetailQuery(teamId)
  const permissions = useTeamPermissions(teamId)
  const { data: invite } = useTeamInviteQuery(teamId, permissions.isMember)
  const { mutate: leave, isPending: isLeaving } = useLeaveTeamMutation(teamId)
  const { mutate: transfer, isPending: isTransferring } = useTransferAdminMutation(teamId)

  const leaveTeam = (onLeft?: () => void) => leave(undefined, { onSuccess: onLeft })
  const transferAdmin = (memberId: string) => transfer(memberId)

  return {
    team,
    inviteUrl: invite ? buildInviteUrl(invite.inviteToken) : undefined,
    ...permissions,
    isLoading: isTeamLoading || permissions.isLoading,
    isError,
    isLeaving,
    isTransferring,
    leaveTeam,
    transferAdmin,
  }
}
