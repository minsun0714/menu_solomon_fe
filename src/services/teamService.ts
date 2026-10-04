import { TEAM_ROLE } from '@/constants/team'
import { VOTE_STATUS } from '@/constants/vote'
import { isTeamAdmin } from '@/domain/teamRules'
import { ApiError } from '@/mocks/api/errors'
import {
  db,
  findOrThrow,
  getMyMember,
  getTeamOrThrow,
  getUserOrThrow,
  nextId,
  requireUserId,
  settleSession,
  simulateLatency,
} from '@/mocks/api/db'
import type { Restaurant } from '@/types/restaurant'
import type { Team, TeamDetail, TeamInvite, TeamMember, TeamMemberProfile, TeamPreview, TeamRequest, TeamSort, TeamSummary } from '@/types/team'

const toProfile = (member: TeamMember): TeamMemberProfile => ({ ...member, user: getUserOrThrow(member.userId) })

const generateInviteCode = (name: string) =>
  `${name.replace(/\s+/g, '-').toLowerCase()}-${Math.random().toString(36).slice(2, 6)}`

const findTeamByInviteCode = (inviteCode: string) =>
  db.teams.find(({ id }) => db.inviteCodes[id] === inviteCode)

function getLatestLunch(teamId: string): TeamSummary['latestLunch'] {
  const sessionIds = db.sessions.filter((s) => s.teamId === teamId).map(({ id }) => id)
  const [latest] = db.decisions
    .filter(({ sessionId }) => sessionIds.includes(sessionId))
    .sort((a, b) => b.confirmedAt.localeCompare(a.confirmedAt))
  if (!latest) return null
  const restaurant: Restaurant | undefined = db.restaurants.find(({ id }) => id === latest.restaurantId)
  return restaurant ? { restaurantName: restaurant.name, confirmedAt: latest.confirmedAt } : null
}

