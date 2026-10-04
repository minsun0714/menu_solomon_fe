import type { User } from './user'

export type TeamRole = 'ADMIN' | 'MEMBER'
export type TeamSort = 'LATEST_LUNCH' | 'NAME' | 'ACTIVE_VOTES' | 'MEMBER_COUNT'

export type Team = {
  id: string
  name: string
  description: string
}

export type TeamDetail = Team & {
  myRole: TeamRole
}

export type TeamInvite = {
  inviteCode: string
}

export type TeamMember = {
  id: string
  teamId: string
  userId: string
  role: TeamRole
  joinedAt: string
}

export type TeamMemberProfile = TeamMember & { user: User }

export type TeamSummary = Team & {
  memberCount: number
  myRole: TeamRole
  activeVoteCount: number
  latestLunch: { restaurantName: string; confirmedAt: string } | null
}

export type TeamPreview = Team & {
  memberCount: number
  members: TeamMemberProfile[]
  isAlreadyMember: boolean
}

export type TeamRequest = {
  name: string
  description: string
}
