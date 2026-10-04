import { TEAM_ROLE } from '@/constants/team'
import type { TeamMember } from '@/types/team'

export function isTeamAdmin(member: TeamMember | undefined): boolean {
  return member?.role === TEAM_ROLE.ADMIN
}

export function canManageTeam(member: TeamMember | undefined): boolean {
  return isTeamAdmin(member)
}

export function requiresAdminTransfer(members: TeamMember[], member: TeamMember | undefined): boolean {
  if (!member || !isTeamAdmin(member)) return false
  return members.some(({ id }) => id !== member.id)
}

export function canLeaveTeam(members: TeamMember[], member: TeamMember | undefined): boolean {
  return members.length > 0 && Boolean(member)
}