export const teamService = {
  getMyTeams(sort: TeamSort = 'LATEST_LUNCH'): Promise<TeamSummary[]> {
    return simulateLatency(() => {
      const userId = requireUserId()
      const teams = db.members
        .filter((member) => member.userId === userId)
        .map((member) => {
          const team = getTeamOrThrow(member.teamId)
          const teamSessions = db.sessions.filter(({ teamId }) => teamId === team.id)
          teamSessions.forEach(({ id }) => settleSession(id))
          return {
            ...team,
            memberCount: db.members.filter(({ teamId }) => teamId === team.id).length,
            myRole: member.role,
            activeVoteCount: teamSessions.filter(({ status }) => status === VOTE_STATUS.OPEN).length,
            latestLunch: getLatestLunch(team.id),
          }
        })
      return teams.sort((a, b) => {
        if (sort === 'NAME') return a.name.localeCompare(b.name, 'ko')
        if (sort === 'ACTIVE_VOTES') return b.activeVoteCount - a.activeVoteCount || a.name.localeCompare(b.name, 'ko')
        if (sort === 'MEMBER_COUNT') return b.memberCount - a.memberCount || a.name.localeCompare(b.name, 'ko')
        const aTime = a.latestLunch ? new Date(a.latestLunch.confirmedAt).getTime() : 0
        const bTime = b.latestLunch ? new Date(b.latestLunch.confirmedAt).getTime() : 0
        return bTime - aTime || a.name.localeCompare(b.name, 'ko')
      })
    })
  },

  getTeam(teamId: string): Promise<TeamDetail> {
    return simulateLatency(() => {
      const team = getTeamOrThrow(teamId)
      const me = getMyMember(teamId)
      return { ...team, myRole: me.role }
    })
  },

  getTeamByInviteCode(inviteCode: string): Promise<TeamPreview> {
    return simulateLatency(() => {
      const team = findOrThrow(
        findTeamByInviteCode(inviteCode),
        '유효하지 않은 초대 링크입니다.',
      )
      const members = db.members.filter(({ teamId }) => teamId === team.id).map(toProfile)
      const isAlreadyMember = db.members.some((member) => member.teamId === team.id && member.userId === db.currentUserId)
      return { ...team, memberCount: members.length, members, isAlreadyMember }
    })
  },

  getTeamMembers(teamId: string): Promise<TeamMemberProfile[]> {
    return simulateLatency(() => {
      getTeamOrThrow(teamId)
      getMyMember(teamId)
      return db.members.filter((member) => member.teamId === teamId).map(toProfile)
    })
  },

  createTeam({ name, description }: TeamRequest): Promise<Team> {
    return simulateLatency(() => {
      const userId = requireUserId()
      const team: Team = { id: nextId('t'), name, description }
      db.teams.push(team)
      db.inviteCodes[team.id] = generateInviteCode(name)
      db.members.push({ id: nextId('m'), teamId: team.id, userId, role: TEAM_ROLE.ADMIN, joinedAt: new Date().toISOString() })
      return team
    })
  },

  getTeamInvite(teamId: string): Promise<TeamInvite> {
    return simulateLatency(() => {
      getMyMember(teamId)
      return { inviteCode: db.inviteCodes[getTeamOrThrow(teamId).id] }
    })
  },

  joinTeam(inviteCode: string): Promise<TeamMember> {
    return simulateLatency(() => {
      const userId = requireUserId()
      const { id: teamId } = findOrThrow(findTeamByInviteCode(inviteCode), '유효하지 않거나 만료된 초대 링크입니다.')
      const existing = db.members.find((m) => m.teamId === teamId && m.userId === userId)
      if (existing) throw new ApiError('CONFLICT', '이미 참여 중인 팀입니다.')
      const member: TeamMember = { id: nextId('m'), teamId, userId, role: TEAM_ROLE.MEMBER, joinedAt: new Date().toISOString() }
      db.members.push(member)
      return member
    })
  },

  updateTeam(teamId: string, request: TeamRequest): Promise<Team> {
    return simulateLatency(() => {
      const team = getTeamOrThrow(teamId)
      if (!isTeamAdmin(getMyMember(teamId))) throw new ApiError('FORBIDDEN', '관리자만 수정할 수 있습니다.')
      Object.assign(team, request)
      return team
    })
  },

  leaveTeam(teamId: string): Promise<void> {
    return simulateLatency(() => {
      const me = getMyMember(teamId)
      const others = db.members.filter((m) => m.teamId === teamId && m.id !== me.id)
      if (isTeamAdmin(me) && others.length > 0) throw new ApiError('CONFLICT', '관리자를 먼저 위임해 주세요.')
      db.members = db.members.filter(({ id }) => id !== me.id)
      if (others.length === 0) {
        db.teams = db.teams.filter(({ id }) => id !== teamId)
        delete db.inviteCodes[teamId]
      }
    })
  },

  transferAdmin(teamId: string, memberId: string): Promise<void> {
    return simulateLatency(() => {
      const me = getMyMember(teamId)
      if (!isTeamAdmin(me)) throw new ApiError('FORBIDDEN', '관리자만 위임할 수 있습니다.')
      const target = findOrThrow(db.members.find((m) => m.id === memberId && m.teamId === teamId), '멤버를 찾을 수 없습니다.')
      me.role = TEAM_ROLE.MEMBER
      target.role = TEAM_ROLE.ADMIN
    })
  },

  transferAdminAndLeave(teamId: string, memberId: string): Promise<void> {
    return simulateLatency(() => {
      const me = getMyMember(teamId)
      if (!isTeamAdmin(me)) throw new ApiError('FORBIDDEN', '관리자만 권한을 위임할 수 있습니다.')
      const target = findOrThrow(db.members.find((m) => m.id === memberId && m.teamId === teamId), '멤버를 찾을 수 없습니다.')
      if (target.id === me.id) throw new ApiError('CONFLICT', '본인에게 관리자 권한을 위임할 수 없습니다.')
      target.role = TEAM_ROLE.ADMIN
      db.members = db.members.filter(({ id }) => id !== me.id)
    })
  },

  regenerateInviteCode(teamId: string): Promise<TeamInvite> {
    return simulateLatency(() => {
      const team = getTeamOrThrow(teamId)
      if (!isTeamAdmin(getMyMember(teamId))) throw new ApiError('FORBIDDEN', '관리자만 재발급할 수 있습니다.')
      const inviteCode = generateInviteCode(team.name)
      db.inviteCodes[teamId] = inviteCode
      return { inviteCode }
    })
  },

  deleteTeam(teamId: string): Promise<void> {
    return simulateLatency(() => {
      if (!isTeamAdmin(getMyMember(teamId))) throw new ApiError('FORBIDDEN', '관리자만 삭제할 수 있습니다.')
      db.teams = db.teams.filter(({ id }) => id !== teamId)
      db.members = db.members.filter((m) => m.teamId !== teamId)
      delete db.inviteCodes[teamId]
    })
  },

}
