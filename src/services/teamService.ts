import { api } from '@/lib/api'
import { toNumericId } from '@/lib/ids'
import type {
  Team,
  TeamDetail,
  TeamInvite,
  TeamMember,
  TeamMemberProfile,
  TeamPreview,
  TeamRequest,
  TeamRole,
  TeamSummary,
} from '@/types/team'

type TeamSummaryResponse = {
  teamId: string
  name: string
  description: string
  myRole: TeamRole
  memberCount: number
}

type TeamMemberResponse = {
  teamMemberId: string
  userId: string
  nickname: string
  role: TeamRole
  joinedAt: string
  isMe: boolean
}

type InvitationResponse = {
  teamId: string
  name: string
  description: string
  memberCount: number
  isAlreadyMember: boolean
  members: { id: string; role: TeamRole; joinedAt: string; user: { id: string; nickname: string } }[]
}

type CreatedTeamResponse = Team & { myRole: TeamRole; inviteUrl: string }

export const teamService = {
  async getMyTeams(): Promise<TeamSummary[]> {
    const teams = await api.get<TeamSummaryResponse[]>('/teams')
    return teams.map(({ teamId, ...rest }) => ({ id: teamId, ...rest }))
  },

  getTeam(teamId: string): Promise<TeamDetail> {
    return api.get<TeamDetail>(`/teams/${teamId}`)
  },

  async getTeamByInviteCode(inviteToken: string): Promise<TeamPreview> {
    const { teamId, members, ...rest } = await api.get<InvitationResponse>(`/invitations/${inviteToken}`)
    return {
      ...rest,
      id: teamId,
      members: members.map((member) => ({ ...member, teamId, userId: member.user.id })),
    }
  },

  async getTeamMembers(teamId: string): Promise<TeamMemberProfile[]> {
    const members = await api.get<TeamMemberResponse[]>(`/teams/${teamId}/members`)
    return members.map(({ teamMemberId, userId, nickname, role, joinedAt, isMe }) => ({
      id: teamMemberId,
      teamId,
      userId,
      role,
      joinedAt,
      isMe,
      user: { id: userId, nickname },
    }))
  },

  createTeam({ name, description }: TeamRequest): Promise<CreatedTeamResponse> {
    return api.post<CreatedTeamResponse>('/teams', { name, description })
  },

  getTeamInvite(teamId: string): Promise<TeamInvite> {
    return api.get<TeamInvite>(`/teams/${teamId}/invitation`)
  },

  joinTeam(inviteToken: string): Promise<TeamMember> {
    return api.post<TeamMember>(`/invitations/${inviteToken}/join`)
  },

  updateTeam(teamId: string, request: TeamRequest): Promise<Team> {
    return api.patch<Team>(`/teams/${teamId}`, request)
  },

  leaveTeam(teamId: string): Promise<void> {
    return api.delete(`/teams/${teamId}/members/me`)
  },

  async transferAdmin(teamId: string, memberId: string): Promise<void> {
    await api.post(`/teams/${teamId}/admin-transfer`, { targetTeamMemberId: toNumericId(memberId) })
  },

  transferAdminAndLeave(teamId: string, memberId: string): Promise<void> {
    return api.post(`/teams/${teamId}/transfer-and-leave`, { targetTeamMemberId: toNumericId(memberId) })
  },

  regenerateInviteCode(teamId: string): Promise<TeamInvite> {
    return api.post<TeamInvite>(`/teams/${teamId}/invitation/regenerate`)
  },

  deleteTeam(teamId: string): Promise<void> {
    return api.delete(`/teams/${teamId}`)
  },
}
