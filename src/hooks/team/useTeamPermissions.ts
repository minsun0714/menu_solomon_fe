import { canLeaveTeam, canManageTeam, requiresAdminTransfer } from '@/domain/teamRules'
import { useTeamMembersQuery } from './queries/useTeamMembersQuery'

export function useTeamPermissions(teamId: string) {
  const { data: members = [], isLoading } = useTeamMembersQuery(teamId)

  const currentMember = members.find(({ isMe }) => isMe)

  return {
    members,
    currentMember,
    isMember: currentMember !== undefined,
    isAdmin: canManageTeam(currentMember),
    canLeave: canLeaveTeam(members, currentMember),
    requiresAdminTransfer: requiresAdminTransfer(members, currentMember),
    isLoading,
  }
}
